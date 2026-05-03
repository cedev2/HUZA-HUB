import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { Users, Search, Loader2, Mail, GraduationCap, Download, ExternalLink, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => 
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedStudents = Array.isArray(filteredStudents) ? filteredStudents.slice(0, visibleCount) : [];

  return (
    <div className="flex bg-white min-h-screen font-inter transition-colors duration-300">
      <Sidebar role="admin" />
      
      <main className="flex-1 md:ml-64 p-4 md:p-10 pt-20 md:pt-10">
        <header className="mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-outfit">Student Directory</h1>
          <p className="text-slate-500 text-sm md:text-base">View and manage all registered student profiles</p>
        </header>

        <div className="glass-card rounded-[2.5rem] bg-white border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-11 text-sm focus:ring-2 ring-blue-500/20 transition-all text-slate-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-8 py-5">Student</th>
                <th className="px-8 py-5">Academic Info</th>
                <th className="px-8 py-5">Contact</th>
                <th className="px-8 py-5">Joined</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                  </td>
                </tr>
              ) : !Array.isArray(filteredStudents) ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-red-500 font-medium">
                    Error: Invalid data format received from server.
                  </td>
                </tr>
              ) : displayedStudents.map((student) => (
                <tr key={student.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                        {student.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{student.full_name}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">ID: {student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                         <GraduationCap className="w-4 h-4 text-slate-400" /> {student.school_name || 'No School Assigned'}
                      </p>
                      <p className="text-xs text-slate-500">{student.trade || 'General Studies'}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                       <Mail className="w-4 h-4 text-slate-400" /> {student.email}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs text-slate-500 flex items-center gap-2 italic">
                       <Calendar className="w-4 h-4" /> {new Date(student.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors" title="View CV">
                        <Download className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          
          {Array.isArray(filteredStudents) && visibleCount < filteredStudents.length && (
            <div className="p-6 text-center border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setVisibleCount(prev => prev + 5)}
                className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Load More Students
              </button>
            </div>
          )}

          {Array.isArray(filteredStudents) && filteredStudents.length === 0 && !loading && (
            <div className="p-20 text-center">
              <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium font-outfit text-xl">No students found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
