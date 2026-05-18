import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import Icon from '../../components/Icon';

export function PatientAppointments({ user }) {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/appointments/patient/${user.user_id}`).then(d => { setAppts(d); setLoading(false); });
  }, [user.user_id]);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    await api.put(`/appointments/${id}/status`, { status: 'cancelled' });
    setAppts(a => a.map(x => x.id === id ? { ...x, status: 'cancelled' } : x));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">My Appointments</div>
        <div className="page-subtitle">{appts.length} total appointment{appts.length !== 1 ? 's' : ''}</div>
      </div>
      <div className="card">
        {appts.length === 0 ? (
          <div className="empty-state"><Icon name="calendar" size={48} /><p>No appointments booked yet.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Doctor</th><th>Date</th><th>Time</th><th>Notes</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {appts.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                          {a.doctor_profile ? <img src={`http://localhost:5000${a.doctor_profile}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : a.doctor_name[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>Dr. {a.doctor_name}</div>
                          <div style={{ fontSize: 12, color: '#718096' }}>{a.doctor_specialty}</div>
                        </div>
                      </div>
                    </td>
                    <td>{a.date}</td>
                    <td>{a.time_slot}</td>
                    <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.notes || '-'}</td>
                    <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                    <td>
                      {(a.status === 'pending' || a.status === 'confirmed') && (
                        <button className="btn btn-danger btn-sm" onClick={() => cancel(a.id)}>Cancel</button>
                      )}
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

export default PatientAppointments;
