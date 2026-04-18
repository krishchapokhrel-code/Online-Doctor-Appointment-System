import React from 'react';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import logo from '../assets/ah_logo.png';

interface LoginProps {
  onNavigate: (screen: string) => void;
}

export default function Login({ onNavigate }: LoginProps) {
  const [showPassword, setShowPassword] = React.useState(false);

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
            The intersection of <span className="text-[#89d6f3]">care and clarity.</span>
          </h1>
          <p className="text-white/70 text-lg max-w-md">
            Join thousands of patients managing their health records securely and connecting with healthcare professionals effortlessly.
          </p>
        </div>
        
        <div className="relative z-10 flex flex-col gap-3">
          <div className="inline-flex items-center self-start gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full">
            <Shield className="w-4 h-4 text-white/80" />
            <span className="text-sm font-medium text-white/90">HIPAA Compliant Security Protocol</span>
          </div>
          <div className="inline-flex items-center self-start gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full">
            <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
            <span className="text-sm font-medium text-white/90">24/7 Professional Medical Support</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 mx-[100px]">
        <div className="w-full max-w-[440px] bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-card-border">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <img src={logo} alt="Aura Health Logo" className="h-20 w-auto object-contain" />
          </div>

          <h2 className="text-4xl font-bold text-text-main mb-3">Welcome back</h2>
          <p className="text-text-sec mb-10 text-lg">Sign in to manage your health journey</p>
          
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>
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

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-text-main">Password</label>
                <a href="#" className="text-sm font-medium text-accent hover:text-primary transition-colors">Forgot password?</a>
              </div>
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

            <div className="flex items-center gap-2 pt-1 pb-4">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded-[4px] border-input-border text-primary focus:ring-accent accent-primary"
              />
              <label htmlFor="remember" className="text-sm text-text-sec cursor-pointer">Keep me logged in for 30 days</label>
            </div>

            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-btn transition-colors"
            >
              Sign in
            </button>
          </form>

          <p className="text-center mt-6 text-text-sec text-sm">
            Don't have an account?{' '}
            <button onClick={() => onNavigate('signup')} className="text-accent font-medium hover:text-primary transition-colors">
              Create account
            </button>
          </p>

          <div className="mt-12 flex justify-center gap-1.5 text-xs text-text-mut font-medium">
            <span>HIPAA Compliant</span>
            <span>•</span>
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
