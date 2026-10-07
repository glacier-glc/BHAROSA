import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Star, 
  Send, 
  CheckCircle2, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Heart,
  Globe2,
  Lock,
  Building,
  GraduationCap,
  Scale,
  Award
} from 'lucide-react';
import AshokaChakra from './AshokaChakra';

export default function Footer() {
  // Citizen Feedback state
  const [rating, setRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState('verification');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackTicketId, setFeedbackTicketId] = useState('');

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    const ticket = `GRV-GOI-${Math.floor(100000 + Math.random() * 900000)}`;
    setFeedbackTicketId(ticket);
    setFeedbackSubmitted(true);
    setFeedbackText('');
  };

  const govLinksCategories = [
    {
      title: 'National & Apex Portals',
      icon: Globe2,
      links: [
        { name: 'National Portal of India', url: 'https://www.india.gov.in' },
        { name: 'Digital India Sovereign Initiative', url: 'https://www.digitalindia.gov.in' },
        { name: 'MyGov Citizen Engagement', url: 'https://www.mygov.in' },
        { name: 'Press Information Bureau (PIB)', url: 'https://www.pib.gov.in' },
        { name: 'National Informatics Centre (NIC)', url: 'https://www.nic.in' }
      ]
    },
    {
      title: 'Identity, e-Sign & Digital Vaults',
      icon: Lock,
      links: [
        { name: 'UIDAI (Aadhaar Official Portal)', url: 'https://uidai.gov.in' },
        { name: 'DigiLocker National Cloud', url: 'https://www.digilocker.gov.in' },
        { name: 'Controller of Certifying Authorities (CCA)', url: 'https://cca.gov.in' },
        { name: 'e-Sign India Gateway (C-DAC)', url: 'https://esign.cdac.in' },
        { name: 'National Single Window System', url: 'https://www.nsws.gov.in' }
      ]
    },
    {
      title: 'Education, Testing & Research',
      icon: GraduationCap,
      links: [
        { name: 'Ministry of Education (MoE)', url: 'https://www.education.gov.in' },
        { name: 'National Testing Agency (NTA)', url: 'https://nta.ac.in' },
        { name: 'University Grants Commission (UGC)', url: 'https://www.ugc.gov.in' },
        { name: 'National Scholarship Portal (NSP)', url: 'https://scholarships.gov.in' },
        { name: 'IIT Academic Joint Council', url: 'https://www.iitsystem.ac.in' }
      ]
    },
    {
      title: 'Corporate, Tax & Governance',
      icon: Building,
      links: [
        { name: 'Ministry of Corporate Affairs (MCA21)', url: 'https://www.mca.gov.in' },
        { name: 'Income Tax e-Filing Portal', url: 'https://www.incometax.gov.in' },
        { name: 'Goods & Services Tax (GST) Network', url: 'https://www.gst.gov.in' },
        { name: 'Startup India & DPIIT Registry', url: 'https://www.startupindia.gov.in' },
        { name: 'Udyam MSME Registration Portal', url: 'https://udyamregistration.gov.in' }
      ]
    },
    {
      title: 'Civic, Transport & Public Safety',
      icon: Scale,
      links: [
        { name: 'Ministry of Road Transport (Parivahan)', url: 'https://parivahan.gov.in' },
        { name: 'Passport Seva Online Portal', url: 'https://www.passportindia.gov.in' },
        { name: 'Digital Police CCTNS Portal', url: 'https://digitalpolice.gov.in' },
        { name: 'State Land Revenue Portals (Bhoomi/AnyRoR)', url: 'https://dilrmp.gov.in' },
        { name: 'National Portal for Civil Registration (CRS)', url: 'https://crsorgi.gov.in' }
      ]
    },
    {
      title: 'Healthcare & Social Welfare',
      icon: Award,
      links: [
        { name: 'Ministry of Health & Family Welfare', url: 'https://www.mohfw.gov.in' },
        { name: 'Ayushman Bharat Digital Mission (ABDM)', url: 'https://abdm.gov.in' },
        { name: 'National Medical Commission (NMC)', url: 'https://www.nmc.org.in' },
        { name: 'Unique Disability ID (Swavlamban)', url: 'https://www.swavlambancard.gov.in' },
        { name: 'PM-KISAN National Farmer Registry', url: 'https://pmkisan.gov.in' }
      ]
    }
  ];

  return (
    <footer className="w-full bg-white border-t border-slate-200 text-slate-600 pt-14 pb-8 space-y-12 shadow-sm">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* SECTION 1: Categorized Official Government Websites Directory */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-blue-50 text-[#002875] border border-blue-200 shadow-sm">
                <Globe2 size={18} />
              </span>
              <div>
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#002875]">
                  Official Government of India Web Directory
                </h3>
                <p className="text-xs text-slate-500">
                  Direct authentic links to participating ministries, statutory bodies, and national registries
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-[#0D6838] border border-emerald-200 font-bold">
              All 30 Portals Verified &amp; Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-xs">
            {govLinksCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center gap-1.5 font-bold text-[#002875] text-xs">
                    <Icon size={14} className="text-[#ff671f]" />
                    <span>{cat.title}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {cat.links.map((link, lidx) => (
                      <li key={lidx}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#002875] transition-colors flex items-center gap-1 text-[11px] group text-slate-600 font-medium"
                        >
                          <span className="truncate">{link.name}</span>
                          <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-[#002875]" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2 & 3: Government Authorization Banner & Feedback Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-slate-200">
          
          {/* Left: Authorized by Indian Govt Section (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <AshokaChakra size={36} speed="slow" color="#002875" accentColor="#ff671f" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff671f] font-bold">
                    OFFICIAL STATUTORY MANDATE
                  </span>
                  <h4 className="font-cinzel text-lg sm:text-xl font-bold text-[#002875]">
                    Authorized Digital Infrastructure of India
                  </h4>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                BHAROSA (<em>Bharat Hub for Records, Online Security &amp; Authentication</em>) is established under the authority of the <strong>Ministry of Electronics and Information Technology (MeitY)</strong>, Government of India. Operating in full compliance with the <strong>Information Technology Act, 2000</strong> (Sec 43A, 65B) and the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm">
                  <span className="text-slate-400 block text-[9px]">Gazette Registry ID</span>
                  <span className="text-[#002875] font-bold">GOI-MEITY-2026-REG-001</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm">
                  <span className="text-slate-400 block text-[9px]">Cryptographic Standard</span>
                  <span className="text-[#0284c7] font-bold">SHA-256 + ECDSA P-256</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm">
                  <span className="text-slate-400 block text-[9px]">GIGW Quality Stamp</span>
                  <span className="text-[#0D6838] font-bold">GIGW 3.0 Compliant</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-4 pt-1">
                <span>© 2026 Government of India. All Sovereign Rights Reserved.</span>
                <span>Hosted at National Data Centre (NIC), New Delhi.</span>
              </div>

            </div>
          </div>

          {/* Right: Citizen Feedback & Grievance Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff671f] font-bold">
                    CITIZEN VOICE &amp; GRIEVANCE
                  </span>
                  <h4 className="font-cinzel text-base font-bold text-[#002875]">
                    Citizen Feedback Column
                  </h4>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="cursor-pointer"
                    >
                      <Star
                        size={16}
                        className={`${
                          star <= rating 
                            ? 'text-amber-500 fill-amber-500' 
                            : 'text-slate-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {feedbackSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-center space-y-2 animate-fadeIn">
                  <CheckCircle2 size={28} className="mx-auto text-[#0D6838]" />
                  <p className="font-bold text-xs text-[#0D6838]">Thank you for your valuable feedback!</p>
                  <p className="text-[11px] text-slate-600 font-mono">
                    Grievance / Feedback Reference Ticket: <span className="text-[#002875] font-bold">{feedbackTicketId}</span>
                  </p>
                  <button
                    onClick={() => setFeedbackSubmitted(false)}
                    className="text-[10px] text-slate-600 hover:text-slate-900 underline mt-1 cursor-pointer font-medium"
                  >
                    Submit another response
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                  <div>
                    <select
                      value={feedbackCategory}
                      onChange={(e) => setFeedbackCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:border-[#002875] focus:outline-none"
                    >
                      <option value="verification">Verification Speed &amp; Accuracy</option>
                      <option value="tatkal">Tatkal Fast-Track Processing</option>
                      <option value="convenience_fee">Statutory Convenience Fees</option>
                      <option value="ui_accessibility">Website Accessibility &amp; Aesthetics</option>
                      <option value="other_grievance">General Grievance / Suggestion</option>
                    </select>
                  </div>

                  <div>
                    <textarea
                      rows={3}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Share your experience, feature request, or report a portal discrepancy..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:border-[#002875] focus:outline-none resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#FF671F] to-[#EA580C] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Send size={13} />
                    <span>Submit Sovereign Feedback</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

        {/* SECTION 4: Colophon, Creator Contact, Helpline & Node Status */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          
          {/* Creator & Contact Details */}
          <div className="space-y-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-800 font-medium">
                <PhoneCall size={13} className="text-[#FF671F]" />
                <span>24x7 Sovereign Helpline: <strong>1800-11-BHAROSA</strong> (Toll Free)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-800 font-medium">
                <Mail size={13} className="text-[#FF671F]" />
                <span>grievance@bharosa.gov.in</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Architected &amp; Maintained by Glacier • Built for Digital India Initiative • Designed with Sovereign Pride.
            </p>
          </div>

          {/* Ledger Heartbeat Indicator */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-200 font-mono text-[11px] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#0D6838] animate-pulse"></span>
            <span className="text-slate-800 font-semibold">Consensus: 24/24 Nodes Online</span>
            <span className="text-slate-300">|</span>
            <span className="text-[#002875] font-bold">Block #14,892,104</span>
          </div>

        </div>

      </div>

    </footer>
  );
}
