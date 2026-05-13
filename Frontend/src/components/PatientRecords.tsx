import React, { useState } from 'react';
import { FileText, Download, Eye, Activity, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import toast from 'react-hot-toast';

export default function PatientRecords() {
  const user = useAuthStore(s => s.user);
  const { getPatientReports } = useDataStore();
  const [filter, setFilter] = useState<'all'|'Lab Report'|'Prescription'|'Imaging'|'Visit Summary'|'Diagnosis'>('all');
  const [viewReport, setViewReport] = useState<any>(null);

  const allRecords = getPatientReports(user?.id || 'p1');
  const records = filter === 'all' ? allRecords : allRecords.filter(r => r.type === filter);

  const filters = [
    { id: 'all' as const, label: 'All Records' },
    { id: 'Lab Report' as const, label: 'Lab Results' },
    { id: 'Prescription' as const, label: 'Prescriptions' },
    { id: 'Imaging' as const, label: 'Imaging' },
  ];

  const handleDownload = (rec: any) => {
    const blob = new Blob([`Report: ${rec.title}\nType: ${rec.type}\nDate: ${rec.date}\nDoctor: ${rec.doctorName}\nNotes: ${rec.notes || 'N/A'}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${rec.title.replace(/\s+/g, '_')}.txt`; a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded');
  };

  const handleDownloadAll = () => {
    const content = allRecords.map(r => `${r.title} (${r.type}) - ${r.date} - ${r.doctorName}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'all_records.txt'; a.click();
    URL.revokeObjectURL(url);
    toast.success('All records downloaded');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-text-main">Medical Records</h2>
        <button onClick={handleDownloadAll} className="bg-white border border-card-border hover:bg-gray-50 text-text-main px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm flex items-center gap-2">
          <Download className="w-4 h-4"/> Download All
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-card-border overflow-hidden">
        <div className="p-4 border-b border-card-border flex gap-4 bg-gray-50 flex-wrap">
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`text-sm font-medium px-2 py-1 transition-colors ${filter === f.id ? 'font-semibold text-primary border-b-2 border-primary' : 'text-text-sec hover:text-text-main'}`}>{f.label}</button>
          ))}
        </div>
        <div className="divide-y divide-card-border">
          {records.length === 0 ? (
            <div className="p-12 text-center text-text-mut"><FileText className="w-10 h-10 mx-auto mb-3 opacity-40" /><p className="font-medium">No records found</p></div>
          ) : records.map(rec => (
            <div key={rec.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  {rec.type === 'Lab Report' ? <Activity className="w-5 h-5" /> : <FileText className="w-5 h-5"/>}
                </div>
                <div>
                  <h4 className="font-semibold text-text-main">{rec.title}</h4>
                  <p className="text-xs text-text-sec mt-0.5">{rec.date} • {rec.doctorName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-full tracking-wider mr-2">{rec.type}</span>
                <button onClick={() => setViewReport(rec)} className="p-2 text-text-mut hover:text-primary transition-colors bg-white border border-card-border rounded-lg hover:shadow-sm"><Eye className="w-4 h-4"/></button>
                <button onClick={() => handleDownload(rec)} className="p-2 text-text-mut hover:text-primary transition-colors bg-white border border-card-border rounded-lg hover:shadow-sm"><Download className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Report Modal */}
      {viewReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setViewReport(null)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-text-main">{viewReport.title}</h2>
                <p className="text-sm text-text-sec mt-1">{viewReport.type} • {viewReport.date}</p>
              </div>
              <button onClick={() => setViewReport(null)}><X className="w-5 h-5 text-text-mut" /></button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-bg-base rounded-xl border border-card-border">
                <p className="text-xs uppercase text-text-mut font-bold mb-1">Doctor</p>
                <p className="text-sm font-medium text-text-main">{viewReport.doctorName}</p>
              </div>
              <div className="p-4 bg-bg-base rounded-xl border border-card-border">
                <p className="text-xs uppercase text-text-mut font-bold mb-1">Notes</p>
                <p className="text-sm text-text-main">{viewReport.notes || 'No additional notes'}</p>
              </div>
            </div>
            <button onClick={() => { handleDownload(viewReport); setViewReport(null); }} className="mt-6 w-full bg-primary text-white py-2.5 rounded-lg font-medium text-sm hover:bg-primary-hover flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Download Report</button>
          </div>
        </div>
      )}
    </div>
  );
}
