import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import Icon from '../../components/Icon';

export function DoctorAppointments({ user, doctorProfile }) {
  const [appts, setAppts] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!doctorProfile) return;
    api.get(`/appointments/doctor/${doctorProfile.id}`).then(setAppts);
  }, [doctorProfile]);

  const updateStatus = async (id, status) => {
    await api.put(`/appointments/${id}/status`, { status });
    setAppts(a => a.map(x => x.id === id ? { ...x, status } : x));
  };

  const filtered = filter === 'all' ? appts : appts.filter(a => a.status === filter);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Appointments</div>
        <div className="page-subtitle">Manage your patient appointments</div>
      </div>

      <div className="tabs">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
          <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      <div className="card">
        {filtered.length === 0 ? <div className="empty-state"><Icon name="calendar" size={48} /><p>No appointments.</p></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Patient</th><th>Date</th><th>Time</th><th>Notes</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td><strong>{a.patient_name}</strong><div style={{ fontSize: 12, color: '#718096' }}>{a.patient_email}</div></td>
                    <td>{a.date}</td>
                    <td>{a.time_slot}</td>
                    <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.notes || '-'}</td>
                    <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {a.status === 'pending' && <>
                          <button className="btn btn-success btn-sm" onClick={() => updateStatus(a.id, 'confirmed')}><Icon name="check" size={14} /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => updateStatus(a.id, 'cancelled')}><Icon name="x" size={14} /></button>
                        </>}
                        {a.status === 'confirmed' && (
                          <button className="btn btn-primary btn-sm" onClick={() => updateStatus(a.id, 'completed')}>Complete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorAppointments;
