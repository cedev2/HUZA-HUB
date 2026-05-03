import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { Briefcase, Plus, Search, Loader2, MapPin, Globe, MoreVertical, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', email: '', website: '', description: '' });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.patch('/companies', { user_id: userId, status: newStatus });
      fetchCompanies();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await api.post('/companies', newCompany);
      setShowAddModal(false);
      setNewCompany({ name: '', email: '', website: '', description: '' });
      fetchCompanies();
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to add company';
      alert(`Error: ${errMsg}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex bg-white min-h-screen font-inter transition-colors duration-300">
      <Sidebar role="admin" />
      
      <main className="flex-1 md:ml-64 p-4 md:p-10 pt-20 md:pt-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-outfit">Company Management</h1>
            <p className="text-slate-500 text-sm md:text-base">Onboard and manage corporate partners</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 py-3 px-6 shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" /> Add New Company
          </button>
        </header>

        <div className="glass-card rounded-[2.5rem] bg-white border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/40">
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search companies..." 
                className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-11 text-sm focus:ring-2 ring-blue-500/20 transition-all text-slate-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-8 py-5">Company</th>
                <th className="px-8 py-5">Details</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
                  </td>
                </tr>
              ) : !Array.isArray(companies) ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-red-500 font-medium">
                    Error: Invalid data format received from server.
                  </td>
                </tr>
              ) : companies.map((company) => (
                <tr key={company.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold shadow-sm">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{company.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> Kigali, Rwanda</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-slate-700 flex items-center gap-2">
                         <Globe className="w-4 h-4 text-slate-400" /> {company.website || 'No website'}
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{company.email}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={company.status}
                      onChange={(e) => handleStatusChange(company.user_id, e.target.value)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer outline-none appearance-none text-center ${
                        company.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                          : company.status === 'pending'
                          ? 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100'
                          : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Add Company Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-slate-900/20">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 w-full max-w-lg shadow-2xl border border-white/50 dark:border-slate-800"
              >
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl">
                     <Building2 className="w-6 h-6" />
                   </div>
                   <div>
                     <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-outfit">Add Company</h2>
                     <p className="text-sm text-slate-500 dark:text-slate-400 font-medium tracking-tight">Register a corporate internship provider.</p>
                   </div>
                </div>
                
                <form onSubmit={handleAddCompany} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-400 mb-2 uppercase tracking-widest text-[10px]">Company Name</label>
                    <input 
                      type="text" required className="input-field" placeholder="e.g. TechNova Corp" 
                      value={newCompany.name} onChange={e => setNewCompany({...newCompany, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-400 mb-2 uppercase tracking-widest text-[10px]">Contact Email</label>
                      <input 
                        type="email" required className="input-field" placeholder="hr@company.com" 
                        value={newCompany.email} onChange={e => setNewCompany({...newCompany, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-400 mb-2 uppercase tracking-widest text-[10px]">Website</label>
                      <input 
                        type="text" className="input-field" placeholder="https://..." 
                        value={newCompany.website} onChange={e => setNewCompany({...newCompany, website: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm flex items-start gap-3 border border-emerald-100 dark:border-emerald-900/30">
                    <div>
                      <span className="block font-bold mb-1">Default Password Assigned</span>
                      The system will automatically assign <b>Password123!</b> as the temporary password. The company should change this in their Settings after logging in.
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                    <button type="submit" disabled={submitLoading} className="flex-1 btn-primary py-4 shadow-xl shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2">
                      {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                      Onboard Partner
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
