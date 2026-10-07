import React from 'react';
import { 
  X, 
  LayoutDashboard, 
  FilePlus, 
  Users, 
  FileText, 
  Repeat, 
  Search, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  ChevronRight,
  Flame,
  Award,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import AshokaChakra from './AshokaChakra';

export default function MenuDrawer({
  isOpen,
  onClose,
  currentUser,
  activeTab,
  onSelectTab,
  onOpenApply,
  onOpenExaminations,
  onOpenFamilyHub,
  onOpenLegacyDigitalize,
  onOpenDocServices,
  onOpenSettings,
  onSwitchRole,
  onLogout,
  language = 'EN'
}) {
  if (!isOpen) return null;

  const userRole = currentUser?.role || 'citizen';

  const allMenuItems = [
    // Citizen Options
    {
      id: 'dashboard',
      roles: ['citizen'],
      label: language === 'EN' ? 'Sovereign Dashboard' : 'मुख्य डैशबोर्ड',
      sublabel: language === 'EN' ? 'Approved & Pending Applications Tracker' : 'स्वीकृत एवं लंबित आवेदन',
      icon: LayoutDashboard,
      color: '#002875',
      action: () => { onSelectTab('dashboard'); onClose(); }
    },
    {
      id: 'family_hub',
      roles: ['citizen'],
      label: language === 'EN' ? 'Family / Parivar Hub' : 'परिवार केंद्र (मल्टी-आधार)',
      sublabel: language === 'EN' ? 'Multi-Aadhaar Mobile Linkage & Switcher' : 'एक मोबाइल से जुड़े पारिवारिक आधार',
      icon: Users,
      color: '#0284c7',
      badge: 'Multi-Aadhaar',
      action: () => { onOpenFamilyHub(); onClose(); }
    },
    {
      id: 'national_examinations',
      roles: ['citizen'],
      label: language === 'EN' ? 'National Examination Forms' : 'राष्ट्रीय परीक्षा आवेदन (NTA • UPSC)',
      sublabel: language === 'EN' ? 'Form Filling for JEE Main, NEET, UPSC CSE, GATE & CTET' : 'जेईई, नीट, यूपीएससी एवं गेट आवेदन पत्र',
      icon: GraduationCap,
      color: '#002875',
      badge: 'NTA • UPSC • IIT',
      action: () => { onOpenExaminations(); onClose(); }
    },
    {
      id: 'apply',
      roles: ['citizen'],
      label: language === 'EN' ? 'Apply for Certification' : 'नया प्रमाण पत्र आवेदन करें',
      sublabel: language === 'EN' ? 'Multi-Sector Applications with Fast-Track Tatkal' : 'सभी क्षेत्रों के लिए तत्काल आवेदन',
      icon: FilePlus,
      color: '#0D6838',
      badge: 'Tatkal Enabled',
      action: () => { onOpenApply(); onClose(); }
    },
    {
      id: 'doc_services',
      roles: ['citizen'],
      label: language === 'EN' ? 'Print, Re-Issue & Renew' : 'प्रिंट, पुनः जारी व नवीनीकरण',
      sublabel: language === 'EN' ? 'Order physical PVC cards, duplicates & renewals' : 'हार्डकॉपी PVC व नवीनीकरण सेवाएं',
      icon: Repeat,
      color: '#7c3aed',
      action: () => { onOpenDocServices(); onClose(); }
    },
    // Authority & Admin Portals
    {
      id: 'authority_scrutiny',
      roles: ['authority', 'admin'],
      label: language === 'EN' ? 'Authority Scrutiny & e-Sign' : 'प्राधिकरण सत्यापन एवं डिजिटल हस्ताक्षर',
      sublabel: language === 'EN' ? 'Review submitted dossiers & apply cryptographic sign' : 'दस्तावेज़ समीक्षा व डिजिटल हस्ताक्षर',
      icon: Building2,
      color: '#002875',
      badge: 'Active DSC',
      action: () => { onSelectTab('authority'); onClose(); }
    },
    {
      id: 'admin_portal',
      roles: ['admin'],
      label: language === 'EN' ? 'National Nodes & Audit Control' : 'राष्ट्रीय नोड्स एवं ऑडिट नियंत्रण',
      sublabel: language === 'EN' ? '24 Distributed Consensus Nodes & Merkle Ledger' : '24 वितरित नोड्स व सुरक्षा ऑडिट',
      icon: ShieldCheck,
      color: '#ff671f',
      badge: '24 Nodes Online',
      action: () => { onSelectTab('admin'); onClose(); }
    },
    {
      id: 'legacy_digitalize',
      roles: ['citizen', 'authority'],
      label: language === 'EN' ? (userRole === 'authority' ? 'Archival Attestation Records' : 'Digitalize Legacy Records') : 'पुराने अभिलेख डिजिटाइज़ करें',
      sublabel: language === 'EN' ? 'Retro-verification of physical paper certificates' : 'कागजी प्रमाणपत्रों का सत्यापन',
      icon: FileText,
      color: '#ea580c',
      action: () => { onOpenLegacyDigitalize(); onClose(); }
    },
    // Document Verifier
    {
      id: 'verify',
      roles: ['citizen', 'authority', 'admin'],
      label: language === 'EN' ? 'Document Verifier' : 'दस्तावेज़ सत्यापन (Document Verifier)',
      sublabel: language === 'EN' ? 'Instant QR, Certificate ID & SHA-256 PDF match' : 'तुरंत QR एवं हैश से सत्यता जांचें',
      icon: Search,
      color: '#002875',
      action: () => { onSelectTab('verifier'); onClose(); }
    },
    // Role-specific Settings
    {
      id: 'settings',
      roles: ['citizen', 'authority', 'admin'],
      label: language === 'EN' ? (userRole === 'admin' ? 'Sovereign Node Security Settings' : userRole === 'authority' ? 'Officer DSC & Token Settings' : 'Dashboard & Security Settings') : 'डैशबोर्ड एवं सुरक्षा सेटिंग्स',
      sublabel: language === 'EN' ? 'Alert preferences & cryptographic 2FA keys' : 'अलर्ट वरीयताएं एवं सुरक्षा कुंजियां',
      icon: Settings,
      color: '#64748b',
      action: () => { onOpenSettings(); onClose(); }
    }
  ];

  // Filter menu items by active user role
  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Light Clean Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between overflow-y-auto">
          
          {/* Header */}
          <div>
            <div className="p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AshokaChakra size={28} color="#002875" accentColor="#ff671f" />
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-[#002875] tracking-wide">
                    {language === 'EN' ? 'SOVEREIGN MENU' : 'प्रभुत्व संपन्न मेन्यू'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {userRole === 'admin' ? 'Sovereign Administrator Console' : userRole === 'authority' ? 'Accredited Authority Workbench' : 'BHAROSA Digital Infrastructure'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Profile Card */}
            {currentUser && (
              <div className="m-4 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-sm text-[#002875]">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{currentUser.name}</div>
                      <div className="text-[11px] font-mono text-[#002875] font-semibold">
                        {userRole === 'admin' ? 'GOI-ADMIN-01 (MeitY)' : userRole === 'authority' ? 'ACCREDITED-ISSUER-NODE' : (currentUser.id || 'BHAROSA-USER-01')}
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${userRole === 'admin' ? 'badge-danger' : userRole === 'authority' ? 'badge-cyan' : 'badge-emerald'} text-[10px]`}>
                    {userRole.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-200 font-medium">
                  <span>Persona: <strong className="text-slate-800 capitalize">{userRole}</strong></span>
                  <span className="text-[#0D6838] font-bold text-[11px]">
                    {userRole === 'admin' ? 'FIPS 140-3 HSM Root Key' : userRole === 'authority' ? 'e-Sign v3.2 Token Bound' : 'Aadhaar-Linked'}
                  </span>
                </div>
              </div>
            )}

            {/* Menu List */}
            <div className="p-4 space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-[#002875]/40 transition-all group text-left cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg bg-slate-50 border border-slate-200 group-hover:scale-105 transition-transform"
                        style={{ color: item.color }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-[#002875] flex items-center gap-2">
                          {item.label}
                          {item.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-[#ea580c] border border-amber-200 font-bold">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {item.sublabel}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-[#002875] transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sovereign Vault Session Controls (Bottom) */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/80">
            {/* Secure Logout Button */}
            <button
              onClick={() => { onLogout(); onClose(); }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              <LogOut size={15} />
              {language === 'EN' ? 'Secure Log Out & Lock Sovereign Vault' : 'लॉग आउट करें एवं वॉल्ट लॉक करें'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
