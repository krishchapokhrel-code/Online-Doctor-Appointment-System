import React from 'react';
import { Search, FileText } from 'lucide-react';

export default function DoctorPatients() {
  const patients = [
    { id: 1, name: 'Aarav Shrestha', age: 34, gender: 'Male', lastVisit: 'Oct 05, 2023', condition: 'Hypertension' },
    { id: 2, name: 'Saanvi Karki', age: 29, gender: 'Female', lastVisit: 'Sep 28, 2023', condition: 'Diabetes Type 2' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-main">Patients Directory</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-mut" />
          <input type="text" placeholder="Search patients..." className="pl-9 pr-4 py-2 border border-card-border rounded-lg text-sm focus:outline-none focus:border-primary w-64" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-card-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-card-border text-xs uppercase text-text-mut font-semibold">
            <tr>
              <th className="px-6 py-3">Patient Name</th>
              <th className="px-6 py-3">Age / Gender</th>
              <th className="px-6 py-3">Last Visit</th>
              <th className="px-6 py-3">Condition</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {patients.map(patient => (
              <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {patient.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-text-main">{patient.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-text-sec">{patient.age} / {patient.gender}</td>
                <td className="px-6 py-4 text-sm text-text-sec">{patient.lastVisit}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">{patient.condition}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary hover:text-primary-hover font-medium text-sm flex items-center gap-1 ml-auto">
                    <FileText className="w-4 h-4" /> View Records
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
