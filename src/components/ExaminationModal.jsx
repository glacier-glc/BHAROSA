import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  GraduationCap, 
  Building2, 
  MapPin, 
  FileCheck2, 
  CreditCard, 
  ArrowLeft, 
  ArrowRight, 
  Download, 
  Printer, 
  ShieldCheck, 
  Check, 
  Lock, 
  QrCode, 
  FileText, 
  Eye, 
  Calendar, 
  Clock, 
  Award,
  Zap,
  User,
  Layers,
  KeyRound
} from 'lucide-react';
import AshokaChakra from './AshokaChakra';
import AutoFillOtpModal from './AutoFillOtpModal';
import AutoProcureModal from './AutoProcureModal';
import { 
  CONDUCTING_BODIES, 
  NATIONAL_EXAMINATIONS, 
  EXAMINATION_CITIES_BY_STATE 
} from '../data/examinationsData';
import confetti from 'canvas-confetti';

/**
 * ExaminationModal Component
 * Sovereign National Examination Form Filling Wizard for Major Conducting Bodies:
 * - NTA (JEE Main, NEET UG, CUET UG, UGC-NET)
 * - UPSC (Civil Services CSE, NDA & NA)
 * - IIT Council (JEE Advanced, GATE)
 * - CBSE (CTET)
 * Features 5-Stage comprehensive pipeline with DigiLocker auto-fill, 3-City center preferences,
 * exam-specific auto-fit image formatting, and instant downloadable sovereign confirmation slips.
 */
export default function ExaminationModal({
  isOpen,
  onClose,
  currentUser,
  profile,
  lockerDocuments = [],
  onRegisterExam,
  preselectedExamId = null,
  onOpenAutoFitPreview,
  onAddLockerDocument,
  onNotify
}) {
  if (!isOpen) return null;

  // Selected Conducting Body & Exam
  const [selectedBodyId, setSelectedBodyId] = useState('nta');
  const [selectedExamId, setSelectedExamId] = useState(preselectedExamId || 'nta_jee_main');
  
  // Wizard Steps: 1: Exam & Paper, 2: Candidate e-KYC, 3: Exam City Preferences, 4: Academic Records, 5: Uploads & Pay, 6: Confirmation Slip
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [procureModalOpen, setProcureModalOpen] = useState(false);
  const [missingProcureItem, setMissingProcureItem] = useState(null);

  // Active Exam & Body objects
  const activeBody = CONDUCTING_BODIES.find(b => b.id === selectedBodyId) || CONDUCTING_BODIES[0];
  const activeExam = NATIONAL_EXAMINATIONS.find(e => e.id === selectedExamId) || NATIONAL_EXAMINATIONS[0];

  // Stage 1: Paper, Session & Language State
  const [selectedSession, setSelectedSession] = useState(activeExam.sessionChoices[0]?.id || '');
  const [selectedPaper, setSelectedPaper] = useState(activeExam.papers[0]?.id || '');
  const [selectedLanguage, setSelectedLanguage] = useState(activeExam.mediumLanguages[0] || 'English');

  // Stage 2: Candidate e-KYC & Category State (Auto-filled from Profile / DigiLocker)
  const [candidateData, setCandidateData] = useState({
    fullName: profile?.name?.value || currentUser?.name || 'Aarav Sharma',
    dob: profile?.dob?.value || '2004-08-15',
    gender: profile?.gender?.value || 'Male',
    fatherName: profile?.fatherName?.value || 'Suresh Sharma',
    motherName: 'Sunita Sharma',
    aadhaarMasked: profile?.aadhaarNumber?.value || currentUser?.aadhaarMasked || 'XXXX-XXXX-4519',
    category: 'General', // General, General-EWS, OBC-NCL, SC, ST
    isPwD: false,
    disabilityType: 'None',
    needScribe: 'No',
    mobile: profile?.mobileNumber?.value || currentUser?.phone || '+91 98765 43210',
    email: profile?.email?.value || currentUser?.email || 'aarav.sharma@gov.in',
    nationality: 'Indian National (Citizen of Bharat)'
  });

  // Stage 3: Exam City Preferences State (1st, 2nd, 3rd choice)
  const [cityPrefs, setCityPrefs] = useState({
    state1: 'Maharashtra',
    city1: 'mumbai',
    state2: 'Maharashtra',
    city2: 'pune',
    state3: 'Delhi (NCT)',
    city3: 'delhi_central'
  });

  // Stage 4: Academic Qualifications State (Auto-populated from CBSE records)
  const [academicData, setAcademicData] = useState({
    tenthPassStatus: 'Passed',
    tenthPassingYear: '2020',
    tenthBoard: 'Central Board of Secondary Education (CBSE)',
    tenthRollNo: 'CBSE-10-849102',
    tenthSchool: 'Delhi Public School, R.K. Puram',
    tenthMarksMax: '500',
    tenthMarksObt: '471',
    tenthPercent: '94.20%',

    twelfthPassStatus: 'Passed',
    twelfthPassingYear: '2022',
    twelfthBoard: 'Central Board of Secondary Education (CBSE)',
    twelfthRollNo: 'CBSE-12-921841',
    twelfthSchool: 'Delhi Public School, R.K. Puram',
    twelfthStream: 'Physics, Chemistry, Mathematics (PCM)',
    twelfthMarksMax: '500',
    twelfthMarksObt: '473',
    twelfthPercent: '94.60%'
  });

  // Stage 5: Uploaded / Pre-attached proofs tracking
  const [attachedFiles, setAttachedFiles] = useState({});

  // Synchronize when active exam changes
  useEffect(() => {
    if (activeExam) {
      setSelectedSession(activeExam.sessionChoices[0]?.id || '');
      setSelectedPaper(activeExam.papers[0]?.id || '');
      setSelectedLanguage(activeExam.mediumLanguages[0] || 'English');
    }
  }, [activeExam]);

  // Synchronize conducting body with exam
  const handleSelectBody = (bodyId) => {
    setSelectedBodyId(bodyId);
    const firstExamOfBody = NATIONAL_EXAMINATIONS.find(e => e.conductingBodyId === bodyId);
    if (firstExamOfBody) {
      setSelectedExamId(firstExamOfBody.id);
    }
  };

  // Auto-attach matching compliant files from locker
  useEffect(() => {
    if (!lockerDocuments || lockerDocuments.length === 0) return;

    const photoDoc = lockerDocuments.find(d => (d.docType === 'photo' || d.name.toLowerCase().includes('photo')) && !d.isNonCompliant);
    const sigDoc = lockerDocuments.find(d => (d.docType === 'signature' || d.name.toLowerCase().includes('sig')) && !d.isNonCompliant);
    const idDoc = lockerDocuments.find(d => (d.docType === 'id_proof' || d.name.toLowerCase().includes('aadhaar')) && !d.isNonCompliant);
    const degreeDoc = lockerDocuments.find(d => (d.docType === 'academic_degree' || d.name.toLowerCase().includes('cbse') || d.name.toLowerCase().includes('degree')) && !d.isNonCompliant);

    setAttachedFiles({
      photo: photoDoc ? {
        name: photoDoc.name,
        size: photoDoc.sizeFormatted || '34.6 KB',
        dimensions: photoDoc.dimensions || '200 × 230 px',
        sha256: photoDoc.sha256,
        dataUrl: photoDoc.dataUrl || photoDoc.previewUrl,
        verifiedBadge: 'auto_fitted',
        complianceText: 'Auto-Fitted: 80% Face Coverage & Compliant'
      } : {
        name: 'Citizen_Passport_Photo.jpg',
        size: '34.6 KB',
        dimensions: '200 × 230 px',
        sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        verifiedBadge: 'auto_fitted',
        complianceText: 'Auto-Fitted & Compliant (34.6 KB)'
      },
      signature: sigDoc ? {
        name: sigDoc.name,
        size: sigDoc.sizeFormatted || '14.8 KB',
        dimensions: sigDoc.dimensions || '140 × 60 px',
        sha256: sigDoc.sha256,
        dataUrl: sigDoc.dataUrl || sigDoc.previewUrl,
        verifiedBadge: 'auto_fitted',
        complianceText: 'Auto-Fitted: Black Ink on White Paper'
      } : {
        name: 'Citizen_Signature_Specimen.png',
        size: '14.8 KB',
        dimensions: '140 × 60 px',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        verifiedBadge: 'auto_fitted',
        complianceText: 'Auto-Fitted & Compliant (14.8 KB)'
      },
      categoryProof: idDoc || degreeDoc ? {
        name: 'CBSE_Class_X_Date_Of_Birth_Proof.pdf',
        size: '185 KB',
        sha256: '7d89f02c4b63e12a884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15',
        verifiedBadge: 'verified',
        complianceText: 'Verified BHAROSA-Signed PDF (185 KB)'
      } : null
    });
  }, [lockerDocuments]);

  // Fee calculation based on active paper and candidate category
  const activePaperObj = activeExam.papers.find(p => p.id === selectedPaper) || activeExam.papers[0];
  let calculatedFee = activePaperObj?.fee || 1000;
  if (activeExam.feeStructure) {
    if (candidateData.category === 'SC' || candidateData.category === 'ST' || candidateData.isPwD) {
      calculatedFee = activeExam.feeStructure.sc_st_pwd;
    } else if (candidateData.category === 'General-EWS' || candidateData.category === 'OBC-NCL') {
      calculatedFee = activeExam.feeStructure.gen_ews_obc_ncl;
    } else if (candidateData.gender === 'Female' && activeExam.feeStructure.general_female !== undefined) {
      calculatedFee = activeExam.feeStructure.general_female;
    } else {
      calculatedFee = activeExam.feeStructure.general_male;
    }
  }
  const convenienceFee = calculatedFee > 0 ? 15 : 0;
  const totalPayable = calculatedFee + convenienceFee;

  // Handle final submission & minting confirmation slip
  const handleFinalSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const appNumber = `${activeBody.shortName.toUpperCase()}-${activeExam.shortTitle.split(' ')[0]}-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const newExamApp = {
        id: `APP-EXAM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        applicationNumber: appNumber,
        applicantName: candidateData.fullName,
        aadhaarMasked: candidateData.aadhaarMasked,
        examId: activeExam.id,
        examTitle: activeExam.title,
        conductingBody: activeBody.name,
        conductingBodyShort: activeBody.shortName,
        paperName: activePaperObj.name,
        sessionName: activeExam.sessionChoices.find(s => s.id === selectedSession)?.label || 'Primary Session',
        mediumLanguage: selectedLanguage,
        category: candidateData.category,
        cityPreferences: [
          cityPrefs.city1.toUpperCase(),
          cityPrefs.city2.toUpperCase(),
          cityPrefs.city3.toUpperCase()
        ],
        status: 'registered',
        statusText: 'Application Registered & Fee Paid • Admit Card Scheduled',
        totalPaid: totalPayable,
        submittedOn: 'Just now',
        admitCardDate: activeExam.admitCardSchedule,
        examWindow: activeExam.examWindow,
        sha256Receipt: '7a9c2b1e4f63d08a5c1e97f3b20d46a8e15c7b9023fa64d18e0b5c3a7d92f641',
        isAutoFilled: true
      };

      setSubmittedApplication(newExamApp);
      setIsSubmitting(false);
      setStep(6); // Confirmation Slip View

      if (onRegisterExam) {
        onRegisterExam(newExamApp);
      }

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (e) {}
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Sovereign Header with Conducting Body Branding */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#002875] via-[#0A3D91] to-[#001B52] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-amber-300 shadow-sm">
              <AshokaChakra size={26} speed="normal" color="#ffffff" accentColor="#ff671f" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  National Examination Registration Portal
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
                  Zero-Rejection Engine
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Centralized Single-Window Form Filing for NTA, UPSC, IIT Council &amp; CBSE
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stepper Progress Bar (Steps 1 to 5) */}
        {step <= 5 && (
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between overflow-x-auto text-xs font-semibold">
            {[
              { num: 1, title: 'Exam & Paper' },
              { num: 2, title: 'Candidate e-KYC' },
              { num: 3, title: 'City Preferences' },
              { num: 4, title: 'Academic Marks' },
              { num: 5, title: 'Auto-Fit Proofs & Pay' }
            ].map((s) => (
              <div 
                key={s.num} 
                className={`flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
                  step === s.num 
                    ? 'text-[#002875] font-black' 
                    : step > s.num 
                    ? 'text-emerald-700' 
                    : 'text-slate-400'
                }`}
                onClick={() => { if (step > s.num) setStep(s.num); }}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                  step === s.num 
                    ? 'bg-[#002875] text-white shadow-xs' 
                    : step > s.num 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </span>
                <span>{s.title}</span>
                {s.num < 5 && <span className="text-slate-300 ml-2">→</span>}
              </div>
            ))}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          
          {/* ================= STEP 1: CONDUCTING BODY & EXAM CHOICE ================= */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Conducting Body Selector Tabs */}
              <div>
                <label className="input-label text-slate-700 font-bold block mb-2">
                  Select Examination Conducting Body / Agency:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {CONDUCTING_BODIES.map((body) => (
                    <button
                      key={body.id}
                      type="button"
                      onClick={() => handleSelectBody(body.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedBodyId === body.id
                          ? 'bg-blue-50/80 border-[#002875] shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-xs text-[#002875]">{body.shortName}</span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            selectedBodyId === body.id ? 'bg-[#002875] text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            ACTIVE
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-900 leading-tight truncate">{body.name}</p>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{body.hindiName}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Examinations List for Selected Body */}
              <div>
                <label className="input-label text-slate-700 font-bold block mb-2">
                  Available Examinations under {activeBody.shortName}:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {NATIONAL_EXAMINATIONS.filter(e => e.conductingBodyId === selectedBodyId).map((exam) => (
                    <label
                      key={exam.id}
                      onClick={() => setSelectedExamId(exam.id)}
                      className={`p-4 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all ${
                        selectedExamId === exam.id
                          ? 'bg-gradient-to-br from-blue-50/90 to-indigo-50/70 border-[#002875] shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                            {exam.examCode}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-[#FF671F]">
                            Fee: ₹{exam.papers[0]?.fee || 1000}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-[#002875]">{exam.title}</h4>
                        <p className="text-[11px] text-slate-600 line-clamp-1">{exam.category}</p>
                        <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                          <Clock size={11} />
                          <span>Exam: {exam.examWindow}</span>
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500">{exam.papers.length} Papers Available</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedExamId === exam.id ? 'border-[#002875] bg-[#002875]' : 'border-slate-300'
                        }`}>
                          {selectedExamId === exam.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Paper, Session & Language Modifiers */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-extrabold text-[#002875] uppercase tracking-wider">
                  Paper, Session &amp; Language Customization
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Paper Choice */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Target Paper / Stream:
                    </label>
                    <select
                      value={selectedPaper}
                      onChange={(e) => setSelectedPaper(e.target.value)}
                      className="input-field text-xs"
                    >
                      {activeExam.papers.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (Base ₹{p.fee})</option>
                      ))}
                    </select>
                  </div>

                  {/* Session Choice */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Exam Session Cycle:
                    </label>
                    <select
                      value={selectedSession}
                      onChange={(e) => setSelectedSession(e.target.value)}
                      className="input-field text-xs"
                    >
                      {activeExam.sessionChoices.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Question Paper Medium */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Question Paper Language Medium:
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="input-field text-xs"
                    >
                      {activeExam.mediumLanguages.map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>

                  {/* Eligibility Reminder */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 block font-mono">STATUTORY ELIGIBILITY</span>
                    <p className="text-[11px] text-slate-700 mt-0.5 line-clamp-2">{activeExam.eligibility}</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= STEP 2: CANDIDATE e-KYC & CATEGORY ================= */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Sovereign Aadhaar OTP Verification Gate Banner */}
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
                        Verify via 6-digit Aadhaar OTP to unlock and auto-populate candidate identity attributes and CBSE Class X/XII academic scores.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowOtpModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#002875] hover:bg-[#0A3D91] text-white text-xs font-bold shrink-0 shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] transition-all"
                  >
                    <ShieldCheck size={14} />
                    <span>Verify OTP to Auto-Fill →</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-300 shadow-xs flex items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                        <span>Aadhaar e-KYC OTP Verified • Data Pre-Populated</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 bg-emerald-200 text-emerald-900 rounded-full font-bold">
                          100% Identity Match
                        </span>
                      </h4>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Name, DOB, Gender, and Father's Name verified against sovereign records to prevent name-mismatch rejections.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Details Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="input-label">Candidate Full Name (As on Class X Certificate)</label>
                  <input
                    type="text"
                    value={candidateData.fullName}
                    onChange={(e) => setCandidateData({ ...candidateData, fullName: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="input-label">Aadhaar Number (Masked / e-KYC Attested)</label>
                  <input
                    type="text"
                    disabled
                    value={candidateData.aadhaarMasked}
                    className="input-field opacity-75 cursor-not-allowed font-mono"
                  />
                </div>

                <div>
                  <label className="input-label">Date of Birth</label>
                  <input
                    type="date"
                    value={candidateData.dob}
                    onChange={(e) => setCandidateData({ ...candidateData, dob: e.target.value })}
                    className="input-field font-mono"
                  />
                </div>

                <div>
                  <label className="input-label">Gender</label>
                  <select
                    value={candidateData.gender}
                    onChange={(e) => setCandidateData({ ...candidateData, gender: e.target.value })}
                    className="input-field"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Third Gender">Third Gender / Transgender</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Father / Guardian Name</label>
                  <input
                    type="text"
                    value={candidateData.fatherName}
                    onChange={(e) => setCandidateData({ ...candidateData, fatherName: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="input-label">Mother Name</label>
                  <input
                    type="text"
                    value={candidateData.motherName}
                    onChange={(e) => setCandidateData({ ...candidateData, motherName: e.target.value })}
                    className="input-field"
                  />
                </div>

                {/* Category Reservation Selection */}
                <div>
                  <label className="input-label text-[#002875] font-bold">
                    Category Reservation (Crucial for Cut-Offs &amp; Fees)
                  </label>
                  <select
                    value={candidateData.category}
                    onChange={(e) => setCandidateData({ ...candidateData, category: e.target.value })}
                    className="input-field font-semibold text-[#002875]"
                  >
                    <option value="General">General / Unreserved (UR)</option>
                    <option value="General-EWS">General - Economically Weaker Section (EWS)</option>
                    <option value="OBC-NCL">Other Backward Classes - Non-Creamy Layer (OBC-NCL)</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="ST">Scheduled Tribe (ST)</option>
                  </select>
                </div>

                {/* Missing Category Proof Autonomous Procurement Prompt */}
                {candidateData.category !== 'General' && (
                  <div className="col-span-1 sm:col-span-2 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs animate-fadeIn">
                    <div className="flex items-start gap-2.5">
                      <Zap className="w-4 h-4 text-amber-600 mt-0.5 shrink-0 fill-amber-500 animate-pulse" />
                      <div>
                        <span className="font-bold text-amber-950 flex items-center gap-1.5">
                          <span>{candidateData.category} Certificate Not Found in Locker</span>
                          <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">Auto-Apply Ready</span>
                        </span>
                        <p className="text-[11px] text-amber-900 mt-0.5">
                          Grant consent for BHAROSA to automatically apply on the State e-District portal on your behalf using verified e-KYC and notify you upon issuance.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setMissingProcureItem({
                          id: `caste_${candidateData.category.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
                          title: `Central ${candidateData.category} Caste & Reservation Certificate`,
                          docType: 'category_proof'
                        });
                        setProcureModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#002875] to-[#0A3D91] hover:scale-[1.02] text-white font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0 whitespace-nowrap"
                    >
                      <Zap size={13} className="text-amber-300 fill-amber-300" />
                      <span>Authorize Auto-Apply &amp; Notify →</span>
                    </button>
                  </div>
                )}

                {/* PwD & Scribe Requirement */}
                <div>
                  <label className="input-label text-[#002875] font-bold">
                    Persons with Benchmark Disability (PwD)
                  </label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="pwdStatus"
                        checked={!candidateData.isPwD}
                        onChange={() => setCandidateData({ ...candidateData, isPwD: false })}
                      />
                      <span>No</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="pwdStatus"
                        checked={candidateData.isPwD}
                        onChange={() => setCandidateData({ ...candidateData, isPwD: true })}
                      />
                      <span>Yes (≥ 40% Disability)</span>
                    </label>
                  </div>
                </div>

                {/* Scribe selection if PwD */}
                {candidateData.isPwD && (
                  <div className="sm:col-span-2 p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs">
                    <label className="font-bold text-amber-950 block mb-1">Do you require a Scribe during Examination?</label>
                    <select
                      value={candidateData.needScribe}
                      onChange={(e) => setCandidateData({ ...candidateData, needScribe: e.target.value })}
                      className="input-field"
                    >
                      <option value="No">No, I will write the exam myself</option>
                      <option value="Own Scribe">Yes, I will bring my Own Scribe</option>
                      <option value="Authority Scribe">Yes, Scribe to be provided by Examination Conducting Agency</option>
                    </select>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ================= STEP 3: EXAMINATION CITY PREFERENCES ================= */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <MapPin size={20} className="text-[#002875] shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#002875]">Select 3 City Centers in Order of Preference</h4>
                    <p className="text-slate-600 mt-0.5">
                      First-choice centers are allocated automatically by biometric proximity &amp; availability.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold shrink-0">
                  🟢 84% Seats Open
                </span>
              </div>

              {/* 3-Tier City Selectors */}
              <div className="space-y-4">
                
                {/* Preference 1 */}
                <div className="p-4 rounded-2xl bg-white border-2 border-[#002875]/20 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#002875] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#002875] text-white flex items-center justify-center text-[11px]">1</span>
                      First Choice Exam City (Primary Preference)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                      Guaranteed Allotment Priority
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">State / Union Territory:</label>
                      <select
                        value={cityPrefs.state1}
                        onChange={(e) => {
                          const stateObj = EXAMINATION_CITIES_BY_STATE.find(s => s.state === e.target.value);
                          setCityPrefs({ ...cityPrefs, state1: e.target.value, city1: stateObj?.cities[0]?.id || '' });
                        }}
                        className="input-field"
                      >
                        {EXAMINATION_CITIES_BY_STATE.map(s => (
                          <option key={s.state} value={s.state}>{s.state}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Examination Center City:</label>
                      <select
                        value={cityPrefs.city1}
                        onChange={(e) => setCityPrefs({ ...cityPrefs, city1: e.target.value })}
                        className="input-field font-semibold text-[#002875]"
                      >
                        {(EXAMINATION_CITIES_BY_STATE.find(s => s.state === cityPrefs.state1)?.cities || []).map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Preference 2 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[11px]">2</span>
                      Second Choice Exam City (Secondary Preference)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">State / Union Territory:</label>
                      <select
                        value={cityPrefs.state2}
                        onChange={(e) => {
                          const stateObj = EXAMINATION_CITIES_BY_STATE.find(s => s.state === e.target.value);
                          setCityPrefs({ ...cityPrefs, state2: e.target.value, city2: stateObj?.cities[0]?.id || '' });
                        }}
                        className="input-field"
                      >
                        {EXAMINATION_CITIES_BY_STATE.map(s => (
                          <option key={s.state} value={s.state}>{s.state}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Examination Center City:</label>
                      <select
                        value={cityPrefs.city2}
                        onChange={(e) => setCityPrefs({ ...cityPrefs, city2: e.target.value })}
                        className="input-field"
                      >
                        {(EXAMINATION_CITIES_BY_STATE.find(s => s.state === cityPrefs.state2)?.cities || []).map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Preference 3 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[11px]">3</span>
                      Third Choice Exam City (Fallback Option)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">State / Union Territory:</label>
                      <select
                        value={cityPrefs.state3}
                        onChange={(e) => {
                          const stateObj = EXAMINATION_CITIES_BY_STATE.find(s => s.state === e.target.value);
                          setCityPrefs({ ...cityPrefs, state3: e.target.value, city3: stateObj?.cities[0]?.id || '' });
                        }}
                        className="input-field"
                      >
                        {EXAMINATION_CITIES_BY_STATE.map(s => (
                          <option key={s.state} value={s.state}>{s.state}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Examination Center City:</label>
                      <select
                        value={cityPrefs.city3}
                        onChange={(e) => setCityPrefs({ ...cityPrefs, city3: e.target.value })}
                        className="input-field"
                      >
                        {(EXAMINATION_CITIES_BY_STATE.find(s => s.state === cityPrefs.state3)?.cities || []).map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================= STEP 4: ACADEMIC QUALIFYING MARKS ================= */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* DigiLocker CBSE Marks Attestation Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-950 font-bold">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Verified DigiLocker CBSE Attestation Loaded: Class 10th (94.2%) &amp; Class 12th (94.6%)</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded font-bold">
                  e-Signed
                </span>
              </div>

              {/* Class 10th / Secondary Section */}
              <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="font-extrabold text-xs text-[#002875] flex items-center gap-2">
                    <GraduationCap size={16} />
                    <span>Class X / Secondary School Examination Details</span>
                  </h4>
                  <span className="text-[11px] font-mono font-bold text-emerald-700">Score: {academicData.tenthPercent}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Board / Council:</label>
                    <input type="text" value={academicData.tenthBoard} disabled className="input-field opacity-80" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Passing Year:</label>
                    <input type="text" value={academicData.tenthPassingYear} disabled className="input-field opacity-80 font-mono" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Class X Roll Number:</label>
                    <input type="text" value={academicData.tenthRollNo} disabled className="input-field opacity-80 font-mono" />
                  </div>
                </div>
              </div>

              {/* Class 12th / Qualifying Section */}
              <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="font-extrabold text-xs text-[#002875] flex items-center gap-2">
                    <Award size={16} />
                    <span>Class XII / Qualifying Senior Secondary Examination Details</span>
                  </h4>
                  <span className="text-[11px] font-mono font-bold text-emerald-700">Score: {academicData.twelfthPercent}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Board / Council:</label>
                    <input type="text" value={academicData.twelfthBoard} disabled className="input-field opacity-80" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Stream / Subjects:</label>
                    <input type="text" value={academicData.twelfthStream} disabled className="input-field opacity-80" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Class XII Roll Number:</label>
                    <input type="text" value={academicData.twelfthRollNo} disabled className="input-field opacity-80 font-mono" />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= STEP 5: AUTO-FIT PROOFS & FEE PAYMENT ================= */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Auto-Fit Compliance Proofs Strip */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-[#002875] uppercase tracking-wider">
                    Exam-Compliant Auto-Fitted Uploads (Zero-Rejection Checked)
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">
                    ✓ All 3 Required Artifacts Compliant
                  </span>
                </div>

                {/* 1. Candidate Photo */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-300 flex items-center justify-center font-bold text-xs text-[#002875]">
                      📷
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{attachedFiles.photo?.name}</h5>
                      <p className="text-[11px] font-mono text-emerald-700 font-bold">
                        {attachedFiles.photo?.size} · {attachedFiles.photo?.dimensions} · {attachedFiles.photo?.complianceText}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    ✓ Auto-Fitted
                  </span>
                </div>

                {/* 2. Candidate Signature */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-300 flex items-center justify-center font-bold text-xs text-[#002875]">
                      ✍️
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{attachedFiles.signature?.name}</h5>
                      <p className="text-[11px] font-mono text-emerald-700 font-bold">
                        {attachedFiles.signature?.size} · {attachedFiles.signature?.dimensions} · {attachedFiles.signature?.complianceText}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    ✓ Auto-Fitted
                  </span>
                </div>

                {/* 3. Date of Birth / Category Proof */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-300 flex items-center justify-center font-bold text-xs text-[#002875]">
                      📄
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{attachedFiles.categoryProof?.name || 'CBSE_Class_X_Proof.pdf'}</h5>
                      <p className="text-[11px] font-mono text-emerald-700 font-bold">
                        {attachedFiles.categoryProof?.size || '185 KB'} · PDF Attested · Cryptographically Sealed
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    ✓ Verified
                  </span>
                </div>
              </div>

              {/* Fee Breakdown Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-700">Examination Application Fee ({activeExam.shortTitle})</span>
                  <span className="font-mono font-bold text-slate-900">₹{calculatedFee}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Candidate Category Concession ({candidateData.category})</span>
                  <span className="font-mono font-semibold text-emerald-700">Applied</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Central Digital Gateway &amp; Sovereign Merkle Attestation</span>
                  <span className="font-mono font-semibold text-slate-900">₹{convenienceFee}</span>
                </div>

                <div className="pt-2 border-t border-slate-300 flex items-center justify-between text-sm font-extrabold text-[#002875]">
                  <span>Total Registration Amount Payable</span>
                  <span className="text-base font-mono">₹{totalPayable}</span>
                </div>
              </div>

              {/* Payment Mode Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Select Instant Bharat BillPay / Gateway Option:</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-blue-50 border border-[#002875] text-[#002875] font-bold text-center cursor-pointer shadow-xs">
                    UPI / QR (Zero Surcharge)
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium text-center cursor-pointer hover:bg-slate-50">
                    NetBanking (SBI/HDFC/ICICI)
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium text-center cursor-pointer hover:bg-slate-50">
                    Debit / Credit Card
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= STEP 6: DOWNLOADABLE SOVEREIGN CONFIRMATION SLIP ================= */}
          {step === 6 && submittedApplication && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Success Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-emerald-950">
                      Application Successfully Submitted &amp; Fee Acknowledged!
                    </h4>
                    <p className="text-xs text-emerald-800 font-mono mt-0.5">
                      Application Number: <strong>{submittedApplication.applicationNumber}</strong>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-emerald-100"
                  >
                    <Printer size={14} />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Styled Sovereign Confirmation Slip Document Card */}
              <div className="p-6 rounded-3xl bg-white border-2 border-slate-300 shadow-xl space-y-6 relative overflow-hidden" id="exam-confirmation-slip">
                
                {/* Subtle Sovereign Watermark & Border */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF671F] via-white to-[#046A38]" />

                {/* Header with National Emblems & Body Name */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b-2 border-slate-200 text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    <AshokaChakra size={36} color="#002875" accentColor="#ff671f" />
                    <div>
                      <h3 className="font-cinzel text-lg font-black text-[#002875]">GOVERNMENT OF INDIA</h3>
                      <h4 className="text-xs font-bold text-slate-800">{activeBody.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">{activeBody.ministry}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#002875] border border-blue-200 text-xs font-bold font-mono inline-block">
                      OFFICIAL CONFIRMATION SLIP
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">SESSION 2026</p>
                  </div>
                </div>

                {/* Candidate Photo & Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  
                  {/* Photo & Signature Slot */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center space-y-2 text-center">
                    <div className="w-24 h-28 rounded-lg bg-blue-100 border border-slate-300 flex items-center justify-center text-2xl shadow-inner font-bold text-[#002875]">
                      👤
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 block">Photo (Auto-Fitted)</span>

                    <div className="w-24 h-8 rounded bg-white border border-slate-300 flex items-center justify-center text-xs font-script font-bold text-slate-800 shadow-2xs">
                      {candidateData.fullName.split(' ')[0]}
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 block">Verified Signature</span>
                  </div>

                  {/* Candidate Attributes Details */}
                  <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-mono">APPLICATION NUMBER</span>
                      <strong className="text-sm font-extrabold text-[#002875] font-mono block mt-0.5">
                        {submittedApplication.applicationNumber}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-mono">TARGET EXAMINATION</span>
                      <strong className="text-xs font-bold text-slate-900 block mt-0.5">
                        {submittedApplication.examTitle}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-mono">CANDIDATE FULL NAME</span>
                      <strong className="text-xs font-bold text-slate-900 block mt-0.5">
                        {candidateData.fullName}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-mono">CATEGORY &amp; PwD STATUS</span>
                      <strong className="text-xs font-bold text-slate-900 block mt-0.5">
                        {candidateData.category} {candidateData.isPwD ? '(PwD Applicable)' : '(Non-PwD)'}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-mono">PAPER &amp; MEDIUM</span>
                      <strong className="text-xs font-bold text-slate-900 block mt-0.5">
                        {submittedApplication.paperName} ({selectedLanguage})
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-mono">EXAM WINDOW &amp; ADMIT CARD</span>
                      <strong className="text-xs font-bold text-emerald-700 block mt-0.5">
                        {activeExam.examWindow}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* City Allotment Preferences Summary */}
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs">
                  <span className="text-[10px] font-mono text-slate-500 font-bold block mb-1">
                    SUBMITTED EXAMINATION CENTER CITY PREFERENCES:
                  </span>
                  <div className="flex flex-wrap items-center gap-3 font-semibold text-[#002875]">
                    <span>1st Choice: <strong className="font-mono text-slate-900">{cityPrefs.city1.toUpperCase()} ({cityPrefs.state1})</strong></span>
                    <span className="text-slate-300">•</span>
                    <span>2nd Choice: <strong className="font-mono text-slate-900">{cityPrefs.city2.toUpperCase()} ({cityPrefs.state2})</strong></span>
                    <span className="text-slate-300">•</span>
                    <span>3rd Choice: <strong className="font-mono text-slate-900">{cityPrefs.city3.toUpperCase()} ({cityPrefs.state3})</strong></span>
                  </div>
                </div>

                {/* Footer with Cryptographic SHA-256 and QR code */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">SHA-256 TRANSACTION MERKLE SEAL:</span>
                    <code className="text-[#002875] text-[11px] block truncate max-w-sm">
                      {submittedApplication.sha256Receipt}
                    </code>
                    <p className="text-[10px] text-emerald-700 font-bold mt-1">
                      ✓ Fee ₹{totalPayable} Confirmed via Bharat BillPay (Zero Dues)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-50 border border-slate-200">
                    <QrCode size={36} className="text-[#002875]" />
                    <div className="text-[10px] text-slate-500">
                      <span>Scan to Verify</span>
                      <span className="block font-bold text-slate-700">{submittedApplication.applicationNumber}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Navigation Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step <= 5 ? (
            <>
              <button
                type="button"
                onClick={() => {
                  if (step > 1) setStep(step - 1);
                  else onClose();
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>{step === 1 ? 'Cancel' : 'Previous Step'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (step === 2 && !isOtpVerified) {
                    setShowOtpModal(true);
                    return;
                  }
                  if (step < 5) setStep(step + 1);
                  else handleFinalSubmit();
                }}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#002875] to-[#003CB3] hover:from-[#001F5C] hover:to-[#002E8A] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <AshokaChakra size={15} speed="fast" color="#ffffff" />
                    <span>Minting Sovereign Registration...</span>
                  </>
                ) : (
                  <>
                    <span>{step === 5 ? `Pay ₹${totalPayable} & Register Examination` : 'Next Step'}</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <span className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                <CheckCircle2 size={16} />
                <span>Application archived into Nagrik Sovereign Vault</span>
              </span>

              <button
                type="button"
                onClick={onClose}
                className="btn btn-primary text-xs py-2.5 px-6 shadow-md cursor-pointer font-bold"
              >
                Return to Sovereign Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Sovereign OTP Verification Modal before Auto-Fill */}
        <AutoFillOtpModal
          isOpen={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          onVerified={() => setIsOtpVerified(true)}
          purposeText={`Authorizing Aadhaar e-KYC Data Release for ${activeExam.shortTitle}`}
          targetMobile={currentUser?.phone || '+91 ******4210'}
          targetAadhaar={candidateData.aadhaarMasked || 'XXXX-XXXX-4519'}
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
            setAttachedFiles(prev => ({
              ...prev,
              categoryProof: {
                name: newDoc.name,
                size: newDoc.sizeFormatted,
                sha256: newDoc.sha256,
                verifiedBadge: 'verified',
                complianceText: 'Verified BHAROSA Auto-Procured PDF'
              }
            }));

            if (onAddLockerDocument) {
              onAddLockerDocument(newDoc);
            }

            if (onNotify) {
              onNotify(notifData);
            }
          }}
        />

      </div>
    </div>
  );
}
