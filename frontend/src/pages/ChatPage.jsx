import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/api';
import Icon from '../components/Icon';

export function ChatPage({ user, doctorProfile }) {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const fileRef = useRef(null);
  const pollRef = useRef(null);
  const myId = user.user_id;

  useEffect(() => {
    api.get(`/messages/conversations/${myId}`).then(setConversations);
  }, [myId]);

  useEffect(() => {
    if (!selected) return;
    const load = () => api.get(`/messages/${myId}/${selected.user_id}`).then(setMessages);
    load();
    pollRef.current = setInterval(load, 3000);
    return () => clearInterval(pollRef.current);
  }, [selected, myId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (imageFile = null) => {
    if (!input.trim() && !imageFile) return;
    const fd = new FormData();
    fd.append('sender_id', myId);
    fd.append('receiver_id', selected.user_id);
    if (input.trim()) fd.append('content', input);
    if (imageFile) fd.append('image', imageFile);
    setInput('');
    const msg = await api.upload('/messages', fd);
    setMessages(m => [...m, msg]);
    api.get(`/messages/conversations/${myId}`).then(setConversations);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) send(file);
  };

  const fmt = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Messages</div>
        <div className="page-subtitle">Chat with your care team</div>
      </div>
      <div className="chat-layout">
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">Conversations</div>
          <div className="chat-list">
            {conversations.length === 0 && (
              <div style={{ padding: 20, fontSize: 13, color: '#718096' }}>No conversations yet.</div>
            )}
            {conversations.map(c => (
              <div key={c.user_id} className={`chat-list-item ${selected?.user_id === c.user_id ? 'active' : ''}`} onClick={() => setSelected(c)}>
                <div className="chat-list-avatar">
                  {c.profile_image ? <img src={`http://localhost:5000${c.profile_image}`} alt="" /> : c.name[0]}
                </div>
                <div className="chat-list-info">
                  <div className="chat-list-name">{c.role === 'doctor' ? 'Dr. ' : ''}{c.name}</div>
                  <div className="chat-list-msg">{c.last_message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="chat-main">
          {!selected ? (
            <div className="empty-state" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Icon name="message" size={48} />
              <p>Select a conversation to start chatting</p>
            </div>
          ) : (
            <>
              <div className="chat-header">
                <div className="chat-list-avatar" style={{ width: 40, height: 40 }}>
                  {selected.profile_image ? <img src={`http://localhost:5000${selected.profile_image}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : selected.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{selected.role === 'doctor' ? 'Dr. ' : ''}{selected.name}</div>
                  <div style={{ fontSize: 12, color: '#718096', textTransform: 'capitalize' }}>{selected.role}</div>
                </div>
              </div>
              <div className="chat-messages">
                {messages.map(m => (
                  <div key={m.id} className={`msg ${m.sender_id === myId ? 'mine' : 'theirs'}`}>
                    <div className="msg-bubble">
                      {m.content && <div>{m.content}</div>}
                      {m.image_url && <img src={`http://localhost:5000${m.image_url}`} alt="" className="msg-img" />}
                    </div>
                    <div className="msg-time">{fmt(m.created_at)}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="chat-input-area">
                <button className="img-upload-btn" onClick={() => fileRef.current.click()} title="Send image">
                  <Icon name="image" size={18} />
                </button>
                <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={handleFile} />
                <textarea className="chat-input" placeholder="Type a message..." value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                  rows={1} />
                <button className="chat-send-btn" onClick={() => send()}>
                  <Icon name="send" size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
