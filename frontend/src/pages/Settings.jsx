import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Shield, Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

export default function Settings() {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/auth/change-password', {
        current_password: passwords.current,
        new_password: passwords.new
      });
      setStatus({ type: 'success', message: 'Password changed successfully!' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to change password' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-white min-h-screen font-inter transition-colors duration-300">
      <Sidebar role={user.role} />
      
      <main className="flex-1 ml-64 p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 font-outfit">Account Settings</h1>
          <p className="text-slate-600">Manage your security and account preferences</p>
        </header>

        <div className="max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-outfit">Security</h2>
                <p className="text-sm text-slate-600">Update your login credentials</p>
              </div>
            </div>

            {status.message && (
              <div className={`mb-6 p-4 rounded-2xl flex items-center gap-4 border ${
                status.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                  : 'bg-red-50 border-red-100 text-red-700'
              }`}>
                {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <p className="text-sm font-medium">{status.message}</p>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="password"
                    required
                    className="input-field pl-12"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="password"
                      required
                      className="input-field pl-12"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="password"
                      required
                      className="input-field pl-12"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                  {loading ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
