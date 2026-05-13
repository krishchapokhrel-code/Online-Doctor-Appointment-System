import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { useDataStore } from '../store/dataStore';

export default function AdminReports() {
  const { reports } = useDataStore();
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? reports : reports.filter(r => r.type === filter);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-main">All Reports</h2>
      <div className="flex gap-2 flex-wrap">
        {['all','Lab Report','Imaging','Prescription','Visit Summary','Diagnosis'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${filter===f?'bg-primary text-white':'bg-white border border-card-border text-text-sec hover:bg-gray-50'}`}>{f==='all'?'All':f}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-card-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-card-border text-xs uppercase text-text-mut font-semibold">
            <tr><th className="px-6 py-3">Title</th><th className="px-6 py-3">Patient</th><th className="px-6 py-3">Doctor</th><th className="px-6 py-3">Type</th><th className="px-6 py-3">Date</th></tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {filtered.map(r=>(
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-text-main text-sm">{r.title}</td>
                <td className="px-6 py-4 text-sm text-text-sec">{r.patientName}</td>
                <td className="px-6 py-4 text-sm text-text-sec">{r.doctorName}</td>
                <td className="px-6 py-4"><span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded-full">{r.type}</span></td>
                <td className="px-6 py-4 text-sm text-text-sec">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-8 text-center text-text-mut"><FileText className="w-10 h-10 mx-auto mb-3 opacity-40" /><p>No reports found</p></div>}
      </div>
    </div>
  );
}
