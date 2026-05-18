import React, { useState, useRef } from 'react';
import { api } from '../api/api';

export function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({ 
    name: '', 
    email: 'samir124@gmail.com', 
    password: 'samir@123', 
    phone: '', 
    specialty: '', 
    bio: '', 
    experience_years: '', 
    consultation_fee: '' 
  });
  const [profileFile, setProfileFile] = useState(null);
  const [degreeFile, setDegreeFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [degreePreview, setDegreePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const profileRef = useRef();
  const degreeRef = useRef();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

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

  const submit = async () => {
    setError(''); setLoading(true);
    try {
      if (mode === 'login') {
        const res = await api.post('/login', { email: form.email, password: form.password });
        if (res.error) { setError(res.error); return; }
        onLogin(res);
      } else {
        let res;
        if (role === 'doctor') {
          // Verify doctor uploads profile picture & degree
          if (!profileFile || !degreeFile) {
            setError('Please upload both your Profile Photo and Degree Certificate.');
            setLoading(false);
            return;
          }
          const fd = new FormData();
          fd.append('name', form.name);
          fd.append('email', form.email);
          fd.append('password', form.password);
          fd.append('phone', form.phone);
          fd.append('role', role);
          fd.append('specialty', form.specialty);
          fd.append('experience_years', form.experience_years);
          fd.append('consultation_fee', form.consultation_fee);
          fd.append('bio', form.bio);
          if (profileFile) fd.append('profile', profileFile);
          if (degreeFile) fd.append('degree', degreeFile);
          res = await api.upload('/register', fd);
        } else {
          res = await api.post('/register', { ...form, role });
        }

        if (res.error) { setError(res.error); return; }
        setMode('login');
        setError('');
        // Clear files
        setProfileFile(null);
        setDegreeFile(null);
        setProfilePreview(null);
        setDegreePreview(null);
        alert('Registered! Please login.');
      }
    } catch (e) { 
      setError('Connection error. Is the backend running?'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏥</div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: '#2563eb' }}>MedBook</div>
          <div style={{ fontSize: 13, color: '#718096', marginTop: 4 }}>Healthcare at your fingertips</div>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Sign In</button>
          <button className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>Register</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {mode === 'login' && (
          <div style={{ marginBottom: 16 }}>
            <div className="form-label">Sign in as...</div>
            <div className="role-btns">
              {['patient','doctor'].map(r => (
                <button key={r} className={`role-btn ${role === r ? 'active' : ''}`} onClick={() => {
                  setRole(r);
                  if (r === 'patient') {
                    setForm(f => ({ ...f, email: 'samir124@gmail.com', password: 'samir@123' }));
                  } else {
                    setForm(f => ({ ...f, email: 'aaryaniraula@gmail.com', password: 'aarya@123' }));
                  }
                }}>
                  {r === 'patient' ? '🙋 Patient' : '👨‍⚕️ Doctor'}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'register' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <div className="form-label">I am a...</div>
              <div className="role-btns">
                {['patient','doctor'].map(r => (
                  <button key={r} className={`role-btn ${role === r ? 'active' : ''}`} onClick={() => setRole(r)}>
                    {r === 'patient' ? '🙋 Patient' : '👨‍⚕️ Doctor'}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1234567890" />
              </div>
            </div>
            {role === 'doctor' && (
              <>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Specialty</label>
                    <input className="form-input" value={form.specialty} onChange={e => set('specialty', e.target.value)} placeholder="Cardiology" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experience (yrs)</label>
                    <input className="form-input" type="number" value={form.experience_years} onChange={e => set('experience_years', e.target.value)} placeholder="5" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Consultation Fee ($)</label>
                  <input className="form-input" type="number" value={form.consultation_fee} onChange={e => set('consultation_fee', e.target.value)} placeholder="150" />
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="form-textarea" value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Brief professional bio..." />
                </div>
                
                {/* Doctor Registration Upload Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label className="form-label">Profile Photo</label>
                    <div className="upload-area" onClick={() => profileRef.current.click()} style={{ padding: '16px' }}>
                      {profilePreview ? (
                        <img src={profilePreview} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ color: '#718096', fontSize: 12 }}>Click to upload photo</div>
                      )}
                    </div>
                    <input type="file" accept="image/*" ref={profileRef} style={{ display: 'none' }} onChange={e => handleFile('profile', e)} />
                  </div>
                  <div>
                    <label className="form-label">Degree Certificate</label>
                    <div className="upload-area" onClick={() => degreeRef.current.click()} style={{ padding: '16px' }}>
                      {degreePreview ? (
                        <img src={degreePreview} alt="Degree" style={{ maxHeight: 80, maxWidth: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ color: '#718096', fontSize: 12 }}>Click to upload degree</div>
                      )}
                    </div>
                    <input type="file" accept="image/*" ref={degreeRef} style={{ display: 'none' }} onChange={e => handleFile('degree', e)} />
                  </div>
                </div>
              </>
            )}
          </>
        )}

        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15 }} onClick={submit} disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        {mode === 'login' && (
          <div style={{ marginTop: 16, textAlign: 'center', fontSize: 13, color: '#718096' }}>
            Admin: admin@medbook.com / admin123
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
