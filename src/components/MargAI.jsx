import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  ShieldCheck, 
  HelpCircle,
  Zap,
  Lock,
  ArrowRight
} from 'lucide-react';
import AshokaChakra from './AshokaChakra';

export default function MargAI({ onOpenApply, onOpenVerify, onOpenDocServices }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'marg',
      text: 'Namaste! I am MARG (Multi-sector AI Record Guide). How can I assist your sovereign documentation or verification journey today?',
      time: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickPrompts = [
    { title: 'Zero Rejection Auto-Fit', query: 'How does Auto-Fit solve portal upload rejections?' },
    { title: 'Photo & Signature Specs', query: 'What are photo and signature dimension requirements?' },
    { title: 'Smart Auto-Fill & Conflicts', query: 'How does Smart Auto-Fill resolve name conflicts?' },
    { title: 'Combine Multi-Image PDF', query: 'How do I merge multiple photos into a single PDF?' },
    { title: 'Tatkal Rules & SLA', query: 'How does Tatkal 4-Hour Express work?' },
  ];

  const handleSend = (userQuery) => {
    const text = userQuery || inputValue.trim();
    if (!text) return;

    const newMessages = [...messages, { sender: 'user', text, time: 'Just now' }];
    setMessages(newMessages);
    setInputValue('');

    // Generate intelligent AI response based on knowledge base
    setTimeout(() => {
      let botReply = '';
      const q = text.toLowerCase();

      if (q.includes('auto-fit') || q.includes('zero rejection') || q.includes('rejection') || q.includes('compress') || q.includes('fit')) {
        botReply = 'BHAROSA\'s flagship aim is Zero-Rejection Filing. Our client-side Auto-Fit Engine inspects magic bytes (FF D8 FF for JPEG, %PDF for PDF), crops photos to exact aspect ratio (200×230 px), applies stepping JPEG compression (0.92 → 0.4) to guarantee files land within 20–50 KB, and enhances scan contrast — all in your browser with 100% privacy and zero server uploads.';
      } else if (q.includes('photo') || q.includes('signature') || q.includes('spec') || q.includes('dimension') || q.includes('size')) {
        botReply = 'Official National Portal Specifications:\n• Passport Photo: JPEG, exactly 200×230 px, 20 KB to 50 KB, color on light background.\n• Signature: JPEG/PNG, exactly 140×60 px, 10 KB to 20 KB, dark ink on plain white.\n• Academic / ID PDF: PDF, max 2.0 MB, up to 5 pages, 200 DPI.\nIf your files exceed these limits, click "Auto-Fit" in your Document Locker to fix them instantly.';
      } else if (q.includes('conflict') || q.includes('auto-fill') || q.includes('autofill') || q.includes('name')) {
        botReply = 'Smart Auto-Fill pulls authoritative data from your Profile Vault. If documents disagree (e.g. "Aarav Sharma" on degree vs "Aarav S. Sharma" on marksheet), BHAROSA presents both variants with confidence scores for your one-click selection. We never silently guess — your explicit choice is recorded with a consent audit timestamp.';
      } else if (q.includes('merge') || q.includes('combine') || q.includes('multi') || q.includes('pages')) {
        botReply = 'To combine multi-page marksheets, deeds, or annexures, tap "Merge into PDF" in the Document Locker. You can reorder pages (Move Up/Down), rotate 90° clockwise, and export an A4-standardized PDF under 2 MB with an authentic SHA-256 Merkle fingerprint.';
      } else if (q.includes('tatkal') || q.includes('express') || q.includes('sla') || q.includes('speed')) {
        botReply = 'BHAROSA offers two Tatkal Fast-Track priority tiers: (1) 24-Hour Express (+₹250 fee) where your application jumps to the priority queue with guaranteed 24h scrutiny, and (2) 4-Hour Flash Emergency (+₹500 fee) with dedicated officer allocation and real-time WhatsApp dispatch upon digital signing.';
      } else if (q.includes('require') || q.includes('document') || q.includes('domicile') || q.includes('income')) {
        botReply = 'Every application form includes an automated checklist of Mandatory and Supporting proofs. For instance, Domicile Certificate requires: (1) Continuous 10+ year residence proof (electricity/ration bill), (2) School Leaving Certificate, and (3) Aadhaar Card. All proofs are cryptographically fingerprinted with SHA-256 before submission.';
      } else if (q.includes('unlock') || q.includes('lock') || q.includes('attempt') || q.includes('failed')) {
        botReply = 'If your account is locked after 3 failed attempts, our Tier-2 Sovereign Unlock protocol activates. You can unlock your account by: (1) Verifying your Registered Mobile OTP, (2) Providing your masked PAN / Passport reference, and (3) Answering your confidential security challenge. Once verified, your lockout timer is cleared immediately.';
      } else if (q.includes('verify') || q.includes('degree') || q.includes('employer') || q.includes('check')) {
        botReply = 'Third parties, colleges, and employers can verify any credential in milliseconds! Simply open Document Verifier from the sovereign menu to: (1) Enter the Certificate ID (e.g., IITB-CSE-2025-0891), (2) Scan the embedded Sovereign QR, or (3) Drag and drop the PDF to match its SHA-256 Merkle hash directly against the sovereign block ledger.';
      } else if (q.includes('fee') || q.includes('print') || q.includes('renew') || q.includes('reissue')) {
        botReply = 'Under Document Services, you can request: (1) Hardcopy 250 GSM Royal Parchment dispatch via India Post Speed Post (₹120), (2) Smart PVC Wallet Card (₹150), (3) Re-issue of lost/damaged duplicate certificate (₹80), or (4) License renewal (₹200). All fees are settled securely via Bharat BillPay (BBPS).';
      } else {
        botReply = `BHAROSA's main aim is Zero-Rejection Application Filing across India through Smart Auto-Fill and Client-Side Document Auto-Fit. You can apply for tamper-proof credentials, manage your Parivar family locker, or verify credentials on the national ledger.`;
      }

      setMessages(prev => [...prev, { sender: 'marg', text: botReply, time: 'Just now' }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-[#002875] text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-blue-400/40"
        title="MARG - Sovereign AI Record Guide"
      >
        <div className="relative">
          <AshokaChakra size={22} speed="normal" color="#ffffff" accentColor="#ff671f" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#138808] border-2 border-white"></span>
        </div>
        <span className="font-cinzel text-xs font-bold tracking-wider hidden sm:inline">
          ASK MARG AI
        </span>
      </button>

      {/* Slide-out / Pop-up AI Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md h-[560px] max-h-[90vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
          
          {/* Header */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-[#002875] border border-blue-200">
                <Sparkles size={18} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-cinzel text-sm font-bold text-slate-900">MARG AI</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    ACTIVE
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">Multi-sector AI Record Guide</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp.query)}
                className="whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-semibold bg-white hover:bg-slate-100 text-[#002875] border border-slate-200 transition-all cursor-pointer shadow-sm"
              >
                {qp.title}
              </button>
            ))}
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'marg' && (
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-[#002875] border border-blue-200 flex items-center justify-center shrink-0">
                    <Bot size={14} />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#002875] text-white font-medium rounded-br-none shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-[#002875] flex items-center justify-center shrink-0 font-bold text-xs">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask MARG about Tatkal, documents, verification..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#002875] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 rounded-xl bg-[#002875] text-white hover:bg-[#001d57] transition-all disabled:opacity-40 cursor-pointer shadow-sm"
            >
              <Send size={15} />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
