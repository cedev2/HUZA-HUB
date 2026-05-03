import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Briefcase, MapPin, Clock, CalendarDays, Plus, Loader2, CheckCircle2, ArrowLeft, Info, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

export default function PostInternship() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills_required: '',
    duration: '',
    location: '',
    deadline: '',
    positions: 1,
    is_paid: 0,
    fee: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/internships', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/company');
      }, 2000);
    } catch (err) {
      console.error('Failed to post internship:', err);
      alert('Failed to post internship. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-slate-50  min-h-screen font-inter relative overflow-hidden transition-colors duration-300">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-emerald-400/5 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-400/5 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />

      <Sidebar role="company" />
      <main className="flex-1 ml-64 p-10 relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center gap-4">
             <button 
                onClick={() => navigate(-1)}
                className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-900 transition-all shadow-sm"
             >
                <ArrowLeft className="w-5 h-5" />
             </button>
             <div>
                <h1 className="text-xl font-bold text-slate-900  font-outfit tracking-tight uppercase">Post New Opportunity</h1>
                <p className="text-slate-500 ">Share a new internship position with the student community</p>
             </div>
          </div>
        </motion.header>

        <div className="max-w-4xl">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="glass-card p-10 rounded-[3rem] bg-white/60  backdrop-blur-xl border border-white/50  shadow-premium relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-24 h-24 bg-emerald-100  rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900  font-outfit mb-4">Post Published!</h2>
                  <p className="text-slate-500  max-w-sm">Your internship opportunity is now live and visible to all eligible students.</p>
                </motion.div>
              ) : (
                <form key="form" onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Role Title */}
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-xs font-black text-slate-400  uppercase tracking-[0.2em] mb-3">
                        <Briefcase className="w-4 h-4" /> Internship Title
                      </label>
                      <input 
                        required
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Frontend Developer Intern"
                        className="w-full px-6 py-4 bg-white  border border-slate-200  rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-900  font-medium"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-black text-slate-400  uppercase tracking-[0.2em] mb-3">
                        <MapPin className="w-4 h-4" /> Location
                      </label>
                      <input 
                        required
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Remote, City Center"
                        className="w-full px-6 py-4 bg-white  border border-slate-200  rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-900  font-medium"
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-black text-slate-400  uppercase tracking-[0.2em] mb-3">
                        <Clock className="w-4 h-4" /> Duration
                      </label>
                      <input 
                        required
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="e.g. 3 Months, 6 Months"
                        className="w-full px-6 py-4 bg-white  border border-slate-200  rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-900  font-medium"
                      />
                    </div>

                    {/* Deadline */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-black text-slate-400  uppercase tracking-[0.2em] mb-3">
                        <CalendarDays className="w-4 h-4" /> Application Deadline
                      </label>
                      <input 
                        required
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-white  border border-slate-200  rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-900  font-medium"
                      />
                    </div>

                    {/* Positions */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                        <Users className="w-4 h-4" /> Available Positions
                      </label>
                      <input 
                        required
                        type="number"
                        min="1"
                        name="positions"
                        value={formData.positions}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-900 font-medium"
                      />
                    </div>

                    {/* Internship Type - Paid/Free */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                        <Info className="w-4 h-4" /> Internship Type
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, is_paid: 0 }))}
                          className={`flex-1 py-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                            formData.is_paid === 0
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          🎓 Free / Government
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, is_paid: 1 }))}
                          className={`flex-1 py-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                            formData.is_paid === 1
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          💰 Paid Internship
                        </button>
                      </div>
                      {formData.is_paid === 0 && (
                        <p className="text-xs text-emerald-600 mt-2 font-medium bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
                          📋 Students will be required to submit a school letter and report PDF when applying.
                        </p>
                      )}
                      {formData.is_paid === 1 && (
                        <p className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 px-3 py-2 rounded-xl border border-blue-100">
                          💰 Please fill in the stipend/fee amount below so students know what to expect.
                        </p>
                      )}
                    </div>

                    {/* Fee / Stipend — only for paid */}
                    {formData.is_paid === 1 && (
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                          <Info className="w-4 h-4" /> Internship Stipend / Fee
                        </label>
                        <input
                          name="fee"
                          value={formData.fee}
                          onChange={handleChange}
                          placeholder="e.g. 50,000 RWF/month  or  $300/month  or  Negotiable"
                          className="w-full px-6 py-4 bg-white border border-blue-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    )}

                    {/* Skills Required */}
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-xs font-black text-slate-400  uppercase tracking-[0.2em] mb-3">
                        <Info className="w-4 h-4" /> Skills Required (Comma separated)
                      </label>
                      <input 
                        name="skills_required"
                        value={formData.skills_required}
                        onChange={handleChange}
                        placeholder="e.g. React, Tailwind CSS, Node.js"
                        className="w-full px-6 py-4 bg-white  border border-slate-200  rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-900  font-medium"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-xs font-black text-slate-400  uppercase tracking-[0.2em] mb-3">
                        <Info className="w-4 h-4" /> Role Description
                      </label>
                      <textarea 
                        required
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="6"
                        placeholder="Describe the responsibilities, requirements and benefits..."
                        className="w-full px-6 py-4 bg-white  border border-slate-200  rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-900  font-medium resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="btn-primary py-4 px-12 text-lg font-bold shadow-lg shadow-blue-500/20 flex items-center gap-3 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" /> Publishing...
                        </>
                      ) : (
                        <>
                          <Plus className="w-6 h-6" /> Publish Opportunity
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
