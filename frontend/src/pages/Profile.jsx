import React from 'react';
import Sidebar from '../components/Sidebar';
import { User, Mail, Shield, Calendar, MapPin, GraduationCap, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) return null;

  return (
    <div className="flex bg-white min-h-screen font-inter">
      <Sidebar role={user.role} />
      
      <main className="flex-1 ml-64 p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 font-outfit">My Profile</h1>
          <p className="text-slate-600">View and manage your professional identity</p>
        </header>

        <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: User Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
          >
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-200 text-center">
              <div className="w-32 h-32 grad-blue rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-500/20">
                {user.name?.charAt(0) || 'U'}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-outfit mb-1">{user.name}</h2>
              <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-6">{user.role}</p>
              
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Shield className="w-5 h-5 text-slate-400" />
                  <span className="text-sm capitalize">{user.role} Account</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2 space-y-8"
          >
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 font-outfit mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-blue-500" /> Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                  <p className="text-slate-800 font-bold">{user.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                  <p className="text-slate-800 font-bold">{user.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Account Type</label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold capitalize">{user.role}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Member Since</label>
                  <p className="text-slate-800 font-bold">May 2026</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 font-outfit mb-6 flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-blue-500" /> Professional Details
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Complete your profile to unlock more opportunities and tailored recommendations from HUZA HUB partners.
              </p>
              <button className="mt-6 text-blue-600 font-bold text-sm hover:underline">Edit Professional Details →</button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
