import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Eye, 
  FileCheck2, 
  Key, 
  Zap, 
  AlertTriangle,
  Download,
  Stamp,
  FileText
} from 'lucide-react';
import AshokaChakra from './AshokaChakra';

export default function AuthorityDashboard({
  currentUser,
  applications = [],
  onApproveApplication,
  onRejectApplication,
  onViewCertificate,
  onViewUploadedDocs,
  sectors = []
}) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'tatkal' | 'approved' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [signingModalOpen, setSigningModalOpen] = useState(false);
  const [signingState, setSigningState] = useState('idle'); // 'idle' | 'hashing' | 'signing' | 'completed'
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  // Authority sector filtering
  const authorityApps = applications.filter(app => {
    // Search query match
    const matchesSearch = 
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.documentTitle.toLowerCase().includes(searchQuery.toLowerCase());

    // Sector match
    const matchesSector = sectorFilter === 'all' || app.sectorId === sectorFilter;

    // Tab match
    if (activeTab === 'pending') return matchesSearch && matchesSector && (app.status === 'under_scrutiny' || app.status === 'submitted');
    if (activeTab === 'tatkal') return matchesSearch && matchesSector && app.isTatkal && app.status !== 'approved';
    if (activeTab === 'approved') return matchesSearch && matchesSector && app.status === 'approved';
    return matchesSearch && matchesSector;
  });

  const pendingCount = applications.filter(a => a.status === 'under_scrutiny' || a.status === 'submitted').length;
  const tatkalCount = applications.filter(a => a.isTatkal && a.status !== 'approved').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;

  const handleStartSign = (app) => {
    setSelectedApp(app);
    setSigningModalOpen(true);
    setSigningState('idle');
    setShowRejectInput(false);
    setRejectionReason('');
  };

  const handleExecuteDigitalSignature = () => {
    setSigningState('hashing');
    setTimeout(() => {
      setSigningState('signing');
      setTimeout(() => {
        setSigningState('completed');
        setTimeout(() => {
          onApproveApplication?.(selectedApp.id);
          setSigningModalOpen(false);
          setSigningState('idle');
          setSelectedApp(null);
        }, 1200);
      }, 1500);
    }, 1200);
  };

  const handleConfirmRejection = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a statutory justification for deficiency rejection.');
      return;
    }
    onRejectApplication?.(selectedApp.id, rejectionReason);
    setSigningModalOpen(false);
    setSelectedApp(null);
    setShowRejectInput(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner: Authority Accreditation */}
      <div className="relative rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-md overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 opacity-5 pointer-events-none">
          <AshokaChakra size={260} speed="slow" color="#002875" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[#002875]">
                <Building2 size={24} />
              </span>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#002875] font-semibold">
                  GOVERNMENT OF INDIA ACCREDITED ISSUER NODE
                </span>
                <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-900">
                  Sovereign Attestation & Scrutiny Portal
                </h1>
              </div>
            </div>
            <p className="text-sm text-slate-600 max-w-2xl">
              Official digital signing workbench with SHA-256 cryptographic attestation, automated Aadhaar e-Sign token binding, and Tatkal fast-track queue arbitration.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#138808] animate-ping"></span>
              <span className="text-xs font-mono text-[#002875] font-semibold">DSC Token Active: e-Sign v3.2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Authority Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pending Scrutiny */}
        <div 
          onClick={() => setActiveTab('pending')}
          className={`cursor-pointer p-5 rounded-2xl border transition-all ${
            activeTab === 'pending'
              ? 'bg-blue-50/70 border-[#002875] shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase font-semibold">Under Scrutiny</span>
            <span className="p-2 rounded-lg bg-blue-50 text-[#002875]">
              <Clock size={18} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-outfit">{pendingCount}</span>
            <span className="text-xs text-[#002875] font-semibold">Requiring Action</span>
          </div>
        </div>

        {/* Tatkal Priority */}
        <div 
          onClick={() => setActiveTab('tatkal')}
          className={`cursor-pointer p-5 rounded-2xl border transition-all ${
            activeTab === 'tatkal'
              ? 'bg-orange-50/70 border-[#FF671F] shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#FF671F] uppercase font-bold flex items-center gap-1">
              <Zap size={14} className="fill-[#FF671F]" /> Tatkal Priority
            </span>
            <span className="p-2 rounded-lg bg-orange-50 text-[#FF671F]">
              <Zap size={18} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#FF671F] font-outfit">{tatkalCount}</span>
            <span className="text-xs text-[#FF671F] font-semibold">Urgent Fast-Track</span>
          </div>
        </div>

        {/* Approved Records */}
        <div 
          onClick={() => setActiveTab('approved')}
          className={`cursor-pointer p-5 rounded-2xl border transition-all ${
            activeTab === 'approved'
              ? 'bg-emerald-50/70 border-emerald-600 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase font-semibold">Attested & Issued</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-700 font-outfit">{approvedCount}</span>
            <span className="text-xs text-slate-500 font-semibold">Live on Ledger</span>
          </div>
        </div>

        {/* Total Ledger Flow */}
        <div 
          onClick={() => setActiveTab('all')}
          className={`cursor-pointer p-5 rounded-2xl border transition-all ${
            activeTab === 'all'
              ? 'bg-blue-50/70 border-[#002875] shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase font-semibold">Total Submissions</span>
            <span className="p-2 rounded-lg bg-blue-50 text-[#002875]">
              <FileText size={18} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-outfit">{applications.length}</span>
            <span className="text-xs text-slate-500">Processed</span>
          </div>
        </div>

      </div>

      {/* Scrutiny Worklist Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Application ID, Applicant Name, or Document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#002875] focus:outline-none"
          />
        </div>

        {/* Sector Filter */}
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-slate-400" />
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-[#002875] focus:outline-none"
          >
            <option value="all">All Sovereign Sectors</option>
            {sectors.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Applications Scrutiny Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono uppercase text-[#002875]">
                <th className="py-3.5 px-4 font-semibold">Priority / App ID</th>
                <th className="py-3.5 px-4 font-semibold">Applicant & Citizen KYC</th>
                <th className="py-3.5 px-4 font-semibold">Target Credential</th>
                <th className="py-3.5 px-4 font-semibold">Required Proofs</th>
                <th className="py-3.5 px-4 font-semibold">Stage & SLA</th>
                <th className="py-3.5 px-4 font-semibold text-right">Attestation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {authorityApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CheckCircle2 size={32} className="text-[#138808]" />
                      <p className="font-semibold text-sm text-slate-800">All pending applications in this queue have been scrutinized.</p>
                      <p className="text-xs text-slate-500">No action required at this moment.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                authorityApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* App ID & Tatkal indicator */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {app.isTatkal && (
                          <span className="px-2 py-0.5 rounded-full bg-orange-100 border border-orange-300 text-[#FF671F] font-bold text-[10px] flex items-center gap-0.5">
                            <Zap size={11} className="fill-[#FF671F]" /> TATKAL
                          </span>
                        )}
                        <span className="font-mono text-slate-900 font-semibold">{app.id}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">{app.submittedOn}</span>
                    </td>

                    {/* Applicant */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900">{app.applicantName}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                        <span>Aadhaar: {app.aadhaarMasked || 'XXXX-XXXX-4912'}</span>
                      </div>
                    </td>

                    {/* Target Credential */}
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-900">{app.documentTitle}</div>
                      <div className="text-[11px] text-[#002875] font-semibold mt-0.5">{app.authorityName}</div>
                    </td>

                    {/* Required Proofs */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (onViewUploadedDocs) {
                              onViewUploadedDocs(
                                app.uploadedDocuments || [
                                  { name: 'Primary_Eligibility_Proof.pdf', size: '2.1 MB', sha256: '9f86d081884c7d659a2f...' },
                                  { name: 'Aadhaar_KYC_Identity.pdf', size: '1.1 MB', sha256: '5e884898da28047151d0...' }
                                ],
                                0,
                                app.documentTitle || app.title,
                                app.applicantName
                              );
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#002875] border border-blue-200 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm font-semibold"
                          title="Click to view all uploaded files for this application"
                        >
                          <Eye size={12} />
                          <span>View Proofs ({app.uploadedDocuments?.length || 2})</span>
                        </button>
                        <span className="text-[10px] text-slate-400 block font-mono">SHA-256 verified</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {app.status === 'under_scrutiny' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                          <Clock size={12} /> Under Scrutiny
                        </span>
                      )}
                      {app.status === 'submitted' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-semibold">
                          <Clock size={12} /> Received
                        </span>
                      )}
                      {app.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                          <CheckCircle2 size={12} /> Digitally Signed
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-semibold">
                          <XCircle size={12} /> Rejected
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      {app.status === 'approved' ? (
                        <button
                          onClick={() => onViewCertificate(app.certificateId || 'BHAROSA-CERT-01')}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#002875] font-semibold inline-flex items-center gap-1.5 transition-all text-xs cursor-pointer shadow-sm"
                        >
                          <Eye size={13} /> View Issued Cert
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartSign(app)}
                          className="btn btn-primary px-3 py-1.5 inline-flex items-center gap-1.5 shadow-sm text-xs cursor-pointer"
                        >
                          <Stamp size={14} /> Scrutinize & Sign
                        </button>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Digital Attestation Modal */}
      {signingModalOpen && selectedApp && (
        <div className="modal-overlay">
          <div className="modal-content max-w-2xl p-6 sm:p-8 space-y-6 bg-white border border-slate-200 shadow-2xl rounded-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#002875] border border-blue-200">
                  <Stamp size={22} />
                </div>
                <div>
                  <h2 className="font-cinzel text-xl font-bold text-slate-900">
                    Sovereign Attestation & Cryptographic Signing
                  </h2>
                  <p className="text-xs text-slate-500 font-mono">
                    Application ID: {selectedApp.id}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSigningModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Document & Applicant Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Citizen / Beneficiary</span>
                <p className="font-semibold text-slate-900 text-sm mt-0.5">{selectedApp.applicantName}</p>
                <p className="text-xs text-slate-500 font-mono">Aadhaar: {selectedApp.aadhaarMasked || 'XXXX-XXXX-4912'}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Document Title</span>
                <p className="font-semibold text-[#002875] text-sm mt-0.5">{selectedApp.documentTitle}</p>
                <p className="text-xs text-slate-500">{selectedApp.authorityName}</p>
              </div>
            </div>

            {/* Attached Proofs Checklist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider block">
                  Verified Required Proof Documents
                </span>
                <span className="text-[11px] text-[#002875] font-mono font-semibold">
                  {(selectedApp.uploadedDocuments || []).length || 2} documents attached
                </span>
              </div>
              <div className="space-y-2">
                {(selectedApp.uploadedDocuments && selectedApp.uploadedDocuments.length > 0
                  ? selectedApp.uploadedDocuments
                  : [
                      { name: 'Consolidated Marksheet / Institutional Verification.pdf', size: '2.4 MB', hash: '8f92a1...bc91', verifiedBadge: 'verified', source: 'vault' },
                      { name: 'Aadhaar Identity Proof & Resident Card.pdf', size: '1.1 MB', hash: 'e410b2...721d', verifiedBadge: 'auto_fitted' }
                    ]
                ).map((doc, idx, arr) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#138808] shrink-0" />
                        <span className="text-slate-900 font-medium truncate max-w-xs">{doc.name}</span>
                        <span className="text-slate-500">({doc.size || doc.sizeFormatted || '1.5 MB'})</span>
                      </div>
                      
                      {/* Auto-Fill Provenance Badge */}
                      {doc.verifiedBadge === 'verified' || doc.source === 'vault' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 w-fit">
                          ✓ Verified BHAROSA-Signed
                        </span>
                      ) : doc.verifiedBadge === 'auto_fitted' || (doc.operationsApplied && doc.operationsApplied.length > 0) ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold border border-blue-300 w-fit">
                          ⚡ Auto-Fitted &amp; Compliant
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 w-fit">
                          📄 Self-Uploaded Proof
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className="font-mono text-[10px] text-[#002875] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-semibold">
                        SHA: {(doc.sha256 || doc.hash || 'e3b0c442...').slice(0, 10)}...
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (onViewUploadedDocs) {
                            onViewUploadedDocs(arr, idx, selectedApp.documentTitle || selectedApp.title, selectedApp.applicantName);
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-[#002875] border border-slate-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                        title="Open document in viewer"
                      >
                        <Eye size={12} />
                        <span>View Document</span>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Quick Discrepancy Connector */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500 font-mono">Discrepancy Scrutiny:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectInput(true);
                      setRejectionReason('I01: Name / Identity Discrepancy — The name on the submitted supporting record differs from the applicant profile name. Please resolve in Profile Vault or provide legal Gazette notification.');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1 shadow-xs"
                  >
                    <span>⚠️ 1-Click Name Mismatch (I01)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Signing Animation State */}
            {signingState !== 'idle' && (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <div className="flex justify-center">
                  <AshokaChakra size={48} speed="fast" color="#002875" accentColor="#ff671f" />
                </div>
                {signingState === 'hashing' && (
                  <p className="text-xs font-mono text-[#002875] animate-pulse">
                    [1/3] Generating SHA-256 Merkle Hash of Document Proofs...
                  </p>
                )}
                {signingState === 'signing' && (
                  <p className="text-xs font-mono text-[#FF671F] animate-pulse font-semibold">
                    [2/3] Applying Sovereign HSM RSA-4096 / e-Sign Digital Signature...
                  </p>
                )}
                {signingState === 'completed' && (
                  <p className="text-xs font-mono text-[#138808] font-bold">
                    ✓ Certificate Minted & Dispatched to Nagrik Vault!
                  </p>
                )}
              </div>
            )}

            {/* Rejection input with Quick Deficiency Codes */}
            {showRejectInput && (
              <div className="space-y-3 p-4 rounded-xl bg-rose-50 border border-rose-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-rose-700">Reason for Rejection / Deficiency Notice:</label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-rose-600 font-mono">Quick Codes:</span>
                    <button
                      type="button"
                      onClick={() => setRejectionReason('I01: Name / Identity Discrepancy — Name variation between Aadhaar and submitted marksheets.')}
                      className="px-1.5 py-0.5 rounded bg-white border border-rose-300 text-[10px] font-mono text-rose-800 hover:bg-rose-100"
                    >
                      I01
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectionReason('D03: Illegible Scan / Blur — Resolution insufficient for verification; please re-scan.')}
                      className="px-1.5 py-0.5 rounded bg-white border border-rose-300 text-[10px] font-mono text-rose-800 hover:bg-rose-100"
                    >
                      D03
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectionReason('V02: Expired Prerequisite — Supporting certificate term validity has elapsed.')}
                      className="px-1.5 py-0.5 rounded bg-white border border-rose-300 text-[10px] font-mono text-rose-800 hover:bg-rose-100"
                    >
                      V02
                    </button>
                  </div>
                </div>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Specify deficiency in submitted documents..."
                  className="w-full p-2.5 bg-white border border-rose-300 rounded-lg text-xs text-slate-900 focus:outline-none"
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowRejectInput(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmRejection}
                    className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-lg text-xs hover:bg-rose-700 cursor-pointer shadow-sm"
                  >
                    Confirm Rejection Notice
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            {signingState === 'idle' && !showRejectInput && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowRejectInput(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs transition-all cursor-pointer"
                >
                  Reject with Deficiency Notice
                </button>

                <button
                  onClick={handleExecuteDigitalSignature}
                  className="w-full sm:w-auto btn btn-primary flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Key size={16} />
                  <span>Digitally Sign & Approve Certificate</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
