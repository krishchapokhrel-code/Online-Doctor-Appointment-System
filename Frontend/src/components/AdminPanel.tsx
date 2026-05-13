import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import logo from '../assets/ah_logo.png';

export default function AdminPanel() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden">
      {/* Sidebar */}
      <div className="w-[230px] bg-gray-900 text-white flex flex-col justify-between flex-shrink-0 z-20">
        <div>
          <div className="h-[70px] flex items-center px-6 border-b border-gray-800 gap-2 bg-gray-950">
            <span className="font-bold text-xl tracking-tight text-white">Aura Admin</span>
          </div>

          <div className="p-4 space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'users' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <Users className="w-5 h-5" />
              Users & Doctors
            </button>
            <button 
              onClick={() => setActiveTab('system')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'system' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <Activity className="w-5 h-5" />
              System Status
            </button>
          </div>
        </div>

        <div className="p-4 space-y-1 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg font-medium text-sm transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg font-medium text-sm transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-8">
        <h1 className="text-3xl font-bold text-text-main mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-card-border">
            <h3 className="text-text-sec text-sm font-medium mb-2">Total Patients</h3>
            <p className="text-3xl font-bold text-text-main">1,248</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-card-border">
            <h3 className="text-text-sec text-sm font-medium mb-2">Total Doctors</h3>
            <p className="text-3xl font-bold text-text-main">42</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-card-border">
            <h3 className="text-text-sec text-sm font-medium mb-2">Appointments Today</h3>
            <p className="text-3xl font-bold text-text-main">156</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-card-border p-6">
          <h2 className="text-lg font-bold text-text-main mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-text-main">New appointment booked</p>
                  <p className="text-xs text-text-sec">Patient Aarti booked Dr. Aasha</p>
                </div>
                <span className="text-xs text-text-mut">{i * 10} mins ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
