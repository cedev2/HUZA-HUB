import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { Link2, Search, Loader2, Building2, Briefcase, Calendar, CheckCircle2, ChevronRight, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPartnerships() {
  const [partnerships, setPartnerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [schools, setSchools] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [newPartnership, setNewPartnership] = useState({ school_id: '', company_id: '' });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchPartnerships();
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [schoolsRes, companiesRes] = await Promise.all([
        api.get('/schools'),
        api.get('/companies')
      ]);
      setSchools(schoolsRes.data);
      setCompanies(companiesRes.data);
    } catch (err) {
      console.error('Failed to fetch schools/companies:', err);
    }
  };

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

  const handleAddPartnership = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await api.post('/partnerships', newPartnership);
      setShowAddModal(false);
      setNewPartnership({ school_id: '', company_id: '' });
      fetchPartnerships();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create partnership');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex bg-white min-h-screen font-inter transition-colors duration-300">
      <Sidebar role="admin" />
      
      <main className="flex-1 ml-64 p-10">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-outfit">Partnership Network</h1>
            <p className="text-slate-500">Monitor collaborations between academic institutions and corporate partners</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> Link Partners
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
            </div>
          ) : !Array.isArray(partnerships) ? (
            <div className="col-span-full py-20 text-center text-red-500 font-medium">
               Error: Invalid data format received from server.
            </div>
          ) : partnerships.map((p) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="glass-card p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Link2 className="w-20 h-20 rotate-45" />
              </div>

              <div className="flex items-center justify-between mb-8">
                 <div className="flex -space-x-3">
                   <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold border-4 border-white shadow-lg">
                     {p.school_name.charAt(0)}
                   </div>
                   <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold border-4 border-white shadow-lg">
                     {p.company_name.charAt(0)}
                   </div>
                 </div>
                 <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                   <CheckCircle2 className="w-3 h-3" /> {p.status}
                 </span>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Building2 className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Academic Partner</span>
                  </div>
                  <p className="font-bold text-slate-900 line-clamp-1">{p.school_name}</p>
                </div>
                
                <div className="flex justify-center -ml-2 text-slate-300">
                   <ChevronRight className="w-6 h-6 rotate-90" />
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Briefcase className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Corporate Host</span>
                  </div>
                  <p className="font-bold text-slate-900 line-clamp-1">{p.company_name}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="text-slate-400 flex items-center gap-2">
                   <Calendar className="w-4 h-4" />
                   <span className="text-xs font-medium">{new Date(p.created_at).toLocaleDateString()}</span>
                </div>
                <button className="text-blue-600 font-bold text-sm hover:underline">Details</button>
              </div>
            </motion.div>
          ))}
        </div>

        {Array.isArray(partnerships) && partnerships.length === 0 && !loading && (
          <div className="py-40 text-center">
            <Link2 className="w-16 h-16 text-slate-100 dark:text-slate-800 mx-auto mb-6" />
            <p className="text-2xl font-bold font-outfit text-slate-400">No active partnerships found</p>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">Begin connecting schools and companies to build the platform ecosystem.</p>
          </div>
        )}

        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl border border-slate-100 relative"
              >
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="absolute top-8 right-8 p-3 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-blue-500/10 text-blue-600 rounded-3xl flex items-center justify-center">
                    <Link2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-outfit text-slate-900">Create Link</h2>
                    <p className="text-slate-500 font-medium mt-1">Connect a school and company</p>
                  </div>
                </div>

                <form onSubmit={handleAddPartnership} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-400 mb-2 uppercase tracking-widest text-[10px]">Academic Partner (School)</label>
                    <select 
                      required 
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                      value={newPartnership.school_id} 
                      onChange={e => setNewPartnership({...newPartnership, school_id: e.target.value})}
                    >
                      <option value="">Select a school...</option>
                      {schools.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-400 mb-2 uppercase tracking-widest text-[10px]">Corporate Host (Company)</label>
                    <select 
                      required 
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                      value={newPartnership.company_id} 
                      onChange={e => setNewPartnership({...newPartnership, company_id: e.target.value})}
                    >
                      <option value="">Select a company...</option>
                      {companies.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all">Cancel</button>
                    <button 
                      type="submit" 
                      disabled={submitLoading}
                      className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-70 flex justify-center items-center"
                    >
                      {submitLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create Link'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
