import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { TrendingUp, BarChart3, PieChart, Activity, Download, Calendar, Filter, Loader2 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, AreaChart, Area, PieChart as RePieChart, Pie, Cell 
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const growthData = stats?.growthData && stats.growthData.length > 0 ? stats.growthData : [
    { name: 'No Data', students: 0, companies: 0 }
  ];

  const categoryData = stats?.categoryData && stats.categoryData.length > 0 ? stats.categoryData : [
    { name: 'No Data', value: 1 }
  ];

  const placementRate = stats?.placement_rate || 0;

  if (loading) return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="flex bg-white min-h-screen font-inter transition-colors duration-300">
      <Sidebar role="admin" />
      
      <main className="flex-1 ml-64 p-10">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-outfit">System Analytics</h1>
            <p className="text-slate-500">Deep dive into platform performance and user growth</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Calendar className="w-4 h-4" /> Last 6 Months
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-8 rounded-[2.5rem] bg-white border border-slate-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/20"><TrendingUp className="w-6 h-6" /></div>
              <h3 className="font-bold font-outfit">Student Growth</h3>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="students" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStudents)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-8 rounded-[2.5rem] bg-white border border-slate-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20"><PieChart className="w-6 h-6" /></div>
              <h3 className="font-bold font-outfit">Application Status</h3>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-8 rounded-[2.5rem] bg-white border border-slate-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-purple-500 text-white rounded-2xl shadow-lg shadow-purple-500/20"><Activity className="w-6 h-6" /></div>
              <h3 className="font-bold font-outfit">Placement Rate</h3>
            </div>
            <div className="flex flex-col items-center justify-center h-[200px]">
               <p className="text-6xl font-black text-slate-900 font-outfit">{placementRate}%</p>
               <p className="text-purple-500 font-bold flex items-center gap-1 mt-2">
                 <TrendingUp className="w-4 h-4" /> Live Tracking
               </p>
            </div>
          </motion.div>
        </div>

        <div className="glass-card p-10 rounded-[3rem] bg-white border border-slate-100">
           <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-bold font-outfit text-slate-900">Partner Onboarding Trends</h2>
             <button className="text-blue-600 font-bold hover:underline flex items-center gap-2"><Filter className="w-4 h-4" /> Refine Data</button>
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip cursor={{fill: 'rgba(59, 130, 246, 0.05)'}} />
                  <Bar dataKey="students" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={20} />
                  <Bar dataKey="companies" fill="#f59e0b" radius={[10, 10, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </main>
    </div>
  );
}
