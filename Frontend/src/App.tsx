import React, { useState } from 'react';
import Login from './components/Login.tsx';
import Signup from './components/Signup.tsx';
import Dashboard from './components/Dashboard.tsx';
import DoctorPanel from './components/DoctorPanel.tsx';
import ChatbotInterface from './components/ChatbotInterface.tsx';
import AppointmentBooking from './components/AppointmentBooking.tsx';
import DoctorChat from './components/DoctorChat.tsx';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  return (
    <>
      <div style={{ display: currentScreen === 'login' ? 'block' : 'none' }}>
        <Login onNavigate={handleNavigate} />
      </div>
      <div style={{ display: currentScreen === 'signup' ? 'block' : 'none' }}>
        <Signup onNavigate={handleNavigate} />
      </div>
      <div style={{ display: currentScreen === 'dashboard' ? 'block' : 'none' }}>
        <Dashboard onNavigate={handleNavigate} />
      </div>
      <div style={{ display: currentScreen === 'doctorPanel' ? 'block' : 'none' }}>
        <DoctorPanel onNavigate={handleNavigate} />
      </div>
      <div style={{ display: currentScreen === 'chatbot' ? 'block' : 'none' }}>
        <ChatbotInterface onBack={() => handleNavigate('dashboard')} />
      </div>
      <div style={{ display: currentScreen === 'doctorChat' ? 'block' : 'none' }}>
        <DoctorChat onBack={() => handleNavigate('dashboard')} />
      </div>
      <div style={{ display: currentScreen === 'booking' ? 'block' : 'none' }}>
        <AppointmentBooking 
          onBack={() => handleNavigate('dashboard')} 
          onBook={() => handleNavigate('dashboard')} 
        />
      </div>
    </>
  );
}
