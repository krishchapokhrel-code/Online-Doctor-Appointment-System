import React, { useState } from 'react';
import { Send, Bot, User, ArrowLeft, Heart, Search } from 'lucide-react';
import logo from '../assets/ah_logo.png';

interface ChatbotInterfaceProps {
  onBack: () => void;
}

export default function ChatbotInterface({ onBack }: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! I am Aura, your AI health assistant. I can help you find doctors, manage your schedule, or answer simple health queries. How can I assist you today?' }
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = () => {
    if (!inputVal.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'user', text: inputVal }]);
    setInputVal('');
    
    // Simulated reply
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        sender: 'bot', 
        text: 'I can certainly help with that. Are you looking to book an appointment with a specific specialist?' 
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-bg-base overflow-hidden">
      {/* Header */}
      <div className="h-[70px] bg-white border-b border-card-border flex items-center justify-between px-6 flex-shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-text-main"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold text-text-main leading-tight text-lg">Aura Assistant</h2>
              <p className="text-xs text-text-sec flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> 
                Online
              </p>
            </div>
          </div>
        </div>

        <img src={logo} alt="Aura Health" className="h-8 w-auto object-contain hidden sm:block" />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <span className="bg-gray-100 text-text-mut text-xs px-3 py-1 rounded-full font-medium">Today</span>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}>
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
              )}
              
              <div className={`max-w-[75%] px-5 py-3.5 ${msg.sender === 'user' ? 'bg-primary text-white rounded-2xl rounded-tr-sm' : 'bg-white text-text-main rounded-2xl rounded-tl-sm border border-card-border shadow-sm'} text-sm leading-relaxed`}>
                {msg.text}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-input-bg text-text-sec flex items-center justify-center flex-shrink-0 border border-card-border">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-card-border p-4 sm:p-6 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-center shadow-sm">
            <input 
              type="text" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message here..."
              className="w-full bg-input-bg border-[1.5px] border-input-border pl-5 pr-14 py-3.5 rounded-full focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-text-main placeholder-text-mut text-sm"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white flex items-center justify-center rounded-full hover:bg-primary-hover transition-colors shadow-sm"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
          <div className="mt-3 flex gap-2 justify-center flex-wrap">
            <button className="text-xs bg-gray-100 hover:bg-gray-200 text-text-sec px-3 py-1.5 rounded-full transition-colors font-medium">
              Find a Cardiologist
            </button>
            <button className="text-xs bg-gray-100 hover:bg-gray-200 text-text-sec px-3 py-1.5 rounded-full transition-colors font-medium">
              View upcoming appointments
            </button>
            <button className="text-xs bg-gray-100 hover:bg-gray-200 text-text-sec px-3 py-1.5 rounded-full transition-colors font-medium">
              Check my symptoms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}