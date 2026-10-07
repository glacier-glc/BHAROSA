/**
 * National Examination Conducting Bodies & Competitive Examinations Master Data
 * Comprehensive specifications for Bharat's top national testing agencies:
 * 1. NTA (National Testing Agency) - JEE Main, NEET UG, CUET UG, UGC-NET
 * 2. UPSC (Union Public Service Commission) - Civil Services (CSE), NDA & NA
 * 3. IIT Council / IISc (Joint Admission Board) - JEE Advanced, GATE
 * 4. CBSE (Central Board of Secondary Education) - CTET, Board Exam Private
 */

export const CONDUCTING_BODIES = [
  {
    id: 'nta',
    name: 'National Testing Agency (NTA)',
    shortName: 'NTA',
    hindiName: 'राष्ट्रीय परीक्षा एजेंसी',
    logoText: 'NTA',
    tagline: 'Excellence in Assessment',
    ministry: 'Ministry of Education, Government of India',
    accentColor: '#002875',
    bgBadge: 'bg-blue-50 text-[#002875] border-blue-200'
  },
  {
    id: 'upsc',
    name: 'Union Public Service Commission (UPSC)',
    shortName: 'UPSC',
    hindiName: 'संघ लोक सेवा आयोग',
    logoText: 'UPSC',
    tagline: 'Constitutional Body Under Article 315-323',
    ministry: 'Department of Personnel and Training (DoPT)',
    accentColor: '#b45309',
    bgBadge: 'bg-amber-50 text-amber-900 border-amber-200'
  },
  {
    id: 'iit_council',
    name: 'Joint Admission Board / IIT Council & IISc',
    shortName: 'IIT Council',
    hindiName: 'संयुक्त प्रवेश बोर्ड (आईआईटी)',
    logoText: 'IIT',
    tagline: 'Council of Indian Institutes of Technology',
    ministry: 'Higher Technical Education Directorate',
    accentColor: '#047857',
    bgBadge: 'bg-emerald-50 text-emerald-900 border-emerald-200'
  },
  {
    id: 'cbse',
    name: 'Central Board of Secondary Education (CBSE)',
    shortName: 'CBSE',
    hindiName: 'केंद्रीय माध्यमिक शिक्षा बोर्ड',
    logoText: 'CBSE',
    tagline: 'Teachers & Secondary Education Directorate',
    ministry: 'Ministry of Education, Government of India',
    accentColor: '#7c3aed',
    bgBadge: 'bg-purple-50 text-purple-900 border-purple-200'
  }
];

export const NATIONAL_EXAMINATIONS = [
  // --- NTA EXAMINATIONS ---
  {
    id: 'nta_jee_main',
    conductingBodyId: 'nta',
    examCode: 'JEE(Main)-2026',
    title: 'Joint Entrance Examination (Main) 2026',
    shortTitle: 'JEE (Main) 2026',
    hindiTitle: 'संयुक्त प्रवेश परीक्षा (मुख्य) 2026',
    category: 'Engineering & Architecture',
    sessionChoices: [
      { id: 'session_1', label: 'Session 1 (January 2026)' },
      { id: 'session_2', label: 'Session 2 (April 2026)' },
      { id: 'both', label: 'Both Sessions 1 & 2 (Recommended)' }
    ],
    papers: [
      { id: 'paper_1', name: 'Paper 1 (B.E. / B.Tech)', fee: 1000 },
      { id: 'paper_2a', name: 'Paper 2A (B.Arch)', fee: 1000 },
      { id: 'paper_2b', name: 'Paper 2B (B.Planning)', fee: 1000 },
      { id: 'combo_1_2a', name: 'Combo: Paper 1 (B.E./B.Tech) + Paper 2A (B.Arch)', fee: 2000 }
    ],
    mediumLanguages: ['English', 'Hindi', 'Gujarati', 'Marathi', 'Bengali', 'Tamil', 'Telugu', 'Urdu'],
    eligibility: '10+2 / Equivalent with Physics, Mathematics & Chemistry/Biotech (75% or Top 20 percentile in Board)',
    examWindow: 'January 24 – February 1, 2026 (Computer Based Test)',
    admitCardSchedule: '3 Days before Examination Date',
    feeStructure: {
      general_male: 1000,
      general_female: 800,
      gen_ews_obc_ncl: 900,
      sc_st_pwd: 500
    },
    docSpecs: {
      photo: 'Passport Size (10 KB – 200 KB, 80% face coverage with candidate name & date)',
      signature: 'Specimen Signature on White Paper with Black Pen (4 KB – 30 KB)',
      categoryCert: 'Category / PwD Certificate (50 KB – 300 KB, PDF)'
    }
  },
  {
    id: 'nta_neet_ug',
    conductingBodyId: 'nta',
    examCode: 'NEET(UG)-2026',
    title: 'National Eligibility cum Entrance Test (UG) 2026',
    shortTitle: 'NEET (UG) 2026',
    hindiTitle: 'राष्ट्रीय पात्रता सह प्रवेश परीक्षा (यूजी) 2026',
    category: 'Medical, Dental & AYUSH',
    sessionChoices: [
      { id: 'single_session', label: 'Single Pen & Paper (OMR) Exam (May 2026)' }
    ],
    papers: [
      { id: 'neet_mbbs_bds', name: 'Undergraduate Medical (MBBS, BDS, BAMS, BHMS, B.Sc Nursing)', fee: 1700 }
    ],
    mediumLanguages: ['English', 'Hindi', 'Assamese', 'Bengali', 'Gujarati', 'Kannada', 'Malayalam', 'Marathi', 'Odia', 'Punjabi', 'Tamil', 'Telugu', 'Urdu'],
    eligibility: '10+2 with Physics, Chemistry, Biology/Biotech & English (Minimum 50% for General, 40% for Reserved)',
    examWindow: 'First Sunday of May 2026 (Pen & Paper / OMR Mode)',
    admitCardSchedule: 'Last Week of April 2026',
    feeStructure: {
      general_male: 1700,
      general_female: 1700,
      gen_ews_obc_ncl: 1600,
      sc_st_pwd: 1000
    },
    docSpecs: {
      photo: 'Passport Size (10 KB – 200 KB) & Postcard Size 4x6 (10 KB – 200 KB)',
      signature: 'Candidate Signature in Running Hand (4 KB – 30 KB)',
      categoryCert: 'Category / Domicile / PwD Certificate (50 KB – 300 KB, PDF)'
    }
  },
  {
    id: 'nta_cuet_ug',
    conductingBodyId: 'nta',
    examCode: 'CUET(UG)-2026',
    title: 'Common University Entrance Test (CUET UG) 2026',
    shortTitle: 'CUET (UG) 2026',
    hindiTitle: 'सामान्य विश्वविद्यालय प्रवेश परीक्षा (यूजी) 2026',
    category: 'Central Universities Admissions',
    sessionChoices: [
      { id: 'hybrid_may', label: 'Hybrid CBT / OMR (May – June 2026)' }
    ],
    papers: [
      { id: 'cuet_up_to_3', name: 'Up to 3 Subject Papers (Section I + II + III)', fee: 1000 },
      { id: 'cuet_up_to_5', name: 'Up to 5 Subject Papers', fee: 1800 },
      { id: 'cuet_up_to_6', name: 'Up to 6 Subject Papers (Maximum Choice)', fee: 2200 }
    ],
    mediumLanguages: ['English', 'Hindi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu', 'Marathi'],
    eligibility: 'Class 12th Appeared or Passed from any recognized National or State Board',
    examWindow: 'May 15 – May 31, 2026',
    admitCardSchedule: 'Second Week of May 2026',
    feeStructure: {
      general_male: 1000,
      general_female: 1000,
      gen_ews_obc_ncl: 900,
      sc_st_pwd: 800
    },
    docSpecs: {
      photo: 'Recent Color Photo (10 KB – 200 KB)',
      signature: 'Signature on white paper (4 KB – 30 KB)',
      categoryCert: 'Class 10th Certificate as Date of Birth Proof (50 KB – 300 KB, PDF)'
    }
  },
  {
    id: 'nta_ugc_net',
    conductingBodyId: 'nta',
    examCode: 'UGC-NET-JUNE-2026',
    title: 'University Grants Commission National Eligibility Test (UGC-NET)',
    shortTitle: 'UGC-NET 2026',
    hindiTitle: 'विश्वविद्यालय अनुदान आयोग राष्ट्रीय पात्रता परीक्षा',
    category: 'Doctoral Fellowship (JRF) & Assistant Professor',
    sessionChoices: [
      { id: 'june_2026', label: 'June 2026 Cycle' }
    ],
    papers: [
      { id: 'jrf_and_asst_prof', name: 'Junior Research Fellowship (JRF) & Assistant Professor', fee: 1150 },
      { id: 'asst_prof_only', name: 'Assistant Professor Only & Ph.D Admission', fee: 1150 }
    ],
    mediumLanguages: ['English', 'Hindi'],
    eligibility: 'Master’s Degree or equivalent with at least 55% marks (50% for SC/ST/OBC/PwD)',
    examWindow: 'June 10 – June 21, 2026 (CBT Mode)',
    admitCardSchedule: 'First Week of June 2026',
    feeStructure: {
      general_male: 1150,
      general_female: 1150,
      gen_ews_obc_ncl: 600,
      sc_st_pwd: 325
    },
    docSpecs: {
      photo: 'Passport Size Photo (10 KB – 200 KB)',
      signature: 'Candidate Signature (4 KB – 30 KB)',
      categoryCert: 'Category / PG Degree Certificate (50 KB – 300 KB, PDF)'
    }
  },

  // --- UPSC EXAMINATIONS ---
  {
    id: 'upsc_cse',
    conductingBodyId: 'upsc',
    examCode: 'UPSC-CSE-2026',
    title: 'Civil Services (Preliminary) Examination 2026',
    shortTitle: 'UPSC Civil Services 2026',
    hindiTitle: 'सिविल सेवा (प्रारंभिक) परीक्षा 2026',
    category: 'All India Services (IAS / IPS / IFS / IRS)',
    sessionChoices: [
      { id: 'prelims_may', label: 'Civil Services Prelims (May 24, 2026)' }
    ],
    papers: [
      { id: 'cse_prelims', name: 'CS (Prelims) General Studies Paper-I + CSAT Paper-II', fee: 100 },
      { id: 'cse_ifs_combo', name: 'Combined CS (Prelims) + Indian Forest Service (IFS)', fee: 100 }
    ],
    mediumLanguages: ['English', 'Hindi'],
    eligibility: 'Graduate Degree in any discipline from a recognized University; Age 21 – 32 Years',
    examWindow: 'May 24, 2026 (Sunday, Offline Pen & Paper OMR)',
    admitCardSchedule: '3 Weeks before Exam Date (e-Admit Card)',
    feeStructure: {
      general_male: 100,
      general_female: 0, // Female candidates exempt in UPSC
      gen_ews_obc_ncl: 100,
      sc_st_pwd: 0 // SC/ST/PwD exempt in UPSC
    },
    docSpecs: {
      photo: 'Color Photo with Candidate Name & Date printed below (20 KB – 300 KB, Min 350x350 px)',
      signature: 'Candidate Signature (20 KB – 300 KB, Min 350x350 px)',
      categoryCert: 'Photo ID Card PDF (Aadhaar / Voter ID / Passport, 20 KB – 300 KB)'
    }
  },
  {
    id: 'upsc_nda',
    conductingBodyId: 'upsc',
    examCode: 'UPSC-NDA-NA-I-2026',
    title: 'National Defence Academy & Naval Academy Examination (I) 2026',
    shortTitle: 'UPSC NDA & NA (I) 2026',
    hindiTitle: 'राष्ट्रीय रक्षा अकादमी एवं नौसेना अकादमी परीक्षा (I) 2026',
    category: 'Defence & Armed Forces Commission',
    sessionChoices: [
      { id: 'nda_april', label: 'NDA & NA (I) April 2026' }
    ],
    papers: [
      { id: 'nda_army_navy_airforce', name: 'Mathematics (300 Marks) + General Ability Test GAT (600 Marks)', fee: 100 }
    ],
    mediumLanguages: ['English', 'Hindi'],
    eligibility: '12th Class Pass of 10+2 pattern (with Physics, Chemistry & Math for Air Force / Navy wings); Age 16.5 – 19.5',
    examWindow: 'April 19, 2026 (Sunday)',
    admitCardSchedule: '2 Weeks before Exam Date',
    feeStructure: {
      general_male: 100,
      general_female: 0,
      gen_ews_obc_ncl: 100,
      sc_st_pwd: 0
    },
    docSpecs: {
      photo: 'Color Photograph with white background (20 KB – 300 KB)',
      signature: 'Signature (20 KB – 300 KB)',
      categoryCert: 'Photo Identity Card PDF (20 KB – 300 KB)'
    }
  },

  // --- IIT COUNCIL / IISC EXAMINATIONS ---
  {
    id: 'iit_jee_adv',
    conductingBodyId: 'iit_council',
    examCode: 'JEE(Advanced)-2026',
    title: 'Joint Entrance Examination (Advanced) 2026',
    shortTitle: 'JEE (Advanced) 2026',
    hindiTitle: 'संयुक्त प्रवेश परीक्षा (एडवांस्ड) 2026',
    category: 'Premier IIT Degree Admissions',
    sessionChoices: [
      { id: 'adv_may', label: 'Single Mandatory Day: Paper 1 & Paper 2 (May 2026)' }
    ],
    papers: [
      { id: 'jee_adv_full', name: 'Paper 1 (Morning 9 AM) & Paper 2 (Afternoon 2:30 PM)', fee: 3200 }
    ],
    mediumLanguages: ['English', 'Hindi'],
    eligibility: 'Must be among the Top 2,50,000 successful candidates in B.E./B.Tech Paper of JEE (Main) 2026',
    examWindow: 'Fourth Sunday of May 2026 (CBT Mode)',
    admitCardSchedule: 'Mid-May 2026',
    feeStructure: {
      general_male: 3200,
      general_female: 1600,
      gen_ews_obc_ncl: 3200,
      sc_st_pwd: 1600
    },
    docSpecs: {
      photo: 'Passport Size Photo (10 KB – 200 KB)',
      signature: 'Full Signature (4 KB – 30 KB)',
      categoryCert: 'Class 10th Birth Certificate & Category Certificate (PDF 50 KB – 300 KB)'
    }
  },
  {
    id: 'iit_gate',
    conductingBodyId: 'iit_council',
    examCode: 'GATE-2026',
    title: 'Graduate Aptitude Test in Engineering (GATE 2026)',
    shortTitle: 'GATE 2026',
    hindiTitle: 'ग्रेजुएट एप्टीट्यूड टेस्ट इन इंजीनियरिंग (गेट) 2026',
    category: 'Post-Graduate M.Tech / PSU Recruitment',
    sessionChoices: [
      { id: 'gate_feb', label: 'February 2026 Weekends (CBT Mode)' }
    ],
    papers: [
      { id: 'gate_cs', name: 'Computer Science and Information Technology (CS)', fee: 1800 },
      { id: 'gate_ec', name: 'Electronics and Communication Engineering (EC)', fee: 1800 },
      { id: 'gate_ee', name: 'Electrical Engineering (EE)', fee: 1800 },
      { id: 'gate_me', name: 'Mechanical Engineering (ME)', fee: 1800 },
      { id: 'gate_ce', name: 'Civil Engineering (CE)', fee: 1800 },
      { id: 'gate_da', name: 'Data Science & Artificial Intelligence (DA)', fee: 1800 }
    ],
    mediumLanguages: ['English'],
    eligibility: 'Currently studying in 3rd or higher year or completed Bachelor’s degree in Engg / Tech / Architecture / Science',
    examWindow: 'February 7, 8, 14 & 15, 2026',
    admitCardSchedule: 'First Week of January 2026',
    feeStructure: {
      general_male: 1800,
      general_female: 900,
      gen_ews_obc_ncl: 1800,
      sc_st_pwd: 900
    },
    docSpecs: {
      photo: 'High quality color passport photo (5 KB – 200 KB, 3.5cm x 4.5cm)',
      signature: 'Signature in black or dark blue ink (5 KB – 200 KB)',
      categoryCert: 'Category / PwD / Degree Certificate PDF (10 KB – 500 KB)'
    }
  },

  // --- CBSE EXAMINATIONS ---
  {
    id: 'cbse_ctet',
    conductingBodyId: 'cbse',
    examCode: 'CTET-JULY-2026',
    title: 'Central Teacher Eligibility Test (CTET) July 2026',
    shortTitle: 'CBSE CTET 2026',
    hindiTitle: 'केंद्रीय शिक्षक पात्रता परीक्षा (सीटीईटी) 2026',
    category: 'National Teaching Certification (Class I – VIII)',
    sessionChoices: [
      { id: 'ctet_july', label: 'July 2026 Session (Sunday)' }
    ],
    papers: [
      { id: 'paper_1_primary', name: 'Paper I (For Classes I to V - Primary Stage)', fee: 1000 },
      { id: 'paper_2_elementary', name: 'Paper II (For Classes VI to VIII - Elementary Stage)', fee: 1000 },
      { id: 'both_papers_ctet', name: 'Both Paper I & Paper II (Primary + Elementary)', fee: 1200 }
    ],
    mediumLanguages: ['English', 'Hindi', 'Sanskrit', 'Urdu'],
    eligibility: 'Senior Secondary with at least 50% marks & 2-year Diploma in Elementary Education / B.El.Ed / B.Ed',
    examWindow: 'July 5, 2026 (Two Shifts)',
    admitCardSchedule: '2 Days before Examination Date',
    feeStructure: {
      general_male: 1000,
      general_female: 1000,
      gen_ews_obc_ncl: 1000,
      sc_st_pwd: 500
    },
    docSpecs: {
      photo: 'Color Photograph in JPG/JPEG (10 KB – 100 KB, 3.5 x 4.5 cm)',
      signature: 'Signature in JPG/JPEG (3 KB – 30 KB, 3.5 x 1.5 cm)',
      categoryCert: 'Teaching Qualification Marks Memo (50 KB – 300 KB, PDF)'
    }
  }
];

// Major Indian Examination Center Cities grouped by State
export const EXAMINATION_CITIES_BY_STATE = [
  {
    state: 'Delhi (NCT)',
    cities: [
      { id: 'delhi_central', name: 'Delhi (Central / North / South / East / West)' },
      { id: 'ncr_noida', name: 'Noida / Greater Noida (NCR)' },
      { id: 'ncr_gurugram', name: 'Gurugram / Faridabad (NCR)' },
      { id: 'ncr_ghaziabad', name: 'Ghaziabad (NCR)' }
    ]
  },
  {
    state: 'Maharashtra',
    cities: [
      { id: 'mumbai', name: 'Mumbai City & Suburban' },
      { id: 'pune', name: 'Pune' },
      { id: 'nagpur', name: 'Nagpur' },
      { id: 'nashik', name: 'Nashik' },
      { id: 'chhatrapati_sambhajinagar', name: 'Chhatrapati Sambhajinagar (Aurangabad)' }
    ]
  },
  {
    state: 'Uttar Pradesh',
    cities: [
      { id: 'lucknow', name: 'Lucknow' },
      { id: 'prayagraj', name: 'Prayagraj (Allahabad)' },
      { id: 'varanasi', name: 'Varanasi' },
      { id: 'kanpur', name: 'Kanpur' },
      { id: 'agra', name: 'Agra' }
    ]
  },
  {
    state: 'Rajasthan',
    cities: [
      { id: 'jaipur', name: 'Jaipur' },
      { id: 'kota', name: 'Kota (Educational Hub)' },
      { id: 'jodhpur', name: 'Jodhpur' },
      { id: 'udaipur', name: 'Udaipur' }
    ]
  },
  {
    state: 'Karnataka',
    cities: [
      { id: 'bengaluru', name: 'Bengaluru Urban & Rural' },
      { id: 'mysuru', name: 'Mysuru' },
      { id: 'mangaluru', name: 'Mangaluru' },
      { id: 'hubballi_dharwad', name: 'Hubballi-Dharwad' }
    ]
  },
  {
    state: 'Telangana & Andhra Pradesh',
    cities: [
      { id: 'hyderabad', name: 'Hyderabad / Secunderabad' },
      { id: 'warangal', name: 'Warangal' },
      { id: 'visakhapatnam', name: 'Visakhapatnam' },
      { id: 'vijayawada', name: 'Vijayawada / Guntur' }
    ]
  },
  {
    state: 'West Bengal & Bihar',
    cities: [
      { id: 'kolkata', name: 'Kolkata Metropolitan Area' },
      { id: 'siliguri', name: 'Siliguri' },
      { id: 'patna', name: 'Patna' },
      { id: 'gaya', name: 'Gaya' },
      { id: 'muzaffarpur', name: 'Muzaffarpur' }
    ]
  },
  {
    state: 'Tamil Nadu & Kerala',
    cities: [
      { id: 'chennai', name: 'Chennai' },
      { id: 'coimbatore', name: 'Coimbatore' },
      { id: 'madurai', name: 'Madurai' },
      { id: 'kochi', name: 'Ernakulam / Kochi' },
      { id: 'thiruvananthapuram', name: 'Thiruvananthapuram' }
    ]
  }
];
