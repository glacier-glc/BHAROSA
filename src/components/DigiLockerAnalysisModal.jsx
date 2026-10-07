import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Sliders, 
  Layers, 
  FileText, 
  Lock, 
  Eye, 
  RefreshCw, 
  UploadCloud, 
  X, 
  Check, 
  ArrowRight,
  Database,
  ExternalLink,
  Cpu,
  FileCheck
} from 'lucide-react';
import AshokaChakra from './AshokaChakra';
import { 
  DIGILOCKER_CLOUD_DOCUMENTS, 
  buildProfileFromDigiLockerDocs 
} from '../data/digiLockerMockData';
import { autoFitImage, formatBytes, computeSha256 } from '../utils/autoFitEngine';
import { DOCUMENT_SPECS } from '../data/autoFillSpecs';
import AutoFillOtpModal from './AutoFillOtpModal';
import AutoProcureModal from './AutoProcureModal';

/**
 * DigiLockerAnalysisModal Component
 * Interactive Government of India DigiLocker Integration & Document Analysis Engine:
 * 1. Simulates authenticated OAuth 2.0 PKCE handshake with citizen's linked DigiLocker
 * 2. Visual 4-stage entity extraction pipeline (OCR, identity keys, compliance)
 * 3. Interactive Analysis Report with confidence scores, source chips, and name conflict resolution
 * 4. Automatic client-side Auto-Fit for oversized photo/signature specimens
 * 5. Supports custom file upload & live analysis dropzone
 * 6. 1-Click "Apply Analyzed Data" that powers Smart Auto-Fill & auto-attaches proofs in forms
 */
export default function DigiLockerAnalysisModal({
  isOpen,
  onClose,
  onApplyAnalyzedData,
  currentUser,
  onOpenAutoFitPreview,
  onAddLockerDocument,
  onNotify
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('cloud'); // 'cloud' | 'custom_upload'
  const [pipelineState, setPipelineState] = useState('idle'); // 'idle' | 'scanning' | 'completed'
  const [scanStage, setScanStage] = useState(0); // 1, 2, 3, 4
  const [selectedNameChoice, setSelectedNameChoice] = useState('Aarav Sharma');
  const [customFile, setCustomFile] = useState(null);
  const [customAnalysisResult, setCustomAnalysisResult] = useState(null);
  const [autoFittedPhotos, setAutoFittedPhotos] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [procureModalOpen, setProcureModalOpen] = useState(false);
  const [missingProcureItem, setMissingProcureItem] = useState(null);

  // 1-Click Run DigiLocker Analysis Pipeline
  const handleStartAnalysis = () => {
    setPipelineState('scanning');
    setScanStage(1); // Gateway Handshake

    setTimeout(() => {
      setScanStage(2); // Ingesting payloads
      setTimeout(() => {
        setScanStage(3); // Entity Extraction
        setTimeout(() => {
          setScanStage(4); // Compliance & Auto-Fit
          setTimeout(() => {
            setPipelineState('completed');
          }, 600);
        }, 700);
      }, 700);
    }, 600);
  };

  // Custom Local File Upload & Analysis
  const handleCustomFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomFile(file);
    setPipelineState('scanning');
    setScanStage(1);

    try {
      const sha256 = await computeSha256(file);
      setScanStage(2);

      // Read as Data URL
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result;
        setScanStage(3);

        // Run Auto-Fit if image
        let autoFitData = null;
        if (file.type.startsWith('image/')) {
          autoFitData = await autoFitImage(dataUrl, DOCUMENT_SPECS.photo, null, true);
        }

        setScanStage(4);
        setTimeout(() => {
          setCustomAnalysisResult({
            fileName: file.name,
            fileSize: formatBytes(file.size),
            sizeBytes: file.size,
            mimeType: file.type,
            sha256: sha256,
            dataUrl: dataUrl,
            autoFitData: autoFitData,
            extractedFields: {
              documentType: file.type.includes('pdf') ? 'Supporting Document' : 'Photo Specimen',
              detectedName: currentUser?.name || 'Aarav Sharma',
              sha256Fingerprint: sha256.slice(0, 16) + '...'
            }
          });
          setPipelineState('completed');
        }, 500);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Custom file analysis failed:', err);
      setPipelineState('idle');
    }
  };

  // Commit Analyzed Data to Profile Vault & Document Locker
  const handleCommitData = () => {
    // Mandated Sovereign OTP verification before auto-fill
    if (!isOtpVerified) {
      setShowOtpModal(true);
      return;
    }
    executeCommit();
  };

  const handleOtpVerified = (authPayload) => {
    setIsOtpVerified(true);
    executeCommit();
  };

  const executeCommit = () => {
    if (activeTab === 'cloud') {
      const updatedProfile = buildProfileFromDigiLockerDocs(DIGILOCKER_CLOUD_DOCUMENTS, selectedNameChoice);
      
      // Auto-fit the photo & signature docs so they are 100% compliant in locker
      const finalDocs = DIGILOCKER_CLOUD_DOCUMENTS.map(doc => {
        if (doc.autoFitTarget) {
          return {
            ...doc,
            sizeFormatted: doc.autoFitTarget.targetSize,
            sizeBytes: doc.autoFitTarget.targetSizeBytes,
            dimensions: doc.autoFitTarget.targetDimensions,
            sha256: doc.autoFitTarget.targetSha256,
            isCompliant: true,
            verifiedBadge: 'auto_fitted',
            operationsApplied: ['Client-Side Auto-Fit', 'Bicubic Crop', 'Stepping Quality 0.74', 'SHA-256 Merkle Sealed']
          };
        }
        return doc;
      });

      if (onApplyAnalyzedData) {
        onApplyAnalyzedData({
          profile: updatedProfile,
          documents: finalDocs,
          selectedName: selectedNameChoice,
          source: 'digilocker_cloud',
          otpVerified: true
        });
      }
    } else if (activeTab === 'custom_upload' && customAnalysisResult) {
      const newCustomDoc = {
        id: `custom-doc-${Date.now()}`,
        name: customAnalysisResult.fileName,
        title: customAnalysisResult.fileName,
        docType: customAnalysisResult.mimeType.includes('pdf') ? 'academic_degree' : 'photo',
        category: 'custom',
        sizeFormatted: customAnalysisResult.autoFitData?.fixedSize || customAnalysisResult.fileSize,
        sizeBytes: customAnalysisResult.autoFitData?.fixedSizeBytes || customAnalysisResult.sizeBytes,
        dimensions: customAnalysisResult.autoFitData?.fixedDimensions || 'Standard',
        sha256: customAnalysisResult.autoFitData?.fixedSha256 || customAnalysisResult.sha256,
        uploadDate: 'Just now',
        familyMemberId: 'fam-1',
        familyMemberName: currentUser?.name || 'Aarav Sharma',
        source: 'upload',
        verifiedBadge: 'auto_fitted',
        dataUrl: customAnalysisResult.autoFitData?.dataUrl || customAnalysisResult.dataUrl
      };

      if (onApplyAnalyzedData) {
        onApplyAnalyzedData({
          customDocument: newCustomDoc,
          source: 'custom_upload',
          otpVerified: true
        });
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Government / DigiLocker Sovereign Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#002875] via-[#0A3D91] to-[#001B52] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-amber-300 shadow-sm">
              <AshokaChakra size={26} speed="normal" color="#ffffff" accentColor="#ff671f" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-wide">
                  DIGILOCKER SOVEREIGN ANALYZER
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase font-bold">
                  NATIONAL GATEWAY
                </span>
              </div>
              <p className="text-xs text-blue-100/80">
                National Document Ingestion, Entity Extraction &amp; Auto-Fit Compliance Pipeline
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Source Mode Tabs */}
        <div className="flex items-center px-6 pt-3 bg-slate-50 border-b border-slate-200 gap-2">
          <button
            onClick={() => { setActiveTab('cloud'); setPipelineState('idle'); }}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-t-2 ${
              activeTab === 'cloud'
                ? 'bg-white text-[#002875] border-[#FF671F] shadow-xs'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
          >
            <Database size={15} className="text-[#002875]" />
            <span>DigiLocker Cloud Sync (5 Issued Records)</span>
          </button>

          <button
            onClick={() => { setActiveTab('custom_upload'); setPipelineState('idle'); }}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-t-2 ${
              activeTab === 'custom_upload'
                ? 'bg-white text-[#002875] border-[#FF671F] shadow-xs'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
          >
            <UploadCloud size={15} className="text-[#FF671F]" />
            <span>Upload &amp; Analyze Any Document</span>
          </button>
        </div>

        {/* Main Content Area (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">

          {/* ================= MODE 1: DIGILOCKER CLOUD SYNC ================= */}
          {activeTab === 'cloud' && (
            <>
              {/* Linked Identity Handshake Card */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-[#002875] uppercase tracking-wider font-mono">
                      DigiLocker Account Linked
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
                      Aadhaar Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Citizen: <strong>Aarav Sharma</strong> (Mobile: <span className="font-mono text-[#002875]">+91 98765 43210</span>)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    5 official government credentials ready for extraction (UIDAI, CBSE Class X &amp; XII, IIT Delhi, High-Res Photo).
                  </p>
                </div>

                {pipelineState === 'idle' && (
                  <button
                    onClick={handleStartAnalysis}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF671F] to-[#E05A18] hover:brightness-105 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    <Sparkles size={16} className="text-amber-200" />
                    <span>⚡ Pull &amp; Analyze DigiLocker Docs</span>
                  </button>
                )}
              </div>

              {/* Scanning Pipeline Visualizer */}
              {pipelineState === 'scanning' && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-center animate-fadeIn">
                  <div className="flex justify-center">
                    <AshokaChakra size={48} speed="fast" color="#002875" accentColor="#ff671f" />
                  </div>
                  <h4 className="text-base font-bold text-[#002875]">
                    Analyzing DigiLocker Documents &amp; Extracting Metadata...
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                      scanStage >= 1 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      <span>{scanStage >= 1 ? '✓' : '1.'}</span>
                      <span>OAuth PKCE Handshake</span>
                    </div>

                    <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                      scanStage >= 2 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      <span>{scanStage >= 2 ? '✓' : '2.'}</span>
                      <span>Fetching 5 Payloads</span>
                    </div>

                    <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                      scanStage >= 3 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      <span>{scanStage >= 3 ? '✓' : '3.'}</span>
                      <span>Entity Extraction &amp; OCR</span>
                    </div>

                    <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                      scanStage >= 4 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      <span>{scanStage >= 4 ? '✓' : '4.'}</span>
                      <span>Auto-Fit Compliance Check</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Report & Extracted Attributes (when completed) */}
              {pipelineState === 'completed' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Summary Banner */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-emerald-900">
                          DigiLocker Document Analysis Succeeded
                        </h4>
                        <p className="text-xs text-emerald-700">
                          Parsed 5 documents · Extracted 8 identity fields with 98% average confidence · 2 files auto-fitted to government standards.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                      DPDP 2023 Compliant
                    </span>
                  </div>

                  {/* Name Variation Conflict Resolver Alert */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                        <AlertTriangle size={16} className="text-amber-600" />
                        <span>NAME VARIATION DETECTED ACROSS DIGILOCKER DOCUMENTS</span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-800 font-bold uppercase">
                        Requires Citizen Confirmation
                      </span>
                    </div>

                    <p className="text-xs text-slate-700">
                      The analyzer detected a minor spelling discrepancy between your Aadhaar e-KYC record and your Class X CBSE certificate. Please select which legal name variant to auto-fill into application forms:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <label 
                        onClick={() => setSelectedNameChoice('Aarav Sharma')}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          selectedNameChoice === 'Aarav Sharma'
                            ? 'bg-white border-[#002875] ring-2 ring-[#002875]/20 shadow-xs'
                            : 'bg-white/60 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input 
                            type="radio" 
                            name="digiNameChoice" 
                            checked={selectedNameChoice === 'Aarav Sharma'}
                            onChange={() => setSelectedNameChoice('Aarav Sharma')}
                            className="text-[#002875]"
                          />
                          <div>
                            <strong className="text-slate-900 block text-sm">Aarav Sharma</strong>
                            <span className="text-[11px] text-slate-500">Sources: Aadhaar e-KYC &amp; IIT Degree</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                          98% Confidence
                        </span>
                      </label>

                      <label 
                        onClick={() => setSelectedNameChoice('Aarav S. Sharma')}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          selectedNameChoice === 'Aarav S. Sharma'
                            ? 'bg-white border-[#002875] ring-2 ring-[#002875]/20 shadow-xs'
                            : 'bg-white/60 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input 
                            type="radio" 
                            name="digiNameChoice" 
                            checked={selectedNameChoice === 'Aarav S. Sharma'}
                            onChange={() => setSelectedNameChoice('Aarav S. Sharma')}
                            className="text-[#002875]"
                          />
                          <div>
                            <strong className="text-slate-900 block text-sm">Aarav S. Sharma</strong>
                            <span className="text-[11px] text-slate-500">Source: CBSE Class X Certificate</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px]">
                          92% Confidence
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Extracted Fields Table */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                      <Cpu size={14} className="text-[#002875]" />
                      <span>Extracted Profile Attributes &amp; Provenance</span>
                    </h4>

                    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                          <tr>
                            <th className="py-2.5 px-4 font-semibold">Attribute</th>
                            <th className="py-2.5 px-4 font-semibold">Extracted Value</th>
                            <th className="py-2.5 px-4 font-semibold">Confidence</th>
                            <th className="py-2.5 px-4 font-semibold">Source Document</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="py-2.5 px-4 font-medium text-slate-600">Full Legal Name</td>
                            <td className="py-2.5 px-4 font-bold text-[#002875]">{selectedNameChoice}</td>
                            <td className="py-2.5 px-4">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                98%
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-slate-500 text-[11px]">DigiLocker: Aadhaar &amp; Degree</td>
                          </tr>

                          <tr>
                            <td className="py-2.5 px-4 font-medium text-slate-600">Father's Name</td>
                            <td className="py-2.5 px-4 font-bold text-slate-900">Suresh Sharma</td>
                            <td className="py-2.5 px-4">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                97%
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-slate-500 text-[11px]">DigiLocker: CBSE Class X</td>
                          </tr>

                          <tr>
                            <td className="py-2.5 px-4 font-medium text-slate-600">Date of Birth</td>
                            <td className="py-2.5 px-4 font-bold text-slate-900">14 Aug 1998</td>
                            <td className="py-2.5 px-4">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                99%
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-slate-500 text-[11px]">DigiLocker: Aadhaar e-KYC</td>
                          </tr>

                          <tr>
                            <td className="py-2.5 px-4 font-medium text-slate-600">Aadhaar (Masked)</td>
                            <td className="py-2.5 px-4 font-mono font-bold text-slate-900">XXXX-XXXX-4519</td>
                            <td className="py-2.5 px-4">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                100%
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-slate-500 text-[11px]">UIDAI Verified Vault</td>
                          </tr>

                          <tr>
                            <td className="py-2.5 px-4 font-medium text-slate-600">Highest Degree</td>
                            <td className="py-2.5 px-4 font-bold text-[#002875]">B.Tech in Computer Science</td>
                            <td className="py-2.5 px-4">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                100%
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-slate-500 text-[11px]">DigiLocker: IIT Delhi Senate</td>
                          </tr>

                          <tr>
                            <td className="py-2.5 px-4 font-medium text-slate-600">Address &amp; State</td>
                            <td className="py-2.5 px-4 text-slate-900 truncate max-w-xs">Powai, Mumbai - 400076 (Maharashtra)</td>
                            <td className="py-2.5 px-4">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                98%
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-slate-500 text-[11px]">UIDAI Aadhaar Address</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Documents & Auto-Fit Compliance List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                      <FileCheck size={14} className="text-[#0D6838]" />
                      <span>Analyzed DigiLocker Documents &amp; Auto-Fit Sizing</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {DIGILOCKER_CLOUD_DOCUMENTS.map((doc, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-slate-900 truncate max-w-[200px]">
                                {doc.title}
                              </span>
                              {doc.autoFitTarget ? (
                                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold border border-blue-200 shrink-0">
                                  ⚡ Auto-Fitted
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-200 shrink-0">
                                  ✓ Compliant
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{doc.issuer}</p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                            <span className="text-slate-600">
                              {doc.autoFitTarget ? (
                                <span>{doc.sizeFormatted} → <strong className="text-[#002875]">{doc.autoFitTarget.targetSize} ({doc.autoFitTarget.targetDimensions})</strong></span>
                              ) : (
                                <span>{doc.sizeFormatted} · {doc.dimensions}</span>
                              )}
                            </span>

                            {doc.autoFitTarget && onOpenAutoFitPreview && (
                              <button
                                type="button"
                                onClick={() => onOpenAutoFitPreview(doc)}
                                className="text-[#002875] font-bold hover:underline cursor-pointer"
                              >
                                View Split →
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Missing Records in DigiLocker: Auto-Procurement Consent Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-blue-50 border-2 border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-amber-600 text-white shadow-xs shrink-0 mt-0.5">
                        <Zap className="w-5 h-5 fill-amber-300 text-amber-300 animate-bounce" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                          <span>Missing from DigiLocker: State Income &amp; Domicile Certificate</span>
                          <span className="text-[10px] font-mono px-2 py-0.2 bg-amber-200 text-amber-900 rounded-full font-bold">Auto-Procure Ready</span>
                        </h5>
                        <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                          Your linked DigiLocker does not contain an active Domicile or Income record. Grant statutory consent for BHAROSA to automatically apply on the State e-District portal and notify you upon issuance.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setMissingProcureItem({
                          id: 'income_and_domicile',
                          title: 'State Domicile & Income Certificate (Tehsildar Attested)',
                          docType: 'address_proof',
                          authority: 'Department of Revenue & Civic Administration (e-District Gateway)'
                        });
                        setProcureModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#002875] hover:bg-[#0A3D91] text-white text-xs font-bold shrink-0 shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] transition-all whitespace-nowrap"
                    >
                      <Zap size={13} className="text-amber-300 fill-amber-300" />
                      <span>Authorize Auto-Apply &amp; Notify →</span>
                    </button>
                  </div>

                </div>
              )}
            </>
          )}

          {/* ================= MODE 2: CUSTOM FILE UPLOAD & ANALYZE ================= */}
          {activeTab === 'custom_upload' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl border-2 border-dashed border-[#002875]/30 bg-blue-50/40 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white text-[#002875] shadow-sm flex items-center justify-center text-2xl border border-blue-200">
                  📁
                </div>
                <h4 className="text-sm font-bold text-[#002875]">
                  Drop Any Document, Photo, or PDF to Analyze
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Our sovereign client-side analyzer will extract metadata, calculate cryptographic SHA-256 hash, and auto-fit dimensions to government standards in browser memory.
                </p>

                <div className="pt-2">
                  <label className="btn btn-primary text-xs py-2.5 px-5 shadow-md cursor-pointer inline-flex items-center gap-2">
                    <UploadCloud size={16} />
                    <span>Select Local File from Computer / Mobile</span>
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleCustomFileUpload}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Custom Upload Analysis Result */}
              {customAnalysisResult && (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{customAnalysisResult.fileName}</h4>
                      <p className="text-xs text-slate-500 font-mono">
                        {customAnalysisResult.fileSize} · {customAnalysisResult.mimeType}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                      ✓ Analyzed &amp; Fingerprinted
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-mono block">SHA-256 Merkle Hash</span>
                      <code className="text-[#002875] font-mono text-[11px] block truncate">
                        {customAnalysisResult.sha256}
                      </code>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-mono block">Auto-Fit Optimization</span>
                      <strong className="text-emerald-700 text-xs">
                        {customAnalysisResult.autoFitData ? `Auto-Fitted to ${customAnalysisResult.autoFitData.fixedSize} (${customAnalysisResult.autoFitData.fixedDimensions})` : 'Compliant Size'}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>DPDP Act 2023 &amp; IT Act 2000 Section 43A Compliant</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>

            {(pipelineState === 'completed' || customAnalysisResult) && (
              <button
                onClick={handleCommitData}
                id="btn-apply-digilocker-analyzed"
                className="w-full sm:w-auto btn btn-primary text-xs py-2.5 px-6 shadow-md flex items-center justify-center gap-2 cursor-pointer font-bold"
              >
                <span>🚀 Apply Analyzed Data &amp; Populate Forms</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Sovereign OTP Verification Modal before Auto-Fill */}
      <AutoFillOtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerified={handleOtpVerified}
        purposeText="Authorizing DigiLocker e-KYC Data Release for Application Auto-Fill"
        targetMobile={currentUser?.phone || '+91 ******4210'}
        targetAadhaar={currentUser?.aadhaarMasked || 'XXXX-XXXX-4519'}
      />

      {/* Autonomous Credential Procurement Modal */}
      <AutoProcureModal
        isOpen={procureModalOpen}
        onClose={() => setProcureModalOpen(false)}
        missingItem={missingProcureItem}
        currentUser={currentUser}
        profile={null}
        onNotify={onNotify}
        onProcured={(newDoc, notifData) => {
          if (onAddLockerDocument) {
            onAddLockerDocument(newDoc);
          }
          if (onNotify) {
            onNotify(notifData);
          }
        }}
      />
    </div>
  );
}
