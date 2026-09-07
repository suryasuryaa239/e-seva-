// Centralized Service Catalog Registry and Fallback Map
// Contains detailed service metadata, SLA, fees, document checklists, and dynamic form fields for all 10 categories.

export const DEFAULT_SERVICES_MAP = {
  // -------------------------------------------------------------
  // 1. AADHAAR SERVICES
  // -------------------------------------------------------------
  'aadhaar-address-update': {
    id: 1,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Aadhaar Address Update',
    slug: 'aadhaar-address-update',
    description: 'Update your residential address in official UIDAI database with valid proof of address.',
    eligibility: 'Aadhaar cardholders relocating or correcting door/street/pincode details.',
    processing_time: '3-5 Working Days',
    fee: 50,
    fields: [
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'new_house_no', label: 'New House / Door / Flat No', type: 'text', placeholder: 'Flat 3B, Sunshine Apartments', required: true },
      { name: 'new_street', label: 'Street / Road Name', type: 'text', placeholder: 'Gandhi Road', required: true },
      { name: 'new_area', label: 'Area / Locality', type: 'text', placeholder: 'Adyar', required: true },
      { name: 'city_town', label: 'City / Town', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'district', label: 'District', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'state', label: 'State', type: 'text', placeholder: 'Tamil Nadu', required: true },
      { name: 'pincode', label: '6-Digit Pincode', type: 'text', placeholder: '600020', required: true },
      { name: 'mobile_number', label: 'Linked Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Proof of Address (PoA)', description: 'Electricity Bill, Bank Passbook, Passport, or Rent Agreement', required: true },
      { name: 'Aadhaar Card Copy', description: 'Copy of existing Aadhaar Card', required: true }
    ]
  },
  'aadhaar-name-update': {
    id: 2,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Aadhaar Name Correction',
    slug: 'aadhaar-name-update',
    description: 'Correction or update of typographical errors in Name as per legal proof document.',
    eligibility: 'Aadhaar holders with valid supporting legal name change documentation.',
    processing_time: '5-7 Working Days',
    fee: 50,
    fields: [
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'current_name', label: 'Current Name in Aadhaar', type: 'text', placeholder: 'Karthik S', required: true },
      { name: 'correct_name', label: 'Correct New Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'reason', label: 'Reason for Name Correction', type: 'select', options: ['Spelling Error', 'Post Marriage Name Change', 'Gazette Name Change'], required: true },
      { name: 'mobile_number', label: 'Linked Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Supporting Identity Proof', description: 'Voter ID, Passport, PAN Card, or Gazette Notification', required: true },
      { name: 'Aadhaar Copy', description: 'Existing Aadhaar Card copy', required: true }
    ]
  },
  'aadhaar-mobile-update': {
    id: 3,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Aadhaar Mobile Number Update',
    slug: 'aadhaar-mobile-update',
    description: 'Update or link active mobile number with Aadhaar for OTP authentication.',
    eligibility: 'All Aadhaar holders needing active mobile OTP verification.',
    processing_time: '24-48 Hours',
    fee: 50,
    fields: [
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'new_mobile', label: 'New Mobile Number to Link', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Aadhaar Card Copy', description: 'Copy of existing Aadhaar Card', required: true }
    ]
  },
  'pvc-aadhaar-card-order': {
    id: 4,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'PVC Aadhaar Card Order',
    slug: 'pvc-aadhaar-card-order',
    description: 'Order durable, waterproof plastic PVC Aadhaar Card delivered to your doorstep.',
    eligibility: 'All registered Aadhaar cardholders.',
    processing_time: '7-10 Working Days',
    fee: 50,
    fields: [
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'delivery_address', label: 'Complete Delivery Address', type: 'textarea', placeholder: 'Door No, Street Name, City, Pincode', required: true },
      { name: 'mobile_number', label: 'Mobile Number for Tracking', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Aadhaar Card Copy', description: 'Copy of existing Aadhaar Card', required: true }
    ]
  },
  'pvc-aadhaar-card': {
    id: 4,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'PVC Aadhaar Card Order',
    slug: 'pvc-aadhaar-card',
    description: 'Order durable, waterproof plastic PVC Aadhaar Card delivered to your doorstep.',
    eligibility: 'All registered Aadhaar cardholders.',
    processing_time: '7-10 Working Days',
    fee: 50,
    fields: [
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'delivery_address', label: 'Complete Delivery Address', type: 'textarea', placeholder: 'Door No, Street Name, City, Pincode', required: true },
      { name: 'mobile_number', label: 'Mobile Number for Tracking', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Aadhaar Card Copy', description: 'Copy of existing Aadhaar Card', required: true }
    ]
  },

  // -------------------------------------------------------------
  // 2. PAN SERVICES
  // -------------------------------------------------------------
  'pan-new-application': {
    id: 5,
    category_name: 'PAN Services',
    category_slug: 'pan-services',
    name: 'New PAN Card Application (Form 49A)',
    slug: 'pan-new-application',
    description: 'Apply for fresh Permanent Account Number (PAN) card for individuals and entities.',
    eligibility: 'Indian citizens and entities requiring PAN for financial & tax purposes.',
    processing_time: '7-10 Working Days',
    fee: 107,
    fields: [
      { name: 'full_name', label: 'Applicant Full Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'father_name', label: 'Father Full Name', type: 'text', placeholder: 'Subramanian S', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], required: true },
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Identity Proof', description: 'Aadhaar Card / Voter ID / Passport', required: true },
      { name: 'Address Proof', description: 'Aadhaar Card / Electricity Bill / Bank Passbook', required: true },
      { name: 'DOB Proof', description: 'Birth Certificate / SSLC Marksheet / Aadhaar Card', required: true }
    ]
  },
  'new-pan-card': {
    id: 5,
    category_name: 'PAN Services',
    category_slug: 'pan-services',
    name: 'New PAN Card Application (Form 49A)',
    slug: 'new-pan-card',
    description: 'Apply for fresh Permanent Account Number (PAN) card for individuals and entities.',
    eligibility: 'Indian citizens and entities requiring PAN for financial & tax purposes.',
    processing_time: '7-10 Working Days',
    fee: 107,
    fields: [
      { name: 'full_name', label: 'Applicant Full Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'father_name', label: 'Father Full Name', type: 'text', placeholder: 'Subramanian S', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], required: true },
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Identity Proof', description: 'Aadhaar Card / Voter ID / Passport', required: true },
      { name: 'Address Proof', description: 'Aadhaar Card / Electricity Bill / Bank Passbook', required: true },
      { name: 'DOB Proof', description: 'Birth Certificate / SSLC Marksheet / Aadhaar Card', required: true }
    ]
  },
  'pan-correction-update': {
    id: 6,
    category_name: 'PAN Services',
    category_slug: 'pan-services',
    name: 'PAN Card Correction / Update',
    slug: 'pan-correction-update',
    description: 'Correct name, father name, date of birth, or signature in existing PAN record.',
    eligibility: 'Existing PAN cardholders requiring demographic or photo corrections.',
    processing_time: '7-10 Working Days',
    fee: 107,
    fields: [
      { name: 'existing_pan', label: 'Existing 10-Digit PAN Number', type: 'text', placeholder: 'ABCDE1234F', required: true },
      { name: 'correct_name', label: 'Correct Applicant Full Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'correct_father_name', label: 'Correct Father Full Name', type: 'text', placeholder: 'Subramanian S', required: true },
      { name: 'correct_dob', label: 'Correct Date of Birth', type: 'date', placeholder: '', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Existing PAN Copy', description: 'Copy of existing PAN Card', required: true },
      { name: 'Proof for Correction', description: 'Aadhaar Card / Passport / Gazette Certificate', required: true }
    ]
  },
  'pan-aadhaar-link': {
    id: 7,
    category_name: 'PAN Services',
    category_slug: 'pan-services',
    name: 'PAN-Aadhaar Linking Assistance',
    slug: 'pan-aadhaar-link',
    description: 'Link your 10-digit PAN with 12-digit Aadhaar number as per Income Tax regulations.',
    eligibility: 'All PAN cardholders whose PAN is not yet linked to Aadhaar.',
    processing_time: '24-48 Hours',
    fee: 50,
    fields: [
      { name: 'pan_number', label: '10-Digit PAN Number', type: 'text', placeholder: 'ABCDE1234F', required: true },
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'name_as_per_aadhaar', label: 'Full Name as per Aadhaar', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'mobile_number', label: 'Linked Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'PAN Copy', description: 'Copy of PAN Card', required: true },
      { name: 'Aadhaar Copy', description: 'Copy of Aadhaar Card', required: true }
    ]
  },

  // -------------------------------------------------------------
  // 3. VOTER ID SERVICES
  // -------------------------------------------------------------
  'voter-form-6': {
    id: 8,
    category_name: 'Voter ID Services',
    category_slug: 'voter-id-services',
    name: 'New Voter Registration (Form 6)',
    slug: 'voter-form-6',
    description: 'Apply for inclusion of name in Electoral Roll and issuance of new EPIC Voter ID Card.',
    eligibility: 'Indian citizens aged 18 years or above.',
    processing_time: '15-25 Working Days',
    fee: 0,
    fields: [
      { name: 'full_name', label: 'Applicant Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'relative_name', label: 'Father / Husband Name', type: 'text', placeholder: 'Subramanian S', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], required: true },
      { name: 'assembly_constituency', label: 'Assembly Constituency', type: 'text', placeholder: 'Mylapore / Velachery', required: true },
      { name: 'address', label: 'Residential Address', type: 'textarea', placeholder: 'Door No, Street, Pincode', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Age Proof', description: 'Birth Certificate / SSLC Marksheet / Aadhaar Card', required: true },
      { name: 'Residence Proof', description: 'Ration Card / Electricity Bill / Bank Passbook', required: true },
      { name: 'Passport Photograph', description: 'Recent color photograph', required: true }
    ]
  },
  'voter-form-8': {
    id: 9,
    category_name: 'Voter ID Services',
    category_slug: 'voter-id-services',
    name: 'Voter ID Correction / Shift (Form 8)',
    slug: 'voter-form-8',
    description: 'Correction of details or shifting of residence within or outside constituency.',
    eligibility: 'Registered voters with existing EPIC Voter Card.',
    processing_time: '10-15 Working Days',
    fee: 0,
    fields: [
      { name: 'epic_number', label: '10-Digit Voter EPIC Number', type: 'text', placeholder: 'ABC1234567', required: true },
      { name: 'applicant_name', label: 'Applicant Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'correction_type', label: 'Type of Correction', type: 'select', options: ['Address Shifting', 'Name Correction', 'DOB Correction', 'Photo Replacement'], required: true },
      { name: 'new_address', label: 'New Residential Address', type: 'textarea', placeholder: 'Door No, Street Name, Pincode', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Existing Voter ID Card', description: 'Copy of Voter EPIC Card', required: true },
      { name: 'Proof for Correction/Shifting', description: 'Aadhaar Card / Rent Agreement / Utility Bill', required: true }
    ]
  },

  // -------------------------------------------------------------
  // 4. CERTIFICATE SERVICES
  // -------------------------------------------------------------
  'income-certificate': {
    id: 10,
    category_name: 'Certificate Services',
    category_slug: 'certificates',
    name: 'Income Certificate Application',
    slug: 'income-certificate',
    description: 'Official revenue certificate certifying total annual family income for education & subsidies.',
    eligibility: 'Permanent state residents seeking income verification for government schemes.',
    processing_time: '7 Working Days',
    fee: 60,
    fields: [
      { name: 'applicant_name', label: 'Applicant Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'father_husband_name', label: 'Father / Husband Name', type: 'text', placeholder: 'Subramanian S', required: true },
      { name: 'annual_income', label: 'Total Family Annual Income (₹)', type: 'number', placeholder: '120000', required: true },
      { name: 'occupation', label: 'Primary Occupation', type: 'text', placeholder: 'Private Job / Agriculture', required: true },
      { name: 'address', label: 'Residential Address', type: 'textarea', placeholder: 'Door No, Street, Village, Pincode', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Applicant Photograph', description: 'Passport photograph', required: true },
      { name: 'Address Proof', description: 'Smart Ration Card / Aadhaar Card', required: true },
      { name: 'Income Proof', description: 'Salary Slip / IT Return / Self Declaration', required: true }
    ]
  },
  'community-certificate': {
    id: 11,
    category_name: 'Certificate Services',
    category_slug: 'certificates',
    name: 'Community / Caste Certificate',
    slug: 'community-certificate',
    description: 'Official revenue certificate confirming caste/community category (BC / MBC / SC / ST).',
    eligibility: 'Citizens seeking quota or reservation benefits for education & government jobs.',
    processing_time: '15 Working Days',
    fee: 60,
    fields: [
      { name: 'applicant_name', label: 'Applicant Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'father_name', label: 'Father Name', type: 'text', placeholder: 'Subramanian S', required: true },
      { name: 'caste_category', label: 'Community Category', type: 'select', options: ['BC', 'MBC', 'SC', 'ST'], required: true },
      { name: 'sub_caste', label: 'Specific Sub-Caste', type: 'text', placeholder: 'Sub-caste name', required: true },
      { name: 'address', label: 'Residential Address', type: 'textarea', placeholder: 'Complete address', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Applicant Photograph', description: 'Passport photo', required: true },
      { name: 'Address Proof', description: 'Ration Card / Aadhaar Card', required: true },
      { name: 'Parent Community Certificate', description: 'Father or Sibling Community Certificate', required: true }
    ]
  },
  'nativity-residence-certificate': {
    id: 12,
    category_name: 'Certificate Services',
    category_slug: 'certificates',
    name: 'Nativity / Residence Certificate',
    slug: 'nativity-residence-certificate',
    description: 'Official document proving continuous residence and state nativity for quota applications.',
    eligibility: 'Residents living in the state for 5+ years.',
    processing_time: '7 Working Days',
    fee: 60,
    fields: [
      { name: 'applicant_name', label: 'Applicant Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'father_name', label: 'Father / Guardian Name', type: 'text', placeholder: 'Subramanian S', required: true },
      { name: 'years_of_residence', label: 'Number of Years Residing', type: 'number', placeholder: '15', required: true },
      { name: 'address', label: 'Complete Residential Address', type: 'textarea', placeholder: 'Address', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Photo & Aadhaar Card', description: 'Applicant photo and Aadhaar copy', required: true },
      { name: 'Proof of Continuous Residence', description: 'Ration Card / Voter ID / 5 Years Property Tax Receipts', required: true }
    ]
  },
  'first-graduate-certificate': {
    id: 13,
    category_name: 'Certificate Services',
    category_slug: 'certificates',
    name: 'First Graduate Certificate',
    slug: 'first-graduate-certificate',
    description: 'Certificate for students who are the first in their family to pursue higher degree education.',
    eligibility: 'Degree admission applicants with no graduate degree holder in immediate family.',
    processing_time: '10 Working Days',
    fee: 60,
    fields: [
      { name: 'student_name', label: 'Student Full Name', type: 'text', placeholder: 'Student Name', required: true },
      { name: 'father_name', label: 'Father Name', type: 'text', placeholder: 'Father Name', required: true },
      { name: 'mother_name', label: 'Mother Name', type: 'text', placeholder: 'Mother Name', required: true },
      { name: 'institution_applied', label: 'College / Institution Name', type: 'text', placeholder: 'Anna University', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Family Smart Ration Card', description: 'Copy of Ration Card showing family members', required: true },
      { name: 'Educational Certificates of Family', description: '10th/12th Marksheets of siblings/parents', required: true },
      { name: 'Joint Self Declaration', description: 'Signed self declaration form', required: true }
    ]
  },
  'legal-heir-certificate': {
    id: 14,
    category_name: 'Certificate Services',
    category_slug: 'certificates',
    name: 'Legal Heir Certificate Application',
    slug: 'legal-heir-certificate',
    description: 'Official revenue document establishing surviving legal heirs following a deceased person.',
    eligibility: 'Immediate family members (Spouse, Children, Parents) of deceased person.',
    processing_time: '15-30 Working Days',
    fee: 60,
    fields: [
      { name: 'deceased_name', label: 'Deceased Person Full Name', type: 'text', placeholder: 'Deceased Name', required: true },
      { name: 'date_of_death', label: 'Date of Death', type: 'date', placeholder: '', required: true },
      { name: 'applicant_relation', label: 'Applicant Relationship with Deceased', type: 'select', options: ['Son', 'Daughter', 'Spouse', 'Mother', 'Father'], required: true },
      { name: 'heirs_count', label: 'Total Number of Legal Heirs', type: 'number', placeholder: '3', required: true },
      { name: 'mobile_number', label: 'Applicant Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Death Certificate', description: 'Official Corporation/Panchayat Death Certificate', required: true },
      { name: 'Aadhaar / ID of All Heirs', description: 'Aadhaar cards of all legal heirs', required: true },
      { name: 'Ration Card of Deceased', description: 'Smart Ration Card copy', required: true }
    ]
  },

  // -------------------------------------------------------------
  // 5. LAND & PATTA SERVICES
  // -------------------------------------------------------------
  'patta-transfer-application': {
    id: 15,
    category_name: 'Land & Patta Services',
    category_slug: 'land-patta-services',
    name: 'Patta / Chitta Name Transfer Application',
    slug: 'patta-transfer-application',
    description: 'Apply for official Patta transfer in revenue land records post property purchase or inheritance.',
    eligibility: 'Registered land buyers or legal heirs following property transfer.',
    processing_time: '15-30 Working Days',
    fee: 100,
    fields: [
      { name: 'buyer_name', label: 'New Owner / Buyer Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'seller_name', label: 'Previous Owner / Seller Name', type: 'text', placeholder: 'Ramesh Kumar', required: true },
      { name: 'survey_number', label: 'Land Survey / Sub-Division Number', type: 'text', placeholder: '123/4A', required: true },
      { name: 'village_taluk', label: 'Village & Taluk Name', type: 'text', placeholder: 'Mylapore Taluk, Chennai', required: true },
      { name: 'district', label: 'District', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'mobile_number', label: 'Applicant Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Registered Sale Deed', description: 'Copy of registered land sale deed', required: true },
      { name: 'Existing Patta / Chitta', description: 'Copy of previous owner Patta', required: true },
      { name: 'Encumbrance Certificate (EC)', description: 'EC certificate for 13+ years', required: true }
    ]
  },
  'chitta-extract-download': {
    id: 16,
    category_name: 'Land & Patta Services',
    category_slug: 'land-patta-services',
    name: 'A-Register & Chitta Extract Copy',
    slug: 'chitta-extract-download',
    description: 'Get officially verified digital extract of A-Register & land ownership Chitta statement.',
    eligibility: 'Landowners needing verified revenue record copies.',
    processing_time: '1-2 Working Days',
    fee: 50,
    fields: [
      { name: 'survey_number', label: 'Survey / Sub-Division Number', type: 'text', placeholder: '123/4A', required: true },
      { name: 'village_taluk', label: 'Village & Taluk Name', type: 'text', placeholder: 'Taluk Name', required: true },
      { name: 'district', label: 'District', type: 'text', placeholder: 'District', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Patta Copy / Property Tax Receipt', description: 'Property ownership proof', required: true }
    ]
  },
  'fmb-sketch-map': {
    id: 17,
    category_name: 'Land & Patta Services',
    category_slug: 'land-patta-services',
    name: 'Field Measurement Book (FMB) Sketch Copy',
    slug: 'fmb-sketch-map',
    description: 'Download field sketch map showing exact boundary measurements for your survey land number.',
    eligibility: 'Plot and land owners requiring boundary measurements.',
    processing_time: '2-3 Working Days',
    fee: 60,
    fields: [
      { name: 'survey_number', label: 'Survey & Sub-Division Number', type: 'text', placeholder: '123/4A', required: true },
      { name: 'taluk_village', label: 'Taluk & Village Name', type: 'text', placeholder: 'Village Name', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Patta Copy', description: 'Copy of Patta document', required: true }
    ]
  },
  'encumbrance-certificate-ec': {
    id: 18,
    category_name: 'Land & Patta Services',
    category_slug: 'land-patta-services',
    name: 'Encumbrance Certificate (EC) Application',
    slug: 'encumbrance-certificate-ec',
    description: 'Obtain certified Encumbrance Certificate verifying historical ownership sales & mortgage encumbrances.',
    eligibility: 'Property buyers and mortgage applicants.',
    processing_time: '3-5 Working Days',
    fee: 120,
    fields: [
      { name: 'survey_number', label: 'Survey / Plot Number', type: 'text', placeholder: 'Plot 42, Survey 123/4', required: true },
      { name: 'search_period', label: 'Search Period (Years)', type: 'select', options: ['10 Years', '15 Years', '30 Years'], required: true },
      { name: 'village_sub_registrar', label: 'Village & Sub-Registrar Office (SRO)', type: 'text', placeholder: 'Mylapore SRO', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Previous Sale Deed Copy', description: 'Registered deed copy', required: true }
    ]
  },

  // -------------------------------------------------------------
  // 6. PASSPORT & TRAVEL SERVICES
  // -------------------------------------------------------------
  'fresh-passport-application': {
    id: 19,
    category_name: 'Passport & Travel',
    category_slug: 'passport-services',
    name: 'New Passport Online Application',
    slug: 'fresh-passport-application',
    description: 'Complete assistance for filing fresh Indian Ordinary Passport application and appointment slot booking.',
    eligibility: 'Indian citizens traveling abroad.',
    processing_time: '15-20 Working Days',
    fee: 1500,
    fields: [
      { name: 'given_name', label: 'Given Name (First & Middle Name)', type: 'text', placeholder: 'Karthik', required: true },
      { name: 'surname', label: 'Surname', type: 'text', placeholder: 'Subramanian', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '', required: true },
      { name: 'place_of_birth', label: 'Place of Birth (City/Village)', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'employment_type', label: 'Employment Category', type: 'select', options: ['Private', 'Government', 'Student', 'Self Employed'], required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'user@example.com', required: true }
    ],
    documents: [
      { name: 'Proof of Date of Birth', description: 'Aadhaar Card / Birth Certificate / SSLC Marksheet', required: true },
      { name: 'Proof of Address', description: 'Aadhaar Card / Voter ID / Bank Passbook / Utility Bill', required: true },
      { name: 'Non-ECR Proof', description: '10th Class SSLC Certificate or higher degree', required: true }
    ]
  },
  'passport-reissue-application': {
    id: 20,
    category_name: 'Passport & Travel',
    category_slug: 'passport-services',
    name: 'Passport Re-Issue / Renewal Application',
    slug: 'passport-reissue-application',
    description: 'Application for passport renewal due to expiry, exhaustion of pages, or damage.',
    eligibility: 'Existing passport holders nearing expiry or page exhaustion.',
    processing_time: '10-15 Working Days',
    fee: 1500,
    fields: [
      { name: 'passport_number', label: 'Existing Passport Number', type: 'text', placeholder: 'Z1234567', required: true },
      { name: 'expiry_date', label: 'Passport Expiry Date', type: 'date', placeholder: '', required: true },
      { name: 'reason_for_reissue', label: 'Reason for Renewal/Re-issue', type: 'select', options: ['Validity Expired / Due to Expire', 'Exhaustion of Pages', 'Lost / Damaged Passport', 'Change in Personal Details'], required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Old Passport Original & Copy', description: 'First & last 2 pages copy', required: true },
      { name: 'Proof of Present Address', description: 'Aadhaar / Bank Passbook / Utility Bill', required: true }
    ]
  },

  // -------------------------------------------------------------
  // 7. DRIVING & VEHICLE SERVICES
  // -------------------------------------------------------------
  'learner-licence-llr-booking': {
    id: 21,
    category_name: 'Vehicle & DL Services',
    category_slug: 'driving-vehicle-services',
    name: 'Learner Licence (LLR) Slot Booking',
    slug: 'learner-licence-llr-booking',
    description: 'Filing application and RTO appointment booking for Learner Driving Licence (LLR).',
    eligibility: 'Citizens aged 16+ for gearless 50cc or 18+ for motorcars & heavy transport.',
    processing_time: '3-5 Working Days',
    fee: 250,
    fields: [
      { name: 'applicant_name', label: 'Applicant Name as per ID', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '', required: true },
      { name: 'vehicle_class', label: 'Vehicle Category', type: 'select', options: ['Motorcycle With Gear (MCWG)', 'Light Motor Vehicle (LMV Car)', 'MCWG + LMV (Both)'], required: true },
      { name: 'rto_office', label: 'Nearest RTO Office', type: 'text', placeholder: 'TN-07 Chennai South', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Age Proof', description: 'Aadhaar / Birth Certificate / Passport', required: true },
      { name: 'Address Proof', description: 'Aadhaar Card / Ration Card / Bank Passbook', required: true },
      { name: 'Medical Certificate (Form 1A)', description: 'Signed medical form if age > 40', required: false }
    ]
  },
  'driving-licence-renewal': {
    id: 22,
    category_name: 'Vehicle & DL Services',
    category_slug: 'driving-vehicle-services',
    name: 'Driving Licence (DL) Renewal',
    slug: 'driving-licence-renewal',
    description: 'Renewal application for expired Driving Licence with RTO desk facilitation.',
    eligibility: 'Driving licence holders nearing expiry or within 1 year post expiry.',
    processing_time: '7-10 Working Days',
    fee: 450,
    fields: [
      { name: 'dl_number', label: '16-Digit DL Number', type: 'text', placeholder: 'TN0720150012345', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Original DL Copy', description: 'Front & back copy of existing DL', required: true },
      { name: 'Address Proof', description: 'Aadhaar Card copy', required: true }
    ]
  },

  // -------------------------------------------------------------
  // 8. BUSINESS & GST SERVICES
  // -------------------------------------------------------------
  'udyam-msme-registration': {
    id: 23,
    category_name: 'Business Services',
    category_slug: 'business-services',
    name: 'Udyam MSME Government Registration',
    slug: 'udyam-msme-registration',
    description: 'Official Ministry of MSME registration certificate for Micro, Small, and Medium Enterprises.',
    eligibility: 'Sole proprietors, partnerships, LLPs, and companies starting business activities.',
    processing_time: '1-2 Working Days',
    fee: 100,
    fields: [
      { name: 'enterprise_name', label: 'Enterprise / Business Name', type: 'text', placeholder: 'Apex Digital Solutions', required: true },
      { name: 'owner_name', label: 'Proprietor / Managing Partner Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'aadhaar_number', label: 'Owner 12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'pan_number', label: 'Business / Owner PAN Number', type: 'text', placeholder: 'ABCDE1234F', required: true },
      { name: 'business_type', label: 'Major Activity', type: 'select', options: ['Services', 'Manufacturing', 'Trading'], required: true },
      { name: 'bank_account', label: 'Bank Account Number & IFSC', type: 'text', placeholder: 'Account Number, HDFC0001234', required: true },
      { name: 'mobile_number', label: 'Mobile Number for OTP', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Aadhaar & PAN Copy', description: 'Proprietor / Partner identity proofs', required: true },
      { name: 'Bank Passbook / Cancelled Cheque', description: 'Business bank account proof', required: true }
    ]
  },
  'gst-registration-application': {
    id: 24,
    category_name: 'Business Services',
    category_slug: 'business-services',
    name: 'GST Registration Application',
    slug: 'gst-registration-application',
    description: 'Apply for 15-digit Goods and Services Tax Identification Number (GSTIN).',
    eligibility: 'Businesses with turnover exceeding threshold or engaging in inter-state e-commerce.',
    processing_time: '3-7 Working Days',
    fee: 500,
    fields: [
      { name: 'business_name', label: 'Trade / Business Name', type: 'text', placeholder: 'Surya Enterprises', required: true },
      { name: 'constitution_type', label: 'Constitution of Business', type: 'select', options: ['Proprietorship', 'Partnership', 'Private Limited', 'LLP'], required: true },
      { name: 'pan_number', label: '10-Digit PAN Number', type: 'text', placeholder: 'ABCDE1234F', required: true },
      { name: 'business_address', label: 'Principal Place of Business Address', type: 'textarea', placeholder: 'Door No, Street, City, Pincode', required: true },
      { name: 'mobile_number', label: 'Authorized Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'PAN & Aadhaar of Proprietor/Partners', description: 'Identity proof documents', required: true },
      { name: 'Business Address Proof', description: 'Electricity Bill / Rental Agreement & NOC', required: true },
      { name: 'Bank Account Statement', description: 'First page of bank passbook or cancelled cheque', required: true }
    ]
  },

  // -------------------------------------------------------------
  // 9. UTILITY SERVICES
  // -------------------------------------------------------------
  'tnegedco-eb-name-transfer': {
    id: 25,
    category_name: 'Utility Services',
    category_slug: 'utility-services',
    name: 'TANGEDCO Electricity (EB) Name Transfer',
    slug: 'tnegedco-eb-name-transfer',
    description: 'Transfer electricity service connection ownership post property purchase or legal inheritance.',
    eligibility: 'Property owners with registered deed in their name.',
    processing_time: '7-10 Working Days',
    fee: 200,
    fields: [
      { name: 'eb_consumer_number', label: 'EB Service Connection Consumer Number', type: 'text', placeholder: '01123456789', required: true },
      { name: 'current_name', label: 'Current Name in EB Card', type: 'text', placeholder: 'Old Owner Name', required: true },
      { name: 'new_owner_name', label: 'New Property Owner Name', type: 'text', placeholder: 'New Owner Name', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Registered Sale Deed Copy', description: 'Property ownership deed', required: true },
      { name: 'Latest EB Bill Paid Receipt', description: 'Current bill clear receipt', required: true },
      { name: 'Aadhaar Card Copy', description: 'New owner Aadhaar card', required: true }
    ]
  },
  'new-electricity-eb-connection': {
    id: 26,
    category_name: 'Utility Services',
    category_slug: 'utility-services',
    name: 'New Electricity (EB) Service Connection',
    slug: 'new-electricity-eb-connection',
    description: 'Application for fresh domestic or commercial power connection.',
    eligibility: 'New building or property owners needing power connection.',
    processing_time: '10-15 Working Days',
    fee: 350,
    fields: [
      { name: 'applicant_name', label: 'Applicant Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'tariff_category', label: 'Tariff Type', type: 'select', options: ['Domestic (Home)', 'Commercial (Shop/Office)', 'Industrial'], required: true },
      { name: 'building_address', label: 'Building Address', type: 'textarea', placeholder: 'Address details', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Property Tax Receipt / Ownership Proof', description: 'Property document copy', required: true },
      { name: 'Aadhaar Card Copy', description: 'Applicant Aadhaar card', required: true }
    ]
  },

  // -------------------------------------------------------------
  // 10. RATION & SMART CARD SERVICES
  // -------------------------------------------------------------
  'smart-ration-card-application': {
    id: 27,
    category_name: 'Other Digital Services',
    category_slug: 'ration-card-services',
    name: 'New Smart Ration Card Application',
    slug: 'smart-ration-card-application',
    description: 'Apply for family Smart Ration Card under Public Distribution System (PDS).',
    eligibility: 'Newly married couples or families residing without an active family ration card.',
    processing_time: '15-30 Working Days',
    fee: 50,
    fields: [
      { name: 'head_family_name', label: 'Head of Family Full Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'father_husband_name', label: 'Father / Husband Name', type: 'text', placeholder: 'Subramanian S', required: true },
      { name: 'members_count', label: 'Total Number of Family Members', type: 'number', placeholder: '4', required: true },
      { name: 'address', label: 'Residential Address', type: 'textarea', placeholder: 'Door No, Street Name, Pincode', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Aadhaar Cards of All Members', description: 'Combined PDF/copies of all family member Aadhaar cards', required: true },
      { name: 'Marriage Certificate / Deletion Certificate', description: 'Proof of deletion from parent ration card', required: true },
      { name: 'Gas Connection Slip / Rental Agreement', description: 'LPG gas cylinder slip or rental contract', required: true }
    ]
  },
  'ration-family-member-add': {
    id: 28,
    category_name: 'Other Digital Services',
    category_slug: 'ration-card-services',
    name: 'Add Family Member to Smart Ration Card',
    slug: 'ration-family-member-add',
    description: 'Inclusion of newborn child or spouse in existing Smart Ration Card.',
    eligibility: 'Existing smart ration cardholders.',
    processing_time: '7-10 Working Days',
    fee: 40,
    fields: [
      { name: 'smart_card_number', label: '12-Digit Smart Ration Card Number', type: 'text', placeholder: '331234567890', required: true },
      { name: 'new_member_name', label: 'New Member Name', type: 'text', placeholder: 'New Member Name', required: true },
      { name: 'relation_to_head', label: 'Relationship with Head of Family', type: 'select', options: ['Wife', 'Son', 'Daughter', 'Mother', 'Father'], required: true },
      { name: 'new_member_dob', label: 'Date of Birth', type: 'date', placeholder: '', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'New Member Aadhaar / Birth Certificate', description: 'Aadhaar copy or Birth Certificate for child', required: true },
      { name: 'Smart Ration Card Copy', description: 'Front & back of existing Smart Card', required: true }
    ]
  }
};

export const TAMIL_SERVICES_TRANSLATIONS = {
  'aadhaar-address-update': {
    name: 'ஆதார் முகவரி மாற்றம்',
    description: 'அதிகாரப்பூர்வ UIDAI தரவுத்தளத்தில் புதிய முகவரி ஆதாரத்துடன் உங்கள் முகவரியைப் புதுப்பிக்கவும்.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '3-5 வேலை நாட்கள்'
  },
  'aadhaar-name-update': {
    name: 'ஆதார் பெயர் திருத்தம்',
    description: 'சட்டப்பூர்வ ஆதாரப் ஆவணத்தின்படி ஆதாரில் உள்ள பெயர் பிழைகளைத் திருத்துதல்.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '5-7 வேலை நாட்கள்'
  },
  'aadhaar-mobile-update': {
    name: 'ஆதார் மொபைல் எண் இணைப்பு',
    description: 'OTP சரிபார்ப்பிற்காக உங்கள் மொபைல் எண்ணை ஆதாரத்துடன் இணைக்கவும் அல்லது புதுப்பிக்கவும்.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '24-48 மணி நேரம்'
  },
  'pvc-aadhaar-card-order': {
    name: 'PVC ஆதார் கார்டு ஆர்டர்',
    description: 'நீடித்து உழைக்கும், நீர்ப்புகா பிளாஸ்டிக் PVC ஆதார் கார்டை உங்கள் வீட்டிற்கே பெற விண்ணப்பிக்கவும்.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்'
  },
  'pvc-aadhaar-card': {
    name: 'PVC ஆதார் கார்டு ஆர்டர்',
    description: 'நீடித்து உழைக்கும், நீர்ப்புகா பிளாஸ்டிக் PVC ஆதார் கார்டை உங்கள் வீட்டிற்கே பெற விண்ணப்பிக்கவும்.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்'
  },
  'pan-new-application': {
    name: 'புதிய PAN கார்டு விண்ணப்பம் (படிவம் 49A)',
    description: 'தனிநபர்கள் மற்றும் நிறுவனங்களுக்கான புதிய நிரந்தர கணக்கு எண் (PAN) கார்டுக்கு விண்ணப்பிக்கவும்.',
    category_name: 'PAN சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்'
  },
  'new-pan-card': {
    name: 'புதிய PAN கார்டு விண்ணப்பம் (படிவம் 49A)',
    description: 'தனிநபர்கள் மற்றும் நிறுவனங்களுக்கான புதிய நிரந்தர கணக்கு எண் (PAN) கார்டுக்கு விண்ணப்பிக்கவும்.',
    category_name: 'PAN சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்'
  },
  'pan-correction-update': {
    name: 'PAN கார்டு திருத்தம் / புதுப்பித்தல்',
    description: 'PAN அட்டையில் பெயர், தந்தை பெயர், பிறந்த தேதி அல்லது புகைப்படப் பிழைகளைத் திருத்துதல்.',
    category_name: 'PAN சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்'
  },
  'pan-aadhaar-link': {
    name: 'PAN - ஆதார் எண் இணைப்பு',
    description: 'வருமான வரி விதிமுறைகளின்படி உங்கள் PAN எண்ணை 12 இலக்க ஆதார் எண்ணுடன் இணைத்தல்.',
    category_name: 'PAN சேவைகள்',
    processing_time: '24-48 மணி நேரம்'
  },
  'voter-form-6': {
    name: 'புதிய வாக்காளர் பதிவு (படிவம் 6)',
    description: 'வாக்காளர் பட்டியலில் பெயர் சேர்த்தல் மற்றும் புதிய EPIC வாக்காளர் அடையாள அட்டை பெற விண்ணப்பித்தல்.',
    category_name: 'வாக்காளர் அடையாள அட்டை சேவைகள்',
    processing_time: '15-25 வேலை நாட்கள்'
  },
  'voter-form-8': {
    name: 'வாக்காளர் அட்டையில் முகவரி மாற்றம் / திருத்தம் (படிவம் 8)',
    description: 'வாக்காளர் அட்டையில் முகவரி மாற்றம் மற்றும் பிற விவரங்களைத் திருத்துதல்.',
    category_name: 'வாக்காளர் அடையாள அட்டை சேவைகள்',
    processing_time: '10-15 வேலை நாட்கள்'
  },
  'income-certificate': {
    name: 'வருமானச் சான்றிதழ் விண்ணப்பம்',
    description: 'கல்வி மற்றும் அரசு நலத்திட்டங்களுக்கான குடும்பத்தின் ஆண்டின் மொத்த வருமானச் சான்றிதழ்.',
    category_name: 'சான்றிதழ் சேவைகள்',
    processing_time: '7 வேலை நாட்கள்'
  },
  'community-certificate': {
    name: 'சாதிச் சான்றிதழ் / சமூகச் சான்றிதழ்',
    description: 'சமூகப் பிரிவு (BC / MBC / SC / ST) சரிபார்ப்புக்கான அதிகாரப்பூர்வ வருவாய்த்துறை சான்றிதழ்.',
    category_name: 'சான்றிதழ் சேவைகள்',
    processing_time: '15 வேலை நாட்கள்'
  },
  'nativity-residence-certificate': {
    name: 'இருப்பிடச் சான்றிதழ் / இருப்பிடச் சான்று',
    description: 'மாநில நிரந்தர இருப்பிடச் சான்று மற்றும் சலுகைகளுக்கான அதிகாரப்பூர்வ சான்றிதழ்.',
    category_name: 'சான்றிதழ் சேவைகள்',
    processing_time: '7 வேலை நாட்கள்'
  },
  'first-graduate-certificate': {
    name: 'முதல் பட்டதாரி சான்றிதழ்',
    description: 'குடும்பத்தில் முதல்முறையாக பட்டம் பயிலும் மாணவர்களுக்கான கட்டணச் சலுகை சான்றிதழ்.',
    category_name: 'சான்றிதழ் சேவைகள்',
    processing_time: '10 வேலை நாட்கள்'
  },
  'legal-heir-certificate': {
    name: 'வாரிசுச் சான்றிதழ் விண்ணப்பம்',
    description: 'இறந்த நபரின் சட்டப்பூர்வ வாரிசுகளை உறுதிப்படுத்தும் அதிகாரப்பூர்வ வருவாய்த்துறை சான்றிதழ்.',
    category_name: 'சான்றிதழ் சேவைகள்',
    processing_time: '15-30 வேலை நாட்கள்'
  },
  'patta-transfer-application': {
    name: 'பட்டா / சிட்டா பெயர் மாற்றம்',
    description: 'நிலம் வாங்கிய பின் அல்லது வாரிசு அடிப்படையில் பட்டாவில் பெயர் மாற்றம் செய்ய விண்ணப்பித்தல்.',
    category_name: 'நிலம் & பட்டா சேவைகள்',
    processing_time: '15-30 வேலை நாட்கள்'
  },
  'chitta-extract-download': {
    name: 'A-பதிவேடு & சிட்டா நகல் பதிவிறக்கம்',
    description: 'நில உரிமையின் அதிகாரப்பூர்வ டிஜிட்டல் சிட்டா மற்றும் A-பதிவேடு நகல் பெறுதல்.',
    category_name: 'நிலம் & பட்டா சேவைகள்',
    processing_time: '1-2 வேலை நாட்கள்'
  },
  'fmb-sketch-map': {
    name: 'FMB வரைபடம் பதிவிறக்கம்',
    description: 'நில எல்லை அளவீடுகளைக் காட்டும் Field Measurement Book (FMB) வரைபட நகல் பெற விண்ணப்பித்தல்.',
    category_name: 'நிலம் & பட்டா சேவைகள்',
    processing_time: '2-3 வேலை நாட்கள்'
  },
  'encumbrance-certificate-ec': {
    name: 'வில்லங்கச் சான்றிதழ் (EC) விண்ணப்பம்',
    description: 'சொத்தின் பரிவர்த்தனை மற்றும் உரிமை வரலாற்றை உறுதிப்படுத்தும் வில்லங்கச் சான்றிதழ் பெறுதல்.',
    category_name: 'நிலம் & பட்டா சேவைகள்',
    processing_time: '3-5 வேலை நாட்கள்'
  },
  'fresh-passport-application': {
    name: 'புதிய பாஸ்போர்ட் விண்ணப்பம்',
    description: 'புதிய இந்திய பாஸ்போர்ட் விண்ணப்பப் பதிவு மற்றும் நேர்காணல் நேரம் முன்பதிவு செய்தல்.',
    category_name: 'பாஸ்போர்ட் சேவைகள்',
    processing_time: '15-20 வேலை நாட்கள்'
  },
  'passport-reissue-application': {
    name: 'பாஸ்போர்ட் புதுப்பித்தல் (Re-Issue)',
    description: 'காலாவதியான அல்லது பக்கங்கள் முடிந்த பாஸ்போர்ட்டை புதுப்பிக்க விண்ணப்பித்தல்.',
    category_name: 'பாஸ்போர்ட் சேவைகள்',
    processing_time: '10-15 வேலை நாட்கள்'
  },
  'learner-licence-llr-booking': {
    name: 'ஓட்டுநர் பழகுநர் உரிமம் (LLR) முன்பதிவு',
    description: 'இருசக்கர மற்றும் நான்கு சக்கர வாகனங்களுக்கான LLR பழகுநர் உரிமம் விண்ணப்பம்.',
    category_name: 'வாகனம் & ஓட்டுநர் உரிம சேவைகள்',
    processing_time: '3-5 வேலை நாட்கள்'
  },
  'driving-licence-renewal': {
    name: 'ஓட்டுநர் உரிமம் (DL) புதுப்பித்தல்',
    description: 'காலாவதியான ஓட்டுநர் உரிமத்தை RTO மூலம் புதுப்பிக்க விண்ணப்பித்தல்.',
    category_name: 'வாகனம் & ஓட்டுநர் உரிம சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்'
  },
  'udyam-msme-registration': {
    name: 'உத்யம் MSME அரசு பதிவு',
    description: 'சிறு, குறு மற்றும் நடுத்தர தொழில்களுக்கான மத்திய அரசின் அதிகாரப்பூர்வ பதிவுச் சான்றிதழ்.',
    category_name: 'வணிகச் சேவைகள்',
    processing_time: '1-2 வேலை நாட்கள்'
  },
  'gst-registration-application': {
    name: 'GST பதிவு விண்ணப்பம்',
    description: 'வணிக நிறுவனங்களுக்கான 15 இலக்க சரக்கு மற்றும் சேவை வரி (GSTIN) பதிவு.',
    category_name: 'வணிகச் சேவைகள்',
    processing_time: '3-7 வேலை நாட்கள்'
  },
  'tnegedco-eb-name-transfer': {
    name: 'மின்சார இணைப்பு (EB) பெயர் மாற்றம்',
    description: 'வீடு அல்லது சொத்து வாங்கிய பின் மின்சார வாரிய (TANGEDCO) இணைப்பில் பெயர் மாற்றம் செய்தல்.',
    category_name: 'பயன்பாட்டுச் சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்'
  },
  'new-electricity-eb-connection': {
    name: 'புதிய மின்சார இணைப்பு (EB) விண்ணப்பம்',
    description: 'புதிய கட்டிடங்கள் மற்றும் வீடுகளுக்கான புதிய மின்சார இணைப்பு பெறுதல்.',
    category_name: 'பயன்பாட்டுச் சேவைகள்',
    processing_time: '10-15 வேலை நாட்கள்'
  },
  'smart-ration-card-application': {
    name: 'புதிய ஸ்மார்ட் ரேஷன் கார்டு விண்ணப்பம்',
    description: 'புதிதாக திருமணமான குடும்பங்களுக்கான புதிய ஸ்மார்ட் ரேஷன் கார்டு விண்ணப்பம்.',
    category_name: 'ரேஷன் கார்டு சேவைகள்',
    processing_time: '15-30 வேலை நாட்கள்'
  },
  'ration-family-member-add': {
    name: 'ரேஷன் கார்டில் குடும்ப உறுப்பினர் சேர்த்தல்',
    description: 'தற்போதுள்ள ஸ்மார்ட் ரேஷன் கார்டில் புதிதாக பிறந்த குழந்தை அல்லது மனைவியின் பெயரைச் சேர்த்தல்.',
    category_name: 'ரேஷன் கார்டு சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்'
  }
};

/**
 * Helper to localize a single service definition
 */
export function getLocalizedService(srv, lang = 'en') {
  if (!srv) return srv;
  if (lang !== 'ta') return srv;

  const key = srv.slug || '';
  const taData = TAMIL_SERVICES_TRANSLATIONS[key];

  if (taData) {
    return {
      ...srv,
      name: taData.name || srv.name,
      description: taData.description || srv.description,
      category_name: taData.category_name || srv.category_name,
      processing_time: taData.processing_time || srv.processing_time
    };
  }

  return srv;
}

/**
 * Helper to retrieve service by ID or Slug with safe fallback and language localization
 */
export function getServiceDefinition(param, lang = 'en') {
  let srv = null;
  if (!param) srv = DEFAULT_SERVICES_MAP['aadhaar-address-update'];
  else {
    const p = String(param).toLowerCase().trim();
    
    if (DEFAULT_SERVICES_MAP[p]) {
      srv = DEFAULT_SERVICES_MAP[p];
    } else {
      const altKey = Object.keys(DEFAULT_SERVICES_MAP).find(key => key.includes(p) || p.includes(key));
      if (altKey) {
        srv = DEFAULT_SERVICES_MAP[altKey];
      } else {
        srv = {
          id: 999,
          category_name: 'Digital E-Service',
          category_slug: 'general-services',
          name: p.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          slug: p,
          description: 'Official digital e-governance service application facilitation desk online.',
          eligibility: 'Resident citizens holding valid identity and address proof documents.',
          processing_time: '3-7 Working Days',
          fee: 60,
          fields: [],
          documents: []
        };
      }
    }
  }

  return getLocalizedService(srv, lang);
}

