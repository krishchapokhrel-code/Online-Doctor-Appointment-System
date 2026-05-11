import React from 'react';
import { Shield, LayoutDashboard, Calendar, Users, FileText, Asterisk, Settings, LogOut, Search, Bell, MessageSquare, Heart, Moon, Scale, ChevronRight } from 'lucide-react';

interface PatientOverviewProps {
  onNavigate: (screen: string) => void;
}

export default function PatientOverview({ onNavigate }: PatientOverviewProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Greeting Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-text-main mb-1">Good morning, Aarav.</h1>
                <p className="text-text-sec text-sm">
                  Your vitals look stable today. You have <span className="text-accent font-medium">2 appointments scheduled</span>.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('booking')}
                className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-btn font-medium transition-colors whitespace-nowrap self-start sm:self-auto text-sm shadow-sm"
              >
                + Book Appointment
              </button>
            </div>

            {/* Floating Chat Button */}
            <button 
              onClick={() => {
                localStorage.setItem('selectedDoctorName', 'Dr. Aasha Poudel');
                localStorage.setItem('selectedDoctorSpecialty', 'Cardiologist');
                onNavigate('doctorChat');
              }}
              className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover transition-all flex items-center justify-center z-50 group hover:scale-110 active:scale-95"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="absolute right-full mr-3 bg-white text-primary text-xs font-bold py-1.5 px-3 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-card-border pointer-events-none">
                Message your doctor
              </span>
            </button>

            {/* Vitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Heart Rate */}
              <div className="bg-card border border-card-border rounded-card p-5 shadow-sm relative">
                <div className="absolute top-5 right-5 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  +2%
                </div>
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-3">
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-text-sec text-sm font-medium mb-0.5">Heart Rate</p>
                <p className="text-2xl font-bold text-text-main">72 <span className="text-sm font-medium text-text-mut">BPM</span></p>
              </div>

              {/* Sleep Score */}
              <div className="bg-card border border-card-border rounded-card p-5 shadow-sm relative">
                <div className="absolute top-5 right-5 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  Normal
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                  <Moon className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-text-sec text-sm font-medium mb-0.5">Sleep Score</p>
                <p className="text-2xl font-bold text-text-main">8.2 <span className="text-sm font-medium text-text-mut">Hrs</span></p>
              </div>

              {/* Weight */}
              <div className="bg-card border border-card-border rounded-card p-5 shadow-sm relative">
                <div className="absolute top-5 right-5 bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  -9
                </div>
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mb-3">
                  <Scale className="w-5 h-5 text-teal-500" />
                </div>
                <p className="text-text-sec text-sm font-medium mb-0.5">Weight</p>
                <p className="text-2xl font-bold text-text-main">76.4 <span className="text-sm font-medium text-text-mut">Kg</span></p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Left Column */}
              <div className="flex-1 flex flex-col gap-6">
                
                {/* Health Summary Chart */}
                <div className="bg-card border border-card-border rounded-card p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-text-main">Health Summary</h2>
                      <p className="text-xs text-text-sec mt-1">Average health score: <span className="text-primary font-bold">88/100</span></p>
                    </div>
                    <div className="flex bg-bg-base rounded-md p-1">
                      <button className="px-3 py-1 text-xs font-medium text-text-sec rounded hover:bg-white hover:shadow-sm transition-all">Weekly</button>
                      <button className="px-3 py-1 text-xs font-medium text-text-main bg-white rounded shadow-sm">Monthly</button>
                    </div>
                  </div>

                  {/* Summary Stats Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="p-3 bg-bg-base rounded-lg border border-card-border">
                      <p className="text-[10px] uppercase tracking-wider text-text-mut font-bold mb-1">Blood Pressure</p>
                      <p className="text-sm font-bold text-text-main">120/80 <span className="text-[10px] font-normal text-text-sec">mmHg</span></p>
                    </div>
                    <div className="p-3 bg-bg-base rounded-lg border border-card-border">
                      <p className="text-[10px] uppercase tracking-wider text-text-mut font-bold mb-1">Blood Sugar</p>
                      <p className="text-sm font-bold text-text-main">92 <span className="text-[10px] font-normal text-text-sec">mg/dL</span></p>
                    </div>
                    <div className="p-3 bg-bg-base rounded-lg border border-card-border">
                      <p className="text-[10px] uppercase tracking-wider text-text-mut font-bold mb-1">Cholesterol</p>
                      <p className="text-sm font-bold text-text-main">185 <span className="text-[10px] font-normal text-text-sec">mg/dL</span></p>
                    </div>
                    <div className="p-3 bg-bg-base rounded-lg border border-card-border">
                      <p className="text-[10px] uppercase tracking-wider text-text-mut font-bold mb-1">BMI</p>
                      <p className="text-sm font-bold text-text-main">22.4 <span className="text-[10px] font-normal text-green-500">Normal</span></p>
                    </div>
                  </div>

                  {/* Custom CSS Bar Chart with 50px top corner radius */}
                  <div className="h-[200px] flex items-end justify-between gap-3 xl:gap-6 px-2 md:px-4 mt-8">
                    {[
                      { day: '05 Apr', h: '45%' },
                      { day: '08 Apr', h: '62%' },
                      { day: '11 Apr', h: '55%' },
                      { day: '14 Apr', h: '78%' },
                      { day: '17 Apr', h: '92%', active: true },
                      { day: '20 Apr', h: '68%' },
                      { day: '23 Apr', h: '85%' },
                    ].map((item) => (
                      <div key={item.day} className="flex flex-col items-center flex-1 group">
                        <div className="w-full max-w-[48px] transition-all duration-500 relative flex justify-center shadow-sm hover:shadow-md cursor-pointer" 
                             style={{ 
                               height: item.h, 
                               backgroundColor: item.active ? '#0d4f6b' : '#e2e8f0',
                               borderTopLeftRadius: '50px',
                               borderTopRightRadius: '50px'
                             }}>
                          <div className={`absolute -top-10 bg-[#0d4f6b] text-white text-[10px] font-bold py-1.5 px-2.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-20 pointer-events-none transform -translate-y-1`}>
                            {item.h.replace('%', ' pts')}
                          </div>
                        </div>
                        <span className={`mt-4 text-[10px] font-bold tracking-tight uppercase ${item.active ? 'text-primary' : 'text-text-mut'}`}>{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-card border border-card-border rounded-card p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-text-main mb-4">Recent Activity</h2>
                  <div className="space-y-5">
                    <div className="flex gap-4">
                      <div className="mt-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_0_4px_#dcfce7]"></div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-main">Lab Results Available</p>
                        <p className="text-sm text-text-sec mt-0.5">Blood work from Oct 05 is ready for review.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="mt-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_0_4px_#dbeafe]"></div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-main">Prescription Refill</p>
                        <p className="text-sm text-text-sec mt-0.5">Lisinopril 10mg refilled at Central Pharmacy.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Right Column (340px max) */}
              <div className="w-full lg:w-[340px] flex flex-col gap-6">
                
                {/* Appointments */}
                <div className="bg-card border border-card-border rounded-card p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-semibold text-text-main">Appointments</h2>
                    <button className="text-sm font-medium text-accent hover:text-primary transition-colors">View All</button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Item 1 */}
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg-base transition-colors border border-transparent hover:border-card-border">
                      <div className="bg-blue-50 flex flex-col items-center justify-center w-[52px] h-[52px] rounded-lg border border-blue-100 flex-shrink-0">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">Oct</span>
                        <span className="text-lg font-bold text-blue-900 leading-none">12</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-text-main truncate">Dr. Aasha Poudel</h3>
                        <p className="text-xs text-text-sec truncate mt-0.5">Cardiologist • 09:30 AM</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-mut" />
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg-base transition-colors border border-transparent hover:border-card-border">
                      <div className="bg-blue-50 flex flex-col items-center justify-center w-[52px] h-[52px] rounded-lg border border-blue-100 flex-shrink-0">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">Oct</span>
                        <span className="text-lg font-bold text-blue-900 leading-none">15</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-text-main truncate">Dr. Saugat Rijal</h3>
                        <p className="text-xs text-text-sec truncate mt-0.5">General Health • 02:15 PM</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-mut" />
                    </div>
                  </div>
                </div>

                {/* Health Tip */}
                <div className="bg-[#e8f8f4] border border-[#a7dccf] rounded-card p-5 shadow-sm text-[#115e49]">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-[#10b981]" />
                    <h3 className="font-semibold text-[15px]">Health Tip</h3>
                  </div>
                  <p className="text-sm opacity-90 leading-relaxed">
                    Don't forget to complete your pre-appointment screening form for Dr. Poudel.
                  </p>
                </div>

              </div>
            </div>

          </div>
  );
}
