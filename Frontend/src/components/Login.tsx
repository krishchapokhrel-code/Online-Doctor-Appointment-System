import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import logo from '../assets/ah_logo.png';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = React.useState(false);
  const [role, setRole] = React.useState<'patient' | 'doctor' | 'admin'>('patient');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const effectiveRole = email === 'admin@admin.com' ? 'admin' : role;
      const userId = effectiveRole === 'admin' ? 'admin1' : effectiveRole === 'doctor' ? 'd1' : 'p1';
      const userName = effectiveRole === 'admin' ? 'Admin' : effectiveRole === 'doctor' ? 'Dr. Aasha Poudel' : 'Aarav Shrestha';
      const specialty = effectiveRole === 'doctor' ? 'Cardiologist' : undefined;

      setTimeout(() => {
        login({ id: userId, name: userName, role: effectiveRole, email, specialty }, 'mock-token');
        toast.success(`Logged in as ${effectiveRole}`);
        if (effectiveRole === 'doctor') {
          navigate('/doctor-panel');
        } else if (effectiveRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-base">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-gradient-to-br from-[#0d4f6b] via-[#1a7a9e] to-[#0f8c7a] p-12 text-white relative overflow-hidden">
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
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold text-text-main mb-2">Welcome back</h2>
          <p className="text-text-sec mb-8">Enter your credentials to access your account</p>

          <div className="flex gap-1 p-1 bg-input-bg border border-input-border rounded-full mb-8">
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

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-main">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-mut" />
                <input 
                  type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com"
                  className="w-full bg-input-bg border-[1.5px] border-input-border pl-10 pr-4 py-2.5 rounded-input focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-text-main placeholder-text-mut"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-text-main">Password</label>
                <button type="button" onClick={() => toast('Password reset link sent!', { icon: '📧' })} className="text-sm font-medium text-accent hover:text-primary transition-colors">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-mut" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              disabled={loading}
              className={`w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-btn transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center mt-6 text-text-sec text-sm">
            Don't have an account?{' '}
            <button type="button" onClick={() => navigate('/signup')} className="text-accent font-medium hover:text-primary transition-colors">
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
