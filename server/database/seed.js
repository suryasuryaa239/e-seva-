import { db } from './db.js';

async function seed() {
  console.log('Seeding E-Seva Database for Step 3...');

  // Reset database arrays
  db.data = {
    users: [],
    admins: [],
    categories: [],
    services: [],
    service_fields: [],
    service_documents: [],
    applications: [],
    application_history: [],
    payments: [],
    contact_messages: [],
    career_applications: [],
    faqs: [],
    site_settings: []
  };

  // 1. SEED DEFAULT USERS & ADMINS
  const adminUser = await db.insert('admins', {
    id: 1,
    name: 'Super Admin',
    email: 'admin@eseva.gov.in',
    password: db.hashPassword('AdminSecret123'),
    role: 'SUPER_ADMIN'
  });

  const normalUser = await db.insert('users', {
    id: 1,
    name: 'Karthik Subramanian',
    email: 'user@eseva.gov.in',
    phone: '9876543210',
    password: db.hashPassword('Password123')
  });

  // 2. SEED CATEGORIES (8 Primary Department Groups)
  const categoriesData = [
    { id: 1, name: 'Aadhaar Services', slug: 'aadhaar-services', description: 'Assistance for new enrollment, address updates, name corrections, mobile linking, PVC order, and download.', icon: 'Fingerprint', display_order: 1 },
    { id: 2, name: 'PAN Services', slug: 'pan-services', description: 'New PAN Card (Form 49A/49AA), correction in existing PAN, e-PAN download, and PAN-Aadhaar linking assistance.', icon: 'CreditCard', display_order: 2 },
    { id: 3, name: 'Voter ID Services', slug: 'voter-id-services', description: 'New voter registration (Form 6), address shift (Form 8), epic download, and corrections.', icon: 'Vote', display_order: 3 },
    { id: 4, name: 'Certificate Services', slug: 'certificates', description: 'Income, Community, Nativity, Residence, First Graduate, and Legal Heir revenue certificates.', icon: 'FileText', display_order: 4 },
    { id: 5, name: 'Land & Patta Services', slug: 'land-patta-services', description: 'Patta/Chitta extraction, Patta transfer, Adangal records, and land document verification assistance.', icon: 'MapPin', display_order: 5 },
    { id: 6, name: 'Passport & Travel', slug: 'passport-services', description: 'Fresh passport filing, re-issue, correction, and appointment slot booking assistance.', icon: 'Globe', display_order: 6 },
    { id: 7, name: 'Vehicle & DL Services', slug: 'driving-vehicle-services', description: 'Learner Licence (LLR), Driving Licence renewal, duplicate DL, RC transfer, and FASTag assistance.', icon: 'Car', display_order: 7 },
    { id: 8, name: 'Business Services', slug: 'business-services', description: 'Udyam MSME registration, FSSAI Food licence, GST filing, and business documentation.', icon: 'Briefcase', display_order: 8 },
    { id: 9, name: 'Utility Services', slug: 'utility-services', description: 'Electricity EB new connection application, bill payment assistance, and utility services.', icon: 'Zap', display_order: 9 },
    { id: 10, name: 'Other Digital Services', slug: 'other-services', description: 'General e-Governance digital assistance, pension filing, and citizen services.', icon: 'Grid', display_order: 10 }
  ];

  for (const cat of categoriesData) {
    await db.insert('categories', cat);
  }

  // 3. SEED 15 DETAILED AADHAAR SERVICES WITH FIELDS & DOCUMENTS
  const aadhaarServices = [
    {
      id: 1,
      category_id: 1,
      category_name: 'Aadhaar Services',
      category_slug: 'aadhaar-services',
      name: 'New Aadhaar Enrollment Booking',
      slug: 'new-aadhaar-enrollment',
      description: 'Book appointment slot and file initial pre-enrollment for new Aadhaar issuance for adults and children.',
      eligibility: 'Resident Indians, NRIs, and infants who do not possess a 12-digit Aadhaar number.',
      instructions: 'Ensure full name matches official proof of identity. Bring original documents to the appointment center.',
      fee: 0,
      processing_time: '3-5 Working Days for Slot',
      is_active: true,
      fields: [
        { name: 'full_name', label: 'Applicant Full Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
        { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '', required: true },
        { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], required: true },
        { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true },
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'karthik@example.com', required: false },
        { name: 'guardian_name', label: 'Father / Mother / Guardian Name', type: 'text', placeholder: 'Subramanian S', required: true },
        { name: 'address', label: 'Full Residential Address', type: 'textarea', placeholder: 'Door No, Street Name, Landmark', required: true },
        { name: 'district', label: 'District', type: 'text', placeholder: 'Chennai', required: true },
        { name: 'state', label: 'State', type: 'text', placeholder: 'Tamil Nadu', required: true },
        { name: 'pincode', label: 'Pincode', type: 'text', placeholder: '600001', required: true }
      ],
      documents: [
        { name: 'Proof of Identity (POI)', description: 'Passport / Voter ID / PAN Card / Driving Licence', required: true },
        { name: 'Proof of Address (POA)', description: 'Ration Card / Electricity Bill / Bank Passbook / Passport', required: true },
        { name: 'Proof of Date of Birth (DOB)', description: 'Birth Certificate / SSLC Marksheet / Passport', required: true },
        { name: 'Photograph', description: 'Recent passport size photo of the applicant', required: true }
      ]
    },
    {
      id: 2,
      category_id: 1,
      category_name: 'Aadhaar Services',
      category_slug: 'aadhaar-services',
      name: 'Aadhaar Name Update',
      slug: 'aadhaar-name-update',
      description: 'Correction or update of typographical errors in Name as per legal marriage certificate or GAZETTE notification.',
      eligibility: 'Aadhaar holders with valid supporting legal name change documentation.',
      instructions: 'Max 2 name updates allowed in lifetime as per UIDAI rules. Supporting proof must match new name exactly.',
      fee: 50,
      processing_time: '5-7 Working Days',
      is_active: true,
      fields: [
        { name: 'current_aadhaar_name', label: 'Current Name in Aadhaar', type: 'text', placeholder: 'Karthik S', required: true },
        { name: 'new_name', label: 'Correct New Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
        { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
        { name: 'mobile_number', label: 'Linked Mobile Number', type: 'phone', placeholder: '9876543210', required: true },
        { name: 'reason_for_change', label: 'Reason for Name Change', type: 'select', options: ['Spelling Correction', 'Post Marriage Name Change', 'Gazette Name Change'], required: true }
      ],
      documents: [
        { name: 'Current Aadhaar Copy', description: 'Clear PDF/Image of front and back of Aadhaar', required: true },
        { name: 'Supporting Name Proof', description: 'Marriage Certificate / Gazette Notification / Passport / Voter Card', required: true }
      ]
    },
    {
      id: 3,
      category_id: 1,
      category_name: 'Aadhaar Services',
      category_slug: 'aadhaar-services',
      name: 'Aadhaar Address Update',
      slug: 'aadhaar-address-update',
      description: 'Update your residential address in official UIDAI database with valid proof of address.',
      eligibility: 'Aadhaar cardholders relocating or correcting door/street/pincode details.',
      instructions: 'Address proof document must carry the applicant name and new address clearly.',
      fee: 50,
      processing_time: '3-5 Working Days',
      is_active: true,
      fields: [
        { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
        { name: 'current_address', label: 'Current Old Address in Aadhaar', type: 'textarea', placeholder: 'Old Door No, Street, City', required: true },
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
        { name: 'Valid Proof of Address (POA)', description: 'Electricity Bill / Water Bill / Gas Connection / Bank Passbook / Passport / Rental Agreement', required: true },
        { name: 'Aadhaar Card Copy', description: 'Copy of existing Aadhaar Card', required: true }
      ]
    },
    {
      id: 4,
      category_id: 1,
      category_name: 'Aadhaar Services',
      category_slug: 'aadhaar-services',
      name: 'Aadhaar Mobile Number Update',
      slug: 'aadhaar-mobile-update',
      description: 'Update or link new active mobile number with Aadhaar for OTP authentication and online services.',
      eligibility: 'All Aadhaar holders needing active mobile OTP verification.',
      instructions: 'Active mobile number required for OTP verification during processing.',
      fee: 50,
      processing_time: '24-48 Hours',
      is_active: true,
      fields: [
        { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
        { name: 'current_mobile', label: 'Previous / Existing Mobile (If any)', type: 'phone', placeholder: '9876543210', required: false },
        { name: 'new_mobile', label: 'New Active Mobile Number to Link', type: 'phone', placeholder: '9988776655', required: true }
      ],
      documents: [
        { name: 'Aadhaar Card Copy', description: 'Existing Aadhaar Card copy', required: true }
      ]
    },
    {
      id: 5,
      category_id: 1,
      category_name: 'Aadhaar Services',
      category_slug: 'aadhaar-services',
      name: 'Aadhaar Email Update',
      slug: 'aadhaar-email-update',
      description: 'Link or update official email address with Aadhaar for e-notifications and digital signature services.',
      eligibility: 'Aadhaar holders wanting digital email alert subscription.',
      instructions: 'Ensure email address is active to receive confirmation link.',
      fee: 50,
      processing_time: '24-48 Hours',
      is_active: true,
      fields: [
        { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
        { name: 'new_email', label: 'New Email Address to Link', type: 'email', placeholder: 'user@example.com', required: true },
        { name: 'mobile_number', label: 'Active Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
      ],
      documents: [
        { name: 'Aadhaar Card Copy', description: 'Aadhaar Card copy', required: true }
      ]
    },
    {
      id: 6,
      category_id: 1,
      category_name: 'Aadhaar Services',
      category_slug: 'aadhaar-services',
      name: 'Aadhaar Date of Birth Update',
      slug: 'aadhaar-dob-update',
      description: 'Correct Date of Birth record in Aadhaar with verified government birth proof.',
      eligibility: 'Aadhaar holders with verified DOB proof (Only 1 DOB correction permitted per UIDAI rules).',
      instructions: 'DOB proof must contain exact date, month, and year.',
      fee: 50,
      processing_time: '5-7 Working Days',
      is_active: true,
      fields: [
        { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
        { name: 'current_dob', label: 'Current Date of Birth in Aadhaar', type: 'date', placeholder: '', required: true },
        { name: 'correct_dob', label: 'Correct Date of Birth', type: 'date', placeholder: '', required: true },
        { name: 'reason', label: 'Reason for DOB Correction', type: 'textarea', placeholder: 'Typographical error in original enrollment', required: true }
      ],
      documents: [
        { name: 'Aadhaar Card Copy', description: 'Existing Aadhaar card', required: true },
        { name: 'Valid DOB Proof', description: 'Birth Certificate / SSLC Marksheet / Passport', required: true }
      ]
    },
    {
      id: 7,
      category_id: 1,
      category_name: 'Aadhaar Services',
      category_slug: 'aadhaar-services',
      name: 'Aadhaar Gender Update',
      slug: 'aadhaar-gender-update',
      description: 'Correct gender field in Aadhaar record.',
      eligibility: 'Aadhaar cardholders correcting gender assignment error.',
      instructions: 'Only 1 gender correction permitted in lifetime as per UIDAI guidelines.',
      fee: 50,
      processing_time: '3-5 Working Days',
      is_active: true,
      fields: [
        { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
        { name: 'current_gender', label: 'Current Gender in Aadhaar', type: 'select', options: ['Male', 'Female', 'Transgender'], required: true },
        { name: 'correct_gender', label: 'Correct Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], required: true }
      ],
      documents: [
        { name: 'Aadhaar Card Copy', description: 'Existing Aadhaar card copy', required: true }
      ]
    },
    {
      id: 8,
      category_id: 1,
      category_name: 'Aadhaar Services',
      category_slug: 'aadhaar-services',
      name: 'Aadhaar Photo Update',
      slug: 'aadhaar-photo-update',
      description: 'Assistance for updating photo biometric record in Aadhaar database.',
      eligibility: 'Aadhaar holders needing photo refresh or child-to-adult biometric updates.',
      instructions: 'Physical photo capturing at nearest authorized Kendra required after appointment booking.',
      fee: 100,
      processing_time: '5-7 Working Days',
      is_active: true,
      fields: [
        { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
        { name: 'applicant_name', label: 'Full Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
        { name: 'mobile_number', label: 'Active Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
      ],
      documents: [
        { name: 'Aadhaar Card Copy', description: 'Existing Aadhaar card copy', required: true },
        { name: 'Recent Passport Photo', description: 'Recent high-resolution passport size photo', required: true }
      ]
    },
    {
      id: 9,
      category_id: 1,
      category_name: 'Aadhaar Services',
      category_slug: 'aadhaar-services',
      name: 'Aadhaar Biometric Update',
      slug: 'aadhaar-biometric-update',
      description: 'Mandatory adult biometric update (fingerprints & iris) for 5 and 15 year age milestones.',
      eligibility: 'Children reaching age 5 or 15, or adults with biometric authentication issues.',
      instructions: 'Biometric updates are mandatory for children reaching 5 and 15 years.',
      fee: 100,
      processing_time: '5-7 Working Days',
      is_active: true,
      fields: [
        { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
        { name: 'applicant_name', label: 'Full Name', type: 'text', placeholder: 'Applicant Name', required: true },
        { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '', required: true },
        { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
      ],
      documents: [
        { name: 'Aadhaar Card Copy', description: 'Existing Aadhaar card', required: true }
      ]
    },
    {
      id: 10,
      category_id: 1,
      category_name: 'Aadhaar Services',
      category_slug: 'aadhaar-services',
      name: 'Aadhaar Document Update',
      slug: 'aadhaar-document-update',
      description: 'Re-validation of Identity & Address documents for Aadhaar issued more than 10 years ago.',
      eligibility: 'Aadhaar holders whose enrollment is over 10 years old (UIDAI free re-validation drive).',
      instructions: 'Re-validating documents strengthens fraud prevention and speeds up bank KYC.',
      fee: 50,
      processing_time: '3-5 Working Days',
      is_active: true,
      fields: [
        { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
        { name: 'applicant_name', label: 'Full Name as per Aadhaar', type: 'text', placeholder: 'Applicant Name', required: true },
        { name: 'mobile_number', label: 'Linked Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
      ],
      documents: [
        { name: 'Proof of Identity (POI)', description: 'Voter ID / PAN Card / Passport / Driving Licence', required: true },
        { name: 'Proof of Address (POA)', description: 'Electricity Bill / Ration Card / Bank Passbook / Passport', required: true }
      ]
    },
    {
      id: 11,
      category_id: 1,
      category_name: 'Aadhaar Services',
      category_slug: 'aadhaar-services',
      name: 'Aadhaar Download Assistance',
      slug: 'aadhaar-download',
      description: 'Assistance for downloading official password-protected digital e-Aadhaar PDF copy.',
      eligibility: 'Aadhaar cardholders with active mobile OTP access.',
      instructions: 'Digital e-Aadhaar is legally valid under Information Technology Act, 2000.',
      fee: 30,
      processing_time: 'Instant / 1 Hour',
      is_active: true,
      fields: [
        { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
        { name: 'applicant_name', label: 'Full Name as in Aadhaar', type: 'text', placeholder: 'Applicant Name', required: true },
        { name: 'mobile_number', label: 'Mobile Number for OTP', type: 'phone', placeholder: '9876543210', required: true },
        { name: 'email', label: 'Email for PDF Delivery', type: 'email', placeholder: 'user@example.com', required: true }
      ],
      documents: [
        { name: 'Identity Proof Verification', description: 'Self-declaration identity verification document', required: true }
      ]
    },
    {
      id: 12,
      category_id: 1,
      category_name: 'Aadhaar Services',
      category_slug: 'aadhaar-services',
      name: 'PVC Aadhaar Card Order',
      slug: 'pvc-aadhaar-card',
      description: 'Order durable, waterproof plastic PVC Aadhaar Card with microtext, ghost image, and QR code delivered to doorstep.',
      eligibility: 'All valid Aadhaar cardholders.',
      instructions: 'PVC Card will be dispatched via India Post Speed Post to residential address.',
      fee: 50,
      processing_time: '7-10 Working Days',
      is_active: true,
      fields: [
        { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
        { name: 'applicant_name', label: 'Applicant Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
        { name: 'mobile_number', label: 'Mobile Number for Tracking', type: 'phone', placeholder: '9876543210', required: true },
        { name: 'delivery_address', label: 'Complete Delivery Address', type: 'textarea', placeholder: 'Door No, Street Name, Area', required: true },
        { name: 'district', label: 'District', type: 'text', placeholder: 'Chennai', required: true },
        { name: 'state', label: 'State', type: 'text', placeholder: 'Tamil Nadu', required: true },
        { name: 'pincode', label: '6-Digit Pincode', type: 'text', placeholder: '600001', required: true }
      ],
      documents: [
        { name: 'Aadhaar Card Copy', description: 'Existing Aadhaar card copy', required: true }
      ]
    },
    {
      id: 13,
      category_id: 1,
      category_name: 'Aadhaar Services',
      category_slug: 'aadhaar-services',
      name: 'Aadhaar Application Status Check',
      slug: 'aadhaar-status-check',
      description: 'Check generation and dispatch status of Enrolment (EID) or Update Request Number (URN).',
      eligibility: 'Applicants who have filed Aadhaar enrolment or update request.',
      instructions: 'Enter 14-digit EID/URN number along with timestamp.',
      fee: 0,
      processing_time: 'Instant Status Query',
      is_active: true,
      fields: [
        { name: 'urn_eid_number', label: 'URN / Enrolment ID (EID) Number', type: 'text', placeholder: '28-Digit EID or 14-Digit URN', required: true },
        { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
      ],
      documents: []
    },
    {
      id: 14,
      category_id: 1,
      category_name: 'Aadhaar Services',
      category_slug: 'aadhaar-services',
      name: 'Aadhaar Correction Assistance',
      slug: 'aadhaar-correction-assistance',
      description: 'Comprehensive guided assistance for multiple field corrections (Name, Address, DOB, Gender, Mobile, Email).',
      eligibility: 'Applicants requiring multi-field correction assistance.',
      instructions: 'Select all parameters requiring correction to generate customized document checklist.',
      fee: 75,
      processing_time: '5-7 Working Days',
      is_active: true,
      fields: [
        { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
        { name: 'correction_types', label: 'Select Fields Requiring Correction', type: 'select', options: ['Name & Address', 'DOB & Mobile', 'Gender & Email', 'Multi-Field Overhaul'], required: true },
        { name: 'details_explanation', label: 'Describe Required Corrections in Detail', type: 'textarea', placeholder: 'Please explain exact corrections needed...', required: true },
        { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
      ],
      documents: [
        { name: 'Existing Aadhaar Copy', description: 'Copy of existing Aadhaar Card', required: true },
        { name: 'Combined Proof Documents', description: 'Supporting legal proof documents for selected fields', required: true }
      ]
    },
    {
      id: 15,
      category_id: 1,
      category_name: 'Aadhaar Services',
      category_slug: 'aadhaar-services',
      name: 'Aadhaar-PAN Linking Assistance',
      slug: 'aadhaar-pan-linking',
      description: 'Assistance for linking 12-digit Aadhaar number with 10-digit Income Tax Permanent Account Number (PAN).',
      eligibility: 'All PAN cardholders whose PAN is not linked with Aadhaar as per CBDT regulations.',
      instructions: 'Demographic details (Name, DOB, Gender) must match on both PAN and Aadhaar records.',
      fee: 50,
      processing_time: '24-72 Hours',
      is_active: true,
      fields: [
        { name: 'pan_number', label: '10-Digit PAN Number', type: 'text', placeholder: 'ABCDE1234F', required: true },
        { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
        { name: 'applicant_name', label: 'Name as per Aadhaar', type: 'text', placeholder: 'Karthik Subramanian', required: true },
        { name: 'mobile_number', label: 'Active Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
      ],
      documents: [
        { name: 'PAN Card Copy', description: 'Clear copy of PAN Card', required: true },
        { name: 'Aadhaar Card Copy', description: 'Clear copy of Aadhaar Card', required: true }
      ]
    }
  ];

  // 4. OTHER CATEGORY SERVICES (PAN, Voter, Certificates, Land, Passport, Vehicle, Business, Utility)
  const otherServices = [
    {
      id: 16,
      category_id: 2,
      category_name: 'PAN Services',
      category_slug: 'pan-services',
      name: 'New PAN Card Application (Form 49A)',
      slug: 'new-pan-card',
      description: 'Apply for fresh Permanent Account Number (PAN) card for Indian citizens and entities.',
      eligibility: 'Indian citizens, HUFs, companies, or trusts without an existing PAN.',
      instructions: 'Signature / thumb impression required on application form.',
      fee: 107,
      processing_time: '7-10 Working Days',
      is_active: true,
      fields: [
        { name: 'applicant_type', label: 'Applicant Category', type: 'select', options: ['Individual', 'HUF', 'Firm', 'Company'], required: true },
        { name: 'full_name', label: 'Full Name as in Proof Document', type: 'text', placeholder: 'Karthik Subramanian', required: true },
        { name: 'father_name', label: 'Father Full Name', type: 'text', placeholder: 'Subramanian S', required: true },
        { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '', required: true },
        { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true },
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'user@example.com', required: true },
        { name: 'address', label: 'Residential Address', type: 'textarea', placeholder: 'Complete address', required: true }
      ],
      documents: [
        { name: 'Identity Proof', description: 'Aadhaar Card / Voter ID / Passport', required: true },
        { name: 'Address Proof', description: 'Aadhaar / Bank Passbook / Utility Bill', required: true },
        { name: 'Date of Birth Proof', description: 'Birth Certificate / SSLC Marksheet / Aadhaar', required: true },
        { name: 'Passport Photograph', description: '2 recent passport size photos', required: true }
      ]
    },
    {
      id: 17,
      category_id: 2,
      category_name: 'PAN Services',
      category_slug: 'pan-services',
      name: 'PAN Card Correction / Update',
      slug: 'pan-card-correction',
      description: 'Correct typographical errors in Name, Father Name, Date of Birth, or Photo in existing PAN.',
      eligibility: 'Existing PAN cardholders requiring demographic or photo corrections.',
      instructions: 'Provide valid supporting document for changed parameters.',
      fee: 107,
      processing_time: '7-10 Working Days',
      is_active: true,
      fields: [
        { name: 'existing_pan', label: 'Existing 10-Digit PAN Number', type: 'text', placeholder: 'ABCDE1234F', required: true },
        { name: 'correct_name', label: 'Correct Full Name', type: 'text', placeholder: 'Correct Name', required: true },
        { name: 'correct_father_name', label: 'Correct Father Name', type: 'text', placeholder: 'Father Name', required: true },
        { name: 'correct_dob', label: 'Correct Date of Birth', type: 'date', placeholder: '', required: true },
        { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
      ],
      documents: [
        { name: 'Existing PAN Copy', description: 'Copy of PAN card or allocation letter', required: true },
        { name: 'Supporting Proof Document', description: 'Aadhaar Card / Passport / Gazette Certificate', required: true }
      ]
    },
    {
      id: 18,
      category_id: 3,
      category_name: 'Voter ID Services',
      category_slug: 'voter-id-services',
      name: 'New Voter Registration (Form 6)',
      slug: 'new-voter-registration',
      description: 'Apply for inclusion of name in Electoral Roll and issuance of new EPIC Voter ID Card.',
      eligibility: 'Indian citizens aged 18 years or above on the qualifying date.',
      instructions: 'Must be a ordinary resident of the assembly constituency applied for.',
      fee: 0,
      processing_time: '15-30 Days',
      is_active: true,
      fields: [
        { name: 'full_name', label: 'Applicant Name', type: 'text', placeholder: 'Full Name', required: true },
        { name: 'relative_name', label: 'Father / Mother / Husband Name', type: 'text', placeholder: 'Relative Name', required: true },
        { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '', required: true },
        { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], required: true },
        { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true },
        { name: 'assembly_constituency', label: 'Assembly Constituency Name', type: 'text', placeholder: 'Constituency Name', required: true },
        { name: 'address', label: 'Residential Address', type: 'textarea', placeholder: 'Door No, Street Name', required: true }
      ],
      documents: [
        { name: 'Proof of Age', description: 'Aadhaar / Birth Certificate / Marksheet', required: true },
        { name: 'Proof of Ordinary Residence', description: 'Ration Card / Electricity Bill / Bank Passbook', required: true },
        { name: 'Photograph', description: 'Recent passport photo', required: true }
      ]
    },
    {
      id: 19,
      category_id: 4,
      category_name: 'Certificate Services',
      category_slug: 'certificates',
      name: 'Income Certificate Application',
      slug: 'income-certificate',
      description: 'Official revenue certificate declaring total family annual income for scholarship and welfare schemes.',
      eligibility: 'Residents of the state seeking income verification.',
      instructions: 'Provide salary slip or employer certificate if employed in formal sector.',
      fee: 60,
      processing_time: '7 Working Days',
      is_active: true,
      fields: [
        { name: 'applicant_name', label: 'Applicant Name', type: 'text', placeholder: 'Full Name', required: true },
        { name: 'father_husband_name', label: 'Father / Husband Name', type: 'text', placeholder: 'Name', required: true },
        { name: 'annual_income', label: 'Total Family Annual Income (₹)', type: 'number', placeholder: '120000', required: true },
        { name: 'occupation', label: 'Primary Occupation', type: 'text', placeholder: 'Agriculture / Private Job', required: true },
        { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true },
        { name: 'address', label: 'Residential Address', type: 'textarea', placeholder: 'Address', required: true }
      ],
      documents: [
        { name: 'Applicant Photo', description: 'Passport photograph', required: true },
        { name: 'Address Proof', description: 'Ration Card / Smart Card / Aadhaar', required: true },
        { name: 'Income Proof', description: 'Salary Slip / IT Return / Self Declaration', required: true }
      ]
    },
    {
      id: 20,
      category_id: 4,
      category_name: 'Certificate Services',
      category_slug: 'certificates',
      name: 'Community / Caste Certificate',
      slug: 'community-certificate',
      description: 'Official revenue certificate confirming caste/community category (BC / MBC / SC / ST).',
      eligibility: 'Citizens seeking reservation or educational quota benefits.',
      instructions: 'Attach parent community certificate copy for faster verification.',
      fee: 60,
      processing_time: '15 Working Days',
      is_active: true,
      fields: [
        { name: 'applicant_name', label: 'Applicant Name', type: 'text', placeholder: 'Full Name', required: true },
        { name: 'father_name', label: 'Father Name', type: 'text', placeholder: 'Father Name', required: true },
        { name: 'caste_category', label: 'Caste / Community Category', type: 'select', options: ['BC', 'MBC', 'SC', 'ST'], required: true },
        { name: 'sub_caste', label: 'Specific Sub-Caste Name', type: 'text', placeholder: 'Sub-caste name', required: true },
        { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
      ],
      documents: [
        { name: 'Applicant Photo', description: 'Passport photograph', required: true },
        { name: 'Proof of Address', description: 'Ration Card / Aadhaar Card', required: true },
        { name: 'Parent Community Certificate', description: 'Father or Sibling Community Certificate', required: true }
      ]
    },
    {
      id: 21,
      category_id: 5,
      category_name: 'Land & Patta Services',
      category_slug: 'land-patta-services',
      name: 'Patta Transfer Application',
      slug: 'patta-transfer',
      description: 'Transfer land revenue ownership title (Patta) following sale deed registration or inheritance.',
      eligibility: 'Registered land buyers or legal heirs following property transfer.',
      instructions: 'Attach copy of registered sale deed or partition deed.',
      fee: 100,
      processing_time: '30 Working Days',
      is_active: true,
      fields: [
        { name: 'buyer_name', label: 'New Owner / Buyer Name', type: 'text', placeholder: 'Owner Name', required: true },
        { name: 'seller_name', label: 'Previous Owner / Seller Name', type: 'text', placeholder: 'Previous Owner', required: true },
        { name: 'survey_number', label: 'Land Survey / Sub-Division Number', type: 'text', placeholder: '123/4A', required: true },
        { name: 'village_taluk', label: 'Village & Taluk Name', type: 'text', placeholder: 'Taluk Name', required: true },
        { name: 'district', label: 'District', type: 'text', placeholder: 'District', required: true },
        { name: 'mobile_number', label: 'Applicant Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
      ],
      documents: [
        { name: 'Registered Sale Deed Document', description: 'Copy of registered land sale deed', required: true },
        { name: 'Existing Patta Copy', description: 'Copy of previous owner Patta / Chitta', required: true },
        { name: 'Encumbrance Certificate (EC)', description: 'EC certificate for 13+ years', required: true }
      ]
    },
    {
      id: 22,
      category_id: 6,
      category_name: 'Passport & Travel',
      category_slug: 'passport-services',
      name: 'New Passport Online Application',
      slug: 'new-passport-application',
      description: 'Complete assistance for filing fresh Indian Ordinary Passport application and appointment slot booking.',
      eligibility: 'Indian citizens traveling abroad.',
      instructions: 'Original documents must be presented at Passport Seva Kendra (PSK) appointment.',
      fee: 1500,
      processing_time: '15-20 Days',
      is_active: true,
      fields: [
        { name: 'full_name', label: 'Given Name (First & Middle Name)', type: 'text', placeholder: 'Karthik', required: true },
        { name: 'surname', label: 'Surname', type: 'text', placeholder: 'Subramanian', required: true },
        { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '', required: true },
        { name: 'place_of_birth', label: 'Place of Birth (Village/City)', type: 'text', placeholder: 'Chennai', required: true },
        { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true },
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'user@example.com', required: true }
      ],
      documents: [
        { name: 'Proof of Date of Birth', description: 'Aadhaar Card / Birth Certificate / Marksheet', required: true },
        { name: 'Proof of Address', description: 'Aadhaar / Voter ID / Bank Passbook / Electricity Bill', required: true },
        { name: 'Non-ECR Proof', description: 'SSLC / 10th Pass Certificate or higher degree', required: true }
      ]
    }
  ];

  // Insert all services
  const allServices = [...aadhaarServices, ...otherServices];
  for (const srv of allServices) {
    const insertedService = await db.insert('services', {
      id: srv.id,
      category_id: srv.category_id,
      category_name: srv.category_name,
      category_slug: srv.category_slug,
      name: srv.name,
      slug: srv.slug,
      description: srv.description,
      eligibility: srv.eligibility,
      instructions: srv.instructions,
      fee: srv.fee,
      processing_time: srv.processing_time,
      is_active: srv.is_active
    });

    // Insert service fields
    if (srv.fields && Array.isArray(srv.fields)) {
      for (let i = 0; i < srv.fields.length; i++) {
        const f = srv.fields[i];
        await db.insert('service_fields', {
          id: db.data.service_fields.length + 1,
          service_id: srv.id,
          name: f.name,
          label: f.label,
          type: f.type,
          placeholder: f.placeholder || '',
          required: f.required !== false,
          options: f.options || [],
          display_order: i + 1
        });
      }
    }

    // Insert required documents
    if (srv.documents && Array.isArray(srv.documents)) {
      for (let j = 0; j < srv.documents.length; j++) {
        const d = srv.documents[j];
        await db.insert('service_documents', {
          id: db.data.service_documents.length + 1,
          service_id: srv.id,
          name: d.name,
          description: d.description || '',
          required: d.required !== false,
          allowed_types: ['pdf', 'jpg', 'png'],
          max_size: '5MB',
          display_order: j + 1
        });
      }
    }
  }

  // 5. SEED DEMO APPLICATION
  const sampleApp = await db.insert('applications', {
    id: 1,
    application_number: 'APP-20260902-8492',
    user_id: 1,
    service_id: 2,
    service_name: 'Aadhaar Name Update',
    category_name: 'Aadhaar Services',
    applicant_name: 'Karthik Subramanian',
    applicant_email: 'user@eseva.gov.in',
    applicant_phone: '9876543210',
    field_values: {
      current_aadhaar_name: 'Karthik S',
      new_name: 'Karthik Subramanian',
      aadhaar_number: '1234 5678 9012',
      mobile_number: '9876543210',
      reason_for_change: 'Spelling Correction'
    },
    uploaded_documents: [
      { document_name: 'Current Aadhaar Copy', filename: 'aadhaar_front.pdf', filepath: '/uploads/demo.pdf' },
      { document_name: 'Supporting Name Proof', filename: 'voter_card.jpg', filepath: '/uploads/demo.jpg' }
    ],
    fee_amount: 50,
    payment_status: 'PAID',
    payment_method: 'UPI',
    status: 'Approved',
    admin_remarks: 'Application verified against official gazette record. Service request processed successfully.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  await db.insert('application_history', {
    id: 1,
    application_id: 1,
    status: 'Submitted',
    remarks: 'Application submitted online by citizen.',
    updated_by: 'Citizen User',
    created_at: new Date().toISOString()
  });

  await db.insert('application_history', {
    id: 2,
    application_id: 1,
    status: 'Approved',
    remarks: 'Application verified against official gazette record. Service request processed successfully.',
    updated_by: 'Super Admin',
    created_at: new Date().toISOString()
  });

  console.log('Step 3 Seeding Complete!');
  console.log(`- Categories: ${categoriesData.length}`);
  console.log(`- Total Services: ${allServices.length} (including 15 Aadhaar Services)`);
  console.log(`- Total Configured Fields: ${db.data.service_fields.length}`);
  console.log(`- Total Required Documents: ${db.data.service_documents.length}`);
}

seed().catch(console.error);
