import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Building2, 
  MessageSquare, 
  Bell, 
  User, 
  LogOut,
  Search,
  CheckCircle,
  Link as LinkIcon,
  Settings,
  BarChart3,
  Globe,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ role }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = {
    admin: [
      { name: 'Overview', path: '/admin', icon: LayoutDashboard },
      { name: 'Manage Schools', path: '/admin/schools', icon: Building2 },
      { name: 'Manage Companies', path: '/admin/companies', icon: Briefcase },
      { name: 'Manage Students', path: '/admin/students', icon: Users },
      { name: 'Manage Partners', path: '/admin/site-partners', icon: Globe },
      { name: 'Partnerships', path: '/admin/partnerships', icon: LinkIcon },
      { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
      { name: 'Settings', path: '/settings', icon: Settings },
    ],
    school: [
      { name: 'Dashboard', path: '/school', icon: LayoutDashboard },
      { name: 'Our Students', path: '/school/students', icon: Users },
      { name: 'Partners', path: '/school/partnerships', icon: Building2 },
      { name: 'Profile', path: '/school/profile', icon: User },
      { name: 'Settings', path: '/settings', icon: Settings },
    ],
    company: [
      { name: 'Dashboard', path: '/company', icon: LayoutDashboard },
      { name: 'Post Internship', path: '/company/post', icon: Briefcase },
      { name: 'Applicants', path: '/company/applicants', icon: Users },
      { name: 'Messages', path: '/company/messages', icon: MessageSquare },
      { name: 'Settings', path: '/settings', icon: Settings },
    ],
    student: [
      { name: 'Feed', path: '/student', icon: Search },
      { name: 'My Applications', path: '/student/applications', icon: Briefcase },
      { name: 'Saved', path: '/student/saved', icon: Bell },
      { name: 'Profile', path: '/student/profile', icon: User },
      { name: 'Settings', path: '/settings', icon: Settings },
    ]
  };

  const currentMenu = menuItems[role] || menuItems['student'];

  const SidebarContent = () => (
    <div className="w-64 h-full bg-slate-900 flex flex-col shadow-2xl rounded-r-[2rem] border-r border-slate-800 transition-all duration-300">
      <div className="p-8 flex items-center gap-3">
        <img src="/logo.png" alt="HUZA HUB Logo" className="h-8 w-auto brightness-200" />
        <h1 className="text-2xl font-bold font-outfit text-white tracking-tight">HUZA HUB</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {currentMenu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group overflow-hidden
              ${isActive 
                ? 'text-white' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'}
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-blue-600 z-[-1]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed top-4 left-4 z-[60] md:hidden">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[55] md:hidden"
            />
            <motion.aside 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen z-[56] md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
