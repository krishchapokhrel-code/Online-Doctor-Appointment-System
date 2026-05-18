import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import Icon from '../../components/Icon';

export function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [imgViewer, setImgViewer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/admin/doctors').then(d => { setDoctors(d); setLoading(false); }); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/admin/doctors/${id}/status`, { status });
    setDoctors(d => d.map(x => x.id === id ? { ...x, status } : x));
  };

  const filtered = filter === 'all' ? doctors : doctors.filter(d => d.status === filter);

  return (
    <div>
      {imgViewer && <div className="img-viewer" onClick={() => setImgViewer(null)}><img src={imgViewer} alt="" /></div>}
      <div className="page-header">
        <div className="page-title">Doctor Management</div>
        <div className="page-subtitle">Review and approve doctor applications</div>
      </div>

      <div className="tabs">
        {['pending', 'approved', 'rejected', 'all'].map(f => (
          <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>
            {f} {f !== 'all' && `(${doctors.filter(d => d.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? <div className="loading">Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.length === 0 && <div className="empty-state card"><Icon name="user" size={48} /><p>No doctors in this category.</p></div>}
          {filtered.map(doc => (
            <div key={doc.id} className="card">
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div className="doctor-avatar" style={{ width: 72, height: 72, borderRadius: '50%', flexShrink: 0, border: '2px solid #e2e8f0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dbeafe', color: '#2563eb', fontSize: 24, fontWeight: 700 }}>
                  {doc.profile_image ? <img src={`http://localhost:5000${doc.profile_image}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : doc.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>Dr. {doc.name}</div>
                      <div style={{ fontSize: 13, color: '#4a5568' }}>{doc.specialty} • {doc.experience_years} yrs • ${doc.consultation_fee}/visit</div>
                      <div style={{ fontSize: 13, color: '#718096', marginTop: 4 }}>{doc.email}</div>
                    </div>
                    <span className={`badge badge-${doc.status}`}>{doc.status}</span>
                  </div>
                  {doc.bio && <p style={{ fontSize: 13, color: '#4a5568', margin: '8px 0' }}>{doc.bio}</p>}
                  <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    {doc.degree_image && (
                      <button className="btn btn-outline btn-sm" onClick={() => setImgViewer(`http://localhost:5000${doc.degree_image}`)}>
                        <Icon name="award" size={14} /> View Degree
                      </button>
                    )}
                    {doc.status !== 'approved' && (
                      <button className="btn btn-success btn-sm" onClick={() => updateStatus(doc.id, 'approved')}>
                        <Icon name="check" size={14} /> Approve
                      </button>
                    )}
                    {doc.status !== 'rejected' && (
                      <button className="btn btn-danger btn-sm" onClick={() => updateStatus(doc.id, 'rejected')}>
                        <Icon name="x" size={14} /> Reject
                      </button>
                    )}
                    {doc.status !== 'pending' && (
                      <button className="btn btn-outline btn-sm" onClick={() => updateStatus(doc.id, 'pending')}>
                        Reset to Pending
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDoctors;
