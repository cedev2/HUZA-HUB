import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Users, CheckCircle2, XCircle, Clock3, ChevronDown, Search,
  User, FileText, Briefcase, Inbox, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.07 } }
};

const STATUS_CONFIG = {
  pending: {
    label: 'Under Review',
    icon: Clock3,
    bg: 'bg-amber-50 ',
    text: 'text-amber-600 ',
    border: 'border-amber-200 ',
    dot: 'bg-amber-500',
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle2,
    bg: 'bg-emerald-50 ',
    text: 'text-emerald-600 ',
    border: 'border-emerald-200 ',
    dot: 'bg-emerald-500',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    bg: 'bg-red-50 ',
    text: 'text-red-500 ',
    border: 'border-red-200 ',
    dot: 'bg-red-500',
  },
};

function StatusDropdown({ appId, currentStatus, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const cfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;

  const handleSelect = async (newStatus) => {
    if (newStatus === currentStatus) { setOpen(false); return; }
    setLoading(true);
    setOpen(false);
    try {
      await api.patch('/applications', { application_id: appId, status: newStatus });
      onUpdate(appId, newStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update application status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all
          ${cfg.bg} ${cfg.text} ${cfg.border} hover:opacity-80`}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <StatusIcon className="w-3.5 h-3.5" />
        )}
        {cfg.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 bg-white  border border-slate-200  rounded-2xl shadow-xl py-2 z-50 min-w-[160px]"
          >
            {Object.entries(STATUS_CONFIG).map(([key, s]) => {
              const Icon = s.icon;
              return (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-left transition-colors hover:bg-slate-50
                    ${key === currentStatus ? s.text : 'text-slate-600 '}`}
                >
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  {s.label}
                  {key === currentStatus && <span className="ml-auto text-[10px] opacity-60">current</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close dropdown */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}

export default function CompanyApplicants() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get('/applications');
        setApplications(res.data);
      } catch (err) {
        console.error('Failed to fetch applicants:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  const handleStatusUpdate = (appId, newStatus) => {
    setApplications(prev =>
      prev.map(app => app.id === appId ? { ...app, status: newStatus } : app)
    );
  };

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const filtered = applications
    .filter(a => filter === 'all' || a.status === filter)
    .filter(a =>
      !search ||
      a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.title?.toLowerCase().includes(search.toLowerCase())
    );

  const filters = [
    { key: 'all', label: 'All Applicants', count: counts.all },
    { key: 'pending', label: 'Under Review', count: counts.pending, color: 'text-amber-500' },
    { key: 'accepted', label: 'Accepted', count: counts.accepted, color: 'text-emerald-500' },
    { key: 'rejected', label: 'Rejected', count: counts.rejected, color: 'text-red-500' },
  ];

  return (
    <div className="flex bg-slate-50  min-h-screen font-inter relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-emerald-400/5 rounded-full blur-[100px] -mr-60 -mt-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[35rem] h-[35rem] bg-blue-400/5 rounded-full blur-[100px] -ml-60 -mb-60 pointer-events-none" />

      <Sidebar role="company" />
      <main className="flex-1 ml-64 p-10 relative z-10">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900  font-outfit tracking-tight">
                Applicants
              </h1>
            </div>
            <p className="text-slate-500  ml-[3.25rem]">
              Review and manage candidates for your internship postings
            </p>
          </div>
        </motion.header>

        {/* Stats Row */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-4 gap-5 mb-8"
        >
          {[
            { label: 'Total Applicants', value: counts.all, icon: Users, color: 'grad-blue', shadow: 'shadow-blue-500/20' },
            { label: 'Under Review', value: counts.pending, icon: Clock3, color: 'bg-amber-500', shadow: 'shadow-amber-500/20' },
            { label: 'Accepted', value: counts.accepted, icon: CheckCircle2, color: 'bg-emerald-500', shadow: 'shadow-emerald-500/20' },
            { label: 'Rejected', value: counts.rejected, icon: XCircle, color: 'bg-red-500', shadow: 'shadow-red-500/20' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="glass-card p-5 rounded-[2rem] flex items-center gap-4 bg-white/60  backdrop-blur-xl border border-white/50 "
              >
                <div className={`w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center shadow-lg ${s.shadow} flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900  font-outfit">{s.value}</p>
                  <p className="text-[10px] font-black text-slate-400  uppercase tracking-widest">{s.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between gap-4 mb-6"
        >
          {/* Filter tabs */}
          <div className="flex items-center gap-2 bg-white/60  backdrop-blur-xl border border-white/50  p-1.5 rounded-2xl shadow-sm">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2
                  ${filter === f.key
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-500 hover:text-slate-800'}`}
              >
                {f.label}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md
                  ${filter === f.key ? 'bg-white/20 text-white' : `bg-slate-100  ${f.color || 'text-slate-500'}`}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-5 py-2.5 bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-64"
            />
          </div>
        </motion.div>

        {/* Applicants Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mb-4"
            />
            <p className="text-slate-500 font-semibold">Loading applicants...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-32 text-center"
          >
            <div className="w-20 h-20 bg-slate-100  rounded-full flex items-center justify-center mb-5">
              <Inbox className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700  font-outfit mb-2">
              No applicants found
            </h3>
            <p className="text-slate-500">Try changing your filter or search query.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="glass-card rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white/50"
          >
            {/* Table Header */}
            <div className="px-8 py-4 border-b border-slate-100 bg-white/50 grid grid-cols-12 gap-4 items-center rounded-t-[2.5rem]">
              <p className="col-span-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</p>
              <p className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Applied</p>
              <p className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied On</p>
              <p className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</p>
            </div>

            <div className="divide-y divide-slate-100/50">
              {filtered.map((app, index) => {
                const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                return (
                  <div
                    key={app.id}
                    style={{ zIndex: 100 - index }}
                    className="relative px-8 py-5 grid grid-cols-12 gap-4 items-center hover:bg-white/40 transition-colors group"
                  >
                    {/* Candidate */}
                    <div className="col-span-4 flex items-center gap-4">
                      <div className="w-11 h-11 grad-blue rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow">
                        {app.full_name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900  text-sm">{app.full_name || 'Unknown Applicant'}</p>
                        {app.cover_letter && (
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <FileText className="w-2.5 h-2.5" /> Has cover letter
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Role */}
                    <div className="col-span-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <p className="text-sm font-semibold text-slate-700  truncate">{app.title}</p>
                    </div>

                    {/* Date */}
                    <div className="col-span-2">
                      <p className="text-sm text-slate-500 ">
                        {new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Status Dropdown */}
                    <div className="col-span-3 flex justify-end">
                      <StatusDropdown
                        appId={app.id}
                        currentStatus={app.status}
                        onUpdate={handleStatusUpdate}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
