import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Bell, Shield, Palette, Trash2, Save, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function SettingsPanel() {
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [activeSection, setActiveSection] = useState('profile');

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSms, setNotifSms] = useState(false);

  const handleSaveProfile = () => {
    updateProfile({ name, email, phone });
    toast.success('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (!currentPw || !newPw) { toast.error('Fill both fields'); return; }
    if (newPw.length < 6) { toast.error('Password must be 6+ chars'); return; }
    toast.success('Password changed successfully!');
    setCurrentPw(''); setNewPw('');
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'account', label: 'Account', icon: Trash2 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-main">Settings</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-card-border shadow-sm p-2 space-y-1">
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === s.id ? 'bg-[#f0f7fa] text-primary' : 'text-text-sec hover:bg-gray-50'}`}>
                <s.icon className="w-4 h-4" /> {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-card-border shadow-sm p-6">
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text-main">Profile Information</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
                  {name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <div>
                  <p className="font-semibold text-text-main">{user?.name}</p>
                  <p className="text-sm text-text-sec capitalize">{user?.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-text-main mb-1">Full Name</label>
                  <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-mut" />
                  <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-input-bg border border-input-border pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-primary" /></div>
                </div>
                <div><label className="block text-sm font-medium text-text-main mb-1">Email</label>
                  <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-mut" />
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-input-bg border border-input-border pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-primary" /></div>
                </div>
                <div><label className="block text-sm font-medium text-text-main mb-1">Phone</label>
                  <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-mut" />
                  <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-input-bg border border-input-border pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-primary" /></div>
                </div>
              </div>
              <button onClick={handleSaveProfile} className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</button>
            </div>
          )}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text-main">Notification Preferences</h3>
              {[
                { label: 'Email Notifications', desc: 'Receive updates via email', val: notifEmail, set: setNotifEmail },
                { label: 'Push Notifications', desc: 'Browser push notifications', val: notifPush, set: setNotifPush },
                { label: 'SMS Notifications', desc: 'Get text message alerts', val: notifSms, set: setNotifSms },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-4 bg-bg-base rounded-xl border border-card-border">
                  <div><p className="font-medium text-text-main text-sm">{item.label}</p><p className="text-xs text-text-sec">{item.desc}</p></div>
                  <button onClick={() => { item.set(!item.val); toast.success(`${item.label} ${!item.val ? 'enabled' : 'disabled'}`); }}
                    className={`w-12 h-6 rounded-full transition-colors relative ${item.val ? 'bg-primary' : 'bg-gray-300'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${item.val ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text-main">Change Password</h3>
              <div className="max-w-md space-y-4">
                <div><label className="block text-sm font-medium text-text-main mb-1">Current Password</label>
                  <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-mut" />
                  <input type="password" value={currentPw} onChange={e=>setCurrentPw(e.target.value)} placeholder="••••••••" className="w-full bg-input-bg border border-input-border pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-primary" /></div>
                </div>
                <div><label className="block text-sm font-medium text-text-main mb-1">New Password</label>
                  <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-mut" />
                  <input type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="••••••••" className="w-full bg-input-bg border border-input-border pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-primary" /></div>
                </div>
                <button onClick={handleChangePassword} className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors">Update Password</button>
              </div>
              <hr className="border-card-border" />
              <h3 className="text-lg font-semibold text-text-main">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between p-4 bg-bg-base rounded-xl border border-card-border">
                <div><p className="font-medium text-text-main text-sm">Enable 2FA</p><p className="text-xs text-text-sec">Add extra security to your account</p></div>
                <button onClick={() => toast.success('2FA settings updated')} className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-lg hover:bg-primary/20">Enable</button>
              </div>
            </div>
          )}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text-main">Appearance</h3>
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                <button className="p-6 bg-white border-2 border-primary rounded-xl text-center"><div className="w-8 h-8 bg-gray-100 rounded-full mx-auto mb-2" /><span className="text-sm font-medium text-text-main">Light</span><CheckCircle className="w-4 h-4 text-primary mx-auto mt-2" /></button>
                <button onClick={() => toast('Dark mode coming soon!', { icon: '🌙' })} className="p-6 bg-gray-900 border-2 border-gray-700 rounded-xl text-center"><div className="w-8 h-8 bg-gray-700 rounded-full mx-auto mb-2" /><span className="text-sm font-medium text-gray-300">Dark</span></button>
              </div>
            </div>
          )}
          {activeSection === 'account' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text-main">Account Management</h3>
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <h4 className="font-semibold text-red-700 mb-1">Danger Zone</h4>
                <p className="text-sm text-red-600 mb-4">These actions are irreversible.</p>
                <div className="flex gap-3">
                  <button onClick={() => toast('Account deactivated (demo)', { icon: '⚠️' })} className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100">Deactivate Account</button>
                  <button onClick={() => toast('Account deletion requested (demo)', { icon: '🗑️' })} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete Account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
