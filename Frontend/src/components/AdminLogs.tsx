import React, { useState } from 'react';
import { Search, Activity } from 'lucide-react';
import { useDataStore } from '../store/dataStore';

export default function AdminLogs() {
  const { logs } = useDataStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = logs.filter(l => {
    if (filter !== 'all' && l.type !== filter) return false;
    if (search && !l.action.toLowerCase().includes(search.toLowerCase()) && !l.userName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const typeColors: Record<string,string> = { auth:'bg-blue-100 text-blue-700', appointment:'bg-green-100 text-green-700', report:'bg-purple-100 text-purple-700', admin:'bg-red-100 text-red-700', system:'bg-gray-100 text-gray-600' };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-text-main">System Logs</h2>
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-mut" /><input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search logs..." className="pl-9 pr-4 py-2 border border-card-border rounded-lg text-sm focus:outline-none focus:border-primary w-64" /></div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {['all','auth','appointment','report','admin','system'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${filter===f?'bg-primary text-white':'bg-white border border-card-border text-text-sec hover:bg-gray-50'}`}>{f}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-card-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-text-mut"><Activity className="w-10 h-10 mx-auto mb-3 opacity-40" /><p className="font-medium">No logs recorded yet</p><p className="text-sm mt-1">Actions will appear here as they happen</p></div>
        ) : (
          <div className="divide-y divide-card-border">
            {filtered.map(l => (
              <div key={l.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-bg-base flex items-center justify-center flex-shrink-0"><Activity className="w-4 h-4 text-text-mut" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><p className="text-sm font-medium text-text-main">{l.action}</p><span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${typeColors[l.type]||''}`}>{l.type}</span></div>
                  <p className="text-xs text-text-sec mt-0.5">{l.userName} • {l.details}</p>
                </div>
                <span className="text-xs text-text-mut whitespace-nowrap">{new Date(l.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
