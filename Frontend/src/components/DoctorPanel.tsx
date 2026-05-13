import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Search, Bell, MessageSquare, FileText } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import logo from '../assets/ah_logo.png';
import DoctorOverview from './DoctorOverview';
import DoctorSchedule from './DoctorSchedule';
import DoctorPatients from './DoctorPatients';
import DoctorReports from './DoctorReports';
import DoctorChat from './DoctorChat';
import SettingsPanel from './SettingsPanel';
import NotificationsPanel from './NotificationsPanel';

export default function DoctorPanel() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const getUnreadCount = useDataStore(s => s.getUnreadCount);
  const getUserNotifications = useDataStore(s => s.getUserNotifications);
  const markNotificationRead = useDataStore(s => s.markNotificationRead);
  const markAllNotificationsRead = useDataStore(s => s.markAllNotificationsRead);

  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = getUnreadCount(user?.id || '');
  const notifications = getUserNotifications(user?.id || '').slice(0, 5);
  const initials = user?.name?.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2) || 'Dr';

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
      case 'overview': return <DoctorOverview />;
      case 'schedule': return <DoctorSchedule />;
      case 'patients': return <DoctorPatients />;
      case 'reports': return <DoctorReports />;
      case 'chat': return <DoctorChat />;
      case 'settings': return <SettingsPanel />;
      case 'notifications': return <NotificationsPanel />;
      default: return <DoctorOverview />;
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'chat', label: 'Messages', icon: MessageSquare },
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
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === item.id ? 'bg-[#f0f7fa] text-primary' : 'text-text-sec hover:bg-gray-50'}`}>
                <item.icon className="w-5 h-5" />
                {item.label}
                {item.id === 'chat' && unreadCount > 0 && <span className="ml-auto w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">{unreadCount}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-1 border-t border-card-border">
          <button onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'settings' ? 'bg-[#f0f7fa] text-primary' : 'text-text-sec hover:bg-gray-50'}`}>
            <Settings className="w-5 h-5" /> Settings
          </button>
          <button onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-text-sec hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors">
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
              <input type="text" placeholder="Search patients, records…"
                className="w-full bg-input-bg border border-input-border pl-9 pr-4 py-1.5 rounded-full text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-text-main placeholder-text-mut" />
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
                    <button onClick={() => markAllNotificationsRead(user?.id || '')} className="text-xs text-accent hover:text-primary font-medium">Mark all read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-text-mut text-sm">No notifications</div>
                    ) : notifications.map(n => (
                      <div key={n.id} onClick={() => { markNotificationRead(n.id); setShowNotifDropdown(false); setActiveTab('notifications'); }}
                        className={`p-3 hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}>
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

            <div className="h-6 w-[1px] bg-card-border mx-1"></div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">{initials}</div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-semibold text-text-main leading-tight">{user?.name || 'Doctor'}</div>
                  <div className="text-xs text-text-mut font-medium">{user?.specialty || 'Specialist'}</div>
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
    </div>
  );
}
