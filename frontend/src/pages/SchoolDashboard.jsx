import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Users, Building2, CheckCircle, Clock, Link as LinkIcon, BarChart3, Zap, ArrowRight } from 'lucide-react';
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

export default function SchoolDashboard() {
  const [recentPartnerships, setRecentPartnerships] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [stats, setStats] = useState({
    placement_rate: '0%',
    active_partners: 0,
    total_students: 0,
    applications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const response = await api.get('/stats');
        setStats(response.data);
        if (response.data.recent_partnerships) setRecentPartnerships(response.data.recent_partnerships);
        if (response.data.activity_feed) setActivityFeed(response.data.activity_feed);
      } catch (err) {
        console.error('Failed to fetch school stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchoolData();
  }, []);

  const statItems = [
    { label: 'Placement Rate', value: stats.placement_rate, icon: BarChart3, color: 'bg-blue-500', shadow: 'shadow-blue-500/20' },
    { label: 'Active Partners', value: stats.active_partners, icon: LinkIcon, color: 'bg-emerald-500', shadow: 'shadow-emerald-500/20' },
    { label: 'Enrolled Students', value: stats.total_students, icon: Users, color: 'bg-purple-500', shadow: 'shadow-purple-500/20' },
    { label: 'Applications', value: stats.applications, icon: Zap, color: 'bg-orange-500', shadow: 'shadow-orange-500/20' },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen font-inter relative overflow-hidden transition-colors duration-300">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-purple-400/5 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-400/5 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />

      <Sidebar role="school" />
      <main className="flex-1 ml-64 p-10 relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-lg md:text-xl font-bold text-slate-900 font-outfit tracking-tight">School Dashboard</h1>
          <p className="text-slate-600 text-lg">Monitor your students and manage industry partnerships</p>
        </motion.header>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
        >
          {statItems.map((stat, i) => (
            <motion.div 
              key={i}
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card p-6 rounded-[2.5rem] flex items-center gap-5 group"
            >
              <div className={`w-16 h-16 ${stat.color} text-white rounded-2xl flex items-center justify-center shadow-lg ${stat.shadow} transform group-hover:rotate-6 transition-transform`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 font-outfit">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-8 rounded-[3rem]"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-outfit text-slate-900">Partner Channel</h2>
              <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {recentPartnerships.length > 0 ? recentPartnerships.map((partner) => (
                <motion.div 
                  key={partner.id} 
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.9)' }}
                  className="flex items-center justify-between p-5 bg-white/50 rounded-2xl border border-slate-100/50 shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white  rounded-xl shadow-sm flex items-center justify-center border border-slate-100 ">
                      <Building2 className="w-6 h-6 text-blue-500 opacity-50" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{partner.company_name}</p>
                      <p className="text-xs text-slate-600">Connected on {partner.date}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    partner.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {partner.status}
                  </span>
                </motion.div>
              )) : (
                <div className="text-center py-6 text-slate-500">No active partnerships found.</div>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-8 rounded-[3rem]"
          >
            <h2 className="text-2xl font-bold font-outfit text-slate-900  mb-8">Live Activity Feed</h2>
            <div className="space-y-8">
              {activityFeed.length > 0 ? activityFeed.map((activity, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="relative">
                    <div className="w-1 h-full bg-slate-100  absolute left-1/2 -translate-x-1/2 rounded-full"></div>
                    <div className="w-5 h-5 bg-blue-500 rounded-full border-4 border-white  shadow-md relative z-10 group-hover:scale-125 transition-transform"></div>
                  </div>
                  <div className="pb-6">
                    <p className="text-lg font-bold text-slate-900 leading-tight">Student Applied!</p>
                    <p className="text-slate-600 mt-1">{activity.student_name} applied to {activity.internship_title} at {activity.company_name}</p>
                    <p className="text-[10px] text-blue-500 mt-3 uppercase font-black tracking-[0.2em]">{activity.hours_ago} HOURS AGO</p>
                  </div>
                </div>
              )) : (
                 <div className="text-center py-6 text-slate-500">No recent activity found.</div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
