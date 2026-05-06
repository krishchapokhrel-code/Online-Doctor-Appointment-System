import React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

export default function DoctorSchedule() {
  const schedule = [
    { time: '09:00 AM', name: 'Aarav Shrestha', type: 'Checkup', duration: '30 min', booked: true },
    { time: '09:30 AM', name: '', type: '', duration: '30 min', booked: false },
    { time: '10:00 AM', name: 'Prisha Gurung', type: 'Consultation', duration: '30 min', booked: true },
    { time: '10:30 AM', name: 'Saanvi Karki', type: 'Consultation', duration: '30 min', booked: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-main">My Schedule</h2>
        <div className="flex gap-2">
          <input type="date" className="border border-card-border px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-primary" />
        </div>
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
                  <span className="text-xs font-medium text-text-mut">{slot.duration}</span>
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
