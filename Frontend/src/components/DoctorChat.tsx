import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import toast from 'react-hot-toast';

export default function DoctorChat() {
  const user = useAuthStore(s => s.user);
  const { conversations, getConversationMessages, sendMessage } = useDataStore();
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const doctorConvs = conversations.filter(c => c.doctorId === (user?.id || 'd1'));
  const messages = selectedConv ? getConversationMessages(selectedConv) : [];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length, selectedConv]);

  const handleSend = () => {
    if (!input.trim() || !selectedConv) return;
    sendMessage(selectedConv, user?.id || 'd1', 'doctor', input.trim());
    setInput('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-main">Messages</h2>
      <div className="flex gap-6 h-[calc(100vh-260px)] min-h-[400px]">
        {/* Conversation List */}
        <div className="w-72 bg-white rounded-xl border border-card-border shadow-sm overflow-hidden flex-shrink-0 flex flex-col">
          <div className="p-4 border-b border-card-border">
            <h3 className="font-semibold text-text-main text-sm">Patients</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-card-border">
            {doctorConvs.length === 0 ? (
              <div className="p-6 text-center text-text-mut text-sm">No conversations</div>
            ) : doctorConvs.map(c => (
              <button key={c.id} onClick={() => setSelectedConv(c.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${selectedConv === c.id ? 'bg-[#f0f7fa] border-l-4 border-l-primary' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">{c.patientName.charAt(0)}</div>
                  <div className="min-w-0">
                    <p className="font-semibold text-text-main text-sm truncate">{c.patientName}</p>
                    <p className="text-xs text-text-mut truncate">{c.lastMessage || 'Start chatting...'}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-xl border border-card-border shadow-sm overflow-hidden flex flex-col">
          {!selectedConv ? (
            <div className="flex-1 flex items-center justify-center text-text-mut">
              <div className="text-center"><Send className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="font-medium">Select a conversation</p></div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-6 py-4 border-b border-card-border bg-gray-50">
                <div>
                  <div className="font-semibold text-text-main">{doctorConvs.find(c => c.id === selectedConv)?.patientName}</div>
                  <div className="text-xs text-text-mut">Patient</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toast('Calling patient...', { icon: '📞' })} className="p-2 rounded-lg border border-card-border text-text-sec hover:text-text-main hover:bg-white transition-colors"><Phone className="w-4 h-4" /></button>
                  <button onClick={() => toast('Starting video call...', { icon: '📹' })} className="p-2 rounded-lg border border-card-border text-text-sec hover:text-text-main hover:bg-white transition-colors"><Video className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.fromRole === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm ${msg.fromRole === 'doctor' ? 'bg-primary text-white' : 'bg-gray-100 text-text-main'}`}>
                      <div>{msg.text}</div>
                      <div className={`text-[10px] mt-1 ${msg.fromRole === 'doctor' ? 'text-white/80' : 'text-text-mut'}`}>{msg.time}</div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="p-4 border-t border-card-border bg-gray-50">
                <div className="flex items-center gap-3">
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message…" className="flex-1 bg-white border border-card-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                  <button onClick={handleSend} className="bg-primary hover:bg-primary-hover text-white px-4 py-3 rounded-xl font-medium text-sm transition-colors flex items-center gap-2">
                    <Send className="w-4 h-4" /> Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}