import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import Icon from '../../components/Icon';

export function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => { api.get('/admin/stats').then(setStats); }, []);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Admin Dashboard</div>
        <div className="page-subtitle">Platform overview</div>
      </div>
      <div className="stats-grid">
        {[
          ['total_doctors', 'Total Doctors', 'stethoscope', 'blue'],
          ['pending_doctors', 'Pending Approval', 'clock', 'yellow'],
          ['approved_doctors', 'Approved Doctors', 'check', 'green'],
          ['total_patients', 'Total Patients', 'user', 'blue'],
          ['total_appointments', 'Appointments', 'calendar', 'green'],
        ].map(([k, label, icon, color]) => (
          <div key={k} className="stat-card">
            <div className={`stat-icon ${color}`}><Icon name={icon} size={22} /></div>
            <div><div className="stat-value">{stats[k] ?? 0}</div><div className="stat-label">{label}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
