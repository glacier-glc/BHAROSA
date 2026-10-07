import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Sparkles, 
  X, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Clock, 
  Eye, 
  EyeOff,
  Edit2
} from 'lucide-react';

/**
 * ProfileVaultModal Component
 * Citizen's Authoritative Profile Vault with Provenance Tracking:
 * - Shows extracted personal fields with confidence scores & sources
 * - Interactive Field Conflict Resolver (e.g. "Aarav Sharma" vs "Aarav S. Sharma")
 * - Consent Management with audit trail timestamp
 */
export default function ProfileVaultModal({
  isOpen,
  onClose,
  profile,
  onUpdateProfileField,
  autoFillConsent,
  onToggleConsent
}) {
  if (!isOpen || !profile) return null;

  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showPan, setShowPan] = useState(false);
  const [selectedNameConflict, setSelectedNameConflict] = useState(profile.name?.value || 'Aarav Sharma');

  const handleResolveConflict = (val) => {
    setSelectedNameConflict(val);
    if (onUpdateProfileField) {
      onUpdateProfileField('name', val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#002875] to-[#001B52] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg">
                Citizen Sovereign Profile Vault &amp; Auto-Fill Provenance
              </h3>
              <p className="text-xs text-blue-200">
                Authoritative single-source identity fields extracted from verified credentials
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xl text-white/80 hover:text-white hover:bg-white/10 text-xl font-bold transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* 1. Consent Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            autoFillConsent 
              ? 'bg-emerald-50/70 border-emerald-300' 
              : 'bg-amber-50/70 border-amber-300'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl text-white mt-0.5 ${autoFillConsent ? 'bg-emerald-600' : 'bg-amber-600'}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Citizen Document Auto-Fill Consent</span>
                    {autoFillConsent && (
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ACTIVE
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    "BHAROSA will reuse your saved verified documents to auto-fill government service forms. Only you have access to this data."
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    Consent Audit Record: SHA256-CONSENT-RATIFIED-2026 • Timestamp: 14 Jun 2025 09:30:15 IST
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onToggleConsent}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs ${
                  autoFillConsent 
                    ? 'bg-white hover:bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {autoFillConsent ? 'Withdraw Consent' : 'Grant Auto-Fill Consent'}
              </button>
            </div>
          </div>

          {/* 2. Conflicting Field Demo Resolver Banner */}
          {profile.name?.hasConflict && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-xs">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-2 w-full">
                  <div>
                    <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                      Field Conflict Detected: Name Spelling Discrepancy
                    </h4>
                    <p className="text-xs text-amber-900">
                      Two documents in your locker report slightly different spelling variations. Please choose which value BHAROSA should auto-fill:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {profile.name.conflicts.map((conf, idx) => (
                      <label 
                        key={idx}
                        onClick={() => handleResolveConflict(conf.value)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          selectedNameConflict === conf.value 
                            ? 'bg-white border-[#002875] shadow-xs' 
                            : 'bg-amber-100/50 border-amber-200 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">{conf.value}</span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                              conf.confidence === 'High' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {conf.confidence}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block mt-0.5">{conf.source}</span>
                        </div>

                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedNameConflict === conf.value ? 'border-[#002875] bg-[#002875]' : 'border-slate-300'
                        }`}>
                          {selectedNameConflict === conf.value && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Authoritative Profile Fields Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <span>Authoritative Identity Fields</span>
              <span className="text-slate-400 font-normal">(Auto-filled across all applications)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Full Name */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Full Legal Name</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                    High Confidence
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">{selectedNameConflict}</div>
                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                  <span>Source: {profile.name?.source}</span>
                  {profile.name?.locked && <Lock className="w-3 h-3 text-slate-400" title="Locked" />}
                </div>
              </div>

              {/* DOB */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Date of Birth</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                    High Confidence
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 font-mono">{profile.dob?.value}</div>
                <div className="text-[11px] text-slate-500 font-mono">Source: {profile.dob?.source}</div>
              </div>

              {/* Father Name */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Father's Name</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                    High Confidence
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">{profile.fatherName?.value}</div>
                <div className="text-[11px] text-slate-500 font-mono">Source: {profile.fatherName?.source}</div>
              </div>

              {/* Gender */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Gender</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                    Verified
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">{profile.gender?.value}</div>
                <div className="text-[11px] text-slate-500 font-mono">Source: {profile.gender?.source}</div>
              </div>

              {/* Masked Aadhaar */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Aadhaar Token</span>
                  <button 
                    onClick={() => setShowAadhaar(!showAadhaar)}
                    className="text-[10px] text-[#002875] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {showAadhaar ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showAadhaar ? 'Hide' : 'Reveal'}</span>
                  </button>
                </div>
                <div className="text-sm font-bold text-slate-900 font-mono">
                  {showAadhaar ? '9842-1083-4519' : profile.aadhaarNumber?.value}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">Source: {profile.aadhaarNumber?.source}</div>
              </div>

              {/* Masked PAN */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">PAN Token</span>
                  <button 
                    onClick={() => setShowPan(!showPan)}
                    className="text-[10px] text-[#002875] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {showPan ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPan ? 'Hide' : 'Reveal'}</span>
                  </button>
                </div>
                <div className="text-sm font-bold text-slate-900 font-mono">
                  {showPan ? 'ABCDE1234F' : 'XXXXXX234F'}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">Source: {profile.panNumber?.source}</div>
              </div>

              {/* Address */}
              <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Residential Address</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                    High Confidence
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {profile.address?.value}, {profile.district?.value}, {profile.state?.value} - {profile.pincode?.value}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">Source: {profile.address?.source}</div>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#002875] text-white text-xs font-bold hover:bg-[#001B52] transition-colors cursor-pointer"
          >
            Close Profile Vault
          </button>
        </div>

      </div>
    </div>
  );
}
