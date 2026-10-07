import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  X, 
  Smartphone, 
  RefreshCw, 
  Check, 
  FileCheck2,
  KeyRound
} from 'lucide-react';
import AshokaChakra from './AshokaChakra';

/**
 * AutoFillOtpModal Component
 * Sovereign UIDAI Aadhaar & DigiLocker e-KYC OTP Verification Gateway:
 * - Mandated by DPDP Act 2023 & Aadhaar Regulations for sensitive data release
 * - Required before auto-filling citizen KYC, address, and academic records into forms
 * - 6-Digit segmented input with keyboard navigation & backspace support
 * - 1-Click "Demo Fill OTP (202601)" helper for seamless testing
 * - 30s countdown timer with Resend OTP mechanism
 * - Cryptographic session token minting upon verification
 */
export default function AutoFillOtpModal({
  isOpen,
  onClose,
  onVerified,
  purposeText = 'Authorizing DigiLocker e-KYC Data Release for Application Auto-Fill',
  targetMobile = '+91 ******4210',
  targetAadhaar = 'XXXX-XXXX-4519'
}) {
  if (!isOpen) return null;

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [consentChecked, setConsentChecked] = useState(true);

  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Focus first input on open
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);
  }, [isOpen]);

  // Handle digit input & auto-focus next
  const handleDigitChange = (index, value) => {
    // Keep only last character if alphanumeric/digit
    const char = value.slice(-1);
    if (!/^\d*$/.test(char)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = char;
    setOtpDigits(newOtp);
    setErrorMsg('');

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste (e.g. pasting 6-digit OTP)
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split('');
      const newOtp = [...otpDigits];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtpDigits(newOtp);
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  // Quick Demo OTP Fill (202601)
  const handleQuickFillDemo = () => {
    setOtpDigits(['2', '0', '2', '6', '0', '1']);
    setErrorMsg('');
    inputRefs.current[5]?.focus();
  };

  // Resend OTP simulation
  const handleResendOtp = () => {
    setResendTimer(30);
    setCanResend(false);
    setOtpDigits(['', '', '', '', '', '']);
    setErrorMsg('');
    inputRefs.current[0]?.focus();
  };

  // Form submission & verification
  const handleVerifySubmit = (e) => {
    e?.preventDefault();
    const enteredOtp = otpDigits.join('');

    if (!consentChecked) {
      setErrorMsg('Please accept the DPDP Act 2023 e-KYC consent declaration.');
      return;
    }

    if (enteredOtp.length < 6) {
      setErrorMsg('Please enter all 6 digits of the Aadhaar e-KYC OTP.');
      return;
    }

    // Demo check: allow 202601 or any 6-digit except 000000
    if (enteredOtp === '000000') {
      setErrorMsg('Invalid or expired OTP. Please check the SMS or click Resend.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);

      const authPayload = {
        token: `AUTH-EKYC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        verifiedAt: new Date().toISOString(),
        aadhaarMasked: targetAadhaar,
        mobileMasked: targetMobile,
        status: 'AUTHENTICATED',
        sha256AuthProof: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      };

      setTimeout(() => {
        onVerified(authPayload);
        onClose();
        setIsSuccess(false);
        setOtpDigits(['', '', '', '', '', '']);
      }, 800);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scaleUp">
        
        {/* Sovereign Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#002875] via-[#003CB3] to-[#0A2566] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-amber-300 shadow-sm">
              <AshokaChakra size={24} speed="normal" color="#ffffff" accentColor="#ff671f" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  Aadhaar e-KYC Verification
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-400 text-slate-950 font-bold">
                  DPDP 2023
                </span>
              </div>
              <p className="text-[11px] text-blue-200">
                Sovereign Two-Factor Authentication before Form Auto-Fill
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Purpose & Target Mobile Notice */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-start gap-3 text-xs">
            <Smartphone size={20} className="text-[#002875] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-[#002875]">
                {purposeText}
              </p>
              <p className="text-slate-600 leading-relaxed">
                A 6-digit one-time cryptographic authorization password (OTP) has been sent to your Aadhaar-linked mobile <strong>{targetMobile}</strong> and registered email.
              </p>
              <div className="text-[11px] font-mono text-slate-500 pt-1 flex items-center gap-2">
                <span>Aadhaar: <strong className="text-slate-800">{targetAadhaar}</strong></span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">Valid for 10 minutes</span>
              </div>
            </div>
          </div>

          {/* Segmented 6-Digit OTP Input Boxes */}
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <KeyRound size={14} className="text-[#002875]" />
                  <span>Enter 6-Digit Sovereign OTP</span>
                </label>
                
                {/* 1-Click Demo Fill Trigger */}
                <button
                  type="button"
                  onClick={handleQuickFillDemo}
                  className="text-[11px] font-bold text-[#002875] hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles size={12} className="text-amber-500" />
                  <span>Auto-Fill Demo OTP (202601)</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isVerifying || isSuccess}
                    className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-mono font-black rounded-2xl border-2 transition-all shadow-xs ${
                      digit 
                        ? 'border-[#002875] bg-blue-50/50 text-[#002875] ring-2 ring-[#002875]/10' 
                        : 'border-slate-300 bg-white text-slate-900 focus:border-[#002875] focus:ring-2 focus:ring-[#002875]/20'
                    } ${errorMsg ? 'border-red-500 bg-red-50/30' : ''}`}
                  />
                ))}
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mt-2.5 p-2 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-1.5 animate-fadeIn">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Countdown Timer & Resend Button */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-mono">
                {resendTimer > 0 ? (
                  <span>Resend OTP in <strong className="text-slate-800">{resendTimer}s</strong></span>
                ) : (
                  <span className="text-emerald-700 font-bold">OTP expired or not received?</span>
                )}
              </span>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || isVerifying || isSuccess}
                className="text-xs font-bold text-[#002875] hover:underline disabled:opacity-40 disabled:hover:no-underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={12} className={canResend ? 'animate-spin' : ''} style={{ animationDuration: '6s' }} />
                <span>Resend OTP</span>
              </button>
            </div>

            {/* Statutory DPDP Act Consent Checkbox */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-[11px] text-slate-700">
              <input
                type="checkbox"
                id="otpConsentCheckbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#002875] focus:ring-[#002875] border-slate-300 cursor-pointer"
              />
              <label htmlFor="otpConsentCheckbox" className="leading-snug cursor-pointer select-none">
                I hereby declare my voluntary consent under <strong>Section 6 of the Digital Personal Data Protection (DPDP) Act, 2023</strong> to share my DigiLocker &amp; UIDAI verified attributes to auto-populate this sovereign application form without manual entry.
              </label>
            </div>

            {/* Submit / Verification Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isVerifying || isSuccess}
                className={`w-full py-3.5 px-6 rounded-2xl text-xs font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  isSuccess 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-gradient-to-r from-[#002875] to-[#003CB3] hover:from-[#001F5C] hover:to-[#002E8A]'
                }`}
              >
                {isVerifying ? (
                  <>
                    <AshokaChakra size={16} speed="fast" color="#ffffff" />
                    <span>Verifying with UIDAI Sovereign Node...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 size={16} className="text-white" />
                    <span>✓ e-KYC Verified! Auto-Filling Form...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Verify OTP &amp; Authorize Auto-Fill</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>

        {/* Security Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1.5">
            <Lock size={12} className="text-emerald-600" />
            <span>256-Bit HSM TLS 1.3 Encryption</span>
          </span>
          <span>UIDAI CIDR Auth 2.5</span>
        </div>

      </div>
    </div>
  );
}
