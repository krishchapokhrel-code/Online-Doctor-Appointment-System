import React, { useState } from 'react';
import { Users, Search, X, Shield, Trash2 } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const { doctors, patients, updatePatientStatus, updateDoctorStatus, deleteUser } = useDataStore();
  const [tab, setTab] = useState<'patients'|'doctors'>('patients');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<{id:string,type:'doctor'|'patient'}|null>(null);

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const filteredDoctors = doctors.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  const statusColors: Record<string, string> = { active: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', suspended: 'bg-red-100 text-red-600', Available: 'bg-green-100 text-green-700', Busy: 'bg-orange-100 text-orange-700', Offline: 'bg-gray-100 text-gray-600' };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-text-main">Users & Doctors</h2>
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-mut" /><input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-4 py-2 border border-card-border rounded-lg text-sm focus:outline-none focus:border-primary w-64" /></div>
      </div>

      <div className="flex gap-2">
        <button onClick={()=>setTab('patients')} className={`px-5 py-2 rounded-lg text-sm font-medium ${tab==='patients'?'bg-primary text-white':'bg-white border border-card-border text-text-sec'}`}>Patients ({patients.length})</button>
        <button onClick={()=>setTab('doctors')} className={`px-5 py-2 rounded-lg text-sm font-medium ${tab==='doctors'?'bg-primary text-white':'bg-white border border-card-border text-text-sec'}`}>Doctors ({doctors.length})</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-card-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-card-border text-xs uppercase text-text-mut font-semibold">
            <tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">{tab === 'patients' ? 'Contact' : 'Specialty'}</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {tab === 'patients' ? filteredPatients.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{p.name.charAt(0)}</div><div><span className="font-semibold text-text-main">{p.name}</span><p className="text-xs text-text-mut">{p.email}</p></div></div></td>
                <td className="px-6 py-4 text-sm text-text-sec">{p.phone}</td>
                <td className="px-6 py-4"><span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${statusColors[p.status]||''}`}>{p.status}</span></td>
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-2 justify-end">
                    {p.status === 'pending' && <button onClick={()=>{updatePatientStatus(p.id,'active');toast.success('Approved')}} className="px-3 py-1 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100">Approve</button>}
                    {p.status === 'active' && <button onClick={()=>{updatePatientStatus(p.id,'suspended');toast.success('Suspended')}} className="px-3 py-1 text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg hover:bg-yellow-100">Suspend</button>}
                    {p.status === 'suspended' && <button onClick={()=>{updatePatientStatus(p.id,'active');toast.success('Reactivated')}} className="px-3 py-1 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100">Reactivate</button>}
                    <button onClick={()=>setDeleteId({id:p.id,type:'patient'})} className="px-3 py-1 text-xs font-medium bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </td>
              </tr>
            )) : filteredDoctors.map(d => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{d.name.replace('Dr. ','').charAt(0)}</div><div><span className="font-semibold text-text-main">{d.name}</span><p className="text-xs text-text-mut">{d.email}</p></div></div></td>
                <td className="px-6 py-4 text-sm text-text-sec">{d.specialty} • {d.experience}</td>
                <td className="px-6 py-4"><span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${statusColors[d.status]||''}`}>{d.status}</span></td>
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-2 justify-end">
                    <button onClick={()=>{updateDoctorStatus(d.id, d.status==='Offline'?'Available':'Offline');toast.success('Status updated')}} className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100">{d.status==='Offline'?'Enable':'Disable'}</button>
                    <button onClick={()=>setDeleteId({id:d.id,type:'doctor'})} className="px-3 py-1 text-xs font-medium bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={()=>setDeleteId(null)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl" onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-bold text-text-main mb-2">Delete User?</h3><p className="text-sm text-text-sec mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={()=>setDeleteId(null)} className="flex-1 px-4 py-2.5 border border-card-border rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={()=>{deleteUser(deleteId.id,deleteId.type);setDeleteId(null);toast.success('User deleted')}} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
