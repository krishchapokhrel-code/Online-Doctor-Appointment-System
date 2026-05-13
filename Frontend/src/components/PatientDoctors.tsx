import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MessageSquare, Calendar } from 'lucide-react';
import { useDataStore } from '../store/dataStore';

export default function PatientDoctors() {
  const navigate = useNavigate();
  const doctors = useDataStore(s => s.doctors);
  const [search, setSearch] = useState('');

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-text-main">Find a Doctor</h2>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or specialty..." className="border border-card-border px-4 py-2 rounded-lg text-sm w-64 focus:outline-none focus:border-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(doc => (
          <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-card-border p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {doc.name.replace('Dr. ', '').split(' ')[0].charAt(0)}
              </div>
              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${doc.status === 'Available' ? 'bg-green-100 text-green-700' : doc.status === 'Busy' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                {doc.status}
              </span>
            </div>
            <h3 className="font-bold text-lg text-text-main">{doc.name}</h3>
            <p className="text-sm text-text-sec mb-1">{doc.specialty}</p>
            <p className="text-xs text-text-mut mb-4">{doc.experience}</p>
            <div className="flex gap-4 text-sm text-text-mut mb-6">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /> {doc.rating}</span>
              <span>({doc.reviews} reviews)</span>
            </div>
            <div className="flex gap-2 mt-auto">
              <button onClick={() => { localStorage.setItem('selectedDoctorName', doc.name); localStorage.setItem('selectedDoctorSpecialty', doc.specialty); navigate('/chatbot'); }}
                className="flex-1 py-2 text-sm font-medium text-primary bg-[#f0f7fa] border border-[#b5e0ef] rounded-lg hover:bg-primary/10 transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" /> Message
              </button>
              <button onClick={() => { localStorage.setItem('selectedDoctorName', doc.name); localStorage.setItem('selectedDoctorSpecialty', doc.specialty); navigate('/booking'); }}
                className="flex-1 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" /> Book
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-full text-center py-12 text-text-mut"><p className="font-medium">No doctors found</p></div>}
      </div>
    </div>
  );
}
