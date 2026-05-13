import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Video, MapPin, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import toast from 'react-hot-toast';

export default function PatientAppointments() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const { getPatientAppointments, cancelAppointment } = useDataStore();
  const [cancelId, setCancelId] = useState<string|null>(null);
  const [filter, setFilter] = useState<'all'|'pending'|'confirmed'|'completed'|'cancelled'>('all');

  const all = getPatientAppointments(user?.id || 'p1');
  const appointments = filter === 'all' ? all : all.filter(a => a.status === filter);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-600',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-text-main">My Appointments</h2>
        <button onClick={() => navigate('/booking')} className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm">+ Book New</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all','pending','confirmed','completed','cancelled'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-white border border-card-border text-text-sec hover:bg-gray-50'}`}>{f}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-card-border overflow-hidden p-6">
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-12 text-text-mut"><p className="font-medium">No appointments found</p><p className="text-sm mt-1">Book your first appointment to get started</p></div>
          ) : appointments.map(apt => (
            <div key={apt.id} className="flex items-center gap-4 p-4 border border-card-border rounded-xl hover:shadow-md transition-shadow bg-bg-base">
              <div className="bg-blue-50 flex flex-col items-center justify-center w-16 h-16 rounded-lg border border-blue-100 flex-shrink-0">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">{apt.date.split(' ')[0]}</span>
                <span className="text-xl font-bold text-blue-900 leading-none">{apt.date.split(' ')[1]?.replace(',', '')}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-text-main">{apt.doctorName}</h4>
                <p className="text-sm text-text-sec">{apt.doctorSpecialty}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-text-mut font-medium flex-wrap">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.time} {apt.session}</span>
                  <span className="flex items-center gap-1">{apt.type === 'Video Consult' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}{apt.type}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[apt.status] || ''}`}>{apt.status}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {(apt.status === 'pending' || apt.status === 'confirmed') && (
                  <>
                    <button onClick={() => { localStorage.setItem('selectedDoctorName', apt.doctorName); localStorage.setItem('selectedDoctorSpecialty', apt.doctorSpecialty); navigate('/booking'); }}
                      className="px-4 py-2 text-sm font-medium text-text-sec bg-white border border-card-border rounded-lg hover:bg-gray-50 transition-colors">Reschedule</button>
                    <button onClick={() => setCancelId(apt.id)} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">Cancel</button>
                  </>
                )}
                {apt.type === 'Video Consult' && apt.status === 'confirmed' && (
                  <button onClick={() => toast.success('Joining video call...')} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors">Join</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel Modal */}
      {cancelId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setCancelId(null)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-text-main mb-2">Cancel Appointment?</h3>
            <p className="text-sm text-text-sec mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setCancelId(null)} className="flex-1 px-4 py-2.5 border border-card-border rounded-lg text-sm font-medium hover:bg-gray-50">Keep</button>
              <button onClick={() => { cancelAppointment(cancelId); setCancelId(null); toast.success('Appointment cancelled'); }} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Cancel It</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
