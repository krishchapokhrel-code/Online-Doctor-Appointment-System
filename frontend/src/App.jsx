import React, { useState } from 'react';
import './styles/App.css';
import { api } from './api/api';

// Components
import Sidebar from './components/Sidebar';

// Pages
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import FindDoctors from './pages/patient/FindDoctors';
import DoctorDetail from './pages/patient/DoctorDetail';
import PatientAppointments from './pages/patient/PatientAppointments';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorProfile from './pages/doctor/DoctorProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminAppointments from './pages/admin/AdminAppointments';

export default function App() {
  const [user, setUser] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [page, setPage] = useState('home');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const defaultPage = (u) => {
    if (u.role === 'admin') return 'admin-dashboard';
    if (u.role === 'doctor') return 'doc-dashboard';
    return 'home';
  };

  const handleLogin = async (userData) => {
    setUser(userData);
    if (userData.role === 'doctor' && userData.doctor_id) {
      const dp = await api.get(`/doctors/${userData.doctor_id}`);
      setDoctorProfile(dp);
    }
    setPage(defaultPage(userData));
  };

  const handleLogout = () => { 
    setUser(null); 
    setDoctorProfile(null); 
    setPage('home'); 
  };

  const renderPage = () => {
    // Patient pages
    if (page === 'home') return <PatientDashboard user={user} setPage={setPage} />;
    if (page === 'doctors') return <FindDoctors user={user} setPage={setPage} setSelectedDoctor={setSelectedDoctor} />;
    if (page === 'doctor-detail') return <DoctorDetail doctor={selectedDoctor} user={user} onBack={() => setPage('doctors')} />;
    if (page === 'appointments') return <PatientAppointments user={user} />;
    if (page === 'chat') return <ChatPage user={user} doctorProfile={doctorProfile} />;
    
    // Doctor pages
    if (page === 'doc-dashboard') return <DoctorDashboard user={user} doctorProfile={doctorProfile} />;
    if (page === 'doc-appointments') return <DoctorAppointments user={user} doctorProfile={doctorProfile} />;
    if (page === 'doc-profile') return <DoctorProfile user={user} doctorProfile={doctorProfile} setDoctorProfile={setDoctorProfile} />;
    if (page === 'doc-chat') return <ChatPage user={user} doctorProfile={doctorProfile} />;
    
    // Admin pages
    if (page === 'admin-dashboard') return <AdminDashboard />;
    if (page === 'admin-doctors') return <AdminDoctors />;
    if (page === 'admin-appointments') return <AdminAppointments />;
    
    return <div className="empty-state"><p>Page not found.</p></div>;
  };

  if (!user) return (
    <AuthPage onLogin={handleLogin} />
  );

  return (
    <div className="app">
      <Sidebar user={user} doctorProfile={doctorProfile} activePage={page} setPage={setPage} onLogout={handleLogout} />
      <main className="main">
        {renderPage()}
      </main>
    </div>
  );
}
