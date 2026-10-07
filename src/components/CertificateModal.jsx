import React, { useEffect, useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  Lock, 
  QrCode, 
  Award,
  Calendar,
  Building2,
  ExternalLink
} from 'lucide-react';
import QRCode from 'qrcode';
import AshokaChakra from './AshokaChakra';

export default function CertificateModal({ certificate, onClose, onVerifyHash }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    if (certificate) {
      const verifyUrl = `https://bharosa.gov.in/verify?id=${certificate.id}&hash=${certificate.sha256}`;
      QRCode.toDataURL(verifyUrl, {
        width: 180,
        margin: 1,
        color: {
          dark: '#002875',
          light: '#ffffff'
        }
      }).then(setQrDataUrl).catch(console.error);
    }
  }, [certificate]);

  if (!certificate) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(certificate.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-4xl p-6 sm:p-8 bg-white border border-slate-200 shadow-2xl rounded-2xl">
        
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-2">
            <span className="badge badge-emerald flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              SOVEREIGN VERIFIED & ACTIVE
            </span>
            <span className="font-mono text-xs text-slate-500">ID: {certificate.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 cursor-pointer"
              title="Print Certificate"
            >
              <Printer size={14} /> Print
            </button>

            <button
              onClick={() => {
                alert(`Downloading tamper-proof PDF for ${certificate.title} with embedded SHA-256 seal.`);
              }}
              className="btn btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download size={14} /> Download PDF
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Parchment Surface */}
        <div 
          id="certificate-print-area"
          className="relative p-8 sm:p-12 rounded-xl bg-[#FAFCFF] border-4 border-double border-[#002875] shadow-lg overflow-hidden select-none"
        >
          {/* Watermark Emblem in Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <AshokaChakra size={450} speed="normal" color="#002875" accentColor="#ff671f" glow={false} />
          </div>

          {/* Top Sovereign Seal Header */}
          <div className="text-center relative z-10 mb-8 pb-6 border-b border-slate-200">
            <div className="inline-flex p-2.5 rounded-full bg-white border-2 border-[#002875] mb-3 shadow-md">
              <AshokaChakra size={52} color="#002875" accentColor="#ff671f" />
            </div>

            <div className="text-xs font-cinzel font-bold text-[#002875] tracking-[0.25em] uppercase">
              REPUBLIC OF INDIA • भारत गणराज्य
            </div>

            <h2 className="font-cinzel text-xl sm:text-2xl font-black text-slate-900 mt-2 tracking-wide uppercase">
              {certificate.authorityName}
            </h2>

            <div className="inline-block mt-2 px-4 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-mono text-[#002875] uppercase tracking-wider font-semibold">
              NATIONAL DIGITAL CREDENTIAL & VERIFIED RECORD
            </div>
          </div>

          {/* Main Certificate Title & Recipient Body */}
          <div className="text-center relative z-10 my-8 space-y-4">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-cinzel font-semibold">
              This is to officially certify and authenticate that
            </p>

            <h3 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#002875] tracking-wider py-1">
              {certificate.recipientName}
            </h3>

            <p className="text-xs font-mono text-slate-500">
              Recipient Identity Ref: <strong className="text-slate-800">{certificate.recipientId}</strong> • Aadhaar Masked: <strong className="text-slate-800">{certificate.recipientAadhaar || 'XXXX-XXXX-4519'}</strong>
            </p>

            <p className="text-sm text-slate-600 max-w-2xl mx-auto pt-2 leading-relaxed">
              Has been duly granted the sovereign recognized certification of
            </p>

            <div className="text-lg sm:text-xl font-bold font-cinzel text-[#002875] tracking-wide py-2.5 px-6 rounded-xl bg-blue-50 border border-blue-200 max-w-xl mx-auto shadow-sm">
              {certificate.title}
            </div>

            {/* Custom Sector Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-4 text-left">
              {Object.entries(certificate.details || {}).map(([key, val]) => (
                <div key={key} className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">{key}</div>
                  <div className="text-xs font-bold text-slate-800 truncate mt-0.5" title={val}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Verification & Signatures Bar */}
          <div className="relative z-10 pt-8 border-t border-slate-200 mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Left: Tamper-Proof QR Code */}
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-white shadow-md border-2 border-[#002875]">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Verification QR Code" className="w-24 h-24" />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 flex items-center justify-center text-xs text-black">
                    Generating QR...
                  </div>
                )}
              </div>
              <div className="text-left text-xs">
                <div className="font-bold text-[#002875] flex items-center gap-1">
                  <ShieldCheck size={14} className="text-[#138808]" /> Scan with Any Device
                </div>
                <div className="text-[11px] text-slate-500 mt-1 max-w-[180px]">
                  Directly routes to public zero-trust verifier at bharosa.gov.in
                </div>
              </div>
            </div>

            {/* Middle: Sovereign Stamp Seal */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#002875] flex flex-col items-center justify-center p-2 text-center text-[#002875] rotate-[-8deg] shadow-sm bg-white">
                <span className="text-[8px] font-mono tracking-tighter uppercase font-bold">SOVEREIGN SEAL</span>
                <AshokaChakra size={22} color="#002875" accentColor="#ff671f" />
                <span className="text-[8px] font-mono font-bold text-[#138808]">GOI VALIDATED</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-2 font-mono">Issued: {certificate.issueDate}</span>
            </div>

            {/* Right: Digital Signature Seal */}
            <div className="text-center sm:text-right">
              <div className="font-cinzel text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">
                Authorized Cryptographic Signatory
              </div>
              <div className="font-serif italic text-lg text-[#002875] font-bold">
                Controller of Certifications
              </div>
              <div className="text-[11px] font-mono text-[#138808] flex items-center justify-center sm:justify-end gap-1 mt-1 font-semibold">
                <CheckCircle2 size={13} /> PKI Signed (RSA-4096)
              </div>
            </div>

          </div>

          {/* Cryptographic SHA-256 Fingerprint Bar */}
          <div className="relative z-10 mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-mono text-[10px] text-slate-500 uppercase font-bold">SHA-256 HASH:</span>
              <span className="font-mono text-[11px] text-[#002875] font-bold truncate max-w-sm" title={certificate.sha256}>
                {certificate.sha256}
              </span>
            </div>

            <button
              onClick={handleCopyHash}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 cursor-pointer"
            >
              {copiedHash ? <Check size={12} className="text-[#138808]" /> : <Copy size={12} />}
              <span>{copiedHash ? 'Copied!' : 'Copy Hash'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
