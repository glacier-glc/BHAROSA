import React from 'react';
import { 
  Bell, 
  Newspaper, 
  Download, 
  Menu, 
  Globe, 
  User, 
  ShieldCheck, 
  Building2
} from 'lucide-react';
import AshokaChakra from './AshokaChakra';

export default function TopNav({
  currentUser,
  activeRole,
  onOpenNotifications,
  unreadCount = 2,
  onOpenNews,
  onOpenDownloadHub,
  onOpenMenu,
  language = 'EN',
  onToggleLanguage
}) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* 1. Official Government of India Top Utility Strip (india.gov.in Style) */}
      <div className="w-full bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] text-[#475569] font-medium py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base leading-none" role="img" aria-label="Indian Flag">🇮🇳</span>
            <span className="font-semibold text-[#0f172a]">भारत सरकार</span>
            <span className="text-[#94a3b8]">|</span>
            <span className="font-semibold text-[#0f172a]">Government of India</span>
            <span className="hidden md:inline text-[#64748b] ml-2 font-mono">
              • राष्ट्रीय संप्रभु प्रमाणन एवं अभिलेख केंद्र
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="#main-content" 
              className="hidden sm:inline text-[#002875] hover:underline"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
            >
              {language === 'EN' ? 'Skip to main content' : 'मुख्य सामग्री पर जाएं'}
            </a>
            <span className="hidden sm:inline text-[#cbd5e1]">|</span>
            
            {/* Font Resizing Controls */}
            <div className="hidden sm:flex items-center gap-1.5 font-bold text-xs text-[#0f172a]">
              <button 
                title="Decrease font size" 
                onClick={() => document.documentElement.style.fontSize = '90%'} 
                className="px-1 hover:text-[#002875] cursor-pointer"
              >
                A-
              </button>
              <button 
                title="Reset font size" 
                onClick={() => document.documentElement.style.fontSize = '100%'} 
                className="px-1 hover:text-[#002875] cursor-pointer"
              >
                A
              </button>
              <button 
                title="Increase font size" 
                onClick={() => document.documentElement.style.fontSize = '110%'} 
                className="px-1 hover:text-[#002875] cursor-pointer"
              >
                A+
              </button>
            </div>
            <span className="text-[#cbd5e1]">|</span>

            {/* Language Switcher */}
            <button
              onClick={onToggleLanguage}
              id="nav-lang-btn"
              title="Switch Language / भाषा बदलें"
              className="flex items-center gap-1 text-[#002875] font-bold hover:text-[#ff671f] transition-all cursor-pointer"
            >
              <Globe size={12} />
              <span>{language === 'EN' ? 'English' : 'हिन्दी'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar with Emblem & Brand */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand & Sovereign Emblem */}
        <div 
          className="flex items-center gap-3 cursor-pointer py-1" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="relative flex items-center justify-center p-1 rounded-full bg-[#f8fafc] border border-[#002875]/20 shadow-sm">
            <AshokaChakra size={34} speed="normal" color="#002875" accentColor="#ff671f" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xl sm:text-2xl font-black tracking-wider text-[#002875]">
                BHAROSA
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] uppercase font-bold tracking-wider">
                GOI SOVEREIGN
              </span>
            </div>
            <p className="text-[11px] text-[#475569] tracking-tight hidden sm:block font-medium">
              {language === 'EN' 
                ? 'Bharat Hub for Records, Online Security & Authentication' 
                : 'अभिलेख, ऑनलाइन सुरक्षा एवं प्रमाणीकरण का भारत केंद्र'}
            </p>
          </div>
        </div>

        {/* User Identity Pill (Middle-Right) */}
        {currentUser && (
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f8fafc] border border-[#cbd5e1] text-xs shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse"></span>
            <span className="text-[#64748b]">{language === 'EN' ? 'Active Persona:' : 'सक्रिय पहचान:'}</span>
            <span className="font-bold text-[#0f172a] flex items-center gap-1.5">
              {currentUser.role === 'citizen' && <User size={13} className="text-[#d97706]" />}
              {currentUser.role === 'authority' && <Building2 size={13} className="text-[#0284c7]" />}
              {currentUser.role === 'admin' && <ShieldCheck size={13} className="text-[#dc2626]" />}
              {currentUser.name}
            </span>
          </div>
        )}

        {/* Top-Right Corner Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* 1. Notification Button */}
          <button
            onClick={onOpenNotifications}
            id="nav-notification-btn"
            title={language === 'EN' ? 'Sovereign Alerts & Notifications' : 'अधिसूचनाएं'}
            className="relative p-2.5 rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] text-[#334155] hover:text-[#002875] transition-all cursor-pointer shadow-sm"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff671f] text-[10px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* 2. Current News & Gazette Button */}
          <button
            onClick={onOpenNews}
            id="nav-news-btn"
            title={language === 'EN' ? 'Gazette Circulars & Sector News' : 'राजपत्र एवं समाचार'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] text-[#334155] hover:text-[#002875] text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Newspaper size={16} className="text-[#ea580c]" />
            <span className="hidden sm:inline">{language === 'EN' ? 'Gazette' : 'समाचार'}</span>
          </button>

          {/* 3. Universal Download Hub Button */}
          <button
            onClick={onOpenDownloadHub}
            id="nav-download-hub-btn"
            title={language === 'EN' ? 'Download Center & Portfolio Export' : 'डाउनलोड केंद्र'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] text-[#334155] hover:text-[#002875] text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Download size={16} className="text-[#0284c7]" />
            <span className="hidden sm:inline">{language === 'EN' ? 'Downloads' : 'डाउनलोड'}</span>
          </button>

          {/* 4. Sovereign Menu Button */}
          <button
            onClick={onOpenMenu}
            id="nav-menu-btn"
            title="Sovereign Command Menu"
            className="flex items-center gap-2 pl-3 pr-3 py-2 rounded-xl bg-white hover:bg-slate-50 border-1.5 border-[#002875] text-[#002875] transition-all cursor-pointer shadow-sm font-bold"
          >
            <Menu size={18} />
            <span className="text-xs font-bold tracking-wider uppercase hidden sm:inline">MENU</span>
          </button>

        </div>

      </div>

      {/* 3. Subtle National Tricolor Ribbon Accent (GoI Signature) */}
      <div 
        className="w-full h-[3px]" 
        style={{
          background: 'linear-gradient(90deg, #FF671F 0%, #FF671F 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #046A38 66.6%, #046A38 100%)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }} 
      />
    </header>
  );
}
