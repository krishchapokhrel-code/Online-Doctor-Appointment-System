import React, { useState } from 'react';
import { Shield, LayoutDashboard, Calendar, Users, FileText, Settings, LogOut, Search, Bell, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import logo from '../assets/ah_logo.png';

interface DoctorPanelProps {
  onNavigate: (screen: string) => void;
}

export default function DoctorPanel({ onNavigate }: DoctorPanelProps) {
  const appointments = [
    { id: 1, name: "Alice Johnson", time: "09:00 AM", type: "Checkup", status: "completed" },
    { id: 2, name: "Michael Smith", time: "10:30 AM", type: "Consultation", status: "upcoming" },
    { id: 3, name: "Emma Davis", time: "11:00 AM", type: "Follow up", status: "upcoming" },
  ];

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden">
      {/* Sidebar */}
      <div className="w-[230px] bg-white border-r border-card-border flex flex-col justify-between flex-shrink-0 z-20">
        <div>
          <div className="h-[70px] flex items-center px-6 border-b border-card-border gap-2">
            <img src={logo} alt="Aura Health" className="h-14 w-auto object-contain" />
          </div>

          <div className="p-4 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-[#f0f7fa] text-primary rounded-lg font-medium text-sm">
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-text-sec hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors">
              <Calendar className="w-5 h-5" />
              Schedule
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-text-sec hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors">
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
            onClick={() => onNavigate('login')}
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
                <div className="text-sm font-semibold text-text-main leading-tight">Dr. Sarah Jenkins</div>
                <div className="text-xs text-text-mut font-medium">Cardiologist</div>
              </div>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-text-main mb-6">Doctor's Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className="bg-white border border-card-border rounded-xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f0f7fa] flex items-center justify-center text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-text-sec text-sm font-medium">Total Patients Today</p>
                  <p className="text-2xl font-bold text-text-main">12</p>
                </div>
              </div>
              <div className="bg-white border border-card-border rounded-xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-text-sec text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold text-text-main">4</p>
                </div>
              </div>
              <div className="bg-white border border-card-border rounded-xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-text-sec text-sm font-medium">Upcoming</p>
                  <p className="text-2xl font-bold text-text-main">8</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-card-border overflow-hidden">
              <div className="p-5 border-b border-card-border">
                <h3 className="font-semibold text-text-main text-lg">Today's Appointments</h3>
              </div>
              <div className="divide-y divide-card-border">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-input-bg flex items-center justify-center text-text-sec font-medium">
                        {apt.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-text-main leading-tight">{apt.name}</p>
                        <p className="text-sm text-text-mut">{apt.type}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-6">
                      <p className="font-medium text-text-main">{apt.time}</p>
                      <button className={`px-4 py-1.5 rounded-full text-sm font-medium border ${apt.status === 'completed' ? 'border-green-200 text-green-700 bg-green-50' : 'border-[#b5e0ef] text-primary bg-[#f0f7fa]'}`}>
                        {apt.status === 'completed' ? 'Completed' : 'Start Session'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}