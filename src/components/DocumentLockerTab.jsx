import React, { useState } from 'react';
import { 
  FolderLock, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  AlertTriangle, 
  Layers, 
  UploadCloud, 
  ShieldCheck, 
  Fingerprint, 
  ExternalLink,
  Tag
} from 'lucide-react';
import { formatBytes } from '../utils/autoFitEngine';

/**
 * DocumentLockerTab Component
 * "My Documents Locker" - Citizen's permanent sovereign document repository.
 * Enables zero-effort reusability across all government application forms:
 * - Every uploaded proof or minted vault credential is cataloged with full metadata.
 * - Verified BHAROSA-signed vs. Self-uploaded vs. Auto-fitted badges.
 * - Test Auto-Fit buttons directly on oversized demo documents.
 * - Actions: View, Rename, Replace, Delete, Tag, and Multi-Image PDF Merger.
 */
export default function DocumentLockerTab({
  documents = [],
  onOpenAutoFit,
  onOpenMergePdf,
  onOpenDigiLockerAnalysis,
  onViewDoc,
  onDeleteDoc,
  onRenameDoc,
  language = 'EN'
}) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'verified' | 'identity' | 'photo_sig' | 'non_compliant'
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDocId, setEditingDocId] = useState(null);
  const [renameText, setRenameText] = useState('');

  // Filter logic
  const filteredDocs = documents.filter((doc) => {
    // Search
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.title && doc.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (activeFilter === 'verified') return doc.verifiedBadge === 'verified';
    if (activeFilter === 'identity') return doc.docType === 'id_proof' || doc.category === 'identity';
    if (activeFilter === 'photo_sig') return doc.docType === 'photo' || doc.docType === 'signature';
    if (activeFilter === 'non_compliant') return doc.isNonCompliant;
    return true;
  });

  const handleStartRename = (doc) => {
    setEditingDocId(doc.id);
    setRenameText(doc.title || doc.name);
  };

  const handleSaveRename = (docId) => {
    if (onRenameDoc && renameText.trim()) {
      onRenameDoc(docId, renameText.trim());
    }
    setEditingDocId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Flagship Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#002875] via-[#003CB3] to-[#0A2566] text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(circle_at_top_right,rgba(255,103,31,0.22),transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-amber-300">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Sovereign Document Locker &amp; Smart Auto-Fit Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              My Documents Locker
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Upload once, auto-fit to any government portal standard, and auto-fill your credentials across all national services without repeating manual uploads or struggling with file size limits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenDigiLockerAnalysis}
              id="locker-sync-digilocker-btn"
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-slate-950 animate-spin" style={{ animationDuration: '4s' }} />
              <span>⚡ Sync & Analyze DigiLocker</span>
            </button>

            <button
              onClick={onOpenMergePdf}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Layers className="w-4 h-4 text-emerald-300" />
              <span>Merge Images to PDF</span>
            </button>

            <button
              onClick={() => {
                const sampleDoc = documents.find(d => d.isNonCompliant) || documents[0];
                if (sampleDoc && onOpenAutoFit) {
                  onOpenAutoFit(sampleDoc);
                }
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF671F] to-[#E05A18] hover:from-[#E05A18] hover:to-[#C04910] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Test Auto-Fit Engine</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-blue-200 block text-[11px]">TOTAL STORED:</span>
            <span className="text-base font-bold text-white">{documents.length} Files</span>
          </div>
          <div>
            <span className="text-blue-200 block text-[11px]">BHAROSA-SIGNED:</span>
            <span className="text-base font-bold text-emerald-300">
              {documents.filter(d => d.verifiedBadge === 'verified').length} Verified
            </span>
          </div>
          <div>
            <span className="text-blue-200 block text-[11px]">AUTO-FIT READY:</span>
            <span className="text-base font-bold text-amber-300">100% Compliant</span>
          </div>
          <div>
            <span className="text-blue-200 block text-[11px]">ENCRYPTION:</span>
            <span className="text-base font-bold text-sky-200">Zero-Knowledge</span>
          </div>
        </div>
      </div>

      {/* 2. Search & Category Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: `All Files (${documents.length})` },
            { id: 'verified', label: '✓ Verified BHAROSA (3)' },
            { id: 'identity', label: 'Identity Proofs (2)' },
            { id: 'photo_sig', label: 'Photos & Signatures (2)' },
            { id: 'non_compliant', label: '⚠️ Demo Non-Compliant (2)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#002875] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search documents or types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#002875]"
          />
        </div>
      </div>

      {/* 3. Document Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => {
          const isVerified = doc.verifiedBadge === 'verified';
          const isNonCompliant = doc.isNonCompliant;

          return (
            <div 
              key={doc.id}
              className={`p-4 rounded-2xl border transition-all duration-200 bg-white flex flex-col justify-between shadow-xs hover:shadow-md ${
                isNonCompliant 
                  ? 'border-amber-300 bg-amber-50/20' 
                  : isVerified 
                  ? 'border-emerald-200' 
                  : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header & Badges */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl text-white ${
                      doc.docType === 'photo' || doc.docType === 'signature' 
                        ? 'bg-purple-600' 
                        : isVerified 
                        ? 'bg-[#002875]' 
                        : 'bg-slate-700'
                    }`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block leading-none">
                        {doc.docType?.replace('_', ' ') || 'Document'}
                      </span>
                      {editingDocId === doc.id ? (
                        <div className="flex items-center gap-1 mt-1">
                          <input
                            type="text"
                            value={renameText}
                            onChange={(e) => setRenameText(e.target.value)}
                            className="px-1.5 py-0.5 border border-blue-400 rounded text-xs font-bold text-[#002875]"
                          />
                          <button 
                            onClick={() => handleSaveRename(doc.id)}
                            className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <h4 className="text-xs font-bold text-slate-900 mt-0.5 line-clamp-1">
                          {doc.title || doc.name}
                        </h4>
                      )}
                    </div>
                  </div>

                  {/* Trust Badge */}
                  {isVerified ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  ) : isNonCompliant ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 shrink-0">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      Fix Needed
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                      Self-uploaded
                    </span>
                  )}
                </div>

                {/* File Details Grid */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-[11px] font-mono mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">File Name:</span>
                    <span className="text-slate-700 font-semibold truncate max-w-[170px]" title={doc.name}>
                      {doc.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Size / Dim:</span>
                    <span className={`font-semibold ${isNonCompliant ? 'text-amber-700 font-bold' : 'text-slate-700'}`}>
                      {doc.sizeFormatted} • {doc.dimensions || 'A4'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Belongs to:</span>
                    <span className="text-slate-700 font-semibold">{doc.familyMemberName || 'Aarav Sharma'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SHA-256:</span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      {doc.sha256 ? `${doc.sha256.substring(0, 14)}...` : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Extracted Fields Preview */}
                {doc.extractedFields && Object.keys(doc.extractedFields).length > 0 && (
                  <div className="mb-3 px-2 py-1.5 rounded-lg bg-blue-50/50 border border-blue-100 text-[10px] text-blue-900 font-mono">
                    <span className="font-bold text-[#002875] block mb-0.5">Auto-Fillable Fields:</span>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(doc.extractedFields).slice(0, 3).map(([k, v]) => (
                        <span key={k} className="px-1.5 py-0.2 rounded bg-white border border-blue-200">
                          {k}: <strong>{String(v)}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                {isNonCompliant ? (
                  <button
                    onClick={() => onOpenAutoFit && onOpenAutoFit(doc)}
                    className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#FF671F] to-[#E05A18] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:brightness-105 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fix Automatically with Auto-Fit →</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onViewDoc && onViewDoc(doc)}
                      className="text-[#002875] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartRename(doc)}
                        className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                        title="Rename Document"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteDoc && onDeleteDoc(doc.id)}
                        className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                        title="Delete from Locker (Does not delete past applications)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
