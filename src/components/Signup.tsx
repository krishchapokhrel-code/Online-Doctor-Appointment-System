import React from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import logo from '../assets/ah_logo.png';

interface SignupProps {
  onNavigate: (screen: string) => void;
}

export default function Signup({ onNavigate }: SignupProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [role, setRole] = React.useState('patient');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'doctor') {
      onNavigate('doctorPanel');
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-base">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-gradient-to-br from-[#0d4f6b] via-[#1a7a9e] to-[#0f8c7a] p-12 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-[-5%] left-[-10%] w-80 h-80 border border-white/10 rounded-full"></div>
        <div className="absolute top-[20%] right-[15%] w-32 h-32 border border-white/5 rounded-full"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <img src={logo} alt="Aura Health Logo" className="h-24 w-auto object-contain bg-white/10 rounded-xl p-3" />
          </div>
          
          <h1 className="text-5xl font-medium leading-[1.1] mb-6">
            A calm path to <span className="text-[#89d6f3]">better health.</span>
          </h1>
          <p className="text-white/70 text-lg max-w-md">
            Join a supportive community where your well-being is the priority. Access your health insights anytime, anywhere.
          </p>
        </div>
        
        <div className="relative z-10 flex flex-col gap-3">
          <div className="inline-flex items-center self-start gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full">
            <User className="w-4 h-4 text-white/80" />
            <span className="text-sm font-medium text-white/90">Personalized health dashboard</span>
          </div>
          <div className="inline-flex items-center self-start gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full">
            <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
            <span className="text-sm font-medium text-white/90">Book & manage appointments</span>
          </div>
          <div className="inline-flex items-center self-start gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full">
            <Shield className="w-4 h-4 text-white/80" />
            <span className="text-sm font-medium text-white/90">Track vitals & health metrics</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto mx-[100px]">
        <div className="w-full max-w-[460px] py-10 bg-white px-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-card-border overflow-y-auto">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <img src={logo} alt="Aura Health Logo" className="h-20 w-auto object-contain" />
          </div>

          <h2 className="text-4xl font-bold text-text-main mb-3">Create account</h2>
          <p className="text-text-sec mb-8 text-lg">Join us and manage your health efficiently.</p>
          
          {/* Role Selection */}
          <div className="flex bg-input-bg p-1 rounded-full mb-8 border border-card-border relative">
            <button 
              type="button"
              onClick={() => setRole('patient')}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${role === 'patient' ? 'bg-white shadow-sm text-text-main' : 'text-text-sec hover:text-text-main'}`}
            >
              Patient
            </button>
            <button 
              type="button"
              onClick={() => setRole('doctor')}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${role === 'doctor' ? 'bg-white shadow-sm text-text-main' : 'text-text-sec hover:text-text-main'}`}
            >
              Doctor
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSignup}>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-main">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-mut" />
                <input 
                  type="text" 
                  placeholder="Ganesh Dahal"
                  className="w-full bg-input-bg border-[1.5px] border-input-border pl-10 pr-4 py-2.5 rounded-input focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-text-main placeholder-text-mut"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-main">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-mut" />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full bg-input-bg border-[1.5px] border-input-border pl-10 pr-4 py-2.5 rounded-input focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-text-main placeholder-text-mut"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-main">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-mut" />
                  <input 
                    type="tel" 
                    placeholder="+"
                    className="w-full bg-input-bg border-[1.5px] border-input-border pl-10 pr-4 py-2.5 rounded-input focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-text-main placeholder-text-mut"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-main">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-mut" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-input-bg border-[1.5px] border-input-border pl-10 pr-10 py-2.5 rounded-input focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-text-main placeholder-text-mut"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-mut hover:text-text-sec transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1 pb-4">
              <input 
                type="checkbox" 
                id="terms" 
                className="w-4 h-4 mt-0.5 rounded-[4px] border-input-border text-primary focus:ring-accent accent-primary"
                required
              />
              <label htmlFor="terms" className="text-sm text-text-sec cursor-pointer leading-tight">
                I agree to the <a href="#" className="text-accent hover:underline">Terms of Service</a> and <a href="#" className="text-accent hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-btn transition-colors"
            >
              Create Account
            </button>
          </form>

          <p className="text-center mt-6 text-text-sec text-sm">
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} className="text-accent font-medium hover:text-primary transition-colors">
              Login
            </button>
          </p>

          <div className="mt-8 flex justify-center gap-1.5 text-xs text-text-mut font-medium">
            <span>HIPAA Compliant</span>
            <span>•</span>
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
