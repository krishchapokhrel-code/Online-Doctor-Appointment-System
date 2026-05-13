import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

import Login from './components/Login.tsx';
import Signup from './components/Signup.tsx';
import Dashboard from './components/Dashboard.tsx';
import DoctorPanel from './components/DoctorPanel.tsx';
import ChatbotInterface from './components/ChatbotInterface.tsx';
import AppointmentBooking from './components/AppointmentBooking.tsx';
import AdminPanel from './components/AdminPanel.tsx';

function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: 'patient' | 'doctor' | 'admin' }) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user?.role !== role) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to={user?.role === 'doctor' ? '/doctor-panel' : '/dashboard'} replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Patient Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute role="patient">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/chatbot" element={
          <ProtectedRoute role="patient">
            <ChatbotInterface />
          </ProtectedRoute>
        } />
        <Route path="/booking" element={
          <ProtectedRoute role="patient">
            <AppointmentBooking />
          </ProtectedRoute>
        } />

        {/* Doctor Routes */}
        <Route path="/doctor-panel" element={
          <ProtectedRoute role="doctor">
            <DoctorPanel />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminPanel />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
