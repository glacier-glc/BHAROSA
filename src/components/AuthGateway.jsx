import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Building2, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  KeyRound, 
  HelpCircle, 
  PhoneCall, 
  CheckCircle2, 
  Smartphone, 
  CreditCard, 
  Calendar, 
  Globe, 
  ArrowRight,
  RefreshCw,
  FileCheck2,
  Sparkles,
  Search
} from 'lucide-react';
import AshokaChakra from './AshokaChakra';
import TricolorRiverCanvas from './TricolorRiverCanvas';

export default function AuthGateway({ onLogin, language = 'EN' }) {
  // Modes: 'login', 'signup', 'locked', 'unlock_kyc', 'forgot_pass', 'help', 'contact'
  const [viewMode, setViewMode] = useState('login');
  const [roleTab, setRoleTab] = useState('citizen'); // 'citizen', 'authority', 'admin'

  // Login form state
  const [loginStep, setLoginStep] = useState(1); // 1: Credentials, 2: OTP, 3: Personal challenge
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [personalAnswer, setPersonalAnswer] = useState('');
  const [loginError, setLoginError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Sign up state
  const [signupAadhaar, setSignupAadhaar] = useState('');
  const [signupPan, setSignupPan] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupDob, setSignupDob] = useState('');
  const [signupRole, setSignupRole] = useState('citizen');
  const [signupOtpStep, setSignupOtpStep] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Unlock KYC state
  const [unlockAadhaar, setUnlockAadhaar] = useState('');
  const [unlockPan, setUnlockPan] = useState('');
  const [unlockDob, setUnlockDob] = useState('');
  const [unlockSecret, setUnlockSecret] = useState('');
  const [unlockSuccess, setUnlockSuccess] = useState(false);

  // Contact form state
  const [contactSent, setContactSent] = useState(false);
  const [contactTicket, setContactTicket] = useState('');

  // Handle Quick Demo Logins
  const handleQuickDemo = (role) => {
    if (role === 'citizen') {
      onLogin({
        id: 'US-882190-C',
        name: 'Alex Mercer',
        role: 'citizen',
        aadhaar: '9842 1083 4519',
        pan: 'ABCDE1234F',
        mobile: '+91 98765 43210'
      });
    } else if (role === 'authority') {
      onLogin({
        id: 'AUTH-IIT-01',
        name: 'IIT Council & Academic Directorate',
        role: 'authority',
        sector: 'education',
        mobile: '+91 98765 43210'
      });
    } else if (role === 'admin') {
      onLogin({
        id: 'Admin',
        name: 'Central System Director (Admin)',
        role: 'admin',
        mobile: '+91 98765 43210',
        sector: 'National Administration & Cryptographic Audit'
      });
    }
  };

  // Handle Login progression
  const handleCredentialSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!identifier || !password) {
      setLoginError(language === 'EN' ? 'Please enter your registered ID and password.' : 'कृपया अपना पंजीकृत आईडी और पासवर्ड दर्ज करें।');
      return;
    }

    // Step into OTP verification
    setLoginStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    
    // Simulate failed attempt if OTP is '000000'
    if (enteredOtp === '000000' || enteredOtp.length < 6) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 3) {
        setViewMode('locked');
        return;
      }

      setLoginError(
        language === 'EN'
          ? `Invalid Sovereign OTP. ${3 - newAttempts} attempt(s) remaining before automatic security lockdown.`
          : `अमान्य ओटीपी। स्वचालित सुरक्षा लॉकडाउन से पहले ${3 - newAttempts} प्रयास शेष हैं।`
      );
      return;
    }

    // Move to step 3 (Personal challenge question for multi-layer)
    setLoginStep(3);
  };

  const handlePersonalChallengeSubmit = (e) => {
    e.preventDefault();
    if (!personalAnswer) {
      setLoginError(language === 'EN' ? 'Please answer the security confirmation question.' : 'कृपया सुरक्षा प्रश्न का उत्तर दें।');
      return;
    }

    // Successful authentications
    if (roleTab === 'citizen') {
      onLogin({
        id: 'US-882190-C',
        name: 'Alex Mercer',
        role: 'citizen',
        aadhaar: '9842 1083 4519',
        pan: 'ABCDE1234F',
        mobile: '+91 98765 43210'
      });
    } else if (roleTab === 'authority') {
      onLogin({
        id: 'AUTH-IIT-01',
        name: 'IIT Council Directorate',
        role: 'authority',
        sector: 'education',
        mobile: '+91 98765 43210'
      });
    } else {
      onLogin({
        id: 'Admin',
        name: 'Central System Director (Admin)',
        role: 'admin',
        mobile: '+91 98765 43210',
        sector: 'National Administration & Cryptographic Audit'
      });
    }
  };

  // Handle KYC Unlock Submission
  const handleUnlockKyc = (e) => {
    e.preventDefault();
    if (!unlockAadhaar || !unlockPan || !unlockDob) {
      alert('Please fill out all mandatory identity verification fields.');
      return;
    }

    setUnlockSuccess(true);
    setTimeout(() => {
      setFailedAttempts(0);
      setViewMode('login');
      setLoginStep(1);
      setUnlockSuccess(false);
      alert('Sovereign Account Successfully Unlocked! Security lock has been cleared.');
    }, 2000);
  };

  // Format 12-digit Aadhaar input (XXXX XXXX XXXX)
  const formatAadhaar = (val) => {
    const raw = val.replace(/\D/g, '').slice(0, 12);
    const parts = raw.match(/[\s\S]{1,4}/g) || [];
    return parts.join(' ');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-[#F8FAFC]">
      {/* 1. Animated Tricolor River Canvas Background */}
      <TricolorRiverCanvas />

      {/* Grid Overlay Texture */}
      <div 
        className="absolute inset-0 z-1 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'radial-gradient(rgba(0,40,117,0.12) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Main Floating Gateway Panel */}
      <div className="relative z-10 w-full max-w-xl my-8">
        
        {/* Top Sovereign Crest */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white border border-slate-200 shadow-md mb-3 backdrop-blur-xl">
            <AshokaChakra size={46} speed="normal" color="#002875" accentColor="#ff671f" />
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold tracking-wider text-[#002875]">
            BHAROSA
          </h1>
          <p className="font-outfit text-xs sm:text-sm text-slate-600 tracking-wide mt-1">
            Bharat Hub for Records, Online Security & Authentication
          </p>
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-mono text-[#002875]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#138808] animate-ping"></span>
            GOVERNMENT OF INDIA SOVEREIGN GATEWAY
          </div>
        </div>

        {/* -------------------- VIEW 1: NORMAL LOGIN -------------------- */}
        {viewMode === 'login' && (
          <div className="sovereign-card p-6 sm:p-8 bg-white border-slate-200 shadow-xl rounded-2xl">
            
            {/* Persona Selector Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setRoleTab('citizen'); setLoginStep(1); }}
                className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer ${
                  roleTab === 'citizen'
                    ? 'bg-[#002875] text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                👤 Nagrik / User
              </button>
              <button
                type="button"
                onClick={() => { setRoleTab('authority'); setLoginStep(1); }}
                className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer ${
                  roleTab === 'authority'
                    ? 'bg-[#002875] text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏛️ Authority
              </button>
              <button
                type="button"
                onClick={() => { setRoleTab('admin'); setLoginStep(1); }}
                className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer ${
                  roleTab === 'admin'
                    ? 'bg-[#FF671F] text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🛡️ Admin
              </button>
            </div>

            {/* Error Banner */}
            {loginError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-shake">
                <AlertTriangle size={16} className="text-red-500 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* STEP 1: Credentials Form */}
            {loginStep === 1 && (
              <form onSubmit={handleCredentialSubmit} className="space-y-4">
                <div>
                  <label className="input-label text-slate-700">
                    {roleTab === 'citizen' ? 'Aadhaar / Mobile Number / Citizen ID' : 'Authority ID / Officer ID'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="input-field pl-10 bg-slate-50 border-slate-300 text-slate-900 focus:bg-white"
                      placeholder={roleTab === 'citizen' ? 'e.g. 9842 1083 4519 or 9876543210' : 'e.g. officer@iit.ac.in'}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                    <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="input-label mb-0 text-slate-700">Sovereign Password / PIN</label>
                    <button
                      type="button"
                      onClick={() => setViewMode('forgot_pass')}
                      className="text-[11px] text-[#002875] font-semibold hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input-field pl-10 pr-10 bg-slate-50 border-slate-300 text-slate-900 focus:bg-white"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="w-full btn btn-primary py-3 text-sm mt-2">
                  <span>Verify Credentials & Send OTP</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {/* STEP 2: Multi-Factor OTP Verification */}
            {loginStep === 2 && (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="text-center py-2">
                  <div className="inline-flex p-3 rounded-full bg-blue-50 text-[#002875] mb-2 border border-blue-200">
                    <Smartphone size={24} />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Enter Encrypted Sovereign OTP</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Dispatched to your registered mobile ending in <strong>•••• 43210</strong> and WhatsApp.
                  </p>
                  <p className="text-[11px] text-[#002875] font-mono mt-1">
                    (Demo Simulation Tip: Enter any 6 digits like <strong>123456</strong>, or <strong>000000</strong> to test 3-attempt lockout)
                  </p>
                </div>

                {/* 6 Digit Inputs */}
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      className="w-11 h-12 text-center text-lg font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg text-[#002875] focus:border-[#002875] focus:ring-2 focus:ring-[#002875]/20 outline-none"
                      value={otp[idx]}
                      onChange={(e) => {
                        const val = e.target.value;
                        const newOtp = [...otp];
                        newOtp[idx] = val;
                        setOtp(newOtp);
                        if (val && idx < 5) {
                          document.getElementById(`otp-${idx + 1}`)?.focus();
                        }
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <span>Expires in: <strong className="text-[#002875]">00:58</strong></span>
                  <button type="button" className="text-[#002875] hover:underline cursor-pointer font-medium">
                    Resend via SMS / WhatsApp
                  </button>
                </div>

                <button type="submit" className="w-full btn btn-primary py-3 text-sm">
                  <span>Verify OTP</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {/* STEP 3: Personal Confidential KYC Challenge Question */}
            {loginStep === 3 && (
              <form onSubmit={handlePersonalChallengeSubmit} className="space-y-4">
                <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-center">
                  <div className="text-xs font-semibold text-[#FF671F] uppercase tracking-wider mb-1">
                    Final Confidential Challenge
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Confirm your Year of Birth (YYYY) as registered on your Aadhaar Card:
                  </div>
                </div>

                <input
                  type="text"
                  className="input-field text-center font-mono text-lg font-bold bg-slate-50 border-slate-300 text-slate-900"
                  placeholder="e.g. 1992"
                  value={personalAnswer}
                  onChange={(e) => setPersonalAnswer(e.target.value)}
                />

                <button type="submit" className="w-full btn btn-primary py-3 text-sm">
                  <span>Authenticate & Enter Sovereign Dashboard</span>
                  <ShieldCheck size={16} />
                </button>
              </form>
            )}

            {/* Quick 1-Click Demo Buttons for Fast Evaluation */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1 font-semibold">
                  <Sparkles size={12} className="text-[#FF671F]" /> 1-Click Instant Demo Access:
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('citizen')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all cursor-pointer shadow-sm hover:border-[#002875]/40"
                >
                  <div className="text-[11px] font-bold text-[#002875]">Alex Mercer</div>
                  <div className="text-[10px] text-slate-500">Citizen Vault</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('authority')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all cursor-pointer shadow-sm hover:border-[#002875]/40"
                >
                  <div className="text-[11px] font-bold text-[#002875]">IIT Council</div>
                  <div className="text-[10px] text-slate-500">Issuing Authority</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all cursor-pointer shadow-sm hover:border-[#FF671F]/40"
                >
                  <div className="text-[11px] font-bold text-[#FF671F]">National Admin</div>
                  <div className="text-[10px] text-slate-500">System Director</div>
                </button>
              </div>
            </div>

            {/* Bottom Links: Sign Up & Utilities */}
            <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <div>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setViewMode('signup')}
                  className="text-[#002875] font-bold hover:underline cursor-pointer"
                >
                  Sovereign Sign Up
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('help')}
                  className="hover:text-[#002875] cursor-pointer"
                >
                  Need Help?
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setViewMode('contact')}
                  className="hover:text-[#002875] cursor-pointer"
                >
                  Contact Support
                </button>
              </div>
            </div>

          </div>
        )}

        {/* -------------------- VIEW 2: ACCOUNT LOCKED (3 FAILED ATTEMPTS) -------------------- */}
        {viewMode === 'locked' && (
          <div className="sovereign-card p-6 sm:p-8 bg-white border border-rose-200 shadow-xl rounded-2xl text-center">
            <div className="inline-flex p-4 rounded-full bg-rose-50 text-rose-600 mb-3 border border-rose-200">
              <Lock size={36} />
            </div>
            <h3 className="font-cinzel text-xl font-extrabold text-rose-700 tracking-wide">
              🚨 SOVEREIGN ACCOUNT LOCKED
            </h3>
            <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto">
              Multiple unsuccessful login attempts detected. To safeguard national credentials and privacy, access has been restricted.
            </p>

            <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Security Alert Dispatched To:</span>
                <strong className="text-slate-900">+91 98765 43210 (SMS & WhatsApp)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Incident Timestamp:</span>
                <strong className="text-slate-900">30 September 2026, 17:05:14 IST</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reason Code:</span>
                <strong className="font-mono text-rose-600">ERR_BRUTE_FORCE_EXCEEDED_3</strong>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setViewMode('unlock_kyc')}
                className="w-full btn btn-primary py-3 text-sm font-bold"
              >
                <KeyRound size={16} />
                <span>Unlock Account via Confidential Tier-2 KYC</span>
              </button>

              <button
                type="button"
                onClick={() => { setViewMode('login'); setLoginStep(1); setFailedAttempts(0); }}
                className="w-full btn btn-secondary py-2 text-xs"
              >
                Return to Login Screen
              </button>
            </div>
          </div>
        )}

        {/* -------------------- VIEW 3: CONFIDENTIAL TIER-2 KYC UNLOCK -------------------- */}
        {viewMode === 'unlock_kyc' && (
          <div className="sovereign-card p-6 sm:p-8 bg-white border border-slate-200 shadow-xl rounded-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-[#002875]">Confidential Sovereign Account Unlocking</h3>
                <p className="text-xs text-slate-500">Verify high-security personal identity data to restore vault access</p>
              </div>
              <button onClick={() => setViewMode('login')} className="text-slate-500 hover:text-slate-900 text-xs">Cancel</button>
            </div>

            {unlockSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 size={48} className="text-[#138808] mx-auto animate-bounce" />
                <h4 className="font-bold text-lg text-[#138808]">Identity Successfully Verified!</h4>
                <p className="text-xs text-slate-600">Sovereign lock has been lifted. Redirecting to login...</p>
              </div>
            ) : (
              <form onSubmit={handleUnlockKyc} className="space-y-3 text-xs">
                <div>
                  <label className="input-label text-slate-700">Full 12-Digit Aadhaar Number</label>
                  <input
                    type="text"
                    className="input-field font-mono bg-slate-50 border-slate-300 text-slate-900"
                    placeholder="XXXX XXXX XXXX"
                    value={unlockAadhaar}
                    onChange={(e) => setUnlockAadhaar(formatAadhaar(e.target.value))}
                  />
                </div>

                <div>
                  <label className="input-label text-slate-700">10-Character PAN Card Number</label>
                  <input
                    type="text"
                    className="input-field font-mono uppercase bg-slate-50 border-slate-300 text-slate-900"
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    value={unlockPan}
                    onChange={(e) => setUnlockPan(e.target.value.toUpperCase())}
                  />
                </div>

                <div>
                  <label className="input-label text-slate-700">Date of Birth (as per National Registry)</label>
                  <input
                    type="date"
                    className="input-field bg-slate-50 border-slate-300 text-slate-900"
                    value={unlockDob}
                    onChange={(e) => setUnlockDob(e.target.value)}
                  />
                </div>

                <div>
                  <label className="input-label text-slate-700">Mother's Maiden Name / Sovereign Secret Passphrase</label>
                  <input
                    type="text"
                    className="input-field bg-slate-50 border-slate-300 text-slate-900"
                    placeholder="Enter confidential security answer"
                    value={unlockSecret}
                    onChange={(e) => setUnlockSecret(e.target.value)}
                  />
                </div>

                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-[#002875]">
                  Emergency Recovery OTP will be verified simultaneously with your registered mobile and WhatsApp number.
                </div>

                <button type="submit" className="w-full btn btn-primary py-3 text-sm mt-3">
                  <ShieldCheck size={16} />
                  <span>Verify Confidential KYC & Release Lock</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* -------------------- VIEW 4: SOVEREIGN SIGN-UP / REGISTRATION -------------------- */}
        {viewMode === 'signup' && (
          <div className="sovereign-card p-6 sm:p-8 bg-white border border-slate-200 shadow-xl rounded-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-[#002875]">Sovereign Onboarding & Registration</h3>
                <p className="text-xs text-slate-500">Initialize your tamper-proof BHAROSA Nagrik Vault</p>
              </div>
              <button onClick={() => setViewMode('login')} className="text-slate-500 hover:text-slate-900 text-xs">Back to Login</button>
            </div>

            {signupSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 size={48} className="text-[#138808] mx-auto animate-bounce" />
                <h4 className="font-bold text-lg text-[#138808]">Sovereign Profile Initialized!</h4>
                <p className="text-xs text-slate-600">Your Nagrik Vault has been created with SHA-256 root keypair.</p>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('citizen')}
                  className="btn btn-primary text-xs"
                >
                  Enter Your New Vault
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSignupSuccess(true); }} className="space-y-3 text-xs">
                
                {/* 1-Click DigiLocker Fetch Simulation */}
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-[#002875]">Fast-Track with DigiLocker</div>
                    <div className="text-[11px] text-slate-600">Pre-populate verified Aadhaar, PAN, and address</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSignupName('Alex Mercer');
                      setSignupAadhaar('9842 1083 4519');
                      setSignupPan('ABCDE1234F');
                      setSignupMobile('+91 98765 43210');
                      setSignupDob('1992-08-14');
                    }}
                    className="btn btn-secondary text-xs py-1.5 px-3 border-[#002875]/30 text-[#002875] bg-white hover:bg-slate-50"
                  >
                    ⚡ Pull Verified Docs
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label text-slate-700">Full Legal Name</label>
                    <input
                      type="text"
                      className="input-field bg-slate-50 border-slate-300 text-slate-900"
                      placeholder="As per Aadhaar"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="input-label text-slate-700">Date of Birth</label>
                    <input
                      type="date"
                      className="input-field bg-slate-50 border-slate-300 text-slate-900"
                      value={signupDob}
                      onChange={(e) => setSignupDob(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label text-slate-700">12-Digit Aadhaar Number (Mandatory)</label>
                  <input
                    type="text"
                    className="input-field font-mono bg-slate-50 border-slate-300 text-slate-900"
                    placeholder="XXXX XXXX XXXX"
                    value={signupAadhaar}
                    onChange={(e) => setSignupAadhaar(formatAadhaar(e.target.value))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label text-slate-700">10-Digit PAN Card Number</label>
                    <input
                      type="text"
                      className="input-field font-mono uppercase bg-slate-50 border-slate-300 text-slate-900"
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      value={signupPan}
                      onChange={(e) => setSignupPan(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                  <div>
                    <label className="input-label text-slate-700">Aadhaar-Linked Mobile Number</label>
                    <input
                      type="tel"
                      className="input-field font-mono bg-slate-50 border-slate-300 text-slate-900"
                      placeholder="+91 XXXXX XXXXX"
                      value={signupMobile}
                      onChange={(e) => setSignupMobile(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label text-slate-700">Account Category</label>
                  <select
                    className="input-field bg-slate-50 border-slate-300 text-slate-900"
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value)}
                  >
                    <option value="citizen">Citizen / Student Applicant (Nagrik)</option>
                    <option value="authority">Educational Institute / Examination Council</option>
                    <option value="government">Government Department / Ministry Officer</option>
                    <option value="business">Commercial Enterprise / Startup</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  By registering, you consent to sovereign Aadhaar e-KYC validation in compliance with the DPDP Act 2023.
                </div>

                <button type="submit" className="w-full btn btn-primary py-3 text-sm mt-3">
                  <ShieldCheck size={16} />
                  <span>Generate Sovereign Vault & Register</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* -------------------- VIEW 5: FORGOT PASSWORD -------------------- */}
        {viewMode === 'forgot_pass' && (
          <div className="sovereign-card p-6 bg-white border border-slate-200 shadow-xl rounded-2xl">
            <h3 className="font-cinzel text-lg font-bold text-[#002875] mb-2">Reset Sovereign Password / PIN</h3>
            <p className="text-xs text-slate-600 mb-4">Enter your registered Aadhaar or Mobile Number to receive a reset authorization OTP.</p>
            <input type="text" className="input-field mb-3 bg-slate-50 border-slate-300 text-slate-900" placeholder="Enter Aadhaar or Mobile" />
            <button
              onClick={() => { alert('Encrypted reset OTP sent to registered mobile.'); setViewMode('login'); }}
              className="w-full btn btn-primary py-2.5 text-xs"
            >
              Send Reset Authorization OTP
            </button>
            <button onClick={() => setViewMode('login')} className="w-full text-center text-xs text-slate-500 hover:text-slate-900 mt-3 cursor-pointer">Cancel</button>
          </div>
        )}

        {/* -------------------- VIEW 6: NEED HELP / FAQS -------------------- */}
        {viewMode === 'help' && (
          <div className="sovereign-card p-6 bg-white border border-slate-200 shadow-xl rounded-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
              <h3 className="font-cinzel text-lg font-bold text-[#002875]">Sovereign Help & FAQ Guide</h3>
              <button onClick={() => setViewMode('login')} className="text-slate-500 hover:text-slate-900 text-xs">Close</button>
            </div>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">How do I access my Nagrik Vault?</strong>
                Log in with your Aadhaar-linked mobile number and verify via the 6-digit OTP. Your pre-authenticated certificates will automatically appear.
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">What is Tatkal Fast-Track Authentication?</strong>
                For urgent emergencies (visa interviews, admissions cutoffs, hospital surgeries), select the Tatkal Express option for 24-hour guaranteed issuance.
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">Can I manage certificates for my entire family?</strong>
                Yes! If multiple family members share a mobile number, the Family / Parivar Hub allows switching between dependents in 1 click.
              </div>
            </div>
          </div>
        )}

        {/* -------------------- VIEW 7: CONTACT SUPPORT -------------------- */}
        {viewMode === 'contact' && (
          <div className="sovereign-card p-6 bg-white border border-slate-200 shadow-xl rounded-2xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
              <h3 className="font-cinzel text-lg font-bold text-[#002875]">Official Support & Cyber Grievance Desk</h3>
              <button onClick={() => setViewMode('login')} className="text-slate-500 hover:text-slate-900 text-xs">Close</button>
            </div>
            {contactSent ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 size={40} className="text-[#138808] mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Grievance Ticket Registered!</h4>
                <p className="text-xs font-mono text-[#002875] font-semibold">{contactTicket}</p>
                <p className="text-xs text-slate-600">Our nodal officer will contact your registered mobile within 4 business hours.</p>
                <button onClick={() => setViewMode('login')} className="btn btn-secondary text-xs mt-3">Return to Gateway</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setContactSent(true); setContactTicket(`GRV-${Math.floor(100000 + Math.random() * 900000)}`); }} className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-600 font-medium">National 24x7 Helpline</div>
                    <div className="text-sm font-bold text-[#FF671F]">1800-BHAROSA (1800-242-7672)</div>
                  </div>
                  <PhoneCall size={20} className="text-[#FF671F]" />
                </div>
                <div>
                  <label className="input-label text-slate-700">Your Name or Citizen ID</label>
                  <input type="text" className="input-field bg-slate-50 border-slate-300 text-slate-900" placeholder="Alex Mercer" required />
                </div>
                <div>
                  <label className="input-label text-slate-700">Your Email / Mobile</label>
                  <input type="text" className="input-field bg-slate-50 border-slate-300 text-slate-900" placeholder="+91 98765 43210" required />
                </div>
                <div>
                  <label className="input-label text-slate-700">Grievance / Issue Description</label>
                  <textarea rows={3} className="input-field bg-slate-50 border-slate-300 text-slate-900" placeholder="Describe the technical or verification issue..." required />
                </div>
                <button type="submit" className="w-full btn btn-primary py-2.5 text-xs">Submit Grievance Ticket</button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
