import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Asterisk, Settings, LogOut, Search, Bell, MessageSquare,
  LayoutDashboard, Calendar, Users, FileText, X, Phone as PhoneIcon
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import logo from '../assets/ah_logo.png';
import PatientOverview from './PatientOverview';
import PatientAppointments from './PatientAppointments';
import PatientDoctors from './PatientDoctors';
import PatientRecords from './PatientRecords';
import SettingsPanel from './SettingsPanel';
import NotificationsPanel from './NotificationsPanel';

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const getUnreadCount = useDataStore((s) => s.getUnreadCount);
  const getUserNotifications = useDataStore((s) => s.getUserNotifications);
  const markNotificationRead = useDataStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useDataStore((s) => s.markAllNotificationsRead);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showEmergency, setShowEmergency] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = getUnreadCount(user?.id || '');
  const notifications = getUserNotifications(user?.id || '').slice(0, 5);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifDropdown(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <PatientOverview onTabChange={setActiveTab} />;
      case 'appointments': return <PatientAppointments />;
      case 'doctors': return <PatientDoctors />;
      case 'records': return <PatientRecords />;
      case 'settings': return <SettingsPanel />;
      case 'notifications': return <NotificationsPanel />;
      default: return <PatientOverview onTabChange={setActiveTab} />;
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'doctors', label: 'Doctors', icon: Users },
    { id: 'records', label: 'Records', icon: FileText },
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
            {sidebarItems.map(item => (
              <button key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === item.id ? 'bg-[#f0f7fa] text-primary' : 'text-text-sec hover:bg-gray-50'}`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-1 border-t border-card-border">
          <button onClick={() => setShowEmergency(true)} className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors">
            <Asterisk className="w-5 h-5" /> Emergency Call
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'settings' ? 'bg-[#f0f7fa] text-primary' : 'text-text-sec hover:bg-gray-50'}`}>
            <Settings className="w-5 h-5" /> Settings
          </button>
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-text-sec hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
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
                placeholder="Search records, doctors…" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && searchQuery.trim()) { setActiveTab('doctors'); } }}
                className="w-full bg-input-bg border border-input-border pl-9 pr-4 py-1.5 rounded-full text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-text-main placeholder-text-mut"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="relative text-text-mut hover:text-text-main transition-colors">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center border border-white">{unreadCount}</span>}
              </button>
              {showNotifDropdown && (
                <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-xl border border-card-border z-50 overflow-hidden">
                  <div className="p-4 border-b border-card-border flex justify-between items-center">
                    <span className="font-semibold text-text-main text-sm">Notifications</span>
                    <button onClick={() => { markAllNotificationsRead(user?.id || ''); }} className="text-xs text-accent hover:text-primary font-medium">Mark all read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-text-mut text-sm">No notifications</div>
                    ) : notifications.map(n => (
                      <div key={n.id} onClick={() => { markNotificationRead(n.id); setShowNotifDropdown(false); setActiveTab('notifications'); }} className={`p-3 hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}>
                        <p className="text-sm font-medium text-text-main">{n.title}</p>
                        <p className="text-xs text-text-sec mt-0.5">{n.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-card-border">
                    <button onClick={() => { setShowNotifDropdown(false); setActiveTab('notifications'); }} className="w-full text-center text-sm font-medium text-accent hover:text-primary">View all</button>
                  </div>
                </div>
              )}
            </div>

            {/* Chat */}
            <button onClick={() => navigate('/chatbot')} className="text-text-mut hover:text-text-main transition-colors">
              <MessageSquare className="w-5 h-5" />
            </button>
            
            <div className="h-6 w-[1px] bg-card-border mx-1"></div>
            
            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">{initials}</div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-semibold text-text-main leading-tight">{user?.name || 'User'}</div>
                  <div className="text-xs text-text-mut font-medium">#{user?.id || 'PT-0000'}</div>
                </div>
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-card-border z-50 py-2">
                  <button onClick={() => { setShowProfileMenu(false); setActiveTab('settings'); }} className="w-full text-left px-4 py-2 text-sm text-text-main hover:bg-gray-50">Edit Profile</button>
                  <button onClick={() => { setShowProfileMenu(false); setActiveTab('settings'); }} className="w-full text-left px-4 py-2 text-sm text-text-main hover:bg-gray-50">Settings</button>
                  <hr className="my-1 border-card-border" />
                  <button onClick={() => { logout(); navigate('/login'); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
             {renderContent()}
          </div>
        </div>
      </div>

      {/* Emergency Modal */}
      {showEmergency && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setShowEmergency(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-red-600 flex items-center gap-2"><PhoneIcon className="w-6 h-6" /> Emergency Contact</h2>
              <button onClick={() => setShowEmergency(false)}><X className="w-5 h-5 text-text-mut" /></button>
            </div>
            <div className="space-y-4">
              <a href="tel:102" className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors">
                <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-lg">🚑</div>
                <div><p className="font-semibold text-text-main">Ambulance</p><p className="text-sm text-text-sec">Dial 102</p></div>
              </a>
              <a href="tel:100" className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">🏥</div>
                <div><p className="font-semibold text-text-main">Hospital Helpline</p><p className="text-sm text-text-sec">Dial 100</p></div>
              </a>
              <a href="tel:01-4228094" className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors">
                <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg">💊</div>
                <div><p className="font-semibold text-text-main">Aura Health Center</p><p className="text-sm text-text-sec">01-4228094</p></div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
