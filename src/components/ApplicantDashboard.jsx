import React, { useState } from 'react';
import { 
  FileCheck2, 
  Clock, 
  CheckCircle2, 
  FilePlus, 
  Eye, 
  ShieldCheck, 
  Search, 
  Flame, 
  Users, 
  Repeat, 
  FileText,
  Sparkles,
  Sliders,
  Layers,
  FolderLock,
  Download,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import AshokaChakra from './AshokaChakra';
import DocumentLockerTab from './DocumentLockerTab';

export default function ApplicantDashboard({
  currentUser,
  certificates,
  applications,
  lockerDocuments = [],
  onOpenApply,
  onOpenExaminations,
  onOpenFamilyHub,
  onOpenLegacyDigitalize,
  onOpenDocServices,
  onViewCertificate,
  onViewUploadedDocs,
  onOpenAutoFit,
  onOpenMergePdf,
  onOpenProfileVault,
  onOpenDigiLockerAnalysis,
  onDeleteLockerDoc,
  onRenameLockerDoc,
  autoFillConsent = true,
  language = 'EN'
}) {
  const [dashboardSubTab, setDashboardSubTab] = useState('locker'); // 'locker' | 'vault' | 'tracker'
  const [selectedSectorFilter, setSelectedSectorFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate metrics
  const totalApps = applications.length;
  const pendingApps = applications.filter(a => 
    a.status === 'UNDER_REVIEW' || a.status === 'under_scrutiny' || a.status === 'submitted'
  );
  const totalCerts = certificates.length;

  // Filter certificates
  const filteredCerts = certificates.filter(cert => {
    const matchesSector = selectedSectorFilter === 'all' || cert.sectorId === selectedSectorFilter;
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cert.authorityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cert.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn text-[#0f172a]">
      
      {/* Sovereign Welcome & Action Hero (india.gov.in Light Theme) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2e8f0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle Sovereign Tricolor Accent Top Border */}
        <div 
          className="absolute top-0 left-0 right-0 h-[4px]" 
          style={{ background: 'linear-gradient(90deg, #FF671F 0%, #FF671F 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #046A38 66.6%, #046A38 100%)' }} 
        />

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fef3c7] border border-[#fde68a] text-xs font-mono text-[#92400e] font-semibold mb-3">
            <AshokaChakra size={16} color="#002875" accentColor="#ff671f" />
            NAGRIK SOVEREIGN VAULT • नागरिक लॉकर
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002875] tracking-tight">
            Welcome, {currentUser?.name || 'Aarav Sharma'}
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-1.5 max-w-xl leading-relaxed">
            Your sovereign digital repository for verified government credentials, auto-fit compliant uploads, and one-click application filing across Bharat.
          </p>
          <div className="mt-3.5 text-xs font-mono text-[#64748b] flex flex-wrap items-center gap-4">
            <span className="px-2.5 py-1 rounded bg-[#f1f5f9] border border-[#e2e8f0]">
              Aadhaar: <strong className="text-[#0f172a]">{currentUser?.aadhaarMasked || 'XXXX-XXXX-4519'}</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-[#f1f5f9] border border-[#e2e8f0]">
              Citizen ID: <strong className="text-[#002875]">{currentUser?.id || 'BHR-CITIZEN-9842'}</strong>
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenExaminations}
            id="dash-exam-forms-btn"
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-700 to-[#002875] hover:brightness-110 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <GraduationCap size={16} />
            <span>National Exam Forms</span>
          </button>

          <button
            onClick={onOpenApply}
            id="dash-apply-new-btn"
            className="btn btn-primary w-full sm:w-auto text-xs py-3 px-5 shadow-md cursor-pointer"
          >
            <FilePlus size={16} />
            <span>Apply for New Credential</span>
          </button>

          <button
            onClick={onOpenFamilyHub}
            id="dash-family-hub-btn"
            className="btn btn-secondary w-full sm:w-auto text-xs py-3 px-4 cursor-pointer"
          >
            <Users size={16} />
            <span>Family Hub</span>
          </button>
        </div>
      </div>

      {/* ================= FLAGSHIP CORE AIM: SMART AUTO-FILL & DOCUMENT AUTO-FIT ================= */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-emerald-50/80 border-2 border-[#002875]/20 shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '4s' }} />
              <span>CORE PORTAL MISSION: ZERO-REJECTION APPLICATION FILING</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#002875] tracking-tight">
              Smart Auto-Fill &amp; Client-Side Document Auto-Fit Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Never fail government portal photo dimensions, signature sizes, or 200 KB PDF limits again. BHAROSA auto-crops, auto-compresses, and auto-fills your verified documents across all national services with 100% privacy and zero server uploads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenDigiLockerAnalysis}
              id="dash-sync-digilocker-btn"
              className="px-5 py-2.5 rounded-2xl bg-[#002875] hover:bg-[#0A3D91] text-white text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <AshokaChakra size={16} color="#ffffff" accentColor="#ff671f" />
              <span>⚡ Sync & Analyze DigiLocker</span>
            </button>

            <button
              onClick={onOpenProfileVault}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-[#002875] text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>⚡ Profile Vault &amp; Conflicts</span>
            </button>

            <button
              onClick={() => {
                const sampleDoc = lockerDocuments.find(d => d.isNonCompliant) || lockerDocuments[0];
                if (sampleDoc && onOpenAutoFit) {
                  onOpenAutoFit(sampleDoc);
                }
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF671F] to-[#E05A18] hover:brightness-105 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Test Auto-Fit Engine (3.4 MB Photo) →</span>
            </button>
          </div>
        </div>

        {/* 3 Pillar Micro-Cards */}
        <div className="mt-5 pt-4 border-t border-[#002875]/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/80">
            <div className="flex items-center gap-2 font-bold text-[#002875] mb-1">
              <FolderLock className="w-4 h-4 text-blue-600" />
              <span>1. My Documents Locker</span>
            </div>
            <p className="text-[11px] text-slate-600">
              {lockerDocuments.length} files saved with SHA-256 Merkle hashes, ready to auto-populate any form.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/80">
            <div className="flex items-center gap-2 font-bold text-[#002875] mb-1">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>2. Client-Side Auto-Fit</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Stepping JPEG compression &amp; bicubic crop ensures instant compliance (20-50 KB, 200x230 px).
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/80">
            <div className="flex items-center gap-2 font-bold text-[#002875] mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>3. One-Click Auto-Fill</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Fills 6+ fields with source chips, conflict resolver, and locked sovereign field safeguards.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Applied */}
        <div className="p-5 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#475569]">Total Applied</span>
            <span className="p-2 rounded-lg bg-[#eff6ff] text-[#002875]">
              <FileCheck2 size={18} />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#0f172a]">{totalApps}</div>
          <div className="text-[11px] text-[#64748b] mt-1 font-medium">All-time applications filed</div>
        </div>

        {/* Card 2: Pending Scrutiny */}
        <div className="p-5 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#475569]">Pending Verification</span>
            <span className="p-2 rounded-lg bg-[#fffbeb] text-[#d97706]">
              <Clock size={18} />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#d97706]">{pendingApps.length}</div>
          <div className="text-[11px] text-[#64748b] mt-1 font-medium">Under authority review</div>
        </div>

        {/* Card 3: Locker Files */}
        <div className="p-5 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#475569]">Locker Documents</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <FolderLock size={18} />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#138808]">{lockerDocuments.length}</div>
          <div className="text-[11px] text-[#64748b] mt-1 font-medium">Auto-fit &amp; reusable</div>
        </div>

        {/* Card 4: Verified Credentials */}
        <div className="p-5 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm">
          <div className="flex items-center justify-between text-[#64748b] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#475569]">Verified Vault</span>
            <span className="p-2 rounded-lg bg-[#ecfdf5] text-[#138808]">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#002875]">{totalCerts}</div>
          <div className="text-[11px] text-[#64748b] mt-1 font-medium">Digitally signed credentials</div>
        </div>

      </div>

      {/* ================= DASHBOARD SUB-NAVIGATION BAR ================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          
          <button
            onClick={() => setDashboardSubTab('locker')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              dashboardSubTab === 'locker'
                ? 'bg-[#002875] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#002875] hover:bg-slate-100'
            }`}
          >
            <FolderLock size={15} />
            <span>📁 My Documents Locker ({lockerDocuments.length})</span>
          </button>

          <button
            onClick={() => setDashboardSubTab('vault')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              dashboardSubTab === 'vault'
                ? 'bg-[#002875] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#002875] hover:bg-slate-100'
            }`}
          >
            <ShieldCheck size={15} />
            <span>🏛️ Nagrik Verified Credentials ({totalCerts})</span>
          </button>

          <button
            onClick={() => setDashboardSubTab('tracker')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              dashboardSubTab === 'tracker'
                ? 'bg-[#002875] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#002875] hover:bg-slate-100'
            }`}
          >
            <Clock size={15} />
            <span>📋 Track Applications ({totalApps})</span>
          </button>

        </div>

        {/* Quick Utilities */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenProfileVault}
            className="text-xs font-bold text-[#002875] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Profile Vault</span>
          </button>
        </div>
      </div>

      {/* ================= VIEW 1: MY DOCUMENTS LOCKER ================= */}
      {dashboardSubTab === 'locker' && (
        <DocumentLockerTab
          documents={lockerDocuments}
          onOpenAutoFit={onOpenAutoFit}
          onOpenMergePdf={onOpenMergePdf}
          onOpenDigiLockerAnalysis={onOpenDigiLockerAnalysis}
          onViewDoc={(doc) => {
            if (onViewUploadedDocs) {
              onViewUploadedDocs([doc], 0, doc.title, currentUser?.name);
            }
          }}
          onDeleteDoc={onDeleteLockerDoc}
          onRenameDoc={onRenameLockerDoc}
          language={language}
        />
      )}

      {/* ================= VIEW 2: VERIFIED CREDENTIALS VAULT ================= */}
      {dashboardSubTab === 'vault' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2e8f0] shadow-sm">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#f1f5f9]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-xl bg-[#eff6ff] text-[#002875]">
                  <ShieldCheck size={22} />
                </span>
                <h2 className="text-xl font-bold text-[#002875]">
                  Nagrik Verified Credentials ({filteredCerts.length})
                </h2>
              </div>
              <p className="text-xs text-[#64748b] mt-1">
                Cryptographically attested credentials signed by accredited sovereign authorities.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-[#94a3b8]" />
                <input
                  type="text"
                  placeholder="Filter credentials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field text-xs pl-8 py-2 w-full sm:w-56"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCerts.map((cert) => (
              <div
                key={cert.id}
                className="p-5 rounded-2xl bg-white border border-[#e2e8f0] hover:border-[#002875] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="badge badge-blue text-[10px] font-bold font-mono">
                      {cert.sectorName}
                    </span>
                    <span className="badge badge-emerald text-[10px] font-mono flex items-center gap-1">
                      <CheckCircle2 size={11} />
                      {cert.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#0f172a] leading-tight mb-1">
                    {cert.title}
                  </h3>
                  <div className="text-xs text-[#475569] font-medium">{cert.authorityName}</div>

                  <div className="mt-4 p-2.5 rounded-xl bg-[#f8fafc] border border-[#f1f5f9] space-y-1 text-[11px] font-mono text-[#64748b]">
                    <div className="flex justify-between">
                      <span>ID:</span>
                      <strong className="text-[#0f172a]">{cert.id}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Issued:</span>
                      <span>{cert.issueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Proof:</span>
                      <span className="text-[#138808] font-bold truncate max-w-[140px]">{cert.merkleProof}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onViewCertificate(cert.id)}
                    className="btn btn-secondary w-full py-2 text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Eye size={13} />
                    <span>View Certificate</span>
                  </button>

                  <button
                    onClick={onOpenDocServices}
                    title="Order PVC Card or Re-print"
                    className="btn btn-secondary py-2 text-xs cursor-pointer"
                  >
                    <Repeat size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= VIEW 3: TRACK APPLICATIONS & PROOFS ================= */}
      {dashboardSubTab === 'tracker' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2e8f0] shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9] mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#002875]">
                My Applications &amp; Scrutiny Tracker ({applications.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time tracking of applications submitted with auto-fitted attachments and cryptographic proofs.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {applications.map((app) => (
              <div 
                key={app.id} 
                className="p-5 rounded-2xl bg-white border border-[#e2e8f0] hover:border-[#cbd5e1] hover:shadow-xs transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#002875] bg-[#eff6ff] px-2 py-0.5 rounded border border-[#dbeafe]">
                        {app.id}
                      </span>
                      {app.isTatkal && (
                        <>
                          <span className="badge badge-amber text-[10px] font-bold flex items-center gap-1">
                            <Flame size={11} className="fill-[#ff671f]" /> TATKAL PRIORITY
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300">
                            ⚡ Prob: {app.tatkalProbability || '98.4%'}
                          </span>
                        </>
                      )}
                      {app.isAutoFilled && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300">
                          Auto-Filled
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-[#0f172a]">{app.documentTitle}</h3>
                    <div className="text-xs text-[#64748b]">Authority: <strong>{app.authorityName}</strong></div>

                    {/* Sovereign Tatkal Escrow Refund Policy Protection Strip */}
                    {app.isTatkal && (
                      <div className="mt-1 p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                        <div className="flex items-center gap-2 text-amber-950 font-medium">
                          <ShieldCheck size={14} className="text-amber-600 shrink-0" />
                          <span>
                            <strong>SLA Escrow Protection:</strong> If delayed beyond SLA, <strong>₹{app.tatkalRefundPolicy?.guaranteedRefund || (app.tatkalFee ? app.tatkalFee - 50 : 450)}</strong> is automatically refunded to your UPI (₹{app.tatkalRefundPolicy?.processingFeeDeducted || 50} processing fee deducted).
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded shrink-0">
                          {app.tatkalRefundPolicy?.refundStatus === 'REFUNDED' ? 'REFUND CREDITED' : 'ESCROW ACTIVE'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="badge badge-amber text-xs font-bold">{app.status?.toUpperCase() || 'SUBMITTED'}</span>
                    <div className="text-[11px] text-[#64748b] mt-1 font-medium">Submitted: {app.submittedOn}</div>
                  </div>
                </div>

                {/* Uploaded Supporting Proofs Strip */}
                <div className="pt-3 border-t border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-[#64748b] uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                      <FileText size={13} className="text-[#002875]" />
                      Uploaded Proofs ({(app.uploadedDocuments || []).length || 2}):
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(app.uploadedDocuments && app.uploadedDocuments.length > 0 ? app.uploadedDocuments : [
                        { name: 'Identity_Proof_Aadhaar.pdf', size: '1.2 MB' },
                        { name: 'Qualifying_Marksheet_Scan.pdf', size: '2.1 MB' }
                      ]).map((doc, docIdx, arr) => (
                        <button
                          key={docIdx}
                          type="button"
                          onClick={() => {
                            if (onViewUploadedDocs) {
                              onViewUploadedDocs(arr, docIdx, app.documentTitle, app.applicantName);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#cbd5e1] text-[11px] font-mono text-[#002875] hover:bg-slate-100 transition-all cursor-pointer font-semibold shadow-2xs"
                        >
                          <Eye size={12} />
                          <span className="truncate max-w-[140px]">{doc.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onViewUploadedDocs) {
                        onViewUploadedDocs(
                          app.uploadedDocuments || [
                            { name: 'Identity_Proof_Aadhaar.pdf', size: '1.2 MB' },
                            { name: 'Qualifying_Marksheet_Scan.pdf', size: '2.1 MB' }
                          ],
                          0,
                          app.documentTitle,
                          app.applicantName
                        );
                      }
                    }}
                    className="btn btn-secondary py-1 px-3 text-xs cursor-pointer shrink-0"
                  >
                    <Eye size={13} />
                    <span>View All Files</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: Quick Gateway Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Banner 1: Legacy Digitalization */}
        <div 
          onClick={onOpenLegacyDigitalize}
          className="p-5 rounded-2xl bg-white border border-[#e2e8f0] hover:border-[#ff671f] hover:shadow-md cursor-pointer transition-all"
        >
          <div className="p-2.5 w-fit rounded-xl bg-[#fff7ed] text-[#ea580c] mb-3 border border-[#ffedd5]">
            <FileText size={22} />
          </div>
          <h3 className="text-sm font-bold text-[#002875]">Digitalize Vintage Paper Records</h3>
          <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
            Convert vintage physical degrees, land deeds, and manual certificates into official digital assets.
          </p>
        </div>

        {/* Banner 2: Hardcopy Print & PVC */}
        <div 
          onClick={onOpenDocServices}
          className="p-5 rounded-2xl bg-white border border-[#e2e8f0] hover:border-[#002875] hover:shadow-md cursor-pointer transition-all"
        >
          <div className="p-2.5 w-fit rounded-xl bg-[#eff6ff] text-[#002875] mb-3 border border-[#dbeafe]">
            <Repeat size={22} />
          </div>
          <h3 className="text-sm font-bold text-[#002875]">Print Official Hardcopy &amp; PVC Cards</h3>
          <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
            Order official 250 GSM parchment certificates or Smart PVC Cards delivered via Speed Post.
          </p>
        </div>

        {/* Banner 3: Family Multi-Aadhaar Hub */}
        <div 
          onClick={onOpenFamilyHub}
          className="p-5 rounded-2xl bg-white border border-[#e2e8f0] hover:border-[#16a34a] hover:shadow-md cursor-pointer transition-all"
        >
          <div className="p-2.5 w-fit rounded-xl bg-[#ecfdf5] text-[#16a34a] mb-3 border border-[#a7f3d0]">
            <Users size={22} />
          </div>
          <h3 className="text-sm font-bold text-[#002875]">Family / Parivar Vault</h3>
          <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
            Manage credentials and apply for scholarships on behalf of family members linked to your mobile.
          </p>
        </div>

      </div>

    </div>
  );
}
