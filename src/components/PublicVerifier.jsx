import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  QrCode, 
  UploadCloud, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Key, 
  Lock, 
  Copy, 
  Check, 
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import AshokaChakra from './AshokaChakra';

export default function PublicVerifier({
  certificates = [],
  onViewCertificate,
  onBackToDashboard,
  language = 'EN'
}) {
  const [verifyMode, setVerifyMode] = useState('id'); // 'id' | 'qr' | 'pdf'
  const [certIdInput, setCertIdInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null); // null | 'valid' | 'invalid'
  const [matchedCertificate, setMatchedCertificate] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [copiedHash, setCopiedHash] = useState(false);

  // Handle Verify by Certificate ID
  const handleVerifyById = (idToVerify) => {
    const id = idToVerify || certIdInput.trim();
    if (!id) return;

    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      const found = certificates.find(c => 
        c.id.toLowerCase() === id.toLowerCase() || 
        c.sha256?.toLowerCase() === id.toLowerCase()
      );

      if (found) {
        setMatchedCertificate(found);
        setVerificationResult('valid');
      } else {
        setMatchedCertificate(null);
        setVerificationResult('invalid');
      }
    }, 1200);
  };

  // Handle Simulate QR Scan
  const handleSimulateQrScan = () => {
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      if (certificates.length > 0) {
        const randomCert = certificates[Math.floor(Math.random() * certificates.length)];
        setMatchedCertificate(randomCert);
        setVerificationResult('valid');
        setCertIdInput(randomCert.id);
      } else {
        setVerificationResult('invalid');
      }
    }, 1600);
  };

  // Handle Simulate PDF Upload
  const handleSimulatePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      // Simulate matching with first certificate
      if (certificates.length > 0) {
        setMatchedCertificate(certificates[0]);
        setVerificationResult('valid');
        setCertIdInput(certificates[0].id);
      } else {
        setVerificationResult('invalid');
      }
    }, 1800);
  };

  const handleCopyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {onBackToDashboard && (
        <div>
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#002875] transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>{language === 'EN' ? 'Return to Dashboard' : 'डैशबोर्ड पर वापस जाएं'}</span>
          </button>
        </div>
      )}

      {/* Sovereign Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#002875] text-xs font-mono font-semibold">
          <ShieldCheck size={14} />
          <span>ZERO-KNOWLEDGE PUBLIC TRUST REGISTRY</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-wide">
          {language === 'EN' ? 'Document Verifier' : 'दस्तावेज़ सत्यापन (Document Verifier)'}
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          {language === 'EN' 
            ? 'Instant cryptographic validation of any Indian sovereign credential. Verify authenticity, issuing authority digital signature, and revocation ledger in milliseconds.'
            : 'किसी भी भारतीय संप्रभु प्रमाणपत्र का त्वरित सत्यापन। डिजिटल हस्ताक्षर और प्रमाणिकता तुरंत जांचें।'}
        </p>
      </div>

      {/* Verification Mode Selector */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200 shadow-sm">
          <button
            onClick={() => { setVerifyMode('id'); setVerificationResult(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              verifyMode === 'id' 
                ? 'bg-[#002875] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search size={15} />
            <span>By Certificate ID</span>
          </button>

          <button
            onClick={() => { setVerifyMode('qr'); setVerificationResult(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              verifyMode === 'qr' 
                ? 'bg-[#002875] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode size={15} />
            <span>Scan Sovereign QR</span>
          </button>

          <button
            onClick={() => { setVerifyMode('pdf'); setVerificationResult(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              verifyMode === 'pdf' 
                ? 'bg-[#002875] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud size={15} />
            <span>Upload Document PDF (SHA-256)</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Search by ID */}
      {verifyMode === 'id' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-md space-y-4">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
            Enter Sovereign Certificate ID or SHA-256 Hash
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#002875]" />
              <input
                type="text"
                placeholder="e.g. IITB-CSE-2025-0891 or MH-DOM-2025-88410"
                value={certIdInput}
                onChange={(e) => setCertIdInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyById()}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#002875] focus:outline-none"
              />
            </div>
            <button
              onClick={() => handleVerifyById()}
              disabled={isVerifying || !certIdInput.trim()}
              className="btn btn-primary sm:w-auto w-full px-6 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {isVerifying ? (
                <>
                  <AshokaChakra size={18} speed="fast" color="#ffffff" />
                  <span>Verifying Ledger...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Cryptographic Verify</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: QR Scanner Simulation */}
      {verifyMode === 'qr' && (
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-md text-center space-y-5">
          <div className="w-56 h-56 mx-auto relative rounded-2xl border-2 border-dashed border-[#002875] bg-slate-50 flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-blue-500/10 pointer-events-none animate-pulse"></div>
            
            {/* Radar scanner sweep line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#002875] to-transparent animate-[radarSweep_3s_linear_infinite]"></div>

            <QrCode size={80} className="text-slate-400" />
            <span className="text-[11px] text-slate-500 mt-3 font-mono">Align Sovereign QR Code</span>
          </div>

          <button
            onClick={handleSimulateQrScan}
            disabled={isVerifying}
            className="btn btn-primary px-6 flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-sm"
          >
            {isVerifying ? (
              <>
                <AshokaChakra size={18} speed="fast" color="#ffffff" />
                <span>Decoding Sovereign QR...</span>
              </>
            ) : (
              <>
                <QrCode size={16} />
                <span>Scan Sovereign QR Code</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Mode 3: PDF SHA-256 Upload */}
      {verifyMode === 'pdf' && (
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-md text-center space-y-4">
          <label className="block border-2 border-dashed border-slate-300 hover:border-[#002875] rounded-2xl p-8 bg-slate-50 hover:bg-slate-100/70 cursor-pointer transition-all">
            <input 
              type="file" 
              accept=".pdf,.png,.jpg" 
              className="hidden" 
              onChange={handleSimulatePdfUpload}
            />
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-3.5 rounded-2xl bg-blue-50 text-[#002875] border border-blue-200">
                <UploadCloud size={36} />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">
                  Drop certificate PDF here or click to browse
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  SHA-256 checksum is computed client-side without uploading document contents to external servers.
                </p>
              </div>
              {uploadedFileName && (
                <span className="text-xs font-mono text-[#002875] px-3 py-1 rounded bg-blue-50 border border-blue-200 font-semibold">
                  {uploadedFileName}
                </span>
              )}
            </div>
          </label>
        </div>
      )}

      {/* Verification Result Card */}
      {verificationResult === 'valid' && matchedCertificate && (
        <div className="rounded-2xl border-2 border-emerald-500 bg-white p-6 sm:p-8 space-y-6 shadow-xl animate-fadeIn">
          
          {/* Header Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    OFFICIALLY AUTHENTIC & VALID
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Block #{matchedCertificate.blockHeight || '14892104'}</span>
                </div>
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  {matchedCertificate.title}
                </h2>
              </div>
            </div>

            <button
              onClick={() => onViewCertificate(matchedCertificate.id)}
              className="btn btn-primary flex items-center justify-center gap-2 text-xs font-bold cursor-pointer shadow-sm"
            >
              <FileText size={15} />
              <span>Inspect Full Royal Document</span>
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block uppercase text-[10px] font-mono">Issued To (Beneficiary)</span>
              <span className="font-semibold text-sm text-slate-900 block mt-1">{matchedCertificate.recipientName}</span>
              <span className="text-[11px] text-slate-500 font-mono">Aadhaar Ref: {matchedCertificate.recipientAadhaarMasked || 'XXXX-XXXX-4912'}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block uppercase text-[10px] font-mono">Accredited Issuing Authority</span>
              <span className="font-semibold text-sm text-[#002875] block mt-1">{matchedCertificate.issuingAuthority}</span>
              <span className="text-[11px] text-slate-500">Sector: {matchedCertificate.sectorId}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block uppercase text-[10px] font-mono">Issuance Date & Status</span>
              <span className="font-semibold text-sm text-emerald-700 block mt-1">{matchedCertificate.issuedOn}</span>
              <span className="text-[11px] text-slate-500">{matchedCertificate.validity || 'Permanent Lifetime Validity'}</span>
            </div>
          </div>

          {/* SHA-256 Cryptographic Hash */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 overflow-hidden">
              <span className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1 font-semibold">
                <Lock size={12} className="text-[#002875]" /> Cryptographic SHA-256 Ledger Fingerprint
              </span>
              <p className="font-mono text-xs text-[#002875] font-bold truncate">
                {matchedCertificate.sha256}
              </p>
            </div>
            <button
              onClick={() => handleCopyHash(matchedCertificate.sha256)}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-sm"
            >
              {copiedHash ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              <span>{copiedHash ? 'Hash Copied!' : 'Copy Hash'}</span>
            </button>
          </div>

        </div>
      )}

      {/* Invalid Result Card */}
      {verificationResult === 'invalid' && (
        <div className="rounded-2xl border-2 border-rose-400 bg-rose-50 p-6 sm:p-8 space-y-4 text-center animate-fadeIn shadow-md">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-rose-100 text-rose-600 border border-rose-200">
              <XCircle size={36} />
            </div>
          </div>
          <h2 className="font-cinzel text-xl font-bold text-rose-700">
            No Record Found on Sovereign Ledger
          </h2>
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            The Certificate ID or digital fingerprint did not match any active or archived sovereign records in the Government of India BHAROSA blockchain consensus. Check ID for typographical errors.
          </p>
        </div>
      )}

    </div>
  );
}
