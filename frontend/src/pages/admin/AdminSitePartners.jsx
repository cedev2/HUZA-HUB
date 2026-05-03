import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { Globe, Plus, Trash2, Loader2, Image as ImageIcon, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSitePartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', logo: null });
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await api.get('/site_partners');
      setPartners(res.data);
    } catch (err) {
      console.error('Failed to fetch partners:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    setStatus({ type: '', message: '' });

    const data = new FormData();
    data.append('name', formData.name);
    if (formData.logo) data.append('logo', formData.logo);

    try {
      await api.post('/site_partners', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ type: 'success', message: 'Partner added successfully!' });
      setFormData({ name: '', logo: null });
      fetchPartners();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to add partner.' });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this partner?')) return;
    try {
      await api.delete(`/site_partners/${id}`);
      setPartners(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete partner.');
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-inter">
      <Sidebar role="admin" />
      
      <main className="flex-1 ml-64 p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 font-outfit">Site Partners</h1>
          <p className="text-slate-500">Manage logos that appear on the landing page marquee</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Add Partner Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> Add New Partner
              </h2>
              <form onSubmit={handleAdd} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Partner Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-sm transition-all text-slate-900"
                    placeholder="e.g. Google"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Logo (Image)</label>
                  <label className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${formData.logo ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'}`}>
                    {formData.logo ? (
                      <div className="text-center">
                        <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <p className="text-xs font-bold text-emerald-700 truncate max-w-[150px]">{formData.logo.name}</p>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                        <p className="text-xs font-bold text-slate-500">Upload Logo</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={e => setFormData({ ...formData, logo: e.target.files[0] })}
                    />
                  </label>
                </div>

                <AnimatePresence>
                  {status.message && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}
                    >
                      {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      {status.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  disabled={adding}
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  {adding ? 'Adding...' : 'Add Partner'}
                </button>
              </form>
            </div>
          </div>

          {/* Partners List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" /> Current Partners ({partners.length})
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {loading ? (
                  <div className="p-20 text-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="font-medium">Loading partners...</p>
                  </div>
                ) : partners.length === 0 ? (
                  <div className="p-20 text-center text-slate-400">
                    <Globe className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-medium italic">No partners added yet.</p>
                  </div>
                ) : (
                  partners.map(partner => (
                    <div key={partner.id} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl p-2 flex items-center justify-center shadow-sm overflow-hidden">
                          {partner.logo_url ? (
                            <img src={`http://localhost/HUZA HUB/backend/${partner.logo_url}`} alt={partner.name} className="max-w-full max-h-full object-contain" />
                          ) : (
                            <div className="text-blue-600 font-black text-xl">{partner.name.charAt(0)}</div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{partner.name}</h3>
                          <p className="text-xs text-slate-400">Added on {new Date(partner.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(partner.id)}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
