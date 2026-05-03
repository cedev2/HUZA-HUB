import React from 'react';
import Sidebar from '../components/Sidebar';
import { MessageSquare, Sparkles, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

export default function CompanyMessages() {
  return (
    <div className="flex bg-slate-50 min-h-screen font-inter relative overflow-hidden transition-colors duration-300">
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
            <h1 className="text-xl font-bold text-slate-900 font-outfit tracking-tight uppercase">Messages</h1>
            <p className="text-slate-500">Communicate directly with your applicants</p>
          </div>
        </motion.header>

        <motion.div 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="glass-card flex flex-col items-center justify-center p-20 rounded-[3rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-premium text-center min-h-[60vh]"
        >
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100 shadow-sm relative z-10">
              <MessageSquare className="w-10 h-10 text-orange-500" />
            </div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-4 border-2 border-dashed border-orange-200 rounded-full z-0"
            />
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg z-20"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 font-outfit mb-4">Messaging Coming Soon!</h2>
          <p className="text-slate-500 max-w-md mx-auto text-lg leading-relaxed mb-8">
            We are building a seamless chat experience so you can easily communicate with applicants and partner schools directly from this dashboard.
          </p>
          
          <button className="btn-primary py-4 px-8 text-lg font-bold shadow-lg shadow-blue-500/10 flex items-center gap-3 opacity-80 cursor-not-allowed" disabled>
            <Send className="w-5 h-5" /> Feature in Development
          </button>
        </motion.div>
      </main>
    </div>
  );
}
