import React, { useState } from 'react';
import { Search, FileText, Upload, X, Eye } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function DoctorPatients() {
  const user = useAuthStore(s => s.user);
  const { patients, reports, addReport } = useDataStore();
  const [search, setSearch] = useState('');
  const [uploadFor, setUploadFor] = useState<any>(null);
  const [viewRecords, setViewRecords] = useState<any>(null);
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState<'Lab Report'|'Imaging'|'Prescription'|'Visit Summary'|'Diagnosis'>('Lab Report');
  const [reportNotes, setReportNotes] = useState('');

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.condition.toLowerCase().includes(search.toLowerCase()));

  const handleUpload = () => {
    if (!reportTitle) { toast.error('Enter report title'); return; }
    addReport({
      patientId: uploadFor.id, patientName: uploadFor.name,
      doctorId: user?.id || 'd1', doctorName: user?.name || 'Doctor',
      title: reportTitle, type: reportType,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      notes: reportNotes,
    });
    toast.success(`Report uploaded for ${uploadFor.name}`);
    setUploadFor(null); setReportTitle(''); setReportNotes('');
  };

  const patientReports = viewRecords ? reports.filter(r => r.patientId === viewRecords.id) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-text-main">Patients Directory</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-mut" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..." className="pl-9 pr-4 py-2 border border-card-border rounded-lg text-sm focus:outline-none focus:border-primary w-64" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-card-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-card-border text-xs uppercase text-text-mut font-semibold">
            <tr><th className="px-6 py-3">Patient Name</th><th className="px-6 py-3">Age / Gender</th><th className="px-6 py-3">Last Visit</th><th className="px-6 py-3">Condition</th><th className="px-6 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {filtered.map(patient => (
              <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{patient.name.charAt(0)}</div>
                    <div>
                      <span className="font-semibold text-text-main">{patient.name}</span>
                      <span className={`ml-2 px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${patient.status === 'active' ? 'bg-green-100 text-green-700' : patient.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>{patient.status}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-text-sec">{patient.age} / {patient.gender}</td>
                <td className="px-6 py-4 text-sm text-text-sec">{patient.lastVisit}</td>
                <td className="px-6 py-4"><span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">{patient.condition}</span></td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => setViewRecords(patient)} className="text-primary hover:text-primary-hover font-medium text-sm flex items-center gap-1">
                      <Eye className="w-4 h-4" /> Records
                    </button>
                    <button onClick={() => setUploadFor(patient)} className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1">
                      <Upload className="w-4 h-4" /> Upload
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Report Modal */}
      {uploadFor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setUploadFor(null)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text-main">Upload Report</h2>
              <button onClick={() => setUploadFor(null)}><X className="w-5 h-5 text-text-mut" /></button>
            </div>
            <p className="text-sm text-text-sec mb-4">Patient: <strong>{uploadFor.name}</strong></p>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-text-main mb-1">Report Title</label>
                <input type="text" value={reportTitle} onChange={e => setReportTitle(e.target.value)} placeholder="e.g. Blood Test Results" className="w-full bg-input-bg border border-input-border px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-primary" /></div>
              <div><label className="block text-sm font-medium text-text-main mb-1">Type</label>
                <select value={reportType} onChange={e => setReportType(e.target.value as any)} className="w-full bg-input-bg border border-input-border px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-primary">
                  <option value="Lab Report">Lab Report</option><option value="Imaging">Imaging</option><option value="Prescription">Prescription</option><option value="Visit Summary">Visit Summary</option><option value="Diagnosis">Diagnosis</option>
                </select></div>
              <div><label className="block text-sm font-medium text-text-main mb-1">Notes</label>
                <textarea value={reportNotes} onChange={e => setReportNotes(e.target.value)} placeholder="Additional notes..." className="w-full bg-input-bg border border-input-border px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-primary h-20 resize-none" /></div>
              <div className="p-4 border-2 border-dashed border-card-border rounded-xl text-center text-text-mut text-sm cursor-pointer hover:border-primary hover:text-primary transition-colors">
                <Upload className="w-6 h-6 mx-auto mb-2" /><p>Click to attach file (demo)</p>
              </div>
            </div>
            <button onClick={handleUpload} className="mt-6 w-full bg-primary text-white py-2.5 rounded-lg font-medium text-sm hover:bg-primary-hover">Upload Report</button>
          </div>
        </div>
      )}

      {/* View Records Modal */}
      {viewRecords && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setViewRecords(null)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text-main">{viewRecords.name}'s Records</h2>
              <button onClick={() => setViewRecords(null)}><X className="w-5 h-5 text-text-mut" /></button>
            </div>
            {patientReports.length === 0 ? (
              <div className="text-center py-8 text-text-mut"><FileText className="w-10 h-10 mx-auto mb-3 opacity-40" /><p>No records found</p></div>
            ) : (
              <div className="space-y-3">
                {patientReports.map(r => (
                  <div key={r.id} className="p-4 bg-bg-base rounded-xl border border-card-border">
                    <div className="flex justify-between items-start">
                      <div><p className="font-semibold text-text-main">{r.title}</p><p className="text-xs text-text-sec mt-0.5">{r.type} • {r.date}</p></div>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">{r.type}</span>
                    </div>
                    {r.notes && <p className="text-sm text-text-sec mt-2">{r.notes}</p>}
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => { setViewRecords(null); setUploadFor(viewRecords); }} className="mt-6 w-full bg-primary/10 text-primary py-2.5 rounded-lg font-medium text-sm hover:bg-primary/20 flex items-center justify-center gap-2"><Upload className="w-4 h-4" /> Upload New Report</button>
          </div>
        </div>
      )}
    </div>
  );
}
