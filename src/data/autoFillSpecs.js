/**
 * BHAROSA Standard Document Specifications
 * Defines official portal requirements across government services:
 * - Allowed mime types / magic byte signatures
 * - Size constraints (min and max)
 * - Dimensions, aspect ratios, and DPI hints
 * - Page count limits
 */

export const DOCUMENT_SPECS = {
  photo: {
    id: 'photo',
    title: 'Passport Size Photograph',
    allowedTypes: ['image/jpeg', 'image/jpg'],
    allowedExtensions: ['jpg', 'jpeg'],
    minSizeBytes: 20 * 1024,       // 20 KB
    maxSizeBytes: 50 * 1024,       // 50 KB
    targetWidth: 200,
    targetHeight: 230,
    aspectRatio: 200 / 230,        // 0.869
    dpi: 200,
    colorMode: 'color',
    specText: 'JPEG • 200×230 px • 20–50 KB',
    description: 'Recent clear colored passport-style photo on light plain background.'
  },
  signature: {
    id: 'signature',
    title: 'Applicant Signature Scan',
    allowedTypes: ['image/jpeg', 'image/png'],
    allowedExtensions: ['jpg', 'jpeg', 'png'],
    minSizeBytes: 10 * 1024,       // 10 KB
    maxSizeBytes: 20 * 1024,       // 20 KB
    targetWidth: 140,
    targetHeight: 60,
    aspectRatio: 140 / 60,         // 2.333
    dpi: 200,
    colorMode: 'B&W / Dark Blue on White',
    specText: 'JPEG/PNG • 140×60 px • 10–20 KB',
    description: 'Signature in black or dark blue ink on crisp white paper.'
  },
  academic_degree: {
    id: 'academic_degree',
    title: 'Degree / Academic Qualification Certificate',
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['pdf'],
    minSizeBytes: 50 * 1024,       // 50 KB
    maxSizeBytes: 2 * 1024 * 1024, // 2 MB
    maxPages: 5,
    dpi: 200,
    colorMode: 'color or grayscale',
    specText: 'PDF • Max 2 MB • Max 5 Pages',
    description: 'Official degree certificate, marksheet, or provisional passing record.'
  },
  id_proof: {
    id: 'id_proof',
    title: 'Government Identity Proof (Aadhaar / PAN / Passport)',
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
    minSizeBytes: 30 * 1024,       // 30 KB
    maxSizeBytes: 1 * 1024 * 1024, // 1 MB
    maxPages: 2,
    dpi: 150,
    colorMode: 'color or grayscale',
    specText: 'PDF/JPEG/PNG • Max 1 MB',
    description: 'Valid government-issued photo identity with legible ID number.'
  },
  address_proof: {
    id: 'address_proof',
    title: 'Proof of Residence / Domicile Certificate',
    allowedTypes: ['application/pdf', 'image/jpeg'],
    allowedExtensions: ['pdf', 'jpg', 'jpeg'],
    minSizeBytes: 30 * 1024,
    maxSizeBytes: 1 * 1024 * 1024,
    maxPages: 3,
    dpi: 150,
    colorMode: 'color or grayscale',
    specText: 'PDF/JPEG • Max 1 MB',
    description: 'Electricity bill, Domicile certificate, Voter ID or Rent agreement.'
  },
  property_deed: {
    id: 'property_deed',
    title: 'Encumbrance / Property Title Record',
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['pdf'],
    minSizeBytes: 100 * 1024,
    maxSizeBytes: 4 * 1024 * 1024, // 4 MB
    maxPages: 15,
    dpi: 200,
    colorMode: 'grayscale or color',
    specText: 'PDF • Max 4 MB • Multi-page allowed',
    description: 'Registered sale deed or certified 30-year index register extract.'
  }
};

/**
 * Seed My Documents Locker
 * Contains 5 ready documents (1 signed credential, photo, signature, marksheet, ID proof)
 * and 2 sample non-compliant files for instant Auto-Fit testing.
 */
export const INITIAL_LOCKER_DOCUMENTS = [
  {
    id: 'doc-lock-1',
    docType: 'academic_degree',
    name: 'IIT_Delhi_BTech_Degree.pdf',
    title: 'B.Tech Degree in Computer Science',
    category: 'education',
    sha256: '9f2c1a7e4b63d08a5c1e97f3b20d46a8e15c7b9023fa64d18e0b5c3a7d92f641',
    uploadDate: '14 Jun 2025',
    sizeBytes: 840 * 1024,
    sizeFormatted: '840 KB',
    dimensions: 'A4 (210 × 297 mm)',
    pageCount: 1,
    familyMemberId: 'fam-1',
    familyMemberName: 'Aarav Sharma',
    source: 'vault', // 'vault' | 'upload' | 'past_app'
    verifiedBadge: 'verified', // 'verified' | 'self_uploaded' | 'auto_fitted'
    operationsApplied: ['ECDSA P-256 Signed', 'Merkle Sealed'],
    extractedFields: {
      fullName: 'Aarav Sharma',
      degree: 'B.Tech in Computer Science',
      institution: 'IIT Delhi',
      year: '2025',
      grade: 'Distinction'
    }
  },
  {
    id: 'doc-lock-2',
    docType: 'photo',
    name: 'Aarav_Passport_Photo.jpg',
    title: 'Compliant Passport Photo (200×230)',
    category: 'personal',
    sha256: 'e83c21a4f0283c79a109823fbc01928409128309182309182039812039812039',
    uploadDate: '10 Jan 2026',
    sizeBytes: 34 * 1024,
    sizeFormatted: '34 KB',
    dimensions: '200 × 230 px',
    pageCount: 1,
    familyMemberId: 'fam-1',
    familyMemberName: 'Aarav Sharma',
    source: 'upload',
    verifiedBadge: 'verified',
    operationsApplied: ['Auto-Fit Compliant'],
    extractedFields: {
      fullName: 'Aarav Sharma'
    }
  },
  {
    id: 'doc-lock-3',
    docType: 'signature',
    name: 'Aarav_Signature_Scan.png',
    title: 'Official Specimen Signature (140×60)',
    category: 'personal',
    sha256: 'c901823049812039812093812093810293810293810928301928301928301928',
    uploadDate: '10 Jan 2026',
    sizeBytes: 15 * 1024,
    sizeFormatted: '15 KB',
    dimensions: '140 × 60 px',
    pageCount: 1,
    familyMemberId: 'fam-1',
    familyMemberName: 'Aarav Sharma',
    source: 'upload',
    verifiedBadge: 'verified',
    operationsApplied: ['Auto-Fit Compliant'],
    extractedFields: {
      fullName: 'Aarav Sharma'
    }
  },
  {
    id: 'doc-lock-4',
    docType: 'academic_degree',
    name: 'CBSE_Class_X_Marksheet.pdf',
    title: 'Class X Secondary School Certificate',
    category: 'education',
    sha256: '4a1b92c830192830192830192830192830192830192830192830192830192830',
    uploadDate: '02 Mar 2024',
    sizeBytes: 1100 * 1024,
    sizeFormatted: '1.1 MB',
    dimensions: 'A4 (210 × 297 mm)',
    pageCount: 1,
    familyMemberId: 'fam-1',
    familyMemberName: 'Aarav Sharma',
    source: 'past_app',
    verifiedBadge: 'self_uploaded',
    operationsApplied: [],
    extractedFields: {
      fullName: 'Aarav S. Sharma', // Intentional conflict for demo!
      fatherName: 'Suresh Sharma',
      motherName: 'Sunita Sharma',
      dob: '2001-08-15',
      rollNumber: 'CBSE-2017-884920'
    }
  },
  {
    id: 'doc-lock-5',
    docType: 'id_proof',
    name: 'Aadhaar_Card_Verified_Scan.pdf',
    title: 'UIDAI Aadhaar Card',
    category: 'identity',
    sha256: '7f9a81b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abc',
    uploadDate: '18 Aug 2025',
    sizeBytes: 450 * 1024,
    sizeFormatted: '450 KB',
    dimensions: '1200 × 800 px',
    pageCount: 1,
    familyMemberId: 'fam-1',
    familyMemberName: 'Aarav Sharma',
    source: 'vault',
    verifiedBadge: 'verified',
    operationsApplied: ['UIDAI SHA-256 Root Authenticated'],
    extractedFields: {
      fullName: 'Aarav Sharma',
      aadhaarMasked: 'XXXX-XXXX-4519',
      dob: '2001-08-15',
      gender: 'Male',
      fatherName: 'Suresh Sharma',
      state: 'Maharashtra',
      district: 'Mumbai City',
      pincode: '400076'
    }
  },
  // Sample Non-Compliant Files for Demo Auto-Fitting
  {
    id: 'doc-lock-demo-oversized-photo',
    docType: 'photo',
    name: 'Unprocessed_Phone_Photo_Oversized.jpg',
    title: '⚠️ Unprocessed Camera Photo (Oversized 3.4 MB)',
    category: 'personal',
    sha256: 'aa11bb22cc33dd44ee55ff6600112233445566778899aabbccddeeff00112233',
    uploadDate: 'Today',
    sizeBytes: 3400 * 1024,
    sizeFormatted: '3.4 MB (Too Large!)',
    dimensions: '2400 × 3200 px (Wrong Aspect Ratio)',
    pageCount: 1,
    familyMemberId: 'fam-1',
    familyMemberName: 'Aarav Sharma',
    source: 'upload',
    verifiedBadge: 'self_uploaded',
    isNonCompliant: true,
    nonComplianceReason: 'File size exceeds 50 KB limit; Dimensions (2400×3200) not matching 200×230 px spec.',
    operationsApplied: []
  },
  {
    id: 'doc-lock-demo-oversized-pdf',
    docType: 'academic_degree',
    name: 'Heavy_Raw_HighRes_Deed.pdf',
    title: '⚠️ Heavy Raw Document Scan (6.2 MB PDF)',
    category: 'education',
    sha256: 'bb22cc33dd44ee55ff6600112233445566778899aabbccddeeff001122334455',
    uploadDate: 'Today',
    sizeBytes: 6200 * 1024,
    sizeFormatted: '6.2 MB (Exceeds 2 MB)',
    dimensions: 'A4 600 DPI',
    pageCount: 8,
    familyMemberId: 'fam-1',
    familyMemberName: 'Aarav Sharma',
    source: 'upload',
    verifiedBadge: 'self_uploaded',
    isNonCompliant: true,
    nonComplianceReason: 'File size (6.2 MB) exceeds the 2 MB portal limit.',
    operationsApplied: []
  }
];

/**
 * Citizen Profile Vault
 * Single authoritative profile record per citizen with field-level confidence & source provenance
 */
export const INITIAL_CITIZEN_PROFILE = {
  id: 'profile-aarav-sharma',
  citizenId: 'US-882190-C',
  name: {
    value: 'Aarav Sharma',
    source: 'IIT Delhi Degree Credential',
    sourceType: 'vault_credential',
    confidence: 'High',
    verified: true,
    lastVerifiedDate: '14 Jun 2025',
    locked: true,
    hasConflict: true,
    conflicts: [
      {
        value: 'Aarav Sharma',
        source: 'IIT Delhi Degree (Vault Credential)',
        confidence: 'High',
        verified: true
      },
      {
        value: 'Aarav S. Sharma',
        source: 'CBSE Class X Marksheet (Self-uploaded)',
        confidence: 'Medium',
        verified: false
      }
    ]
  },
  fatherName: {
    value: 'Suresh Sharma',
    source: 'Aadhaar Card Record',
    sourceType: 'vault_credential',
    confidence: 'High',
    verified: true,
    lastVerifiedDate: '18 Aug 2025',
    locked: false
  },
  motherName: {
    value: 'Sunita Sharma',
    source: 'CBSE Marksheet',
    sourceType: 'past_application',
    confidence: 'Medium',
    verified: true,
    lastVerifiedDate: '02 Mar 2024',
    locked: false
  },
  dob: {
    value: '2001-08-15',
    source: 'Aadhaar Card Record',
    sourceType: 'vault_credential',
    confidence: 'High',
    verified: true,
    lastVerifiedDate: '18 Aug 2025',
    locked: true
  },
  gender: {
    value: 'Male',
    source: 'Aadhaar Card Record',
    sourceType: 'vault_credential',
    confidence: 'High',
    verified: true,
    lastVerifiedDate: '18 Aug 2025',
    locked: false
  },
  aadhaarNumber: {
    value: 'XXXX-XXXX-4519',
    rawLast4: '4519',
    source: 'UIDAI Sovereign Vault Token',
    sourceType: 'vault_credential',
    confidence: 'High',
    verified: true,
    lastVerifiedDate: '18 Aug 2025',
    locked: true
  },
  panNumber: {
    value: 'ABCDE1234F',
    rawLast4: '234F',
    source: 'Income Tax Department Token',
    sourceType: 'vault_credential',
    confidence: 'High',
    verified: true,
    lastVerifiedDate: '18 Aug 2025',
    locked: true
  },
  mobileNumber: {
    value: '+91 98765 43210',
    source: 'UIDAI Registered Mobile',
    sourceType: 'vault_credential',
    confidence: 'High',
    verified: true,
    lastVerifiedDate: 'Today',
    locked: false
  },
  email: {
    value: 'aarav.sharma@gov.in',
    source: 'Citizen Registration',
    sourceType: 'user_profile',
    confidence: 'Medium',
    verified: true,
    lastVerifiedDate: 'Today',
    locked: false
  },
  address: {
    value: 'Flat 402, Sovereign Heights, Powai',
    source: 'Aadhaar Card Record',
    sourceType: 'vault_credential',
    confidence: 'High',
    verified: true,
    lastVerifiedDate: '18 Aug 2025',
    locked: false
  },
  district: {
    value: 'Mumbai City',
    source: 'Aadhaar Card Record',
    sourceType: 'vault_credential',
    confidence: 'High',
    verified: true,
    lastVerifiedDate: '18 Aug 2025',
    locked: false
  },
  state: {
    value: 'Maharashtra',
    source: 'Aadhaar Card Record',
    sourceType: 'vault_credential',
    confidence: 'High',
    verified: true,
    lastVerifiedDate: '18 Aug 2025',
    locked: false
  },
  pincode: {
    value: '400076',
    source: 'Aadhaar Card Record',
    sourceType: 'vault_credential',
    confidence: 'High',
    verified: true,
    lastVerifiedDate: '18 Aug 2025',
    locked: false
  }
};

/**
 * Universal Form-to-Profile Field Mapping Table
 */
export const FORM_FIELD_MAPPING = {
  fullName: 'name',
  applicantName: 'name',
  candidateName: 'name',
  fatherSpouseName: 'fatherName',
  fatherName: 'fatherName',
  motherName: 'motherName',
  dob: 'dob',
  dateOfBirth: 'dob',
  gender: 'gender',
  mobileNumber: 'mobileNumber',
  phone: 'mobileNumber',
  email: 'email',
  aadhaarNumber: 'aadhaarNumber',
  panNumber: 'panNumber',
  address: 'address',
  residentialAddress: 'address',
  district: 'district',
  state: 'state',
  pincode: 'pincode',
  postalCode: 'pincode'
};
