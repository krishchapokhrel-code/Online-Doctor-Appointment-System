import React from 'react';
import { Users, CheckCircle, Clock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import toast from 'react-hot-toast';

export default function DoctorOverview() {
  const user = useAuthStore(s => s.user);
  const { getDoctorAppointments, updateAppointmentStatus } = useDataStore();
  const appointments = getDoctorAppointments(user?.id || 'd1');

  const completed = appointments.filter(a => a.status === 'completed').length;
  const upcoming = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length;
  const todayAppts = appointments.filter(a => a.status !== 'cancelled').slice(0, 5);

  return (
    <>
      <h1 className="text-2xl font-bold text-text-main mb-6">Doctor's Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border border-card-border rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#f0f7fa] flex items-center justify-center text-primary"><Users className="w-6 h-6" /></div>
          <div><p className="text-text-sec text-sm font-medium">Total Patients</p><p className="text-2xl font-bold text-text-main">{appointments.length}</p></div>
        </div>
        <div className="bg-white border border-card-border rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600"><CheckCircle className="w-6 h-6" /></div>
          <div><p className="text-text-sec text-sm font-medium">Completed</p><p className="text-2xl font-bold text-text-main">{completed}</p></div>
        </div>
        <div className="bg-white border border-card-border rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600"><Clock className="w-6 h-6" /></div>
          <div><p className="text-text-sec text-sm font-medium">Upcoming</p><p className="text-2xl font-bold text-text-main">{upcoming}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-card-border overflow-hidden">
        <div className="p-5 border-b border-card-border"><h3 className="font-semibold text-text-main text-lg">Appointments</h3></div>
        <div className="divide-y divide-card-border">
          {todayAppts.length === 0 ? (
            <div className="p-8 text-center text-text-mut">No appointments</div>
          ) : todayAppts.map(apt => (
            <div key={apt.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-input-bg flex items-center justify-center text-text-sec font-medium">{apt.patientName.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-text-main leading-tight">{apt.patientName}</p>
                  <p className="text-sm text-text-mut">{apt.issue || 'Consultation'}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div>
                  <p className="font-medium text-text-main">{apt.time} {apt.session}</p>
                  <p className="text-xs text-text-mut">{apt.date}</p>
                </div>
                {apt.status === 'completed' ? (
                  <span className="px-4 py-1.5 rounded-full text-sm font-medium border border-green-200 text-green-700 bg-green-50">Completed</span>
                ) : apt.status === 'cancelled' ? (
                  <span className="px-4 py-1.5 rounded-full text-sm font-medium border border-red-200 text-red-600 bg-red-50">Cancelled</span>
                ) : apt.status === 'in-progress' ? (
                  <button onClick={() => { updateAppointmentStatus(apt.id, 'completed'); toast.success('Session completed'); }}
                    className="px-4 py-1.5 rounded-full text-sm font-medium border border-green-200 text-green-700 bg-green-50 hover:bg-green-100 transition-colors">
                    End Session
                  </button>
                ) : (
                  <div className="flex gap-2">
                    {apt.status === 'pending' && (
                      <button onClick={() => { updateAppointmentStatus(apt.id, 'confirmed'); toast.success('Appointment confirmed'); }}
                        className="px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
                        Confirm
                      </button>
                    )}
                    <button onClick={() => { updateAppointmentStatus(apt.id, 'in-progress'); toast.success('Session started'); }}
                      className="px-4 py-1.5 rounded-full text-sm font-medium border border-[#b5e0ef] text-primary bg-[#f0f7fa] hover:bg-primary/10 transition-colors">
                      Start Session
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
