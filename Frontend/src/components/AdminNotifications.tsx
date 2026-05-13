import React, { useState } from 'react';
import { Send, Bell } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import toast from 'react-hot-toast';

export default function AdminNotifications() {
  const { addNotification, patients, doctors, notifications } = useDataStore();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<'all'|'patients'|'doctors'>('all');

  const handleSend = () => {
    if (!title || !message) { toast.error('Fill title and message'); return; }
    const targets = target === 'patients' ? patients.map(p=>p.id) : target === 'doctors' ? doctors.map(d=>d.id) : [...patients.map(p=>p.id), ...doctors.map(d=>d.id)];
    targets.forEach(uid => addNotification({ userId: uid, title, message, type: 'system' }));
    toast.success(`Sent to ${targets.length} users`);
    setTitle(''); setMessage('');
  };

  const recentNotifs = [...notifications].sort((a,b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-main">Notifications & Announcements</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-card-border p-6">
          <h3 className="font-semibold text-text-main text-lg mb-4">Send Announcement</h3>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-text-main mb-1">Target</label>
              <select value={target} onChange={e=>setTarget(e.target.value as any)} className="w-full bg-input-bg border border-input-border px-4 py-2.5 rounded-lg text-sm">
                <option value="all">All Users</option><option value="patients">Patients Only</option><option value="doctors">Doctors Only</option>
              </select></div>
            <div><label className="block text-sm font-medium text-text-main mb-1">Title</label>
              <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Announcement title" className="w-full bg-input-bg border border-input-border px-4 py-2.5 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-text-main mb-1">Message</label>
              <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Message content..." className="w-full bg-input-bg border border-input-border px-4 py-2.5 rounded-lg text-sm h-24 resize-none" /></div>
            <button onClick={handleSend} className="w-full bg-primary text-white py-2.5 rounded-lg font-medium text-sm hover:bg-primary-hover flex items-center justify-center gap-2"><Send className="w-4 h-4" /> Send Announcement</button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-card-border p-6">
          <h3 className="font-semibold text-text-main text-lg mb-4">Recent Notifications</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {recentNotifs.length === 0 ? <p className="text-text-mut text-sm text-center py-4">No notifications yet</p> :
              recentNotifs.map(n => (
                <div key={n.id} className="p-3 bg-bg-base rounded-lg border border-card-border">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-text-main">{n.title}</p>
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${n.type==='system'?'bg-purple-100 text-purple-700':'bg-blue-100 text-blue-700'}`}>{n.type}</span>
                  </div>
                  <p className="text-xs text-text-sec mt-1">{n.message}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
