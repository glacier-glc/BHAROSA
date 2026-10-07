import React from 'react';
import { 
  Download, 
  FileText, 
  FileCode, 
  ShieldCheck, 
  Smartphone, 
  ExternalLink 
} from 'lucide-react';

export default function DownloadsDrawer({
  isOpen,
  onClose,
  currentUser
}) {
  if (!isOpen) return null;

  const downloadItems = [
    {
      title: 'BHAROSA Sovereign Root Public Key (ECDSA P-256)',
      desc: 'National public cryptographic verification certificate for offline zero-trust validation engines.',
      size: '4.2 KB',
      type: 'PEM Certificate',
      icon: ShieldCheck
    },
    {
      title: 'Full Dossier Portfolio ZIP Export',
      desc: 'Cryptographically signed archive of all active certificates and associated SHA-256 Merkle proofs.',
      size: '12.8 MB',
      type: 'Encrypted ZIP',
      icon: FileText
    },
    {
      title: 'National Verifier SDK & REST Specification',
      desc: 'Integration guidelines for employers, university registrars and banking KYC micro-services.',
      size: '1.4 MB',
      type: 'OpenAPI Spec',
      icon: FileCode
    },
    {
      title: 'Nagrik Sovereign Mobile Wallet (APK v2.4)',
      desc: 'Android official build with on-device hardware keystore binding and NFC offline verifier.',
      size: '24.1 MB',
      type: 'Mobile App',
      icon: Smartphone
    }
  ];

  const handleTriggerDownload = (item) => {
    alert(`Downloading ${item.title}... Cryptographic checksum verified.`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 text-[#002875] border border-blue-200 shadow-sm">
                <Download size={20} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#002875] font-bold">
                  UNIVERSAL REPOSITORY
                </span>
                <h2 className="font-cinzel text-lg font-bold text-[#002875]">
                  Sovereign Download Hub
                </h2>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-500 hover:text-slate-900 text-xl font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {downloadItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#002875]/40 transition-all space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-lg bg-blue-50 text-[#002875] border border-blue-100">
                      <Icon size={18} />
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 font-medium">
                      {item.size} • {item.type}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                  </div>

                  <button
                    onClick={() => handleTriggerDownload(item)}
                    className="w-full py-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-[#002875] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:border-[#002875]"
                  >
                    <Download size={13} />
                    <span>Download Package</span>
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
