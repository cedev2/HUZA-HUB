import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import SchoolDashboard from './pages/SchoolDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Settings from './pages/Settings';
import AdminSchools from './pages/admin/AdminSchools';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminStudents from './pages/admin/AdminStudents';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminPartnerships from './pages/admin/AdminPartnerships';
import AdminSitePartners from './pages/admin/AdminSitePartners';
import StudentApplications from './pages/StudentApplications';
import CompanyApplicants from './pages/CompanyApplicants';
import PostInternship from './pages/PostInternship';
import Profile from './pages/Profile';
import StudentSaved from './pages/StudentSaved';
import CompanyMessages from './pages/CompanyMessages';
import FeatureComingSoon from './pages/FeatureComingSoon';
import SchoolStudents from './pages/SchoolStudents';
import SchoolPartnerships from './pages/SchoolPartnerships';
import Opportunities from './pages/Opportunities';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.02 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();
  const storedUser = localStorage.getItem('user');
  const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  // Protected Route Logic
  const ProtectedRoute = ({ children, role }) => {
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    return children;
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/opportunities" element={<PageTransition><Opportunities /></PageTransition>} />
        
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <PageTransition><AdminDashboard /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/admin/profile" element={
          <ProtectedRoute role="admin">
            <PageTransition><Profile /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/admin/schools" element={
          <ProtectedRoute role="admin">
            <PageTransition><AdminSchools /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/admin/companies" element={
          <ProtectedRoute role="admin">
            <PageTransition><AdminCompanies /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/admin/students" element={
          <ProtectedRoute role="admin">
            <PageTransition><AdminStudents /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute role="admin">
            <PageTransition><AdminAnalytics /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/admin/site-partners" element={
          <ProtectedRoute role="admin">
            <PageTransition><AdminSitePartners /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/admin/partnerships" element={
          <ProtectedRoute role="admin">
            <PageTransition><AdminPartnerships /></PageTransition>
          </ProtectedRoute>
        } />
        
        <Route path="/school" element={
          <ProtectedRoute role="school">
            <PageTransition><SchoolDashboard /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/school/profile" element={
          <ProtectedRoute role="school">
            <PageTransition><Profile /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/school/students" element={
          <ProtectedRoute role="school">
            <PageTransition><SchoolStudents /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/school/partnerships" element={
          <ProtectedRoute role="school">
            <PageTransition><SchoolPartnerships /></PageTransition>
          </ProtectedRoute>
        } />
        
        <Route path="/company" element={
          <ProtectedRoute role="company">
            <PageTransition><CompanyDashboard /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/company/applicants" element={
          <ProtectedRoute role="company">
            <PageTransition><CompanyApplicants /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/company/post" element={
          <ProtectedRoute role="company">
            <PageTransition><PostInternship /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/company/messages" element={
          <ProtectedRoute role="company">
            <PageTransition><CompanyMessages /></PageTransition>
          </ProtectedRoute>
        } />
        
        <Route path="/student" element={
          <ProtectedRoute role="student">
            <PageTransition><StudentDashboard /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/student/applications" element={
          <ProtectedRoute role="student">
            <PageTransition><StudentApplications /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/student/saved" element={
          <ProtectedRoute role="student">
            <PageTransition><StudentSaved /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/student/profile" element={
          <ProtectedRoute role="student">
            <PageTransition><Profile /></PageTransition>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <PageTransition><Settings /></PageTransition>
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
