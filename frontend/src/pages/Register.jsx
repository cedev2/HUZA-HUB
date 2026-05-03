import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UserPlus, Mail, Lock, User, MapPin, GraduationCap,
  Loader2, ChevronLeft, BookOpen, Building2, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const TRADES = [
  'Software Engineering',
  'Information Technology',
  'Computer Science',
  'Business Administration',
  'Accounting & Finance',
  'Marketing & Communications',
  'Civil Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Agriculture & Environment',
  'Healthcare & Nursing',
  'Hospitality & Tourism',
  'Education & Teaching',
  'Law & Paralegal Studies',
  'Graphic Design & Media',
  'Other',
];

const RWANDA_LOCATIONS = [
  'Kigali City', 'Gasabo', 'Kicukiro', 'Nyarugenge',
  'Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Rwamagana',
  'Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo',
  'Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango',
  'Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rutsiro', 'Rusizi',
  'Gicumbi', 'Gatsibo', 'Rwamagana',
];

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    school_id: '',
    location: '',
    trade: '',
  });
  const [schools, setSchools] = useState([]);
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await api.get('/schools');
        setSchools(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load schools:', err);
        setSchools([]);
      } finally {
        setSchoolsLoading(false);
      }
    };
    fetchSchools();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please check and try again.');
      return;
    }
    if (!formData.school_id) {
      setError('Please select your school.');
      return;
    }
    if (!formData.trade) {
      setError('Please select your field of study.');
      return;
    }
    if (!formData.location) {
      setError('Please select your location.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'student',
        school_id: formData.school_id,
        location: formData.location,
        trade: formData.trade,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-inter overflow-hidden relative transition-colors duration-300">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-400/8 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-emerald-400/8 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-purple-400/3 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 p-10 border border-slate-100">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 font-outfit mb-3">You're In!</h2>
                <p className="text-slate-500 text-lg max-w-sm leading-relaxed">
                  Your student account has been created. Redirecting you to login...
                </p>
                <div className="mt-6 w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3 }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div key="form">
                {/* Header */}
                <div className="mb-8">
                  <Link to="/" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 group mb-6 w-fit">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Website
                  </Link>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-black text-slate-900 font-outfit leading-tight">Student Registration</h1>
                      <p className="text-slate-500 mt-0.5">Create your account to access internship opportunities</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                  {/* Row 1: Full Name + Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                        <input
                          type="text"
                          name="name"
                          required
                          className="input-field !pl-11 w-full"
                          placeholder="e.g. Jean Claude Neza"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                        <input
                          type="email"
                          name="email"
                          required
                          className="input-field !pl-11 w-full"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Password + Confirm */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                        <input
                          type="password"
                          name="password"
                          required
                          className="input-field !pl-11 w-full"
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                        <input
                          type="password"
                          name="confirmPassword"
                          required
                          className="input-field !pl-11 w-full"
                          placeholder="Re-enter your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* School Selector */}
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                      Your School / Institution
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      {schoolsLoading ? (
                        <div className="input-field !pl-11 flex items-center gap-2 text-slate-400">
                          <Loader2 className="w-4 h-4 animate-spin" /> Loading schools...
                        </div>
                      ) : (
                        <select
                          name="school_id"
                          required
                          className="input-field !pl-11 w-full appearance-none bg-white cursor-pointer"
                          value={formData.school_id}
                          onChange={handleChange}
                        >
                          <option value="">— Select your school —</option>
                          {schools.length > 0 ? (
                            schools.map(school => (
                              <option key={school.id} value={school.id}>
                                {school.name}
                              </option>
                            ))
                          ) : (
                            <option disabled>No schools registered yet</option>
                          )}
                        </select>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Trade + Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                        Field of Study / Trade
                      </label>
                      <div className="relative">
                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                        <select
                          name="trade"
                          required
                          className="input-field !pl-11 w-full appearance-none bg-white cursor-pointer"
                          value={formData.trade}
                          onChange={handleChange}
                        >
                          <option value="">— Select your field —</option>
                          {TRADES.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                        Your Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                        <select
                          name="location"
                          required
                          className="input-field !pl-11 w-full appearance-none bg-white cursor-pointer"
                          value={formData.location}
                          onChange={handleChange}
                        >
                          <option value="">— Select your district —</option>
                          {[...new Set(RWANDA_LOCATIONS)].sort().map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Error Alert */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl flex items-start gap-3"
                      >
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-base font-bold shadow-lg shadow-blue-500/20 disabled:opacity-60"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</>
                    ) : (
                      <><UserPlus className="w-5 h-5" /> Create Student Account</>
                    )}
                  </motion.button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 font-bold hover:underline">
                    Sign in here
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
