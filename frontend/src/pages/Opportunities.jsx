import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase, MapPin, Clock, Zap, Search, ArrowRight,
  DollarSign, X, Lock, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

function LoginPromptModal({ internship, onClose }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-slate-100 text-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100">
          <Lock className="w-10 h-10 text-blue-500" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 font-outfit mb-3">Login Required</h3>
        <p className="text-slate-500 mb-2">
          You need an account to apply for <strong className="text-slate-800">{internship?.title}</strong>.
        </p>
        <p className="text-slate-400 text-sm mb-8">It's free and takes less than a minute!</p>
        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login', { state: { from: '/opportunities' } })}
            className="w-full btn-primary py-4 font-bold text-base flex items-center justify-center gap-2"
          >
            Sign In to Apply <ArrowRight className="w-5 h-5" />
          </motion.button>
          <Link
            to="/register"
            className="w-full py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold text-base hover:bg-slate-50 transition-colors flex items-center justify-center"
          >
            Create Free Account
          </Link>
          <button onClick={onClose} className="text-slate-400 text-sm hover:text-slate-600 transition-colors mt-1">
            Maybe later
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Opportunities() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loginPrompt, setLoginPrompt] = useState(null);

  const storedUser = localStorage.getItem('user');
  const user = storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null;
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/internships')
      .then(res => setInternships(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleApplyClick = (intern) => {
    if (user) {
      navigate('/student');
    } else {
      setLoginPrompt(intern);
    }
  };

  const filtered = internships
    .filter(i =>
      filterType === 'all' ||
      (filterType === 'free' && (!i.is_paid || i.is_paid == 0)) ||
      (filterType === 'paid' && i.is_paid == 1)
    )
    .filter(i =>
      !search ||
      i.title?.toLowerCase().includes(search.toLowerCase()) ||
      i.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      i.location?.toLowerCase().includes(search.toLowerCase()) ||
      i.skills_required?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-slate-50 font-inter">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 md:px-16 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="HUZA HUB" className="h-9 w-auto" />
          <div className="text-xl font-bold text-blue-600 font-outfit">HUZA HUB</div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/opportunities" className="text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5">Opportunities</Link>
          <a href="/#about" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">About</a>
          <a href="/#contact" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Link to={`/${user.role}`} className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-slate-700 font-bold hover:text-blue-600 transition-colors">Log in</Link>
              <Link to="/register" className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Page Header ── */}
      <div className="pt-24 pb-10 px-6 md:px-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 text-sm font-medium mb-6 w-fit transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 font-outfit">Internship Opportunities</h1>
                <p className="text-slate-500 text-sm">{internships.length} open positions from top companies</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by title, company, location..."
                className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 text-sm font-medium transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-3 mt-6 flex-wrap">
            {[
              { key: 'all', label: 'All' },
              { key: 'free', label: '🎓 Free / Government' },
              { key: 'paid', label: '💰 Paid' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={`px-5 py-2 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
                  filterType === f.key
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-300'
                }`}
              >
                {f.label}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${filterType === f.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {f.key === 'all' ? internships.length : internships.filter(i => f.key === 'free' ? (!i.is_paid || i.is_paid == 0) : i.is_paid == 1).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid of Square Cards ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-5"
            />
            <p className="text-slate-500 font-medium">Loading opportunities...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-40">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="font-bold text-lg text-slate-600">No internships found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((intern, index) => {
              const isFree = !intern.is_paid || intern.is_paid == 0;
              return (
                <motion.div
                  key={intern.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -6, boxShadow: '0 24px 60px -10px rgba(59,130,246,0.14)' }}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4 group transition-all"
                >
                  {/* Top row: company icon + type badge */}
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 grad-blue rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/20 transform group-hover:rotate-6 transition-transform duration-300">
                      {intern.company_name?.charAt(0)?.toUpperCase() || <Briefcase className="w-7 h-7" />}
                    </div>
                    <div className="flex flex-col items-end gap-1 pt-1">
                      {isFree ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase border border-emerald-200 tracking-wider">Free</span>
                      ) : (
                        <>
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase border border-blue-200 tracking-wider">Paid</span>
                          {intern.fee && (
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black border border-amber-200 flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />{intern.fee}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Title + Company */}
                  <div className="flex-1">
                    <h3 className="text-base font-black text-slate-900 font-outfit group-hover:text-blue-600 transition-colors leading-snug mb-1 line-clamp-2">
                      {intern.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold truncate">{intern.company_name}</p>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{intern.location}</span>
                    </span>
                    <span className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      {intern.duration}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-red-500 font-bold">
                      <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                      Deadline: {intern.deadline}
                    </span>
                  </div>

                  {/* Skills */}
                  {intern.skills_required && (
                    <div className="flex flex-wrap gap-1.5">
                      {intern.skills_required.split(',').slice(0, 3).map(tag => (
                        <span key={tag.trim()} className="px-2 py-1 bg-slate-50 border border-slate-100 text-slate-500 rounded-lg text-[10px] font-bold">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Apply button — always at bottom */}
                  <div className="pt-3 border-t border-slate-100 mt-auto">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleApplyClick(intern)}
                      className="w-full btn-primary py-3 text-sm font-bold shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
                    >
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA for guests */}
        {!user && !loading && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 bg-blue-600 rounded-[2rem] p-10 text-center text-white shadow-2xl shadow-blue-500/20"
          >
            <h3 className="text-2xl font-black font-outfit mb-3">Ready to kickstart your career?</h3>
            <p className="text-blue-100 mb-8 max-w-md mx-auto">
              Create a free account and apply to any of these {filtered.length} opportunities in minutes.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/register" className="bg-white text-blue-600 font-bold px-8 py-3.5 rounded-2xl hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2">
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="text-blue-100 font-bold hover:text-white transition-colors">
                Already have an account? Sign in →
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* Login Prompt Modal */}
      <AnimatePresence>
        {loginPrompt && (
          <LoginPromptModal
            internship={loginPrompt}
            onClose={() => setLoginPrompt(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
