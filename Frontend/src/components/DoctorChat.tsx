import React, { useMemo, useState } from 'react';
import { ChevronLeft, Send, Phone, Video } from 'lucide-react';

interface DoctorChatProps {
  onBack: () => void;
}

const getSelectedDoctor = () => {
  const name = localStorage.getItem('selectedDoctorName') || 'Dr. Aasha Poudel';
  const specialty = localStorage.getItem('selectedDoctorSpecialty') || 'Cardiologist';
  return { name, specialty };
};

export default function DoctorChat({ onBack }: DoctorChatProps) {
  const doctor = useMemo(() => getSelectedDoctor(), []);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'doctor',
      text: 'Namaste! How can I help you today?',
      time: '10:05 AM',
    },
    {
      id: 2,
      from: 'patient',
      text: 'I have mild chest discomfort after walking.',
      time: '10:06 AM',
    },
  ]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        from: 'patient',
        text: trimmed,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-bg-base p-6">
      <div className="max-w-4xl mx-auto bg-white border border-card-border rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-card-border bg-gray-50">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-card-border transition-colors"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5 text-text-main" />
            </button>
            <div>
              <div className="font-semibold text-text-main">{doctor.name}</div>
              <div className="text-xs text-text-mut">{doctor.specialty}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-card-border text-text-sec hover:text-text-main hover:bg-white transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg border border-card-border text-text-sec hover:text-text-main hover:bg-white transition-colors">
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto bg-white">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === 'patient' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm ${msg.from === 'patient' ? 'bg-primary text-white' : 'bg-gray-100 text-text-main'}`}>
                <div>{msg.text}</div>
                <div className={`text-[10px] mt-1 ${msg.from === 'patient' ? 'text-white/80' : 'text-text-mut'}`}>{msg.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-card-border bg-gray-50">
          <div className="flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message…"
              className="flex-1 bg-white border border-card-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleSend}
              className="bg-primary hover:bg-primary-hover text-white px-4 py-3 rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}