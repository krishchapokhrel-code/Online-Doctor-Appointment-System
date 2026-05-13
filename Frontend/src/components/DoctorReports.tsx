import React, { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import toast from 'react-hot-toast';

export default function DoctorReports() {
  const user = useAuthStore(s => s.user);
  const { reports, patients, addReport } = useDataStore();
  const [showUpload, setShowUpload] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Lab Report'|'Imaging'|'Prescription'|'Visit Summary'|'Diagnosis'>('Lab Report');
  const [notes, setNotes] = useState('');
  const [filter, setFilter] = useState('all');

  const doctorReports = reports.filter(r => r.doctorId === (user?.id || 'd1'));
  const filtered = filter === 'all' ? doctorReports : doctorReports.filter(r => r.type === filter);

  const handleUpload = () => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient || !title) { toast.error('Select patient and enter title'); return; }
    addReport({
      patientId: patient.id, patientName: patient.name,
      doctorId: user?.id || 'd1', doctorName: user?.name || 'Doctor',
      title, type, date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), notes,
    });
    toast.success(`Report uploaded for ${patient.name}`);
    setShowUpload(false); setTitle(''); setNotes(''); setPatientId('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-text-main">Reports & Documents</h2>
        <button onClick={() => setShowUpload(true)} className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload Report
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'Lab Report', 'Imaging', 'Prescription', 'Diagnosis'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-white border border-card-border text-text-sec hover:bg-gray-50'}`}>{f === 'all' ? 'All' : f}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-card-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-text-mut"><FileText className="w-10 h-10 mx-auto mb-3 opacity-40" /><p className="font-medium">No reports yet</p></div>
        ) : (
          <div className="divide-y divide-card-border">
            {filtered.map(r => (
              <div key={r.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-semibold text-text-main">{r.title}</h4>
                    <p className="text-xs text-text-sec mt-0.5">Patient: {r.patientName} • {r.date}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-full tracking-wider">{r.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setShowUpload(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text-main">Upload Report</h2>
              <button onClick={() => setShowUpload(false)}><X className="w-5 h-5 text-text-mut" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-text-main mb-1">Patient</label>
                <select value={patientId} onChange={e => setPatientId(e.target.value)} className="w-full bg-input-bg border border-input-border px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-primary">
                  <option value="">Select patient...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select></div>
              <div><label className="block text-sm font-medium text-text-main mb-1">Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Report title" className="w-full bg-input-bg border border-input-border px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-primary" /></div>
              <div><label className="block text-sm font-medium text-text-main mb-1">Type</label>
                <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-input-bg border border-input-border px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-primary">
                  <option value="Lab Report">Lab Report</option><option value="Imaging">Imaging</option><option value="Prescription">Prescription</option><option value="Visit Summary">Visit Summary</option><option value="Diagnosis">Diagnosis</option>
                </select></div>
              <div><label className="block text-sm font-medium text-text-main mb-1">Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes..." className="w-full bg-input-bg border border-input-border px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-primary h-20 resize-none" /></div>
            </div>
            <button onClick={handleUpload} className="mt-6 w-full bg-primary text-white py-2.5 rounded-lg font-medium text-sm hover:bg-primary-hover">Upload</button>
          </div>
        </div>
      )}
    </div>
  );
}
