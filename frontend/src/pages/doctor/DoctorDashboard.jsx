import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import Icon from '../../components/Icon';

export function DoctorDashboard({ user, doctorProfile }) {
  const [appts, setAppts] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });

  useEffect(() => {
    if (!doctorProfile) return;
    api.get(`/appointments/doctor/${doctorProfile.id}`).then(data => {
      setAppts(data.slice(0, 5));
      setStats({
        total: data.length,
        pending: data.filter(a => a.status === 'pending').length,
        confirmed: data.filter(a => a.status === 'confirmed').length,
        completed: data.filter(a => a.status === 'completed').length,
      });
    });
  }, [doctorProfile]);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Welcome, Dr. {user.name}!</div>
        <div className="page-subtitle">{doctorProfile?.status === 'approved' ? '✅ Your profile is approved' : `⏳ Status: ${doctorProfile?.status || 'pending'}`}</div>
      </div>
      <div className="stats-grid">
        {[['total', 'Total Appointments', 'calendar', 'blue'], ['pending', 'Pending', 'clock', 'yellow'], ['confirmed', 'Confirmed', 'check', 'green'], ['completed', 'Completed', 'star', 'blue']].map(([k, label, icon, color]) => (
          <div key={k} className="stat-card">
            <div className={`stat-icon ${color}`}><Icon name={icon} size={22} /></div>
            <div><div className="stat-value">{stats[k]}</div><div className="stat-label">{label}</div></div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title" style={{ marginBottom: 16 }}>Recent Appointments</div>
        {appts.length === 0 ? <div className="empty-state"><Icon name="calendar" size={48} /><p>No appointments yet.</p></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Patient</th><th>Date & Time</th><th>Status</th></tr></thead>
              <tbody>
                {appts.map(a => (
                  <tr key={a.id}>
                    <td><strong>{a.patient_name}</strong></td>
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

export default DoctorDashboard;
