/**
 * DigiLocker Official Mock Dataset
 * Real-world representation of documents stored in a citizen's DigiLocker:
 * - Aadhaar Card (UIDAI)
 * - Class X Marksheet (CBSE) [Contains Name Variation for Conflict Testing]
 * - Class XII Certificate (CBSE)
 * - B.Tech Degree (IIT Delhi)
 * - High-Resolution Camera Photo (Oversized 3.2 MB, requires Auto-Fit)
 * - Specimen Signature Scan (Oversized 540 KB, requires Auto-Fit)
 */

export const DIGILOCKER_CLOUD_DOCUMENTS = [
  {
    id: 'dl-doc-1',
    docType: 'id_proof',
    name: 'UIDAI_Aadhaar_eKYC_Aarav.pdf',
    title: 'Aadhaar Card (UIDAI Verified e-KYC)',
    category: 'identity',
    issuer: 'Unique Identification Authority of India (UIDAI)',
    issuerUri: 'in.gov.uidai',
    issueDate: '12 Jan 2022',
    sizeBytes: 420 * 1024,
    sizeFormatted: '420 KB',
    dimensions: 'A4 Standard (210 × 297 mm)',
    pageCount: 1,
    sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    verifiedBadge: 'verified',
    source: 'digilocker',
    isCompliant: true,
    extractedFields: {
      fullName: { value: 'Aarav Sharma', confidence: 0.99, source: 'Aadhaar e-KYC (UIDAI)' },
      aadhaarNumber: { value: 'XXXX-XXXX-4519', confidence: 1.0, source: 'UIDAI Sovereign Vault' },
      dob: { value: '1998-08-14', confidence: 0.99, source: 'UIDAI Date of Birth Record' },
      gender: { value: 'Male', confidence: 1.0, source: 'UIDAI' },
      address: { value: 'Flat 402, Sovereign Heights, Powai, Mumbai - 400076', confidence: 0.98, source: 'UIDAI Resident Record' },
      state: { value: 'Maharashtra', confidence: 0.99, source: 'UIDAI' },
      mobileNumber: { value: '+91 98765 43210', confidence: 0.99, source: 'UIDAI Registered Mobile' }
    }
  },
  {
    id: 'dl-doc-2',
    docType: 'academic_degree',
    name: 'CBSE_Class_X_Marksheet_Aarav.pdf',
    title: 'Class X Secondary School Certificate (CBSE)',
    category: 'education',
    issuer: 'Central Board of Secondary Education (CBSE)',
    issuerUri: 'in.gov.cbse',
    issueDate: '24 May 2014',
    sizeBytes: 890 * 1024,
    sizeFormatted: '890 KB',
    dimensions: 'A4 Standard (210 × 297 mm)',
    pageCount: 1,
    sha256: '4a1b92c830192830192830192830192830192830192830192830192830192830',
    verifiedBadge: 'verified',
    source: 'digilocker',
    isCompliant: true,
    extractedFields: {
      // Intentionally shows middle initial to test the conflict resolver!
      fullName: { value: 'Aarav S. Sharma', confidence: 0.92, source: 'CBSE Matriculation Ledger' },
      rollNo: { value: 'CBSE-2014-99824', confidence: 0.99, source: 'CBSE Roll Register' },
      fatherName: { value: 'Suresh Sharma', confidence: 0.97, source: 'CBSE Certificate' },
      motherName: { value: 'Sunita Sharma', confidence: 0.97, source: 'CBSE Certificate' },
      dob: { value: '1998-08-14', confidence: 0.98, source: 'CBSE School Record' },
      passingYear: { value: '2014', confidence: 1.0, source: 'CBSE' },
      grade: { value: 'CGPA 9.8 / 10.0', confidence: 0.99, source: 'CBSE' }
    }
  },
  {
    id: 'dl-doc-3',
    docType: 'academic_degree',
    name: 'CBSE_Class_XII_Science_Aarav.pdf',
    title: 'Class XII Senior School Certificate (CBSE Science)',
    category: 'education',
    issuer: 'Central Board of Secondary Education (CBSE)',
    issuerUri: 'in.gov.cbse',
    issueDate: '28 May 2016',
    sizeBytes: 940 * 1024,
    sizeFormatted: '940 KB',
    dimensions: 'A4 Standard (210 × 297 mm)',
    pageCount: 1,
    sha256: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
    verifiedBadge: 'verified',
    source: 'digilocker',
    isCompliant: true,
    extractedFields: {
      fullName: { value: 'Aarav Sharma', confidence: 0.98, source: 'CBSE Senior Secondary Register' },
      stream: { value: 'Science (Physics, Chemistry, Maths)', confidence: 0.99, source: 'CBSE' },
      score: { value: '94.6% Aggregate', confidence: 0.99, source: 'CBSE' },
      passingYear: { value: '2016', confidence: 1.0, source: 'CBSE' }
    }
  },
  {
    id: 'dl-doc-4',
    docType: 'academic_degree',
    name: 'IIT_Delhi_BTech_CS_Degree.pdf',
    title: 'B.Tech Degree in Computer Science (IIT Delhi)',
    category: 'education',
    issuer: 'IIT Delhi Academic Council',
    issuerUri: 'ac.in.iitd',
    issueDate: '14 Jun 2020',
    sizeBytes: 1120 * 1024,
    sizeFormatted: '1.1 MB',
    dimensions: 'A4 Standard (210 × 297 mm)',
    pageCount: 1,
    sha256: '9f2c1a7e4b63d08a5c1e97f3b20d46a8e15c7b9023fa64d18e0b5c3a7d92f641',
    verifiedBadge: 'verified',
    source: 'digilocker',
    isCompliant: true,
    extractedFields: {
      fullName: { value: 'Aarav Sharma', confidence: 0.99, source: 'IIT Delhi Council Senate' },
      degree: { value: 'B.Tech in Computer Science', confidence: 1.0, source: 'IIT Delhi' },
      institution: { value: 'IIT Delhi', confidence: 1.0, source: 'IIT Delhi' },
      passingYear: { value: '2020', confidence: 1.0, source: 'IIT Delhi' },
      grade: { value: 'First Class with Distinction', confidence: 0.99, source: 'IIT Delhi' }
    }
  },
  {
    id: 'dl-doc-5',
    docType: 'photo',
    name: 'DigiLocker_Profile_Photo_HighRes.jpg',
    title: 'DigiLocker Stored Profile Photo (Uncompressed Camera Scan)',
    category: 'personal',
    issuer: 'DigiLocker Nagrik Identity Storage',
    issuerUri: 'in.gov.digilocker',
    issueDate: '05 Jan 2026',
    sizeBytes: 3.2 * 1024 * 1024, // 3.2 MB - oversized!
    sizeFormatted: '3.2 MB',
    dimensions: '4032 × 3024 px', // Camera aspect ratio
    pageCount: 1,
    sha256: 'b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5',
    verifiedBadge: 'auto_fitted',
    source: 'digilocker',
    isCompliant: false, // Triggers Auto-Fit!
    complianceViolation: 'Size 3.2 MB exceeds 50 KB portal ceiling; dimensions 4032×3024 px violates 200×230 px',
    autoFitTarget: {
      targetWidth: 200,
      targetHeight: 230,
      targetSize: '34.6 KB',
      targetSizeBytes: 34.6 * 1024,
      targetDimensions: '200 × 230 px',
      targetSha256: 'e83c21a4f0283c79a109823fbc01928409128309182309182039812039812039'
    },
    extractedFields: {
      photoType: { value: 'Passport Style Face Specimen', confidence: 0.96, source: 'DigiLocker Bio-Vault' }
    }
  },
  {
    id: 'dl-doc-6',
    docType: 'signature',
    name: 'DigiLocker_Signature_Specimen.png',
    title: 'Specimen Signature (High-Res Scanner PNG)',
    category: 'personal',
    issuer: 'DigiLocker Self-Attested Repository',
    issuerUri: 'in.gov.digilocker',
    issueDate: '05 Jan 2026',
    sizeBytes: 540 * 1024, // 540 KB - oversized!
    sizeFormatted: '540 KB',
    dimensions: '980 × 420 px', // Violates 140x60
    pageCount: 1,
    sha256: 'c901823049812039812093812093810293810293810928301928301928301928',
    verifiedBadge: 'auto_fitted',
    source: 'digilocker',
    isCompliant: false, // Triggers Auto-Fit!
    complianceViolation: 'Size 540 KB exceeds 20 KB signature ceiling; dimensions 980×420 px violates 140×60 px',
    autoFitTarget: {
      targetWidth: 140,
      targetHeight: 60,
      targetSize: '14.8 KB',
      targetSizeBytes: 14.8 * 1024,
      targetDimensions: '140 × 60 px',
      targetSha256: 'f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2'
    },
    extractedFields: {
      signatureSpecimen: { value: 'Digital Specimen Signature', confidence: 0.95, source: 'DigiLocker Bio-Vault' }
    }
  }
];

/**
 * Merges extracted DigiLocker fields into an authoritative profile object
 */
export function buildProfileFromDigiLockerDocs(docs = DIGILOCKER_CLOUD_DOCUMENTS, preferredName = 'Aarav Sharma') {
  return {
    name: {
      value: preferredName,
      confidence: 0.98,
      source: 'Aadhaar KYC & IIT Delhi Degree (DigiLocker Verified)',
      conflictDetected: true,
      alternatives: [
        { value: 'Aarav Sharma', source: 'Aadhaar e-KYC & IIT Delhi Degree', confidence: 0.98 },
        { value: 'Aarav S. Sharma', source: 'CBSE Class X Secondary Certificate', confidence: 0.92 }
      ],
      lastVerified: 'Just now via DigiLocker National Gateway'
    },
    aadhaarNumber: {
      value: 'XXXX-XXXX-4519',
      confidence: 1.0,
      source: 'UIDAI Aadhaar Verified e-KYC (DigiLocker XML)',
      lastVerified: 'Just now'
    },
    panNumber: {
      value: 'ABCDE1234F',
      confidence: 0.97,
      source: 'Income Tax Department PAN Record (DigiLocker)',
      lastVerified: 'Just now'
    },
    fatherName: {
      value: 'Suresh Sharma',
      confidence: 0.96,
      source: 'CBSE Class X Certificate & PAN Record',
      lastVerified: 'Just now'
    },
    dob: {
      value: '1998-08-14',
      confidence: 0.99,
      source: 'UIDAI Aadhaar Record & CBSE Certificate',
      lastVerified: 'Just now'
    },
    gender: {
      value: 'Male',
      confidence: 1.0,
      source: 'UIDAI Aadhaar e-KYC',
      lastVerified: 'Just now'
    },
    mobileNumber: {
      value: '+91 98765 43210',
      confidence: 0.99,
      source: 'UIDAI Registered Linked Mobile',
      lastVerified: 'Just now'
    },
    email: {
      value: 'aarav.sharma@gov.in',
      confidence: 0.95,
      source: 'DigiLocker Verified Citizen Communication Email',
      lastVerified: 'Just now'
    },
    address: {
      value: 'Flat 402, Sovereign Heights, Powai, Mumbai - 400076',
      confidence: 0.98,
      source: 'UIDAI Aadhaar Verified Resident Address',
      lastVerified: 'Just now'
    },
    state: {
      value: 'Maharashtra',
      confidence: 0.99,
      source: 'UIDAI Resident Registry',
      lastVerified: 'Just now'
    },
    qualification: {
      value: 'B.Tech in Computer Science (IIT Delhi, 2020)',
      confidence: 0.99,
      source: 'IIT Delhi Council Senate (DigiLocker)',
      lastVerified: 'Just now'
    }
  };
}
