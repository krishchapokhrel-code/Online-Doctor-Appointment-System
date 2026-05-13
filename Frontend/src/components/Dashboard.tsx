import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Asterisk, Settings, LogOut, Search, Bell, MessageSquare,
  LayoutDashboard, Calendar, Users, FileText
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import logo from '../assets/ah_logo.png';
import PatientOverview from './PatientOverview';
import PatientAppointments from './PatientAppointments';
import PatientDoctors from './PatientDoctors';
import PatientRecords from './PatientRecords';

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <PatientOverview />;
      case 'appointments':
        return <PatientAppointments />;
      case 'doctors':
        return <PatientDoctors />;
      case 'records':
        return <PatientRecords />;
      default:
        return <PatientOverview />;
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
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'dashboard' ? 'bg-[#f0f7fa] text-primary' : 'text-text-sec hover:bg-gray-50'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'appointments' ? 'bg-[#f0f7fa] text-primary' : 'text-text-sec hover:bg-gray-50'}`}
            >
              <Calendar className="w-5 h-5" />
              Appointments
            </button>
            <button 
              onClick={() => setActiveTab('doctors')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'doctors' ? 'bg-[#f0f7fa] text-primary' : 'text-text-sec hover:bg-gray-50'}`}
            >
              <Users className="w-5 h-5" />
              Doctors
            </button>
            <button 
              onClick={() => setActiveTab('records')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'records' ? 'bg-[#f0f7fa] text-primary' : 'text-text-sec hover:bg-gray-50'}`}
            >
              <FileText className="w-5 h-5" />
              Records
            </button>
          </div>
        </div>

        <div className="p-4 space-y-1 border-t border-card-border">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors">
            <Asterisk className="w-5 h-5" />
            Emergency Call
          </button>
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
                placeholder="Search medical records, doctors…" 
                className="w-full bg-input-bg border border-input-border pl-9 pr-4 py-1.5 rounded-full text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-text-main placeholder-text-mut"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-text-mut hover:text-text-main transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="text-text-mut hover:text-text-main transition-colors">
              <MessageSquare className="w-5 h-5" />
            </button>
            
            <div className="h-6 w-[1px] bg-card-border mx-1"></div>
            
            <button className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                AS
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-semibold text-text-main leading-tight">Aarav Shrestha</div>
                <div className="text-xs text-text-mut font-medium">#PT-2047</div>
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
