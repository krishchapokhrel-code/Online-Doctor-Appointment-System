import React from 'react';
import { Save, Shield } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { settings, updateSettings } = useDataStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-main">Platform Settings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-card-border p-6 space-y-4">
          <h3 className="font-semibold text-text-main text-lg">General</h3>
          <div><label className="block text-sm font-medium text-text-main mb-1">Platform Name</label>
            <input type="text" value={settings.platformName} onChange={e=>updateSettings({platformName:e.target.value})} className="w-full bg-input-bg border border-input-border px-4 py-2.5 rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium text-text-main mb-1">Slot Duration (minutes)</label>
            <input type="number" value={settings.slotDuration} onChange={e=>updateSettings({slotDuration:+e.target.value})} className="w-full bg-input-bg border border-input-border px-4 py-2.5 rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium text-text-main mb-1">Max Appointments/Doctor/Day</label>
            <input type="number" value={settings.maxAppointmentsPerDoctor} onChange={e=>updateSettings({maxAppointmentsPerDoctor:+e.target.value})} className="w-full bg-input-bg border border-input-border px-4 py-2.5 rounded-lg text-sm" /></div>
          <button onClick={()=>toast.success('Settings saved')} className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-primary-hover flex items-center gap-2"><Save className="w-4 h-4" /> Save</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-card-border p-6 space-y-4">
          <h3 className="font-semibold text-text-main text-lg">System</h3>
          {[
            { label: 'Maintenance Mode', desc: 'Temporarily disable the platform', val: settings.maintenanceMode, key: 'maintenanceMode' as const },
            { label: 'Allow Registration', desc: 'Let new users sign up', val: settings.allowRegistration, key: 'allowRegistration' as const },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-4 bg-bg-base rounded-xl border border-card-border">
              <div><p className="font-medium text-text-main text-sm">{item.label}</p><p className="text-xs text-text-sec">{item.desc}</p></div>
              <button onClick={() => { updateSettings({ [item.key]: !item.val }); toast.success(`${item.label} ${!item.val ? 'enabled' : 'disabled'}`); }}
                className={`w-12 h-6 rounded-full transition-colors relative ${item.val ? 'bg-primary' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${item.val ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center gap-2 mb-1"><Shield className="w-4 h-4 text-yellow-600" /><span className="font-medium text-yellow-800 text-sm">Security</span></div>
            <p className="text-xs text-yellow-700">All admin actions are logged. System is encrypted end-to-end.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
