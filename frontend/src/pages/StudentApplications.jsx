import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Briefcase, MapPin, Clock, CalendarDays, CheckCircle2,
  XCircle, Clock3, ChevronRight, Inbox, ArrowRight, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } }
};

const STATUS_CONFIG = {
  pending: {
    label: 'Under Review',
    icon: Clock3,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    bar: 'bg-amber-400',
    glow: 'shadow-amber-500/20',
  },
  accepted: {
    label: 'Accepted! 🎉',
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    bar: 'bg-emerald-500',
    glow: 'shadow-emerald-500/20',
  },
  rejected: {
    label: 'Not Selected',
    icon: XCircle,
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
    bar: 'bg-red-400',
    glow: 'shadow-red-500/20',
  },
};

const STEPS = [
  { key: 'applied', label: 'Applied' },
  { key: 'review', label: 'Under Review' },
  { key: 'decision', label: 'Decision' },
];

function ProgressTracker({ status }) {
  const stepIndex = status === 'pending' ? 1 : 2;
  return (
    <div className="flex items-center gap-0 mt-4">
      {STEPS.map((step, i) => {
        const done = i <= stepIndex;
        const current = i === stepIndex;
        const cfg = current ? STATUS_CONFIG[status] : null;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all font-bold text-xs
                  ${done
                    ? current
                      ? `${cfg.bg} ${cfg.border} ${cfg.text}`
                      : 'bg-emerald-500 border-emerald-500 text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
              >
                {done && !current ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </motion.div>
              <p className={`text-[9px] font-bold mt-1 uppercase tracking-wider
                ${done ? (current ? cfg.text : 'text-emerald-500') : 'text-slate-400'}`}>
                {step.label}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 rounded-full transition-all
                ${i < stepIndex ? 'bg-emerald-400' : 'bg-slate-200'}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications');
        setApplications(res.data);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const filtered = filter === 'all'
    ? applications
    : applications.filter(a => a.status === filter);

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const filters = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'pending', label: 'Under Review', count: counts.pending, color: 'text-amber-500' },
    { key: 'accepted', label: 'Accepted', count: counts.accepted, color: 'text-emerald-500' },
    { key: 'rejected', label: 'Rejected', count: counts.rejected, color: 'text-red-500' },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen font-inter relative overflow-hidden transition-colors duration-300">
      {/* Background glow blobs */}
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-blue-400/5 rounded-full blur-[100px] -mr-60 -mt-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[35rem] h-[35rem] bg-emerald-400/5 rounded-full blur-[100px] -ml-60 -mb-60 pointer-events-none" />

      <Sidebar role="student" />
      <main className="flex-1 ml-64 p-10 relative z-10">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 grad-blue rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 font-outfit tracking-tight">
              My Applications
            </h1>
          </div>
          <p className="text-slate-600 ml-[3.25rem]">
            Track your internship application progress in real-time
          </p>
        </motion.header>

        {/* Summary Stats */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-4 gap-5 mb-8"
        >
          {[
            { label: 'Total Applied', value: counts.all, color: 'grad-blue', shadow: 'shadow-blue-500/20' },
            { label: 'Under Review', value: counts.pending, color: 'bg-amber-500', shadow: 'shadow-amber-500/20' },
            { label: 'Accepted', value: counts.accepted, color: 'bg-emerald-500', shadow: 'shadow-emerald-500/20' },
            { label: 'Not Selected', value: counts.rejected, color: 'bg-red-500', shadow: 'shadow-red-500/20' },
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white p-5 rounded-[2rem] flex items-center gap-4 border border-slate-200 shadow-sm"
            >
              <div className={`w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center shadow-lg ${s.shadow}`}>
                <span className="text-white font-black text-lg">{s.value}</span>
              </div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest leading-tight">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-8 bg-white border border-slate-200 p-1.5 rounded-2xl w-fit shadow-sm"
        >
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2
                ${filter === f.key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-500 hover:text-slate-800'}`}
            >
              {f.label}
              <span className={`text-xs font-black px-1.5 py-0.5 rounded-md
                ${filter === f.key ? 'bg-white/20 text-white' : `bg-slate-100 ${f.color || 'text-slate-500'}`}`}>
                {f.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Applications List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
            />
            <p className="text-slate-500 font-semibold">Loading your applications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-5">
              <Inbox className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 font-outfit mb-2">
              {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
            </h3>
            <p className="text-slate-600 max-w-sm">
              {filter === 'all'
                ? 'Go to the Feed to explore and apply for internship opportunities.'
                : 'Try switching to a different filter above.'}
            </p>
            {filter === 'all' && (
              <motion.a
                href="/student"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 btn-primary py-3 px-8 flex items-center gap-2"
              >
                Explore Internships <ArrowRight className="w-4 h-4" />
              </motion.a>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            <AnimatePresence>
              {filtered.map((app) => {
                const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                const StatusIcon = cfg.icon;
                const isOpen = expanded === app.id;

                return (
                  <motion.div
                    key={app.id}
                    variants={fadeInUp}
                    layout
                    className={`bg-white border rounded-[2rem] overflow-hidden shadow-sm transition-all
                      ${isOpen ? `border-2 ${cfg.border} shadow-lg ${cfg.glow}` : 'border-slate-200 hover:shadow-md'}`}
                  >
                    {/* Card header - always visible */}
                    <div
                      className="p-7 flex items-center justify-between cursor-pointer group"
                      onClick={() => setExpanded(isOpen ? null : app.id)}
                    >
                      <div className="flex items-center gap-6">
                        {/* Company avatar */}
                        <div className={`w-16 h-16 grad-blue rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-black text-xl flex-shrink-0`}>
                          {app.company_name?.charAt(0).toUpperCase() || 'C'}
                        </div>

                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-bold text-slate-900 font-outfit">
                              {app.title}
                            </h3>
                            {/* Live status badge */}
                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${app.status === 'pending' ? 'animate-pulse' : ''}`} />
                              {cfg.label}
                            </span>
                          </div>
                          <p className="text-slate-600 font-semibold mb-3">{app.company_name}</p>
                          <div className="flex items-center gap-5 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5 font-medium">
                              <MapPin className="w-3.5 h-3.5" /> {app.location}
                            </span>
                            <span className="flex items-center gap-1.5 font-medium">
                              <Clock className="w-3.5 h-3.5" /> {app.duration}
                            </span>
                            <span className="flex items-center gap-1.5 font-medium">
                              <CalendarDays className="w-3.5 h-3.5" />
                              Applied {new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <motion.div
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4"
                      >
                        <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </motion.div>
                    </div>

                    {/* Expandable detail section */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-7 pb-7 border-t border-slate-100 pt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                              {/* Left: Progress Tracker */}
                              <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-3">Application Progress</p>
                                <div className={`p-5 rounded-2xl border ${cfg.border} ${cfg.bg}`}>
                                  <div className="flex items-center gap-3 mb-2">
                                    <StatusIcon className={`w-6 h-6 ${cfg.text}`} />
                                    <div>
                                      <p className={`font-bold ${cfg.text} text-sm`}>{cfg.label}</p>
                                      <p className="text-xs text-slate-600">
                                        {app.status === 'pending' && 'The company is reviewing your application. Hang tight!'}
                                        {app.status === 'accepted' && 'Congratulations! The company has accepted your application.'}
                                        {app.status === 'rejected' && 'The company has reviewed but decided not to move forward this time.'}
                                      </p>
                                    </div>
                                  </div>
                                  <ProgressTracker status={app.status} />
                                </div>
                              </div>

                              {/* Right: Application Details */}
                              <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-3">Role Details</p>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Location</span>
                                    <span className="text-xs font-bold text-slate-800">{app.location}</span>
                                  </div>
                                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Duration</span>
                                    <span className="text-xs font-bold text-slate-800">{app.duration}</span>
                                  </div>
                                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-2"><CalendarDays className="w-3.5 h-3.5" /> Deadline</span>
                                    <span className="text-xs font-bold text-slate-800">{app.deadline}</span>
                                  </div>
                                  {app.cover_letter && (
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                      <span className="text-xs text-slate-500 font-semibold flex items-center gap-2 mb-2"><FileText className="w-3.5 h-3.5" /> Cover Letter</span>
                                      <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">{app.cover_letter}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}
