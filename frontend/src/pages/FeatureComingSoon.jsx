import React from 'react';
import Sidebar from '../components/Sidebar';
import { Sparkles, Hammer } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

export default function FeatureComingSoon({ title, description, role, Icon }) {
  return (
    <div className="flex bg-slate-50 min-h-screen font-inter relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-blue-400/5 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-purple-400/5 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />

      <Sidebar role={role} />
      <main className="flex-1 ml-64 p-10 relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-outfit tracking-tight uppercase">{title}</h1>
            <p className="text-slate-500">Feature currently in development</p>
          </div>
        </motion.header>

        <motion.div 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="glass-card flex flex-col items-center justify-center p-20 rounded-[3rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-premium text-center min-h-[60vh]"
        >
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 shadow-sm relative z-10">
              {Icon ? <Icon className="w-10 h-10 text-blue-500" /> : <Hammer className="w-10 h-10 text-blue-500" />}
            </div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-4 border-2 border-dashed border-blue-200 rounded-full z-0"
            />
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center shadow-lg z-20"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 font-outfit mb-4">{title} Coming Soon!</h2>
          <p className="text-slate-500 max-w-md mx-auto text-lg leading-relaxed mb-8">
            {description || "We are building an incredible new experience for this section. Check back soon for updates!"}
          </p>
          
          <button className="btn-primary py-4 px-8 text-lg font-bold shadow-lg shadow-blue-500/10 flex items-center gap-3 opacity-80 cursor-not-allowed" disabled>
            <Hammer className="w-5 h-5" /> Under Construction
          </button>
        </motion.div>
      </main>
    </div>
  );
}
