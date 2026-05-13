import React, { useEffect, useMemo, useState } from 'react';
import { Check, Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

interface AppointmentBookingProps {
  onBack: () => void;
  onBook: () => void;
}

export default function AppointmentBooking({ onBack, onBook }: AppointmentBookingProps) {
  const amSlots = [
    { time: '09:00', status: 'AVAILABLE' },
    { time: '09:30', status: 'AVAILABLE' },
    { time: '10:00', status: 'PACKED' },
    { time: '10:30', status: 'AVAILABLE' },
    { time: '11:00', status: 'AVAILABLE' },
    { time: '11:30', status: 'AVAILABLE' }
  ];

  const pmSlots = [
    { time: '02:00', status: 'AVAILABLE' },
    { time: '02:30', status: 'AVAILABLE' },
    { time: '03:00', status: 'PACKED' },
    { time: '03:30', status: 'AVAILABLE' }
  ];

  const [selectedSession, setSelectedSession] = useState<'AM' | 'PM'>('AM');
  const [selectedDate, setSelectedDate] = useState(5);
  const [step, setStep] = useState<'time' | 'details' | 'confirm'>('time');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(
    amSlots.find((slot) => slot.status !== 'PACKED')?.time ?? null
  );

  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientIssue, setPatientIssue] = useState('');
  const [loading, setLoading] = useState(false);

  const doctorName = localStorage.getItem('selectedDoctorName') || 'Dr. Aasha Poudel';
  const doctorSpecialty = localStorage.getItem('selectedDoctorSpecialty') || 'Cardiologist';

  const sessionSlots = selectedSession === 'AM' ? amSlots : pmSlots;

  useEffect(() => {
    const isStillValid = sessionSlots.some(
      (slot) => slot.time === selectedSlot && slot.status !== 'PACKED'
    );
    if (!isStillValid) {
      const firstAvailable = sessionSlots.find((slot) => slot.status !== 'PACKED')?.time ?? null;
      setSelectedSlot(firstAvailable);
    }
  }, [selectedSession]);

  const handleBooking = async () => {
    setLoading(true);
    try {
      const formattedTime = `${formattedDate} ${selectedSlot} ${selectedSession}`;
      
      const formData = new FormData();
      formData.append('name', patientName);
      formData.append('phone', patientPhone);
      formData.append('issue', patientIssue);
      formData.append('time', formattedTime);

      const response = await api.post('/save-booking', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Appointment booked successfully!');
      onBook();
    } catch (error) {
      console.error(error);
      toast.error('Failed to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = useMemo(() => {
    const date = new Date(2023, 9, selectedDate);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-bg-base font-sans p-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Setup */}
        <div className="text-center mb-10 mt-4">
          <h1 className="text-3xl font-bold text-text-main mb-8 tracking-tight">
            {step === 'time' ? 'Select your preferred time' : 'Confirm your appointment'}
          </h1>
          
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
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${step === 'time' ? 'bg-primary text-white' : 'bg-green-500 text-white'}`}>
                <CalendarIcon className="w-4 h-4" />
              </div>
              <span className={`text-xs font-semibold ${step === 'time' ? 'text-primary' : 'text-text-main'}`}>Date & Time</span>
            </div>
            {/* Line 2 */}
            <div className="flex-1 h-[2px] bg-gray-200 -mt-6 mx-2 max-w-[120px]"></div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${step === 'confirm' ? 'bg-primary text-white' : 'bg-white border-2 border-gray-200 text-gray-300'}`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className={`text-xs font-semibold ${step === 'confirm' ? 'text-primary' : 'text-text-mut'}`}>Confirmation</span>
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
                alt={doctorName} 
                className="w-[72px] h-[72px] rounded-full object-cover border-2 border-blue-50"
              />
              <div>
                <div className="inline-block bg-[#e3f4fb] text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                  Top Rated
                </div>
                <h3 className="font-bold text-text-main text-lg leading-tight">{doctorName}</h3>
                <p className="text-text-sec text-xs my-1">{doctorSpecialty} • 12 years exp.</p>
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
                
                {Array.from({ length: 15 }, (_, index) => index + 1).map((day) => {
                  const isSelected = selectedDate === day;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDate(day)}
                      className={`text-sm w-8 h-8 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors ${
                        isSelected
                          ? 'font-bold text-white bg-primary shadow-md'
                          : 'font-semibold text-text-main hover:bg-gray-100'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
            
          </div>
          
          {/* Right Column */}
          <div className="flex-1 bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-card-border w-full relative min-h-[550px] flex flex-col">
            {step === 'time' ? (
              <>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-text-main mb-1">Available Slots</h2>
                    <p className="text-text-sec text-sm">Showing availability for <span className="font-semibold text-text-main">{formattedDate}</span></p>
                  </div>
                  <div className="flex bg-gray-50 border border-gray-100 p-1 rounded-full">
                    <button
                      onClick={() => setSelectedSession('AM')}
                      className={`px-5 py-1.5 text-xs font-bold rounded-full transition-colors ${selectedSession === 'AM' ? 'text-primary bg-white shadow-sm' : 'text-text-mut hover:text-text-main'}`}
                    >
                      AM
                    </button>
                    <button
                      onClick={() => setSelectedSession('PM')}
                      className={`px-5 py-1.5 text-xs font-bold rounded-full transition-colors ${selectedSession === 'PM' ? 'text-primary bg-white shadow-sm' : 'text-text-mut hover:text-text-main'}`}
                    >
                      PM
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-primary uppercase mb-4 tracking-wider">
                    <span className="w-5 h-5 flex items-center justify-center bg-[#eef6fa] rounded-full">{selectedSession === 'AM' ? '☀' : '☼'}</span>
                    {selectedSession === 'AM' ? 'Morning Session' : 'Afternoon Session'}
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {sessionSlots.map((slot) => {
                      const isSelected = selectedSlot === slot.time;
                      const isPacked = slot.status === 'PACKED';
                      return (
                        <button
                          key={slot.time}
                          disabled={isPacked}
                          onClick={() => setSelectedSlot((prev) => (prev === slot.time ? null : slot.time))}
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
                </div>

                <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-100">
                  <button 
                    onClick={onBack}
                    className="px-6 py-3 rounded-full font-bold text-sm text-text-main border-2 border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Back to Doctors
                  </button>
                  <button 
                    onClick={() => setStep('details')}
                    disabled={!selectedSlot}
                    className={`px-8 py-3 rounded-full font-bold text-sm text-white shadow-[0_4px_16px_rgba(13,79,107,0.3)] transition-all flex items-center gap-2 ${
                      selectedSlot ? 'bg-primary hover:bg-primary-hover hover:translate-x-1' : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : step === 'details' ? (
              <>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-text-main mb-1">Patient Details</h2>
                    <p className="text-text-sec text-sm">Please provide your details.</p>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-main mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-input-bg border-[1.5px] border-input-border px-4 py-2.5 rounded-input focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-main mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="98XXXXXXXX"
                        className="w-full bg-input-bg border-[1.5px] border-input-border px-4 py-2.5 rounded-input focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-main mb-1">Reason for Visit / Issue</label>
                      <textarea 
                        value={patientIssue}
                        onChange={(e) => setPatientIssue(e.target.value)}
                        placeholder="Please describe your symptoms briefly..."
                        className="w-full bg-input-bg border-[1.5px] border-input-border px-4 py-2.5 rounded-input focus:outline-none focus:border-accent h-24 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-100">
                  <button 
                    onClick={() => setStep('time')}
                    className="px-6 py-3 rounded-full font-bold text-sm text-text-main border-2 border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep('confirm')}
                    disabled={!patientName || !patientPhone}
                    className={`px-8 py-3 rounded-full font-bold text-sm text-white shadow-[0_4px_16px_rgba(13,79,107,0.3)] transition-all flex items-center gap-2 ${
                      patientName && patientPhone ? 'bg-primary hover:bg-primary-hover hover:translate-x-1' : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-text-main mb-1">Confirmation</h2>
                    <p className="text-text-sec text-sm">Review your appointment details.</p>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="bg-bg-base border border-card-border rounded-2xl p-6">
                    <div className="text-xs uppercase tracking-widest text-text-mut font-bold mb-3">Doctor</div>
                    <div className="text-lg font-semibold text-text-main">{doctorName}</div>
                    <div className="text-sm text-text-sec">{doctorSpecialty}</div>
                  </div>
                  <div className="bg-bg-base border border-card-border rounded-2xl p-6">
                    <div className="text-xs uppercase tracking-widest text-text-mut font-bold mb-3">Date & Time</div>
                    <div className="text-lg font-semibold text-text-main">{formattedDate}</div>
                    <div className="text-sm text-text-sec">{selectedSlot ? `${selectedSlot} (${selectedSession})` : 'No time selected'}</div>
                  </div>
                  <div className="bg-bg-base border border-card-border rounded-2xl p-6">
                    <div className="text-xs uppercase tracking-widest text-text-mut font-bold mb-3">Location</div>
                    <div className="text-sm text-text-sec">Aura Health Clinic • Kathmandu</div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-100">
                  <button 
                    onClick={() => setStep('details')}
                    disabled={loading}
                    className="px-6 py-3 rounded-full font-bold text-sm text-text-main border-2 border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleBooking}
                    disabled={loading}
                    className={`px-8 py-3 rounded-full font-bold text-sm text-white shadow-[0_4px_16px_rgba(13,79,107,0.3)] transition-all flex items-center gap-2 ${
                      !loading ? 'bg-primary hover:bg-primary-hover hover:translate-x-1' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {loading ? 'Booking...' : 'Confirm Appointment'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}