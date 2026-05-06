import React from 'react';
import { Users, CheckCircle, Clock } from 'lucide-react';

export default function DoctorOverview() {
  const appointments = [
    { id: 1, name: "Aarav Shrestha", time: "09:00 AM", type: "Checkup", status: "completed" },
    { id: 2, name: "Saanvi Karki", time: "10:30 AM", type: "Consultation", status: "upcoming" },
    { id: 3, name: "Rijan Basnet", time: "11:00 AM", type: "Follow up", status: "upcoming" },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-text-main mb-6">Doctor's Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border border-card-border rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#f0f7fa] flex items-center justify-center text-primary">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-text-sec text-sm font-medium">Total Patients Today</p>
            <p className="text-2xl font-bold text-text-main">12</p>
          </div>
        </div>
        <div className="bg-white border border-card-border rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-text-sec text-sm font-medium">Completed</p>
            <p className="text-2xl font-bold text-text-main">4</p>
          </div>
        </div>
        <div className="bg-white border border-card-border rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-text-sec text-sm font-medium">Upcoming</p>
            <p className="text-2xl font-bold text-text-main">8</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-card-border overflow-hidden">
        <div className="p-5 border-b border-card-border">
          <h3 className="font-semibold text-text-main text-lg">Today's Appointments</h3>
        </div>
        <div className="divide-y divide-card-border">
          {appointments.map((apt) => (
            <div key={apt.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-input-bg flex items-center justify-center text-text-sec font-medium">
                  {apt.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-text-main leading-tight">{apt.name}</p>
                  <p className="text-sm text-text-mut">{apt.type}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-6">
                <p className="font-medium text-text-main">{apt.time}</p>
                <button className={`px-4 py-1.5 rounded-full text-sm font-medium border ${apt.status === 'completed' ? 'border-green-200 text-green-700 bg-green-50' : 'border-[#b5e0ef] text-primary bg-[#f0f7fa]'}`}>
                  {apt.status === 'completed' ? 'Completed' : 'Start Session'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
