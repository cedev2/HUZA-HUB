import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, GraduationCap, CheckCircle, ChevronRight, ArrowRight, ShieldCheck, Zap, Globe, MessageSquare, Mail, Phone, MapPin, Send, Users, Clock, DollarSign, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut' }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.15 } }
};

const TypewriterHeading = () => {
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [line3, setLine3] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const lines = ["Learning", "FUTURE", "AI-Ready!"];

  useEffect(() => {
    let isMounted = true;
    
    const runSequence = async () => {
      while (isMounted) {
        // Clear all
        setLine1(''); setLine2(''); setLine3('');
        
        // Type line 1
        for (let i = 0; i <= lines[0].length; i++) {
          if (!isMounted) return;
          setLine1(lines[0].slice(0, i));
          await new Promise(r => setTimeout(r, 100));
        }
        await new Promise(r => setTimeout(r, 500));

        // Type line 2
        for (let i = 0; i <= lines[1].length; i++) {
          if (!isMounted) return;
          setLine2(lines[1].slice(0, i));
          await new Promise(r => setTimeout(r, 100));
        }
        await new Promise(r => setTimeout(r, 500));

        // Type line 3
        for (let i = 0; i <= lines[2].length; i++) {
          if (!isMounted) return;
          setLine3(lines[2].slice(0, i));
          await new Promise(r => setTimeout(r, 100));
        }
        
        // Pause at end before restart
        await new Promise(r => setTimeout(r, 3000));
      }
    };

    runSequence();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const Cursor = () => <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 text-blue-500`}>|</span>;

  return (
    <>
      {line1}<Cursor /> <br />
      <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">
        {line2}{line2 && <Cursor />}
      </span> <br />
      {line3}{line3 && <Cursor />}
    </>
  );
};

export default function Landing() {
  const [status, setStatus] = useState({ type: '', message: '' });
  const [internships, setInternships] = useState([]);
  const [sitePartners, setSitePartners] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const storedUser = localStorage.getItem('user');
  const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  useEffect(() => {
    api.get('/internships')
      .then(res => setInternships(Array.isArray(res.data) ? res.data.slice(0, 5) : []))
      .catch(() => {});
      
    api.get('/site_partners')
      .then(res => setSitePartners(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white min-h-screen font-inter overflow-x-hidden relative">
      {/* Global subtle background texture */}
      <div className="fixed inset-0 z-0 opacity-[0.1] pointer-events-none" 
           style={{ 
             backgroundImage: 'url(/bg2.png)', 
             backgroundSize: 'cover',
             backgroundPosition: 'center'
           }}>
      </div>
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 md:px-16 py-2">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="HUZA HUB Logo" className="h-16 md:h-24 w-auto" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <a href="#" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">Home</a>
          <Link to="/opportunities" className="text-slate-600 font-medium hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span> Opportunities
          </Link>
          <a href="#about" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">About Us</a>
          <a href="#partners" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Partners</a>
          <a href="#testimonials" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Testimonials</a>
          <a href="#contact" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden sm:flex items-center gap-6">
            {user ? (
              <Link to={`/${user.role}`} className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-slate-700 font-bold hover:text-blue-600 transition-colors">Log in</Link>
                <Link to="/register" className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">Sign up</Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-blue-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[80px] left-0 w-full bg-white shadow-2xl z-[49] border-b border-slate-100 p-8 lg:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              <a href="#" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-blue-600">Home</a>
              <Link to="/opportunities" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-slate-700">Opportunities</Link>
              <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-slate-700">About Us</a>
              <a href="#partners" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-slate-700">Partners</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-slate-700">Contact</a>
              
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-4 sm:hidden">
                {user ? (
                  <Link to={`/${user.role}`} onClick={() => setIsMenuOpen(false)} className="bg-blue-600 text-white font-bold py-4 rounded-2xl">Dashboard</Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-slate-700 font-bold py-4 bg-slate-50 rounded-2xl">Log in</Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="bg-blue-600 text-white font-bold py-4 rounded-2xl">Sign up</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-6 md:px-16 bg-white overflow-hidden">
        {/* Hero Background Image with Parallax and Zoom Effect */}
        <motion.div className="absolute inset-0 z-0" 
             animate={{ scale: [1, 1.1, 1] }}
             transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
             style={{ 
               backgroundImage: 'url(/bg2.png)', 
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundAttachment: 'fixed',
               opacity: 1.0
             }}>
        </motion.div>
        
        {/* Stronger Gradient Overlay for full-opacity background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-white via-white/70 to-blue-50/40"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Hero Content - Left Aligned */}
          <div className="text-left">

            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-slate-900 mb-8 font-outfit leading-[1.1] tracking-tight"
            >
              <TypewriterHeading />
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 mb-12 max-w-lg leading-relaxed font-medium"
            >
              AI-powered learning platform that combines expert-led courses with AI coaching, adaptive quizzes, and performance analytics to help you master skills and stay on tech track. <span className="font-bold text-slate-800">Make your future AI-ready today!</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/register" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-5 rounded-2xl shadow-2xl shadow-blue-400/40 transition-all active:scale-95 text-lg">
                Start Learning
              </Link>
            </motion.div>
          </div>

          <div className="hidden lg:block lg:col-span-1"></div>

        </div>
      </section>


      {/* Roles Section */}
      <motion.section 
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 px-8 max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 font-outfit">One Platform, Three Perspectives</motion.h2>
          <motion.p variants={fadeInUp} className="text-slate-600 text-base">Tailored experiences for everyone in the ecosystem</motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { 
              title: "For Students", 
              icon: GraduationCap, 
              desc: "Discover internships that match your skills. Apply easily and track your progress from start to finish.",
              color: "bg-blue-600",
              shadow: "shadow-blue-500/10"
            },
            { 
              title: "For Companies", 
              icon: Briefcase, 
              desc: "Post openings, manage applications, and find the next generation of talent for your team.",
              color: "bg-emerald-600",
              shadow: "shadow-emerald-500/10"
            },
            { 
              title: "For Schools", 
              icon: Building2, 
              desc: "Monitor student activities, manage partnerships with companies, and ensure successful placements.",
              color: "bg-purple-600",
              shadow: "shadow-purple-500/10"
            }
          ].map((role, idx) => (
            <motion.div 
              key={idx} 
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl ${role.shadow} hover:shadow-2xl transition-all group`}
            >
              <div className={`w-16 h-16 ${role.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-black/5 text-white transform group-hover:rotate-6 transition-transform`}>
                <role.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{role.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{role.desc}</p>
              <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all cursor-pointer text-base">
                Explore Role <ChevronRight className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Live Internships Section ── */}
      <motion.section
        id="opportunities"
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: '-80px' }}
        className="py-24 px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <motion.div variants={fadeInUp} className="text-blue-600 font-bold mb-3 flex items-center gap-3 text-sm uppercase tracking-widest">
                <span className="w-8 h-1 bg-blue-600 rounded-full" /> Live Opportunities
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-black text-slate-900 font-outfit">
                Latest Internship Openings
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-500 mt-2">
                Freshly posted by top companies — apply before they're gone!
              </motion.p>
            </div>
            <motion.div variants={fadeInUp}>
              <Link
                to="/opportunities"
                className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all text-sm"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Cards Grid — max 5 */}
          {internships.length === 0 ? (
            <motion.div variants={fadeInUp} className="text-center py-16 text-slate-400">
              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No openings yet — check back soon!</p>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
              >
                {internships.map((intern, index) => {
                  const isFree = !intern.is_paid || intern.is_paid == 0;
                  return (
                    <motion.div
                      key={intern.id}
                      variants={fadeInUp}
                      whileHover={{ y: -6, boxShadow: '0 24px 60px -10px rgba(59,130,246,0.14)' }}
                      className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7 flex flex-col gap-4 group transition-all hover:border-blue-100 hover:shadow-lg"
                    >
                      {/* Top: icon + badge */}
                      <div className="flex items-start justify-between">
                        <div className="w-16 h-16 grad-blue rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/20 transform group-hover:rotate-6 transition-transform duration-300">
                          {intern.company_name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        {isFree ? (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-[11px] font-black uppercase border border-emerald-200">Free</span>
                        ) : (
                          <div className="flex flex-col items-end gap-1">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-xl text-[11px] font-black uppercase border border-blue-200">Paid</span>
                            {intern.fee && (
                              <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-xl text-[11px] font-black border border-amber-200 flex items-center gap-1">
                                <DollarSign className="w-2.5 h-2.5" />{intern.fee}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Title + Company */}
                      <div>
                        <h3 className="text-base font-black text-slate-900 font-outfit group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 mb-1">
                          {intern.title}
                        </h3>
                        <p className="text-sm text-slate-500 font-semibold truncate">{intern.company_name}</p>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-col gap-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 font-medium truncate">
                          <MapPin className="w-4 h-4 flex-shrink-0 text-slate-400" />{intern.location}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-4 h-4 flex-shrink-0 text-slate-400" />{intern.duration}
                        </span>
                        <span className="flex items-center gap-1.5 font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full w-fit">
                          <Zap className="w-4 h-4 flex-shrink-0" />Deadline: {intern.deadline}
                        </span>
                      </div>

                      {/* Skills */}
                      {intern.skills_required && (
                        <div className="flex flex-wrap gap-1">
                          {intern.skills_required.split(',').slice(0, 3).map(tag => (
                            <span key={tag.trim()} className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl text-xs font-bold">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      <div className="mt-auto pt-3 border-t border-slate-100">
                        <Link
                          to="/opportunities"
                          className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/15"
                        >
                          Apply Now <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Explore More button */}
              <motion.div variants={fadeInUp} className="flex justify-center mt-10">
                <Link
                  to="/opportunities"
                  className="inline-flex items-center gap-3 px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 text-sm active:scale-95"
                >
                  Explore All Opportunities <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </motion.section>

      {/* About Us Section */}
      <motion.section 
        id="about" 
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        className="py-32 px-8 bg-slate-50 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="md:w-1/2">
            <motion.div 
              variants={fadeInUp}
              className="text-blue-600 font-bold mb-6 flex items-center gap-3 text-lg"
            >
              <span className="w-12 h-1 bg-blue-600 rounded-full"></span> Our Mission
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-xl md:text-2xl font-bold text-slate-900 mb-6 font-outfit leading-tight">Empowering the Next Generation of Professionals</motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-600 text-base leading-relaxed mb-10">
              HUZA HUB is more than just a job board. We are a comprehensive ecosystem dedicated to bridging the gap between academic learning and professional excellence. By connecting students, schools, and companies in a unified platform, we create a transparent and efficient roadmap for career success.
            </motion.p>
            <div className="grid grid-cols-2 gap-10">
              <motion.div variants={fadeInUp}>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4"><CheckCircle className="text-blue-600 w-6 h-6" /></div>
                <h4 className="font-bold text-xl text-slate-900 mb-2">Transparency</h4>
                <p className="text-slate-600 text-sm leading-relaxed">Real-time tracking of applications and feedback loops for total visibility.</p>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4"><Zap className="text-emerald-600 w-6 h-6" /></div>
                <h4 className="font-bold text-xl text-slate-900 mb-2">Accessibility</h4>
                <p className="text-slate-600 text-sm leading-relaxed">Equal opportunities for all students across partnered institutions.</p>
              </motion.div>
            </div>
          </div>
          <motion.div 
            variants={fadeInUp}
            className="md:w-1/2 relative"
          >

            <div className="relative glass p-12 rounded-[3.5rem] border border-white/20 shadow-2xl backdrop-blur-sm overflow-hidden group">
               {/* Replaced placeholders with a clean, branded visual element or just removed them */}
               <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/40 rotate-6 group-hover:rotate-12 transition-transform duration-500">
                      <ShieldCheck className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 font-outfit mb-4">Secured & Verified</h3>
                    <p className="text-slate-600 font-medium">Connecting the best talent with top industry leaders.</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Partners Section (Marquee) */}
      <motion.section 
        id="partners" 
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        className="py-32 bg-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto text-center px-8 mb-16">
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-slate-900 mb-4 font-outfit">Trusted by Industry Leaders</motion.h2>
          <motion.p variants={fadeInUp} className="text-slate-600 text-lg">We partner with top universities and world-class companies.</motion.p>
        </div>

        {sitePartners.length > 0 ? (
          <div className="relative flex overflow-x-hidden group">
            {sitePartners.length > 3 ? (
              <motion.div 
                className="flex whitespace-nowrap gap-20 py-10"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ 
                  duration: sitePartners.length * 5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                {[...sitePartners, ...sitePartners].map((partner, idx) => (
                  <div key={`${partner.id}-${idx}`} className="flex items-center gap-4 text-3xl font-black text-slate-300 grayscale hover:grayscale-0 transition-all duration-500 group/item cursor-pointer">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-sm border border-slate-100 group-hover/item:border-blue-200 transition-colors">
                      {partner.logo_url ? (
                        <img src={`http://localhost/HUZA HUB/backend/${partner.logo_url}`} alt={partner.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <Building2 className="w-8 h-8 text-slate-300 group-hover/item:text-blue-500 transition-colors" />
                      )}
                    </div>
                    <span className="group-hover/item:text-slate-900 transition-colors">{partner.name}</span>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="flex justify-center w-full gap-20 py-10">
                {sitePartners.map((partner) => (
                  <div key={partner.id} className="flex items-center gap-4 text-3xl font-black text-slate-300 grayscale hover:grayscale-0 transition-all duration-500 group/item cursor-pointer">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-sm border border-slate-100 group-hover/item:border-blue-200 transition-colors">
                      {partner.logo_url ? (
                        <img src={`http://localhost/HUZA HUB/backend/${partner.logo_url}`} alt={partner.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <Building2 className="w-8 h-8 text-slate-300 group-hover/item:text-blue-500 transition-colors" />
                      )}
                    </div>
                    <span className="group-hover/item:text-slate-900 transition-colors">{partner.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 italic">
             No partners added yet.
          </div>
        )}
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        id="testimonials" 
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        className="py-32 px-8 bg-slate-50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold mb-4 font-outfit text-slate-900">What Our Users Say</motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-500 text-base">Success stories from students and companies powered by HUZA HUB.</motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                text: "HUZA HUB transformed my internship search! Within two weeks, I was interviewed and placed at a top tech firm. The tracking feature kept me informed at every step.",
                name: "Sarah Johnson",
                role: "Software Engineering Student",
                initials: "SJ",
                color: "bg-blue-600"
              },
              {
                text: "Finding qualified interns used to take weeks. With HUZA HUB, we access a pool of pre-verified talent from top universities instantly. It's a game-changer for our HR team.",
                name: "Mark Davis",
                role: "HR Director, TechNova Solutions",
                initials: "MD",
                color: "bg-emerald-600"
              }
            ].map((t, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="p-12 bg-white backdrop-blur-md rounded-[3rem] border border-slate-100 shadow-xl relative"
              >
                <div className="mb-8 flex gap-1">
                  {[1,2,3,4,5].map(i => <Zap key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-lg text-slate-600 mb-8 italic leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 ${t.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl`}>{t.initials}</div>
                  <div>
                    <h4 className="font-bold text-xl text-slate-900">{t.name}</h4>
                    <p className="text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Trust Section */}
      <motion.section 
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        className="py-32 bg-white"
      >
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900 font-outfit">Designed for Your <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">Growth and Success</span></h2>
            <div className="space-y-6">
              {[
                "Seamless Career Placement",
                "Verified Company Network",
                "Smart Application Tracking",
                "24/7 Professional Support"
              ].map(item => (
                <motion.div key={item} variants={fadeInUp} className="flex items-center gap-4">
                  <div className="w-6 h-6 grad-blue rounded-full flex items-center justify-center text-white shadow-lg">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-base text-slate-700 font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="md:w-1/2 bg-blue-600 p-12 rounded-[3.5rem] shadow-2xl relative text-white border border-blue-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 font-outfit">Ready to join?</h3>
            <p className="text-blue-50 text-base mb-10">Join over 500+ students and 50+ companies already using HUZA HUB to shape the future.</p>
            <Link to="/register" className="bg-white text-blue-600 font-bold w-full py-4 rounded-2xl shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3">
              Get Started for Free <ChevronRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        id="contact" 
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        className="py-32 px-8 bg-slate-50 relative overflow-hidden"
      >
        {/* Contact section background image */}
        <div className="absolute inset-0 z-0 opacity-[0.5]" 
             style={{ 
               backgroundImage: 'url(/bg2.png)', 
               backgroundSize: 'cover',
               backgroundPosition: 'bottom'
             }}>
        </div>
        
        {/* Gradient overlay to ensure form contrast */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-50 via-slate-50/60 to-slate-50"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Contact Info */}
            <div className="text-left">
              <motion.div variants={fadeInUp}>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 font-outfit">Get in Touch</h2>
                <p className="text-slate-600 mb-10 text-base max-w-md">Have questions? We're here to help you navigate your journey with HUZA HUB. Reach out through any of our channels.</p>
              </motion.div>
              
              <div className="space-y-8">
                {[
                  { icon: Mail, label: 'Email Us', value: 'support@huzahub.com', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { icon: Phone, label: 'Call Us', value: '+250 788 000 000', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { icon: MapPin, label: 'Office', value: 'Kigali Heights, 4th Floor, Kigali', color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    variants={fadeInUp}
                    className="flex items-center gap-6 group cursor-pointer"
                  >
                    <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform shadow-sm`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-lg font-bold text-slate-900 font-outfit">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-16 flex gap-4">
                {[Globe, Mail, MessageSquare, Users].map((Icon, i) => (
                  <motion.a 
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.1, y: -3 }}
                    className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 shadow-sm transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Right: The Form */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-premium border border-slate-100 relative overflow-hidden"
            >

              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData);
                try {
                  const res = await api.post('/contact', data);
                  setStatus({ type: 'success', message: res.data.message });
                  e.target.reset();
                  setTimeout(() => setStatus({ type: '', message: '' }), 5000);
                } catch (err) {
                  setStatus({ type: 'error', message: 'Failed to send message.' });
                  setTimeout(() => setStatus({ type: '', message: '' }), 5000);
                }
              }} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-[0.1em]">Name</label>
                    <input name="name" required className="w-full px-5 py-4 rounded-2xl border-none bg-slate-50 focus:ring-2 focus:ring-blue-500 font-medium text-sm transition-all text-slate-900" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-[0.1em]">Email</label>
                    <input name="email" type="email" required className="w-full px-5 py-4 rounded-2xl border-none bg-slate-50 focus:ring-2 focus:ring-blue-500 font-medium text-sm transition-all text-slate-900" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-[0.1em]">Message</label>
                  <textarea name="message" required rows="4" className="w-full px-5 py-4 rounded-2xl border-none bg-slate-50 focus:ring-2 focus:ring-blue-500 font-medium text-sm transition-all resize-none text-slate-900" placeholder="Your message here..."></textarea>
                </div>

                {status.message && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}
                  >
                    {status.message}
                  </motion.div>
                )}

                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full grad-blue text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-500/20 text-sm flex items-center justify-center gap-3 group"
                >
                  Send Message <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer Section */}
      <footer className="bg-white pt-24 pb-12 px-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 text-left">
            {/* Column 1: Brand & Social */}
            <div>
              <div className="text-2xl font-bold text-blue-600 font-outfit mb-6">HUZA HUB</div>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Empowering the next generation of professionals through an AI-powered learning and internship ecosystem.
              </p>
              <div className="flex gap-4">
                {[Globe, Mail, MessageSquare, Users].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">Quick Links</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Home</a></li>
                <li><a href="#about" className="text-slate-500 hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="#partners" className="text-slate-500 hover:text-blue-600 transition-colors">Partners</a></li>
                <li><a href="#testimonials" className="text-slate-500 hover:text-blue-600 transition-colors">Success Stories</a></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">Resources</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">Stay Updated</h4>
              <p className="text-slate-500 text-sm mb-6">Join our newsletter to get the latest updates and news.</p>
              <form className="relative">
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 text-sm font-medium placeholder:text-slate-400 text-slate-900"
                />
                <button 
                  type="button"
                  className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-400 text-sm font-medium italic">© 2026 HUZA HUB. Crafted for excellence.</p>
            <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="hover:text-blue-600 cursor-pointer">Built in Rwanda</span>
              <span className="hover:text-blue-600 cursor-pointer">Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
