import React, { useState } from 'react';
import Login from './components/Login.tsx';
import Signup from './components/Signup.tsx';
import Dashboard from './components/Dashboard.tsx';

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
    </>
  );
}
