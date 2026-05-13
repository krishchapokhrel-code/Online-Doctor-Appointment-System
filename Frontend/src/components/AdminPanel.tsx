import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, FileText, Bell, Settings, LogOut, Activity, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import AdminUsers from './AdminUsers';
import AdminAppointments from './AdminAppointments';
import AdminReports from './AdminReports';
import AdminNotifications from './AdminNotifications';
import AdminSettings from './AdminSettings';
import AdminLogs from './AdminLogs';

function AdminDashboard() {
  const { patients, doctors, appointments, reports } = useDataStore();
  const stats = [
    { label: 'Total Patients', value: patients.length, trend: '+12%', color: 'bg-blue-50 text-blue-700', trendColor: 'text-green-600' },
    { label: 'Total Doctors', value: doctors.length, trend: '+3', color: 'bg-purple-50 text-purple-700', trendColor: 'text-green-600' },
    { label: 'Appointments', value: appointments.length, trend: `${appointments.filter(a=>a.status==='pending').length} pending`, color: 'bg-green-50 text-green-700', trendColor: 'text-yellow-600' },
    { label: 'Reports', value: reports.length, trend: 'All clear', color: 'bg-orange-50 text-orange-700', trendColor: 'text-green-600' },
  ];

  const recentActivity = [
    ...appointments.slice(-3).map(a => ({ text: `${a.patientName} booked with ${a.doctorName}`, time: 'Recently', type: 'appointment' })),
    ...reports.slice(-2).map(r => ({ text: `${r.doctorName} uploaded "${r.title}"`, time: 'Recently', type: 'report' })),
  ].slice(0, 6);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-main">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(s => (
          <div key={s.label} className="bg-white p-6 rounded-2xl shadow-sm border border-card-border">
            <div className="flex justify-between items-start">
              <div><p className="text-text-sec text-sm font-medium mb-1">{s.label}</p><p className="text-3xl font-bold text-text-main">{s.value}</p></div>
              <span className={`px-2.5 py-1 ${s.color} text-[10px] font-bold uppercase rounded-full`}><TrendingUp className="w-3 h-3 inline mr-1" />{s.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-card-border p-6">
          <h2 className="text-lg font-bold text-text-main mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length === 0 ? <p className="text-text-mut text-sm text-center py-4">No recent activity</p> :
              recentActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div><p className="text-sm font-medium text-text-main">{item.text}</p><p className="text-xs text-text-sec">{item.time}</p></div>
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${item.type === 'appointment' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{item.type}</span>
                </div>
              ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-card-border p-6">
          <h2 className="text-lg font-bold text-text-main mb-4">System Health</h2>
          <div className="space-y-4">
            {[
              { label: 'API Server', status: 'Operational', color: 'bg-green-500' },
              { label: 'Database', status: 'Operational', color: 'bg-green-500' },
              { label: 'File Storage', status: 'Operational', color: 'bg-green-500' },
              { label: 'Email Service', status: 'Operational', color: 'bg-green-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <span className="text-sm font-medium text-text-main">{item.label}</span>
                <div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${item.color}`} /><span className="text-sm text-green-600 font-medium">{item.status}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'users': return <AdminUsers />;
      case 'appointments': return <AdminAppointments />;
      case 'reports': return <AdminReports />;
      case 'notifications': return <AdminNotifications />;
      case 'settings': return <AdminSettings />;
      case 'logs': return <AdminLogs />;
      default: return <AdminDashboard />;
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users & Doctors', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'notifications', label: 'Announcements', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logs', label: 'System Logs', icon: Activity },
  ];

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden">
      <div className="w-[230px] bg-gray-900 text-white flex flex-col justify-between flex-shrink-0 z-20">
        <div>
          <div className="h-[70px] flex items-center px-6 border-b border-gray-800 gap-2 bg-gray-950">
            <span className="font-bold text-xl tracking-tight text-white">Aura Admin</span>
          </div>
          <div className="p-4 space-y-1">
            {sidebarItems.map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === item.id ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <item.icon className="w-5 h-5" /> {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 space-y-1 border-t border-gray-800">
          <button onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg font-medium text-sm transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </div>
    </div>
  );
}
