import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Smartphone, 
  MessageSquare, 
  ShieldCheck, 
  Key, 
  Bell, 
  Check, 
  Lock
} from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  currentUser
}) {
  if (!isOpen) return null;

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [biometric2FA, setBiometric2FA] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-xl p-6 sm:p-8 space-y-6 bg-white border border-slate-200 shadow-2xl rounded-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#002875] border border-blue-200">
              <Settings size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#002875] font-semibold">
                CITIZEN PREFERENCES
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-900">
                Profile & Sovereign Security Settings
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

        {/* Profile Details */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <span className="text-xs font-semibold text-[#002875] block uppercase tracking-wider">
            Verified Identity (UIDAI Aadhaar Master)
          </span>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Citizen Full Name</span>
              <span className="font-bold text-slate-900">{currentUser?.name || 'Aarav Sharma'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Aadhaar Masked</span>
              <span className="font-mono text-slate-900">{currentUser?.aadhaarMasked || 'XXXX-XXXX-4912'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Registered Mobile Number</span>
              <span className="font-mono text-slate-900">{currentUser?.phone || '+91 98765 43210'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Primary Sector Affiliation</span>
              <span className="text-emerald-700 font-semibold">{currentUser?.sector || 'Higher Education & Tech'}</span>
            </div>
          </div>
        </div>

        {/* Dispatch Alerts Center */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-900 block uppercase tracking-wider">
            Real-Time Statutory Alert Channels
          </span>

          <label className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/80 transition-all flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <Smartphone size={18} className="text-[#002875]" />
              <div>
                <p className="font-semibold text-xs text-slate-900">SMS Priority Dispatch Center</p>
                <p className="text-[11px] text-slate-500">Instant SMS on application stage change, Tatkal approval, or issuance.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="accent-[#002875] w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/80 transition-all flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <MessageSquare size={18} className="text-[#25D366]" />
              <div>
                <p className="font-semibold text-xs text-slate-900">WhatsApp Sovereign Bot Dispatch</p>
                <p className="text-[11px] text-slate-500">Receive official certificate PDF & QR code directly on WhatsApp.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={whatsappAlerts}
              onChange={(e) => setWhatsappAlerts(e.target.checked)}
              className="accent-[#25D366] w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/80 transition-all flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <Key size={18} className="text-[#002875]" />
              <div>
                <p className="font-semibold text-xs text-slate-900">FIDO2 / Hardware Security Token 2FA</p>
                <p className="text-[11px] text-slate-500">Require biometric touch authentication for credential downloads and transfers.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={biometric2FA}
              onChange={(e) => setBiometric2FA(e.target.checked)}
              className="accent-[#002875] w-4 h-4 cursor-pointer"
            />
          </label>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="btn btn-secondary text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary text-xs flex items-center gap-1.5 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check size={14} className="text-white" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <span>Save Sovereign Preferences</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
