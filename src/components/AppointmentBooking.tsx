import React, { useState } from 'react';
import { Check, Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';

interface AppointmentBookingProps {
  onBack: () => void;
  onBook: () => void;
}

export default function AppointmentBooking({ onBack, onBook }: AppointmentBookingProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>('10:30');

  const amSlots = [
    { time: '09:00', status: 'AVAILABLE' },
    { time: '09:30', status: 'AVAILABLE' },
    { time: '10:00', status: 'PACKED' },
    { time: '10:30', status: 'SELECTED' },
    { time: '11:00', status: 'AVAILABLE' },
    { time: '11:30', status: 'AVAILABLE' }
  ];

  const pmSlots = [
    { time: '02:00', status: 'AVAILABLE' },
    { time: '02:30', status: 'AVAILABLE' },
    { time: '03:00', status: 'AVAILABLE' }
  ];

  return (
    <div className="min-h-screen bg-bg-base font-sans p-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Setup */}
        <div className="text-center mb-10 mt-4">
          <h1 className="text-3xl font-bold text-text-main mb-8 tracking-tight">Select your preferred time</h1>
          
          <div className="flex items-center justify-center max-w-xl mx-auto mb-10 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-text-main">Doctor</span>
            </div>
            {/* Line 1 */}
            <div className="flex-1 h-[2px] bg-green-200 -mt-6 mx-2 max-w-[120px]"></div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-primary">Date & Time</span>
            </div>
            {/* Line 2 */}
            <div className="flex-1 h-[2px] bg-gray-200 -mt-6 mx-2 max-w-[120px]"></div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 text-gray-300 flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-text-mut">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column */}
          <div className="w-full lg:w-[340px] flex-shrink-0 space-y-6">
            
            {/* Doctor Info Card */}
            <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-card-border flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop" 
                alt="Dr. Sarah Jenkins" 
                className="w-[72px] h-[72px] rounded-full object-cover border-2 border-blue-50"
              />
              <div>
                <div className="inline-block bg-[#e3f4fb] text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                  Top Rated
                </div>
                <h3 className="font-bold text-text-main text-lg leading-tight">Dr. Sarah Jenkins</h3>
                <p className="text-text-sec text-xs my-1">Senior Cardiologist • 12 years exp.</p>
                <div className="flex items-center text-xs font-semibold text-green-600 gap-1">
                  <span>★ 4.9 (120+ reviews)</span>
                </div>
              </div>
            </div>

            {/* Calendar Card */}
            <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-card-border">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-text-main">October 2023</h3>
                <div className="flex gap-2 text-text-mut">
                  <ChevronLeft className="w-5 h-5 cursor-pointer hover:text-text-main transition-colors" />
                  <ChevronRight className="w-5 h-5 cursor-pointer hover:text-text-main transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-7 gap-y-4 mb-2">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                  <div key={day} className="text-[10px] font-bold text-text-mut text-center mb-2">{day}</div>
                ))}
                
                {/* Previous month days */}
                {[25,26,27,28,29,30].map(day => (
                  <div key={`prev-${day}`} className="text-sm font-semibold text-gray-300 text-center">{day}</div>
                ))}
                
                <div className="text-sm font-semibold text-text-main text-center hover:bg-gray-100 w-8 h-8 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors">1</div>
                <div className="text-sm font-semibold text-text-main text-center hover:bg-gray-100 w-8 h-8 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors">2</div>
                <div className="text-sm font-semibold text-text-main text-center hover:bg-gray-100 w-8 h-8 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors">3</div>
                <div className="text-sm font-semibold text-text-main text-center hover:bg-gray-100 w-8 h-8 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors">4</div>
                
                {/* Active day */}
                <div className="text-sm font-bold text-white bg-primary text-center w-8 h-8 mx-auto flex items-center justify-center rounded-full shadow-md cursor-pointer">5</div>
                
                <div className="text-sm font-semibold text-text-main text-center hover:bg-gray-100 w-8 h-8 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors">6</div>
                <div className="text-sm font-semibold text-gray-300 text-center hover:bg-gray-50 flex items-center justify-center w-8 h-8 mx-auto rounded-full">7</div>
                <div className="text-sm font-semibold text-gray-300 text-center hover:bg-gray-50 flex items-center justify-center w-8 h-8 mx-auto rounded-full">8</div>
                
                <div className="text-sm font-semibold text-text-main text-center hover:bg-gray-100 w-8 h-8 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors">9</div>
                <div className="text-sm font-semibold text-text-main text-center hover:bg-gray-100 w-8 h-8 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors">10</div>
                <div className="text-sm font-semibold text-text-main text-center hover:bg-gray-100 w-8 h-8 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors">11</div>
                <div className="text-sm font-semibold text-text-main text-center hover:bg-gray-100 w-8 h-8 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors">12</div>
                <div className="text-sm font-semibold text-text-main text-center hover:bg-gray-100 w-8 h-8 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors">13</div>
                <div className="text-sm font-semibold text-gray-300 text-center hover:bg-gray-50 flex items-center justify-center w-8 h-8 mx-auto rounded-full">14</div>
                <div className="text-sm font-semibold text-gray-300 text-center hover:bg-gray-50 flex items-center justify-center w-8 h-8 mx-auto rounded-full">15</div>
              </div>
            </div>
            
          </div>
          
          {/* Right Column */}
          <div className="flex-1 bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-card-border w-full relative min-h-[550px] flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-text-main mb-1">Available Slots</h2>
                <p className="text-text-sec text-sm">Showing availability for <span className="font-semibold text-text-main">Thursday, Oct 5th</span></p>
              </div>
              <div className="flex bg-gray-50 border border-gray-100 p-1 rounded-full">
                <button className="px-5 py-1.5 text-xs font-bold text-primary bg-white rounded-full shadow-sm">AM</button>
                <button className="px-5 py-1.5 text-xs font-bold text-text-mut hover:text-text-main transition-colors">PM</button>
              </div>
            </div>

            <div className="flex-1">
              <h4 className="flex items-center gap-2 text-sm font-bold text-primary uppercase mb-4 tracking-wider">
                <span className="w-5 h-5 flex items-center justify-center bg-[#eef6fa] rounded-full">☀</span> Morning Session
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {amSlots.map((slot) => {
                  const isSelected = selectedSlot === slot.time || slot.status === 'SELECTED';
                  const isPacked = slot.status === 'PACKED';
                  return (
                    <button
                      key={slot.time}
                      disabled={isPacked}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`relative flex flex-col items-center justify-center py-5 rounded-full border-[1.5px] transition-all
                        ${isSelected ? 'border-green-400 bg-green-50/30 shadow-[0_4px_12px_rgba(52,211,153,0.15)] ring-2 ring-green-100 ring-offset-2' : 
                          isPacked ? 'border-gray-100 bg-gray-50/50 cursor-not-allowed opacity-60' : 
                          'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}
                      `}
                    >
                      <span className={`text-xl font-bold mb-1 ${isPacked ? 'text-gray-400 line-through' : (isSelected ? 'text-primary' : 'text-text-main')}`}>{slot.time}</span>
                      <span className={`text-[9px] font-bold tracking-widest uppercase ${isSelected ? 'text-green-500' : (isPacked ? 'text-red-400' : 'text-text-mut')}`}>
                        {isSelected ? 'SELECTED' : slot.status}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-4 w-2 h-2 rounded-full bg-green-400 shadow-sm"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              <h4 className="flex items-center gap-2 text-sm font-bold text-primary uppercase mb-4 tracking-wider mt-10">
                <span className="w-5 h-5 flex items-center justify-center bg-[#eef6fa] rounded-full">☼</span> Afternoon Session
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {pmSlots.map((slot) => {
                  const isSelected = selectedSlot === slot.time;
                  return (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`relative flex flex-col items-center justify-center py-5 rounded-full border-[1.5px] transition-all
                        ${isSelected ? 'border-green-400 bg-green-50/30 shadow-[0_4px_12px_rgba(52,211,153,0.15)] ring-2 ring-green-100 ring-offset-2' : 
                          'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}
                      `}
                    >
                      <span className={`text-xl font-bold mb-1 ${isSelected ? 'text-primary' : 'text-text-main'}`}>{slot.time}</span>
                      <span className={`text-[9px] font-bold tracking-widest uppercase ${isSelected ? 'text-green-500' : 'text-text-mut'}`}>
                        {isSelected ? 'SELECTED' : slot.status}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-4 w-2 h-2 rounded-full bg-green-400"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-100">
              <button 
                onClick={onBack}
                className="px-6 py-3 rounded-full font-bold text-sm text-text-main border-2 border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Back to Doctors
              </button>
              <button 
                onClick={onBook}
                className="px-8 py-3 rounded-full font-bold text-sm text-white bg-primary hover:bg-primary-hover shadow-[0_4px_16px_rgba(13,79,107,0.3)] transition-all flex items-center gap-2 hover:translate-x-1"
              >
                Confirm Appointment Time <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}