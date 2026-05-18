import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import Icon from '../../components/Icon';

export function FindDoctors({ user, setPage, setSelectedDoctor }) {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/doctors').then(data => { setDoctors(data); setLoading(false); });
  }, []);

  const specialties = [...new Set(doctors.map(d => d.specialty).filter(Boolean))];
  const filtered = doctors.filter(d =>
    (d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty?.toLowerCase().includes(search.toLowerCase())) &&
    (!specialty || d.specialty === specialty)
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Find a Doctor</div>
        <div className="page-subtitle">Browse our verified healthcare professionals</div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input className="form-input" placeholder="Search by name or specialty..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#718096' }}><Icon name="search" size={16} /></span>
        </div>
        <select className="form-select" style={{ width: 200 }} value={specialty} onChange={e => setSpecialty(e.target.value)}>
          <option value="">All Specialties</option>
          {specialties.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <div className="loading">Loading doctors...</div> : (
        <div className="doctors-grid">
          {filtered.map(doc => (
            <div key={doc.id} className="doctor-card" onClick={() => { setSelectedDoctor(doc); setPage('doctor-detail'); }}>
              <div className="doctor-card-header">
                <div className="doctor-avatar">
                  {doc.profile_image ? <img src={`http://localhost:5000${doc.profile_image}`} alt="" /> : doc.name[0]}
                </div>
                <div className="doctor-name">Dr. {doc.name}</div>
                <div className="doctor-specialty">{doc.specialty}</div>
              </div>
              <div className="doctor-card-body">
                <div className="doctor-meta">
                  <div className="doctor-fee">${doc.consultation_fee}</div>
                  <div className="doctor-exp">{doc.experience_years} yrs exp.</div>
                </div>
                <div style={{ fontSize: 13, color: '#4a5568', marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {doc.bio || 'Experienced medical professional.'}
                </div>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <Icon name="search" size={48} />
              <p>No doctors found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FindDoctors;
