import React from 'react';
import Sidebar from '../components/Sidebar';
import { Bookmark, MapPin, Clock, Zap, ArrowRight, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentSaved() {
  // Placeholder for saved internships (to be replaced with real data from backend/localStorage)
  const savedInternships = []; 

  return (
    <div className="flex bg-slate-50 min-h-screen font-inter">
      <Sidebar role="student" />
      
      <main className="flex-1 ml-64 p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 font-outfit">Saved Opportunities</h1>
          <p className="text-slate-600">Internships you've bookmarked for later</p>
        </header>

        {savedInternships.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 border border-slate-200 text-center shadow-xl">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-outfit mb-2">No Saved Internships</h2>
            <p className="text-slate-500 max-w-sm mx-auto mb-8">
              Explore the feed and bookmark opportunities you're interested in to see them here.
            </p>
            <a href="/student" className="btn-primary py-4 px-10 inline-flex items-center gap-3">
              Explore Feed <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Real data mapping would go here */}
          </div>
        )}
      </main>
    </div>
  );
}
