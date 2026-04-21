import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { 
  HeartPulse, 
  ShieldCheck, 
  HeadphonesIcon, 
  Mail, 
  Lock, 
  User, 
  Phone
} from 'lucide-react';
import './App.css';

// SVG Icons for social buttons to avoid external dependencies
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
);

const AppleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 384 512">
      <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
    </svg>
);

const Login = () => {
  return (
    <div className="container animate-pop">
      {/* Left Panel */}
      <div className="left-panel login">
        <div className="logo animate-fade" style={{animationDelay: '0.1s'}}>
          <HeartPulse size={24} />
          Aura Health
        </div>
        
        <h1 className="heading-main animate-item" style={{animationDelay: '0.2s'}}>The intersection of care and clarity.</h1>
        <p className="sub-text animate-item" style={{animationDelay: '0.3s'}}>Experience a digital environment designed for healing. Our platform harmonizes clinical precision with human-centric design.</p>
        
        <div className="badge animate-item" style={{animationDelay: '0.4s'}}>
          <ShieldCheck size={18} />
          HIPAA Compliant Security Protocol
        </div>
        <div className="badge animate-item" style={{animationDelay: '0.5s'}}>
          <HeadphonesIcon size={18} />
          24/7 Professional Medical Support
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="animate-item" style={{animationDelay: '0.2s'}}>
          <h2 className="right-title">Welcome Back</h2>
          <p className="right-sub">Sign in to manage your health journey</p>
        </div>

        <form>
          <div className="form-group animate-item" style={{animationDelay: '0.3s'}}>
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input type="email" placeholder="name@example.com" required />
            </div>
          </div>

          <div className="form-group animate-item" style={{animationDelay: '0.4s'}}>
            <div className="flex-between">
              <label>Password</label>
              <a href="#" className="link text-small" style={{marginBottom: '8px'}}>Forgot Password?</a>
            </div>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input type="password" placeholder="••••••••" required />
            </div>
          </div>

          <div className="checkbox-group animate-item" style={{animationDelay: '0.5s'}}>
            <input type="checkbox" id="keep-logged" />
            <label htmlFor="keep-logged" className="text-small" style={{marginBottom: 0}}>Keep me logged in for 30 days</label>
          </div>

          <div className="animate-item" style={{animationDelay: '0.6s'}}>
            <button type="button" className="btn-primary">Login</button>
          </div>
        </form>

        <div className="divider animate-item" style={{animationDelay: '0.7s'}}>OR CONTINUE WITH</div>

        <div className="social-buttons animate-item" style={{animationDelay: '0.8s'}}>
          <button className="btn-social">
            <GoogleIcon /> Google
          </button>
          <button className="btn-social">
            <AppleIcon /> Apple
          </button>
        </div>

        <div className="text-center text-small animate-item" style={{animationDelay: '0.9s'}}>
          Don't have an account? <Link to="/signup" className="link">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

const Signup = () => {
  return (
    <div className="container animate-pop">
      {/* Left Panel */}
      <div className="left-panel signup">
        <div className="logo animate-fade" style={{animationDelay: '0.1s'}}>
          <HeartPulse size={24} />
          Aura Health
        </div>
        
        <h1 className="heading-main animate-item" style={{animationDelay: '0.2s'}}>A calm path to<br/>Better Health.</h1>
        <p className="sub-text animate-item" style={{animationDelay: '0.3s'}}>Join a community where medical clinical precision meets empathetic digital experiences. Your wellness journey starts here.</p>
        
        <div className="testimonial-card animate-item" style={{animationDelay: '0.4s'}}>
          <div className="testimonial-avatar" style={{backgroundImage: "url('https://randomuser.me/api/portraits/men/32.jpg')"}}></div>
          <div className="testimonial-text">
            <h4>"Efficiency at the speed of care."</h4>
            <p>Dr. Sandip Adhikari, Lead Clinician</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="animate-item" style={{animationDelay: '0.1s'}}>
          <h2 className="right-title">Create Account</h2>
          <p className="right-sub">Join us and manage your health efficiently.</p>
        </div>

        <div className="social-buttons animate-item" style={{animationDelay: '0.2s'}}>
          <button className="btn-social">
            <GoogleIcon /> Google
          </button>
          <button className="btn-social">
            <AppleIcon /> Apple
          </button>
        </div>

        <div className="divider animate-item" style={{animationDelay: '0.3s'}}>OR CONTINUE WITH</div>

        <form>
          <div className="form-group animate-item" style={{animationDelay: '0.4s'}}>
            <label>Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input type="text" placeholder="Ram Khadka" required />
            </div>
          </div>

          <div className="form-group animate-item" style={{animationDelay: '0.5s'}}>
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input type="email" placeholder="ram@example.com" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group animate-item" style={{animationDelay: '0.6s'}}>
              <label>Phone Number</label>
              <div className="input-wrapper">
                <Phone className="input-icon" />
                <input type="text" placeholder="+977 9800000000" required />
              </div>
            </div>
            <div className="form-group animate-item" style={{animationDelay: '0.6s'}}>
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input type="password" placeholder="••••••••" required />
              </div>
            </div>
          </div>

          <div className="checkbox-group animate-item" style={{animationDelay: '0.7s'}}>
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms" className="text-small" style={{marginBottom: 0}}>
              I agree to the <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a>.
            </label>
          </div>

          <div className="animate-item" style={{animationDelay: '0.8s'}}>
            <button type="button" className="btn-primary">Create Account</button>
          </div>
        </form>

        <div className="text-center text-small animate-item" style={{marginTop: '15px', animationDelay: '0.9s'}}>
          Already have an account? <Link to="/" className="link">Login</Link>
        </div>
        
        <div className="text-center text-small animate-item" style={{marginTop: '15px', color: '#aaa', display: 'flex', justifyContent: 'center', gap: '15px', animationDelay: '1s'}}>
          <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}><ShieldCheck size={14}/> HIPAA COMPLIANT</span>
          <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}><Lock size={14}/> END-TO-END ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
