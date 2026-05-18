import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import Icon from '../../components/Icon';

export function PatientDashboard({ user, setPage }) {
  const [stats, setStats] = useState({ appointments: 0, upcoming: 0, completed: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.get(`/appointments/patient/${user.user_id}`).then(data => {
      setRecent(data.slice(0, 5));
      setStats({
        appointments: data.length,
        upcoming: data.filter(a => a.status === 'confirmed' || a.status === 'pending').length,
        completed: data.filter(a => a.status === 'completed').length,
      });
    });
  }, [user.user_id]);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Good day, {user.name}! 👋</div>
        <div className="page-subtitle">Here's your health overview</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><Icon name="calendar" size={22} /></div>
          <div><div className="stat-value">{stats.appointments}</div><div className="stat-label">Total Appointments</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Icon name="clock" size={22} /></div>
          <div><div className="stat-value">{stats.upcoming}</div><div className="stat-label">Upcoming</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow"><Icon name="check" size={22} /></div>
          <div><div className="stat-value">{stats.completed}</div><div className="stat-label">Completed</div></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Appointments</span>
          <button className="btn btn-outline btn-sm" onClick={() => setPage('appointments')}>View All</button>
        </div>
        {recent.length === 0 ? (
          <div className="empty-state">
            <Icon name="calendar" size={48} />
            <p>No appointments yet. <span className="auth-link" onClick={() => setPage('doctors')}>Book one now</span></p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Doctor</th><th>Date & Time</th><th>Status</th></tr></thead>
              <tbody>
                {recent.map(a => (
                  <tr key={a.id}>
                    <td><strong>Dr. {a.doctor_name}</strong><div style={{ fontSize: 12, color: '#718096' }}>{a.doctor_specialty}</div></td>
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

export default PatientDashboard;
