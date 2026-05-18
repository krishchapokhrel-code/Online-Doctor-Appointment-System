import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../api/api';
import Icon from '../../components/Icon';

export function DoctorProfile({ user, doctorProfile, setDoctorProfile }) {
  const [tab, setTab] = useState('info');
  const [form, setForm] = useState({ specialty: '', bio: '', experience_years: '', consultation_fee: '' });
  const [profileFile, setProfileFile] = useState(null);
  const [degreeFile, setDegreeFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [degreePreview, setDegreePreview] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [success, setSuccess] = useState('');
  const [imgViewer, setImgViewer] = useState(null);
  const profileRef = useRef();
  const degreeRef = useRef();

  const ALL_SLOTS = ['08:00 AM','09:00 AM','10:00 AM','11:00 AM','12:00 PM','01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM'];

  useEffect(() => {
    if (doctorProfile) {
      setForm({ 
        specialty: doctorProfile.specialty || '', 
        bio: doctorProfile.bio || '', 
        experience_years: doctorProfile.experience_years || '', 
        consultation_fee: doctorProfile.consultation_fee || '' 
      });
      setSelectedSlots(doctorProfile.available_slots || []);
    }
  }, [doctorProfile]);

  const toggleSlot = (s) => setSelectedSlots(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const saveInfo = async () => {
    const res = await api.put(`/doctors/${doctorProfile.id}/profile`, { 
      ...form, 
      experience_years: parseInt(form.experience_years) || 0, 
      consultation_fee: parseFloat(form.consultation_fee) || 0.0 
    });
    setDoctorProfile(res);
    setSuccess('Profile updated!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const saveSlots = async () => {
    await api.put(`/doctors/${doctorProfile.id}/slots`, { slots: selectedSlots });
    setSuccess('Slots saved!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const uploadFiles = async () => {
    if (!profileFile && !degreeFile) return;
    const fd = new FormData();
    if (profileFile) fd.append('profile', profileFile);
    if (degreeFile) fd.append('degree', degreeFile);
    const res = await api.upload(`/doctors/${doctorProfile.id}/upload`, fd);
    setDoctorProfile(res.doctor);
    setSuccess('Files uploaded!');
    setProfileFile(null);
    setDegreeFile(null);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleFile = (type, e) => {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    if (type === 'profile') { 
      setProfileFile(f); 
      setProfilePreview(url); 
    } else { 
      setDegreeFile(f); 
      setDegreePreview(url); 
    }
  };

  if (!doctorProfile) return <div className="loading">Loading profile...</div>;

  return (
    <div>
      {imgViewer && <div className="img-viewer" onClick={() => setImgViewer(null)}><img src={imgViewer} alt="" /></div>}
      <div className="page-header">
        <div className="page-title">My Profile</div>
        <div className="page-subtitle">
          Status: <span className={`badge badge-${doctorProfile.status}`}>{doctorProfile.status}</span>
          {doctorProfile.status === 'pending' && ' — Awaiting admin approval'}
        </div>
      </div>
      {success && <div className="alert alert-success">{success}</div>}

      <div className="tabs">
        {['info', 'photos', 'availability'].map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>
            {t === 'info' ? 'Profile Info' : t === 'photos' ? 'Photo & Degree' : 'Availability'}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <div className="card">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Specialty</label>
              <input className="form-input" value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Experience (years)</label>
              <input className="form-input" type="number" value={form.experience_years} onChange={e => setForm(f => ({ ...f, experience_years: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Consultation Fee ($)</label>
            <input className="form-input" type="number" value={form.consultation_fee} onChange={e => setForm(f => ({ ...f, consultation_fee: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-textarea" rows={4} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
          </div>
          <button className="btn btn-primary" onClick={saveInfo}><Icon name="check" size={16} /> Save Changes</button>
        </div>
      )}

      {tab === 'photos' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>Profile Photo</div>
            <div className="upload-area" onClick={() => profileRef.current.click()}>
              {profilePreview || doctorProfile.profile_image ? (
                <img src={profilePreview || `http://localhost:5000${doctorProfile.profile_image}`} alt="" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <><Icon name="upload" size={32} color="#718096" /><div style={{ marginTop: 8, color: '#718096', fontSize: 14 }}>Click to upload photo</div></>
              )}
            </div>
            <input type="file" accept="image/*" ref={profileRef} style={{ display: 'none' }} onChange={e => handleFile('profile', e)} />
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>Degree / Certificate</div>
            <div className="upload-area" onClick={() => degreeRef.current.click()}>
              {degreePreview || doctorProfile.degree_image ? (
                <img
                  src={degreePreview || `http://localhost:5000${doctorProfile.degree_image}`}
                  alt=""
                  style={{ maxHeight: 160, maxWidth: '100%', borderRadius: 8, objectFit: 'cover', cursor: 'zoom-in' }}
                  onClick={(e) => { e.stopPropagation(); setImgViewer(degreePreview || `http://localhost:5000${doctorProfile.degree_image}`); }}
                />
              ) : (
                <><Icon name="award" size={32} color="#718096" /><div style={{ marginTop: 8, color: '#718096', fontSize: 14 }}>Click to upload degree</div></>
              )}
            </div>
            <input type="file" accept="image/*,application/pdf" ref={degreeRef} style={{ display: 'none' }} onChange={e => handleFile('degree', e)} />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <button className="btn btn-primary" onClick={uploadFiles} disabled={!profileFile && !degreeFile}>
              <Icon name="upload" size={16} /> Upload Files
            </button>
          </div>
        </div>
      )}

      {tab === 'availability' && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Set Available Time Slots</div>
          <p style={{ fontSize: 13, color: '#718096', marginBottom: 16 }}>Select the times you are available for appointments.</p>
          <div className="slots-manage-grid">
            {ALL_SLOTS.map(s => (
              <button key={s} className={`slot-manage-btn ${selectedSlots.includes(s) ? 'selected' : ''}`} onClick={() => toggleSlot(s)}>
                {selectedSlots.includes(s) ? '✓ ' : ''}{s}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <button className="btn btn-primary" onClick={saveSlots}><Icon name="check" size={16} /> Save Availability</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorProfile;
