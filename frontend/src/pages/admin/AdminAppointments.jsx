import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import Icon from '../../components/Icon';

export function AdminAppointments() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/doctors').then(async (docs) => {
      const all = [];
      for (const d of docs) {
        try {
          const da = await api.get(`/appointments/doctor/${d.id}`);
          all.push(...da);
        } catch (e) {
          console.error(e);
        }
      }
      const seen = new Set();
      const unique = all.filter(a => { if (seen.has(a.id)) return false; seen.add(a.id); return true; });
      setAppts(unique.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">All Appointments</div>
        <div className="page-subtitle">{appts.length} total across the platform</div>
      </div>
      <div className="card">
        {loading ? <div className="loading">Loading...</div> : appts.length === 0 ? (
          <div className="empty-state"><Icon name="calendar" size={48} /><p>No appointments yet.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Status</th></tr></thead>
              <tbody>
                {appts.map(a => (
                  <tr key={a.id}>
                    <td><strong>{a.patient_name}</strong></td>
                    <td>Dr. {a.doctor_name}<div style={{ fontSize: 12, color: '#718096' }}>{a.doctor_specialty}</div></td>
                    <td>{a.date} at {a.time_slot}</td>
                    <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
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

export default AdminAppointments;
