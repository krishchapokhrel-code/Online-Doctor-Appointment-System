import React, { useState } from 'react';
import { Bell, Check, CheckCheck, Calendar, FileText, MessageSquare, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';

export default function NotificationsPanel() {
  const user = useAuthStore(s => s.user);
  const { getUserNotifications, markNotificationRead, markAllNotificationsRead } = useDataStore();
  const [filter, setFilter] = useState<'all'|'appointment'|'report'|'message'|'system'>('all');

  const allNotifs = getUserNotifications(user?.id || '');
  const filtered = filter === 'all' ? allNotifs : allNotifs.filter(n => n.type === filter);

  const iconMap: Record<string, React.ReactNode> = {
    appointment: <Calendar className="w-5 h-5 text-blue-500" />,
    report: <FileText className="w-5 h-5 text-green-500" />,
    message: <MessageSquare className="w-5 h-5 text-purple-500" />,
    system: <Settings className="w-5 h-5 text-gray-500" />,
  };

  const filters = [
    { id: 'all' as const, label: 'All' },
    { id: 'appointment' as const, label: 'Appointments' },
    { id: 'report' as const, label: 'Reports' },
    { id: 'message' as const, label: 'Messages' },
    { id: 'system' as const, label: 'System' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-main">Notifications</h2>
        <button onClick={() => markAllNotificationsRead(user?.id || '')} className="text-sm font-medium text-accent hover:text-primary flex items-center gap-1.5 transition-colors">
          <CheckCheck className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f.id ? 'bg-primary text-white' : 'bg-white border border-card-border text-text-sec hover:bg-gray-50'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-card-border shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-text-mut mx-auto mb-4 opacity-40" />
            <p className="text-text-sec font-medium">No notifications yet</p>
            <p className="text-sm text-text-mut mt-1">You'll see updates here when something happens</p>
          </div>
        ) : (
          <div className="divide-y divide-card-border">
            {filtered.map(n => (
              <div key={n.id} onClick={() => markNotificationRead(n.id)}
                className={`p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? 'bg-blue-50/40 border-l-4 border-l-primary' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-bg-base flex items-center justify-center flex-shrink-0">
                  {iconMap[n.type] || <Bell className="w-5 h-5 text-text-mut" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <p className={`text-sm ${!n.read ? 'font-semibold text-text-main' : 'font-medium text-text-sec'}`}>{n.title}</p>
                    <span className="text-[10px] text-text-mut whitespace-nowrap">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-text-sec mt-0.5">{n.message}</p>
                </div>
                {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
