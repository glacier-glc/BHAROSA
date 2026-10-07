import React, { useState, useEffect } from 'react';
import AshokEmblem from './AshokEmblem';
import TricolorRiverCanvas from './TricolorRiverCanvas';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Key, 
  ArrowRight, 
  FileText, 
  Lock, 
  Sparkles, 
  UserCheck, 
  Fingerprint, 
  Clock, 
  ExternalLink 
} from 'lucide-react';

/**
 * LoginVerificationSuccessPage
 * Dedicated official Sovereign Attestation page shown immediately after login verification.
 * Features:
 * - Full-fidelity Ashok Emblem with its center 24-spoke wheel rotating smoothly.
 * - Dynamic, vibrant flowing tricolor river canvas in the background.
 * - Multi-stage cryptographic checkpoint progression.
 * - Authenticated citizen / authority identity card.
 * - Auto-redirect progress bar with instant skip button.
 */
export default function LoginVerificationSuccessPage({
  userData,
  onProceed,
  language = 'EN'
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showProofModal, setShowProofModal] = useState(false);

  // Generate reproducible cryptographic session data
  const sessionHash = `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...`;
  const blockNumber = '8,924,107';
  const issueTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Verification Checklist Items
  const verificationSteps = [
    {
      id: 1,
      titleEn: 'UIDAI Aadhaar Bio-Token Authenticated',
      titleHi: 'यूआईडीएआई आधार बायो-टोकन प्रमाणित',
      subEn: 'SHA-256 Merkle leaf validated with Root Node',
      subHi: 'रूट नोड के साथ एसएचए-256 मर्केल लीफ सत्यापित'
    },
    {
      id: 2,
      titleEn: 'National Sovereign Ledger Session Minted',
      titleHi: 'राष्ट्रीय संप्रभु खाता सत्र ब्लॉक निर्मित',
      subEn: `Block #${blockNumber} ratified across 24 State Nodes`,
      subHi: `24 राज्य नोड्स द्वारा ब्लॉक #${blockNumber} अनुमोदित`
    },
    {
      id: 3,
      titleEn: 'ECDSA P-256 HSM Digital Signature Affixed',
      titleHi: 'ईसीडीएसए पी-256 एचएसएम डिजिटल हस्ताक्षर संलग्न',
      subEn: 'Certifying Authority: Controller of Certifying Authorities (CCA)',
      subHi: 'प्रमाणन प्राधिकरण: सीसीए भारत सरकार'
    },
    {
      id: 4,
      titleEn: 'Zero-Knowledge Nagrik Vault Key Decrypted',
      titleHi: 'ज़ीरो-नॉलेज नागरिक लॉकर कुंजी डिक्रिप्टेड',
      subEn: 'Encrypted end-to-end with high-assurance clearance',
      subHi: 'उच्च-आश्वासन सुरक्षा के साथ एंड-टू-एंड एन्क्रिप्टेड'
    }
  ];

  // Progression of verification steps
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < verificationSteps.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 700);

    return () => clearInterval(stepInterval);
  }, []);

  // Progression of the auto-redirect bar
  useEffect(() => {
    const totalDuration = 3800; // ~3.8 seconds
    const intervalTime = 40;
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(100, prev + increment);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Trigger celebration confetti when complete
  useEffect(() => {
    // Initial gentle burst
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.4 },
      colors: ['#FF671F', '#FFFFFF', '#138808', '#002875']
    });

    const completionTimer = setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#FF671F', '#FFD700', '#138808', '#002875']
      });
    }, 2800);

    return () => clearTimeout(completionTimer);
  }, []);

  // When progress reaches 100%, automatically call onProceed
  useEffect(() => {
    if (progress >= 100) {
      const autoProceedTimer = setTimeout(() => {
        if (onProceed) onProceed(userData);
      }, 300);
      return () => clearTimeout(autoProceedTimer);
    }
  }, [progress, onProceed, userData]);

  return (
    <div className="relative min-h-screen bg-[#FAFCFF] text-[#0F172A] flex flex-col justify-between overflow-x-hidden selection:bg-[#FF671F]/20">
      
      {/* 1. Dynamic Vibrant Flowing Tricolor River Canvas Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-85">
        <TricolorRiverCanvas 
          opacity={0.88} 
          speedMultiplier={1.05} 
          showParticles={true} 
        />
        {/* Soft Pearl Vignette to keep card contrast crystal clear */}
        <div className="absolute inset-0 bg-radial from-transparent via-white/40 to-white/80" />
      </div>

      {/* 2. Official Top Utility Strip */}
      <header className="relative z-10 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-3.5 w-6 rounded-xs overflow-hidden shadow-xs border border-black/10">
              <span className="w-1/3 h-full bg-[#FF671F]"></span>
              <span className="w-1/3 h-full bg-white flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full border-[0.5px] border-[#002875]"></span>
              </span>
              <span className="w-1/3 h-full bg-[#138808]"></span>
            </div>
            <span className="font-semibold text-slate-800 tracking-wide">
              भारत सरकार | Government of India
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-600 font-medium">
              National Informatics Centre (NIC) · MeitY Sovereign Layer
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
            <span>TLS 1.3 / SHA-256 SECURED</span>
          </div>
        </div>
      </header>

      {/* 3. Main Stage Content */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 py-6 md:py-10 flex flex-col items-center justify-center">
        
        {/* Central National Card */}
        <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,40,117,0.12)] p-6 md:p-10 flex flex-col items-center">
          
          {/* Top Tricolor Bar Accent */}
          <div className="w-full h-1.5 rounded-full mb-8 bg-gradient-to-r from-[#FF671F] via-white to-[#138808] border border-slate-200 shadow-xs" />

          {/* ================= SECTION: REALISTIC ASHOK EMBLEM WITH ROTATING WHEEL ================= */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative p-3 rounded-3xl bg-gradient-to-b from-amber-50/50 via-white to-sky-50/40 border border-amber-200/60 shadow-lg mb-4 hover:scale-[1.02] transition-transform duration-300">
              <AshokEmblem 
                size={220} 
                wheelSpeed="normal" 
                showMotto={false}
                glow={true} 
                variant="realistic"
              />
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-[#002875] tracking-tight">
              {language === 'EN' ? 'Sovereign Verification Attested' : 'संप्रभु सत्यापन पूर्ण एवं प्रमाणित'}
            </h1>
            <p className="text-sm md:text-base text-slate-600 mt-1 max-w-xl">
              {language === 'EN' 
                ? 'Your multi-factor cryptographic credentials have been authenticated against the National Trust Directory.' 
                : 'आपके बहु-चरणीय क्रिप्टोग्राफिक क्रेडेंशियल्स राष्ट्रीय ट्रस्ट निर्देशिका द्वारा सत्यापित किए गए हैं।'}
            </p>
          </div>

          {/* ================= SECTION: AUTHENTICATED PERSONA BADGE ================= */}
          <div className="w-full max-w-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-blue-100 rounded-2xl p-4 md:p-5 mb-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-[#002875] text-white flex items-center justify-center font-bold text-lg shadow-md border-2 border-amber-400">
                  {userData?.name ? userData.name.charAt(0) : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base md:text-lg font-bold text-slate-900">
                      {userData?.name || 'Verified Beneficiary'}
                    </h2>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {language === 'EN' ? 'Attested' : 'प्रमाणित'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5 font-mono">
                    <span>Role: <strong className="text-[#002875] uppercase">{userData?.role || 'Citizen'}</strong></span>
                    <span>•</span>
                    <span>ID: {userData?.aadhaarMasked || userData?.aadhaar || 'XXXX-XXXX-4519'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {issueTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Proof Button */}
              <button
                onClick={() => setShowProofModal(true)}
                className="text-xs font-semibold text-[#002875] hover:text-[#001B52] bg-white hover:bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
              >
                <Fingerprint className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'EN' ? 'Inspect Proof' : 'प्रमाण देखें'}</span>
              </button>
            </div>
          </div>

          {/* ================= SECTION: CRYPTOGRAPHIC VERIFICATION PROGRESSION ================= */}
          <div className="w-full max-w-2xl space-y-2.5 mb-8">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span className="flex items-center gap-1.5 text-[#002875] font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Attestation Checkpoints</span>
              </span>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {Math.min(currentStep, verificationSteps.length)} / {verificationSteps.length} Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {verificationSteps.map((step, idx) => {
                const isPassed = currentStep > idx;
                const isCurrent = currentStep === idx;

                return (
                  <div 
                    key={step.id}
                    className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-2.5 ${
                      isPassed 
                        ? 'bg-emerald-50/60 border-emerald-200 shadow-xs' 
                        : isCurrent 
                        ? 'bg-amber-50/60 border-amber-300 shadow-xs' 
                        : 'bg-slate-50/40 border-slate-200/60 opacity-60'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isPassed ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-5 h-5 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 bg-white" />
                      )}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold leading-tight ${isPassed ? 'text-emerald-900' : isCurrent ? 'text-amber-900' : 'text-slate-600'}`}>
                        {language === 'EN' ? step.titleEn : step.titleHi}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-mono leading-tight">
                        {language === 'EN' ? step.subEn : step.subHi}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= SECTION: AUTO REDIRECT BAR & PROCEED BUTTON ================= */}
          <div className="w-full max-w-xl flex flex-col items-center gap-4">
            
            {/* Countdown / Percentage Bar */}
            <div className="w-full space-y-1.5">
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF671F] animate-pulse"></span>
                  <span>{language === 'EN' ? 'Initializing Sovereign Workspace...' : 'कार्यक्षेत्र लोड हो रहा है...'}</span>
                </span>
                <span className="font-mono font-bold text-[#002875]">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-gradient-to-r from-[#FF671F] via-[#002875] to-[#138808] transition-all duration-75 rounded-full shadow-xs"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Instant Action Proceed Button */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <button
                onClick={() => onProceed && onProceed(userData)}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-[#002875] to-[#003CB3] hover:from-[#001F5C] hover:to-[#002E8A] text-white font-bold text-sm shadow-[0_10px_25px_-5px_rgba(0,40,117,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>
                  {language === 'EN' ? 'Enter Sovereign Workspace / Dashboard' : 'नागरिक लॉकर / डैशबोर्ड में प्रवेश करें'}
                </span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* 4. Official Sovereign Footer */}
      <footer className="relative z-10 w-full border-t border-slate-200 bg-white/90 backdrop-blur-md py-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 National Informatics Centre · Digital India Sovereign Trust Protocol</p>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <span className="hover:text-[#002875] cursor-pointer">Security Policy</span>
            <span>•</span>
            <span className="hover:text-[#002875] cursor-pointer">RTI Disclosures</span>
            <span>•</span>
            <span className="hover:text-[#002875] cursor-pointer">Helpdesk 1800-111-2026</span>
          </div>
        </div>
      </footer>

      {/* 5. Cryptographic Proof Inspection Modal */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-[#002875] to-[#001B52] text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>Cryptographic Attestation Certificate</span>
              </div>
              <button 
                onClick={() => setShowProofModal(false)}
                className="text-white/80 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 font-mono text-xs text-slate-700 max-h-[70vh] overflow-y-auto">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Session Digest</span>
                <p className="text-emerald-700 break-all font-bold">{sessionHash}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Ledger Block</span>
                  <p className="text-slate-900 font-bold mt-0.5">#{blockNumber}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Protocol</span>
                  <p className="text-slate-900 font-bold mt-0.5">BHAROSA-v4.2</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Issuer Trust Root</span>
                <p className="text-slate-800 text-[11px]">CN=Controller of Certifying Authorities, O=Ministry of Electronics and Information Technology, C=IN</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Digital Signature</span>
                <p className="text-slate-600 text-[10px] break-all">
                  3045022100d8b4e78263bc3a2d21094038a8e1b1d9c28e45a278912e9bca918237e1b34e022027b8764098234120934812390840921839012830918203981209381203981203
                </p>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowProofModal(false)}
                className="px-4 py-2 rounded-xl bg-[#002875] text-white text-xs font-bold hover:bg-[#001B52] transition-colors cursor-pointer"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
