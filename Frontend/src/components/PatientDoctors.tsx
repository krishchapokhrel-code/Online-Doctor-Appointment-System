import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MessageSquare, Calendar } from 'lucide-react';

export default function PatientDoctors() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setDoctors([
        { id: 1, name: 'Dr. Aasha Poudel', specialty: 'Cardiologist', rating: 4.9, reviews: 128, status: 'Available' },
        { id: 2, name: 'Dr. Saugat Rijal', specialty: 'General Physician', rating: 4.8, reviews: 214, status: 'Busy' },
        { id: 3, name: 'Dr. Kriti Gurung', specialty: 'Dermatologist', rating: 4.7, reviews: 96, status: 'Available' },
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
        <h2 className="text-2xl font-bold text-text-main">Find a Doctor</h2>
        <div className="flex gap-2">
          <input type="text" placeholder="Search by name or specialty..." className="border border-card-border px-4 py-2 rounded-lg text-sm w-64 focus:outline-none focus:border-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map(doc => (
          <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-card-border p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {doc.name.replace('Dr. ', '').split(' ')[0].charAt(0)}
              </div>
              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${doc.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {doc.status}
              </span>
            </div>
            <h3 className="font-bold text-lg text-text-main">{doc.name}</h3>
            <p className="text-sm text-text-sec mb-4">{doc.specialty}</p>
            <div className="flex gap-4 text-sm text-text-mut mb-6">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /> {doc.rating}</span>
              <span>({doc.reviews} reviews)</span>
            </div>
            <div className="flex gap-2 mt-auto">
              <button 
                onClick={() => {
                  localStorage.setItem('selectedDoctorName', doc.name);
                  localStorage.setItem('selectedDoctorSpecialty', doc.specialty);
                  navigate('/chatbot');
                }}
                className="flex-1 py-2 text-sm font-medium text-primary bg-[#f0f7fa] border border-[#b5e0ef] rounded-lg hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Message
              </button>
              <button 
                onClick={() => {
                  localStorage.setItem('selectedDoctorName', doc.name);
                  localStorage.setItem('selectedDoctorSpecialty', doc.specialty);
                  navigate('/booking');
                }}
                className="flex-1 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
