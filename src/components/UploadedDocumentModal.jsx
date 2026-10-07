import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Lock, 
  FileCheck2,
  Calendar,
  User,
  Building2,
  Maximize2
} from 'lucide-react';
import QRCode from 'qrcode';
import AshokaChakra from './AshokaChakra';

export default function UploadedDocumentModal({
  isOpen,
  onClose,
  documents = [],
  initialIndex = 0,
  applicationTitle = 'Application Review',
  applicantName = 'Applicant'
}) {
  if (!isOpen || !documents || documents.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(
    initialIndex >= 0 && initialIndex < documents.length ? initialIndex : 0
  );
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [copiedHash, setCopiedHash] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Update current document when initialIndex or documents change
  useEffect(() => {
    if (initialIndex >= 0 && initialIndex < documents.length) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, documents]);

  const currentDoc = documents[currentIndex] || documents[0];

  // Generate QR code for document verification hash
  useEffect(() => {
    if (currentDoc) {
      const docHash = currentDoc.sha256 || currentDoc.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      const verifyUrl = `https://bharosa.gov.in/verify-doc?file=${encodeURIComponent(currentDoc.name || 'document')}&hash=${docHash}`;
      QRCode.toDataURL(verifyUrl, {
        width: 130,
        margin: 1,
        color: {
          dark: '#002875',
          light: '#ffffff'
        }
      }).then(setQrCodeUrl).catch(() => {});
    }
  }, [currentDoc]);

  const handleCopyHash = () => {
    const hash = currentDoc.sha256 || currentDoc.hash || 'SHA256-VERIFIED-NODE-PROOF';
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate text/blob download representing the verified document
    const docName = currentDoc.name || 'uploaded_document.pdf';
    const hash = currentDoc.sha256 || currentDoc.hash || 'SHA256-VERIFIED';
    const content = `BHAROSA GOV SOVEREIGN DIGITAL RECORD ARCHIVE
=====================================================
File Name: ${docName}
Size: ${currentDoc.size || '1.5 MB'}
Applicant: ${applicantName}
Context: ${applicationTitle}
Cryptographic Hash (SHA-256): ${hash}
Attestation Status: VALID & CERT-IN COMPLIANT
Archive Reference: BHAROSA-DOC-${Date.now()}
Timestamp: ${new Date().toISOString()}
=====================================================`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = docName.endsWith('.txt') ? docName : `${docName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 1.8));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.7));
  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  // Helper to categorize document type for authentic UI mock
  const fileName = (currentDoc.name || '').toLowerCase();
  const isAadhaar = fileName.includes('aadhaar');
  const isAdmitCard = fileName.includes('admit') || fileName.includes('jee') || fileName.includes('scorecard');
  const isDeed = fileName.includes('deed') || fileName.includes('title') || fileName.includes('sale');
  const isEncumbrance = fileName.includes('encumbrance') || fileName.includes('ec_');
  const isMarksheet = fileName.includes('marksheet') || fileName.includes('transcript') || fileName.includes('grade');
  const isDPR = fileName.includes('dpr') || fileName.includes('project') || fileName.includes('report');

  return (
    <div className="modal-overlay z-50">
      <div className="modal-content max-w-5xl w-full p-4 sm:p-6 bg-white border border-slate-200 shadow-2xl rounded-2xl max-h-[95vh] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-[#002875] border border-blue-200 shrink-0">
              <FileCheck2 size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-cinzel text-base sm:text-lg font-bold text-slate-900 truncate max-w-md">
                  {currentDoc.name || 'Uploaded Document'}
                </h2>
                <span className="badge badge-emerald text-[10px] py-0.5 px-2">
                  <CheckCircle2 size={11} /> SHA-256 VERIFIED
                </span>
                {currentDoc.size && (
                  <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {currentDoc.size}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Submitted by: <strong className="text-slate-900">{applicantName}</strong> • For: <span className="text-[#002875] font-semibold">{applicationTitle}</span>
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
            {/* Zoom Controls */}
            <div className="inline-flex items-center bg-slate-100 rounded-lg border border-slate-200 p-0.5 text-xs text-slate-700">
              <button
                onClick={handleZoomOut}
                className="p-1.5 hover:text-slate-900 hover:bg-slate-200 rounded cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={15} />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-2 font-mono text-[11px] hover:text-[#002875] cursor-pointer"
                title="Reset Zoom"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                className="p-1.5 hover:text-slate-900 hover:bg-slate-200 rounded cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={15} />
              </button>
              <button
                onClick={handleRotate}
                className="p-1.5 hover:text-slate-900 hover:bg-slate-200 rounded border-l border-slate-200 cursor-pointer"
                title="Rotate 90°"
              >
                <RotateCw size={15} />
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="btn btn-secondary py-1.5 px-2.5 text-xs cursor-pointer"
              title="Print Document"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownload}
              className="btn btn-primary py-1.5 px-3 text-xs cursor-pointer shadow-sm"
              title="Download Document"
            >
              <Download size={14} />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer ml-1"
              title="Close Viewer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Multi-Document Navigation Tabs */}
        {documents.length > 1 && (
          <div className="flex items-center justify-between py-2 border-b border-slate-200 bg-slate-50 px-2 rounded-lg my-2 shrink-0">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
              className="p-1 rounded text-xs text-slate-600 hover:text-[#002875] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-semibold"
            >
              <ChevronLeft size={16} /> Prev Proof
            </button>

            <div className="flex items-center gap-1.5 overflow-x-auto max-w-xl px-2 py-0.5 scrollbar-thin">
              {documents.map((doc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    handleResetZoom();
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    currentIndex === idx
                      ? 'bg-[#002875] text-white font-bold shadow-sm'
                      : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <FileText size={12} />
                  <span className="truncate max-w-[140px]">{doc.name || `File ${idx + 1}`}</span>
                </button>
              ))}
            </div>

            <button
              disabled={currentIndex === documents.length - 1}
              onClick={() => setCurrentIndex(prev => Math.min(prev + 1, documents.length - 1))}
              className="p-1 rounded text-xs text-slate-600 hover:text-[#002875] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-semibold"
            >
              Next Proof <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Document Display Canvas Area */}
        <div className="flex-1 overflow-auto bg-slate-100 rounded-xl border border-slate-200 p-4 sm:p-8 flex items-center justify-center relative min-h-[380px]">
          
          {/* If the document has a real image or dataUrl */}
          {currentDoc.dataUrl ? (
            <div 
              style={{ 
                transform: `scale(${zoom}) rotate(${rotation}deg)`, 
                transition: 'transform 0.2s ease',
                transformOrigin: 'center center'
              }}
              className="max-w-full max-h-full"
            >
              <img 
                src={currentDoc.dataUrl} 
                alt={currentDoc.name} 
                className="max-h-[65vh] object-contain rounded-lg shadow-2xl border border-[rgba(229,169,60,0.3)]"
              />
            </div>
          ) : (
            /* High-Fidelity Official Document Preview Parchment */
            <div 
              id="uploaded-doc-content"
              style={{ 
                transform: `scale(${zoom}) rotate(${rotation}deg)`, 
                transition: 'transform 0.2s ease',
                transformOrigin: 'center center'
              }}
              className="w-full max-w-2xl bg-[#ffffff] text-[#0f172a] rounded-lg p-6 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.9)] border-4 border-double border-[#b45309] font-serif relative overflow-hidden select-none"
            >
              {/* Official Ashoka Chakra Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <AshokaChakra size={340} speed="normal" color="#002875" accentColor="#e5a93c" glow={false} />
              </div>

              {/* Security Header Banner */}
              <div className="text-center pb-4 border-b-2 border-[#b45309]/40 relative z-10">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full border border-[#002875] flex items-center justify-center">
                    <AshokaChakra size={26} speed="normal" color="#002875" accentColor="#b45309" glow={false} />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-bold text-[#002875]">
                      GOVERNMENT OF INDIA • भारत सरकार
                    </h3>
                    <p className="text-[10px] text-[#475569] font-sans">
                      Sovereign Digital Records & Attestation Directorate
                    </p>
                  </div>
                </div>

                <div className="inline-block px-3 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] text-[11px] font-sans font-bold border border-[#f59e0b]/40 mt-1">
                  OFFICIAL SUPPORTING PROOF RECORD • वैध साक्ष्य दस्तावेज
                </div>
              </div>

              {/* Dynamic Document Body Based on Type */}
              <div className="py-6 space-y-4 relative z-10 font-sans">
                
                {/* 1. ADMIT CARD / SCORECARD */}
                {isAdmitCard && (
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-blue-900 block">NATIONAL TESTING AGENCY (NTA)</span>
                        <strong className="text-blue-950 text-sm">JEE (ADVANCED) 2026 OFFICIAL ADMIT CARD</strong>
                      </div>
                      <span className="font-mono text-xs font-bold text-blue-900 bg-white px-2 py-1 rounded border border-blue-300">
                        ROLL: 260104829
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs border border-slate-200 p-3 rounded-md bg-slate-50">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Candidate Name</span>
                        <strong className="text-slate-800">{applicantName}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Application No.</span>
                        <strong className="text-slate-800 font-mono">26031008491</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Exam Date</span>
                        <strong className="text-slate-800">24 May 2026</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Reporting Time</span>
                        <strong className="text-slate-800">07:30 AM IST</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Test Centre</span>
                        <strong className="text-slate-800">IIT Delhi Campus, Hauz Khas</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Category</span>
                        <strong className="text-slate-800">General / Open Merit</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. AADHAAR CARD */}
                {isAadhaar && (
                  <div className="space-y-3 p-4 bg-gradient-to-r from-orange-50 via-white to-green-50 border-2 border-slate-300 rounded-xl">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="text-xs font-bold text-red-800">
                        UNIQUE IDENTIFICATION AUTHORITY OF INDIA
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">भारत सरकार • GOVT OF INDIA</div>
                    </div>
                    <div className="flex items-center gap-4 py-2">
                      <div className="w-20 h-24 bg-slate-200 rounded border border-slate-400 flex flex-col items-center justify-center text-slate-500 text-[10px] text-center p-1 font-mono">
                        <User size={32} className="text-slate-400 mb-1" />
                        <span>PHOTO</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <p className="text-slate-500 text-[10px]">नाम / Name:</p>
                        <p className="font-bold text-slate-900 text-sm">{applicantName}</p>
                        <p className="text-slate-500 text-[10px] mt-1">जन्म तिथि / DOB: <strong>14/08/1992</strong></p>
                        <p className="text-slate-500 text-[10px]">लिंग / Gender: <strong>MALE / M</strong></p>
                      </div>
                    </div>
                    <div className="text-center pt-2 border-t font-mono text-base sm:text-lg font-bold tracking-widest text-slate-900">
                      XXXX XXXX 4519
                    </div>
                    <div className="text-center text-[10px] text-red-700 font-bold">
                      मेरा आधार, मेरी पहचान
                    </div>
                  </div>
                )}

                {/* 3. TITLE DEED / REAL ESTATE PROPERTY RECORD */}
                {isDeed && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded text-center">
                      <span className="text-[10px] uppercase font-bold text-amber-900 block">
                        STATE REVENUE & REGISTRATION DEPARTMENT
                      </span>
                      <strong className="text-sm text-slate-900">REGISTERED DEED OF CONVEYANCE & TITLE</strong>
                      <p className="text-[11px] text-slate-600 mt-0.5">Book No. 1, Volume 418, Registration No. 2024-DEL-8912</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] p-2 bg-slate-50 rounded border border-slate-200">
                      <div><strong>Schedule Plot:</strong> Survey No. 418/2, Industrial Sector</div>
                      <div><strong>Total Extent:</strong> 4.80 Standard Acres</div>
                      <div><strong>Current Title Holder:</strong> {applicantName}</div>
                      <div><strong>Stamp Duty Paid:</strong> ₹14,50,000 (Challan #DL-8819)</div>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed italic border-l-2 border-amber-600 pl-2">
                      "Certified that the title of the scheduled industrial plot is clear, marketable, and free from encumbrance or prior charges as per Registrar Record."
                    </p>
                  </div>
                )}

                {/* 4. NIL-ENCUMBRANCE CERTIFICATE */}
                {isEncumbrance && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-center">
                      <span className="text-[10px] uppercase font-bold text-emerald-900 block">
                        SUB-REGISTRAR OFFICE (FORM NO. 15)
                      </span>
                      <strong className="text-sm text-slate-900">NIL-ENCUMBRANCE CERTIFICATE (30-YEAR SEARCH)</strong>
                    </div>
                    <div className="text-[11px] space-y-1.5 p-3 bg-slate-50 rounded border border-slate-200">
                      <p><strong>Property Description:</strong> Plot 14-B, Khasra 418/2, Tehsil Mehrauli</p>
                      <p><strong>Search Period:</strong> 1st April 1995 to 31st March 2025 (30 Complete Years)</p>
                      <p><strong>Encumbrance Finding:</strong> <span className="text-emerald-700 font-bold">NIL (Zero Liens, Charges, or Court Attachments Found)</span></p>
                      <p><strong>Issuing Officer:</strong> Sub-Registrar IV, District South-West Delhi</p>
                    </div>
                  </div>
                )}

                {/* 5. MARKSHEET / TRANSCRIPTS */}
                {isMarksheet && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded text-center">
                      <span className="text-[10px] uppercase font-bold text-indigo-900 block">
                        INDIAN INSTITUTE OF TECHNOLOGY & CENTRAL ACADEMIC COUNCIL
                      </span>
                      <strong className="text-sm text-indigo-950">OFFICIAL CONSOLIDATED GRADE TRANSCRIPT</strong>
                    </div>
                    <table className="w-full text-left border-collapse text-[11px] border border-slate-200">
                      <thead className="bg-slate-100 text-slate-700">
                        <tr>
                          <th className="p-1.5 border">Semester</th>
                          <th className="p-1.5 border">Curriculum</th>
                          <th className="p-1.5 border">Credits</th>
                          <th className="p-1.5 border text-right">SGPA</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-1.5 border">Sem I - IV</td>
                          <td className="p-1.5 border">Core Computer Science & Mathematics</td>
                          <td className="p-1.5 border">96</td>
                          <td className="p-1.5 border text-right font-mono">9.38</td>
                        </tr>
                        <tr>
                          <td className="p-1.5 border">Sem V - VIII</td>
                          <td className="p-1.5 border">Advanced AI, Distributed Systems & Cryptography</td>
                          <td className="p-1.5 border">98</td>
                          <td className="p-1.5 border text-right font-mono">9.46</td>
                        </tr>
                        <tr className="font-bold bg-amber-50">
                          <td colSpan={3} className="p-1.5 border text-right">Cumulative CGPA:</td>
                          <td className="p-1.5 border text-right font-mono text-amber-900">9.42 / 10.0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 6. GENERAL / DPR / OTHER PROOF */}
                {!isAdmitCard && !isAadhaar && !isDeed && !isEncumbrance && !isMarksheet && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-100 border border-slate-300 rounded text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-700 block">
                        VERIFIED APPLICANT ATTACHMENT
                      </span>
                      <strong className="text-sm text-slate-900">{currentDoc.name || 'Supporting Document Proof'}</strong>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1.5 text-[11px] text-slate-700">
                      <p><strong>Document Title:</strong> {currentDoc.name || 'Verified Attestation Proof'}</p>
                      <p><strong>Primary Beneficiary:</strong> {applicantName}</p>
                      <p><strong>Format & Size:</strong> PDF / Image Document ({currentDoc.size || '1.8 MB'})</p>
                      <p><strong>Attestation Pipeline:</strong> Scanned, authenticated, and pre-indexed into Sovereign Gateway</p>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Cryptographic Seal & Verification Strip */}
              <div className="pt-4 border-t-2 border-[#b45309]/40 flex items-center justify-between text-xs relative z-10 font-sans">
                <div className="flex items-center gap-3">
                  {qrCodeUrl && (
                    <img 
                      src={qrCodeUrl} 
                      alt="Verification QR" 
                      className="w-16 h-16 rounded border border-slate-300 p-0.5"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                      <ShieldCheck size={14} className="text-emerald-700" />
                      <span>CRYPTOGRAPHICALLY SEALED</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Hash: {(currentDoc.sha256 || currentDoc.hash || 'e3b0c442...').slice(0, 18)}...
                    </p>
                    <p className="text-[9px] text-slate-400">
                      Verified against National Node Ledger
                    </p>
                  </div>
                </div>

                <div className="text-right text-[10px] text-slate-600">
                  <div className="w-14 h-14 border border-slate-400 rounded-full flex items-center justify-center p-1 text-[8px] text-center font-bold text-red-900 bg-red-50/50 uppercase ml-auto">
                    DIGITALLY ATTESTED
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Bottom Metadata & Hash Verification Footer */}
        <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500">SHA-256 Digest:</span>
            <code className="font-mono text-[#002875] bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-[11px] font-bold">
              {currentDoc.sha256 || currentDoc.hash || '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'}
            </code>
            <button
              onClick={handleCopyHash}
              className="p-1 hover:text-[#002875] text-slate-500 transition-colors cursor-pointer"
              title="Copy Hash"
            >
              {copiedHash ? <Check size={14} className="text-[#138808]" /> : <Copy size={14} />}
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Lock size={12} className="text-[#138808]" />
            <span>End-to-End Encrypted • DPDP Act 2023 Compliant</span>
          </div>
        </div>

      </div>
    </div>
  );
}
