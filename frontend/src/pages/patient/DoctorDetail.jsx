import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../api/api';
import Icon from '../../components/Icon';

export function DoctorDetail({ doctor, user, onBack }) {
  const [showBooking, setShowBooking] = useState(false);
  const [bookDate, setBookDate] = useState('');
  const [bookSlot, setBookSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [imgViewer, setImgViewer] = useState(null);

  const loadBookedSlots = useCallback(async (date) => {
    if (!date) return;
    const appts = await api.get(`/appointments/doctor/${doctor.id}`);
    const booked = appts.filter(a => a.date === date && a.status !== 'cancelled').map(a => a.time_slot);
    setBookedSlots(booked);
  }, [doctor.id]);

  useEffect(() => { if (bookDate) loadBookedSlots(bookDate); }, [bookDate, loadBookedSlots]);

  const book = async () => {
    if (!bookDate || !bookSlot) { setError('Please select date and time.'); return; }
    const res = await api.post('/appointments', {
      patient_id: user.user_id, 
      doctor_id: doctor.id,
      date: bookDate, 
      time_slot: bookSlot, 
      notes
    });
    if (res.error) { setError(res.error); return; }
    setSuccess('Appointment booked successfully!');
    setShowBooking(false);
    setBookSlot('');
    setBookDate('');
    setNotes('');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      {imgViewer && (
        <div className="img-viewer" onClick={() => setImgViewer(null)}>
          <img src={imgViewer} alt="Preview" />
        </div>
      )}

      <button className="btn btn-outline btn-sm" style={{ marginBottom: 20 }} onClick={onBack}>
        <Icon name="arrow_left" size={16} /> Back to Doctors
      </button>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="doctor-detail-header">
        <div className="doctor-detail-avatar">
          {doctor.profile_image ? <img src={`http://localhost:5000${doctor.profile_image}`} alt="" /> : doctor.name[0]}
        </div>
        <div className="doctor-detail-info">
          <h1>Dr. {doctor.name}</h1>
          <div style={{ color: '#4a5568', marginTop: 4 }}>{doctor.specialty}</div>
          <div className="info-chips">
            <div className="info-chip"><Icon name="award" size={14} />{doctor.experience_years} yrs experience</div>
            <div className="info-chip"><Icon name="dollar" size={14} />${doctor.consultation_fee} / visit</div>
            {doctor.phone && <div className="info-chip"><Icon name="phone" size={14} />{doctor.phone}</div>}
          </div>
        </div>
        <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={() => setShowBooking(true)}>
          <Icon name="calendar" size={16} /> Book Appointment
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title" style={{ marginBottom: 12 }}>About</div>
            <p style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.7 }}>{doctor.bio || 'No bio provided.'}</p>
          </div>
          {doctor.degree_image && (
            <div className="card">
              <div className="card-title" style={{ marginBottom: 12 }}>🎓 Degree / Certification</div>
              <img
                src={`http://localhost:5000${doctor.degree_image}`}
                alt="Degree"
                style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, cursor: 'pointer', objectFit: 'cover' }}
                onClick={() => setImgViewer(`http://localhost:5000${doctor.degree_image}`)}
              />
            </div>
          )}
        </div>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 12 }}>Available Times</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(doctor.available_slots || []).length === 0
              ? <p style={{ fontSize: 13, color: '#718096' }}>No slots set yet.</p>
              : (doctor.available_slots || []).map(s => (
                <div key={s} style={{ fontSize: 13, color: '#2563eb', background: '#dbeafe', padding: '6px 12px', borderRadius: 20, textAlign: 'center', fontWeight: 500 }}>{s}</div>
              ))}
          </div>
        </div>
      </div>

      {showBooking && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="card-title" style={{ fontSize: 18, fontFamily: 'Playfair Display, serif' }}>Book with Dr. {doctor.name}</div>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-group">
                <label className="form-label">Select Date</label>
                <input type="date" className="form-input" min={today} value={bookDate} onChange={e => setBookDate(e.target.value)} />
              </div>
              {bookDate && (
                <div className="form-group">
                  <label className="form-label">Select Time Slot</label>
                  <div className="slots-grid">
                    {(doctor.available_slots || []).map(slot => (
                      <button key={slot}
                        className={`slot-btn ${bookedSlots.includes(slot) ? 'taken' : bookSlot === slot ? 'selected' : ''}`}
                        onClick={() => !bookedSlots.includes(slot) && setBookSlot(slot)}
                        disabled={bookedSlots.includes(slot)}>
                        {slot}{bookedSlots.includes(slot) ? ' ✗' : ''}
                      </button>
                    ))}
                    {(doctor.available_slots || []).length === 0 && <p style={{ fontSize: 13, color: '#718096', gridColumn: '1/-1' }}>No slots available.</p>}
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <textarea className="form-textarea" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Describe your symptoms or reason for visit..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => { setShowBooking(false); setError(''); }}>Cancel</button>
              <button className="btn btn-primary" onClick={book}>Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDetail;
