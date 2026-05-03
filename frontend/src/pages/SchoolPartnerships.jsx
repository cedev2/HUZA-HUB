import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { Building2, Search, Loader2, Link as LinkIcon, MoreVertical, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

export default function SchoolPartnerships() {
  const [partnerships, setPartnerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPartnerships();
  }, []);

  const fetchPartnerships = async () => {
    try {
      const response = await api.get('/partnerships');
      setPartnerships(response.data);
    } catch (err) {
      console.error('Failed to fetch partnerships:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = partnerships.filter(p => 
    !search || 
    p.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-slate-50 min-h-screen font-inter relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-emerald-400/5 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-400/5 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />

      <Sidebar role="school" />
      
      <main className="flex-1 ml-64 p-10 relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <LinkIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">Partner Network</h1>
            </div>
            <p className="text-slate-500 ml-[3.25rem]">Manage your corporate relationships and internship providers</p>
          </div>
        </motion.header>

        <motion.div 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="glass-card rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white/50"
        >
          {/* Toolbar */}
          <div className="p-6 border-b border-slate-100 bg-white/50 flex flex-wrap items-center justify-between gap-4 rounded-t-[2.5rem]">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search partners by company name..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/80 border border-slate-200 rounded-2xl py-2.5 pl-11 text-sm focus:ring-2 ring-emerald-500/20 focus:outline-none transition-all text-slate-900"
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="px-8 py-4 border-b border-slate-100 bg-white/30 grid grid-cols-12 gap-4 items-center">
            <p className="col-span-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Partner</p>
            <p className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
            <p className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Connected Since</p>
            <p className="col-span-1 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</p>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100/50">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
                <p className="text-slate-500 font-medium">Loading partnerships...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <Building2 className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No partners found</h3>
                <p className="text-slate-500 text-sm">We couldn't find any corporate partners matching your search.</p>
              </div>
            ) : (
              filtered.map((partner, index) => (
                <div 
                  key={partner.id} 
                  style={{ zIndex: 100 - index }}
                  className="relative px-8 py-5 grid grid-cols-12 gap-4 items-center hover:bg-white/40 transition-colors group"
                >
                  {/* Company Details */}
                  <div className="col-span-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 border border-slate-200">
                      <Building2 className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{partner.company_name}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 uppercase tracking-widest font-black">
                        <Globe className="w-3 h-3" /> Partner
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-3">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                      {partner.status || 'Active'}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="col-span-3">
                    <p className="text-sm font-medium text-slate-600">
                      {new Date(partner.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end">
                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
