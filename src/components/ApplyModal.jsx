import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ShieldCheck, 
  CreditCard, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  HelpCircle,
  Building2,
  FileCheck,
  Lock,
  Eye,
  Sparkles,
  Sliders,
  Layers,
  AlertTriangle,
  RotateCw,
  FolderCheck,
  GraduationCap,
  KeyRound
} from 'lucide-react';
import AshokaChakra from './AshokaChakra';
import AutoFitModal from './AutoFitModal';
import MultiImagePdfModal from './MultiImagePdfModal';
import AutoFillOtpModal from './AutoFillOtpModal';
import AutoProcureModal from './AutoProcureModal';
import { DOCUMENT_SPECS } from '../data/autoFillSpecs';

export default function ApplyModal({
  isOpen,
  onClose,
  sectors = [],
  onSubmitApplication,
  currentUser,
  lockerDocuments = [],
  profile = null,
  autoFillConsent = true,
  onViewUploadedDocs,
  onOpenDigiLockerAnalysis,
  onOpenExaminations,
  initialStep = 1,
  onAddLockerDocument,
  onNotify
}) {
  if (!isOpen) return null;

  const [step, setStep] = useState(initialStep || 1); // 1: Sector & Doc, 2: Applicant Data, 3: Required Docs, 4: Tatkal & Payment, 5: Processing
  const [selectedSectorId, setSelectedSectorId] = useState(sectors[0]?.id || 'education');
  const [selectedDocId, setSelectedDocId] = useState('');
  
  // Sync initialStep whenever modal opens or initialStep changes
  useEffect(() => {
    if (isOpen && initialStep) {
      setStep(initialStep);
    }
  }, [isOpen, initialStep]);

  // Auto-Fill & Conflict Resolution State
  const [nameChoice, setNameChoice] = useState(profile?.name?.value || currentUser?.name || 'Aarav Sharma');
  const [hasResolvedConflict, setHasResolvedConflict] = useState(false);
  const [showAutoFillBanner, setShowAutoFillBanner] = useState(true);
  const [profileUpdatedToast, setProfileUpdatedToast] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [procureModalOpen, setProcureModalOpen] = useState(false);
  const [missingProcureItem, setMissingProcureItem] = useState(null);

  // Form fields (pre-populated from profile vault)
  const [formData, setFormData] = useState({
    fullName: profile?.name?.value || currentUser?.name || 'Aarav Sharma',
    aadhaarNumber: profile?.aadhaarNumber?.value || 'XXXX-XXXX-4519',
    fatherSpouseName: profile?.fatherName?.value || 'Suresh Sharma',
    mobileNumber: profile?.mobileNumber?.value || currentUser?.phone || '+91 98765 43210',
    email: profile?.email?.value || 'aarav.sharma@gov.in',
    state: profile?.state?.value || 'Maharashtra',
    district: profile?.district?.value || 'Mumbai City',
    pincode: profile?.pincode?.value || '400076',
    customFields: {}
  });

  // Keep form data synchronized when profile is updated by DigiLocker analysis
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        fullName: profile.name?.value || prev.fullName,
        aadhaarNumber: profile.aadhaarNumber?.value || prev.aadhaarNumber,
        fatherSpouseName: profile.fatherName?.value || prev.fatherSpouseName,
        mobileNumber: profile.mobileNumber?.value || prev.mobileNumber,
        email: profile.email?.value || prev.email,
        state: profile.state?.value || prev.state,
        district: profile.district?.value || prev.district,
        pincode: profile.pincode?.value || prev.pincode,
      }));
      if (profile.name?.value) {
        setNameChoice(profile.name.value);
      }
    }
  }, [profile]);

  // Uploaded documents tracking
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isHashing, setIsHashing] = useState(false);

  // Auto-Fit Modal State
  const [autoFitModalOpen, setAutoFitModalOpen] = useState(false);
  const [autoFitTargetFile, setAutoFitTargetFile] = useState(null);
  const [autoFitTargetSpec, setAutoFitTargetSpec] = useState(DOCUMENT_SPECS.photo);
  const [activeSlotIdForAutoFit, setActiveSlotIdForAutoFit] = useState(null);

  // Multi-Image PDF Modal State
  const [multiPdfModalOpen, setMultiPdfModalOpen] = useState(false);
  const [multiPdfSlotId, setMultiPdfSlotId] = useState(null);

  // Tatkal selection
  const [tatkalSpeed, setTatkalSpeed] = useState('standard'); // 'standard' | 'express_24' | 'flash_4'

  const currentSector = sectors.find(s => s.id === selectedSectorId) || sectors[0];
  const docTypes = currentSector?.documentTypes || [];
  const currentDoc = docTypes.find(d => d.id === selectedDocId) || docTypes[0] || null;

  // Initialize selectedDocId if empty
  useEffect(() => {
    if (docTypes.length > 0 && !selectedDocId) {
      setSelectedDocId(docTypes[0].id);
    }
  }, [docTypes, selectedDocId]);

  // Fee calculation
  const baseFee = currentDoc?.baseFee || 100;
  const tatkalFee = tatkalSpeed === 'flash_4' ? 500 : tatkalSpeed === 'express_24' ? 250 : 0;
  const convenienceFee = 15;
  const gst = Math.round((baseFee + tatkalFee + convenienceFee) * 0.18);
  const totalPayable = baseFee + tatkalFee + convenienceFee + gst;

  // Tatkal Clearance Probability & Refund Guarantee calculations
  const getTatkalProbabilityData = (speed) => {
    if (speed === 'standard') {
      return {
        score: '99.8%',
        percent: 99.8,
        rating: 'Standard Scrutiny',
        color: 'text-slate-700',
        factors: ['Statutory departmental queue', 'Standard 3-5 business days scrutiny window']
      };
    }
    const isFlash = speed === 'flash_4';
    let base = isFlash ? 93.4 : 96.6;
    if (isOtpVerified) base += 2.6;
    if (profile?.name?.value) base += 1.0;
    if (Object.keys(uploadedFiles).length >= 2) base += 1.4;
    const finalScore = Math.min(99.6, Number(base.toFixed(1)));
    return {
      score: `${finalScore}%`,
      percent: finalScore,
      rating: isFlash ? 'High Emergency Clearance' : 'Near-Certain Express Clearance',
      color: isFlash ? 'text-amber-600' : 'text-[#FF671F]',
      factors: [
        'Aadhaar e-KYC Identity Authenticated (+2.6% probability boost)',
        'Zero-Rejection Auto-Fitted Proofs Attached (+1.4% boost)',
        'Live Scrutiny Desk: 14 Active Officers on Priority Queue',
        `Guaranteed SLA: Within ${isFlash ? '4 Hours' : '24 Hours'} Max Delivery`
      ]
    };
  };

  const tatkalProbData = getTatkalProbabilityData(tatkalSpeed);
  const tatkalProcessingDeduction = tatkalFee > 0 ? 50 : 0;
  const tatkalGuaranteedRefund = Math.max(0, tatkalFee - tatkalProcessingDeduction);
  const tatkalSlaTargetHours = tatkalSpeed === 'flash_4' ? 4 : tatkalSpeed === 'express_24' ? 24 : 120;
  const tatkalDeadlineFormatted = new Date(Date.now() + tatkalSlaTargetHours * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  // Helper to get slot spec
  const getSlotSpec = (reqDoc) => {
    const id = reqDoc.id.toLowerCase();
    if (id.includes('photo')) return DOCUMENT_SPECS.photo;
    if (id.includes('sig')) return DOCUMENT_SPECS.signature;
    if (id.includes('deed')) return DOCUMENT_SPECS.property_deed;
    if (id.includes('id') || id.includes('aadhaar') || id.includes('pan')) return DOCUMENT_SPECS.id_proof;
    if (id.includes('residence') || id.includes('domicile') || id.includes('address')) return DOCUMENT_SPECS.address_proof;
    return DOCUMENT_SPECS.academic_degree;
  };

  // Find best matching document in locker
  const findLockerMatch = (reqDoc) => {
    const spec = getSlotSpec(reqDoc);
    return lockerDocuments.find(d => {
      if (d.isNonCompliant) return false;
      if (d.docType === spec.id) return true;
      if (spec.id === 'photo' && (d.docType === 'photo' || d.name?.toLowerCase().includes('photo'))) return true;
      if (spec.id === 'signature' && (d.docType === 'signature' || d.name?.toLowerCase().includes('sig'))) return true;
      if (spec.id === 'id_proof' && (d.docType === 'id_proof' || d.category === 'identity' || d.name?.toLowerCase().includes('aadhaar'))) return true;
      if (spec.id === 'academic_degree' && (d.docType === 'academic_degree' || d.category === 'education' || d.name?.toLowerCase().includes('degree') || d.name?.toLowerCase().includes('cbse') || d.name?.toLowerCase().includes('transcript') || d.name?.toLowerCase().includes('marksheet'))) return true;
      return false;
    }) || null;
  };

  // Automatically pre-attach matching documents from verified DigiLocker
  useEffect(() => {
    if (!currentDoc || !autoFillConsent) return;
    const requiredDocsList = currentDoc.requiredDocs || [
      { id: 'transcripts', title: 'Institutional Qualifying Record / Certificate Proof', mandatory: true },
      { id: 'photo', title: 'Passport Size Photograph (Recent Color)', mandatory: true },
      { id: 'signature', title: 'Applicant Specimen Signature', mandatory: true },
      { id: 'id_proof', title: 'Official Government Identity Card (Aadhaar/PAN)', mandatory: true }
    ];

    setUploadedFiles(prev => {
      const next = { ...prev };
      let updated = false;

      requiredDocsList.forEach(req => {
        if (!next[req.id]) {
          const match = findLockerMatch(req);
          if (match) {
            next[req.id] = {
              name: match.name,
              size: match.sizeFormatted,
              sha256: match.sha256,
              hash: `${match.sha256.substring(0, 8)}...${match.sha256.substring(match.sha256.length - 4)}`,
              dataUrl: match.dataUrl || match.previewUrl || null,
              isFromLocker: true,
              verifiedBadge: match.verifiedBadge || 'auto_fitted',
              operationsApplied: match.operationsApplied || ['Auto-Attached from Verified DigiLocker', 'Zero-Rejection Compliant']
            };
            updated = true;
          }
        }
      });

      return updated ? next : prev;
    });
  }, [currentDoc, lockerDocuments, autoFillConsent]);

  // 1-Click attach from locker
  const handleAttachFromLocker = (slotId, lockerDoc) => {
    setUploadedFiles(prev => ({
      ...prev,
      [slotId]: {
        name: lockerDoc.name,
        size: lockerDoc.sizeFormatted,
        sha256: lockerDoc.sha256,
        hash: `${lockerDoc.sha256.substring(0, 8)}...${lockerDoc.sha256.substring(lockerDoc.sha256.length - 4)}`,
        dataUrl: lockerDoc.dataUrl || null,
        isFromLocker: true,
        verifiedBadge: lockerDoc.verifiedBadge,
        operationsApplied: lockerDoc.operationsApplied || ['Sourced from Verified Locker']
      }
    }));
  };

  // Open Auto-Fit modal for a slot
  const handleOpenAutoFitForSlot = (slotId, fileToFit = null) => {
    const reqDoc = (currentDoc?.requiredDocs || []).find(r => r.id === slotId) || { id: slotId };
    const spec = getSlotSpec(reqDoc);
    setActiveSlotIdForAutoFit(slotId);
    setAutoFitTargetSpec(spec);

    if (fileToFit) {
      setAutoFitTargetFile(fileToFit);
    } else {
      // Find non-compliant demo sample or create mock
      const sample = lockerDocuments.find(d => d.isNonCompliant && d.docType === spec.id) ||
        lockerDocuments.find(d => d.isNonCompliant) || {
          name: 'Demo_Uncalibrated_Upload.jpg',
          size: 3400 * 1024,
          dimensions: '2400 × 3200 px',
          type: 'image/jpeg'
        };
      setAutoFitTargetFile(sample);
    }
    setAutoFitModalOpen(true);
  };

  // Handle applied auto-fit result
  const handleApplyFixedResult = (fixedResult) => {
    if (!activeSlotIdForAutoFit) return;
    setUploadedFiles(prev => ({
      ...prev,
      [activeSlotIdForAutoFit]: {
        name: fixedResult.name,
        size: fixedResult.sizeFormatted,
        sha256: fixedResult.fixedHash,
        hash: `${fixedResult.fixedHash.substring(0, 8)}...`,
        dataUrl: fixedResult.dataUrl,
        isAutoFitted: true,
        verifiedBadge: 'auto_fitted',
        operationsApplied: fixedResult.operationsApplied
      }
    }));
    setAutoFitModalOpen(false);
  };

  // Handle multi-image merge result
  const handleApplyMergedPdf = (pdfResult) => {
    if (!multiPdfSlotId) return;
    setUploadedFiles(prev => ({
      ...prev,
      [multiPdfSlotId]: {
        name: pdfResult.name,
        size: pdfResult.sizeFormatted,
        sha256: pdfResult.sha256,
        hash: `${pdfResult.sha256.substring(0, 8)}...`,
        isMergedPdf: true,
        verifiedBadge: 'auto_fitted',
        operationsApplied: pdfResult.operationsApplied
      }
    }));
    setMultiPdfModalOpen(false);
  };

  // Handle manual file selection with auto-compliance check
  const handleFileChange = (slotId, file) => {
    if (!file) return;
    const reqDoc = (currentDoc?.requiredDocs || []).find(r => r.id === slotId) || { id: slotId };
    const spec = getSlotSpec(reqDoc);

    // If file exceeds size or is an image needing dimension fit, open Auto-Fit
    if (file.size > spec.maxSizeBytes || (spec.targetWidth && file.type.startsWith('image/'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleOpenAutoFitForSlot(slotId, {
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: e.target.result
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Direct pass
      setIsHashing(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedFiles(prev => ({
          ...prev,
          [slotId]: {
            name: file.name,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
            hash: '9f86d081...0a08',
            dataUrl: e.target.result,
            verifiedBadge: 'self_uploaded',
            operationsApplied: ['Client-Side Validated']
          }
        }));
        setIsHashing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessSubmission = () => {
    setStep(5);
    setTimeout(() => {
      const newApp = {
        id: `APP-${tatkalSpeed !== 'standard' ? 'TATKAL-' : ''}2026-${Math.floor(1000 + Math.random() * 9000)}`,
        applicantName: formData.fullName,
        aadhaarMasked: formData.aadhaarNumber,
        sectorId: selectedSectorId,
        sectorName: currentSector.name,
        documentTitle: currentDoc.title,
        authorityName: currentSector.authorities[0]?.name || 'Central Directorate',
        status: 'submitted',
        isTatkal: tatkalSpeed !== 'standard',
        tatkalSpeed: tatkalSpeed,
        tatkalFee: tatkalFee,
        tatkalProbability: tatkalProbData.score,
        tatkalRefundPolicy: {
          isCovered: tatkalSpeed !== 'standard',
          slaHours: tatkalSlaTargetHours,
          guaranteedDeadline: `${tatkalDeadlineFormatted} (${tatkalSpeed === 'flash_4' ? '4-Hour Emergency' : '24-Hour Express'})`,
          totalTatkalFee: tatkalFee,
          processingFeeDeducted: tatkalProcessingDeduction,
          guaranteedRefund: tatkalGuaranteedRefund,
          refundStatus: 'ESCROW_ACTIVE'
        },
        submittedOn: 'Just now',
        totalPaid: totalPayable,
        uploadedDocuments: Object.values(uploadedFiles),
        isAutoFilled: true,
        autoFillConfidence: 'High'
      };

      onSubmitApplication(newApp);
      onClose();
    }, 1800);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-4xl p-6 sm:p-8 space-y-6 bg-white border border-slate-200 shadow-2xl rounded-3xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#002875] text-white shadow-md">
              <FileCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#002875] font-bold">
                  STEP {step} OF 4 • SOVEREIGN APPLICATION WIZARD
                </span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300 flex items-center gap-1">
                  <Sparkles size={11} className="text-emerald-600" />
                  Auto-Fit Active
                </span>
              </div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Apply for Sovereign Credential
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2">
          {['1. Select Document', '2. Smart Auto-Fill KYC', '3. Auto-Fit Required Proofs', '4. Priority & Pay'].map((label, idx) => (
            <div key={idx} className="space-y-1">
              <div className={`h-1.5 rounded-full transition-all ${
                step > idx + 1 
                  ? 'bg-[#138808]' 
                  : step === idx + 1 
                  ? 'bg-[#002875]' 
                  : 'bg-slate-200'
              }`} />
              <span className={`text-[10px] block font-mono ${
                step === idx + 1 ? 'text-[#002875] font-bold' : 'text-slate-500'
              }`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: Select Sector & Document */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="input-label text-slate-700 font-bold">Select Sovereign Sector</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sectors.map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => { setSelectedSectorId(sec.id); setSelectedDocId(''); }}
                    className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                      selectedSectorId === sec.id
                        ? 'bg-blue-50 border-[#002875] text-[#002875] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-semibold block">{sec.shortName}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5 truncate">{sec.hindiName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* National Competitive Examination Fast-Track Banner */}
            {selectedSectorId === 'education' && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-[#002875]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#002875] text-white text-[10px] font-mono font-bold">
                    <GraduationCap size={12} />
                    <span>NTA • UPSC • IIT COUNCIL • CBSE EXAMINATIONS</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-[#002875]">
                    National Competitive Examination Registration Portal
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Register for JEE (Main), NEET (UG), UPSC CSE, GATE, CUET &amp; CTET with automatic 3-city center allocation and DigiLocker auto-fill.
                  </p>
                </div>
                {onOpenExaminations && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenExaminations();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#002875] hover:bg-[#0A3D91] text-white text-xs font-bold shrink-0 shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                  >
                    <span>Launch Exam Wizard →</span>
                  </button>
                )}
              </div>
            )}

            <div>
              <label className="input-label text-slate-700 font-bold">Select Target Credential Document</label>
              <div className="space-y-2">
                {docTypes.map(doc => (
                  <label
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedDocId === doc.id
                        ? 'bg-blue-50/70 border-[#002875] text-slate-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <p className="font-semibold text-xs text-slate-900">{doc.title}</p>
                      <p className="text-[11px] text-[#FF671F] font-semibold">Base Fee: ₹{doc.baseFee}</p>
                    </div>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedDocId === doc.id ? 'border-[#002875] bg-[#002875]' : 'border-slate-300'
                    }`}>
                      {selectedDocId === doc.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Smart Auto-Fill Applicant KYC */}
        {step === 2 && (
          <div className="space-y-4">
            
            {/* Flagship Smart Auto-Fill Banner */}
            {showAutoFillBanner && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-300 shadow-xs flex items-start justify-between gap-3 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs mt-0.5">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <span>We auto-filled 6 of 8 fields from your saved Document Locker.</span>
                      <span className="text-[10px] font-mono px-2 py-0.2 bg-emerald-200 text-emerald-900 rounded-full font-bold">
                        98% Confidence
                      </span>
                    </h3>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Your legal name, DOB, father's name, and address are verified against your BHAROSA-signed records.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAutoFillBanner(false)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Sovereign Aadhaar OTP Verification Gate */}
            {!isOtpVerified ? (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-600 text-white shadow-xs mt-0.5">
                    <KeyRound className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-950 flex items-center gap-2">
                      <span>Aadhaar e-KYC OTP Verification Required</span>
                      <span className="text-[10px] font-mono px-2 py-0.2 bg-amber-200 text-amber-900 rounded-full font-bold">
                        DPDP Act 2023
                      </span>
                    </h4>
                    <p className="text-xs text-amber-900 mt-0.5">
                      Verify via 6-digit Aadhaar OTP sent to your registered mobile before releasing auto-filled attributes.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowOtpModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#002875] hover:bg-[#0A3D91] text-white text-xs font-bold shrink-0 shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                >
                  <ShieldCheck size={14} />
                  <span>Verify OTP to Auto-Fill →</span>
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-950 font-bold">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Aadhaar e-KYC OTP Verified • KYC Attributes Authorized &amp; Auto-Filled</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded font-bold">
                  Session Token Active
                </span>
              </div>
            )}

            {/* Conflict Resolver Banner (Name Variation) */}
            {profile?.name?.hasConflict && !hasResolvedConflict && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1.5 w-full">
                  <div className="text-xs font-bold text-amber-950">
                    Spelling Variation Detected across Saved Documents:
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {profile.name.conflicts.map((conf, idx) => (
                      <label 
                        key={idx}
                        className="flex items-center gap-1.5 text-xs text-slate-800 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xs"
                      >
                        <input
                          type="radio"
                          name="nameVariation"
                          checked={formData.fullName === conf.value}
                          onChange={() => {
                            setFormData({ ...formData, fullName: conf.value });
                            setNameChoice(conf.value);
                          }}
                        />
                        <span className="font-bold">{conf.value}</span>
                        <span className="text-[10px] font-mono text-slate-500">({conf.source})</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="input-label !mb-0">Full Name (As on Aadhaar / Degree)</label>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    From Degree · High
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    setProfileUpdatedToast(true);
                  }}
                  className="input-field"
                />
              </div>

              {/* Aadhaar (Masked) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="input-label !mb-0">Aadhaar Number (Masked)</label>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    From Aadhaar · Verified
                  </span>
                </div>
                <input
                  type="text"
                  disabled
                  value={formData.aadhaarNumber}
                  className="input-field opacity-75 cursor-not-allowed font-mono"
                />
              </div>

              {/* Father Name */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="input-label !mb-0">Father / Spouse Name</label>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    From Aadhaar · High
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.fatherSpouseName}
                  onChange={(e) => setFormData({ ...formData, fatherSpouseName: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Mobile */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="input-label !mb-0">Registered Mobile</label>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    UIDAI Authenticated
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  className="input-field font-mono"
                />
              </div>

              {/* State */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="input-label !mb-0">State / UT</label>
                  <span className="text-[10px] font-mono text-slate-500">From Locker</span>
                </div>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* PIN Code */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="input-label !mb-0">PIN Code</label>
                  <span className="text-[10px] font-mono text-slate-500">From Locker</span>
                </div>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="input-field font-mono"
                />
              </div>
            </div>

            {/* Changed Profile Toast */}
            {profileUpdatedToast && (
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                <span>You modified an auto-filled field. Would you like to update your authoritative Profile Vault too?</span>
                <button
                  type="button"
                  onClick={() => setProfileUpdatedToast(false)}
                  className="px-2.5 py-1 rounded bg-[#002875] text-white text-[11px] font-bold"
                >
                  Update Profile
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Auto-Fit Required Proofs Upload */}
        {step === 3 && (
          <div className="space-y-4">
            
            {/* Top Auto-Fit Explainer Strip */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#002875] shrink-0" />
                <span>
                  <strong>Client-Side Auto-Fit Engine:</strong> If your photo, signature, or PDF is oversized or distorted, BHAROSA auto-resizes and auto-compresses it to exact government portal specs.
                </span>
              </div>
            </div>

            {/* Smart Auto-Apply Missing Data Banner */}
            {(() => {
              const reqList = currentDoc?.requiredDocs || [
                { id: 'transcripts', title: 'Institutional Qualifying Record / Certificate Proof', mandatory: true },
                { id: 'photo', title: 'Passport Size Photograph (Recent Color)', mandatory: true },
                { id: 'signature', title: 'Applicant Specimen Signature', mandatory: true },
                { id: 'id_proof', title: 'Official Government Identity Card (Aadhaar/PAN)', mandatory: true }
              ];
              const missingList = reqList.filter(r => !uploadedFiles[r.id] && !findLockerMatch(r));
              if (missingList.length === 0) return null;

              return (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/40 to-blue-50 border-2 border-amber-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-fadeIn">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-600 text-white shadow-xs shrink-0 mt-0.5">
                      <Zap className="w-4 h-4 fill-amber-300 text-amber-300 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-amber-950 flex items-center gap-2">
                        <span>Missing Auto-Fill Data Detected ({missingList.length} Credential{missingList.length > 1 ? 's' : ''})</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 bg-amber-200 text-amber-900 rounded-full font-bold">DPDP Act 2023</span>
                      </h4>
                      <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
                        Some required credentials are not in your locker. Grant 1-click statutory consent to automatically apply for missing documents on the issuing authority's portal and get notified when complete.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const first = missingList[0];
                      setMissingProcureItem({
                        id: first.id,
                        title: first.title,
                        docType: first.id
                      });
                      setProcureModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#002875] hover:bg-[#0A3D91] text-white text-xs font-bold shrink-0 shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] transition-all whitespace-nowrap"
                  >
                    <Zap size={13} className="text-amber-300 fill-amber-300" />
                    <span>Auto-Apply Missing Data →</span>
                  </button>
                </div>
              );
            })()}

            <div className="space-y-3">
              {(currentDoc?.requiredDocs || [
                { id: 'transcripts', title: 'Institutional Qualifying Record / Certificate Proof', mandatory: true },
                { id: 'photo', title: 'Passport Size Photograph (Recent Color)', mandatory: true },
                { id: 'signature', title: 'Applicant Specimen Signature', mandatory: true },
                { id: 'id_proof', title: 'Official Government Identity Card (Aadhaar/PAN)', mandatory: true }
              ]).map((reqDoc) => {
                const spec = getSlotSpec(reqDoc);
                const isUploaded = !!uploadedFiles[reqDoc.id];
                const uploadedData = uploadedFiles[reqDoc.id];
                const lockerMatch = findLockerMatch(reqDoc);

                return (
                  <div 
                    key={reqDoc.id} 
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{reqDoc.title}</span>
                          {reqDoc.mandatory && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-red-100 text-red-700 rounded border border-red-200 font-bold">
                              MANDATORY
                            </span>
                          )}
                        </div>
                        {/* Requirement Spec Badge */}
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5 flex items-center gap-2">
                          <span className="text-[#002875] font-semibold">Spec: {spec.specText}</span>
                        </div>
                      </div>

                      {/* Status / View Badge */}
                      {isUploaded && (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300 font-bold flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            {uploadedData.name} ({uploadedData.size})
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              if (onViewUploadedDocs) {
                                onViewUploadedDocs([uploadedData], 0, reqDoc.title, formData.fullName);
                              }
                            }}
                            className="p-1 rounded-lg text-[#002875] hover:bg-blue-100"
                            title="Preview file"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Locker Suggestion Strip */}
                    {!isUploaded && lockerMatch && (
                      <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-emerald-950 font-medium">
                          <FolderCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            Suggested from Locker: <strong className="font-mono">{lockerMatch.name}</strong> ({lockerMatch.sizeFormatted})
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAttachFromLocker(reqDoc.id, lockerMatch)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                        >
                          Use This
                        </button>
                      </div>
                    )}

                    {/* Missing Data Detected & Autonomous Procurement Prompt */}
                    {!isUploaded && !lockerMatch && (
                      <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-xs animate-fadeIn">
                        <div className="flex items-start gap-2">
                          <Zap className="w-4 h-4 text-amber-600 mt-0.5 shrink-0 fill-amber-500 animate-pulse" />
                          <div>
                            <span className="font-bold text-amber-950 flex items-center gap-1.5">
                              <span>Data not available in Locker</span>
                              <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">Auto-Apply Ready</span>
                            </span>
                            <p className="text-[11px] text-amber-900 mt-0.5">
                              Grant consent for BHAROSA to automatically apply on the issuing portal on your behalf using verified e-KYC and notify you upon issuance.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setMissingProcureItem({
                              id: reqDoc.id,
                              title: reqDoc.title,
                              docType: reqDoc.id
                            });
                            setProcureModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#002875] to-[#0A3D91] hover:scale-[1.02] text-white font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0"
                        >
                          <Zap size={12} className="text-amber-300 fill-amber-300" />
                          <span>Authorize Auto-Apply &amp; Notify →</span>
                        </button>
                      </div>
                    )}

                    {/* Action Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      
                      {/* Left: Quick Auto-Fit & Multi-Page Tools */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenAutoFitForSlot(reqDoc.id)}
                          className="px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Sparkles size={13} className="text-amber-600" />
                          <span>⚡ Auto-Fit Studio (Fix Size)</span>
                        </button>

                        {/* Multi-Image to PDF Trigger */}
                        {spec.allowedTypes.includes('application/pdf') && (
                          <button
                            type="button"
                            onClick={() => {
                              setMultiPdfSlotId(reqDoc.id);
                              setMultiPdfModalOpen(true);
                            }}
                            className="px-3 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#002875] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <Layers size={13} />
                            <span>📑 Merge Multi-Image to PDF</span>
                          </button>
                        )}
                      </div>

                      {/* Right: Upload File */}
                      <label className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs">
                        <UploadCloud size={14} className="text-[#002875]" />
                        <span>{isUploaded ? 'Replace' : 'Upload File'}</span>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          className="hidden"
                          onChange={(e) => handleFileChange(reqDoc.id, e.target.files?.[0])}
                        />
                      </label>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Priority (Tatkal), Clearance Probability & SLA Refund Policy */}
        {step === 4 && (
          <div className="space-y-5 animate-fadeIn">
            
            {/* Priority Selection Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="input-label text-slate-700 font-bold !mb-0">
                  Select Processing SLA &amp; Fast-Track Priority
                </label>
                <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Real-Time Queue Scrutiny
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Standard */}
                <label 
                  onClick={() => setTatkalSpeed('standard')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    tatkalSpeed === 'standard'
                      ? 'bg-blue-50/70 border-[#002875] ring-2 ring-[#002875]/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900">Standard Queue</span>
                    <Clock size={16} className="text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">3 - 5 Business Days</p>
                  
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">+₹0 Fee</span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-100/60 px-1.5 py-0.2 rounded">
                      99.8% Prob.
                    </span>
                  </div>
                </label>

                {/* 24-Hour Express */}
                <label 
                  onClick={() => setTatkalSpeed('express_24')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    tatkalSpeed === 'express_24'
                      ? 'bg-orange-50/80 border-[#FF671F] ring-2 ring-[#FF671F]/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#FF671F] flex items-center gap-1">
                      <Zap size={13} className="fill-[#FF671F]" /> Tatkal Express
                    </span>
                    <Clock size={16} className="text-[#FF671F]" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Guaranteed 24 Hours</p>
                  
                  <div className="mt-2 pt-2 border-t border-orange-200/60 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FF671F]">+₹250 Fee</span>
                    <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                      ⚡ {getTatkalProbabilityData('express_24').score}
                    </span>
                  </div>
                </label>

                {/* 4-Hour Emergency Flash */}
                <label 
                  onClick={() => setTatkalSpeed('flash_4')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    tatkalSpeed === 'flash_4'
                      ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-amber-700 flex items-center gap-1">
                      <Zap size={13} className="fill-amber-600" /> Flash Emergency
                    </span>
                    <Zap size={16} className="text-amber-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Within 4 Hours Max</p>
                  
                  <div className="mt-2 pt-2 border-t border-amber-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800">+₹500 Fee</span>
                    <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                      ⚡ {getTatkalProbabilityData('flash_4').score}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* DYNAMIC TATKAL CLEARANCE PROBABILITY CARD */}
            {tatkalSpeed !== 'standard' && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-blue-50 border-2 border-emerald-300 shadow-xs space-y-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-xl bg-emerald-600 text-white shadow-xs">
                      <Sparkles size={16} className="animate-spin" style={{ animationDuration: '6s' }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider font-mono">
                          Tatkal Clearance Probability Forecast
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-200 text-emerald-900 font-black">
                          {tatkalProbData.rating}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        Calculated by AI queue arbitration using your verified credentials and live departmental desk capacity.
                      </p>
                    </div>
                  </div>

                  {/* Big Percentage Metric */}
                  <div className="text-right sm:text-right shrink-0">
                    <div className="text-2xl font-black font-mono text-emerald-700 tracking-tight">
                      {tatkalProbData.score}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-900 font-bold block">
                      Target SLA: {tatkalDeadlineFormatted}
                    </span>
                  </div>
                </div>

                {/* Probability Bar */}
                <div className="w-full bg-emerald-200/70 h-2.5 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-[#002875] rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${tatkalProbData.percent}%` }}
                  />
                </div>

                {/* Factors Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-slate-700">
                  {tatkalProbData.factors.map((factor, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1.5 rounded-lg border border-emerald-200/80">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      <span className="font-medium truncate">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STATUTORY SOVEREIGN SLA REFUND GUARANTEE POLICY */}
            {tatkalSpeed !== 'standard' && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 shadow-xs space-y-3 animate-fadeIn">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-600 text-white shadow-xs shrink-0 mt-0.5">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-amber-950 flex items-center gap-2">
                        <span>Sovereign Tatkal SLA Refund Guarantee Policy</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-200 text-amber-950 font-bold">
                          Citizen Charter 2026
                        </span>
                      </h4>
                      <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                        In case the issuing authority fails to complete scrutiny and issue your certificate within the guaranteed <strong>{tatkalSpeed === 'flash_4' ? '4-Hour' : '24-Hour'} SLA window</strong>, our automated escrow protection automatically triggers:
                      </p>
                    </div>
                  </div>
                </div>

                {/* Refund Formula Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 block font-mono">TATKAL SURCHARGE PAID</span>
                    <span className="font-extrabold text-sm text-[#FF671F] font-mono mt-0.5 block">
                      ₹{tatkalFee}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-slate-800">
                    <span className="text-[10px] font-bold text-red-600 block font-mono">ADMIN PROCESSING DEDUCTED</span>
                    <span className="font-extrabold text-sm text-red-700 font-mono mt-0.5 block">
                      -₹{tatkalProcessingDeduction}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Registry &amp; Merkle overhead</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 shadow-2xs">
                    <span className="text-[10px] font-bold text-emerald-700 block font-mono">GUARANTEED REFUND TO YOU</span>
                    <span className="font-black text-sm text-emerald-800 font-mono mt-0.5 block">
                      ₹{tatkalGuaranteedRefund}
                    </span>
                    <span className="text-[10px] text-emerald-800 font-bold block">100% Instant UPI Reversal</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-amber-900 bg-amber-100/60 p-2 rounded-xl border border-amber-200">
                  <Clock size={13} className="text-amber-700 shrink-0" />
                  <span>
                    No grievance or refund application needed. If the SLA breaches, <strong>₹{tatkalGuaranteedRefund}</strong> is credited back automatically into your payment source.
                  </span>
                </div>
              </div>
            )}

            {/* Fee Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Base Sovereign Application Fee</span>
                <span className="font-semibold text-slate-900 font-mono">₹{baseFee}</span>
              </div>
              
              {tatkalFee > 0 && (
                <div className="py-2 border-b border-slate-200/60 text-[#FF671F]">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold flex items-center gap-1">
                      <Zap size={13} className="fill-[#FF671F]" />
                      <span>Fast-Track Tatkal Priority Surcharge ({tatkalSpeed === 'flash_4' ? '4-Hour Flash' : '24-Hour Express'})</span>
                    </span>
                    <span className="font-bold font-mono">+₹{tatkalFee}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 pl-4">
                    <span>• Automated SLA Refund Guarantee:</span>
                    <span className="font-mono text-emerald-700 font-bold">
                      ₹{tatkalGuaranteedRefund} refundable (₹{tatkalProcessingDeduction} fee deducted if breached)
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Digital Gateway &amp; Sovereign Merkle Attestation</span>
                <span className="font-semibold text-slate-900 font-mono">₹{convenienceFee}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">Statutory GST (18%)</span>
                <span className="font-semibold text-slate-900 font-mono">₹{gst}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold text-[#002875]">
                <span>Total Amount Payable</span>
                <span className="font-mono text-base font-black">₹{totalPayable}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Processing submission */}
        {step === 5 && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <AshokaChakra size={48} speed="fast" color="#002875" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Submitting Sovereign Application...</h3>
              <p className="text-xs text-slate-500 font-mono">
                Minting SHA-256 Merkle proofs for {Object.keys(uploadedFiles).length} auto-fitted attachments
              </p>
            </div>
          </div>
        )}

        {/* Modal Footer Navigation */}
        {step < 5 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => {
                if (step > 1) setStep(step - 1);
                else onClose();
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{step === 1 ? 'Cancel' : 'Previous Step'}</span>
            </button>

            <div className="flex items-center gap-2">
              {/* Skip to Review & Submit button when on Step 2 and auto-attached proofs are ready */}
              {step === 2 && Object.keys(uploadedFiles).length >= 2 && (
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                >
                  <Zap size={14} className="fill-white" />
                  <span>⚡ Skip to Review &amp; Submit ({Object.keys(uploadedFiles).length}/4 Proofs Ready)</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (step < 4) setStep(step + 1);
                  else handleProcessSubmission();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#002875] to-[#003CB3] hover:from-[#001F5C] hover:to-[#002E8A] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>{step === 4 ? `Pay ₹${totalPayable} & Submit Application` : step === 2 && Object.keys(uploadedFiles).length >= 2 ? 'Next: Review Attached Proofs (4/4 Ready)' : 'Proceed to Next Step'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Auto-Fit Modal Sub-dialog */}
      {autoFitModalOpen && (
        <AutoFitModal
          isOpen={autoFitModalOpen}
          onClose={() => setAutoFitModalOpen(false)}
          file={autoFitTargetFile}
          spec={autoFitTargetSpec}
          onApplyFixedFile={handleApplyFixedResult}
          existingLockerHashes={lockerDocuments.map(d => d.sha256)}
        />
      )}

      {/* Multi-Image PDF Modal Sub-dialog */}
      {multiPdfModalOpen && (
        <MultiImagePdfModal
          isOpen={multiPdfModalOpen}
          onClose={() => setMultiPdfModalOpen(false)}
          onAttachPdf={handleApplyMergedPdf}
          initialDocTitle={currentDoc?.title || 'Document_Proof'}
        />
      )}

      {/* Sovereign Aadhaar e-KYC OTP Verification Modal */}
      <AutoFillOtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerified={(authPayload) => {
          setIsOtpVerified(true);
          if (profile) {
            setFormData(prev => ({
              ...prev,
              fullName: profile.name?.value || prev.fullName,
              aadhaarNumber: profile.aadhaarNumber?.value || prev.aadhaarNumber,
              fatherSpouseName: profile.fatherName?.value || prev.fatherSpouseName,
              mobileNumber: profile.mobileNumber?.value || prev.mobileNumber,
              email: profile.email?.value || prev.email,
              state: profile.state?.value || prev.state,
              district: profile.district?.value || prev.district,
              pincode: profile.pincode?.value || prev.pincode,
            }));
          }
        }}
        purposeText="Authorizing Aadhaar e-KYC & Profile Vault Auto-Fill for Application Form"
        targetMobile={currentUser?.phone || '+91 ******4210'}
        targetAadhaar={currentUser?.aadhaarMasked || 'XXXX-XXXX-4519'}
      />

      {/* Autonomous Credential Procurement Modal */}
      <AutoProcureModal
        isOpen={procureModalOpen}
        onClose={() => setProcureModalOpen(false)}
        missingItem={missingProcureItem}
        currentUser={currentUser}
        profile={profile}
        onNotify={onNotify}
        onProcured={(newDoc, notifData) => {
          // 1. Auto-fill the missing slot in this form
          setUploadedFiles(prev => ({
            ...prev,
            [newDoc.docType]: {
              name: newDoc.name,
              size: newDoc.sizeFormatted,
              sha256: newDoc.sha256,
              hash: `${newDoc.sha256.substring(0, 8)}...${newDoc.sha256.substring(newDoc.sha256.length - 4)}`,
              isFromLocker: true,
              verifiedBadge: 'verified',
              operationsApplied: newDoc.operationsApplied
            }
          }));

          // 2. Add to global locker if prop provided
          if (onAddLockerDocument) {
            onAddLockerDocument(newDoc);
          }

          // 3. Dispatch notification
          if (onNotify) {
            onNotify(notifData);
          }
        }}
      />
    </div>
  );
}
