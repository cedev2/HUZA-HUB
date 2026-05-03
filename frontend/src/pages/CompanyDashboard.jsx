import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import { Plus, Users, Briefcase, MessageSquare, ExternalLink, MoreVertical, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function CompanyDashboard() {
  const [activeJobs, setActiveJobs] = useState([]);
  const [stats, setStats] = useState({
    active_postings: 0,
    total_applicants: 0,
    unread_messages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, appsRes] = await Promise.all([
          api.get('/stats'),
          api.get('/applications')
        ]);
        setStats(statsRes.data);
        // For simplicity, we'll treat all applications as "active jobs" placeholders or fetch real internships
        const internshipsRes = await api.get('/internships');
        setActiveJobs(internshipsRes.data.filter(i => i.status === 'open'));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen font-inter relative overflow-hidden transition-colors duration-300">
       {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-emerald-400/5 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-400/5 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />

      <Sidebar role="company" />
      <main className="flex-1 ml-64 p-10 relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 font-outfit tracking-tight">Company Dashboard</h1>
            <p className="text-slate-600 text-lg">Manage your internships and find top talent</p>
          </div>
          <Link to="/company/post">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary py-4 px-8 text-lg font-bold shadow-lg shadow-blue-500/10 flex items-center gap-3"
            >
              <Plus className="w-6 h-6" /> Post Opportunity
            </motion.button>
          </Link>
        </motion.header>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          <motion.div variants={fadeInUp} className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group bg-white border border-slate-100">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[4rem] group-hover:w-28 group-hover:h-28 transition-all"></div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="p-4 grad-blue text-white rounded-2xl shadow-lg shadow-blue-500/20">
                <Briefcase className="w-8 h-8" />
              </div>
              <span className="text-xs font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-tighter">Current Postings</span>
            </div>
            <p className="text-slate-600 font-bold mb-1 text-sm">Active Roles</p>
            <p className="text-4xl font-black text-slate-900 font-outfit">{String(stats.active_postings).padStart(2, '0')}</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group bg-white border border-slate-100">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[4rem] group-hover:w-28 group-hover:h-28 transition-all"></div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
                <Users className="w-8 h-8" />
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tighter">+12% growth</span>
            </div>
            <p className="text-slate-600 font-bold mb-1 text-sm">Talent Pipeline</p>
            <p className="text-4xl font-black text-slate-900 font-outfit">{stats.total_applicants}</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group bg-white border border-slate-100">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-[4rem] group-hover:w-28 group-hover:h-28 transition-all"></div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="p-4 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-500/20">
                <MessageSquare className="w-8 h-8" />
              </div>
              <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-tighter ${stats.unread_messages > 0 ? 'text-white bg-orange-500' : 'text-slate-400 bg-slate-100'}`}>
                {stats.unread_messages > 0 ? `${stats.unread_messages} unread` : 'All caught up'}
              </span>
            </div>
            <p className="text-slate-600 font-bold mb-1 text-sm">Total Mentions</p>
            <p className="text-4xl font-black text-slate-900 font-outfit">{stats.unread_messages}</p>
          </motion.div>
        </motion.div>

        <motion.div 
           variants={fadeInUp}
           initial="initial"
           animate="animate"
           transition={{ delay: 0.4 }}
           className="glass-card rounded-[3rem] overflow-hidden"
        >
          <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-white/50 transition-colors">
            <h2 className="text-2xl font-bold font-outfit text-slate-900 flex items-center gap-3">
               <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" /> Live Postings
            </h2>
            <button className="text-blue-600 font-bold hover:gap-2 transition-all flex items-center gap-1 group">
               Explore All <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="divide-y divide-slate-100/50">
            {activeJobs.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                  <Briefcase className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-outfit mb-2">No Active Postings</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">You haven't posted any internship opportunities yet. Create your first posting to start receiving applications.</p>
                <Link to="/company/post" className="btn-primary py-3 px-6 shadow-lg shadow-blue-500/10 inline-flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Create Posting
                </Link>
              </div>
            ) : (
              activeJobs.map((job) => (
                <motion.div 
                  key={job.id} 
                  whileHover={{ backgroundColor: "var(--bg-surface)" }}
                  className="p-8 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center font-bold text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                      <Briefcase className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-slate-900 font-outfit">{job.title}</h3>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-slate-600 font-medium text-sm">Posted {new Date(job.created_at).toLocaleDateString()} • <span className="text-blue-600 font-bold">{job.applicants_count || 0} Applicants</span> queued</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">{job.status}</span>
                    <motion.button whileHover={{ scale: 1.1 }} className="p-3 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all"><ExternalLink className="w-6 h-6" /></motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} className="p-3 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all"><MoreVertical className="w-6 h-6" /></motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
