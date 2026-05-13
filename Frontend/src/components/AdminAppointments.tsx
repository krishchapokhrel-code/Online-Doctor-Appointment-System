import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Video } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import toast from 'react-hot-toast';

export default function AdminAppointments() {
  const { appointments, updateAppointmentStatus } = useDataStore();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);
  const statusColors: Record<string,string> = { pending:'bg-yellow-100 text-yellow-700', confirmed:'bg-green-100 text-green-700', 'in-progress':'bg-blue-100 text-blue-700', completed:'bg-gray-100 text-gray-600', cancelled:'bg-red-100 text-red-600' };

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a=>a.status==='pending').length,
    confirmed: appointments.filter(a=>a.status==='confirmed').length,
    completed: appointments.filter(a=>a.status==='completed').length,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-main">All Appointments</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{l:'Total',v:stats.total,c:'bg-blue-50 text-blue-700'},{l:'Pending',v:stats.pending,c:'bg-yellow-50 text-yellow-700'},{l:'Confirmed',v:stats.confirmed,c:'bg-green-50 text-green-700'},{l:'Completed',v:stats.completed,c:'bg-gray-50 text-gray-700'}].map(s=>(
          <div key={s.l} className={`p-4 rounded-xl border border-card-border ${s.c}`}><p className="text-xs font-bold uppercase opacity-70">{s.l}</p><p className="text-2xl font-bold mt-1">{s.v}</p></div>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {['all','pending','confirmed','in-progress','completed','cancelled'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${filter===f?'bg-primary text-white':'bg-white border border-card-border text-text-sec hover:bg-gray-50'}`}>{f}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-card-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-card-border text-xs uppercase text-text-mut font-semibold">
            <tr><th className="px-6 py-3">Patient</th><th className="px-6 py-3">Doctor</th><th className="px-6 py-3">Date/Time</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {filtered.map(a=>(
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-text-main text-sm">{a.patientName}</td>
                <td className="px-6 py-4 text-sm text-text-sec">{a.doctorName}</td>
                <td className="px-6 py-4 text-sm text-text-sec">{a.date} • {a.time} {a.session}</td>
                <td className="px-6 py-4"><span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${statusColors[a.status]||''}`}>{a.status}</span></td>
                <td className="px-6 py-4 text-right">
                  {a.status !== 'completed' && a.status !== 'cancelled' && (
                    <button onClick={()=>{updateAppointmentStatus(a.id,'cancelled');toast.success('Cancelled')}} className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100">Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-8 text-center text-text-mut">No appointments found</div>}
      </div>
    </div>
  );
}
