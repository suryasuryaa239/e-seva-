// Centralized Service Catalog Registry and Fallback Map
// Contains detailed service metadata, SLA, fees, document checklists, and dynamic form fields for all 10 categories.

export const DEFAULT_SERVICES_MAP = {
  // -------------------------------------------------------------
  // 1. AADHAAR SERVICES
  // -------------------------------------------------------------
  'new-aadhaar-enrollment': {
    id: 101,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'New Aadhaar Enrollment Assistance',
    slug: 'new-aadhaar-enrollment',
    description: 'Appointment slot booking and documentation assistance for fresh UIDAI Aadhaar Enrollment.',
    eligibility: 'All resident citizens and newborns without existing Aadhaar enrolment.',
    processing_time: '15-30 Working Days',
    fee: 0,
    fields: [
      { name: 'full_name', label: 'Full Name of Applicant', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], required: true },
      { name: 'guardian_name', label: 'Father / Mother / Guardian Name', type: 'text', placeholder: 'Subramanian S', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'user@example.com', required: false },
      { name: 'address', label: 'Residential Address', type: 'textarea', placeholder: 'Door No, Street Name, Village/City', required: true },
      { name: 'district', label: 'District', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'state', label: 'State', type: 'text', placeholder: 'Tamil Nadu', required: true },
      { name: 'pincode', label: '6-Digit Pincode', type: 'text', placeholder: '600001', required: true }
    ],
    documents: [
      { name: 'Identity Proof', description: 'Voter ID, Passport, PAN Card, or Birth Certificate', required: true },
      { name: 'Address Proof', description: 'Ration Card, Electricity Bill, or Bank Passbook', required: true },
      { name: 'Date of Birth Proof', description: 'Birth Certificate or School Leaving Marksheet', required: true },
      { name: 'Passport Photograph', description: 'Recent color photograph of applicant', required: true }
    ]
  },
  'new-aadhaar-enrollment-booking': {
    id: 101,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'New Aadhaar Enrollment Assistance',
    slug: 'new-aadhaar-enrollment-booking',
    description: 'Appointment slot booking and documentation assistance for fresh UIDAI Aadhaar Enrollment.',
    eligibility: 'All resident citizens and newborns without existing Aadhaar enrolment.',
    processing_time: '15-30 Working Days',
    fee: 0,
    fields: [
      { name: 'full_name', label: 'Full Name of Applicant', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], required: true },
      { name: 'guardian_name', label: 'Father / Mother / Guardian Name', type: 'text', placeholder: 'Subramanian S', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'user@example.com', required: false },
      { name: 'address', label: 'Residential Address', type: 'textarea', placeholder: 'Door No, Street Name, Village/City', required: true },
      { name: 'district', label: 'District', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'state', label: 'State', type: 'text', placeholder: 'Tamil Nadu', required: true },
      { name: 'pincode', label: '6-Digit Pincode', type: 'text', placeholder: '600001', required: true }
    ],
    documents: [
      { name: 'Identity Proof', description: 'Voter ID, Passport, PAN Card, or Birth Certificate', required: true },
      { name: 'Address Proof', description: 'Ration Card, Electricity Bill, or Bank Passbook', required: true },
      { name: 'Date of Birth Proof', description: 'Birth Certificate or School Leaving Marksheet', required: true },
      { name: 'Passport Photograph', description: 'Recent color photograph of applicant', required: true }
    ]
  },
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
      { name: 'current_address', label: 'Current Address in Aadhaar', type: 'textarea', placeholder: 'Old address details', required: true },
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
      { name: 'Aadhaar Card Copy', description: 'Copy of existing Aadhaar Card', required: true },
      { name: 'Valid Address Proof', description: 'Electricity Bill, Bank Passbook, Passport, or Rent Agreement', required: true }
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
      { name: 'reason', label: 'Reason for Name Change', type: 'select', options: ['Spelling Error Correction', 'Post Marriage Name Change', 'Gazette Name Change'], required: true },
      { name: 'mobile_number', label: 'Linked Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Aadhaar Card Copy', description: 'Copy of existing Aadhaar Card', required: true },
      { name: 'Name Change / Supporting Name Proof', description: 'Voter ID, Passport, PAN Card, or Gazette Notification', required: true }
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
      { name: 'current_mobile', label: 'Current Mobile Number (if any)', type: 'phone', placeholder: '9876543210', required: false },
      { name: 'new_mobile', label: 'New Mobile Number to Link', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Aadhaar Card Copy', description: 'Copy of existing Aadhaar Card', required: true }
    ]
  },
  'aadhaar-email-update': {
    id: 102,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Aadhaar Email ID Update',
    slug: 'aadhaar-email-update',
    description: 'Link or update official email address in your UIDAI Aadhaar record.',
    eligibility: 'Aadhaar cardholders updating contact information.',
    processing_time: '24-48 Hours',
    fee: 50,
    fields: [
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'new_email', label: 'New Email Address', type: 'email', placeholder: 'user@example.com', required: true },
      { name: 'mobile_number', label: 'Linked Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Aadhaar Card Copy', description: 'Copy of existing Aadhaar Card', required: true }
    ]
  },
  'aadhaar-dob-update': {
    id: 103,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Aadhaar Date of Birth Update',
    slug: 'aadhaar-dob-update',
    description: 'Correction or update of Date of Birth in official UIDAI database.',
    eligibility: 'Aadhaar cardholders with official DOB proof.',
    processing_time: '5-7 Working Days',
    fee: 50,
    fields: [
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'current_dob', label: 'Current Date of Birth in Aadhaar', type: 'date', required: true },
      { name: 'correct_dob', label: 'Correct Date of Birth', type: 'date', required: true },
      { name: 'reason', label: 'Reason for Correction', type: 'text', placeholder: 'Typographical error in original card', required: true }
    ],
    documents: [
      { name: 'Aadhaar Card Copy', description: 'Copy of existing Aadhaar Card', required: true },
      { name: 'Date of Birth Proof', description: 'Birth Certificate, SSLC Marksheet, or Passport', required: true }
    ]
  },
  'aadhaar-gender-update': {
    id: 104,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Aadhaar Gender Update',
    slug: 'aadhaar-gender-update',
    description: 'Correction of gender classification in UIDAI Aadhaar database.',
    eligibility: 'Aadhaar holders updating gender records.',
    processing_time: '3-5 Working Days',
    fee: 50,
    fields: [
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'current_gender', label: 'Current Gender in Card', type: 'select', options: ['Male', 'Female', 'Transgender'], required: true },
      { name: 'correct_gender', label: 'Correct Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], required: true }
    ],
    documents: [
      { name: 'Aadhaar Card Copy', description: 'Copy of existing Aadhaar Card', required: true }
    ]
  },
  'aadhaar-photo-update': {
    id: 105,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Aadhaar Photo Update Assistance',
    slug: 'aadhaar-photo-update',
    description: 'Facilitation for updating your photograph in UIDAI biometric records.',
    eligibility: 'All Aadhaar cardholders.',
    processing_time: '3-5 Working Days',
    fee: 50,
    fields: [
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'applicant_name', label: 'Applicant Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Aadhaar Card Copy', description: 'Copy of existing Aadhaar Card', required: true },
      { name: 'Required Passport Photo', description: 'Recent clear passport color photograph', required: true }
    ]
  },
  'aadhaar-biometric-update': {
    id: 106,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Aadhaar Biometric Update Assistance',
    slug: 'aadhaar-biometric-update',
    description: 'Update fingerprints and iris scan biometrics (mandatory for children turning 5 and 15).',
    eligibility: 'Aadhaar holders requiring biometric updates.',
    processing_time: '3-5 Working Days',
    fee: 100,
    fields: [
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'applicant_name', label: 'Applicant Full Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Aadhaar Card Copy', description: 'Copy of existing Aadhaar Card', required: true }
    ]
  },
  'aadhaar-document-update': {
    id: 107,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Aadhaar Mandatory Document Update',
    slug: 'aadhaar-document-update',
    description: 'Mandatory re-validation of Identity and Address documents for 10+ year old Aadhaar cards.',
    eligibility: 'Cardholders whose Aadhaar was issued over 10 years ago without recent updates.',
    processing_time: '3-5 Working Days',
    fee: 50,
    fields: [
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'applicant_name', label: 'Applicant Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'mobile_number', label: 'Linked Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Identity Proof', description: 'Voter ID, PAN Card, Passport, or Driving Licence', required: true },
      { name: 'Address Proof', description: 'Ration Card, Electricity Bill, or Bank Passbook', required: true }
    ]
  },
  'aadhaar-download': {
    id: 108,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Aadhaar Digital Download Assistance',
    slug: 'aadhaar-download',
    description: 'Instant assistance for downloading official password-protected e-Aadhaar PDF copy.',
    eligibility: 'All Aadhaar cardholders with linked mobile number for OTP.',
    processing_time: 'Instant / 1 Hour',
    fee: 30,
    fields: [
      { name: 'aadhaar_number', label: '12-Digit Aadhaar / Enrolment ID (EID)', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'applicant_name', label: 'Full Name as in Aadhaar', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'mobile_number', label: 'Linked Mobile Number for OTP', type: 'phone', placeholder: '9876543210', required: true },
      { name: 'email', label: 'Email for Sending PDF', type: 'email', placeholder: 'user@example.com', required: true }
    ],
    documents: []
  },
  'aadhaar-status-check': {
    id: 109,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Aadhaar Status Check',
    slug: 'aadhaar-status-check',
    description: 'Check status of your new enrolment or update request.',
    eligibility: 'All applicants with EID or URN reference number.',
    processing_time: 'Instant',
    fee: 0,
    fields: [
      { name: 'aadhaar_eid', label: 'Aadhaar / Application Reference Number (URN/EID)', type: 'text', placeholder: '1234/56789/01234', required: true },
      { name: 'mobile_number', label: 'Registered Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: []
  },
  'aadhaar-correction-assistance': {
    id: 110,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Aadhaar Dynamic Correction Assistance',
    slug: 'aadhaar-correction-assistance',
    description: 'Customized correction assistant for any demographic detail update in Aadhaar.',
    eligibility: 'Aadhaar holders seeking targeted data corrections.',
    processing_time: '3-7 Working Days',
    fee: 50,
    fields: [
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'correction_type', label: 'Correction Type', type: 'select', options: ['Name', 'Date of Birth', 'Gender', 'Address', 'Mobile Number', 'Email', 'Other'], required: true },
      
      // Conditional Fields
      { name: 'current_name', label: 'Current Name in Aadhaar', type: 'text', placeholder: 'Current Name', depends_on_field: 'correction_type', depends_on_value: 'Name', required: true },
      { name: 'new_name', label: 'New Correct Name', type: 'text', placeholder: 'New Name', depends_on_field: 'correction_type', depends_on_value: 'Name', required: true },

      { name: 'current_dob', label: 'Current Date of Birth', type: 'date', depends_on_field: 'correction_type', depends_on_value: 'Date of Birth', required: true },
      { name: 'correct_dob', label: 'Correct Date of Birth', type: 'date', depends_on_field: 'correction_type', depends_on_value: 'Date of Birth', required: true },

      { name: 'current_gender', label: 'Current Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], depends_on_field: 'correction_type', depends_on_value: 'Gender', required: true },
      { name: 'correct_gender', label: 'Correct Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], depends_on_field: 'correction_type', depends_on_value: 'Gender', required: true },

      { name: 'current_address', label: 'Current Address', type: 'textarea', placeholder: 'Current Address', depends_on_field: 'correction_type', depends_on_value: 'Address', required: true },
      { name: 'new_address', label: 'New Complete Address', type: 'textarea', placeholder: 'New Address', depends_on_field: 'correction_type', depends_on_value: 'Address', required: true },

      { name: 'current_mobile', label: 'Current Mobile', type: 'phone', placeholder: 'Old Mobile Number', depends_on_field: 'correction_type', depends_on_value: 'Mobile Number', required: false },
      { name: 'new_mobile', label: 'New Mobile Number', type: 'phone', placeholder: 'New Mobile Number', depends_on_field: 'correction_type', depends_on_value: 'Mobile Number', required: true },

      { name: 'new_email', label: 'New Email ID', type: 'email', placeholder: 'New Email Address', depends_on_field: 'correction_type', depends_on_value: 'Email', required: true },

      { name: 'other_details', label: 'Correction Details & Explanation', type: 'textarea', placeholder: 'Explain what needs correction', depends_on_field: 'correction_type', depends_on_value: 'Other', required: true },

      { name: 'mobile_number', label: 'Mobile Number for Communication', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Aadhaar Card Copy', description: 'Copy of existing Aadhaar Card', required: true },
      { name: 'Supporting Correction Proof', description: 'Relevant legal or government proof supporting the requested change', required: true }
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
      { name: 'applicant_name', label: 'Applicant Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'delivery_address', label: 'Complete Delivery Address', type: 'textarea', placeholder: 'Door No, Street Name, City, Pincode', required: true },
      { name: 'district', label: 'District', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'state', label: 'State', type: 'text', placeholder: 'Tamil Nadu', required: true },
      { name: 'pincode', label: 'Pincode', type: 'text', placeholder: '600001', required: true },
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
      { name: 'applicant_name', label: 'Applicant Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'delivery_address', label: 'Complete Delivery Address', type: 'textarea', placeholder: 'Door No, Street Name, City, Pincode', required: true },
      { name: 'district', label: 'District', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'state', label: 'State', type: 'text', placeholder: 'Tamil Nadu', required: true },
      { name: 'pincode', label: 'Pincode', type: 'text', placeholder: '600001', required: true },
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
      { name: 'correction_type', label: 'Field to Correct', type: 'select', options: ['Name', 'Date of Birth', "Father's Name", 'Address', 'Signature', 'Photograph', 'Other'], required: true },
      
      // Conditional Fields
      { name: 'correct_name', label: 'Correct Applicant Full Name', type: 'text', placeholder: 'Karthik Subramanian', depends_on_field: 'correction_type', depends_on_value: 'Name', required: true },
      { name: 'correct_dob', label: 'Correct Date of Birth', type: 'date', depends_on_field: 'correction_type', depends_on_value: 'Date of Birth', required: true },
      { name: 'correct_father_name', label: 'Correct Father Full Name', type: 'text', placeholder: 'Subramanian S', depends_on_field: 'correction_type', depends_on_value: "Father's Name", required: true },
      { name: 'new_address', label: 'New Communication Address', type: 'textarea', placeholder: 'Door No, Street Name, Pincode', depends_on_field: 'correction_type', depends_on_value: 'Address', required: true },
      { name: 'other_details', label: 'Explanation for Correction', type: 'textarea', placeholder: 'Provide details regarding signature/photo or other corrections', depends_on_field: 'correction_type', depends_on_value: 'Other', required: true },

      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Existing PAN Card Copy', description: 'Copy of existing PAN Card', required: true },
      { name: 'Supporting Correction Proof', description: 'Aadhaar Card, Passport, or Gazette Certificate supporting the correction', required: true }
    ]
  },
  'pan-correction': {
    id: 6,
    category_name: 'PAN Services',
    category_slug: 'pan-services',
    name: 'PAN Card Correction / Update',
    slug: 'pan-correction',
    description: 'Correct name, father name, date of birth, or signature in existing PAN record.',
    eligibility: 'Existing PAN cardholders requiring demographic or photo corrections.',
    processing_time: '7-10 Working Days',
    fee: 107,
    fields: [
      { name: 'existing_pan', label: 'Existing 10-Digit PAN Number', type: 'text', placeholder: 'ABCDE1234F', required: true },
      { name: 'correction_type', label: 'Field to Correct', type: 'select', options: ['Name', 'Date of Birth', "Father's Name", 'Address', 'Signature', 'Photograph', 'Other'], required: true },
      
      // Conditional Fields
      { name: 'correct_name', label: 'Correct Applicant Full Name', type: 'text', placeholder: 'Karthik Subramanian', depends_on_field: 'correction_type', depends_on_value: 'Name', required: true },
      { name: 'correct_dob', label: 'Correct Date of Birth', type: 'date', depends_on_field: 'correction_type', depends_on_value: 'Date of Birth', required: true },
      { name: 'correct_father_name', label: 'Correct Father Full Name', type: 'text', placeholder: 'Subramanian S', depends_on_field: 'correction_type', depends_on_value: "Father's Name", required: true },
      { name: 'new_address', label: 'New Communication Address', type: 'textarea', placeholder: 'Door No, Street Name, Pincode', depends_on_field: 'correction_type', depends_on_value: 'Address', required: true },
      { name: 'other_details', label: 'Explanation for Correction', type: 'textarea', placeholder: 'Provide details regarding signature/photo or other corrections', depends_on_field: 'correction_type', depends_on_value: 'Other', required: true },

      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Existing PAN Card Copy', description: 'Copy of existing PAN Card', required: true },
      { name: 'Supporting Correction Proof', description: 'Aadhaar Card, Passport, or Gazette Certificate supporting the correction', required: true }
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
  'pan-download-status': {
    id: 111,
    category_name: 'PAN Services',
    category_slug: 'pan-services',
    name: 'e-PAN Download & Status Check',
    slug: 'pan-download-status',
    description: 'Instant download of official e-PAN PDF document or status inquiry.',
    eligibility: 'All PAN applicants.',
    processing_time: 'Instant / 1 Hour',
    fee: 30,
    fields: [
      { name: 'pan_number', label: '10-Digit PAN Number / Acknowledgement No', type: 'text', placeholder: 'ABCDE1234F or Ack No', required: true },
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'mobile_number', label: 'Registered Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: []
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
  },

  // -------------------------------------------------------------
  // SHORT SLUG ALIASES FOR DIRECT ROUTING MAPPING
  // -------------------------------------------------------------
  'aadhaar-correction': {
    id: 110,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Aadhaar Dynamic Correction Assistance',
    slug: 'aadhaar-correction',
    description: 'Customized correction assistant for any demographic detail update in Aadhaar.',
    eligibility: 'Aadhaar holders seeking targeted data corrections.',
    processing_time: '3-7 Working Days',
    fee: 50,
    fields: [
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'correction_type', label: 'Correction Type', type: 'select', options: ['Name', 'Date of Birth', 'Gender', 'Address', 'Mobile Number', 'Email', 'Other'], required: true },
      { name: 'current_name', label: 'Current Name in Aadhaar', type: 'text', placeholder: 'Current Name', depends_on_field: 'correction_type', depends_on_value: 'Name', required: true },
      { name: 'new_name', label: 'New Correct Name', type: 'text', placeholder: 'New Name', depends_on_field: 'correction_type', depends_on_value: 'Name', required: true },
      { name: 'current_dob', label: 'Current Date of Birth', type: 'date', depends_on_field: 'correction_type', depends_on_value: 'Date of Birth', required: true },
      { name: 'correct_dob', label: 'Correct Date of Birth', type: 'date', depends_on_field: 'correction_type', depends_on_value: 'Date of Birth', required: true },
      { name: 'current_gender', label: 'Current Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], depends_on_field: 'correction_type', depends_on_value: 'Gender', required: true },
      { name: 'correct_gender', label: 'Correct Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], depends_on_field: 'correction_type', depends_on_value: 'Gender', required: true },
      { name: 'current_address', label: 'Current Address', type: 'textarea', placeholder: 'Current Address', depends_on_field: 'correction_type', depends_on_value: 'Address', required: true },
      { name: 'new_address', label: 'New Complete Address', type: 'textarea', placeholder: 'New Address', depends_on_field: 'correction_type', depends_on_value: 'Address', required: true },
      { name: 'current_mobile', label: 'Current Mobile', type: 'phone', placeholder: 'Old Mobile Number', depends_on_field: 'correction_type', depends_on_value: 'Mobile Number', required: false },
      { name: 'new_mobile', label: 'New Mobile Number', type: 'phone', placeholder: 'New Mobile Number', depends_on_field: 'correction_type', depends_on_value: 'Mobile Number', required: true },
      { name: 'new_email', label: 'New Email ID', type: 'email', placeholder: 'New Email Address', depends_on_field: 'correction_type', depends_on_value: 'Email', required: true },
      { name: 'other_details', label: 'Correction Details & Explanation', type: 'textarea', placeholder: 'Explain what needs correction', depends_on_field: 'correction_type', depends_on_value: 'Other', required: true },
      { name: 'mobile_number', label: 'Mobile Number for Communication', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Aadhaar Card Copy', description: 'Copy of existing Aadhaar Card', required: true },
      { name: 'Supporting Correction Proof', description: 'Relevant legal or government proof supporting requested change', required: true }
    ]
  },
  'pan-new': {
    id: 5,
    category_name: 'PAN Services',
    category_slug: 'pan-services',
    name: 'New PAN Card Application (Form 49A)',
    slug: 'pan-new',
    description: 'Apply for fresh Permanent Account Number (PAN) card.',
    eligibility: 'Indian citizens and entities requiring PAN.',
    processing_time: '7-10 Working Days',
    fee: 107,
    fields: [
      { name: 'full_name', label: 'Applicant Full Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'father_name', label: 'Father Full Name', type: 'text', placeholder: 'Subramanian S', required: true },
      { name: 'mother_name', label: 'Mother Full Name', type: 'text', placeholder: 'Lakshmi S', required: false },
      { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], required: true },
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'address', label: 'Residential Address', type: 'textarea', placeholder: 'Door No, Street, City, District, State, Pincode', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'user@example.com', required: true }
    ],
    documents: [
      { name: 'Identity Proof', description: 'Aadhaar Card / Voter ID / Passport', required: true },
      { name: 'Address Proof', description: 'Aadhaar Card / Electricity Bill / Bank Passbook', required: true },
      { name: 'DOB Proof', description: 'Birth Certificate / SSLC Marksheet / Aadhaar Card', required: true },
      { name: 'Photograph', description: 'Recent passport size photo', required: true },
      { name: 'Signature', description: 'Scanned signature copy', required: true }
    ]
  },
  'pan-download': {
    id: 111,
    category_name: 'PAN Services',
    category_slug: 'pan-services',
    name: 'e-PAN Download Assistance',
    slug: 'pan-download',
    description: 'Instant download of official e-PAN PDF document.',
    eligibility: 'All PAN applicants.',
    processing_time: 'Instant / 1 Hour',
    fee: 30,
    fields: [
      { name: 'pan_number', label: '10-Digit PAN Number / Acknowledgement No', type: 'text', placeholder: 'ABCDE1234F or Ack No', required: true },
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'mobile_number', label: 'Registered Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: []
  },
  'pan-status': {
    id: 111,
    category_name: 'PAN Services',
    category_slug: 'pan-services',
    name: 'PAN Application Status Check',
    slug: 'pan-status',
    description: 'Check status of your new PAN or correction application.',
    eligibility: 'All PAN applicants.',
    processing_time: 'Instant',
    fee: 0,
    fields: [
      { name: 'pan_ack_no', label: '15-Digit Acknowledgement Number', type: 'text', placeholder: '881020304050607', required: true },
      { name: 'mobile_number', label: 'Registered Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: []
  },
  'residence-certificate': {
    id: 12,
    category_name: 'Certificate Services',
    category_slug: 'certificates',
    name: 'Residence Certificate Application',
    slug: 'residence-certificate',
    description: 'Official revenue certificate proving residence address.',
    eligibility: 'State residents.',
    processing_time: '7 Working Days',
    fee: 60,
    fields: [
      { name: 'applicant_name', label: 'Applicant Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'father_name', label: 'Father / Husband Name', type: 'text', placeholder: 'Subramanian S', required: true },
      { name: 'current_address', label: 'Current Residential Address', type: 'textarea', placeholder: 'Door No, Street, City, District, State, Pincode', required: true },
      { name: 'duration_residence', label: 'Duration of Residence (in Years)', type: 'number', placeholder: '10', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Identity Proof', description: 'Aadhaar Card / Voter ID', required: true },
      { name: 'Address Proof', description: 'Ration Card / Utility Bill / Rent Agreement', required: true },
      { name: 'Residence Proof', description: 'Property Tax Receipt / School Certificate', required: true }
    ]
  },
  'nativity-certificate': {
    id: 12,
    category_name: 'Certificate Services',
    category_slug: 'certificates',
    name: 'Nativity Certificate Application',
    slug: 'nativity-certificate',
    description: 'Official revenue certificate proving birth and native state status.',
    eligibility: 'Native state residents.',
    processing_time: '7 Working Days',
    fee: 60,
    fields: [
      { name: 'applicant_name', label: 'Applicant Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '', required: true },
      { name: 'place_of_birth', label: 'Place of Birth (Village/Town)', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'father_name', label: 'Father / Guardian Name', type: 'text', placeholder: 'Subramanian S', required: true },
      { name: 'address', label: 'Native Residential Address', type: 'textarea', placeholder: 'Complete native address', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Identity Proof', description: 'Aadhaar Card / Passport', required: true },
      { name: 'Address Proof', description: 'Ration Card / Voter ID', required: true },
      { name: 'Nativity Proof', description: 'Birth Certificate / Parent Nativity Proof / SSLC Marksheet', required: true }
    ]
  },
  'patta-transfer': {
    id: 15,
    category_name: 'Land & Patta Services',
    category_slug: 'land-patta-services',
    name: 'Patta Transfer Application',
    slug: 'patta-transfer',
    description: 'Apply for official Patta transfer in revenue land records.',
    eligibility: 'Registered property buyers.',
    processing_time: '15-30 Working Days',
    fee: 100,
    fields: [
      { name: 'buyer_name', label: 'New Owner / Buyer Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'seller_name', label: 'Current / Previous Owner Name', type: 'text', placeholder: 'Ramesh Kumar', required: true },
      { name: 'survey_number', label: 'Survey Number', type: 'text', placeholder: '123/4', required: true },
      { name: 'sub_division', label: 'Sub-Division Number', type: 'text', placeholder: '4A', required: true },
      { name: 'village', label: 'Village Name', type: 'text', placeholder: 'Mylapore', required: true },
      { name: 'taluk', label: 'Taluk Name', type: 'text', placeholder: 'Mylapore Taluk', required: true },
      { name: 'district', label: 'District', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'property_details', label: 'Property Extent / Sq Ft Details', type: 'textarea', placeholder: '1200 Sq Ft land with residential building', required: true },
      { name: 'mobile_number', label: 'Applicant Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Sale Deed / Ownership Proof', description: 'Registered land sale deed copy', required: true },
      { name: 'Identity Proof', description: 'Aadhaar Card of buyer', required: true },
      { name: 'Existing Patta Copy', description: 'Copy of existing Patta', required: true }
    ]
  },
  'patta-sub-division': {
    id: 151,
    category_name: 'Land & Patta Services',
    category_slug: 'land-patta-services',
    name: 'Patta Sub-Division Application',
    slug: 'patta-sub-division',
    description: 'Application for sub-division of survey land and separate Patta issue.',
    eligibility: 'Landowners partitioning or sub-dividing survey plots.',
    processing_time: '20-30 Working Days',
    fee: 150,
    fields: [
      { name: 'applicant_name', label: 'Landowner Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'survey_number', label: 'Parent Survey Number', type: 'text', placeholder: '123/4', required: true },
      { name: 'existing_sub_division', label: 'Existing Sub-Division', type: 'text', placeholder: '4A', required: true },
      { name: 'village', label: 'Village Name', type: 'text', placeholder: 'Mylapore', required: true },
      { name: 'taluk', label: 'Taluk Name', type: 'text', placeholder: 'Mylapore Taluk', required: true },
      { name: 'district', label: 'District', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'property_details', label: 'Area to Sub-divide (in Sq Ft / Cents)', type: 'textarea', placeholder: '600 Sq Ft portion of plot', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Ownership Proof', description: 'Registered Sale Deed copy', required: true },
      { name: 'Existing Patta Copy', description: 'Current Patta document', required: true },
      { name: 'Field Survey Map / Partition Deed', description: 'Partition Deed or proposed sub-division sketch', required: true }
    ]
  },
  'patta-chitta': {
    id: 16,
    category_name: 'Land & Patta Services',
    category_slug: 'land-patta-services',
    name: 'Patta Chitta Record Search',
    slug: 'patta-chitta',
    description: 'Search and download verified Patta / Chitta revenue records.',
    eligibility: 'Public land record verification.',
    processing_time: 'Instant / 1 Day',
    fee: 50,
    fields: [
      { name: 'survey_number', label: 'Survey Number / Patta Number', type: 'text', placeholder: '123/4A or Patta No 567', required: true },
      { name: 'village_taluk', label: 'Village & Taluk Name', type: 'text', placeholder: 'Village & Taluk Name', required: true },
      { name: 'district', label: 'District', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: []
  },
  'llr': {
    id: 21,
    category_name: 'Vehicle & DL Services',
    category_slug: 'driving-vehicle-services',
    name: 'Learner Licence (LLR) Slot Booking',
    slug: 'llr',
    description: 'Slot booking and application filing for Learner Driving Licence.',
    eligibility: 'Citizens aged 16+ or 18+.',
    processing_time: '3-5 Working Days',
    fee: 250,
    fields: [
      { name: 'applicant_name', label: 'Applicant Name as per ID', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], required: true },
      { name: 'vehicle_class', label: 'Vehicle Class', type: 'select', options: ['Motorcycle With Gear (MCWG)', 'Light Motor Vehicle (LMV Car)', 'MCWG + LMV (Both)'], required: true },
      { name: 'address', label: 'Residential Address', type: 'textarea', placeholder: 'Door No, Street, Pincode', required: true },
      { name: 'district', label: 'District', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'state', label: 'State', type: 'text', placeholder: 'Tamil Nadu', required: true },
      { name: 'pincode', label: 'Pincode', type: 'text', placeholder: '600001', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'karthik@example.com', required: true }
    ],
    documents: [
      { name: 'Identity Proof', description: 'Aadhaar Card / Voter ID / Passport', required: true },
      { name: 'Address Proof', description: 'Aadhaar Card / Electricity Bill / Ration Card', required: true },
      { name: 'Date of Birth Proof', description: 'Birth Certificate / SSLC Marksheet / Aadhaar Card', required: true },
      { name: 'Photograph', description: 'Recent passport photo', required: true }
    ]
  },
  'passport': {
    id: 19,
    category_name: 'Passport & Travel',
    category_slug: 'passport-services',
    name: 'New Passport Application',
    slug: 'passport',
    description: 'Online application filing for fresh Indian Passport.',
    eligibility: 'Indian citizens.',
    processing_time: '15-20 Working Days',
    fee: 1500,
    fields: [
      { name: 'full_name', label: 'Full Name as per ID', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], required: true },
      { name: 'father_name', label: 'Father Name', type: 'text', placeholder: 'Subramanian S', required: true },
      { name: 'mother_name', label: 'Mother Name', type: 'text', placeholder: 'Lakshmi S', required: true },
      { name: 'marital_status', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'], required: true },
      { name: 'address', label: 'Current Address', type: 'textarea', placeholder: 'Door No, Street, City, District, State, Pincode', required: true },
      { name: 'district', label: 'District', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'state', label: 'State', type: 'text', placeholder: 'Tamil Nadu', required: true },
      { name: 'pincode', label: 'Pincode', type: 'text', placeholder: '600001', required: true },
      { name: 'prev_passport', label: 'Previous Passport Details (if applicable)', type: 'text', placeholder: 'Old Passport No or N/A', required: false },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'karthik@example.com', required: true }
    ],
    documents: [
      { name: 'Proof of Date of Birth', description: 'Aadhaar Card / Birth Certificate / Marksheet', required: true },
      { name: 'Proof of Present Address', description: 'Aadhaar Card / Bank Passbook / Utility Bill', required: true },
      { name: 'Non-ECR Educational Proof', description: '10th SSLC Marksheet or Degree Certificate', required: true }
    ]
  },
  'udyam-registration': {
    id: 23,
    category_name: 'Business Services',
    category_slug: 'business-services',
    name: 'Udyam MSME Registration',
    slug: 'udyam-registration',
    description: 'Government MSME Registration for Businesses.',
    eligibility: 'Business enterprises.',
    processing_time: '1-2 Working Days',
    fee: 100,
    fields: [
      { name: 'owner_name', label: 'Applicant / Owner Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'aadhaar_number', label: 'Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'pan_number', label: 'PAN Number', type: 'text', placeholder: 'ABCDE1234F', required: true },
      { name: 'business_name', label: 'Business Name', type: 'text', placeholder: 'Apex Digital Solutions', required: true },
      { name: 'business_type', label: 'Business Type', type: 'select', options: ['Proprietorship', 'Partnership', 'Private Limited', 'LLP'], required: true },
      { name: 'business_activity', label: 'Major Business Activity', type: 'select', options: ['Services', 'Manufacturing', 'Trading'], required: true },
      { name: 'address', label: 'Business Address', type: 'textarea', placeholder: 'Door No, Street, City, District, State, Pincode', required: true },
      { name: 'district', label: 'District', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'state', label: 'State', type: 'text', placeholder: 'Tamil Nadu', required: true },
      { name: 'pincode', label: 'Pincode', type: 'text', placeholder: '600001', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'karthik@example.com', required: true }
    ],
    documents: [
      { name: 'Aadhaar & PAN Copy', description: 'Proprietor Aadhaar and PAN copy', required: true },
      { name: 'Bank Passbook / Cheque', description: 'Bank account statement or passbook', required: true }
    ]
  },
  'fssai': {
    id: 231,
    category_name: 'Business Services',
    category_slug: 'business-services',
    name: 'FSSAI Food License Registration',
    slug: 'fssai',
    description: 'Food Safety and Standards Authority of India (FSSAI) License application.',
    eligibility: 'All food business operators (restaurants, bakeries, caterers, food manufacturers).',
    processing_time: '5-10 Working Days',
    fee: 300,
    fields: [
      { name: 'establishment_name', label: 'Food Business / Establishment Name', type: 'text', placeholder: 'Tasty Foods & Bakery', required: true },
      { name: 'owner_name', label: 'Owner Full Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'business_type', label: 'FSSAI Business Category', type: 'select', options: ['Basic Registration (Small Shop / Home Chef)', 'State License (Medium Restaurant / Manufacturer)', 'Central License (Large Scale Supply)'], required: true },
      { name: 'food_items', label: 'Food Product Items Category', type: 'textarea', placeholder: 'Bakery items, cooked meals, beverages', required: true },
      { name: 'address', label: 'Business Premises Address', type: 'textarea', placeholder: 'Door No, Street, City, District, State, Pincode', required: true },
      { name: 'district', label: 'District', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'state', label: 'State', type: 'text', placeholder: 'Tamil Nadu', required: true },
      { name: 'pincode', label: 'Pincode', type: 'text', placeholder: '600001', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'karthik@example.com', required: true }
    ],
    documents: [
      { name: 'Identity Proof', description: 'Aadhaar Card / PAN Card of proprietor', required: true },
      { name: 'Business Premises Address Proof', description: 'Rental Agreement / Utility Bill / Property Tax Receipt', required: true },
      { name: 'FSSAI Self Declaration Form', description: 'Signed self-declaration for hygiene standards', required: true }
    ]
  },
  'eb-connection': {
    id: 26,
    category_name: 'Utility Services',
    category_slug: 'utility-services',
    name: 'New Electricity EB Connection',
    slug: 'eb-connection',
    description: 'Application for new TANGEDCO power supply connection.',
    eligibility: 'New building owners.',
    processing_time: '10-15 Working Days',
    fee: 350,
    fields: [
      { name: 'applicant_name', label: 'Applicant Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'connection_type', label: 'Connection Type', type: 'select', options: ['Domestic (Home)', 'Commercial (Shop/Office)', 'Industrial'], required: true },
      { name: 'address', label: 'Property / Building Address', type: 'textarea', placeholder: 'Door No, Street, City, District, State, Pincode', required: true },
      { name: 'district', label: 'District', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'state', label: 'State', type: 'text', placeholder: 'Tamil Nadu', required: true },
      { name: 'pincode', label: 'Pincode', type: 'text', placeholder: '600001', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'karthik@example.com', required: true }
    ],
    documents: [
      { name: 'Property Tax Receipt / Ownership Proof', description: 'Sale deed copy or tax receipt', required: true },
      { name: 'Aadhaar Card Copy', description: 'Aadhaar Card copy', required: true }
    ]
  },
  'fastag': {
    id: 261,
    category_name: 'Utility Services',
    category_slug: 'utility-services',
    name: 'FASTag Issuance & Recharge',
    slug: 'fastag',
    description: 'Apply for new NETC FASTag toll sticker delivery for your vehicle.',
    eligibility: 'Vehicle owners.',
    processing_time: '2-4 Working Days',
    fee: 200,
    fields: [
      { name: 'rc_owner_name', label: 'Vehicle RC Owner Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'vehicle_reg_number', label: 'Vehicle Registration Number', type: 'text', placeholder: 'TN07AB1234', required: true },
      { name: 'vehicle_class', label: 'Vehicle Type / Class', type: 'select', options: ['Car / Jeep / Van (Class 4)', 'Light Commercial Vehicle (Class 5)', 'Bus / Truck (Class 6/7)'], required: true },
      { name: 'chassis_number', label: 'Chassis Number / VIN', type: 'text', placeholder: 'MBH1234567890', required: true },
      { name: 'delivery_address', label: 'FASTag Delivery Address', type: 'textarea', placeholder: 'Door No, Street, City, Pincode', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'karthik@example.com', required: true }
    ],
    documents: [
      { name: 'Vehicle RC Copy', description: 'Front and back scan copy of RC smart card', required: true },
      { name: 'Owner Identity Proof', description: 'Aadhaar Card / Driving Licence', required: true }
    ]
  },
  'voter-id': {
    id: 8,
    category_name: 'Voter ID Services',
    category_slug: 'voter-id-services',
    name: 'New Voter Registration (Form 6)',
    slug: 'voter-id',
    description: 'Apply for inclusion in Electoral Roll and new Voter EPIC card.',
    eligibility: 'Indian citizens aged 18+.',
    processing_time: '15-25 Working Days',
    fee: 0,
    fields: [
      { name: 'full_name', label: 'Applicant Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'relative_name', label: 'Father / Husband Name', type: 'text', placeholder: 'Subramanian S', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], required: true },
      { name: 'assembly_constituency', label: 'Assembly Constituency Name', type: 'text', placeholder: 'Mylapore / Velachery', required: true },
      { name: 'address', label: 'Residential Address', type: 'textarea', placeholder: 'Door No, Street, City, District, State, Pincode', required: true },
      { name: 'district', label: 'District', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'state', label: 'State', type: 'text', placeholder: 'Tamil Nadu', required: true },
      { name: 'pincode', label: 'Pincode', type: 'text', placeholder: '600001', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Age Proof', description: 'Birth Certificate / SSLC Marksheet / Aadhaar Card', required: true },
      { name: 'Residence Proof', description: 'Ration Card / Electricity Bill / Bank Passbook', required: true },
      { name: 'Passport Photograph', description: 'Recent color photograph', required: true }
    ]
  },

  // -------------------------------------------------------------
  // ALL 32 CATALOG SERVICE ALIASES & DYNAMIC FORMS
  // -------------------------------------------------------------
  'aadhaar-photo-biometric': {
    id: 111,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Aadhaar Photo & Biometric Update',
    slug: 'aadhaar-photo-biometric',
    description: 'Update photo, fingerprints, and iris biometrics in official UIDAI database.',
    eligibility: 'All Aadhaar cardholders seeking photo or biometric updates.',
    processing_time: '3-5 Working Days',
    fee: 100,
    fields: [
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'update_type', label: 'Biometric Update Type', type: 'select', options: ['Photo & Fingerprint Update', 'Mandatory Child Biometric (Age 5 or 15)', 'Iris Scan Update'], required: true },
      { name: 'center_pincode', label: 'Preferred Center Pincode', type: 'text', placeholder: '600001', required: true }
    ],
    documents: [
      { name: 'Aadhaar Card Copy', description: 'Copy of existing Aadhaar card', required: true },
      { name: 'Passport Photograph', description: 'Recent passport photo', required: true }
    ]
  },
  'aadhaar-pvc-card': {
    id: 112,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Order Aadhaar PVC Smart Card',
    slug: 'aadhaar-pvc-card',
    description: 'Order durable, wallet-sized PVC Aadhaar card with secure QR code and hologram.',
    eligibility: 'All Aadhaar cardholders.',
    processing_time: '5-7 Working Days',
    fee: 50,
    fields: [
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'delivery_address', label: 'Speed Post Delivery Address', type: 'textarea', placeholder: 'Door No, Street Name, Area, City', required: true },
      { name: 'pincode', label: '6-Digit Pincode', type: 'text', placeholder: '600001', required: true }
    ],
    documents: [
      { name: 'Aadhaar Card Copy', description: 'Copy of existing Aadhaar Card', required: true }
    ]
  },
  'aadhaar-new-enrollment': {
    id: 113,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'New Aadhaar Enrollment Booking',
    slug: 'aadhaar-new-enrollment',
    description: 'Fresh UIDAI Aadhaar slot booking and documentation assistance.',
    eligibility: 'Resident citizens without existing Aadhaar.',
    processing_time: '15-30 Working Days',
    fee: 0,
    fields: [
      { name: 'applicant_name', label: 'Full Name of Applicant', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], required: true },
      { name: 'guardian_name', label: 'Father / Husband / Guardian Name', type: 'text', placeholder: 'Subramanian S', required: true }
    ],
    documents: [
      { name: 'Identity Proof', description: 'Voter ID, Passport, or Birth Certificate', required: true },
      { name: 'Address Proof', description: 'Ration Card, Electricity Bill, or Bank Passbook', required: true },
      { name: 'Date of Birth Proof', description: 'Birth Certificate or School TC', required: true }
    ]
  },
  'pan-card-correction': {
    id: 205,
    category_name: 'PAN Services',
    category_slug: 'pan-services',
    name: 'PAN Card Correction / Changes (Form 49A)',
    slug: 'pan-card-correction',
    description: 'Correction of Name, Date of Birth, Father Name, or Photo on PAN Card.',
    eligibility: 'Existing PAN cardholders with valid proof of correction.',
    processing_time: '7-15 Working Days',
    fee: 110,
    fields: [
      { name: 'existing_pan', label: 'Existing 10-Digit PAN Number', type: 'text', placeholder: 'ABCDE1234F', required: true },
      { name: 'correction_type', label: 'Correction Type Required', type: 'select', options: ['Name Correction', 'Date of Birth Correction', 'Father Name Change', 'Photo & Signature Update'], required: true },
      { name: 'corrected_full_name', label: 'Corrected Full Name (as per proof)', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'father_name', label: "Father's Full Name", type: 'text', placeholder: 'Subramanian S', required: true }
    ],
    documents: [
      { name: 'Existing PAN Card Copy', description: 'Copy of existing PAN card', required: true },
      { name: 'Proof of Correction Document', description: 'Aadhaar Card, Gazette Notification, or Passport', required: true },
      { name: 'Passport Photograph', description: 'Recent passport photo', required: true }
    ]
  },
  'pan-reprint-lost-damaged': {
    id: 206,
    category_name: 'PAN Services',
    category_slug: 'pan-services',
    name: 'Reprint Lost or Damaged PAN Card',
    slug: 'pan-reprint-lost-damaged',
    description: 'Reissue physical PAN card copy without changing existing data.',
    eligibility: 'PAN cardholders with lost or damaged physical card.',
    processing_time: '5-10 Working Days',
    fee: 100,
    fields: [
      { name: 'pan_number', label: 'Existing 10-Digit PAN Number', type: 'text', placeholder: 'ABCDE1234F', required: true },
      { name: 'reason', label: 'Reason for Reprint', type: 'select', options: ['Lost PAN Card', 'Damaged / Broken Physical Card', 'Physical Card Copy Required'], required: true },
      { name: 'delivery_address', label: 'Card Dispatch Address', type: 'textarea', placeholder: 'Door No, Street Name, City, Pincode', required: true }
    ],
    documents: [
      { name: 'Aadhaar Card Copy', description: 'Copy of Aadhaar Card linked with PAN', required: true },
      { name: 'Copy of Lost PAN / FIR', description: 'Copy of lost PAN card or FIR acknowledgement', required: false }
    ]
  },
  'new-pan-foreign-national': {
    id: 207,
    category_name: 'PAN Services',
    category_slug: 'pan-services',
    name: 'PAN Card for Foreign Nationals (Form 49AA)',
    slug: 'new-pan-foreign-national',
    description: 'New PAN allocation for non-citizens, NRIs, and foreign companies.',
    eligibility: 'Foreign citizens or entities carrying out business in India.',
    processing_time: '10-20 Working Days',
    fee: 1020,
    fields: [
      { name: 'applicant_name', label: 'Full Name of Foreign Applicant', type: 'text', placeholder: 'Johnathan Doe', required: true },
      { name: 'country', label: 'Country of Citizenship', type: 'text', placeholder: 'United States', required: true },
      { name: 'passport_number', label: 'Passport Number', type: 'text', placeholder: 'A12345678', required: true }
    ],
    documents: [
      { name: 'Foreign Passport Copy', description: 'Valid foreign passport with visa stamp', required: true },
      { name: 'Overseas Bank Statement', description: 'Bank statement or OCI/PIO card copy', required: true }
    ]
  },
  'minor-to-major-pan-update': {
    id: 208,
    category_name: 'PAN Services',
    category_slug: 'pan-services',
    name: 'Minor to Major PAN Card Update',
    slug: 'minor-to-major-pan-update',
    description: 'Update signature and photo on Minor PAN card upon turning 18 years old.',
    eligibility: 'PAN holders who have recently attained 18 years of age.',
    processing_time: '7-12 Working Days',
    fee: 110,
    fields: [
      { name: 'existing_pan', label: 'Existing Minor PAN Number', type: 'text', placeholder: 'ABCDE1234F', required: true },
      { name: 'dob', label: 'Date of Birth (Major Status)', type: 'date', required: true },
      { name: 'father_name', label: "Father's Full Name", type: 'text', placeholder: 'Subramanian S', required: true }
    ],
    documents: [
      { name: 'Existing Minor PAN Copy', description: 'Copy of Minor PAN card', required: true },
      { name: 'Aadhaar Card Copy', description: 'Proof of turning 18', required: true },
      { name: 'Passport Photograph', description: 'Recent photo & signature sample', required: true }
    ]
  },
  'community-caste-certificate': {
    id: 301,
    category_name: 'Certificates',
    category_slug: 'certificate-services',
    name: 'Community / Caste Certificate Application',
    slug: 'community-caste-certificate',
    description: 'Official Revenue Department certificate certifying community status (BC / MBC / SC / ST).',
    eligibility: 'Resident citizens of Tamil Nadu requiring community proof.',
    processing_time: '7-12 Working Days',
    fee: 60,
    fields: [
      { name: 'community_category', label: 'Community Category', type: 'select', options: ['BC - Backward Class', 'MBC - Most Backward Class', 'SC - Scheduled Caste', 'ST - Scheduled Tribe'], required: true },
      { name: 'sub_caste', label: 'Specific Sub-Caste Name', type: 'text', placeholder: 'e.g. Nadar / Agamudayar / Adi Dravidar', required: true },
      { name: 'father_caste', label: "Father's / Mother's Community", type: 'text', placeholder: 'Parent Community Name', required: true },
      { name: 'tc_school', label: 'School / College Last Attended', type: 'text', placeholder: 'Government Higher Secondary School', required: true }
    ],
    documents: [
      { name: 'Parent Community Certificate', description: "Copy of Father's or Mother's Community Certificate", required: true },
      { name: 'School TC / Marksheet', description: 'Transfer Certificate mentioning caste', required: true },
      { name: 'Smart Ration Card', description: 'Copy of Smart Ration Card', required: true },
      { name: 'Aadhaar Card Copy', description: 'Copy of Aadhaar Card', required: true }
    ]
  },
  'native-domicile-certificate': {
    id: 302,
    category_name: 'Certificates',
    category_slug: 'certificate-services',
    name: 'Native / Domicile Certificate Application',
    slug: 'native-domicile-certificate',
    description: 'Official proof verifying permanent domicile & native residence status in Tamil Nadu.',
    eligibility: 'Permanent residents of Tamil Nadu.',
    processing_time: '7-10 Working Days',
    fee: 60,
    fields: [
      { name: 'years_residence', label: 'Years of Continuous Residence in TN', type: 'number', placeholder: 'e.g. 25', required: true },
      { name: 'father_native_place', label: 'Ancestral Native Place / District', type: 'text', placeholder: 'Madurai', required: true },
      { name: 'purpose', label: 'Purpose of Nativity Certificate', type: 'select', options: ['Higher Education Admission (TNEA/NEET)', 'Government Employment', 'Scholarship Scheme', 'Other'], required: true }
    ],
    documents: [
      { name: '5-Year School Study Proof or Birth Certificate', description: 'Study certificates from 1st to 10th/12th std or Birth Certificate', required: true },
      { name: 'Smart Ration Card / Property Tax', description: 'Address proof for native residence', required: true },
      { name: 'Aadhaar Card Copy', description: 'Copy of Aadhaar Card', required: true }
    ]
  },
  'no-male-child-certificate': {
    id: 305,
    category_name: 'Certificates',
    category_slug: 'certificate-services',
    name: 'No Male Child Certificate Application',
    slug: 'no-male-child-certificate',
    description: 'Revenue certificate issued to families having only female children for welfare schemes.',
    eligibility: 'Parents with only female children and no male issue.',
    processing_time: '7-10 Working Days',
    fee: 60,
    fields: [
      { name: 'female_children_count', label: 'Number of Female Children', type: 'number', placeholder: '2', required: true },
      { name: 'mother_name', label: "Mother's Full Name", type: 'text', placeholder: 'Lakshmi S', required: true },
      { name: 'sterilization_status', label: 'Family Welfare Sterilization Done?', type: 'select', options: ['Yes - Certificate Available', 'No / Not Done'], required: true }
    ],
    documents: [
      { name: 'Birth Certificates of Female Children', description: 'Copies of birth certificates of all daughters', required: true },
      { name: 'Sterilization Certificate / Doctor Report', description: 'Sterilization proof or medical report', required: true },
      { name: 'Parents Aadhaar & Ration Card', description: 'Parents identity and family card copy', required: true }
    ]
  },
  'solvency-certificate': {
    id: 307,
    category_name: 'Certificates',
    category_slug: 'certificate-services',
    name: 'Solvency Certificate Application',
    slug: 'solvency-certificate',
    description: 'Financial stability certificate issued by Revenue Dept for contractors, tenders & bank guarantees.',
    eligibility: 'Property owners seeking solvency validation.',
    processing_time: '15-20 Working Days',
    fee: 150,
    fields: [
      { name: 'property_value', label: 'Estimated Solvency Value in ₹', type: 'number', placeholder: '500000', required: true },
      { name: 'survey_number', label: 'Property Survey No. & Village', type: 'text', placeholder: 'Survey No 124/2A, Adyar', required: true },
      { name: 'purpose', label: 'Solvency Purpose', type: 'select', options: ['Government Contract Tender', 'Bank Guarantee', 'Liquor / Excise License', 'Court Bail Guarantee', 'Other'], required: true }
    ],
    documents: [
      { name: 'Property Sale Deed / Title Deed', description: 'Registered property deed document copy', required: true },
      { name: 'Encumbrance Certificate (EC)', description: 'Latest EC for 13 to 30 years', required: true },
      { name: 'Engineer Valuation Report', description: 'Property valuation certificate by chartered engineer', required: true },
      { name: 'Aadhaar & PAN Card Copy', description: 'Identity proof documents', required: true }
    ]
  },
  'unmarried-certificate': {
    id: 308,
    category_name: 'Certificates',
    category_slug: 'certificate-services',
    name: 'Unmarried / Single Status Certificate',
    slug: 'unmarried-certificate',
    description: 'Revenue certificate certifying single status for visa, passport & employment requirements.',
    eligibility: 'Unmarried citizens requiring official single status proof.',
    processing_time: '5-7 Working Days',
    fee: 60,
    fields: [
      { name: 'age', label: 'Current Age', type: 'number', placeholder: '26', required: true },
      { name: 'purpose', label: 'Purpose of Certificate', type: 'select', options: ['Overseas Visa / Employment', 'Defense Forces Recruitment', 'Higher Education Abroad', 'Legal Declaration'], required: true },
      { name: 'declaration', label: 'I declare that I have not been legally married', type: 'checkbox', required: true }
    ],
    documents: [
      { name: 'Notarized Affidavit', description: 'Single status declaration executed before Notary Public', required: true },
      { name: 'Passport / Voter ID Copy', description: 'Proof of identity', required: true },
      { name: 'Aadhaar & Ration Card', description: 'Address and family proof', required: true }
    ]
  },
  'land-subdivision-patta': {
    id: 405,
    category_name: 'Land & Revenue',
    category_slug: 'land-patta-services',
    name: 'Land Subdivision Patta Application',
    slug: 'land-subdivision-patta',
    description: 'Subdivision of land parcel and issuance of separate individual Patta.',
    eligibility: 'Land owners purchasing a portion of survey land.',
    processing_time: '30-45 Working Days',
    fee: 200,
    fields: [
      { name: 'existing_patta_no', label: 'Existing Joint Patta Number', type: 'text', placeholder: '1245', required: true },
      { name: 'survey_no', label: 'Survey Number & Sub Division', type: 'text', placeholder: '89/3B', required: true },
      { name: 'extent_sqft', label: 'Subdivided Area Extent (Sq.Ft / Cents)', type: 'text', placeholder: '1200 Sq.Ft', required: true },
      { name: 'taluk_village', label: 'Taluk and Village Name', type: 'text', placeholder: 'Tambaram, Velachery', required: true }
    ],
    documents: [
      { name: 'Registered Sale Deed Document', description: 'Copy of registered deed', required: true },
      { name: 'Existing Patta Copy', description: 'Copy of joint patta', required: true },
      { name: 'FMB Field Map Sketch', description: 'Survey sketch copy', required: true },
      { name: 'Aadhaar Card Copy', description: 'Owner identity proof', required: true }
    ]
  },
  'trade-license-application': {
    id: 504,
    category_name: 'Business Services',
    category_slug: 'business-services',
    name: 'Municipal Trade License Application',
    slug: 'trade-license-application',
    description: 'Local corporation/municipality commercial shop and trade license.',
    eligibility: 'Business owners operating commercial establishments.',
    processing_time: '10-15 Working Days',
    fee: 500,
    fields: [
      { name: 'trade_name', label: 'Business / Shop Trade Name', type: 'text', placeholder: 'Sri Krishna Supermarket', required: true },
      { name: 'trade_category', label: 'Category of Trade', type: 'select', options: ['Grocery / Retail Shop', 'Hotel / Restaurant / Eatery', 'Hardware / Electricals', 'Workshop / Manufacturing', 'IT / Office Establishment'], required: true },
      { name: 'shop_address', label: 'Commercial Shop Address', type: 'textarea', placeholder: 'No 45, Main Road, Chennai', required: true },
      { name: 'premises_type', label: 'Premises Ownership', type: 'select', options: ['Rented / Leased Premises', 'Self Owned Property'], required: true }
    ],
    documents: [
      { name: 'Rental Agreement / Property Tax Receipt', description: 'Occupancy proof for commercial shop', required: true },
      { name: 'Identity & Address Proof of Owner', description: 'Aadhaar & PAN card copy', required: true },
      { name: 'NOC / Fire Safety Certificate', description: 'No objection certificate if applicable', required: false }
    ]
  },
  'permanent-driving-licence': {
    id: 602,
    category_name: 'Driving & Vehicle',
    category_slug: 'driving-vehicle-services',
    name: 'Permanent Driving Licence (DL) Slot Booking',
    slug: 'permanent-driving-licence',
    description: 'Book RTO driving test appointment for permanent driving licence.',
    eligibility: 'Holders of valid LLR completed 30 days after issue.',
    processing_time: '7-15 Working Days',
    fee: 300,
    fields: [
      { name: 'llr_number', label: 'Existing LLR Number', type: 'text', placeholder: 'TN01/LLR/2026/12345', required: true },
      { name: 'llr_issue_date', label: 'LLR Issue Date', type: 'date', required: true },
      { name: 'vehicle_class', label: 'Vehicle Class Category', type: 'select', options: ['Motor Cycle With Gear (MCWG)', 'Motor Cycle Without Gear (MCWOG)', 'Light Motor Vehicle - Car (LMV)', 'MCWG + LMV (Two & Four Wheeler)'], required: true },
      { name: 'rto_office', label: 'Assigned RTO Office Location', type: 'text', placeholder: 'RTO Chennai South (TN-07)', required: true }
    ],
    documents: [
      { name: 'Valid LLR Copy', description: 'Original LLR copy', required: true },
      { name: 'Aadhaar Card Copy', description: 'Identity and address proof', required: true },
      { name: 'Medical Fitness Form 1A', description: 'Doctor medical certificate', required: true }
    ]
  },
  'dl-renewal-application': {
    id: 603,
    category_name: 'Driving & Vehicle',
    category_slug: 'driving-vehicle-services',
    name: 'Driving Licence (DL) Renewal Application',
    slug: 'dl-renewal-application',
    description: 'Online renewal assistance for expired driving licence.',
    eligibility: 'Driving licence holders whose DL is expired or expiring within 1 year.',
    processing_time: '7-10 Working Days',
    fee: 250,
    fields: [
      { name: 'dl_number', label: 'Existing Driving Licence Number', type: 'text', placeholder: 'TN0120150012345', required: true },
      { name: 'dl_expiry_date', label: 'DL Expiry Date', type: 'date', required: true },
      { name: 'blood_group', label: 'Blood Group', type: 'select', options: ['O+ Positive', 'O- Negative', 'A+ Positive', 'A- Negative', 'B+ Positive', 'B- Negative', 'AB+ Positive', 'AB- Negative'], required: true }
    ],
    documents: [
      { name: 'Original Expired DL Copy', description: 'Copy of existing driving licence', required: true },
      { name: 'Aadhaar Card Copy', description: 'Address and identity proof', required: true },
      { name: 'Medical Certificate Form 1A', description: 'Medical fitness form (mandatory for age > 40)', required: true }
    ]
  },
  'vehicle-rc-transfer': {
    id: 604,
    category_name: 'Driving & Vehicle',
    category_slug: 'driving-vehicle-services',
    name: 'Vehicle RC Ownership Transfer Application',
    slug: 'vehicle-rc-transfer',
    description: 'Transfer vehicle registration certificate ownership to buyer upon sale.',
    eligibility: 'Buyers or sellers of secondhand motorized vehicles.',
    processing_time: '15-20 Working Days',
    fee: 450,
    fields: [
      { name: 'vehicle_reg_no', label: 'Vehicle Registration Number', type: 'text', placeholder: 'TN07AB1234', required: true },
      { name: 'seller_name', label: 'Seller / Original Owner Name', type: 'text', placeholder: 'Ramesh K', required: true },
      { name: 'buyer_name', label: 'Buyer / New Owner Name', type: 'text', placeholder: 'Karthik S', required: true },
      { name: 'transfer_reason', label: 'Ownership Transfer Reason', type: 'select', options: ['Vehicle Sale / Purchase', 'Inheritance / Succession', 'Public Auction Transfer'], required: true }
    ],
    documents: [
      { name: 'Original RC Smart Card', description: 'Original Registration Certificate', required: true },
      { name: 'Form 29 & Form 30', description: 'Notice & Application for transfer of ownership signed by seller', required: true },
      { name: 'Valid Insurance & PUC Certificate', description: 'Vehicle insurance and pollution certificate copy', required: true },
      { name: 'Buyer Aadhaar Card Copy', description: 'New owner address and identity proof', required: true }
    ]
  },
  'ration-smart-card-member-update': {
    id: 701,
    category_name: 'Ration Card',
    category_slug: 'ration-card-services',
    name: 'Smart Ration Card Family Member Add / Remove',
    slug: 'ration-smart-card-member-update',
    description: 'Add newborn baby, spouse after marriage, or remove deceased/separated member.',
    eligibility: 'Smart Ration Card holders.',
    processing_time: '7-12 Working Days',
    fee: 50,
    fields: [
      { name: 'ration_card_no', label: 'Smart Ration Card Number', type: 'text', placeholder: '331234567890', required: true },
      { name: 'action_type', label: 'Member Modification Type', type: 'select', options: ['Add New Family Member (Child / Spouse)', 'Remove Existing Member (Marriage / Separation / Death)', 'Name / Relationship Correction'], required: true },
      { name: 'member_name', label: 'Full Name of Member to Add / Remove', type: 'text', placeholder: 'Anitha K', required: true },
      { name: 'relationship', label: 'Relationship with Head of Family', type: 'select', options: ['Spouse (Wife / Husband)', 'Son', 'Daughter', 'Father', 'Mother', 'Daughter-in-law'], required: true }
    ],
    documents: [
      { name: 'Smart Ration Card Copy', description: 'Copy of existing smart card', required: true },
      { name: 'Birth Certificate / Marriage Certificate', description: 'Proof for adding member', required: true },
      { name: 'Deletion Certificate / Death Certificate', description: 'Proof for removing member (if applicable)', required: false },
      { name: 'Aadhaar Card of Member', description: 'Aadhaar copy of member being added', required: true }
    ]
  },
  'ration-family-head-change': {
    id: 703,
    category_name: 'Ration Card',
    category_slug: 'ration-card-services',
    name: 'Smart Ration Card Head of Family Change',
    slug: 'ration-family-head-change',
    description: 'Change head of family due to death of head or family consensus.',
    eligibility: 'Family members listed on Smart Ration Card.',
    processing_time: '7-10 Working Days',
    fee: 50,
    fields: [
      { name: 'ration_card_no', label: 'Smart Ration Card Number', type: 'text', placeholder: '331234567890', required: true },
      { name: 'current_head_name', label: 'Current Head of Family Name', type: 'text', placeholder: 'Subramanian S', required: true },
      { name: 'new_head_name', label: 'New Head of Family Name', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'reason', label: 'Reason for Change', type: 'select', options: ['Death of Previous Head', 'Old Age / Voluntary Family Decision', 'Family Separation'], required: true }
    ],
    documents: [
      { name: 'Smart Ration Card Copy', description: 'Copy of existing card', required: true },
      { name: 'Death Certificate of Previous Head', description: 'Mandatory if previous head is deceased', required: false },
      { name: 'New Head Aadhaar & Photo', description: 'Identity proof and photo of new head', required: true }
    ]
  },
  'ration-address-fps-change': {
    id: 704,
    category_name: 'Ration Card',
    category_slug: 'ration-card-services',
    name: 'Smart Ration Card Address & Fair Price Shop Transfer',
    slug: 'ration-address-fps-change',
    description: 'Transfer ration shop and address within or across districts in Tamil Nadu.',
    eligibility: 'Ration cardholders relocating residential address.',
    processing_time: '7-10 Working Days',
    fee: 50,
    fields: [
      { name: 'ration_card_no', label: 'Smart Ration Card Number', type: 'text', placeholder: '331234567890', required: true },
      { name: 'new_address', label: 'New Residential Address', type: 'textarea', placeholder: 'Door No, Street Name, Area, City', required: true },
      { name: 'new_fps_code', label: 'Preferred New Fair Price Shop (FPS) Name/Code', type: 'text', placeholder: 'FPS Shop Code No 07AB12', required: false }
    ],
    documents: [
      { name: 'Smart Ration Card Copy', description: 'Copy of existing card', required: true },
      { name: 'New Address Proof', description: 'Rental Agreement, EB Bill, or Property Tax Receipt', required: true },
      { name: 'Aadhaar Card Copy', description: 'Aadhaar copy of Head of Family', required: true }
    ]
  },
  'new-voter-registration-form-6': {
    id: 801,
    category_name: 'Voter Services',
    category_slug: 'voter-services',
    name: 'New Voter ID Registration (Form 6)',
    slug: 'new-voter-registration-form-6',
    description: 'Fresh voter enrollment for Indian citizens attaining 18 years of age.',
    eligibility: 'Indian citizens aged 18 years or above.',
    processing_time: '15-30 Working Days',
    fee: 0,
    fields: [
      { name: 'assembly_constituency', label: 'Assembly Constituency Name / No.', type: 'text', placeholder: 'Velachery (Constituency No 26)', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Third Gender'], required: true },
      { name: 'relative_name', label: "Father's / Mother's / Husband's Name", type: 'text', placeholder: 'Subramanian S', required: true }
    ],
    documents: [
      { name: 'Age Proof', description: 'Birth Certificate, School TC, Aadhaar, or PAN Card', required: true },
      { name: 'Residence Proof', description: 'Ration Card, Passport, EB Bill, or Bank Passbook', required: true },
      { name: 'Passport Photograph', description: 'Recent color passport photograph', required: true }
    ]
  },
  'voter-address-correction-form-8': {
    id: 802,
    category_name: 'Voter Services',
    category_slug: 'voter-services',
    name: 'Voter ID Address Change & Correction (Form 8)',
    slug: 'voter-address-correction-form-8',
    description: 'Correction of name, DOB, address, or constituency transfer in Voter EPIC card.',
    eligibility: 'Registered voters needing data updates.',
    processing_time: '10-20 Working Days',
    fee: 25,
    fields: [
      { name: 'epic_no', label: '10-Character Voter EPIC Number', type: 'text', placeholder: 'ABC1234567', required: true },
      { name: 'correction_type', label: 'Modification Type', type: 'select', options: ['Address Shift (Within or Outside Constituency)', 'Name / DOB Correction', 'Photograph Replacement', 'Replacement EPIC Card'], required: true },
      { name: 'new_address', label: 'New Address / Corrected Information', type: 'textarea', placeholder: 'Door No, Street, City, Pincode', required: true }
    ],
    documents: [
      { name: 'Voter EPIC Card Copy', description: 'Copy of existing voter ID', required: true },
      { name: 'Valid New Address Proof', description: 'Aadhaar Card, Passport, or EB Bill', required: true }
    ]
  },
  'voter-aadhaar-linking-form-6b': {
    id: 803,
    category_name: 'Voter Services',
    category_slug: 'voter-services',
    name: 'Voter ID Aadhaar Linking (Form 6B)',
    slug: 'voter-aadhaar-linking-form-6b',
    description: 'Link 12-digit Aadhaar number with Voter EPIC card for authentication.',
    eligibility: 'All registered voters holding Aadhaar.',
    processing_time: '3-7 Working Days',
    fee: 0,
    fields: [
      { name: 'epic_no', label: '10-Character Voter EPIC Number', type: 'text', placeholder: 'ABC1234567', required: true },
      { name: 'aadhaar_number', label: '12-Digit Aadhaar Number', type: 'text', placeholder: '1234 5678 9012', required: true },
      { name: 'mobile_number', label: 'Linked Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: [
      { name: 'Voter EPIC Card Copy', description: 'Copy of voter card', required: true },
      { name: 'Aadhaar Card Copy', description: 'Copy of Aadhaar card', required: true }
    ]
  },
  'epic-digital-download': {
    id: 804,
    category_name: 'Voter Services',
    category_slug: 'voter-services',
    name: 'Download Digital e-EPIC Voter Card',
    slug: 'epic-digital-download',
    description: 'Download official PDF copy of Voter ID card.',
    eligibility: 'Voters registered with unique mobile number on ECI portal.',
    processing_time: 'Instant / 1 Hour',
    fee: 25,
    fields: [
      { name: 'epic_no', label: '10-Character Voter EPIC Number', type: 'text', placeholder: 'ABC1234567', required: true },
      { name: 'mobile_number', label: 'Registered Mobile Number', type: 'phone', placeholder: '9876543210', required: true }
    ],
    documents: []
  },
  'replacement-voter-card': {
    id: 805,
    category_name: 'Voter Services',
    category_slug: 'voter-services',
    name: 'Order Replacement PVC Voter Card',
    slug: 'replacement-voter-card',
    description: 'Reissue physical plastic Voter ID card for lost or damaged EPIC card.',
    eligibility: 'Registered voters with lost or damaged Voter card.',
    processing_time: '10-15 Working Days',
    fee: 50,
    fields: [
      { name: 'epic_no', label: '10-Character Voter EPIC Number', type: 'text', placeholder: 'ABC1234567', required: true },
      { name: 'reason', label: 'Reason for Replacement', type: 'select', options: ['Lost Voter ID Card', 'Damaged / Mutilated Card', 'Faded Photograph / Old Format'], required: true },
      { name: 'delivery_address', label: 'Delivery Address', type: 'textarea', placeholder: 'Door No, Street Name, Area, City', required: true }
    ],
    documents: [
      { name: 'Aadhaar Card Copy', description: 'Copy of Aadhaar card', required: true },
      { name: 'FIR Copy / Damaged Card', description: 'Police acknowledgement for lost card or damaged card copy', required: false }
    ]
  },
  'nri-voter-registration-form-6a': {
    id: 806,
    category_name: 'Voter Services',
    category_slug: 'voter-services',
    name: 'Overseas NRI Voter Registration (Form 6A)',
    slug: 'nri-voter-registration-form-6a',
    description: 'Voter registration for non-resident Indian citizens residing abroad.',
    eligibility: 'Indian passport holders living abroad.',
    processing_time: '15-30 Working Days',
    fee: 0,
    fields: [
      { name: 'passport_number', label: 'Indian Passport Number', type: 'text', placeholder: 'Z1234567', required: true },
      { name: 'overseas_address', label: 'Overseas Address Abroad', type: 'textarea', placeholder: 'Building No, Street, City, Country', required: true },
      { name: 'native_constituency', label: 'Native Assembly Constituency in India', type: 'text', placeholder: 'Mylapore', required: true }
    ],
    documents: [
      { name: 'Indian Passport Copy', description: 'Passport bio pages with valid visa stamp', required: true },
      { name: 'Native Indian Residence Proof', description: 'Proof of address in India', required: true }
    ]
  },
  'electoral-roll-search': {
    id: 807,
    category_name: 'Voter Services',
    category_slug: 'voter-services',
    name: 'Electoral Roll Name Search & Verification',
    slug: 'electoral-roll-search',
    description: 'Verify voter name inclusion in current voter list and find polling station details.',
    eligibility: 'All citizens.',
    processing_time: 'Instant',
    fee: 0,
    fields: [
      { name: 'voter_name', label: 'Full Name of Voter', type: 'text', placeholder: 'Karthik Subramanian', required: true },
      { name: 'district', label: 'District Name', type: 'text', placeholder: 'Chennai', required: true },
      { name: 'relative_name', label: "Father's / Husband's Name", type: 'text', placeholder: 'Subramanian S', required: true }
    ],
    documents: []
  },
  'voter-deletion-objection-form-7': {
    id: 808,
    category_name: 'Voter Services',
    category_slug: 'voter-services',
    name: 'Voter Deletion & Objection (Form 7)',
    slug: 'voter-deletion-objection-form-7',
    description: 'Application for deletion of deceased or shifted voter name from electoral roll.',
    eligibility: 'Registered voters in the constituency.',
    processing_time: '15-25 Working Days',
    fee: 0,
    fields: [
      { name: 'objector_epic', label: 'Objector EPIC Number', type: 'text', placeholder: 'ABC1234567', required: true },
      { name: 'target_epic', label: 'EPIC Number to be Deleted / Shifted', type: 'text', placeholder: 'XYZ9876543', required: true },
      { name: 'reason', label: 'Deletion Reason', type: 'select', options: ['Deceased Person', 'Permanently Shifted Residence', 'Duplicate Entry'], required: true }
    ],
    documents: [
      { name: 'Death Certificate / Shifting Proof', description: 'Supporting document for deletion', required: true }
    ]
  },
  'electricity-eb-name-transfer': {
    id: 901,
    category_name: 'Utility Services',
    category_slug: 'utility-services',
    name: 'TNEB Electricity Bill Name Transfer',
    slug: 'electricity-eb-name-transfer',
    description: 'Transfer TNEB service connection name to new property purchaser or legal heir.',
    eligibility: 'New property owners or legal heirs.',
    processing_time: '15-20 Working Days',
    fee: 300,
    fields: [
      { name: 'consumer_number', label: 'TNEB Consumer / Service Number', type: 'text', placeholder: '07-123-456-789', required: true },
      { name: 'previous_owner', label: 'Previous EB Account Owner Name', type: 'text', placeholder: 'Ramesh K', required: true },
      { name: 'new_owner', label: 'New EB Account Owner Name', type: 'text', placeholder: 'Karthik S', required: true },
      { name: 'transfer_type', label: 'Name Transfer Category', type: 'select', options: ['Property Purchase / Sale Deed', 'Legal Heir Transfer (Death of Owner)', 'Gift Deed / Settlement'], required: true }
    ],
    documents: [
      { name: 'Sale Deed / Property Tax Receipt', description: 'Property ownership proof document', required: true },
      { name: 'Latest Paid EB Bill Copy', description: 'Copy of recent electricity bill paid receipt', required: true },
      { name: 'Previous Owner NOC / Death Certificate', description: 'NOC from previous owner or death certificate', required: true }
    ]
  },
  'new-eb-electricity-connection': {
    id: 902,
    category_name: 'Utility Services',
    category_slug: 'utility-services',
    name: 'New TNEB Electricity Connection Booking',
    slug: 'new-eb-electricity-connection',
    description: 'Apply for fresh domestic, commercial, or industrial TNEB electricity connection.',
    eligibility: 'Property owners or authorized tenants.',
    processing_time: '15-30 Working Days',
    fee: 500,
    fields: [
      { name: 'tariff_category', label: 'Tariff Category Required', type: 'select', options: ['Domestic (1-Phase / 3-Phase)', 'Commercial / Shop', 'Industrial', 'Agricultural Power'], required: true },
      { name: 'load_kw', label: 'Required Connected Load in kW', type: 'number', placeholder: '5', required: true },
      { name: 'property_address', label: 'Premises Installation Address', type: 'textarea', placeholder: 'Door No, Street Name, City', required: true }
    ],
    documents: [
      { name: 'Property Ownership / Patta Copy', description: 'Sale deed, Patta, or Rent Deed', required: true },
      { name: 'Building Plan Approval / Tax Receipt', description: 'Local body approval or property tax receipt', required: true },
      { name: 'Aadhaar Card Copy', description: 'Applicant identity proof', required: true }
    ]
  },
  'property-tax-assessment': {
    id: 903,
    category_name: 'Utility Services',
    category_slug: 'utility-services',
    name: 'Property Tax Assessment & Name Transfer',
    slug: 'property-tax-assessment',
    description: 'New property tax assessment, door number allotment, and owner name transfer.',
    eligibility: 'Property owners in Municipal Corporations / Town Panchayats.',
    processing_time: '15-30 Working Days',
    fee: 250,
    fields: [
      { name: 'property_type', label: 'Property Type', type: 'select', options: ['Residential Flat / House', 'Vacant Land', 'Commercial Building / Shop'], required: true },
      { name: 'plinth_area_sqft', label: 'Total Plinth Area in Sq.Ft', type: 'number', placeholder: '1250', required: true },
      { name: 'survey_door_no', label: 'Survey No. / Door No.', type: 'text', placeholder: 'Door 14, Survey 45/2', required: true }
    ],
    documents: [
      { name: 'Registered Sale Deed / Patta Copy', description: 'Title deed copy', required: true },
      { name: 'Approved Building Plan', description: 'Local corporation approved plan', required: true },
      { name: 'Aadhaar Card Copy', description: 'Owner identity proof', required: true }
    ]
  },
  'police-clearance-certificate-pcc': {
    id: 1004,
    category_name: 'Passport Services',
    category_slug: 'passport-services',
    name: 'Police Clearance Certificate (PCC) Passport',
    slug: 'police-clearance-certificate-pcc',
    description: 'PCC application assistance for emigration, employment, and foreign residence visas.',
    eligibility: 'Valid Indian Passport holders.',
    processing_time: '7-14 Working Days',
    fee: 500,
    fields: [
      { name: 'passport_number', label: 'Valid Indian Passport Number', type: 'text', placeholder: 'Z1234567', required: true },
      { name: 'passport_issue_date', label: 'Passport Issue Date', type: 'date', required: true },
      { name: 'country_applying_for', label: 'Country Requiring PCC', type: 'select', options: ['United States (USA)', 'Canada', 'United Kingdom (UK)', 'Australia', 'United Arab Emirates (UAE)', 'Singapore', 'Other'], required: true }
    ],
    documents: [
      { name: 'Indian Passport Original & Copy', description: 'Copy of first and last pages of passport', required: true },
      { name: 'Present Address Proof', description: 'Aadhaar Card, Election Card, or Bank Statement', required: true },
      { name: 'Visa / Employment Offer Letter', description: 'Copy of visa appointment or job offer', required: true }
    ]
  }
};

// Register common catalog slug aliases
const CATALOG_SLUG_ALIASES = {
  'pan-status-verification': { base: 'pan-status', fee: 0, name: 'PAN Active Status & Verification Check' },
  'pan-aadhaar-linking': { base: 'pan-aadhaar-link', fee: 50 },
  'new-pan-card-indian': { base: 'pan-card-new', fee: 110 },
  'epan-download-instant': { base: 'pan-download', fee: 30 },
  'new-smart-ration-card-application': { base: 'smart-ration-card-application', fee: 50 },
  'tatkaal-passport-urgent': { base: 'tatkal-passport-urgency', fee: 3500 },
  'passport-reissue-renewal': { base: 'passport-renewal-reissue', fee: 1500 },
  'msme-udyam-registration': { base: 'udyam-registration', fee: 100 },
  'fssai-food-license-registration': { base: 'fssai-food-license', fee: 750 },
  'aadhaar-download-print': { base: 'aadhaar-download', fee: 30 }
};

Object.entries(CATALOG_SLUG_ALIASES).forEach(([aliasSlug, config]) => {
  if (DEFAULT_SERVICES_MAP[config.base]) {
    DEFAULT_SERVICES_MAP[aliasSlug] = {
      ...DEFAULT_SERVICES_MAP[config.base],
      slug: aliasSlug,
      ...(config.fee !== undefined ? { fee: config.fee } : {}),
      ...(config.name ? { name: config.name } : {})
    };
  }
});

export const TAMIL_SERVICES_TRANSLATIONS = {
  'aadhaar-address-update': {
    name: 'ஆதார் முகவரி மாற்றம்',
    description: 'அதிகாரப்பூர்வ UIDAI தரவுத்தளத்தில் புதிய முகவரி ஆதாரத்துடன் உங்கள் முகவரியைப் புதுப்பிக்கவும்.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '3-5 வேலை நாட்கள்',
    eligibility: 'புதிய முகவரிக்கு மாறிய அல்லது முகவரி திருத்தம் தேவைப்படும் அனைத்து ஆதார் கார்டு வைத்திருப்பவர்கள்.',
    documents: [
      { name: 'முகவரிச் சான்று (PoA)', description: 'மின்சாரக் கட்டணம், வங்கி கணக்கு புத்தகம், பாஸ்போர்ட் அல்லது வாடகை ஒப்பந்தம்', required: true },
      { name: 'ஆதார் கார்டு நகல்', description: 'தற்போதுள்ள ஆதார் கார்டின் நகல்', required: true }
    ]
  },
  'aadhaar-name-update': {
    name: 'ஆதார் பெயர் திருத்தம்',
    description: 'சட்டப்பூர்வ ஆதாரப் ஆவணத்தின்படி ஆதாரில் உள்ள பெயர் பிழைகளைத் திருத்துதல்.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '5-7 வேலை நாட்கள்',
    eligibility: 'செல்லுபடியாகும் பெயர் மாற்ற ஆவணம் வைத்துள்ள ஆதார் கார்டு வைத்திருப்பவர்கள்.',
    documents: [
      { name: 'அடையாளச் சான்று', description: 'வாக்காளர் அடையாள அட்டை, பாஸ்போர்ட், PAN கார்டு அல்லது கெஜட் சான்றிதழ்', required: true },
      { name: 'ஆதார் நகல்', description: 'தற்போதுள்ள ஆதார் கார்டு நகல்', required: true }
    ]
  },
  'aadhaar-name-dob-correction': {
    name: 'ஆதார் பெயர் மற்றும் பிறந்த தேதி திருத்தம்',
    description: 'சட்டப்பூர்வ ஆதாரப் ஆவணத்தின்படி ஆதாரில் உள்ள பெயர் மற்றும் பிறந்த தேதி பிழைகளைத் திருத்துதல்.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '5-7 வேலை நாட்கள்',
    eligibility: 'பிறந்த தேதி சான்று வைத்துள்ள ஆதார் பயனாளர்கள்.',
    documents: [
      { name: 'பிறந்த தேதி சான்று', description: 'பிறப்புச் சான்றிதழ் / 10 ஆம் வகுப்பு மதிப்பெண் சான்றிதழ் / பாஸ்போர்ட்', required: true },
      { name: 'ஆதார் நகல்', description: 'தற்போதுள்ள ஆதார் கார்டு நகல்', required: true }
    ]
  },
  'aadhaar-mobile-update': {
    name: 'ஆதார் மொபைல் எண் இணைப்பு',
    description: 'OTP சரிபார்ப்பிற்காக உங்கள் மொபைல் எண்ணை ஆதாரத்துடன் இணைக்கவும் அல்லது புதுப்பிக்கவும்.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '24-48 மணி நேரம்',
    eligibility: 'மொபைல் எண் இணைப்பு தேவைப்படும் அனைத்து ஆதார் பயனாளர்கள்.',
    documents: [
      { name: 'ஆதார் கார்டு நகல்', description: 'தற்போதுள்ள ஆதார் கார்டின் நகல்', required: true }
    ]
  },
  'pvc-aadhaar-card-order': {
    name: 'PVC ஆதார் கார்டு ஆர்டர்',
    description: 'நீடித்து உழைக்கும், நீர்ப்புகா பிளாஸ்டிக் PVC ஆதார் கார்டை உங்கள் வீட்டிற்கே பெற விண்ணப்பிக்கவும்.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்',
    eligibility: 'பதிவுசெய்த அனைத்து ஆதார் அட்டைதாரர்கள்.',
    documents: [
      { name: 'ஆதார் கார்டு நகல்', description: 'தற்போதுள்ள ஆதார் கார்டின் நகல்', required: true }
    ]
  },
  'pvc-aadhaar-card': {
    name: 'PVC ஆதார் கார்டு ஆர்டர்',
    description: 'நீடித்து உழைக்கும், நீர்ப்புகா பிளாஸ்டிக் PVC ஆதார் கார்டை உங்கள் வீட்டிற்கே பெற விண்ணப்பிக்கவும்.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்',
    eligibility: 'பதிவுசெய்த அனைத்து ஆதார் அட்டைதாரர்கள்.',
    documents: [
      { name: 'ஆதார் கார்டு நகல்', description: 'தற்போதுள்ள ஆதார் கார்டின் நகல்', required: true }
    ]
  },
  'new-aadhaar-enrollment-booking': {
    name: 'புதிய ஆதார் பதிவு முன்பதிவு',
    description: 'புதிய ஆதார் அட்டை பெறுவதற்கான முன்பதிவு மற்றும் விண்ணப்ப பதிவு உதவி.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '15-30 வேலை நாட்கள்',
    eligibility: 'இன்னும் ஆதார் அட்டை பெறாத அனைத்து இந்திய குடிமக்கள்.',
    documents: [
      { name: 'பிறப்புச் சான்றிதழ் / அடையாளச் சான்று', description: 'பிறப்புச் சான்றிதழ் அல்லது அரசு அடையாளச் சான்று', required: true },
      { name: 'பெற்றோர் ஆதார் (குழந்தைகளுக்கு)', description: 'பெற்றோரின் ஆதார் நகல்', required: true }
    ]
  },
  'pan-new-application': {
    name: 'புதிய PAN கார்டு விண்ணப்பம் (படிவம் 49A)',
    description: 'தனிநபர்கள் மற்றும் நிறுவனங்களுக்கான புதிய நிரந்தர கணக்கு எண் (PAN) கார்டுக்கு விண்ணப்பிக்கவும்.',
    category_name: 'PAN சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்',
    eligibility: 'நிதி மற்றும் வரி நோக்கங்களுக்காக PAN தேவைப்படும் இந்திய குடிமக்கள்.',
    documents: [
      { name: 'அடையாளச் சான்று', description: 'ஆதார் கார்டு / வாக்காளர் அட்டை / பாஸ்போர்ட்', required: true },
      { name: 'முகவரிச் சான்று', description: 'ஆதார் கார்டு / மின்சாரக் கட்டணம் / வங்கி கணக்கு புத்தகம்', required: true },
      { name: 'பிறந்த தேதி சான்று', description: 'பிறப்புச் சான்றிதழ் / 10வது மதிப்பெண் சான்றிதழ் / ஆதார் கார்டு', required: true }
    ]
  },
  'new-pan-card': {
    name: 'புதிய PAN கார்டு விண்ணப்பம் (படிவம் 49A)',
    description: 'தனிநபர்கள் மற்றும் நிறுவனங்களுக்கான புதிய நிரந்தர கணக்கு எண் (PAN) கார்டுக்கு விண்ணப்பிக்கவும்.',
    category_name: 'PAN சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்',
    eligibility: 'நிதி மற்றும் வரி நோக்கங்களுக்காக PAN தேவைப்படும் இந்திய குடிமக்கள்.',
    documents: [
      { name: 'அடையாளச் சான்று', description: 'ஆதார் கார்டு / வாக்காளர் அட்டை / பாஸ்போர்ட்', required: true },
      { name: 'முகவரிச் சான்று', description: 'ஆதார் கார்டு / மின்சாரக் கட்டணம் / வங்கி கணக்கு புத்தகம்', required: true },
      { name: 'பிறந்த தேதி சான்று', description: 'பிறப்புச் சான்றிதழ் / 10வது மதிப்பெண் சான்றிதழ் / ஆதார் கார்டு', required: true }
    ]
  },
  'new-pan-card-application': {
    name: 'புதிய PAN கார்டு விண்ணப்பம் (படிவம் 49A)',
    description: 'தனிநபர்கள் மற்றும் நிறுவனங்களுக்கான புதிய நிரந்தர கணக்கு எண் (PAN) கார்டுக்கு விண்ணப்பிக்கவும்.',
    category_name: 'PAN சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்',
    eligibility: 'நிதி மற்றும் வரி நோக்கங்களுக்காக PAN தேவைப்படும் இந்திய குடிமக்கள்.',
    documents: [
      { name: 'அடையாளச் சான்று', description: 'ஆதார் கார்டு / வாக்காளர் அட்டை / பாஸ்போர்ட்', required: true },
      { name: 'முகவரிச் சான்று', description: 'ஆதார் கார்டு / மின்சாரக் கட்டணம் / வங்கி கணக்கு புத்தகம்', required: true },
      { name: 'பிறந்த தேதி சான்று', description: 'பிறப்புச் சான்றிதழ் / 10வது மதிப்பெண் சான்றிதழ் / ஆதார் கார்டு', required: true }
    ]
  },
  'pan-correction-update': {
    name: 'PAN கார்டு திருத்தம் / புதுப்பித்தல்',
    description: 'PAN அட்டையில் பெயர், தந்தை பெயர், பிறந்த தேதி அல்லது புகைப்படப் பிழைகளைத் திருத்துதல்.',
    category_name: 'PAN சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்',
    eligibility: 'PAN விவரங்களில் திருத்தம் செய்ய விரும்பும் கார்டு வைத்திருப்பவர்கள்.',
    documents: [
      { name: 'தற்போதுள்ள PAN நகல்', description: 'தற்போதுள்ள PAN அட்டையின் நகல்', required: true },
      { name: 'திருத்தத்திற்கான ஆதார ஆவணம்', description: 'ஆதார் கார்டு / பாஸ்போர்ட் / கெஜட் சான்றிதழ்', required: true }
    ]
  },
  'pan-card-correction-update': {
    name: 'PAN கார்டு திருத்தம் / புதுப்பித்தல்',
    description: 'PAN அட்டையில் பெயர், தந்தை பெயர், பிறந்த தேதி அல்லது புகைப்படப் பிழைகளைத் திருத்துதல்.',
    category_name: 'PAN சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்',
    eligibility: 'PAN விவரங்களில் திருத்தம் செய்ய விரும்பும் கார்டு வைத்திருப்பவர்கள்.',
    documents: [
      { name: 'தற்போதுள்ள PAN நகல்', description: 'தற்போதுள்ள PAN அட்டையின் நகல்', required: true },
      { name: 'திருத்தத்திற்கான ஆதார ஆவணம்', description: 'ஆதார் கார்டு / பாஸ்போர்ட் / கெஜட் சான்றிதழ்', required: true }
    ]
  },
  'pan-aadhaar-link': {
    name: 'PAN - ஆதார் எண் இணைப்பு',
    description: 'வருமான வரி விதிமுறைகளின்படி உங்கள் PAN எண்ணை 12 இலக்க ஆதார் எண்ணுடன் இணைத்தல்.',
    category_name: 'PAN சேவைகள்',
    processing_time: '24-48 மணி நேரம்',
    eligibility: 'இன்னும் ஆதாரை PAN-டன் இணைக்காத கார்டு வைத்திருப்பவர்கள்.',
    documents: [
      { name: 'PAN நகல்', description: 'PAN கார்டின் நகல்', required: true },
      { name: 'ஆதார் நகல்', description: 'ஆதார் கார்டின் நகல்', required: true }
    ]
  },
  'voter-form-6': {
    name: 'புதிய வாக்காளர் பதிவு (படிவம் 6)',
    description: 'வாக்காளர் பட்டியலில் பெயர் சேர்த்தல் மற்றும் புதிய EPIC வாக்காளர் அடையாள அட்டை பெற விண்ணப்பித்தல்.',
    category_name: 'வாக்காளர் அடையாள அட்டை சேவைகள்',
    processing_time: '15-25 வேலை நாட்கள்',
    eligibility: '18 வயது பூர்த்தியடைந்த இந்திய குடிமக்கள்.',
    documents: [
      { name: 'வயதுச் சான்று', description: 'பிறப்புச் சான்றிதழ் / 10ஆம் வகுப்பு சான்றிதழ் / ஆதார் கார்டு', required: true },
      { name: 'இருப்பிடச் சான்று', description: 'ரேஷன் கார்டு / மின்சாரக் கட்டணம் / வங்கி கணக்கு புத்தகம்', required: true },
      { name: 'பாஸ்போர்ட் புகைப்படம்', description: 'சமீபத்திய வண்ண புகைப்படம்', required: true }
    ]
  },
  'new-voter-registration-form-6': {
    name: 'புதிய வாக்காளர் பதிவு (படிவம் 6)',
    description: 'வாக்காளர் பட்டியலில் பெயர் சேர்த்தல் மற்றும் புதிய EPIC வாக்காளர் அடையாள அட்டை பெற விண்ணப்பித்தல்.',
    category_name: 'வாக்காளர் அடையாள அட்டை சேவைகள்',
    processing_time: '15-25 வேலை நாட்கள்',
    eligibility: '18 வயது பூர்த்தியடைந்த இந்திய குடிமக்கள்.',
    documents: [
      { name: 'வயதுச் சான்று', description: 'பிறப்புச் சான்றிதழ் / 10ஆம் வகுப்பு சான்றிதழ் / ஆதார் கார்டு', required: true },
      { name: 'இருப்பிடச் சான்று', description: 'ரேஷன் கார்டு / மின்சாரக் கட்டணம் / வங்கி கணக்கு புத்தகம்', required: true },
      { name: 'பாஸ்போர்ட் புகைப்படம்', description: 'சமீபத்திய வண்ண புகைப்படம்', required: true }
    ]
  },
  'voter-form-8': {
    name: 'வாக்காளர் அட்டையில் முகவரி மாற்றம் / திருத்தம் (படிவம் 8)',
    description: 'வாக்காளர் அட்டையில் முகவரி மாற்றம் மற்றும் பிற விவரங்களைத் திருத்துதல்.',
    category_name: 'வாக்காளர் அடையாள அட்டை சேவைகள்',
    processing_time: '10-15 வேலை நாட்கள்',
    eligibility: 'பதிவுசெய்த வாக்காளர்கள்.',
    documents: [
      { name: 'வாக்காளர் அட்டை நகல்', description: 'தற்போதுள்ள EPIC வாக்காளர் அட்டையின் நகல்', required: true },
      { name: 'முகவரி / திருத்தச் சான்று', description: 'ஆதார் கார்டு / வாடகை ஒப்பந்தம் / மின்சாரக் கட்டணம்', required: true }
    ]
  },
  'voter-address-transfer-form-8': {
    name: 'வாக்காளர் அட்டையில் முகவரி மாற்றம் / திருத்தம் (படிவம் 8)',
    description: 'வாக்காளர் அட்டையில் முகவரி மாற்றம் மற்றும் பிற விவரங்களைத் திருத்துதல்.',
    category_name: 'வாக்காளர் அடையாள அட்டை சேவைகள்',
    processing_time: '10-15 வேலை நாட்கள்',
    eligibility: 'பதிவுசெய்த வாக்காளர்கள்.',
    documents: [
      { name: 'வாக்காளர் அட்டை நகல்', description: 'தற்போதுள்ள EPIC வாக்காளர் அட்டையின் நகல்', required: true },
      { name: 'முகவரி / திருத்தச் சான்று', description: 'ஆதார் கார்டு / வாடகை ஒப்பந்தம் / மின்சாரக் கட்டணம்', required: true }
    ]
  },
  'income-certificate': {
    name: 'வருமானச் சான்றிதழ் விண்ணப்பம்',
    description: 'கல்வி மற்றும் அரசு நலத்திட்டங்களுக்கான குடும்பத்தின் ஆண்டின் மொத்த வருமானச் சான்றிதழ்.',
    category_name: 'சான்றிதழ் சேவைகள்',
    processing_time: '7 வேலை நாட்கள்',
    eligibility: 'அரசுத் திட்டங்களுக்கு வருமானச் சான்று தேவைப்படும் நிரந்தர மாநில வாசிகள்.',
    documents: [
      { name: 'புகைப்படம்', description: 'பாஸ்போர்ட் அளவு புகைப்படம்', required: true },
      { name: 'முகவரிச் சான்று', description: 'ஸ்மார்ட் ரேஷன் கார்டு / ஆதார் கார்டு', required: true },
      { name: 'வருமானச் சான்று', description: 'சம்பளச் சீட்டு / வருமான வரி ரிட்டர்ன் / சுய அறிவிப்பு படிவம்', required: true }
    ]
  },
  'community-certificate': {
    name: 'சாதிச் சான்றிதழ் / சமூகச் சான்றிதழ்',
    description: 'சமூகப் பிரிவு (BC / MBC / SC / ST) சரிபார்ப்புக்கான அதிகாரப்பூர்வ வருவாய்த்துறை சான்றிதழ்.',
    category_name: 'சான்றிதழ் சேவைகள்',
    processing_time: '15 வேலை நாட்கள்',
    eligibility: 'கல்வி மற்றும் வேலைவாய்ப்பு இடஒதுக்கீடு பெற விரும்புவோர்.',
    documents: [
      { name: 'விண்ணப்பதாரர் புகைப்படம்', description: 'பாஸ்போர்ட் அளவு புகைப்படம்', required: true },
      { name: 'முகவரிச் சான்று', description: 'ரேஷன் கார்டு / ஆதார் கார்டு', required: true },
      { name: 'பெற்றோர் சாதிச் சான்றிதழ்', description: 'தந்தை அல்லது உடன்பிறந்தாரின் சாதிச் சான்றிதழ்', required: true }
    ]
  },
  'community-caste-certificate': {
    name: 'சாதிச் சான்றிதழ் / சமூகச் சான்றிதழ்',
    description: 'சமூகப் பிரிவு (BC / MBC / SC / ST) சரிபார்ப்புக்கான அதிகாரப்பூர்வ வருவாய்த்துறை சான்றிதழ்.',
    category_name: 'சான்றிதழ் சேவைகள்',
    processing_time: '15 வேலை நாட்கள்',
    eligibility: 'கல்வி மற்றும் வேலைவாய்ப்பு இடஒதுக்கீடு பெற விரும்புவோர்.',
    documents: [
      { name: 'விண்ணப்பதாரர் புகைப்படம்', description: 'பாஸ்போர்ட் அளவு புகைப்படம்', required: true },
      { name: 'முகவரிச் சான்று', description: 'ரேஷன் கார்டு / ஆதார் கார்டு', required: true },
      { name: 'பெற்றோர் சாதிச் சான்றிதழ்', description: 'தந்தை அல்லது உடன்பிறந்தாரின் சாதிச் சான்றிதழ்', required: true }
    ]
  },
  'nativity-residence-certificate': {
    name: 'இருப்பிடச் சான்றிதழ் / இருப்பிடச் சான்று',
    description: 'மாநில நிரந்தர இருப்பிடச் சான்று மற்றும் சலுகைகளுக்கான அதிகாரப்பூர்வ சான்றிதழ்.',
    category_name: 'சான்றிதழ் சேவைகள்',
    processing_time: '7 வேலை நாட்கள்',
    eligibility: '5 ஆண்டுகளுக்கும் மேலாக மாநிலத்தில் வசிக்கும் குடிமக்கள்.',
    documents: [
      { name: 'புகைப்படம் & ஆதார் கார்டு', description: 'விண்ணப்பதாரர் புகைப்படம் மற்றும் ஆதார் நகல்', required: true },
      { name: 'தொடர் இருப்பிடச் சான்று', description: 'ரேஷன் கார்டு / வாக்காளர் அட்டை / 5 வருட சொத்துவரி ரசீது', required: true }
    ]
  },
  'native-domicile-certificate': {
    name: 'இருப்பிடச் சான்றிதழ் / இருப்பிடச் சான்று',
    description: 'மாநில நிரந்தர இருப்பிடச் சான்று மற்றும் சலுகைகளுக்கான அதிகாரப்பூர்வ சான்றிதழ்.',
    category_name: 'சான்றிதழ் சேவைகள்',
    processing_time: '7 வேலை நாட்கள்',
    eligibility: '5 ஆண்டுகளுக்கும் மேலாக மாநிலத்தில் வசிக்கும் குடிமக்கள்.',
    documents: [
      { name: 'புகைப்படம் & ஆதார் கார்டு', description: 'விண்ணப்பதாரர் புகைப்படம் மற்றும் ஆதார் நகல்', required: true },
      { name: 'தொடர் இருப்பிடச் சான்று', description: 'ரேஷன் கார்டு / வாக்காளர் அட்டை / 5 வருட சொத்துவரி ரசீது', required: true }
    ]
  },
  'first-graduate-certificate': {
    name: 'முதல் பட்டதாரி சான்றிதழ்',
    description: 'குடும்பத்தில் முதல்முறையாக பட்டம் பயிலும் மாணவர்களுக்கான கட்டணச் சலுகை சான்றிதழ்.',
    category_name: 'சான்றிதழ் சேவைகள்',
    processing_time: '10 வேலை நாட்கள்',
    eligibility: 'குடும்பத்தில் பட்டதாரி இல்லாத கல்லூரி சேர்க்கை மாணவர்கள்.',
    documents: [
      { name: 'குடும்ப ஸ்மார்ட் ரேஷன் கார்டு', description: 'குடும்ப உறுப்பினர்கள் அடங்கிய ரேஷன் கார்டு நகல்', required: true },
      { name: 'குடும்ப உறுப்பினர்களின் கல்விச் சான்றிதழ்கள்', description: 'உடன்பிறந்தோர்/பெற்றோரின் 10/12ஆவது மதிப்பெண் சான்றிதழ்', required: true },
      { name: 'கூட்டு சுய அறிவிப்பு படிவம்', description: 'கையொப்பமிட்ட சுய அறிவிப்பு படிவம்', required: true }
    ]
  },
  'legal-heir-certificate': {
    name: 'வாரிசுச் சான்றிதழ் விண்ணப்பம்',
    description: 'இறந்த நபரின் சட்டப்பூர்வ வாரிசுகளை உறுதிப்படுத்தும் அதிகாரப்பூர்வ வருவாய்த்துறை சான்றிதழ்.',
    category_name: 'சான்றிதழ் சேவைகள்',
    processing_time: '15-30 வேலை நாட்கள்',
    eligibility: 'இறந்த நபரின் நேரடி குடும்ப உறுப்பினர்கள் (மனைவி, குழந்தைகள், பெற்றோர்).',
    documents: [
      { name: 'இறப்புச் சான்றிதழ்', description: 'அதிகாரப்பூர்வ இறப்புச் சான்றிதழ்', required: true },
      { name: 'அனைத்து வாரிசுகளின் ஆதார்', description: 'அனைத்து சட்டப்பூர்வ வாரிசுகளின் ஆதார் நகல்கள்', required: true },
      { name: 'இறந்தவரின் ரேஷன் கார்டு', description: 'ஸ்மார்ட் ரேஷன் கார்டு நகல்', required: true }
    ]
  },
  'patta-transfer-application': {
    name: 'பட்டா / சிட்டா பெயர் மாற்றம்',
    description: 'நிலம் வாங்கிய பின் அல்லது வாரிசு அடிப்படையில் பட்டாவில் பெயர் மாற்றம் செய்ய விண்ணப்பித்தல்.',
    category_name: 'நிலம் & பட்டா சேவைகள்',
    processing_time: '15-30 வேலை நாட்கள்',
    eligibility: 'பத்திரப் பதிவு முடிந்த நிலக் கிரையதாரர்கள் அல்லது வாரிசுகள்.',
    documents: [
      { name: 'பதிவு செய்யப்பட்ட கிரையப் பத்திரம்', description: 'நிலக் கிரையப் பத்திர நகல்', required: true },
      { name: 'தற்போதுள்ள பட்டா / சிட்டா', description: 'முந்தைய உரிமையாளரின் பட்டா நகல்', required: true },
      { name: 'வில்லங்கச் சான்றிதழ் (EC)', description: '13+ ஆண்டுகளுக்கான வில்லங்கச் சான்றிதழ்', required: true }
    ]
  },
  'chitta-extract-download': {
    name: 'A-பதிவேடு & சிட்டா நகல் பதிவிறக்கம்',
    description: 'நில உரிமையின் அதிகாரப்பூர்வ டிஜிட்டல் சிட்டா மற்றும் A-பதிவேடு நகல் பெறுதல்.',
    category_name: 'நிலம் & பட்டா சேவைகள்',
    processing_time: '1-2 வேலை நாட்கள்',
    eligibility: 'நில உரிமையாளர்கள்.',
    documents: [
      { name: 'பட்டா நகல் / சொத்துவரி ரசீது', description: 'நில உரிமைச் சான்று நகல்', required: true }
    ]
  },
  'chitta-extract-fmb-download': {
    name: 'A-பதிவேடு & சிட்டா நகல் பதிவிறக்கம்',
    description: 'நில உரிமையின் அதிகாரப்பூர்வ டிஜிட்டல் சிட்டா மற்றும் A-பதிவேடு நகல் பெறுதல்.',
    category_name: 'நிலம் & பட்டா சேவைகள்',
    processing_time: '1-2 வேலை நாட்கள்',
    eligibility: 'நில உரிமையாளர்கள்.',
    documents: [
      { name: 'பட்டா நகல் / சொத்துவரி ரசீது', description: 'நில உரிமைச் சான்று நகல்', required: true }
    ]
  },
  'fmb-sketch-map': {
    name: 'FMB வரைபடம் பதிவிறக்கம்',
    description: 'நில எல்லை அளவீடுகளைக் காட்டும் Field Measurement Book (FMB) வரைபட நகல் பெற விண்ணப்பித்தல்.',
    category_name: 'நிலம் & பட்டா சேவைகள்',
    processing_time: '2-3 வேலை நாட்கள்',
    eligibility: 'நில எல்லை அளவீடு தேவைப்படும் உரிமையாளர்கள்.',
    documents: [
      { name: 'பட்டா நகல்', description: 'பட்டா ஆவணத்தின் நகல்', required: true }
    ]
  },
  'encumbrance-certificate-ec': {
    name: 'வில்லங்கச் சான்றிதழ் (EC) விண்ணப்பம்',
    description: 'சொத்தின் பரிவர்த்தனை மற்றும் உரிமை வரலாற்றை உறுதிப்படுத்தும் வில்லங்கச் சான்றிதழ் பெறுதல்.',
    category_name: 'நிலம் & பட்டா சேவைகள்',
    processing_time: '3-5 வேலை நாட்கள்',
    eligibility: 'சொத்து வாங்குபவர்கள் மற்றும் வங்கி கடன் விண்ணப்பதாரர்கள்.',
    documents: [
      { name: 'முந்தைய கிரையப் பத்திர நகல்', description: 'பதிவுசெய்யப்பட்ட பத்திர நகல்', required: true }
    ]
  },
  'fresh-passport-application': {
    name: 'புதிய பாஸ்போர்ட் விண்ணப்பம்',
    description: 'புதிய இந்திய பாஸ்போர்ட் விண்ணப்பப் பதிவு மற்றும் நேர்காணல் நேரம் முன்பதிவு செய்தல்.',
    category_name: 'பாஸ்போர்ட் சேவைகள்',
    processing_time: '15-20 வேலை நாட்கள்',
    eligibility: 'வெளிநாடு செல்ல விரும்பும் இந்திய குடிமக்கள்.',
    documents: [
      { name: 'பிறந்த தேதி சான்று', description: 'ஆதார் கார்டு / பிறப்புச் சான்றிதழ் / 10ஆவது மதிப்பெண் சான்றிதழ்', required: true },
      { name: 'முகவரிச் சான்று', description: 'ஆதார் கார்டு / வாக்காளர் அட்டை / வங்கி கணக்கு புத்தகம்', required: true },
      { name: 'Non-ECR சான்று', description: '10ஆம் வகுப்பு சான்றிதழ் அல்லது பட்டப் படிப்புச் சான்றிதழ்', required: true }
    ]
  },
  'passport-reissue-application': {
    name: 'பாஸ்போர்ட் புதுப்பித்தல் (Re-Issue)',
    description: 'காலாவதியான அல்லது பக்கங்கள் முடிந்த பாஸ்போர்ட்டை புதுப்பிக்க விண்ணப்பித்தல்.',
    category_name: 'பாஸ்போர்ட் சேவைகள்',
    processing_time: '10-15 வேலை நாட்கள்',
    eligibility: 'காலாவதியாகும் நிலையில் பாஸ்போர்ட் வைத்துள்ள உரிமையாளர்கள்.',
    documents: [
      { name: 'பழைய பாஸ்போர்ட் அசல் & நகல்', description: 'முதல் மற்றும் கடைசி 2 பக்கங்களின் நகல்', required: true },
      { name: 'தற்போதைய முகவரிச் சான்று', description: 'ஆதார் / வங்கி புத்தகம் / மின்சாரக் கட்டணம்', required: true }
    ]
  },
  'learner-licence-llr-booking': {
    name: 'ஓட்டுநர் பழகுநர் உரிமம் (LLR) முன்பதிவு',
    description: 'இருசக்கர மற்றும் நான்கு சக்கர வாகனங்களுக்கான LLR பழகுநர் உரிமம் விண்ணப்பம்.',
    category_name: 'வாகனம் & ஓட்டுநர் உரிம சேவைகள்',
    processing_time: '3-5 வேலை நாட்கள்',
    eligibility: '16+ வயது (50cc கியர் இல்லாத வாகனம்) அல்லது 18+ வயது (நான்கு சக்கர வாகனம்).',
    documents: [
      { name: 'வயதுச் சான்று', description: 'ஆதார் / பிறப்புச் சான்றிதழ் / பாஸ்போர்ட்', required: true },
      { name: 'முகவரிச் சான்று', description: 'ஆதார் கார்டு / ரேஷன் கார்டு', required: true }
    ]
  },
  'driving-licence-renewal': {
    name: 'ஓட்டுநர் உரிமம் (DL) புதுப்பித்தல்',
    description: 'காலாவதியான ஓட்டுநர் உரிமத்தை RTO மூலம் புதுப்பிக்க விண்ணப்பித்தல்.',
    category_name: 'வாகனம் & ஓட்டுநர் உரிம சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்',
    eligibility: 'காலாவதியான ஓட்டுநர் உரிமம் வைத்திருப்பவர்கள்.',
    documents: [
      { name: 'அசல் DL நகல்', description: 'தற்போதுள்ள DL-ன் முன் மற்றும் பின் பக்க நகல்', required: true },
      { name: 'முகவரிச் சான்று', description: 'ஆதார் கார்டு நகல்', required: true }
    ]
  },
  'udyam-msme-registration': {
    name: 'உத்யம் MSME அரசு பதிவு',
    description: 'சிறு, குறு மற்றும் நடுத்தர தொழில்களுக்கான மத்திய அரசின் அதிகாரப்பூர்வ பதிவுச் சான்றிதழ்.',
    category_name: 'வணிகச் சேவைகள்',
    processing_time: '1-2 வேலை நாட்கள்',
    eligibility: 'தொழில் தொடங்கும் அனைத்து நிறுவன உரிமையாளர்கள்.',
    documents: [
      { name: 'ஆதார் & PAN நகல்', description: 'உரிமையாளரின் அடையாளச் சான்றுகள்', required: true },
      { name: 'வங்கி கணக்கு புத்தகம்', description: 'வணிக வங்கி கணக்கு சான்று', required: true }
    ]
  },
  'gst-registration-application': {
    name: 'GST பதிவு விண்ணப்பம்',
    description: 'வணிக நிறுவனங்களுக்கான 15 இலக்க சரக்கு மற்றும் சேவை வரி (GSTIN) பதிவு.',
    category_name: 'வணிகச் சேவைகள்',
    processing_time: '3-7 வேலை நாட்கள்',
    eligibility: 'வர்த்தக வரம்பு தாண்டிய வணிக நிறுவனங்கள்.',
    documents: [
      { name: 'PAN & ஆதார் நகல்', description: 'உரிமையாளர் அடையாளச் சான்றுகள்', required: true },
      { name: 'வணிக முகவரிச் சான்று', description: 'மின்சாரக் கட்டணம் / வாடகை ஒப்பந்தம்', required: true }
    ]
  },
  'tnegedco-eb-name-transfer': {
    name: 'மின்சார இணைப்பு (EB) பெயர் மாற்றம்',
    description: 'வீடு அல்லது சொத்து வாங்கிய பின் மின்சார வாரிய (TANGEDCO) இணைப்பில் பெயர் மாற்றம் செய்தல்.',
    category_name: 'பயன்பாட்டுச் சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்',
    eligibility: 'புதிய சொத்து உரிமையாளர்கள்.',
    documents: [
      { name: 'கிரையப் பத்திர நகல்', description: 'சொத்து உரிமைப் பத்திரம்', required: true },
      { name: 'கடைசி EB கட்டண ரசீது', description: 'கட்டணம் செலுத்திய ரசீது', required: true }
    ]
  },
  'electricity-eb-name-transfer': {
    name: 'மின்சார இணைப்பு (EB) பெயர் மாற்றம்',
    description: 'வீடு அல்லது சொத்து வாங்கிய பின் மின்சார வாரிய (TANGEDCO) இணைப்பில் பெயர் மாற்றம் செய்தல்.',
    category_name: 'பயன்பாட்டுச் சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்',
    eligibility: 'புதிய சொத்து உரிமையாளர்கள்.',
    documents: [
      { name: 'கிரையப் பத்திர நகல்', description: 'சொத்து உரிமைப் பத்திரம்', required: true },
      { name: 'கடைசி EB கட்டண ரசீது', description: 'கட்டணம் செலுத்திய ரசீது', required: true }
    ]
  },
  'new-electricity-eb-connection': {
    name: 'புதிய மின்சார இணைப்பு (EB) விண்ணப்பம்',
    description: 'புதிய கட்டிடங்கள் மற்றும் வீடுகளுக்கான புதிய மின்சார இணைப்பு பெறுதல்.',
    category_name: 'பயன்பாட்டுச் சேவைகள்',
    processing_time: '10-15 வேலை நாட்கள்',
    eligibility: 'புதிய கட்டிட உரிமையாளர்கள்.',
    documents: [
      { name: 'சொத்துவரி ரசீது / உரிமைச் சான்று', description: 'சொத்து ஆவண நகல்', required: true },
      { name: 'ஆதார் கார்டு நகல்', description: 'விண்ணப்பதாரர் ஆதார் நகல்', required: true }
    ]
  },
  'smart-ration-card-application': {
    name: 'புதிய ஸ்மார்ட் ரேஷன் கார்டு விண்ணப்பம்',
    description: 'புதிதாக திருமணமான குடும்பங்களுக்கான புதிய ஸ்மார்ட் ரேஷன் கார்டு விண்ணப்பம்.',
    category_name: 'ரேஷன் கார்டு சேவைகள்',
    processing_time: '15-30 வேலை நாட்கள்',
    eligibility: 'புதிதாகத் திருமணமான தம்பதிகள் அல்லது தனி குடும்பங்கள்.',
    documents: [
      { name: 'அனைத்து உறுப்பினர்களின் ஆதார்', description: 'குடும்ப உறுப்பினர்கள் அனைவரின் ஆதார் நகல்கள்', required: true },
      { name: 'திருமணச் சான்றிதழ் / ரேஷன் கார்டு நீக்கல் சான்று', description: 'பெற்றோர் ரேஷன் கார்டிலிருந்து பெயர் நீக்கப்பட்ட சான்று', required: true },
      { name: 'கேஸ் இணைப்பு ரசீது / வாடகை ஒப்பந்தம்', description: 'சமையல் எரிவாயு இணைப்பு சான்று', required: true }
    ]
  },
  'ration-family-member-add': {
    name: 'ரேஷன் கார்டில் குடும்ப உறுப்பினர் சேர்த்தல்',
    description: 'தற்போதுள்ள ஸ்மார்ட் ரேஷன் கார்டில் புதிதாக பிறந்த குழந்தை அல்லது மனைவியின் பெயரைச் சேர்த்தல்.',
    category_name: 'ரேஷன் கார்டு சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்',
    eligibility: 'தற்போதுள்ள ஸ்மார்ட் ரேஷன் கார்டு வைத்திருப்பவர்கள்.',
    documents: [
      { name: 'புதிய உறுப்பினரின் ஆதார் / பிறப்புச் சான்றிதழ்', description: 'குழந்தையின் பிறப்புச் சான்றிதழ் அல்லது ஆதார் நகல்', required: true },
      { name: 'ஸ்மார்ட் ரேஷன் கார்டு நகல்', description: 'தற்போதுள்ள ஸ்மார்ட் கார்டின் நகல்', required: true }
    ]
  },
  'ration-smart-card-member-update': {
    name: 'ரேஷன் கார்டில் குடும்ப உறுப்பினர் சேர்த்தல்',
    description: 'தற்போதுள்ள ஸ்மார்ட் ரேஷன் கார்டில் புதிதாக பிறந்த குழந்தை அல்லது மனைவியின் பெயரைச் சேர்த்தல்.',
    category_name: 'ரேஷன் கார்டு சேவைகள்',
    processing_time: '7-10 வேலை நாட்கள்',
    eligibility: 'தற்போதுள்ள ஸ்மார்ட் ரேஷன் கார்டு வைத்திருப்பவர்கள்.',
    documents: [
      { name: 'புதிய உறுப்பினரின் ஆதார் / பிறப்புச் சான்றிதழ்', description: 'குழந்தையின் பிறப்புச் சான்றிதழ் அல்லது ஆதார் நகல்', required: true },
      { name: 'ஸ்மார்ட் ரேஷன் கார்டு நகல்', description: 'தற்போதுள்ள ஸ்மார்ட் கார்டின் நகல்', required: true }
    ]
  },
  'aadhaar-email-update': {
    name: 'ஆதார் மின்னஞ்சல் முகவரி புதுப்பித்தல்',
    description: 'உங்கள் அதிகாரப்பூர்வ மின்னஞ்சல் முகவரியை ஆதார் கணக்கில் இணைத்தல் அல்லது புதுப்பித்தல்.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '24-48 மணி நேரம்',
    eligibility: 'ஆதார் கார்டு வைத்திருப்பவர்கள்.',
    documents: [
      { name: 'ஆதார் கார்டு நகல்', description: 'தற்போதுள்ள ஆதார் கார்டின் நகல்', required: true }
    ]
  },
  'aadhaar-dob-update': {
    name: 'ஆதார் பிறந்த தேதி திருத்தம்',
    description: 'அதிகாரப்பூர்வ பிறந்த தேதி ஆதாரத்தின்படி ஆதாரில் உள்ள பிறந்த தேதியை திருத்துதல்.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '5-7 வேலை நாட்கள்',
    eligibility: 'பிறந்த தேதி ஆதார ஆவணம் வைத்துள்ள ஆதார் பயனாளர்கள்.',
    documents: [
      { name: 'ஆதார் கார்டு நகல்', description: 'தற்போதுள்ள ஆதார் கார்டின் நகல்', required: true },
      { name: 'பிறந்த தேதி சான்று', description: 'பிறப்புச் சான்றிதழ், 10ஆம் வகுப்பு மதிப்பெண் அட்டை, அல்லது பாஸ்போர்ட்', required: true }
    ]
  },
  'aadhaar-gender-update': {
    name: 'ஆதார் பாலின மாற்றம்',
    description: 'ஆதார் தரவுத்தளத்தில் பாலின வகைப்பாட்டை திருத்துதல்.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '3-5 வேலை நாட்கள்',
    eligibility: 'ஆதார் கார்டு வைத்திருப்பவர்கள்.',
    documents: [
      { name: 'ஆதார் கார்டு நகல்', description: 'தற்போதுள்ள ஆதார் கார்டின் நகல்', required: true }
    ]
  },
  'aadhaar-photo-update': {
    name: 'ஆதார் புகைப்படம் புதுப்பித்தல் உதவி',
    description: 'ஆதார் கார்டில் புகைப்படத்தைப் புதுப்பிப்பதற்கான பதிவு உதவி.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '3-5 வேலை நாட்கள்',
    eligibility: 'அனைத்து ஆதார் பயனாளர்கள்.',
    documents: [
      { name: 'ஆதார் கார்டு நகல்', description: 'தற்போதுள்ள ஆதார் கார்டின் நகல்', required: true },
      { name: 'பாஸ்போர்ட் புகைப்படம்', description: 'சமீபத்திய தெளிவான வண்ண புகைப்படம்', required: true }
    ]
  },
  'aadhaar-biometric-update': {
    name: 'ஆதார் பயோமெட்ரிக் புதுப்பித்தல் உதவி',
    description: 'கைரேகை மற்றும் விழித்திரை (Iris) பயோமெட்ரிக் விவரங்களைப் புதுப்பித்தல் (5 மற்றும் 15 வயது குழந்தைகளுக்குக் கட்டாயம்).',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '3-5 வேலை நாட்கள்',
    eligibility: 'பயோமெட்ரிக் புதுப்பித்தல் தேவைப்படும் நபர்கள்.',
    documents: [
      { name: 'ஆதார் கார்டு நகல்', description: 'தற்போதுள்ள ஆதார் கார்டின் நகல்', required: true }
    ]
  },
  'aadhaar-document-update': {
    name: 'ஆதார் கட்டாய ஆவண புதுப்பித்தல்',
    description: '10 ஆண்டுகளுக்கு மேல் பழைய ஆதார் கார்டுகளுக்கான அடையாள மற்றும் முகவரி ஆவணங்களை மீண்டும் புதுப்பித்தல்.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '3-5 வேலை நாட்கள்',
    eligibility: '10 ஆண்டுகளுக்கு மேல் ஆதார் புதுப்பிக்காத பயனாளர்கள்.',
    documents: [
      { name: 'அடையாளச் சான்று', description: 'வாக்காளர் அட்டை, PAN கார்டு, பாஸ்போர்ட், அல்லது ஓட்டுநர் உரிமம்', required: true },
      { name: 'முகவரிச் சான்று', description: 'ரேஷன் கார்டு, மின்சாரக் கட்டணம், அல்லது வங்கி கணக்கு புத்தகம்', required: true }
    ]
  },
  'aadhaar-download': {
    name: 'ஆதார் டிஜிட்டல் பதிவிறக்கம் உதவி',
    description: 'பாதுகாக்கப்பட்ட அதிகாரப்பூர்வ e-Aadhaar PDF நகலைப் பதிவிறக்க உடனடி உதவி.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: 'உடனடி / 1 மணி நேரம்',
    eligibility: 'மொபைல் எண் இணைக்கப்பட்டுள்ள ஆதார் பயனாளர்கள்.',
    documents: []
  },
  'aadhaar-status-check': {
    name: 'ஆதார் நிலை சரிபார்ப்பு',
    description: 'உங்கள் புதிய பதிவு அல்லது புதுப்பித்தல் விண்ணப்பத்தின் நிலையைச் சரிபார்க்கவும்.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: 'உடனடி',
    eligibility: 'EID அல்லது URN எண் வைத்துள்ள அனைவரும்.',
    documents: []
  },
  'aadhaar-correction-assistance': {
    name: 'ஆதார் டைனமிக் திருத்த உதவி',
    description: 'ஆதாரில் உள்ள எந்தவொரு விவரத்தையும் மாற்றுவதற்கான தனிப்பயனாக்கப்பட்ட திருத்த உதவி.',
    category_name: 'ஆதார் சேவைகள்',
    processing_time: '3-7 வேலை நாட்கள்',
    eligibility: 'ஆதார் திருத்தம் தேவைப்படும் கார்டு வைத்திருப்பவர்கள்.',
    documents: [
      { name: 'ஆதார் கார்டு நகல்', description: 'தற்போதுள்ள ஆதார் கார்டின் நகல்', required: true },
      { name: 'திருத்தத்திற்கான ஆதார ஆவணம்', description: 'கோரப்பட்ட மாற்றத்தை உறுதிப்படுத்தும் அரசு சான்றிதழ்', required: true }
    ]
  },
  'pan-download-status': {
    name: 'e-PAN பதிவிறக்கம் & நிலை சரிபார்ப்பு',
    description: 'அதிகாரப்பூர்வ e-PAN PDF நகலைப் பதிவிறக்குதல் அல்லது விண்ணப்ப நிலை அறிதல்.',
    category_name: 'PAN சேவைகள்',
    processing_time: 'உடனடி / 1 மணி நேரம்',
    eligibility: 'PAN விண்ணப்பதாரர்கள்.',
    documents: []
  }
};

/**
 * Helper to strip Tanglish text in parentheses from service names
 */
export function sanitizeServiceName(name) {
  if (!name || typeof name !== 'string') return name;
  return name.replace(/\s*\((Varumaana Saanrithazh|Jaathi Saanrithazh|AnyTamilLand|Saanrithazh|Thunglish|Tanglish)\)/gi, '').trim();
}

/**
 * Helper to localize a single service definition
 */
export function getLocalizedService(srv, lang = 'en') {
  if (!srv) return srv;
  
  // Clean up any Tanglish text from srv.name
  const cleanName = sanitizeServiceName(srv.name);
  const cleanSrv = { ...srv, name: cleanName };

  if (lang !== 'ta') return cleanSrv;

  const key = srv.slug || '';
  const taData = TAMIL_SERVICES_TRANSLATIONS[key] || Object.values(TAMIL_SERVICES_TRANSLATIONS).find(item => sanitizeServiceName(item.name) === cleanName);

  if (taData) {
    return {
      ...cleanSrv,
      name: taData.name || cleanName,
      description: taData.description || srv.description,
      category_name: taData.category_name || srv.category_name,
      processing_time: taData.processing_time || srv.processing_time,
      eligibility: taData.eligibility || srv.eligibility,
      documents: taData.documents || srv.documents
    };
  }

  return cleanSrv;
}

/**
 * Helper to retrieve service by ID or Slug with safe fallback and language localization
 */
export function getServiceDefinition(param, lang = 'en') {
  let srv = null;
  if (!param) srv = DEFAULT_SERVICES_MAP['aadhaar-address-update'];
  else {
    const rawP = String(param).toLowerCase().trim();
    const p = (typeof CATALOG_SLUG_ALIASES !== 'undefined' && CATALOG_SLUG_ALIASES[rawP]) ? CATALOG_SLUG_ALIASES[rawP].base : rawP;
    
    if (DEFAULT_SERVICES_MAP[rawP]) {
      srv = DEFAULT_SERVICES_MAP[rawP];
    } else if (DEFAULT_SERVICES_MAP[p]) {
      srv = DEFAULT_SERVICES_MAP[p];
    } else {
      // 1. Try by numeric ID match
      const idMatch = Object.values(DEFAULT_SERVICES_MAP).find(s => String(s.id) === rawP || String(s.id) === p);
      if (idMatch) {
        srv = idMatch;
      } else {
        // 2. Try by normalized slug string match
        const normP = rawP.replace(/[^a-z0-9]/g, '');
        const altKey = Object.keys(DEFAULT_SERVICES_MAP).find(key => {
          const normKey = key.replace(/[^a-z0-9]/g, '');
          return normKey === normP || normKey.includes(normP) || normP.includes(normKey);
        });

        if (altKey) {
          srv = DEFAULT_SERVICES_MAP[altKey];
        } else {
          // 3. Fallback to complete standard dynamic form for unknown services
          const isFreeLikely = rawP.includes('free') || rawP.includes('status') || rawP.includes('search') || rawP.includes('verify') || rawP.includes('verification') || rawP.includes('check');
          srv = {
            id: 999,
            category_name: 'Digital E-Service',
            category_slug: 'general-services',
            name: rawP.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            slug: rawP,
            description: 'Official digital e-governance service application facilitation desk online.',
            eligibility: 'Resident citizens holding valid identity and address proof documents.',
            processing_time: '3-7 Working Days',
            fee: isFreeLikely ? 0 : 60,
            fields: [
              { name: 'full_name', label: 'Full Name of Applicant', type: 'text', placeholder: 'Karthik Subramanian', required: true },
              { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
              { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], required: true },
              { name: 'guardian_name', label: 'Father / Husband / Guardian Name', type: 'text', placeholder: 'Subramanian S', required: true },
              { name: 'mobile_number', label: 'Mobile Number', type: 'phone', placeholder: '9876543210', required: true },
              { name: 'email', label: 'Email Address', type: 'email', placeholder: 'user@example.com', required: false },
              { name: 'address', label: 'Residential Address', type: 'textarea', placeholder: 'Door No, Street Name, Village/City', required: true },
              { name: 'district', label: 'District', type: 'text', placeholder: 'Chennai', required: true },
              { name: 'state', label: 'State', type: 'text', placeholder: 'Tamil Nadu', required: true },
              { name: 'pincode', label: '6-Digit Pincode', type: 'text', placeholder: '600001', required: true },
              { name: 'service_remarks', label: 'Specific Service Application Details / Remarks', type: 'textarea', placeholder: 'Enter specific details required for this application', required: false }
            ],
            documents: [
              { name: 'Identity Proof', description: 'Aadhaar Card, Voter ID, PAN Card, or Passport', required: true },
              { name: 'Address Proof', description: 'Smart Ration Card, Electricity Bill, or Bank Passbook', required: true }
            ]
          };
        }
      }
    }
  }

  return getLocalizedService(srv, lang);
}


