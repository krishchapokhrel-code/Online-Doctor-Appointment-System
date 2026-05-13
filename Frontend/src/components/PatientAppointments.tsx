import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ChevronRight, Video, MapPin } from 'lucide-react';

export default function PatientAppointments() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setUpcomingAppointments([
        {
          id: 1,
          doctor: 'Dr. Aasha Poudel',
          specialty: 'Cardiologist',
          date: 'Oct 12, 2023',
          time: '09:30 AM',
          type: 'In-person',
          location: 'Heart Care Center, Room 302',
        },
        {
          id: 2,
          doctor: 'Dr. Saugat Rijal',
          specialty: 'General Physician',
          date: 'Oct 15, 2023',
          time: '02:15 PM',
          type: 'Video Consult',
          location: 'Online link',
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-main">My Appointments</h2>
        <button 
          onClick={() => onNavigate('booking')}
          className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm"
        >
          + Book New
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-card-border overflow-hidden p-6">
        <h3 className="font-semibold text-text-main text-lg mb-4">Upcoming Appointments</h3>
        <div className="space-y-4">
          {upcomingAppointments.map((apt) => (
            <div key={apt.id} className="flex items-center gap-4 p-4 border border-card-border rounded-xl hover:shadow-md transition-shadow bg-bg-base">
              <div className="bg-blue-50 flex flex-col items-center justify-center w-16 h-16 rounded-lg border border-blue-100 flex-shrink-0">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">{apt.date.split(' ')[0]}</span>
                <span className="text-xl font-bold text-blue-900 leading-none">{apt.date.split(' ')[1].replace(',', '')}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-text-main">{apt.doctor}</h4>
                <p className="text-sm text-text-sec">{apt.specialty}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-text-mut font-medium">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.time}</span>
                  <span className="flex items-center gap-1">
                    {apt.type === 'Video Consult' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                    {apt.type}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    localStorage.setItem('selectedDoctorName', apt.doctor);
                    localStorage.setItem('selectedDoctorSpecialty', apt.specialty);
                    onNavigate('booking');
                  }}
                  className="px-4 py-2 text-sm font-medium text-text-sec bg-white border border-card-border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem('selectedDoctorName', apt.doctor);
                    localStorage.setItem('selectedDoctorSpecialty', apt.specialty);
                    onNavigate('doctorChat');
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Join / View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
