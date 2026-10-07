import React, { useState } from 'react';
import { 
  SECTORS, 
  INITIAL_CERTIFICATES, 
  INITIAL_APPLICATIONS, 
  INITIAL_FAMILY_MEMBERS, 
  SOVEREIGN_NEWS 
} from './data/initialData';
import {
  DOCUMENT_SPECS,
  INITIAL_LOCKER_DOCUMENTS,
  INITIAL_CITIZEN_PROFILE
} from './data/autoFillSpecs';
import TopNav from './components/TopNav';
import MenuDrawer from './components/MenuDrawer';
import AuthGateway from './components/AuthGateway';
import ApplicantDashboard from './components/ApplicantDashboard';
import AuthorityDashboard from './components/AuthorityDashboard';
import AdminPortal from './components/AdminPortal';
import PublicVerifier from './components/PublicVerifier';
import CertificateModal from './components/CertificateModal';
import ApplyModal from './components/ApplyModal';
import DocumentServicesModal from './components/DocumentServicesModal';
import FamilyHub from './components/FamilyHub';
import LegacyDigitalizeModal from './components/LegacyDigitalizeModal';
import SettingsModal from './components/SettingsModal';
import NewsDrawer from './components/NewsDrawer';
import NotificationDrawer from './components/NotificationDrawer';
import DownloadsDrawer from './components/DownloadsDrawer';
import MargAI from './components/MargAI';
import Footer from './components/Footer';
import AshokaChakra from './components/AshokaChakra';
import UploadedDocumentModal from './components/UploadedDocumentModal';
import SovereignLandingPage from './components/SovereignLandingPage';
import LoginVerificationSuccessPage from './components/LoginVerificationSuccessPage';
import AutoFitModal from './components/AutoFitModal';
import MultiImagePdfModal from './components/MultiImagePdfModal';
import ProfileVaultModal from './components/ProfileVaultModal';
import DigiLockerAnalysisModal from './components/DigiLockerAnalysisModal';
import ExaminationModal from './components/ExaminationModal';
import { Bell, X, Zap, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Authentication & Persona state - First initiate login page
  const [currentUser, setCurrentUser] = useState(null);
  const [verifyingUser, setVerifyingUser] = useState(null);
  const [showAuthGateway, setShowAuthGateway] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'verifier' | 'authority' | 'admin' | 'landing'

  // Application Data State
  const [certificates, setCertificates] = useState(INITIAL_CERTIFICATES);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [familyMembers, setFamilyMembers] = useState(INITIAL_FAMILY_MEMBERS);
  const [activeMemberId, setActiveMemberId] = useState('fam-1');

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Tatkal Degree Minted & Signed',
      message: 'IIT Delhi Council has digitally signed your B.Tech Degree into the Nagrik Sovereign Vault.',
      type: 'tatkal',
      sector: 'Education',
      timestamp: '10 mins ago',
      isRead: false
    },
    {
      id: 'notif-2',
      title: '30-Year Encumbrance Search Clearance',
      message: 'Sub-Registrar IV has issued Nil-Encumbrance Certificate with SHA-256 Merkle proof.',
      type: 'approval',
      sector: 'Land & Revenue',
      timestamp: '2 hours ago',
      isRead: false
    },
    {
      id: 'notif-3',
      title: 'Gazette Regulatory Update',
      message: 'New Tatkal 4-Hour Emergency rules ratified under Digital India Gazette Reg-2026-001.',
      type: 'security',
      sector: 'Civic',
      timestamp: '1 day ago',
      isRead: true
    }
  ]);

  // ================= FLAGSHIP MANDATE: DOCUMENT LOCKER & PROFILE VAULT =================
  const [lockerDocuments, setLockerDocuments] = useState(INITIAL_LOCKER_DOCUMENTS);
  const [citizenProfile, setCitizenProfile] = useState(INITIAL_CITIZEN_PROFILE);
  const [autoFillConsent, setAutoFillConsent] = useState(true);

  // Auto-Fit, PDF Merge, and Profile Vault Modals
  const [autoFitModal, setAutoFitModal] = useState({
    isOpen: false,
    file: null,
    spec: null,
    onApply: null
  });
  const [mergePdfModalOpen, setMergePdfModalOpen] = useState(false);
  const [profileVaultModalOpen, setProfileVaultModalOpen] = useState(false);
  const [digiLockerModalOpen, setDigiLockerModalOpen] = useState(false);
  const [applyModalInitialStep, setApplyModalInitialStep] = useState(1);
  const [examinationModalOpen, setExaminationModalOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState('nta_jee_main');

  // Modal Visibility States
  const [selectedCertForModal, setSelectedCertForModal] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [docServicesModalOpen, setDocServicesModalOpen] = useState(false);
  const [familyHubOpen, setFamilyHubOpen] = useState(false);
  const [legacyModalOpen, setLegacyModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [newsDrawerOpen, setNewsDrawerOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [downloadsDrawerOpen, setDownloadsDrawerOpen] = useState(false);
  const [liveToast, setLiveToast] = useState(null);
  const [uploadedDocViewer, setUploadedDocViewer] = useState({
    isOpen: false,
    documents: [],
    initialIndex: 0,
    applicationTitle: '',
    applicantName: ''
  });

  const handleOpenUploadedDocViewer = (docs, initialIndex = 0, appTitle = '', applicant = '') => {
    setUploadedDocViewer({
      isOpen: true,
      documents: docs && docs.length > 0 ? docs : [
        { name: 'Supporting_Eligibility_Record.pdf', size: '1.8 MB', sha256: '9f86d081884c7d659a2f...' }
      ],
      initialIndex: initialIndex || 0,
      applicationTitle: appTitle || 'Application Supporting Documents',
      applicantName: applicant || currentUser?.name || 'Applicant'
    });
  };

  // Flagship Auto-Fit Trigger
  const handleOpenAutoFit = (doc, customSpec = null) => {
    let spec = customSpec;
    if (!spec) {
      if (doc.docType === 'photo' || doc.id === 'demo-noncompliant-1') {
        spec = DOCUMENT_SPECS.photo;
      } else if (doc.docType === 'signature') {
        spec = DOCUMENT_SPECS.signature;
      } else if (doc.docType === 'academic_degree' || doc.id === 'demo-noncompliant-2') {
        spec = DOCUMENT_SPECS.academic_degree;
      } else {
        spec = DOCUMENT_SPECS.photo;
      }
    }

    setAutoFitModal({
      isOpen: true,
      file: doc,
      spec: spec,
      onApply: (fixedResult) => {
        setLockerDocuments(prev => prev.map(d => {
          if (d.id === doc.id) {
            return {
              ...d,
              sizeFormatted: fixedResult.fixedSize,
              sizeBytes: fixedResult.fixedSizeBytes,
              dimensions: fixedResult.fixedDimensions,
              sha256: fixedResult.fixedSha256,
              isNonCompliant: false,
              nonComplianceReason: null,
              previewUrl: fixedResult.dataUrl || d.previewUrl,
              dataUrl: fixedResult.dataUrl || d.dataUrl,
              operationsApplied: fixedResult.operationsApplied,
              verifiedBadge: 'auto_fitted',
              uploadDate: 'Just now (Auto-Fitted)'
            };
          }
          return d;
        }));

        setNotifications(prev => [
          {
            id: `notif-${Date.now()}`,
            title: `Document Auto-Fitted: ${doc.name}`,
            message: `Optimized to ${fixedResult.fixedSize} (${fixedResult.fixedDimensions}). Verified 100% compliant with government portal upload limits.`,
            type: 'approval',
            sector: 'Document Locker',
            timestamp: 'Just now',
            isRead: false
          },
          ...prev
        ]);

        setAutoFitModal({ isOpen: false, file: null, spec: null, onApply: null });
      }
    });
  };

  // Document Locker Handlers
  const handleDeleteLockerDoc = (docId) => {
    setLockerDocuments(prev => prev.filter(d => d.id !== docId));
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Document Removed from Locker',
        message: 'File removed from your personal locker. Submitted past applications remain valid and unaltered.',
        type: 'security',
        sector: 'Document Locker',
        timestamp: 'Just now',
        isRead: false
      },
      ...prev
    ]);
  };

  const handleRenameLockerDoc = (docId, newName) => {
    setLockerDocuments(prev => prev.map(d => d.id === docId ? { ...d, name: newName } : d));
  };

  const handleUpdateProfileField = (fieldKey, newValue) => {
    setCitizenProfile(prev => ({
      ...prev,
      [fieldKey]: {
        ...(prev[fieldKey] || {}),
        value: newValue,
        lastVerified: 'Manual citizen selection'
      }
    }));
    if (fieldKey === 'name' && currentUser) {
      setCurrentUser(prev => ({ ...prev, name: newValue }));
    }
  };

  const handleToggleConsent = () => {
    setAutoFillConsent(prev => {
      const next = !prev;
      setNotifications(n => [
        {
          id: `notif-${Date.now()}`,
          title: `Smart Auto-Fill Consent ${next ? 'Enabled' : 'Paused'}`,
          message: next 
            ? 'Smart Auto-Fill will now securely pre-populate verified fields into application forms.'
            : 'Forms will require manual field entry until consent is re-enabled.',
          type: 'security',
          sector: 'Profile Vault',
          timestamp: 'Just now',
          isRead: false
        },
        ...n
      ]);
      return next;
    });
  };

  // Flagship DigiLocker Analyzed Data Ingestion & Auto-Fill Orchestrator
  const handleApplyDigiLockerAnalyzedData = ({ profile, documents, selectedName, customDocument, source }) => {
    if (source === 'digilocker_cloud' && documents) {
      // 1. Update Profile Vault
      if (profile) {
        setCitizenProfile(profile);
      }

      // 2. Prepend & update compliant documents in locker
      setLockerDocuments(prev => {
        const newIds = new Set(documents.map(d => d.id));
        const filteredPrev = prev.filter(d => !newIds.has(d.id));
        return [...documents, ...filteredPrev];
      });

      // 3. Notification
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: 'DigiLocker Synced: 5 Documents Analyzed',
          message: `e-KYC verified for ${selectedName || 'Aarav Sharma'}. 8 profile attributes updated and 4 proofs pre-attached with zero-rejection compliance.`,
          type: 'approval',
          sector: 'DigiLocker',
          timestamp: 'Just now',
          isRead: false
        },
        ...prev
      ]);

      // 4. Celebration confetti
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // silent fallback
      }

      // 5. Direct Launch into Application Form at Step 2 (Applicant Data & Pre-attached Proofs)
      setApplyModalInitialStep(2);
      setApplyModalOpen(true);
      setDigiLockerModalOpen(false);
    } else if (source === 'custom_upload' && customDocument) {
      setLockerDocuments(prev => [customDocument, ...prev]);

      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: `Custom Document Analyzed: ${customDocument.name}`,
          message: `Auto-fitted and saved to Document Locker (${customDocument.sizeFormatted}). Ready for instant application attachment.`,
          type: 'approval',
          sector: 'Document Locker',
          timestamp: 'Just now',
          isRead: false
        },
        ...prev
      ]);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setApplyModalInitialStep(2);
      setApplyModalOpen(true);
      setDigiLockerModalOpen(false);
    }
  };

  // Flagship National Examination Registration Handler
  const handleRegisterExam = (examApp) => {
    // 1. Add to active applications
    setApplications(prev => [
      {
        id: examApp.id,
        applicantName: examApp.applicantName,
        aadhaarMasked: examApp.aadhaarMasked,
        sectorId: 'education',
        sectorName: 'National Competitive Examinations',
        documentTitle: `${examApp.examTitle} (${examApp.applicationNumber})`,
        authorityName: examApp.conductingBody,
        status: 'submitted',
        isTatkal: false,
        submittedOn: 'Just now',
        totalPaid: examApp.totalPaid,
        uploadedDocuments: [
          { name: 'Candidate_Photo_Compliant.jpg', size: '34.6 KB', hash: '9f86d...0a08' },
          { name: 'Candidate_Signature.png', size: '14.8 KB', hash: 'e3b0c...b855' },
          { name: 'CBSE_Class_X_Proof.pdf', size: '185 KB', hash: '7d89f...dc15' }
        ],
        isAutoFilled: true,
        autoFillConfidence: '100% Sovereign Verified',
        examMeta: {
          applicationNumber: examApp.applicationNumber,
          paperName: examApp.paperName,
          mediumLanguage: examApp.mediumLanguage,
          cityPreferences: examApp.cityPreferences,
          admitCardSchedule: examApp.admitCardDate,
          examWindow: examApp.examWindow
        }
      },
      ...prev
    ]);

    // 2. Add Confirmation Slip to Locker Documents
    setLockerDocuments(prev => [
      {
        id: `doc-exam-${Date.now()}`,
        name: `${examApp.conductingBodyShort}_${examApp.applicationNumber}_Confirmation_Slip.pdf`,
        title: `${examApp.examTitle} Official Registration Slip`,
        docType: 'academic_degree',
        category: 'education',
        sizeFormatted: '142 KB',
        sizeBytes: 142 * 1024,
        dimensions: 'A4 Digital PDF',
        sha256: examApp.sha256Receipt,
        uploadDate: 'Just now',
        familyMemberId: 'fam-1',
        familyMemberName: examApp.applicantName,
        source: 'national_examination',
        verifiedBadge: 'verified',
        operationsApplied: ['Sovereign Examination Seal', 'Bharat BillPay Attested', 'Zero-Rejection Compliant']
      },
      ...prev
    ]);

    // 3. Status Notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Exam Registered: ${examApp.examTitle}`,
        message: `Application No: ${examApp.applicationNumber}. Allocated Centers: ${examApp.cityPreferences.join(', ')}. Confirmation slip saved to locker.`,
        type: 'approval',
        sector: 'National Examinations',
        timestamp: 'Just now',
        isRead: false
      },
      ...prev
    ]);
  };

  // Handlers for Authentication
  const handleLogin = (userData) => {
    // Show post-login verification page featuring Ashok Emblem with rotating wheel & flowing tricolor river
    setVerifyingUser(userData);
  };

  const handleCompleteVerification = (userData) => {
    setCurrentUser(userData);
    setVerifyingUser(null);
    setShowAuthGateway(false);
    if (userData.role === 'admin') {
      setActiveTab('admin');
    } else if (userData.role === 'authority') {
      setActiveTab('authority');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSwitchRole = (newRole) => {
    if (!currentUser) return;
    const roleNames = {
      citizen: 'Aarav Sharma',
      authority: 'Dr. Vikram Malhotra (IIT Council Registrar)',
      admin: 'Sovereign Administrator (MeitY)'
    };
    setCurrentUser({
      ...currentUser,
      role: newRole,
      name: roleNames[newRole] || currentUser.name
    });

    if (newRole === 'authority') setActiveTab('authority');
    else if (newRole === 'admin') setActiveTab('admin');
    else setActiveTab('dashboard');
  };

  const handleQuickDemoLogin = (role) => {
    if (role === 'citizen') {
      handleLogin({
        id: 'US-882190-C',
        name: 'Aarav Sharma',
        role: 'citizen',
        aadhaarMasked: 'XXXX-XXXX-4519',
        pan: 'ABCDE1234F',
        mobile: '+91 98765 43210'
      });
    } else if (role === 'authority') {
      handleLogin({
        id: 'AUTH-IIT-01',
        name: 'Dr. Vikram Malhotra (IIT Council Registrar)',
        role: 'authority',
        sector: 'education',
        mobile: '+91 98765 43210'
      });
    } else if (role === 'admin') {
      handleLogin({
        id: 'ADMIN-MEITY-01',
        name: 'Sovereign Administrator (MeitY)',
        role: 'admin',
        mobile: '+91 98765 43210'
      });
    }
  };

  // Handlers for Applications & Certificates
  const handleOpenCertificate = (certId) => {
    const found = certificates.find(c => c.id === certId) || certificates[0];
    setSelectedCertForModal(found);
  };

  const handleSubmitNewApplication = (newApp) => {
    setApplications(prev => [newApp, ...prev]);

    // Add notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Application Filed: ${newApp.documentTitle}`,
        message: `Your ${newApp.isTatkal ? 'TATKAL Priority' : 'Standard'} application (${newApp.id}) is submitted for scrutiny.`,
        type: newApp.isTatkal ? 'tatkal' : 'approval',
        sector: newApp.sectorName,
        timestamp: 'Just now',
        isRead: false
      },
      ...prev
    ]);

    // Celebrate with confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#ff6e14', '#10b981', '#00d2ff']
    });
  };

  // Authority Approval
  const handleApproveApplication = (appId) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'approved',
          certificateId: `BHAROSA-${app.sectorId?.toUpperCase() || 'SOV'}-2026-${Math.floor(10000 + Math.random() * 90000)}`
        };
      }
      return app;
    }));

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#10b981', '#fbbf24', '#00d2ff']
    });
  };

  // Authority Rejection
  const handleRejectApplication = (appId, reason) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'rejected',
          rejectionReason: reason
        };
      }
      return app;
    }));
  };

  // Family member handlers
  const handleSelectFamilyMember = (memberId) => {
    setActiveMemberId(memberId);
    const member = familyMembers.find(m => m.id === memberId);
    if (member) {
      setCurrentUser(prev => ({
        ...prev,
        name: member.name,
        aadhaarMasked: member.aadhaar || 'XXXX-XXXX-4519'
      }));
    }
  };

  const handleAddFamilyMember = (newMem) => {
    setFamilyMembers(prev => [...prev, newMem]);
  };

  // Notification handlers
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleAddLockerDocument = (newDoc) => {
    setLockerDocuments(prev => [newDoc, ...prev]);
  };

  const handleAddNotification = (notif) => {
    setNotifications(prev => [notif, ...prev]);
    setLiveToast(notif);
    setTimeout(() => {
      setLiveToast(null);
    }, 7000);
  };

  // If user has submitted login credentials, show dedicated Sovereign Verification Attestation Page
  if (verifyingUser) {
    return (
      <LoginVerificationSuccessPage
        userData={verifyingUser}
        onProceed={handleCompleteVerification}
        language={language}
      />
    );
  }

  // If user is logged out, show the Sovereign Landing Page or AuthGateway
  if (!currentUser) {
    if (showAuthGateway) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-white/95 flex items-center justify-between max-w-7xl w-full mx-auto">
            <button
              onClick={() => setShowAuthGateway(false)}
              className="px-4 py-2 rounded-full border border-[#002875]/30 text-[#002875] text-xs font-bold hover:bg-[#002875]/10 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>← Back to Sovereign Public Website</span>
            </button>
            <div className="text-xs font-mono text-slate-500">
              Multi-Factor Authentication Gateway · Sovereign Access Layer
            </div>
          </div>
          <AuthGateway 
            onLogin={handleLogin}
            language={language}
          />
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
        <SovereignLandingPage
          onOpenAuth={() => setShowAuthGateway(true)}
          onQuickDemoLogin={handleQuickDemoLogin}
          onOpenVerifier={() => {
            const el = document.getElementById('verify');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        <Footer />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-inter">
      
      {/* 1. Sovereign Top Navigation with Top-Right Action Cluster */}
      <TopNav
        currentUser={currentUser}
        activeRole={currentUser.role}
        onOpenNotifications={() => setNotificationDrawerOpen(true)}
        unreadCount={unreadCount}
        onOpenNews={() => setNewsDrawerOpen(true)}
        onOpenDownloadHub={() => setDownloadsDrawerOpen(true)}
        onOpenMenu={() => setMenuDrawerOpen(true)}
        language={language}
        onToggleLanguage={() => setLanguage(lang => lang === 'EN' ? 'HI' : 'EN')}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            
            {/* Citizen Vault Tab - Citizen only */}
            {currentUser.role === 'citizen' && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'dashboard'
                    ? 'bg-[#002875] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#002875] hover:bg-slate-100'
                }`}
              >
                <span>🏛️</span>
                <span>{language === 'EN' ? 'Nagrik Vault & Tracker' : 'नागरिक लॉकर'}</span>
              </button>
            )}

            {/* Authority Scrutiny Portal - Authority and Admin only */}
            {(currentUser.role === 'authority' || currentUser.role === 'admin') && (
              <button
                onClick={() => setActiveTab('authority')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'authority'
                    ? 'bg-[#002875] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#002875] hover:bg-slate-100'
                }`}
              >
                <span>🏢</span>
                <span>{currentUser.role === 'admin' ? (language === 'EN' ? 'Inter-Ministry Oversight' : 'मंत्रालयीन समीक्षा') : (language === 'EN' ? 'Authority Scrutiny & e-Sign' : 'प्राधिकरण सत्यापन')}</span>
              </button>
            )}

            {/* Sovereign Admin - Admin only */}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'admin'
                    ? 'bg-[#002875] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#002875] hover:bg-slate-100'
                }`}
              >
                <span>🛡️</span>
                <span>{language === 'EN' ? 'National Nodes & Audit' : 'राष्ट्रीय ऑडिट'}</span>
              </button>
            )}

            {/* Ashok Verification Attestation Screen Button */}
            <button
              onClick={() => setVerifyingUser(currentUser)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-amber-300 bg-amber-50/80 text-amber-950 hover:bg-amber-100 shadow-xs"
              title="View Ashok Emblem Attestation with Rotating Wheel & Flowing Tricolor River"
            >
              <AshokaChakra size={15} speed="normal" color="#002875" />
              <span>{language === 'EN' ? 'Ashok Attestation' : 'अशोक सत्यापन'}</span>
            </button>

            {/* Public Sovereign Showcase Tab */}
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'landing'
                  ? 'bg-gradient-to-r from-[#FF671F] to-[#E05A18] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#002875] hover:bg-slate-100'
              }`}
            >
              <span>🌐</span>
              <span>{language === 'EN' ? 'Sovereign Website' : 'सार्वजनिक वेबसाइट'}</span>
            </button>

          </div>

          {/* Quick Action Buttons Tailored to Persona */}
          <div className="flex items-center gap-2">
            {currentUser.role === 'citizen' && (
              <>
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="btn btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>+ Apply Credential</span>
                </button>

                <button
                  onClick={() => setDocServicesModalOpen(true)}
                  className="btn btn-secondary text-xs py-2 px-3 border-slate-300 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer shadow-sm"
                >
                  <span>🖨️ Print / Re-Issue</span>
                </button>
              </>
            )}

            {currentUser.role === 'authority' && (
              <button
                onClick={() => setActiveTab('authority')}
                className="btn btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,210,255,0.3)]"
              >
                <span>🏢 Scrutiny Queue</span>
              </button>
            )}

            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className="btn btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(255,110,20,0.3)]"
              >
                <span>🛡️ Node Telemetry (24/24)</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Main View */}
        {activeTab === 'dashboard' && (
          <ApplicantDashboard
            currentUser={currentUser}
            certificates={certificates}
            applications={applications}
            lockerDocuments={lockerDocuments}
            onOpenApply={() => setApplyModalOpen(true)}
            onOpenFamilyHub={() => setFamilyHubOpen(true)}
            onOpenLegacyDigitalize={() => setLegacyModalOpen(true)}
            onOpenDocServices={() => setDocServicesModalOpen(true)}
            onViewCertificate={handleOpenCertificate}
            onViewUploadedDocs={handleOpenUploadedDocViewer}
            onOpenAutoFit={handleOpenAutoFit}
            onOpenMergePdf={() => setMergePdfModalOpen(true)}
            onOpenProfileVault={() => setProfileVaultModalOpen(true)}
            onOpenDigiLockerAnalysis={() => setDigiLockerModalOpen(true)}
            onOpenExaminations={(examId = null) => {
              if (examId) setSelectedExamId(examId);
              setExaminationModalOpen(true);
            }}
            onDeleteLockerDoc={handleDeleteLockerDoc}
            onRenameLockerDoc={handleRenameLockerDoc}
            autoFillConsent={autoFillConsent}
            language={language}
          />
        )}

        {activeTab === 'verifier' && (
          <PublicVerifier
            certificates={certificates}
            onViewCertificate={handleOpenCertificate}
            onBackToDashboard={() => setActiveTab(currentUser.role === 'authority' ? 'authority' : currentUser.role === 'admin' ? 'admin' : 'dashboard')}
            language={language}
          />
        )}

        {activeTab === 'authority' && (
          <AuthorityDashboard
            currentUser={currentUser}
            applications={applications}
            onApproveApplication={handleApproveApplication}
            onRejectApplication={handleRejectApplication}
            onViewCertificate={handleOpenCertificate}
            onViewUploadedDocs={handleOpenUploadedDocViewer}
            sectors={SECTORS}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortal
            sectors={SECTORS}
          />
        )}

        {activeTab === 'landing' && (
          <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-6">
            <SovereignLandingPage
              onOpenAuth={() => setActiveTab('dashboard')}
              onQuickDemoLogin={handleQuickDemoLogin}
              onOpenVerifier={() => setActiveTab('verifier')}
            />
          </div>
        )}

      </main>

      {/* Floating Right-Side MARG AI Guide */}
      <MargAI
        onOpenApply={() => setApplyModalOpen(true)}
        onOpenVerify={() => setActiveTab('verifier')}
        onOpenDocServices={() => setDocServicesModalOpen(true)}
      />

      {/* Authoritative Sovereign Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <CertificateModal
        certificate={selectedCertForModal}
        onClose={() => setSelectedCertForModal(null)}
        onVerifyHash={() => {
          setSelectedCertForModal(null);
          setActiveTab('verifier');
        }}
      />

      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        sectors={SECTORS}
        onSubmitApplication={handleSubmitNewApplication}
        currentUser={currentUser}
        lockerDocuments={lockerDocuments}
        profile={citizenProfile}
        autoFillConsent={autoFillConsent}
        onViewUploadedDocs={handleOpenUploadedDocViewer}
        onOpenDigiLockerAnalysis={() => setDigiLockerModalOpen(true)}
        onOpenExaminations={(examId = null) => {
          if (examId) setSelectedExamId(examId);
          setExaminationModalOpen(true);
        }}
        initialStep={applyModalInitialStep}
        onAddLockerDocument={handleAddLockerDocument}
        onNotify={handleAddNotification}
      />

      <DocumentServicesModal
        isOpen={docServicesModalOpen}
        onClose={() => setDocServicesModalOpen(false)}
        certificates={certificates}
        onRequestService={(serv) => {
          setNotifications(prev => [
            {
              id: `notif-${Date.now()}`,
              title: `Service Placed: ${serv.service?.toUpperCase()}`,
              message: `Your document request for ${serv.certId} has been queued with Bharat BillPay receipt.`,
              type: 'approval',
              sector: 'Document Services',
              timestamp: 'Just now',
              isRead: false
            },
            ...prev
          ]);
        }}
      />

      <UploadedDocumentModal
        isOpen={uploadedDocViewer.isOpen}
        onClose={() => setUploadedDocViewer(prev => ({ ...prev, isOpen: false }))}
        documents={uploadedDocViewer.documents}
        initialIndex={uploadedDocViewer.initialIndex}
        applicationTitle={uploadedDocViewer.applicationTitle}
        applicantName={uploadedDocViewer.applicantName}
      />

      <FamilyHub
        isOpen={familyHubOpen}
        onClose={() => setFamilyHubOpen(false)}
        familyMembers={familyMembers}
        activeMemberId={activeMemberId}
        onSelectMember={handleSelectFamilyMember}
        onAddMember={handleAddFamilyMember}
        onApplyForMember={(member) => {
          setFamilyHubOpen(false);
          setApplyModalOpen(true);
        }}
      />

      <LegacyDigitalizeModal
        isOpen={legacyModalOpen}
        onClose={() => setLegacyModalOpen(false)}
        onSubmitLegacy={(data) => {
          handleSubmitNewApplication({
            id: `APP-LEGACY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            applicantName: currentUser.name,
            aadhaarMasked: currentUser.aadhaarMasked,
            sectorId: 'education',
            sectorName: 'Archival & Vintage Records',
            documentTitle: `${data.certTitle} (${data.passingYear})`,
            authorityName: data.issuingBoard || 'State Directorate',
            status: 'submitted',
            isTatkal: false,
            submittedOn: 'Just now',
            totalPaid: 50,
            uploadedDocuments: [{ name: 'Vintage_Scan_300DPI.pdf', size: '4.2 MB', hash: '8f921...bc' }]
          });
        }}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        currentUser={currentUser}
      />

      <MenuDrawer
        isOpen={menuDrawerOpen}
        onClose={() => setMenuDrawerOpen(false)}
        currentUser={currentUser}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenApply={() => setApplyModalOpen(true)}
        onOpenExaminations={(examId = null) => {
          if (examId) setSelectedExamId(examId);
          setExaminationModalOpen(true);
        }}
        onOpenFamilyHub={() => setFamilyHubOpen(true)}
        onOpenLegacyDigitalize={() => setLegacyModalOpen(true)}
        onOpenDocServices={() => setDocServicesModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
        language={language}
      />

      <NewsDrawer
        isOpen={newsDrawerOpen}
        onClose={() => setNewsDrawerOpen(false)}
        newsItems={SOVEREIGN_NEWS}
        sectors={SECTORS}
      />

      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onClearNotifications={handleClearNotifications}
        onSelectNotification={(n) => {
          setNotificationDrawerOpen(false);
          if (n.sector?.includes('Land')) setActiveTab('dashboard');
        }}
      />

      <DownloadsDrawer
        isOpen={downloadsDrawerOpen}
        onClose={() => setDownloadsDrawerOpen(false)}
        currentUser={currentUser}
      />

      {/* ================= FLAGSHIP AIM: AUTO-FIT, PDF MERGE & PROFILE VAULT MODALS ================= */}
      <AutoFitModal
        isOpen={autoFitModal.isOpen}
        onClose={() => setAutoFitModal({ isOpen: false, file: null, spec: null, onApply: null })}
        file={autoFitModal.file}
        spec={autoFitModal.spec}
        onApplyFixedFile={autoFitModal.onApply}
        existingLockerHashes={lockerDocuments.map(d => d.sha256)}
      />

      <MultiImagePdfModal
        isOpen={mergePdfModalOpen}
        onClose={() => setMergePdfModalOpen(false)}
        onAttachPdf={(mergedDoc) => {
          setLockerDocuments(prev => [
            {
              id: `doc-merged-${Date.now()}`,
              name: mergedDoc.name,
              docType: 'academic_degree',
              title: 'Multi-Page A4 Combined Document',
              category: 'education',
              sizeBytes: mergedDoc.sizeBytes || 850 * 1024,
              sizeFormatted: mergedDoc.size || '850 KB',
              dimensions: 'A4 Multi-Page',
              pageCount: mergedDoc.pageCount || 2,
              sha256: mergedDoc.sha256,
              uploadDate: 'Just now',
              familyMemberId: 'fam-1',
              familyMemberName: 'Aarav Sharma',
              source: 'upload',
              verifiedBadge: 'auto_fitted',
              operationsApplied: ['Multi-Page Merged', 'A4 PDF Standardized'],
              previewUrl: mergedDoc.dataUrl
            },
            ...prev
          ]);
          setMergePdfModalOpen(false);
          setNotifications(prev => [
            {
              id: `notif-${Date.now()}`,
              title: `Multi-Page PDF Generated: ${mergedDoc.name}`,
              message: `Combined into single compliant PDF (${mergedDoc.size || '850 KB'}). Merkle SHA-256 saved in locker.`,
              type: 'approval',
              sector: 'Document Locker',
              timestamp: 'Just now',
              isRead: false
            },
            ...prev
          ]);
        }}
      />

      <ProfileVaultModal
        isOpen={profileVaultModalOpen}
        onClose={() => setProfileVaultModalOpen(false)}
        profile={citizenProfile}
        onUpdateProfileField={handleUpdateProfileField}
        autoFillConsent={autoFillConsent}
        onToggleConsent={handleToggleConsent}
      />

      <DigiLockerAnalysisModal
        isOpen={digiLockerModalOpen}
        onClose={() => setDigiLockerModalOpen(false)}
        onApplyAnalyzedData={handleApplyDigiLockerAnalyzedData}
        currentUser={currentUser}
        onOpenAutoFitPreview={handleOpenAutoFit}
        onAddLockerDocument={handleAddLockerDocument}
        onNotify={handleAddNotification}
      />

      <ExaminationModal
        isOpen={examinationModalOpen}
        onClose={() => setExaminationModalOpen(false)}
        currentUser={currentUser}
        profile={citizenProfile}
        lockerDocuments={lockerDocuments}
        onRegisterExam={handleRegisterExam}
        preselectedExamId={selectedExamId}
        onOpenAutoFitPreview={handleOpenAutoFit}
        onAddLockerDocument={handleAddLockerDocument}
        onNotify={handleAddNotification}
      />

      {/* Floating Sovereign Live Notification Toast upon Auto-Procure Completion */}
      {liveToast && (
        <div className="fixed bottom-6 right-6 z-70 max-w-sm sm:max-w-md bg-white/95 backdrop-blur-xl border-2 border-emerald-400 rounded-3xl shadow-[0_20px_50px_rgba(0,40,117,0.2)] p-4 flex items-start gap-3.5 animate-bounce-short">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shrink-0 mt-0.5">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-extrabold text-slate-900 line-clamp-1">{liveToast.title}</h4>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-black uppercase">
                Issued &amp; Notified
              </span>
            </div>
            <p className="text-slate-600 mt-1 leading-relaxed">{liveToast.message}</p>
            <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-[#002875]">
              <span className="flex items-center gap-1 text-emerald-700 font-mono">
                <CheckCircle2 size={12} />
                <span>Form Auto-Filled</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setLiveToast(null);
                  setNotificationDrawerOpen(true);
                }}
                className="hover:underline cursor-pointer"
              >
                View in Alerts Hub →
              </button>
            </div>
          </div>
          <button
            onClick={() => setLiveToast(null)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      )}

    </div>
  );
}
