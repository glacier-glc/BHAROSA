import React, { useState } from 'react';
import { 
  Printer, 
  RefreshCw, 
  RotateCcw, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  MapPin, 
  FileText,
  AlertCircle
} from 'lucide-react';
import AshokaChakra from './AshokaChakra';

export default function DocumentServicesModal({
  isOpen,
  onClose,
  certificates = [],
  onRequestService
}) {
  if (!isOpen) return null;

  const [activeService, setActiveService] = useState('print'); // 'print' | 'reissue' | 'renew'
  const [selectedCertId, setSelectedCertId] = useState(certificates[0]?.id || '');
  const [printFormat, setPrintFormat] = useState('parchment'); // 'parchment' | 'pvc_card'
  const [deliveryAddress, setDeliveryAddress] = useState({
    recipient: 'Aarav Sharma',
    street: 'Flat 402, Nilgiri Heights, Powai',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400076',
    phone: '9876543210'
  });
  const [reissueReason, setReissueReason] = useState('lost'); // 'lost' | 'damaged' | 'name_change'
  const [isProcessing, setIsProcessing] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const selectedCert = certificates.find(c => c.id === selectedCertId) || certificates[0];

  // Fee calculation
  const printFee = printFormat === 'pvc_card' ? 150 : 120; // 250 GSM Parchment ₹120, Smart PVC ₹150
  const reissueFee = 80;
  const renewalFee = 200;
  const convenienceFee = 15;

  let totalAmount = 0;
  if (activeService === 'print') totalAmount = printFee + convenienceFee;
  if (activeService === 'reissue') totalAmount = reissueFee + convenienceFee;
  if (activeService === 'renew') totalAmount = renewalFee + convenienceFee;

  const handleSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessData({
        service: activeService,
        trackingNumber: `INPOST-SP-${Math.floor(10000000 + Math.random() * 90000000)}IN`,
        certTitle: selectedCert?.title,
        amount: totalAmount
      });
      onRequestService?.({
        service: activeService,
        certId: selectedCertId,
        amount: totalAmount
      });
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-2xl p-6 sm:p-8 space-y-6 bg-white border border-slate-200 shadow-2xl rounded-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#002875] border border-blue-200">
              <Printer size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#002875] font-semibold">
                CITIZEN LIFE-CYCLE OPERATIONS
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-900">
                Document Issue, Re-Issue & Renewal
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

        {/* Success View */}
        {successData ? (
          <div className="p-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 size={40} />
              </div>
            </div>
            <h3 className="font-cinzel text-xl font-bold text-slate-900">
              Service Request Placed Successfully!
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your request for <span className="text-[#002875] font-semibold">{successData.certTitle}</span> has been processed. Total convenience fee of ₹{successData.amount} settled via Bharat BillPay.
            </p>
            {successData.service === 'print' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 inline-block text-left text-xs font-mono">
                <p className="text-slate-500">India Post Speed Post Consignment:</p>
                <p className="text-sm font-bold text-[#002875] mt-0.5">{successData.trackingNumber}</p>
                <p className="text-[10px] text-slate-500 mt-1">Dispatched from Government Security Press, Nashik</p>
              </div>
            )}
            <button
              onClick={() => { setSuccessData(null); onClose(); }}
              className="btn btn-primary px-6 mx-auto block cursor-pointer"
            >
              Done & Return to Vault
            </button>
          </div>
        ) : (
          <>
            {/* Service Type Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveService('print')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  activeService === 'print'
                    ? 'bg-blue-50 border-[#002875] text-[#002875] shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Printer size={18} className="mx-auto mb-1 text-[#002875]" />
                <span className="text-xs font-bold block">Hardcopy Print</span>
                <span className="text-[10px] text-slate-500">Speed Post</span>
              </button>

              <button
                onClick={() => setActiveService('reissue')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  activeService === 'reissue'
                    ? 'bg-orange-50 border-[#FF671F] text-[#FF671F] shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <RotateCcw size={18} className="mx-auto mb-1 text-[#FF671F]" />
                <span className="text-xs font-bold block">Re-Issue Duplicate</span>
                <span className="text-[10px] text-slate-500">Lost/Damaged</span>
              </button>

              <button
                onClick={() => setActiveService('renew')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  activeService === 'renew'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <RefreshCw size={18} className="mx-auto mb-1 text-emerald-600" />
                <span className="text-xs font-bold block">Renewal of License</span>
                <span className="text-[10px] text-slate-500">Extend Validity</span>
              </button>
            </div>

            {/* Select Certificate */}
            <div>
              <label className="input-label text-slate-700">Select Target Credential from Vault</label>
              <select
                value={selectedCertId}
                onChange={(e) => setSelectedCertId(e.target.value)}
                className="input-field bg-slate-50 border-slate-300 text-slate-900"
              >
                {certificates.map(cert => (
                  <option key={cert.id} value={cert.id}>
                    {cert.title} ({cert.id}) - {cert.recipientName}
                  </option>
                ))}
              </select>
            </div>

            {/* Tab 1: Physical Print Dispatch */}
            {activeService === 'print' && (
              <div className="space-y-4">
                <div>
                  <label className="input-label text-slate-700">Select Physical Print Medium</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      onClick={() => setPrintFormat('parchment')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        printFormat === 'parchment'
                          ? 'bg-blue-50/70 border-[#002875] text-slate-900 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-semibold text-xs text-[#002875]">250 GSM Royal Sovereign Parchment</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Golden foil watermark & embossed Ashoka Chakra</p>
                      <p className="text-xs font-bold text-slate-900 mt-2">₹120 + ₹15 BBPS</p>
                    </label>

                    <label
                      onClick={() => setPrintFormat('pvc_card')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        printFormat === 'pvc_card'
                          ? 'bg-blue-50/70 border-[#002875] text-slate-900 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-semibold text-xs text-[#002875]">Sovereign Smart PVC Pocket Card</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Wallet-sized NFC + QR high-durability plastic</p>
                      <p className="text-xs font-bold text-slate-900 mt-2">₹150 + ₹15 BBPS</p>
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                    <MapPin size={14} className="text-[#002875]" />
                    <span>India Post Speed Post Delivery Address</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={deliveryAddress.street}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                      className="input-field col-span-2 py-1.5 bg-white border-slate-300 text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                      className="input-field py-1.5 bg-white border-slate-300 text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="PIN Code"
                      value={deliveryAddress.pincode}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })}
                      className="input-field py-1.5 font-mono bg-white border-slate-300 text-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Re-issue Duplicate */}
            {activeService === 'reissue' && (
              <div className="space-y-4">
                <div>
                  <label className="input-label text-slate-700">Reason for Requesting Duplicate Certificate</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'lost', label: 'Lost / Misplaced' },
                      { id: 'damaged', label: 'Physical Damage' },
                      { id: 'name_change', label: 'Gazette Name Change' }
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setReissueReason(item.id)}
                        className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer ${
                          reissueReason === item.id
                            ? 'bg-orange-50 border-[#FF671F] text-[#FF671F] font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-[#FF671F] flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>The duplicate certificate will carry an official "DUPLICATE ISSUANCE" cryptographic watermark and invalidate the previous paper copy on the national registry.</span>
                </div>
              </div>
            )}

            {/* Tab 3: Renewal of License */}
            {activeService === 'renew' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Current Validity Period:</span>
                    <span className="font-mono text-slate-900 font-semibold">{selectedCert?.validity || 'Valid till 31-Dec-2026'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Extended Validity After Renewal:</span>
                    <span className="font-mono text-emerald-700 font-bold">+5 Years (Till 31-Dec-2031)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Total Fee & Submit Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Total Statutory Fee</span>
                <p className="font-mono text-xl font-bold text-[#002875]">₹{totalAmount}.00</p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="btn btn-primary flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <AshokaChakra size={18} speed="fast" color="#ffffff" />
                    <span>Processing Bharat BillPay...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    <span>Confirm & Pay ₹{totalAmount}</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
