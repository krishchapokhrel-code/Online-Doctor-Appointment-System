import React from 'react';
import { FileText, Download, Eye, Activity } from 'lucide-react';

export default function PatientRecords() {
  const records = [
    { id: 1, title: 'Complete Blood Count', date: 'Oct 05, 2023', doctor: 'Dr. Saugat Rijal', type: 'Lab Report' },
    { id: 2, title: 'Echocardiogram', date: 'Sep 12, 2023', doctor: 'Dr. Aasha Poudel', type: 'Imaging' },
    { id: 3, title: 'Annual Physical Report', date: 'Jan 15, 2023', doctor: 'Dr. Saugat Rijal', type: 'Visit Summary' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-main">Medical Records</h2>
        <button className="bg-white border border-card-border hover:bg-gray-50 text-text-main px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm flex items-center gap-2">
          <Download className="w-4 h-4"/> Download All
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-card-border overflow-hidden">
        <div className="p-4 border-b border-card-border flex gap-4 bg-gray-50">
          <button className="text-sm font-semibold text-primary border-b-2 border-primary px-2 py-1">All Records</button>
          <button className="text-sm font-medium text-text-sec hover:text-text-main px-2 py-1 transition-colors">Lab Results</button>
          <button className="text-sm font-medium text-text-sec hover:text-text-main px-2 py-1 transition-colors">Prescriptions</button>
        </div>
        <div className="divide-y divide-card-border">
          {records.map(rec => (
            <div key={rec.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  {rec.type === 'Lab Report' ? <Activity className="w-5 h-5" /> : <FileText className="w-5 h-5"/>}
                </div>
                <div>
                  <h4 className="font-semibold text-text-main">{rec.title}</h4>
                  <p className="text-xs text-text-sec mt-0.5">{rec.date} • {rec.doctor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-full tracking-wider mr-2">{rec.type}</span>
                <button className="p-2 text-text-mut hover:text-primary transition-colors bg-white border border-card-border rounded-lg hover:shadow-sm"><Eye className="w-4 h-4"/></button>
                <button className="p-2 text-text-mut hover:text-primary transition-colors bg-white border border-card-border rounded-lg hover:shadow-sm"><Download className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
