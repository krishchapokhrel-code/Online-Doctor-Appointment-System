import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../api/api';
import Icon from '../../components/Icon';

export function MedBotPage({ user }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I am your MedBook Assistant. 🏥\n\nI can show you our doctors' available timings or help you book an appointment directly. Try clicking one of the suggested options below or type your message!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Suggested quick-action chips
  const suggestionChips = [
    { label: "⏱️ Check doctor timings", text: "What are the doctor timings?" },
    { label: "📅 Book an appointment", text: "I want to book an appointment" },
    { label: "🤒 I have a headache", text: "I have a headache" },
    { label: "❤️ My chest hurts", text: "My chest hurts" }
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const messageText = textToSend || input.trim();
    if (!messageText) return;

    if (!textToSend) setInput('');

    // 1. Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // 2. Fetch bot response from ML backend
      const res = await api.post('/chatbot', { message: messageText });
      
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: res.reply,
        action: res.action // Contains {type, doctors}
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: "Sorry, I am having trouble connecting to my brain. Please make sure the Flask server is running."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container card" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', padding: 0 }}>
      {/* Bot Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
        <div style={{ background: '#2563eb', color: '#fff', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}>
          <Icon name="bot" size={24} />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 16, color: '#1e3a8a' }}>MedBook AI Assistant</div>
          <div style={{ fontSize: 12, color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            Online • Ready to help
          </div>
        </div>
      </div>

      {/* Messages stream */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map(m => (
          <div key={m.id} style={{ display: 'flex', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start', gap: 8 }}>
            {m.sender === 'bot' && (
              <div style={{ background: '#dbeafe', color: '#2563eb', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="bot" size={16} />
              </div>
            )}
            <div style={{ maxWidth: '75%' }}>
              <div style={{
                background: m.sender === 'user' ? '#2563eb' : '#f7fafc',
                color: m.sender === 'user' ? '#fff' : '#2d3748',
                padding: '12px 16px',
                borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                fontSize: 14,
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                boxShadow: m.sender === 'user' ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
                border: m.sender === 'user' ? 'none' : '1px solid #edf2f7'
              }}>
                {m.text}
              </div>

              {/* Dynamic Interactive Booking Card */}
              {m.sender === 'bot' && m.action?.type === 'booking' && m.action.doctors?.length > 0 && (
                <BotBookingCard doctors={m.action.doctors} user={user} onComplete={(successMsg) => {
                  setMessages(prev => [...prev, {
                    id: Date.now() + 2,
                    sender: 'bot',
                    text: successMsg
                  }]);
                }} />
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ background: '#dbeafe', color: '#2563eb', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="bot" size={16} />
            </div>
            <div style={{ background: '#f7fafc', padding: '12px 16px', borderRadius: '18px 18px 18px 4px', fontSize: 13, color: '#718096', border: '1px solid #edf2f7' }}>
              <span className="typing-dots">
                Thinking<span>.</span><span>.</span><span>.</span>
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div style={{ padding: '0 20px 10px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.text)}
            className="btn btn-outline btn-sm"
            style={{ borderRadius: 20, fontSize: 12, padding: '6px 12px', background: '#fff', border: '1px solid #cbd5e0' }}
            disabled={loading}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input panel */}
      <div style={{ padding: 16, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 12, background: '#fff' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about doctor schedules, symptoms, or type 'book'..."
          style={{ flex: 1, border: '1px solid #cbd5e0', padding: '12px 16px', borderRadius: 8, outline: 'none', fontSize: 14 }}
          disabled={loading}
        />
        <button
          className="btn btn-primary"
          style={{ padding: '0 16px', height: 46, minWidth: 46, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
        >
          <Icon name="send" size={18} />
        </button>
      </div>
    </div>
  );
}

// Inline Interactive Booking Card
function BotBookingCard({ doctors, user, onComplete }) {
  const [selectedDocId, setSelectedDocId] = useState('');
  const [bookDate, setBookDate] = useState('');
  const [bookSlot, setBookSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booked, setBooked] = useState(false);

  const selectedDoctor = doctors.find(d => d.id == selectedDocId);

  useEffect(() => {
    if (selectedDoctor) {
      setAvailableSlots(selectedDoctor.available_slots || []);
      setBookSlot('');
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDocId]);

  useEffect(() => {
    const fetchBooked = async () => {
      if (!selectedDocId || !bookDate) return;
      try {
        const appts = await api.get(`/appointments/doctor/${selectedDocId}`);
        const booked = appts.filter(a => a.date === bookDate && a.status !== 'cancelled').map(a => a.time_slot);
        setBookedSlots(booked);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooked();
  }, [selectedDocId, bookDate]);

  const handleBook = async () => {
    if (!selectedDocId || !bookDate || !bookSlot) {
      setError("Please pick a doctor, date, and time slot.");
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/appointments', {
        patient_id: user.user_id,
        doctor_id: parseInt(selectedDocId),
        date: bookDate,
        time_slot: bookSlot,
        notes: notes || "Booked via AI Assistant"
      });

      if (res.error) {
        setError(res.error);
        return;
      }

      setBooked(true);
      onComplete(`🎉 Booking Confirmed!\n\nSuccessfully scheduled an appointment with **Dr. ${selectedDoctor.name}** (${selectedDoctor.specialty}) on **${bookDate}** at **${bookSlot}**.`);
    } catch (err) {
      setError("Connection error. Could not save appointment.");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (booked) {
    return (
      <div className="card" style={{ marginTop: 12, padding: 16, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: 13, borderRadius: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
          <Icon name="check" size={16} /> Appointment Scheduled!
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: 12, border: '1px solid #cbd5e0', padding: 16, background: '#fff', display: 'flex', flexDirection: 'column', gap: 12, borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #edf2f7', paddingBottom: 8 }}>
        <div style={{ color: '#2563eb' }}><Icon name="calendar" size={16} /></div>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#2d3748' }}>AI Booking Assistant</div>
      </div>

      {error && <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '8px 12px', borderRadius: 6, fontSize: 12 }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Doctor Selector */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: '#4a5568', display: 'block', marginBottom: 4 }}>Select Doctor</label>
          <select value={selectedDocId} onChange={e => setSelectedDocId(e.target.value)} style={{ width: '100%', border: '1px solid #cbd5e0', padding: 8, borderRadius: 6, fontSize: 13, outline: 'none' }}>
            <option value="">-- Choose Doctor --</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialty})</option>
            ))}
          </select>
        </div>

        {selectedDocId && (
          <>
            {/* Date Selector */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#4a5568', display: 'block', marginBottom: 4 }}>Select Date</label>
              <input type="date" min={today} value={bookDate} onChange={e => setBookDate(e.target.value)} style={{ width: '100%', border: '1px solid #cbd5e0', padding: 8, borderRadius: 6, fontSize: 13, outline: 'none' }} />
            </div>

            {bookDate && (
              /* Slots Grid */
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#4a5568', display: 'block', marginBottom: 6 }}>Available Slots</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  {availableSlots.map(slot => {
                    const isTaken = bookedSlots.includes(slot);
                    const isSelected = bookSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => !isTaken && setBookSlot(slot)}
                        style={{
                          padding: '6px 8px',
                          fontSize: 11,
                          fontWeight: 500,
                          borderRadius: 6,
                          border: '1px solid',
                          borderColor: isTaken ? '#e2e8f0' : isSelected ? '#2563eb' : '#cbd5e0',
                          background: isTaken ? '#edf2f7' : isSelected ? '#ebf8ff' : '#fff',
                          color: isTaken ? '#a0aec0' : isSelected ? '#2b6cb0' : '#4a5568',
                          cursor: isTaken ? 'not-allowed' : 'pointer'
                        }}
                        disabled={isTaken}
                      >
                        {slot}{isTaken ? ' ✗' : ''}
                      </button>
                    );
                  })}
                  {availableSlots.length === 0 && <div style={{ gridColumn: '1/-1', fontSize: 12, color: '#718096', textAlign: 'center', padding: 8 }}>No slots set by doctor.</div>}
                </div>
              </div>
            )}

            {/* Notes input */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#4a5568', display: 'block', marginBottom: 4 }}>Notes (Reason for Visit)</label>
              <input type="text" placeholder="Optional notes..." value={notes} onChange={e => setNotes(e.target.value)} style={{ width: '100%', border: '1px solid #cbd5e0', padding: 8, borderRadius: 6, fontSize: 13, outline: 'none' }} />
            </div>
          </>
        )}
      </div>

      <button onClick={handleBook} disabled={loading || !selectedDocId || !bookDate || !bookSlot} style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'} onMouseOut={e => e.currentTarget.style.background = '#2563eb'}>
        {loading ? "Scheduling Visit..." : "Schedule Appointment"}
      </button>
    </div>
  );
}

export default MedBotPage;
