import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Building2, TrendingUp, CheckCircle, XCircle, Zap, Plus, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    companies: 0,
    schools: 0,
    internships: 0,
    applications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await api.get('/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const chartData = [
    { name: 'Students', count: stats.students },
    { name: 'Companies', count: stats.companies },
    { name: 'Schools', count: stats.schools },
    { name: 'Internships', count: stats.internships },
  ];

  return (
    <div className="flex bg-white min-h-screen font-inter relative overflow-hidden transition-colors duration-300">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-pink-400/5 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-400/5 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />

      <Sidebar role="admin" />
      <main className="flex-1 ml-64 p-10 relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
               <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 font-outfit tracking-tight uppercase">Admin Overview</h1>
          </div>
          <p className="text-slate-600 text-lg">Central hub for HUZA HUB platform monitoring</p>
        </motion.header>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12"
        >
          {[
            { label: 'Total Students', value: stats.students, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', shadow: 'shadow-blue-500/10', path: '/admin/students' },
            { label: 'Companies', value: stats.companies, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', shadow: 'shadow-blue-500/10', path: '/admin/companies', add: '/admin/companies' },
            { label: 'Schools', value: stats.schools, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50', shadow: 'shadow-blue-500/10', path: '/admin/schools', add: '/admin/schools' },
            { label: 'Internships', value: stats.internships, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', shadow: 'shadow-blue-500/10', path: '/admin/partnerships' },
            { label: 'Applications', value: stats.applications, icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50', shadow: 'shadow-blue-500/10', path: '/admin/analytics' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="glass-card p-6 rounded-[2rem] flex flex-col gap-4 group bg-white border border-slate-100 shadow-sm relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shadow-md ${stat.shadow} transform group-hover:rotate-6 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex gap-1">
                  {stat.add && (
                    <Link to={stat.add} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors" title="Add New">
                      <Plus className="w-4 h-4" />
                    </Link>
                  )}
                  <Link to={stat.path} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 font-outfit">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-8 rounded-[3rem] bg-white border border-slate-100 shadow-sm"
          >
            <h2 className="text-2xl font-bold font-outfit text-slate-900 mb-8">System Growth</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b" opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold', fontSize: '10px'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: '10px'}} />
                  <Tooltip 
                    cursor={{fill: 'rgba(59, 130, 246, 0.05)'}} 
                    contentStyle={{borderRadius: '24px', border: 'none', backgroundColor: 'white', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px'}} 
                  />
                  <Bar dataKey="count" fill="#2563eb" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-8 rounded-[3rem] bg-white border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-outfit text-slate-900">Active Partners</h2>
              <Link to="/admin/partnerships" className="text-blue-600 font-bold text-sm hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {stats.recent_partnerships && stats.recent_partnerships.length > 0 ? (
                stats.recent_partnerships.map((partner, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 5, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-slate-100 shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 text-lg">
                      {partner.school_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 font-inter">{partner.school_name} & {partner.company_name}</p>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">{partner.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-slate-400">
                    <CheckCircle className={`w-5 h-5 ${partner.status === 'accepted' ? 'text-emerald-500' : 'text-orange-400'}`} />
                  </div>
                </motion.div>
              ))) : (
                <div className="text-center py-6 text-slate-500 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">No active partnerships yet.</div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
