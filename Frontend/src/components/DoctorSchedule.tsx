import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';

export default function DoctorSchedule() {
  const user = useAuthStore(s => s.user);
  const { getDoctorAppointments } = useDataStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const appointments = getDoctorAppointments(user?.id || 'd1');

  const allSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '02:00', '02:30', '03:00', '03:30', '04:00', '04:30'
  ];

  const schedule = allSlots.map(time => {
    const apt = appointments.find(a => a.time === time && a.status !== 'cancelled');
    return { time, booked: !!apt, name: apt?.patientName || '', type: apt?.issue || apt?.type || '', status: apt?.status || '' };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-text-main">My Schedule</h2>
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
          className="border border-card-border px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-primary" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-card-border overflow-hidden">
        <div className="divide-y divide-card-border">
          {schedule.map((slot, index) => (
            <div key={index} className={`p-4 flex items-center gap-6 ${slot.booked ? 'bg-white' : 'bg-gray-50/50'}`}>
              <div className="flex items-center gap-2 text-text-sec font-medium w-24">
                <Clock className="w-4 h-4" /> {slot.time}
              </div>
              {slot.booked ? (
                <div className="flex-1 bg-[#f0f7fa] border border-[#b5e0ef] rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-text-main">{slot.name}</p>
                    <p className="text-xs text-primary mt-0.5">{slot.type}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    slot.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    slot.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    slot.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{slot.status}</span>
                </div>
              ) : (
                <div className="flex-1 border border-dashed border-gray-300 rounded-lg p-3 text-center text-text-mut text-sm">
                  Available Slot
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
