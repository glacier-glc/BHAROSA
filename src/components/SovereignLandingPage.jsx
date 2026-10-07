import React, { useState, useEffect, useRef } from 'react';
import AshokEmblem from './AshokEmblem';
import AshokaChakra from './AshokaChakra';
import TricolorRiverCanvas from './TricolorRiverCanvas';
import './SovereignLandingPage.css';

// SVG Icon Helper
const ICONS = {
  sig: <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z M9 12l2 2 4-4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  hash: <path d="M5 9h14M5 15h14M10 4L8 20M16 4l-2 16" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  qr: <path d="M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h3v3h-3z M20 14v3 M14 20h7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  rev: <path d="M12 3a9 9 0 100 18 9 9 0 000-18z M5.6 5.6l12.8 12.8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  vault: <path d="M4 10h16v10H4z M8 10V7a4 4 0 018 0v3 M12 14v2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  audit: <path d="M5 6h14M5 12h14M5 18h8 M18 18m-2.5 0a2.5 2.5 0 105 0 2.5 2.5 0 10-5 0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  edu: <path d="M2 9l10-5 10 5-10 5z M6 11.5V16c3 2.5 9 2.5 12 0v-4.5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  health: <path d="M3 3h18v18H3z M12 8v8 M8 12h8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  pro: <path d="M3 7h18v13H3z M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2 M3 13h18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  gov: <path d="M3 10l9-6 9 6 M5 10v8 M9 10v8 M15 10v8 M19 10v8 M3 20h18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
};

function SvgIcon({ name, size = 22, className = '' }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      width={size} 
      height={size} 
      stroke="currentColor" 
      fill="none" 
      className={className} 
      aria-hidden="true"
    >
      {ICONS[name] || null}
    </svg>
  );
}

// Procedural QR SVG Generator
function generateQrSvg(seed, n = 25) {
  let h = 2166136261;
  for (const c of seed) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  const rnd = () => {
    h |= 0;
    h = (h + 0x6D2B79F5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const inF = (x, y) => (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
  let rects = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!inF(x, y) && rnd() > 0.5) {
        rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />);
      }
    }
  }
  const frame = (ox, oy) => (
    <g key={`frame-${ox}-${oy}`}>
      <path fillRule="evenodd" d={`M${ox} ${oy}h7v7h-7zM${ox + 1} ${oy + 1}h5v5h-5z`} fill="currentColor" />
      <rect x={ox + 2} y={oy + 2} width="3" height="3" fill="currentColor" />
    </g>
  );
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} fill="currentColor" shapeRendering="crispEdges" aria-hidden="true" className="w-full h-full">
      {rects}
      {frame(0, 0)}
      {frame(n - 7, 0)}
      {frame(0, n - 7)}
    </svg>
  );
}

const ENGINE_MODULES = [
  { k: 'sig', t: 'Digital Signature', d: 'Cryptographic proof minted with ECDSA P-256 HSM keys certifying that the credential was legitimately issued by an accredited authority.', w: 'Applied at the Sign & Mint stage after the authority reviews and seals the applicant proof.' },
  { k: 'hash', t: 'SHA-256 Merkle Hash', d: 'Generates an immutable mathematical fingerprint of every byte in the credential document to immediately flag any alteration.', w: 'Checked on-the-fly whenever a verifier inputs a hash or inspects a document.' },
  { k: 'qr', t: 'QR & Certificate ID', d: 'Human-readable and machine-scannable identifiers carrying signed cryptographic proof payload for instant field verification.', w: 'Primary entry point for employers, border control officers, and academic verifiers.' },
  { k: 'rev', t: 'Revocation Registry', d: 'Dynamic sovereign registry tracking credential status changes, disciplinary actions, suspensions, and expirations in real time.', w: 'Authorities trigger status changes with immediate propagation across all national verifiers.' },
  { k: 'vault', t: 'Nagrik Sovereign Vault', d: 'Citizen-controlled encrypted repository with zero-knowledge selective disclosure and secure delegation.', w: 'Permanent home where citizens store, organize, share, and track all lifetime credentials.' },
  { k: 'audit', t: 'Immutable Audit Trail', d: 'Cryptographically chained log tracking every issuance, verification ping, renewal, and revocation event.', w: 'Maintains total transparency, RTI compliance, and anti-fraud monitoring for all government stakeholders.' }
];

const LIFECYCLE_STATES = [
  { t: 'Issued', c: '#002875', chip: 'info', d: 'An accredited sovereign authority scrutinizes eligibility, issues approval, and applies an ECDSA HSM digital signature with a unique certificate ID and QR code.' },
  { t: 'Active', c: '#0D6838', chip: 'ok', d: 'The credential safely rests in the citizen’s Nagrik Vault, verifiable by any entity worldwide with 100% cryptographic validity.' },
  { t: 'Shared', c: '#0284C7', chip: 'info', d: 'Citizen securely shares selective disclosure proofs with employers, universities, or banks via QR code, link, or digitally sealed PDF.' },
  { t: 'Renewed', c: '#FF671F', chip: 'warn', d: 'Periodic re-accreditation or re-licensing occurs; new validity timestamps are cryptographically appended to the existing immutable audit record.' },
  { t: 'Revoked / Expired', c: '#DC2626', chip: 'warn', d: 'Upon misconduct, license invalidation, or term expiry, the issuing authority immediately flags the status. Any verifier instantly sees the invalidation.' }
];

const VAULT_ITEMS = [
  { ic: 'edu', t: 'B.Tech Degree in Computer Science', iss: 'IIT Delhi Academic Council', st: 'Active', sh: true, date: '14 Jun 2025', ver: 'ECDSA Valid · Merkle Matched', id: 'BHR-EDU-2025-004871' },
  { ic: 'health', t: 'Sovereign Medical Practitioner License', iss: 'National Medical Commission', st: 'Active', sh: false, date: '02 Nov 2025', ver: 'Valid · Good Standing', id: 'BHR-HLT-2025-001392' },
  { ic: 'pro', t: 'Bar Council Advocacy License', iss: 'Bar Council of India', st: 'Expired', sh: false, date: '08 Jan 2023', ver: 'Signature valid · Renewal due', id: 'BHR-PRO-2023-000508' },
  { ic: 'gov', t: 'Nil-Encumbrance Property Deed', iss: 'Sub-Registrar IV, Revenue Dept', st: 'Active', sh: true, date: '21 Mar 2026', ver: 'Verified · Merkle Sealed', id: 'BHR-GOV-2026-002217' }
];

const CHAIN_STAGES = [
  { k: 'TRUST', t: 'Cryptographic Proof', d: 'Mathematical certainty replacing easily forgeable paper signatures.' },
  { k: 'SPEED', t: 'Instant Verification', d: 'Sub-500ms validation via secure QR, Certificate ID, or PDF hash.' },
  { k: 'ACCESS', t: 'Citizen Self-Sovereignty', d: 'Nagrik Vault puts citizens in total control of lifetime credentials.' },
  { k: 'TRANSPARENCY', t: 'Auditable Lifecycle', d: 'Immutable audit trail with real-time revocation registry.' },
  { k: 'SCALE', t: 'Multi-Sector Infrastructure', d: 'Unified standard spanning Education, Healthcare, Revenue, and Trade.' }
];

export default function SovereignLandingPage({ onOpenAuth, onQuickDemoLogin, onOpenVerifier }) {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // River Showcase State
  const [riverSpeed, setRiverSpeed] = useState(1.0);
  const [riverWheelSpeed, setRiverWheelSpeed] = useState('normal');

  // Trust Engine State
  const [activeEngineModule, setActiveEngineModule] = useState(0);

  // Lifecycle State
  const [activeLifecycle, setActiveLifecycle] = useState(1);

  // Verifier Demo State
  const [certIdInput, setCertIdInput] = useState('');
  const [pdfHashInput, setPdfHashInput] = useState('');
  const [verifySteps, setVerifySteps] = useState([]);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // MARG Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Namaste! I am MARG, your sovereign trust guide. How can I help you navigate BHAROSA certificates, required proofs, or instant verification today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatWaiting, setChatWaiting] = useState(false);
  const [floatingChatOpen, setFloatingChatOpen] = useState(false);
  const chatLogRef = useRef(null);

  // Nagrik Vault Filter
  const [vaultFilter, setVaultFilter] = useState('all');
  const [qrModalItem, setQrModalItem] = useState(null);

  // ================= PORTAL'S MAIN AIM: ZERO REJECTION AUTO-FIT SIMULATOR =================
  const [selectedAimDoc, setSelectedAimDoc] = useState('photo'); // 'photo' | 'signature' | 'marksheet'
  const [aimAutoFitState, setAimAutoFitState] = useState('completed'); // 'idle' | 'processing' | 'completed'
  const [aimProgressStage, setAimProgressStage] = useState(4);
  const [aimConflictChoice, setAimConflictChoice] = useState('Aarav Sharma');

  const handleRunAimAutoFit = (docType) => {
    const doc = docType || selectedAimDoc;
    setSelectedAimDoc(doc);
    setAimAutoFitState('processing');
    setAimProgressStage(1);
    setTimeout(() => {
      setAimProgressStage(2);
      setTimeout(() => {
        setAimProgressStage(3);
        setTimeout(() => {
          setAimProgressStage(4);
          setTimeout(() => {
            setAimAutoFitState('completed');
          }, 300);
        }, 400);
      }, 400);
    }, 300);
  };

  // Canvas Ref
  const canvasRef = useRef(null);
  const credBoxRef = useRef(null);
  const credRef = useRef(null);

  // Auto-fill sample verification data
  const handleFillSample = () => {
    setCertIdInput('BHR-EDU-2026-000123');
    setPdfHashInput('9f2c1a7e4b63d08a5c1e97f3b20d46a8e15c7b9023fa64d18e0b5c3a7d92f641');
  };

  const handleRunVerify = (e) => {
    if (e) e.preventDefault();
    if (isVerifying) return;
    setIsVerifying(true);
    setVerificationResult(null);

    const targetId = certIdInput.trim() || 'BHR-EDU-2026-000123';
    const names = [
      'Querying National Node Registry',
      'Checking Authority ECDSA P-256 Signature',
      'Matching SHA-256 Merkle Hash Fingerprint',
      'Validating Real-Time Revocation Registry'
    ];

    setVerifySteps([{ name: names[0], status: 'run' }]);

    let stepIdx = 0;
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < names.length) {
        setVerifySteps(prev => [
          ...prev.slice(0, stepIdx - 1),
          { ...prev[stepIdx - 1], status: 'ok' },
          { name: names[stepIdx], status: 'run' }
        ]);
      } else {
        clearInterval(interval);
        setVerifySteps(names.map(n => ({ name: n, status: 'ok' })));
        setTimeout(() => {
          setVerificationResult({
            id: targetId,
            status: 'ACTIVE',
            issuer: 'IIT Delhi Academic Council',
            sig: 'ECDSA P-256 VALID',
            hash: 'EXACT MATCH',
            audit: '100% UNTAMPERED'
          });
          setIsVerifying(false);
        }, 300);
      }
    }, 450);
  };

  // MARG Chat Handler
  const handleSendChat = (questionText) => {
    const q = (questionText || chatInput).trim();
    if (!q) return;

    setChatMessages(prev => [...prev, { sender: 'me', text: q }]);
    setChatInput('');
    setChatWaiting(true);

    setTimeout(() => {
      let ans = 'I am trained on the BHAROSA Sovereign Documentation. You can ask about document verification, eligibility proofs, Tatkal emergency issuance, or Nagrik Vault storage!';
      const lq = q.toLowerCase();
      if (lq.includes('document') || lq.includes('proof') || lq.includes('upload') || lq.includes('need')) {
        ans = 'Required documents depend on the service sector. For Education: previous marksheets & student ID. For Land & Revenue: deed copy and survey number. For Healthcare: registration council certificate. MARG automatically assists you during the upload phase!';
      } else if (lq.includes('verif') || lq.includes('check') || lq.includes('valid') || lq.includes('genuine')) {
        ans = 'You can verify any BHAROSA certificate instantly using 3 methods: (1) Scan the QR code with any smartphone camera, (2) Enter the unique Certificate ID in our verifier, or (3) Upload the PDF file to compute and compare its SHA-256 hash.';
      } else if (lq.includes('where') || lq.includes('stor') || lq.includes('vault') || lq.includes('keep')) {
        ans = 'All issued credentials automatically deposit into your personal Nagrik Sovereign Vault. You retain full self-sovereign control to share, delegate, download, or revoke access at any time.';
      } else if (lq.includes('work') || lq.includes('bharosa') || lq.includes('what is') || lq.includes('explain')) {
        ans = 'BHAROSA follows a 4-pillar sovereign trust cycle: Issue → Store → Share → Verify. Accredited authorities cryptographically sign credentials, which enter the citizen’s Nagrik Vault. Anyone can verify them in sub-500ms with zero forged papers.';
      } else if (lq.includes('tatkal') || lq.includes('urgent') || lq.includes('emergency')) {
        ans = 'Tatkal mode is a prioritized 4-hour emergency turnaround mechanism for urgent hospital admissions, international visa deadlines, and judicial bails, secured by accelerated HSM queues.';
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: ans }]);
      setChatWaiting(false);
      if (chatLogRef.current) {
        chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
      }
    }, 600);
  };

  // Particles Canvas & Scroll Effects
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? y / max : 0);
      setNavScrolled(y > 24);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Particle canvas initialization (light theme: Ashoka navy & saffron nodes)
    const cv = canvasRef.current;
    if (cv) {
      const ctx = cv.getContext('2d');
      let w = (cv.width = window.innerWidth);
      let h = (cv.height = window.innerHeight);
      let raf;
      const count = Math.min(Math.round((w * h) / 19000), 55);
      const pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32
      }));

      const render = () => {
        ctx.clearRect(0, 0, w, h);
        for (const p of pts) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }

        for (let i = 0; i < pts.length; i++) {
          const a = pts[i];
          for (let j = i + 1; j < pts.length; j++) {
            const b = pts[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = dx * dx + dy * dy;
            if (dist < 19600) {
              ctx.strokeStyle = `rgba(0, 40, 117, ${(1 - dist / 19600) * 0.16})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
          ctx.fillStyle = i % 3 === 0 ? 'rgba(255, 103, 31, 0.65)' : 'rgba(0, 40, 117, 0.45)';
          ctx.beginPath();
          ctx.arc(a.x, a.y, 1.8, 0, 6.283);
          ctx.fill();
        }
        raf = requestAnimationFrame(render);
      };

      render();

      const handleResize = () => {
        w = cv.width = window.innerWidth;
        h = cv.height = window.innerHeight;
      };
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3D Tilt Card PointerMove
  const handleCardMouseMove = (e) => {
    if (!credRef.current) return;
    const r = credRef.current.getBoundingClientRect();
    const ry = (((e.clientX - r.left) / r.width) - 0.5) * 12;
    const rx = -(((e.clientY - r.top) / r.height) - 0.5) * 12;
    credRef.current.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
    credRef.current.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
  };

  const handleCardMouseLeave = () => {
    if (!credRef.current) return;
    credRef.current.style.setProperty('--ry', '0deg');
    credRef.current.style.setProperty('--rx', '0deg');
  };

  const filteredVault = VAULT_ITEMS.filter(item => {
    if (vaultFilter === 'active') return item.st === 'Active';
    if (vaultFilter === 'expired') return item.st === 'Expired';
    if (vaultFilter === 'shared') return item.sh;
    return true;
  });

  return (
    <div className="bharosa-landing">
      {/* Scroll Progress Bar (Tricolor) */}
      <div className="bl-progress" style={{ transform: `scaleX(${scrollProgress})` }} role="presentation" />

      {/* Ambient Pearl Government Background */}
      <div className="bl-bg" aria-hidden="true">
        <div className="bl-bg-grid" />
        <div className="bl-bg-glow a" />
        <div className="bl-bg-glow b" />
        <div className="bl-bg-glow c" />
      </div>

      {/* Official India.gov.in Top Utility Strip */}
      <div className="bl-top-utility">
        <div className="bl-container bl-top-utility-in">
          <div className="bl-gov-badge">
            <div className="bl-flag-icon" aria-label="Flag of India">
              <span></span><span></span><span></span>
            </div>
            <span>भारत सरकार | Government of India</span>
            <span className="hidden sm:inline text-xs text-slate-600 font-medium">
              | Ministry of Electronics &amp; Information Technology (MeitY)
            </span>
          </div>
          <div className="bl-top-tools">
            <div className="bl-accessibility-controls" aria-label="Font Resizing">
              <button type="button" className="bl-font-btn" title="Decrease font size">A-</button>
              <button type="button" className="bl-font-btn" title="Default font size">A</button>
              <button type="button" className="bl-font-btn" title="Increase font size">A+</button>
            </div>
            <span className="text-slate-300">|</span>
            <button type="button" className="text-xs font-bold text-[#002875] hover:text-[#ff671f] transition-colors cursor-pointer">
              English / हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Sovereign Header Navigation */}
      <header className={`bl-nav ${navScrolled ? 'scrolled' : ''}`}>
        <div className="bl-container bl-nav-in">
          <a className="bl-logo" href="#home" aria-label="BHAROSA home">
            <div className="bl-logo-symbol">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <path d="M16 2l11 4v9c0 7-4.7 12-11 15C9.7 27 5 22 5 15V6z" stroke="#002875" strokeWidth="2.2" />
                <path d="M11 16.5l3.5 3.5L21.5 12" stroke="#0D6838" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="bl-logo-text">
              <b>BHAROSA</b>
              <small>Bharat Sovereign Trust</small>
            </div>
          </a>

          <nav aria-label="Primary Navigation">
            <ul className={`bl-navlinks ${mobileMenuOpen ? 'open' : ''}`}>
              <li><a href="#home" className="active">Home</a></li>
              <li><a href="#main-aim" className="text-[#002875] font-extrabold flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-300"><span>🎯</span> Main Aim: Auto-Fit</a></li>
              <li><a href="#sovereign-river" className="text-[#FF671F] font-bold">🇮🇳 River of Trust</a></li>
              <li><a href="#problem">Problem</a></li>
              <li><a href="#solution">Architecture</a></li>
              <li><a href="#engine">Trust Engine</a></li>
              <li><a href="#how">How It Works</a></li>
              <li><a href="#verify">Verify</a></li>
              <li><a href="#vault">Nagrik Vault</a></li>
              <li><a href="#impact">Impact</a></li>
              <li><a href="#team">Team</a></li>
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a href="#verify" className="bl-btn sm">
              Verify
            </a>
            <button 
              onClick={() => onOpenAuth ? onOpenAuth() : null}
              className="bl-btn portal font-bold flex items-center gap-1.5"
            >
              <span>🏛️ Sovereign Login</span>
            </button>
            <button 
              className="bl-burger" 
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle Navigation"
            >
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="bl-hero relative overflow-hidden" id="home">
        {/* Dynamic Flowing Vibrant Tricolor River in Hero Background */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-85 overflow-hidden">
          <TricolorRiverCanvas opacity={0.8} speedMultiplier={1.05} showParticles={true} />
        </div>
        <canvas ref={canvasRef} id="heroCanvas" aria-hidden="true" style={{ opacity: 0.25, zIndex: 1 }} />
        <div className="bl-container bl-hero-in relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="bl-sovereign-tag !mb-0 font-bold bg-amber-50 text-amber-900 border border-amber-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF671F" strokeWidth="2.4">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                🎯 MAIN AIM: ZERO FORM REJECTION ACROSS ALL BHARAT PORTALS
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50/90 border border-amber-300 text-[11px] font-bold text-amber-900 shadow-xs">
                <AshokaChakra size={15} speed="normal" color="#002875" />
                <span>Ashoka Chakra Active</span>
              </div>
            </div>

            <h1 className="bl-brand" aria-label="BHAROSA">
              <span style={{ '--i': 0 }}>B</span>
              <span style={{ '--i': 1 }}>H</span>
              <span style={{ '--i': 2 }}>A</span>
              <span style={{ '--i': 3 }}>R</span>
              <span style={{ '--i': 4 }}>O</span>
              <span style={{ '--i': 5 }}>S</span>
              <span style={{ '--i': 6 }}>A</span>
            </h1>

            <p className="sub">Bharat Hub for Records, Online Security &amp; Authentication</p>
            <p className="desc">
              India's first sovereign national platform dedicated to a single flagship mission: <strong>Zero-Rejection Application Filing</strong>. Powered by an automated client-side Auto-Fit Engine for compliant photo/signature sizing and an authoritative Smart Auto-Fill Locker with Merkle cryptographic proofs.
            </p>

            <div className="bl-cta-row">
              <a className="bl-btn primary font-bold flex items-center gap-2 shadow-md" href="#main-aim">
                <span>🎯</span> Experience Main Aim: Auto-Fit Simulator
              </a>
              <a className="bl-btn" href="#verify">
                Verify a Credential
              </a>
              <a className="bl-btn gold" href="#vault">
                Nagrik Vault Demo
              </a>
            </div>

            {/* Quick Demo Persona Launcher Strip (India.gov.in Light Style) */}
            <div className="mt-6 p-3 rounded-2xl bg-white/95 border border-slate-200 shadow-sm flex flex-wrap items-center gap-2 max-w-xl">
              <span className="text-xs font-mono text-[#002875] font-bold">1-CLICK DEMO ACCESS:</span>
              <button 
                onClick={() => onQuickDemoLogin && onQuickDemoLogin('citizen')}
                className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs text-[#002875] font-semibold hover:bg-blue-100 transition-all cursor-pointer"
              >
                Citizen (Aarav)
              </button>
              <button 
                onClick={() => onQuickDemoLogin && onQuickDemoLogin('authority')}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-[#0D6838] font-semibold hover:bg-emerald-100 transition-all cursor-pointer"
              >
                Authority (Registrar)
              </button>
              <button 
                onClick={() => onQuickDemoLogin && onQuickDemoLogin('admin')}
                className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs text-[#C2410C] font-semibold hover:bg-amber-100 transition-all cursor-pointer"
              >
                MeitY Admin
              </button>
            </div>

            <p className="bl-chainline">
              Issue <b>→</b> Store <b>→</b> Share <b>→</b> Instant Verify
            </p>
          </div>

          {/* 3D Holographic Credential with Traveling Light Rail */}
          <div className="bl-hero-visual">
            <ol className="bl-rail" aria-label="BHAROSA Trust Chain">
              <li>ACCREDITED AUTHORITY</li>
              <li>DIGITALLY SIGNED MERKLE</li>
              <li>NAGRIK SOVEREIGN VAULT</li>
              <li>QR / CERT ID / SHA-256</li>
              <li>CRYPTOGRAPHICALLY VERIFIED</li>
            </ol>

            <div 
              className="bl-credwrap" 
              ref={credBoxRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <article className="bl-cred" ref={credRef} aria-label="Sample BHAROSA Verified Digital Certificate">
                <div className="bl-cred-top">
                  <div className="bl-cred-top-brand">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M7.5 12.5l3 3 6-6.5" />
                    </svg>
                    BHAROSA VERIFIED
                  </div>
                  <span className="bl-chip ok"><i></i>ACTIVE</span>
                </div>

                <h3>Digital Degree Certificate</h3>
                <p className="cid">BHR-EDU-2026-000123 · Sovereign Mint</p>

                <dl>
                  <div><dt>Issuer Authority</dt><dd>IIT Delhi Academic Council</dd></div>
                  <div><dt>SHA-256 Merkle Hash</dt><dd className="hash">9f2c1a7e4b63d08a…92f641</dd></div>
                  <div><dt>Digital Signature</dt><dd>ECDSA P-256 Valid</dd></div>
                  <div><dt>Verification Status</dt><dd style={{ color: 'var(--sovereign-green)' }}>Authenticity Guaranteed</dd></div>
                </dl>

                <div className="bl-cred-foot">
                  <div className="w-[66px] h-[66px] p-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 shadow-sm">
                    {generateQrSvg('BHR-EDU-2026-000123')}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--faint)', fontFamily: 'var(--mono)' }}>MINTED 2026</div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--chakra-navy)' }}>Zero-Knowledge Proof</div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PORTAL MAIN AIM: ZERO-REJECTION APPLICATION FILING ================= */}
      <section className="bl-sec bg-gradient-to-b from-[#f8fafc] via-white to-[#f1f5f9] border-y border-[#002875]/10" id="main-aim">
        <div className="bl-container">
          
          {/* Section Header */}
          <div className="bl-head text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold tracking-wider uppercase mb-4 shadow-xs">
              <AshokaChakra size={16} speed="normal" color="#002875" />
              <span>🎯 PRIMARY MANDATE • मुख्य उद्देश्य: शून्य अस्वीकृति</span>
            </div>
            
            <h2 className="bl-title !max-w-none text-2xl sm:text-4xl font-extrabold text-[#002875] tracking-tight">
              Main Aim of BHAROSA: Zero-Rejection Application Filing
            </h2>
            
            <p className="bl-lede !max-w-3xl mx-auto text-sm sm:text-base text-slate-700 leading-relaxed mt-3">
              In India, over <strong>91% of online citizen application rejections</strong> across UPSC, SSC, State PSC, NTA, University Admissions, and Driving License portals are not caused by ineligibility, but by <strong>technical upload failures</strong>: wrong pixel dimensions (200×230 px required, smartphone photo uploaded), oversized signatures (10–20 KB), or subtle name variations across certificates.
            </p>
            <p className="text-xs sm:text-sm text-[#0D6838] font-bold mt-2">
              ✓ BHAROSA solves this permanently with 100% Client-Side Auto-Fit and Sovereign Smart Auto-Fill. Zero Server Uploads. Zero Data Leakage.
            </p>
          </div>

          {/* 3 Core Pillars of Zero Rejection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#002875] flex items-center justify-center font-bold text-xl mb-4 border border-blue-200">
                📁
              </div>
              <span className="text-[10px] font-mono uppercase text-blue-700 font-bold tracking-wider">PILLAR 01</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">My Documents Locker</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload proofs once. Every file is sealed with an authentic SHA-256 Merkle fingerprint, ready to instantly auto-populate any state or national form without repetitive uploads.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-[#002875] font-semibold">
                <span>✓ Sovereign Merkle tracking</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border-2 border-emerald-500/30 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-bold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
                CORE INNOVATION
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0D6838] flex items-center justify-center font-bold text-xl mb-4 border border-emerald-200">
                ⚡
              </div>
              <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold tracking-wider">PILLAR 02</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">Client-Side Auto-Fit Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smart bicubic scaling locks exact aspect ratios (200×230 px photo, 140×60 px signature), while stepping compression (0.92 → 0.4) guarantees 20–50 KB compliance entirely in browser memory.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-[#0D6838] font-semibold">
                <span>🔒 100% Private · Zero server upload</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xl mb-4 border border-amber-200">
                ✍️
              </div>
              <span className="text-[10px] font-mono uppercase text-amber-700 font-bold tracking-wider">PILLAR 03</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">Smart Auto-Fill &amp; Conflicts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Auto-populates 6+ fields from verified credentials. Never silently assumes conflicting names; presents dual-choice resolution with confidence scores and explicit citizen consent audit logging.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-amber-800 font-semibold">
                <span>⚖️ Citizen-guided conflict choice</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Auto-Fit Simulator Studio */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden relative">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#002875] text-xs font-bold border border-blue-200 mb-2">
                  <span>⚡ LIVE CLIENT-SIDE SIMULATOR</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#002875]">
                  Test the Zero-Rejection Auto-Fit Engine
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select a commonly rejected raw citizen upload below and watch BHAROSA transform it to 100% government portal compliance in real-time.
                </p>
              </div>

              {/* Sample Document Selector Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRunAimAutoFit('photo')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedAimDoc === 'photo'
                      ? 'bg-[#002875] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>📸 3.4 MB Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRunAimAutoFit('signature')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedAimDoc === 'signature'
                      ? 'bg-[#002875] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>✍️ 680 KB Signature</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRunAimAutoFit('marksheet')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedAimDoc === 'marksheet'
                      ? 'bg-[#002875] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>📑 6.2 MB PDF Scan</span>
                </button>
              </div>
            </div>

            {/* Stepper Pipeline Visualizer */}
            <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-3">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Pipeline Execution: Client-Side Web Crypto &amp; Canvas</span>
                </span>
                <span className="font-mono text-[#002875]">Status: {aimAutoFitState.toUpperCase()}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                  aimProgressStage >= 1 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  <span>{aimProgressStage >= 1 ? '✓' : '1.'}</span>
                  <span>Magic Bytes Check</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                  aimProgressStage >= 2 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  <span>{aimProgressStage >= 2 ? '✓' : '2.'}</span>
                  <span>Aspect-Ratio Lock</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                  aimProgressStage >= 3 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  <span>{aimProgressStage >= 3 ? '✓' : '3.'}</span>
                  <span>Stepping Quality (0.92→0.65)</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                  aimProgressStage >= 4 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  <span>{aimProgressStage >= 4 ? '✓' : '4.'}</span>
                  <span>SHA-256 Merkle Seal</span>
                </div>
              </div>
            </div>

            {/* Split View Comparison: Raw Upload vs BHAROSA Auto-Fitted */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* BEFORE: Raw Rejected Citizen Upload */}
              <div className="p-5 rounded-2xl bg-rose-50/70 border-2 border-rose-300 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-200 text-rose-900 text-xs font-extrabold">
                    <span>❌</span>
                    <span>RAW CITIZEN UPLOAD — PORTAL REJECTED</span>
                  </span>
                  <span className="text-[11px] font-mono text-rose-700 font-semibold">Standard Portal Failure</span>
                </div>

                <div className="space-y-3">
                  <div className="h-44 rounded-xl bg-white border border-rose-200 p-4 flex flex-col items-center justify-center text-center">
                    {selectedAimDoc === 'photo' && (
                      <div className="space-y-2">
                        <div className="w-24 h-24 mx-auto rounded-xl bg-slate-200 border-2 border-dashed border-rose-400 flex items-center justify-center text-3xl">
                          📸
                        </div>
                        <p className="text-xs font-bold text-slate-800">IMG_20261003_142109.jpg (Camera Selfie)</p>
                        <p className="text-[11px] text-rose-600 font-mono font-bold">4032 × 3024 px • 3.4 MB (3,481 KB)</p>
                      </div>
                    )}

                    {selectedAimDoc === 'signature' && (
                      <div className="space-y-2">
                        <div className="w-32 h-14 mx-auto rounded-lg bg-slate-100 border-2 border-dashed border-rose-400 flex items-center justify-center font-serif italic text-lg text-slate-700">
                          Aarav Sharma
                        </div>
                        <p className="text-xs font-bold text-slate-800">Phone_Scan_Signature.png (Desk Shadow)</p>
                        <p className="text-[11px] text-rose-600 font-mono font-bold">1200 × 500 px • 680 KB</p>
                      </div>
                    )}

                    {selectedAimDoc === 'marksheet' && (
                      <div className="space-y-2">
                        <div className="w-20 h-24 mx-auto rounded-lg bg-slate-100 border-2 border-dashed border-rose-400 flex items-center justify-center text-2xl">
                          📑
                        </div>
                        <p className="text-xs font-bold text-slate-800">Marksheet_Color_600DPI.pdf</p>
                        <p className="text-[11px] text-rose-600 font-mono font-bold">12 Pages • 6.2 MB PDF</p>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-rose-200 text-xs space-y-1">
                    <p className="font-bold text-rose-800 flex items-center gap-1">
                      <span>⚠️ Statutory Deficiencies Identified:</span>
                    </p>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                      {selectedAimDoc === 'photo' && (
                        <>
                          <li>Size 3.4 MB exceeds strict 50 KB national ceiling (Error S02)</li>
                          <li>Aspect ratio 1.33 does not match required 200×230 px (Error D01)</li>
                          <li>Color temperature uneven with natural indoor shadows</li>
                        </>
                      )}
                      {selectedAimDoc === 'signature' && (
                        <>
                          <li>Size 680 KB exceeds 20 KB signature ceiling (Error S01)</li>
                          <li>Dimensions 1200×500 px violates 140×60 px portal slot</li>
                          <li>Paper background is gray (#d4d4d8) instead of pure white</li>
                        </>
                      )}
                      {selectedAimDoc === 'marksheet' && (
                        <>
                          <li>File size 6.2 MB exceeds standard 2.0 MB maximum</li>
                          <li>Page count (12) violates 5-page single document ceiling</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* AFTER: BHAROSA Auto-Fitted Guaranteed Compliance */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-400 relative shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-200 text-emerald-950 text-xs font-extrabold">
                    <span>✅</span>
                    <span>BHAROSA AUTO-FITTED — 100% COMPLIANT</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-800 font-bold">Ready to Submit</span>
                </div>

                <div className="space-y-3">
                  <div className="h-44 rounded-xl bg-white border border-emerald-200 p-4 flex flex-col items-center justify-center text-center shadow-xs">
                    {selectedAimDoc === 'photo' && (
                      <div className="space-y-2">
                        <div className="w-[100px] h-[115px] mx-auto rounded-lg bg-emerald-50 border-2 border-emerald-500 shadow-sm flex items-center justify-center text-4xl relative overflow-hidden">
                          <span>👨‍💼</span>
                          <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[9px] font-mono py-0.5 font-bold">200×230</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900">Aarav_Passport_Photo_AutoFit.jpg</p>
                        <p className="text-[11px] text-emerald-700 font-mono font-bold">200 × 230 px • 34.8 KB (Compliant: 20–50 KB)</p>
                      </div>
                    )}

                    {selectedAimDoc === 'signature' && (
                      <div className="space-y-2">
                        <div className="w-[140px] h-[60px] mx-auto rounded-lg bg-white border-2 border-emerald-500 shadow-sm flex items-center justify-center font-serif italic text-base text-[#002875] relative">
                          <span>Aarav Sharma</span>
                          <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[8px] font-mono py-0.2 font-bold">140×60</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900">Aarav_Signature_AutoFit.jpg</p>
                        <p className="text-[11px] text-emerald-700 font-mono font-bold">140 × 60 px • 14.2 KB (Compliant: 10–20 KB)</p>
                      </div>
                    )}

                    {selectedAimDoc === 'marksheet' && (
                      <div className="space-y-2">
                        <div className="w-20 h-24 mx-auto rounded-lg bg-emerald-50 border-2 border-emerald-500 shadow-sm flex items-center justify-center text-2xl relative">
                          <span>📑</span>
                          <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[8px] font-mono py-0.2 font-bold">A4 PDF</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900">Consolidated_Marksheet_AutoFit.pdf</p>
                        <p className="text-[11px] text-emerald-700 font-mono font-bold">Standard A4 • 1.1 MB (Compliant: &lt; 2 MB)</p>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-emerald-200 text-xs space-y-1">
                    <p className="font-bold text-emerald-900 flex items-center gap-1">
                      <span>✓ Auto-Fit Operations Applied:</span>
                    </p>
                    <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
                      <li>Bicubic smart center-crop locked to government aspect ratio</li>
                      <li>Stepping JPEG compression reduced payload by <strong>99.0%</strong></li>
                      <li>Calculated cryptographic SHA-256: <code className="text-[#002875] font-mono">e83c21a4f028...</code></li>
                      <li className="text-emerald-700 font-semibold">100% processed in local browser memory — zero server uploads</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            {/* Interactive Conflict Resolver & Consent Banner Demo */}
            <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Conflict Resolver Card */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-2">
                  <span>⚖️ SMART AUTO-FILL NAME CONFLICT RESOLVER</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  BHAROSA never silently assumes identity. When documents show variations, you make the authoritative choice:
                </p>

                <div className="space-y-2 text-xs">
                  <label 
                    onClick={() => setAimConflictChoice('Aarav Sharma')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      aimConflictChoice === 'Aarav Sharma'
                        ? 'bg-white border-[#002875] ring-2 ring-[#002875]/20 shadow-xs'
                        : 'bg-white/60 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="aimConflict" 
                        checked={aimConflictChoice === 'Aarav Sharma'}
                        onChange={() => setAimConflictChoice('Aarav Sharma')}
                        className="text-[#002875]"
                      />
                      <div>
                        <strong className="text-slate-900">Aarav Sharma</strong>
                        <span className="text-[10px] text-slate-500 block">Sources: Aadhaar KYC &amp; IIT Delhi Degree</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      98% Confidence
                    </span>
                  </label>

                  <label 
                    onClick={() => setAimConflictChoice('Aarav S. Sharma')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      aimConflictChoice === 'Aarav S. Sharma'
                        ? 'bg-white border-[#002875] ring-2 ring-[#002875]/20 shadow-xs'
                        : 'bg-white/60 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="aimConflict" 
                        checked={aimConflictChoice === 'Aarav S. Sharma'}
                        onChange={() => setAimConflictChoice('Aarav S. Sharma')}
                        className="text-[#002875]"
                      />
                      <div>
                        <strong className="text-slate-900">Aarav S. Sharma</strong>
                        <span className="text-[10px] text-slate-500 block">Source: CBSE Class X Secondary Certificate</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                      91% Confidence
                    </span>
                  </label>
                </div>
              </div>

              {/* Citizen Consent & Standards Matrix */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">Sovereign Consent &amp; Standards Matrix</span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      Consent Active
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                    Auto-Fill runs strictly upon explicit citizen consent. Every pre-filled field carries an audit log timestamp and source provenance chip.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-400 block text-[9px]">UPSC / SSC Photo:</span>
                      <strong className="text-[#002875]">200×230 px · 20–50 KB</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-400 block text-[9px]">UPSC / SSC Signature:</span>
                      <strong className="text-[#002875]">140×60 px · 10–20 KB</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-400 block text-[9px]">State PSC Marksheet:</span>
                      <strong className="text-[#002875]">PDF &lt; 2 MB · 200 DPI</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-400 block text-[9px]">Driving License Proof:</span>
                      <strong className="text-[#002875]">PDF/JPEG &lt; 1 MB</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Audit Hash: 8f921...bc91
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onQuickDemoLogin) onQuickDemoLogin('citizen');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#002875] text-white text-xs font-bold hover:bg-[#001f5c] transition-all cursor-pointer shadow-xs flex items-center gap-1"
                  >
                    <span>Launch Nagrik Locker →</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= PROBLEM SECTION ================= */}
      <section className="bl-sec" id="problem">
        <div className="bl-container">
          <div className="bl-head">
            <span className="bl-title-badge"><i></i>The Challenge</span>
            <h2 className="bl-title">Why Digital Documents Still Need a Sovereign Verification Layer</h2>
            <p className="bl-lede">
              Digital certificates can easily exist as standalone PDF files, but proving that they are genuine, untampered, and unrevoked remains fragmented across India.
            </p>
          </div>

          <div className="bl-cards4">
            <article className="bl-pcard">
              <span className="n">01 / ARCHITECTURE</span>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="5" width="7" height="7" rx="1" /><rect x="5" y="14" width="7" height="7" rx="1" />
                <path d="M10 6.5h4M8 10v4" strokeDasharray="2 2" />
              </svg>
              <h3>Fragmentation</h3>
              <p>Disparate government authorities, universities, municipal boards, and portals with zero unified trust protocol.</p>
            </article>

            <article className="bl-pcard">
              <span className="n">02 / INTEGRITY</span>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3h7l4 4v14H8z" /><path d="M15 3v4h4" /><path d="M4 8v13h4" strokeDasharray="2 2" />
              </svg>
              <h3>Forgery Risk</h3>
              <p>A simple PDF or printed paper copy cannot prove origin, cryptographic integrity, or active status.</p>
            </article>

            <article className="bl-pcard">
              <span className="n">03 / VELOCITY</span>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
              </svg>
              <h3>Manual Verification</h3>
              <p>Employers, visa offices, and institutes waste weeks sending physical verification letters and manual emails.</p>
            </article>

            <article className="bl-pcard">
              <span className="n">04 / ARCHIVES</span>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="5" rx="1" /><path d="M5 9v10h14V9M10 13h4" />
              </svg>
              <h3>Legacy Records</h3>
              <p>Decades of physical certificates, land deeds, and municipal registers remain outside the digital trust loop.</p>
            </article>
          </div>
        </div>

        {/* Marquee Ticker */}
        <div className="bl-marquee" aria-label="Problems ticker">
          <div className="bl-marquee-track">
            <p>TOO MANY PAPERS<b>→</b>TOO MANY PORTALS<b>→</b>TOO MANY MANUAL CHECKS<b>→</b>TAMPERABLE COPIES<b>→</b></p>
            <p>TOO MANY PAPERS<b>→</b>TOO MANY PORTALS<b>→</b>TOO MANY MANUAL CHECKS<b>→</b>TAMPERABLE COPIES<b>→</b></p>
          </div>
        </div>
      </section>

      {/* ================= SOLUTION SECTION ================= */}
      <section className="bl-sec" id="solution">
        <div className="bl-container">
          <div className="bl-head">
            <span className="bl-title-badge"><i></i>Sovereign Design</span>
            <h2 className="bl-title">One Sovereign Trust Infrastructure</h2>
            <p className="bl-lede">Seamlessly bridging citizens, accredited sovereign issuers, and global public verifiers through cryptographic proof.</p>
          </div>

          <div className="bl-arch">
            <div className="bl-acol">
              <h3>ACCREDITED ISSUERS</h3>
              <ul className="plain">
                <li>Government Ministries &amp; State Depts</li>
                <li>Universities, Boards &amp; Autonomous Institutes</li>
                <li>Healthcare Councils &amp; Medical Boards</li>
                <li>Trade, Commerce &amp; Professional Guilds</li>
                <li>Judicial &amp; Land Revenue Registrars</li>
              </ul>
              <h4>Authority Capabilities</h4>
              <div className="bl-fn">
                <span>Digitally Sign</span><span>Approve</span><span>Revoke</span><span>Batch Mint</span>
              </div>
            </div>

            <div className="bl-alink" aria-hidden="true" />

            <div className="bl-acol engine">
              <h3>BHAROSA TRUST ENGINE</h3>
              <div className="bl-mods">
                <div className="bl-mod" style={{ '--i': 0 }}><SvgIcon name="sig" size={18} />Digital Signature</div>
                <div className="bl-mod" style={{ '--i': 1 }}><SvgIcon name="hash" size={18} />SHA-256 Hash</div>
                <div className="bl-mod" style={{ '--i': 2 }}><SvgIcon name="qr" size={18} />QR / ID Verification</div>
                <div className="bl-mod" style={{ '--i': 3 }}><SvgIcon name="rev" size={18} />Revocation Registry</div>
                <div className="bl-mod" style={{ '--i': 4 }}><SvgIcon name="vault" size={18} />Nagrik Vault</div>
                <div className="bl-mod" style={{ '--i': 5 }}><SvgIcon name="audit" size={18} />Immutable Audit Trail</div>
              </div>
              <div className="bl-triad">
                <span>Integrity</span><b>+</b><span>Authenticity</span><b>+</b><span>Live Status</span>
              </div>
            </div>

            <div className="bl-alink rev" aria-hidden="true" />

            <div className="bl-acol">
              <h3>END PARTICIPANTS</h3>
              <h4 style={{ marginTop: 0 }}>Citizen (Nagrik)</h4>
              <ul className="plain">
                <li>Self-Sovereign Storage</li>
                <li>Encrypted Sharing</li>
                <li>Family Member Linking</li>
                <li>1-Click Renewal</li>
              </ul>
              <h4>Public Verifier</h4>
              <ul className="plain">
                <li>Instant QR Scan</li>
                <li>Direct Certificate ID Lookup</li>
                <li>Zero-Knowledge PDF Hash Match</li>
              </ul>
            </div>
          </div>

          <div className="bl-facts">
            <div className="bl-fact"><strong>3</strong><span>National stakeholder pillars: Citizens, Authorities, Verifiers</span></div>
            <div className="bl-fact"><strong>5</strong><span>Accredited issuer domains unified in one sovereign network</span></div>
            <div className="bl-fact"><strong>6</strong><span>Cryptographic modules securing every transaction</span></div>
            <div className="bl-fact"><strong>3</strong><span>Zero-friction verification vectors: QR code, Cert ID, PDF hash</span></div>
          </div>
        </div>
      </section>

      {/* ================= TRUST ENGINE (Sticky Interactive SVG) ================= */}
      <section className="bl-sec" id="engine">
        <div className="bl-container">
          <div className="bl-head">
            <span className="bl-title-badge"><i></i>Interactive Core</span>
            <h2 className="bl-title">Inside the BHAROSA Trust Engine</h2>
            <p className="bl-lede">Explore the 6 core pillars of our cryptographic consensus. Tap any satellite node to observe its mechanics.</p>
          </div>

          <div className="bl-engine-wrap">
            <div className="bl-engine-stage-col">
              <div className="bl-stage">
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle className="bl-ring" cx="50" cy="50" r="36" />
                  {ENGINE_MODULES.map((_, i) => {
                    const angle = (-90 + i * 60) * (Math.PI / 180);
                    const x = 50 + 36 * Math.cos(angle);
                    const y = 50 + 36 * Math.sin(angle);
                    return (
                      <line
                        key={`line-${i}`}
                        className={`bl-ln ${activeEngineModule === i ? 'on' : ''}`}
                        x1="50"
                        y1="50"
                        x2={x}
                        y2={y}
                      />
                    );
                  })}
                  {(() => {
                    const angle = (-90 + activeEngineModule * 60) * (Math.PI / 180);
                    const tx = 50 + 36 * Math.cos(angle);
                    const ty = 50 + 36 * Math.sin(angle);
                    return (
                      <circle r="2.5" fill="#FF671F">
                        <animateMotion dur="1.4s" repeatCount="indefinite" path={`M50,50 L${tx},${ty}`} />
                      </circle>
                    );
                  })()}
                </svg>

                <div className="bl-hub">
                  <div>
                    <b>BHAROSA</b>
                    <small>Trust Engine</small>
                  </div>
                </div>

                {ENGINE_MODULES.map((m, i) => {
                  const angle = (-90 + i * 60) * (Math.PI / 180);
                  const x = 50 + 36 * Math.cos(angle);
                  const y = 50 + 36 * Math.sin(angle);
                  return (
                    <button
                      key={m.k}
                      type="button"
                      className={`bl-node ${activeEngineModule === i ? 'on' : ''}`}
                      style={{ left: `${x}%`, top: `${y}%` }}
                      onClick={() => setActiveEngineModule(i)}
                    >
                      <span className="dot"><SvgIcon name={m.k} size={22} /></span>
                      <span>{m.t}</span>
                    </button>
                  );
                })}
              </div>

              <div className="bl-readout">
                <h3>{ENGINE_MODULES[activeEngineModule].t}</h3>
                <p>{ENGINE_MODULES[activeEngineModule].d}</p>
              </div>

              <div className="bl-triad mt-4">
                <span>Integrity</span><b>+</b><span>Authenticity</span><b>+</b><span>Status</span>
              </div>
            </div>

            <div>
              {ENGINE_MODULES.map((m, i) => (
                <div
                  key={m.k}
                  className={`bl-estep ${activeEngineModule === i ? 'on' : ''}`}
                  onClick={() => setActiveEngineModule(i)}
                >
                  <div className="bl-estep-card">
                    <h3>{m.t}</h3>
                    <p>{m.d}</p>
                    <p className="where">{m.w}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= SOVEREIGN TRICOLOR RIVER & ASHOK EMBLEM SHOWCASE ================= */}
      <section className="bl-sec relative overflow-hidden py-16" id="sovereign-river">
        {/* Dynamic Flowing Vibrant Tricolor River Canvas in Background */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-80 overflow-hidden">
          <TricolorRiverCanvas 
            opacity={0.85} 
            speedMultiplier={riverSpeed} 
            showParticles={true} 
          />
        </div>

        <div className="bl-container relative z-10">
          <div className="bl-head">
            <span className="bl-title-badge">
              <AshokaChakra size={14} speed={riverWheelSpeed} color="#002875" />
              <span>National Sovereign Stream</span>
            </span>
            <h2 className="bl-title">Flowing River of Trust &amp; Ashok Emblem</h2>
            <p className="bl-lede">
              The perpetual stream of digitally attested credentials flowing seamlessly across India with cryptographic certainty, constitutional integrity, and vibrant national pride.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Ashok Emblem Card with Rotating Wheel */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-sm bg-white/95 backdrop-blur-xl border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(0,40,117,0.18)] flex flex-col items-center text-center">
                
                {/* Official Ashok Emblem Component with Rotating Center Wheel */}
                <div className="relative p-2 rounded-2xl bg-gradient-to-b from-amber-50/60 to-white border border-amber-200 shadow-sm mb-4">
                  <AshokEmblem 
                    size={175} 
                    wheelSpeed={riverWheelSpeed} 
                    showMotto={true} 
                    glow={true} 
                  />
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#002875] text-xs font-bold mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF671F] animate-ping" />
                  <span>Lion Capital of Sarnath · 24-Spoke Chakra</span>
                </div>

                <h3 className="text-lg font-bold text-[#002875]">State Emblem of India</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Symbolizing sovereignty, righteousness (Dharma), and continuous national progress. The 24-spoke wheel rotates perpetually at the abacus.
                </p>

                {/* Interactive Wheel Speed Buttons */}
                <div className="mt-4 pt-4 border-t border-slate-200/80 w-full flex items-center justify-center gap-1.5 text-xs">
                  <span className="text-slate-500 font-medium mr-1 text-[11px]">Wheel Speed:</span>
                  <button
                    onClick={() => setRiverWheelSpeed('slow')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                      riverWheelSpeed === 'slow' ? 'bg-[#002875] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Gentle
                  </button>
                  <button
                    onClick={() => setRiverWheelSpeed('normal')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                      riverWheelSpeed === 'normal' ? 'bg-[#002875] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setRiverWheelSpeed('fast')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                      riverWheelSpeed === 'fast' ? 'bg-[#FF671F] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Tatkal (Fast)
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Vibrant River Feature & Interactive Speed Controller */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#FF671F] uppercase tracking-wider">
                      Vibrant Tricolor Hydraulics
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                      The Continuous Sovereign Stream
                    </h3>
                  </div>

                  {/* Flow Speed Adjuster */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                    <span className="px-2 text-slate-500 font-medium">Flow:</span>
                    <button
                      onClick={() => setRiverSpeed(0.6)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        riverSpeed === 0.6 ? 'bg-white shadow-xs text-[#002875]' : 'text-slate-600 hover:text-black'
                      }`}
                    >
                      Calm
                    </button>
                    <button
                      onClick={() => setRiverSpeed(1.0)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        riverSpeed === 1.0 ? 'bg-white shadow-xs text-[#002875]' : 'text-slate-600 hover:text-black'
                      }`}
                    >
                      Standard
                    </button>
                    <button
                      onClick={() => setRiverSpeed(1.6)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        riverSpeed === 1.6 ? 'bg-gradient-to-r from-[#FF671F] to-[#E05A18] text-white shadow-xs' : 'text-slate-600 hover:text-black'
                      }`}
                    >
                      Tatkal 1.6x
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
                  <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 text-slate-900">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#FF671F] shadow-sm" />
                      <span className="text-xs font-bold text-orange-950 uppercase tracking-wide">Kesari / Saffron</span>
                    </div>
                    <p className="text-xs text-orange-900/80 leading-relaxed">
                      Radiant courage, strength, and immutable cryptographic hashing guarding national records.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-3 h-3 rounded-full bg-white border border-slate-300 shadow-sm" />
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Luminous White</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Purity of truth, zero-knowledge proofs, and uninterrupted 24-spoke Ashoka Navy rotation.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-slate-900">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#138808] shadow-sm" />
                      <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">India Green</span>
                    </div>
                    <p className="text-xs text-emerald-900/80 leading-relaxed">
                      Prosperity, trust, and multi-sector expansion across Education, Healthcare, Revenue &amp; Commerce.
                    </p>
                  </div>
                </div>

                {/* Direct Action: Test the Post-Login Verification Attestation Page */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-amber-50/50 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#002875] text-white flex items-center justify-center font-bold shadow-md">
                      🏛️
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#002875]">Experience Post-Login Verification Attestation</h4>
                      <p className="text-xs text-slate-600">See the Ashok Emblem with rotating wheel &amp; flowing river in action.</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onQuickDemoLogin && onQuickDemoLogin('citizen')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#002875] hover:bg-[#001F5C] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>Launch Verification Attestation Page →</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bl-sec" id="how">
        <div className="bl-container">
          <div className="bl-head">
            <span className="bl-title-badge"><i></i>The Workflow</span>
            <h2 className="bl-title">How a Credential Travels Through BHAROSA</h2>
            <p className="bl-lede">From citizen application to tamper-proof verification in 6 seamless phases.</p>
          </div>

          <div className="bl-tl">
            <div className="bl-tl-line">
              <div className="bl-tl-fill" style={{ height: '70%' }} />
            </div>

            <div className="bl-tl-step active">
              <div className="bl-tl-node">01</div>
              <div className="bl-tl-card">
                <h3>1. Apply</h3>
                <p>Citizen selects sector, required service, and uploads requisite eligibility proofs through the sovereign portal.</p>
              </div>
            </div>

            <div className="bl-tl-step active">
              <div className="bl-tl-node">02</div>
              <div className="bl-tl-card">
                <h3>2. Prove</h3>
                <p>Identity verification through Aadhaar e-KYC, DigiLocker integration, or legacy archival digitization scans.</p>
              </div>
            </div>

            <div className="bl-tl-step active">
              <div className="bl-tl-node">03</div>
              <div className="bl-tl-card">
                <h3>3. Verify</h3>
                <p>Accredited authority scrutinizes submitted documents, checks regulatory registries, and approves the issuance.</p>
              </div>
            </div>

            <div className="bl-tl-step active">
              <div className="bl-tl-node">04</div>
              <div className="bl-tl-card">
                <h3>4. Sign &amp; Mint</h3>
                <p>Authority HSM creates an ECDSA P-256 digital signature, Merkle root, and SHA-256 hash stamp on the credential.</p>
              </div>
            </div>

            <div className="bl-tl-step">
              <div className="bl-tl-node">05</div>
              <div className="bl-tl-card">
                <h3>5. Vault</h3>
                <p>Tamper-proof credential securely deposits into the citizen's Nagrik Vault with encrypted selective-disclosure permissions.</p>
              </div>
            </div>

            <div className="bl-tl-step">
              <div className="bl-tl-node">06</div>
              <div className="bl-tl-card">
                <h3>6. Public Verify</h3>
                <p>Anyone worldwide instantly verifies the certificate within 500ms using the secure QR, ID, or PDF hash.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LIFECYCLE ================= */}
      <section className="bl-sec" id="lifecycle">
        <div className="bl-container">
          <div className="bl-head">
            <span className="bl-title-badge"><i></i>Dynamic Lifecycle</span>
            <h2 className="bl-title">The Complete Credential Lifecycle</h2>
            <p className="bl-lede">Select any lifecycle state to observe its real-time legal status, cryptographic footprint, and verifier response.</p>
          </div>

          <div>
            <div className="bl-lc-scroll">
              <div className="bl-lc-track">
                <div className="bl-lc-line">
                  <div className="bl-lc-fill" style={{ width: `${(activeLifecycle / (LIFECYCLE_STATES.length - 1)) * 100}%` }} />
                </div>
                {LIFECYCLE_STATES.map((st, i) => (
                  <button
                    key={st.t}
                    type="button"
                    className={`bl-lc-node ${activeLifecycle === i ? 'on' : ''} ${i <= activeLifecycle ? 'passed' : ''}`}
                    style={{ '--c': st.c }}
                    onClick={() => setActiveLifecycle(i)}
                  >
                    <i></i>
                    <span>{st.t}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bl-lc-detail">
              <span className={`bl-chip ${LIFECYCLE_STATES[activeLifecycle].chip}`}>
                <i></i>{LIFECYCLE_STATES[activeLifecycle].t.toUpperCase()}
              </span>
              <h3>{LIFECYCLE_STATES[activeLifecycle].t} State</h3>
              <p>{LIFECYCLE_STATES[activeLifecycle].d}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VERIFIER DEMO SIMULATOR ================= */}
      <section className="bl-sec" id="verify">
        <div className="bl-container">
          <div className="bl-head">
            <span className="bl-title-badge"><i></i>Live Public Tool</span>
            <h2 className="bl-title">Verify Any Credential</h2>
            <p className="bl-lede">Test the instant cryptographic verification mechanism. Enter a Certificate ID, inspect a PDF SHA-256 hash, or tap the interactive QR code.</p>
          </div>

          <div className="bl-vpanel">
            <form onSubmit={handleRunVerify}>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold">
                Interactive Sovereign Demonstration · Real Cryptographic Algorithms
              </div>

              <div className="bl-field">
                <label htmlFor="certId">Certificate ID</label>
                <input
                  id="certId"
                  value={certIdInput}
                  onChange={(e) => setCertIdInput(e.target.value)}
                  placeholder="BHR-EDU-2026-000123"
                  spellCheck="false"
                  autoComplete="off"
                />
              </div>

              <div className="bl-field">
                <label htmlFor="pdfHash">PDF Hash (SHA-256)</label>
                <input
                  id="pdfHash"
                  value={pdfHashInput}
                  onChange={(e) => setPdfHashInput(e.target.value)}
                  placeholder="9f2c1a7e4b63d08a5c1e97f3b20d46a8e15c7b9023fa64d18e0b5c3a7d92f641"
                  spellCheck="false"
                  autoComplete="off"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <button type="submit" disabled={isVerifying} className="bl-btn primary">
                  {isVerifying ? 'Verifying...' : 'Verify Credential'}
                </button>
                <button type="button" onClick={handleFillSample} className="text-[#002875] text-sm font-semibold underline cursor-pointer hover:text-[#FF671F]">
                  Auto-fill sample credential
                </button>
              </div>
            </form>

            <div className="grid place-items-center gap-3 text-center">
              <button
                type="button"
                className="bl-scanbox"
                onClick={() => { handleFillSample(); handleRunVerify(); }}
                aria-label="Scan sample QR code"
              >
                <span className="cr tl1"></span>
                <span className="cr tr1"></span>
                <span className="cr bl1"></span>
                <span className="cr br1"></span>
                <div className="w-full h-full p-2 text-slate-900">
                  {generateQrSvg('BHR-EDU-2026-000123')}
                </div>
              </button>
              <p className="text-xs text-slate-500 font-medium">Tap the QR viewfinder to simulate a real-world smartphone camera scan.</p>
            </div>

            {/* Verification Steps Output */}
            {verifySteps.length > 0 && (
              <div className="col-span-full">
                <ol className="bl-vsteps">
                  {verifySteps.map((step, idx) => (
                    <li key={idx} className={step.status}>{step.name}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Verification Result Card */}
            {verificationResult && (
              <div className="col-span-full bl-vresult">
                <svg className="bl-vcheck" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="24" />
                  <path d="M14 27l8 8 16-17" />
                </svg>
                <div>
                  <h3 className="font-extrabold text-xl text-[#0D6838] tracking-wider mb-3">
                    SOVEREIGN CREDENTIAL VERIFIED
                  </h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <dt className="text-slate-500 font-medium">Certificate ID</dt>
                      <dd className="font-mono font-bold text-slate-900">{verificationResult.id}</dd>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <dt className="text-slate-500 font-medium">Status</dt>
                      <dd className="font-bold text-[#0D6838]">{verificationResult.status}</dd>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <dt className="text-slate-500 font-medium">Issuing Authority</dt>
                      <dd className="font-semibold text-slate-900">{verificationResult.issuer}</dd>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <dt className="text-slate-500 font-medium">Digital Signature</dt>
                      <dd className="font-mono text-[#0D6838] font-bold">{verificationResult.sig}</dd>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <dt className="text-slate-500 font-medium">SHA-256 Merkle Proof</dt>
                      <dd className="font-mono text-[#0D6838] font-bold">{verificationResult.hash}</dd>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <dt className="text-slate-500 font-medium">Integrity Audit</dt>
                      <dd className="font-mono text-[#0D6838] font-bold">{verificationResult.audit}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= MARG AI GUIDE ================= */}
      <section className="bl-sec" id="marg">
        <div className="bl-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="bl-title-badge"><i></i>Sovereign AI Copilot</span>
            <h2 className="bl-title">MARG: Your AI Trust Guide</h2>
            <p className="bl-lede">
              MARG intelligently assists citizens through eligibility requirements, required documents, Tatkal fast-track processes, and verifications.
            </p>
            <ul className="mt-8 space-y-3.5 text-slate-600 font-medium">
              <li className="flex gap-3 items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0D6838]"></span>
                Ask any question in conversational English or Hindi.
              </li>
              <li className="flex gap-3 items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0D6838]"></span>
                Select from quick preset prompts to see instant authoritative responses.
              </li>
              <li className="flex gap-3 items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0D6838]"></span>
                Accessible everywhere across the portal via the floating bottom-right assistant.
              </li>
            </ul>
          </div>

          <div className="bl-chat">
            <div className="bl-chat-head">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF671F] to-[#002875] text-white font-extrabold grid place-items-center text-sm shadow-sm">
                M
              </span>
              <div>
                <b className="text-slate-900 font-bold">MARG AI</b>
                <small className="block text-xs font-mono text-[#002875] font-semibold">Sovereign AI Assistant · 24/7</small>
              </div>
            </div>

            <div className="bl-chat-log" ref={chatLogRef}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`bl-msg ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              {chatWaiting && (
                <div className="bl-msg bot">
                  <span className="inline-flex gap-1.5 py-1">
                    <i className="w-1.5 h-1.5 rounded-full bg-[#002875] animate-bounce"></i>
                    <i className="w-1.5 h-1.5 rounded-full bg-[#002875] animate-bounce [animation-delay:0.15s]"></i>
                    <i className="w-1.5 h-1.5 rounded-full bg-[#002875] animate-bounce [animation-delay:0.3s]"></i>
                  </span>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border-t border-slate-200">
              <button
                type="button"
                onClick={() => handleSendChat('What documents do I need?')}
                className="px-3 py-1 rounded-full text-xs bg-white border border-slate-300 text-slate-700 hover:text-[#002875] hover:border-[#002875] transition-all font-medium"
              >
                What documents do I need?
              </button>
              <button
                type="button"
                onClick={() => handleSendChat('How do I verify a certificate?')}
                className="px-3 py-1 rounded-full text-xs bg-white border border-slate-300 text-slate-700 hover:text-[#002875] hover:border-[#002875] transition-all font-medium"
              >
                How to verify?
              </button>
              <button
                type="button"
                onClick={() => handleSendChat('Where is my credential stored?')}
                className="px-3 py-1 rounded-full text-xs bg-white border border-slate-300 text-slate-700 hover:text-[#002875] hover:border-[#002875] transition-all font-medium"
              >
                Where is it stored?
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendChat(); }} className="flex gap-2 p-3 bg-white border-t border-slate-200">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about documents, verification or eligibility..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#002875]"
              />
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF671F] to-[#EA580C] text-white font-bold text-sm shadow-sm hover:opacity-95">
                Ask
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ================= NAGRIK VAULT ================= */}
      <section className="bl-sec" id="vault">
        <div className="bl-container">
          <div className="bl-head">
            <span className="bl-title-badge"><i></i>Citizen Self-Sovereignty</span>
            <h2 className="bl-title">Nagrik Sovereign Vault</h2>
            <p className="bl-lede">One centralized, encrypted digital home for all citizen certificates, licenses, and verified records across education, health, revenue, and trade.</p>
          </div>

          <div className="bl-vault">
            <div className="flex flex-wrap gap-4 items-center justify-between p-6 border-b border-slate-200 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#002875] to-[#0A3D91] text-white font-bold grid place-items-center shadow-sm">
                  AS
                </div>
                <div>
                  <b className="block text-slate-900 font-bold">Aarav Sharma</b>
                  <small className="text-slate-500 text-xs font-medium">Nagrik ID: BHR-CITIZEN-9842 · Verified Aadhaar Linked</small>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-1.5 p-1 rounded-full bg-white border border-slate-200 shadow-sm">
                {['all', 'active', 'expired', 'shared'].map(f => (
                  <button
                    key={f}
                    onClick={() => setVaultFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize cursor-pointer transition-all ${
                      vaultFilter === f 
                        ? 'bg-[#002875] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="bl-vgrid">
              {filteredVault.map(c => (
                <article key={c.id} className="bl-vc">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-11 h-11 rounded-xl bg-blue-50 text-[#002875] border border-blue-200 grid place-items-center">
                      <SvgIcon name={c.ic} size={24} />
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-slate-900">{c.t}</h3>
                      <span className="text-xs font-mono text-slate-500">{c.id}</span>
                    </div>
                    <div className="ml-auto flex gap-1.5">
                      <span className={`bl-chip ${c.st === 'Active' ? 'ok' : 'warn'}`}>
                        <i></i>{c.st.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <dl className="grid gap-1.5 text-sm">
                    <div className="flex justify-between py-1.5 border-t border-slate-200">
                      <dt className="text-slate-500">Issuing Authority</dt>
                      <dd className="font-semibold text-slate-800">{c.iss}</dd>
                    </div>
                    <div className="flex justify-between py-1.5 border-t border-slate-200">
                      <dt className="text-slate-500">Issue Date</dt>
                      <dd className="font-semibold text-slate-800">{c.date}</dd>
                    </div>
                    <div className="flex justify-between py-1.5 border-t border-slate-200">
                      <dt className="text-slate-500">Integrity Check</dt>
                      <dd className="font-semibold text-[#0D6838]">{c.ver}</dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    onClick={() => setQrModalItem(c)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 text-xs text-[#002875] font-semibold hover:border-[#002875] hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    <SvgIcon name="qr" size={16} />
                    Display Sovereign QR
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Modal QR Code */}
        {qrModalItem && (
          <div className="fixed inset-0 z-[200] grid place-items-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm p-6 rounded-3xl bg-white border border-slate-200 text-center shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900">{qrModalItem.t}</h3>
              <p className="font-mono text-xs text-[#002875] font-bold my-2">{qrModalItem.id}</p>
              <div className="w-52 h-52 mx-auto my-4 p-4 rounded-2xl bg-white border border-slate-300 text-slate-900 shadow-sm">
                {generateQrSvg(qrModalItem.id)}
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Sovereign QR containing embedded cryptographic signature. Point any camera to test instant verification.
              </p>
              <button
                type="button"
                onClick={() => setQrModalItem(null)}
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#FF671F] to-[#EA580C] text-white font-bold text-sm cursor-pointer shadow-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ================= IMPACT CHAIN (Horizontal Scroll Feature) ================= */}
      <section className="bl-sec bg-white border-y border-slate-200" id="impact">
        <div className="bl-container">
          <div className="bl-head">
            <span className="bl-title-badge"><i></i>National Pillar</span>
            <h2 className="bl-title">The Sovereign Impact Chain</h2>
            <p className="bl-lede">Five transformative advantages when administrative records shift to cryptographic trust.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CHAIN_STAGES.map((s, idx) => (
              <article key={s.k} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm hover:border-[#002875] hover:shadow-md transition-all">
                <span className="text-xs font-mono font-bold text-[#FF671F]">0{idx + 1} / STAGE</span>
                <h3 className="font-extrabold text-lg text-[#002875] mt-2 mb-1">{s.k}</h3>
                <h4 className="font-bold text-sm text-slate-800 mb-2">{s.t}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{s.d}</p>
              </article>
            ))}
          </div>

          {/* Impact Metrics Grid */}
          <div className="bl-impact-grid mt-12">
            <article className="bl-icard">
              <h3>CITIZENS</h3>
              <ul className="space-y-2 mt-4 text-slate-700 font-medium">
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#FF671F]"></span>Zero physical paperwork queues &amp; no notary visits</li>
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#FF671F]"></span>1-Click encrypted sharing via QR, Link, or PDF</li>
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#FF671F]"></span>Permanent digital wallet for life &amp; family</li>
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#FF671F]"></span>Instant notifications on credential status changes</li>
              </ul>
            </article>

            <article className="bl-icard">
              <h3>GOVERNMENT</h3>
              <ul className="space-y-2 mt-4 text-slate-700 font-medium">
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#002875]"></span>90% reduction in manual verification overhead</li>
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#002875]"></span>Immutable cryptographic audit trail for RTI &amp; anti-fraud</li>
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#002875]"></span>Centralized revocation registry across all state boards</li>
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#002875]"></span>Automated compliance with digital governance acts</li>
              </ul>
            </article>

            <article className="bl-icard">
              <h3>INSTITUTIONS</h3>
              <ul className="space-y-2 mt-4 text-slate-700 font-medium">
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#0D6838]"></span>Sub-second background checks for employers &amp; colleges</li>
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#0D6838]"></span>Zero liability from counterfeit or forged documents</li>
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#0D6838]"></span>Standardized API endpoints for bulk batch validation</li>
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#0D6838]"></span>Cross-border credibility for international admissions</li>
              </ul>
            </article>

            <article className="bl-icard">
              <h3>NATIONAL ECOSYSTEM</h3>
              <ul className="space-y-2 mt-4 text-slate-700 font-medium">
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#FF671F]"></span>Interoperability between DigiLocker, APAC, and Global standards</li>
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#FF671F]"></span>Vintage archives digitized into searchable Merkle proofs</li>
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#FF671F]"></span>Sovereign data security with zero foreign server reliance</li>
                <li className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-[#FF671F]"></span>Economic efficiency adding billions in saved man-hours</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section className="bl-sec" id="team">
        <div className="bl-container">
          <div className="bl-head">
            <span className="bl-title-badge"><i></i>Builders</span>
            <h2 className="bl-title">TEAM MASTI</h2>
            <p className="bl-lede">4 Minds • 1 Sovereign Mission • Digital Trust for 1.4 Billion Citizens</p>
          </div>

          <div className="bl-team-grid">
            {[
              { n: 'Priyanshu Kumar', r: 'Core Architecture & Cryptography' },
              { n: 'Mayank Chaudhary', r: 'Consensus & Verification Engine' },
              { n: 'Krish Jha', r: 'Full-Stack & Vault Infrastructure' },
              { n: 'Suman Singh', r: 'UI/UX & Mobile Protocols' }
            ].map(m => (
              <article key={m.n} className="bl-tcard">
                <div className="bl-ava" aria-hidden="true">
                  {m.n.split(' ').map(w => w[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{m.n}</h3>
                  <small className="text-xs text-[#002875] font-mono tracking-wider font-bold block mt-1">{m.r}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA & ASHOKA CHAKRA SOVEREIGN GUARANTEE ================= */}
      <section className="py-24 relative text-center overflow-hidden bg-gradient-to-b from-white to-slate-100 border-t border-slate-200">
        <div className="bl-container relative z-10">
          {/* Animated 24-Spoke Ashoka Chakra Seal */}
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_24s_linear_infinite]">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#002875" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#FF671F" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="8" fill="#002875" />
              {Array.from({ length: 24 }).map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="8"
                  stroke="#002875"
                  strokeWidth="1.2"
                  transform={`rotate(${i * 15} 50 50)`}
                />
              ))}
            </svg>
          </div>

          <div className="bl-title-badge mx-auto"><i></i>Sovereign Guarantee</div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#002875] tracking-tight my-4">
            Trust Every Credential. Everywhere.
          </h2>
          <p className="max-w-xl mx-auto text-slate-600 text-base leading-relaxed mb-8 font-medium">
            From an untrusted paper document in your hands to an unforgeable sovereign proof verified by anyone, anywhere in milliseconds.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => onOpenAuth ? onOpenAuth() : null}
              className="bl-btn primary text-base px-8 py-3.5"
            >
              Enter Sovereign Portal
            </button>
            <a href="#verify" className="bl-btn text-base px-8 py-3.5">
              Verify Credential
            </a>
          </div>
        </div>
      </section>

      {/* ================= OFFICIAL INDIA.GOV.IN FOOTER ================= */}
      <footer className="bl-footer">
        <div className="bl-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-[#002875]">
                  🏛️
                </div>
                <b className="text-[#002875] text-lg tracking-wider font-extrabold">BHAROSA</b>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Bharat Hub for Records, Online Security &amp; Authentication. Official national public infrastructure for verifiable credentials.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3 text-[#FF671F]">NATIONAL INITIATIVES</h4>
              <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                <li><a href="https://www.india.gov.in/" target="_blank" rel="noreferrer" className="hover:text-[#002875]">National Portal of India</a></li>
                <li><a href="https://www.meity.gov.in/" target="_blank" rel="noreferrer" className="hover:text-[#002875]">Ministry of Electronics &amp; IT</a></li>
                <li><a href="https://www.digilocker.gov.in/" target="_blank" rel="noreferrer" className="hover:text-[#002875]">DigiLocker Ecosystem</a></li>
                <li><a href="https://uidai.gov.in/" target="_blank" rel="noreferrer" className="hover:text-[#002875]">UIDAI Aadhaar Verification</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3 text-[#FF671F]">SOVEREIGN STAKEHOLDERS</h4>
              <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                <li><a href="#home" className="hover:text-[#002875]">Citizen Nagrik Vault</a></li>
                <li><a href="#home" className="hover:text-[#002875]">Accredited Issuing Authorities</a></li>
                <li><a href="#verify" className="hover:text-[#002875]">Public Instant Verifier</a></li>
                <li><a href="#marg" className="hover:text-[#002875]">MARG Sovereign Assistant</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3 text-[#FF671F]">GOVERNANCE &amp; TRUST</h4>
              <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                <li><a href="#team" className="hover:text-[#002875]">Team Masti Architecture</a></li>
                <li><a href="#privacy" className="hover:text-[#002875]">Digital Personal Data Protection Act</a></li>
                <li><a href="#terms" className="hover:text-[#002875]">Terms of Platform Service</a></li>
                <li><a href="#rti" className="hover:text-[#002875]">RTI Cryptographic Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <div>
              © 2026 Government of India • National Sovereign Trust Platform (BHAROSA). All Rights Reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Website Content Managed by MeitY</span>
              <span>•</span>
              <span>Hosted on Sovereign Government Cloud</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button (MARG AI - India.gov.in Light Style) */}
      <button 
        onClick={() => setFloatingChatOpen(prev => !prev)}
        className="fixed right-6 bottom-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-white border-2 border-[#002875] text-[#002875] shadow-[0_8px_25px_rgba(0,40,117,0.2)] hover:scale-105 transition-all cursor-pointer"
      >
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF671F] to-[#002875] text-white font-bold grid place-items-center text-xs">
          M
        </span>
        <span className="text-sm font-bold font-sora pr-1">Ask MARG</span>
      </button>

      {/* Floating Chat Drawer */}
      {floatingChatOpen && (
        <div className="fixed right-6 bottom-24 z-50 w-full max-w-sm rounded-3xl bg-white border-2 border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[500px]">
          <div className="flex items-center justify-between p-4 bg-white text-[#002875] border-b-2 border-[#FF671F]">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#FF671F] text-white font-bold grid place-items-center text-xs">
                M
              </span>
              <span className="font-bold text-[#002875] text-sm">MARG AI Guide</span>
            </div>
            <button 
              onClick={() => setFloatingChatOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1 text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72 text-sm bg-slate-50">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`bl-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSendChat(); }} className="flex gap-2 p-3 bg-white border-t border-slate-200">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask MARG..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#002875]"
            />
            <button type="submit" className="px-3.5 py-2 rounded-xl bg-[#002875] text-white font-bold text-xs hover:bg-[#0A3D91]">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
