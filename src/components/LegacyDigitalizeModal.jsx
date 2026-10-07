import React, { useState } from 'react';
import { 
  History, 
  UploadCloud, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import AshokaChakra from './AshokaChakra';

export default function LegacyDigitalizeModal({
  isOpen,
  onClose,
  onSubmitLegacy
}) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    certTitle: '',
    issuingBoard: '',
    passingYear: '2012',
    rollNumber: '',
    scanUploaded: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onSubmitLegacy?.(formData);
        onClose();
      }, 1400);
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-xl p-6 sm:p-8 space-y-6 bg-white border border-slate-200 shadow-2xl rounded-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#002875] border border-blue-200">
              <History size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#002875] font-semibold">
                ARCHIVAL DIGITALIZATION ENGINE
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-900">
                Digitize Vintage Physical Records
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

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 size={48} className="text-[#138808]" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-slate-900">
              Archival Record Submitted for Attestation!
            </h3>
            <p className="text-xs text-slate-600">
              Your vintage document scan has been forwarded to the institutional registry custodian for micro-film cross-verification.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-amber-600" />
              <span>For pre-computerized certificates (prior to 2018). Archival registrars will authenticate records against physical registers.</span>
            </div>

            <div>
              <label className="input-label text-slate-700">Certificate / Degree Title</label>
              <input
                type="text"
                placeholder="e.g. Higher Secondary Certificate (HSC) or State Land Sanad"
                value={formData.certTitle}
                onChange={(e) => setFormData({ ...formData, certTitle: e.target.value })}
                className="input-field bg-slate-50 border-slate-300 text-slate-900"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="input-label text-slate-700">Issuing Board / University</label>
                <input
                  type="text"
                  placeholder="e.g. Maharashtra State Board / Pune University"
                  value={formData.issuingBoard}
                  onChange={(e) => setFormData({ ...formData, issuingBoard: e.target.value })}
                  className="input-field bg-slate-50 border-slate-300 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="input-label text-slate-700">Year of Passing / Issuance</label>
                <input
                  type="number"
                  min="1950"
                  max="2020"
                  value={formData.passingYear}
                  onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                  className="input-field font-mono bg-slate-50 border-slate-300 text-slate-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="input-label text-slate-700">Original Physical Roll / Serial Number</label>
              <input
                type="text"
                placeholder="e.g. MSB-2012-PUN-8921"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="input-field font-mono bg-slate-50 border-slate-300 text-slate-900"
                required
              />
            </div>

            <div>
              <label className="input-label text-slate-700">Upload High-Resolution Physical Scan</label>
              <div 
                onClick={() => setFormData({ ...formData, scanUploaded: true })}
                className="border-2 border-dashed border-slate-300 hover:border-[#002875] rounded-xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-slate-100/80 transition-all"
              >
                <UploadCloud size={28} className="mx-auto text-[#002875] mb-2" />
                <p className="text-xs text-slate-900 font-semibold">
                  {formData.scanUploaded ? '✓ Vintage_Certificate_Front_Back_Scan.pdf (4.2 MB)' : 'Click to select clear scan (Front + Back)'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">300 DPI color PDF or TIFF recommended</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="btn btn-primary text-xs flex items-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <AshokaChakra size={16} speed="fast" color="#ffffff" />
                    <span>Transcribing to Ledger...</span>
                  </>
                ) : (
                  <span>Submit for Archival Verification</span>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
