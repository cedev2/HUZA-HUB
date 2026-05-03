import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Search, MapPin, Clock, Briefcase, Filter, Bookmark, Zap, ArrowRight,
  X, CheckCircle2, Loader2, Send, Phone, Building2, FileUp, BookOpen,
  DollarSign, Gift, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const RWANDA_LOCATIONS = [
  'Kigali City', 'Gasabo', 'Kicukiro', 'Nyarugenge',
  'Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Rwamagana',
  'Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo',
  'Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango',
  'Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rutsiro', 'Rusizi',
];

function ApplyModal({ internship, onClose, onSuccess, schools, profile }) {
  const isFree = !internship.is_paid || internship.is_paid == 0;

  const [form, setForm] = useState({
    cover_letter: '',
    phone: '',
    school_id: profile?.school_id || '',
    school_location: profile?.location || '',
    trade: profile?.trade || '',
    contact_email: profile?.email || '',
  });
  const [pdfLetter, setPdfLetter] = useState(null);
  const [reportPdf, setReportPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleApply = async () => {
    setLoading(true);
    setError('');

    try {
      if (isFree) {
        // Multipart for free internships (with file upload)
        const data = new FormData();
        data.append('internship_id', internship.id);
        data.append('cover_letter', form.cover_letter);
        data.append('phone', form.phone);
        const selectedSchool = schools.find(s => String(s.id) === String(form.school_id));
        data.append('school_name', selectedSchool?.name || '');
        data.append('school_location', form.school_location);
        if (pdfLetter) data.append('pdf_letter', pdfLetter);
        if (reportPdf) data.append('report_pdf', reportPdf);
        data.append('trade', form.trade);

        await api.post('/applications', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // JSON for paid internships — include contact email
        await api.post('/applications', {
          internship_id: internship.id,
          cover_letter: form.cover_letter,
          contact_email: form.contact_email,
        });
      }

      setDone(true);
      setTimeout(() => {
        onSuccess(internship.id);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white rounded-[2.5rem] p-8 w-full max-w-xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center py-10 text-center"
            >
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 font-outfit mb-2">Application Sent!</h3>
              <p className="text-slate-500">Track your progress in <strong>My Applications</strong>.</p>
            </motion.div>
          ) : (
            <motion.div key="form">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 grad-blue rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                    {internship.company_name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-lg font-black text-slate-900 font-outfit">{internship.title}</h3>
                      {isFree ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-200 uppercase">Free</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full border border-blue-200 uppercase">Paid</span>
                      )}
                    </div>
                    <p className="text-slate-500 text-sm">{internship.company_name}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Details */}
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
                  <MapPin className="w-3.5 h-3.5" /> {internship.location}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
                  <Clock className="w-3.5 h-3.5" /> {internship.duration}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-xl text-xs font-semibold text-red-500">
                  <Zap className="w-3.5 h-3.5" /> Deadline: {internship.deadline}
                </span>
              </div>

              <div className="space-y-4">
                {/* FREE internship extra fields */}
                {isFree && (
                  <>
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm text-emerald-700 font-medium">
                      📋 This is a <strong>free / government internship</strong>. Please fill in all required details including your school letter.
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                        <input
                          name="phone"
                          required
                          type="tel"
                          placeholder="+250 7XX XXX XXX"
                          value={form.phone}
                          onChange={handleChange}
                          className="input-field !pl-11 w-full"
                        />
                      </div>
                    </div>

                    {/* Academic Information Section */}
                    <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-[2rem] space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                          <GraduationCap className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider font-outfit">Academic Information</h4>
                      </div>

                      {/* School */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                          Current School <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                          <select
                            name="school_id"
                            required
                            value={form.school_id}
                            onChange={handleChange}
                            className="input-field !pl-11 w-full appearance-none bg-white border-slate-200 focus:border-blue-500"
                          >
                            <option value="">— Select your school —</option>
                            {schools.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Field of Study */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                          Field of Study / Trade <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                          <input
                            name="trade"
                            required
                            type="text"
                            placeholder="e.g. Computer Science"
                            value={form.trade}
                            onChange={handleChange}
                            className="input-field !pl-11 w-full border-slate-200 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {/* School Location */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                          School Location <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                          <select
                            name="school_location"
                            required
                            value={form.school_location}
                            onChange={handleChange}
                            className="input-field !pl-11 w-full appearance-none bg-white border-slate-200 focus:border-blue-500"
                          >
                            <option value="">— Select district —</option>
                            {[...new Set(RWANDA_LOCATIONS)].sort().map(loc => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* School Letter PDF */}
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                        School Request Letter (PDF) <span className="text-red-400">*</span>
                      </label>
                      <label className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${pdfLetter ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/40'}`}>
                        <FileUp className={`w-5 h-5 ${pdfLetter ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span className={`text-sm font-medium ${pdfLetter ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {pdfLetter ? `✓ ${pdfLetter.name}` : 'Upload school letter (PDF)'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={e => setPdfLetter(e.target.files[0])}
                        />
                      </label>
                    </div>

                    {/* Report PDF */}
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                        Internship Report (PDF) <span className="text-slate-400 font-medium normal-case">optional</span>
                      </label>
                      <label className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${reportPdf ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/40'}`}>
                        <BookOpen className={`w-5 h-5 ${reportPdf ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span className={`text-sm font-medium ${reportPdf ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {reportPdf ? `✓ ${reportPdf.name}` : 'Upload internship report (PDF)'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={e => setReportPdf(e.target.files[0])}
                        />
                      </label>
                    </div>
                  </>
                )}

                {/* PAID internship - email contact field */}
                {!isFree && (
                  <div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-sm text-blue-700 font-medium mb-4">
                      💰 This is a <strong>paid internship</strong>. Please provide your email for the company to contact you.
                    </div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                      Contact Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      <input
                        name="contact_email"
                        required
                        type="email"
                        placeholder="your@email.com"
                        value={form.contact_email}
                        onChange={handleChange}
                        className="input-field !pl-11 w-full"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                    Cover Letter <span className="text-slate-400 font-medium normal-case">optional</span>
                  </label>
                  <textarea
                    name="cover_letter"
                    rows={4}
                    value={form.cover_letter}
                    onChange={handleChange}
                    placeholder="Tell them why you're the perfect fit for this role..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none leading-relaxed"
                  />
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-2xl border border-red-100"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApply}
                    disabled={loading}
                    className="flex-1 btn-primary py-3.5 flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function StudentDashboard() {
  const [internships, setInternships] = useState([]);
  const [schools, setSchools] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'free', 'paid'
  const [applyTarget, setApplyTarget] = useState(null);
  const [applied, setApplied] = useState(new Set());

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [intRes, appRes, schoolRes, profileRes] = await Promise.all([
          api.get('/internships'),
          api.get('/applications'),
          api.get('/schools'),
          api.get('/students/me'),
        ]);
        setInternships(intRes.data);
        setApplied(new Set(appRes.data.map(a => String(a.internship_id))));
        setSchools(Array.isArray(schoolRes.data) ? schoolRes.data : []);
        setProfile(profileRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

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
      i.location?.toLowerCase().includes(search.toLowerCase())
    );

  const handleApplySuccess = (internshipId) => {
    setApplied(prev => new Set([...prev, String(internshipId)]));
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-inter relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-blue-400/5 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-emerald-400/5 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />

      <Sidebar role="student" />
      <main className="flex-1 md:ml-64 p-4 md:p-10 pt-20 md:pt-10 relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"
        >
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-outfit tracking-tight">Explore Internships</h1>
            <p className="text-slate-600">Find the perfect opportunity to grow your career</p>
          </div>
        </motion.header>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative mb-6">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by skill, company or location..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-900"
          />
        </motion.div>

        {/* Filter Tabs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex items-center gap-3 mb-8">
          {[
            { key: 'all', label: 'All Internships', icon: Briefcase },
            { key: 'free', label: '🎓 Free / Government', icon: Gift },
            { key: 'paid', label: '💰 Paid', icon: DollarSign },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
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
        </motion.div>

        {/* Cards */}
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="text-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-slate-500 font-medium">Loading opportunities...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No internships found matching your search.</p>
            </div>
          ) : filtered.map((intern) => {
            const alreadyApplied = applied.has(String(intern.id));
            const isFree = !intern.is_paid || intern.is_paid == 0;
            return (
              <motion.div
                key={intern.id}
                variants={fadeInUp}
                whileHover={{ scale: 1.005, y: -3 }}
                className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex items-center justify-between gap-6"
              >
                <div className="flex gap-6 flex-1 min-w-0">
                  <div className="w-16 h-16 grad-blue rounded-2xl flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-black text-2xl transform group-hover:rotate-3 transition-transform">
                    {intern.company_name?.charAt(0) || <Briefcase className="w-8 h-8" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-outfit truncate">{intern.title}</h3>
                      {isFree ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase border border-emerald-200 flex-shrink-0">Free</span>
                      ) : (
                        <>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase border border-blue-200 flex-shrink-0">Paid</span>
                          {intern.fee && (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black border border-amber-200 flex-shrink-0 flex items-center gap-1">
                              <DollarSign className="w-2.5 h-2.5" />{intern.fee}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <p className="text-slate-600 font-medium mb-3">{intern.company_name}</p>
                    <div className="flex items-center gap-5 text-sm text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1.5 font-medium"><MapPin className="w-4 h-4 text-slate-400" /> {intern.location}</span>
                      <span className="flex items-center gap-1.5 font-medium"><Clock className="w-4 h-4 text-slate-400" /> {intern.duration}</span>
                      <span className="flex items-center gap-1.5 text-red-500 font-bold bg-red-50 px-3 py-1 rounded-full text-xs"><Zap className="w-3.5 h-3.5" /> Deadline: {intern.deadline}</span>
                    </div>
                    {intern.skills_required && (
                      <div className="mt-4 flex gap-2 flex-wrap">
                        {intern.skills_required.split(',').slice(0, 4).map(tag => (
                          <span key={tag.trim()} className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-600 rounded-xl text-xs font-bold">{tag.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                    <Bookmark className="w-6 h-6" />
                  </button>
                  {alreadyApplied ? (
                    <div className="flex items-center gap-2 py-3 px-6 rounded-2xl bg-emerald-50 text-emerald-600 font-bold text-sm border border-emerald-200">
                      <CheckCircle2 className="w-5 h-5" /> Applied
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setApplyTarget(intern)}
                      className="btn-primary py-3 px-7 text-sm font-bold shadow-lg shadow-blue-500/10 flex items-center gap-2"
                    >
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      <AnimatePresence>
        {applyTarget && (
          <ApplyModal
            internship={applyTarget}
            schools={schools}
            profile={profile}
            onClose={() => setApplyTarget(null)}
            onSuccess={handleApplySuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
