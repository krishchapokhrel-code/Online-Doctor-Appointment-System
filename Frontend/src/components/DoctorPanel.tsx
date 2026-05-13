import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Search, Bell, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import logo from '../assets/ah_logo.png';
import DoctorOverview from './DoctorOverview';
import DoctorSchedule from './DoctorSchedule';
import DoctorPatients from './DoctorPatients';

export default function DoctorPanel() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DoctorOverview />;
      case 'schedule':
        return <DoctorSchedule />;
      case 'patients':
        return <DoctorPatients />;
      default:
        return <DoctorOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden">
      {/* Sidebar */}
      <div className="w-[230px] bg-white border-r border-card-border flex flex-col justify-between flex-shrink-0 z-20">
        <div>
          <div className="h-[70px] flex items-center px-6 border-b border-card-border gap-2">
            <img src={logo} alt="Aura Health" className="h-14 w-auto object-contain" />
          </div>

          <div className="p-4 space-y-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'overview' ? 'bg-[#f0f7fa] text-primary' : 'text-text-sec hover:bg-gray-50'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'schedule' ? 'bg-[#f0f7fa] text-primary' : 'text-text-sec hover:bg-gray-50'}`}
            >
              <Calendar className="w-5 h-5" />
              Schedule
            </button>
            <button 
              onClick={() => setActiveTab('patients')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'patients' ? 'bg-[#f0f7fa] text-primary' : 'text-text-sec hover:bg-gray-50'}`}
            >
              <Users className="w-5 h-5" />
              Patients
            </button>
          </div>
        </div>

        <div className="p-4 space-y-1 border-t border-card-border">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-text-sec hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-text-sec hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-[58px] bg-white border-b border-card-border flex items-center justify-between px-6 flex-shrink-0 z-10">
          <div className="flex-1 max-w-[380px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-mut" />
              <input 
                type="text" 
                placeholder="Search patients, records…" 
                className="w-full bg-input-bg border border-input-border pl-9 pr-4 py-1.5 rounded-full text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-text-main placeholder-text-mut"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-text-mut hover:text-text-main transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div className="h-6 w-[1px] bg-card-border mx-1"></div>
            
            <button className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                Dr
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-semibold text-text-main leading-tight">Dr. Aasha Poudel</div>
                <div className="text-xs text-text-mut font-medium">Cardiologist</div>
              </div>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
