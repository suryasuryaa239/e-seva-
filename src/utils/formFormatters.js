/**
 * Utility functions for input formatting, sanitization, and validation
 * for Indian national identity and contact fields (Phone, Aadhaar, PAN, Pincode, etc.)
 */

// Format and sanitize Phone Number (Digits only, strictly max 10)
export function sanitizePhone(val) {
  if (!val) return '';
  return String(val).replace(/\D/g, '').slice(0, 10);
}

// Format and sanitize Aadhaar (Digits only, max 12, formatted as XXXX XXXX XXXX)
export function formatAadhaar(val) {
  if (!val) return '';
  const digits = String(val).replace(/\D/g, '').slice(0, 12);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

// Clean Aadhaar (Returns raw 12 digits)
export function cleanAadhaar(val) {
  if (!val) return '';
  return String(val).replace(/\D/g, '').slice(0, 12);
}

// Format and sanitize Pincode (Digits only, strictly max 6)
export function sanitizePincode(val) {
  if (!val) return '';
  return String(val).replace(/\D/g, '').slice(0, 6);
}

// Format and sanitize PAN Card Number (Alphanumeric uppercase, strictly max 10)
export function formatPAN(val) {
  if (!val) return '';
  return String(val).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
}

// Format and sanitize Ration / Smart Card (Digits only, strictly max 12)
export function sanitizeRationCard(val) {
  if (!val) return '';
  return String(val).replace(/\D/g, '').slice(0, 12);
}

// Format and sanitize Voter ID / EPIC (Alphanumeric uppercase, strictly max 12)
export function formatVoterID(val) {
  if (!val) return '';
  return String(val).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
}

/**
 * Identify field characteristics based on field metadata (name, label, type)
 */
export function getFieldConstraints(field = {}) {
  const lowerKey = (field.field_name || field.name || '').toLowerCase();
  const lowerLabel = (field.field_label || field.label || '').toLowerCase();
  const fType = (field.field_type || field.type || '').toLowerCase();

  // Phone / Mobile Number Field
  if (
    fType === 'phone' ||
    lowerKey.includes('phone') ||
    lowerKey.includes('mobile') ||
    lowerLabel.includes('mobile') ||
    lowerLabel.includes('phone') ||
    lowerLabel.includes('கைபேசி') ||
    lowerLabel.includes('மொபைல்')
  ) {
    return {
      kind: 'phone',
      maxLength: 10,
      inputMode: 'numeric',
      placeholder: 'e.g. 9876543210',
      format: sanitizePhone,
      validate: (v) => String(v || '').replace(/\D/g, '').length === 10,
      errorMsg: {
        en: 'Mobile number must be exactly 10 digits.',
        ta: 'மொபைல் எண் சரியாக 10 இலக்கங்களாக இருக்க வேண்டும்.'
      }
    };
  }

  // Aadhaar Number Field
  if (
    lowerKey.includes('aadhaar') ||
    lowerLabel.includes('aadhaar') ||
    lowerLabel.includes('ஆதார்')
  ) {
    return {
      kind: 'aadhaar',
      maxLength: 14, // 12 digits + 2 spaces: "XXXX XXXX XXXX"
      inputMode: 'numeric',
      placeholder: 'e.g. 9876 5432 1098',
      format: formatAadhaar,
      validate: (v) => String(v || '').replace(/\D/g, '').length === 12,
      errorMsg: {
        en: 'Aadhaar number must be exactly 12 digits.',
        ta: 'ஆதார் எண் சரியாக 12 இலக்கங்களாக இருக்க வேண்டும்.'
      }
    };
  }

  // Pincode Field
  if (
    lowerKey.includes('pincode') ||
    lowerKey.includes('pin_code') ||
    lowerLabel.includes('pincode') ||
    lowerLabel.includes('pin code') ||
    lowerLabel.includes('அஞ்சல் குறியீடு')
  ) {
    return {
      kind: 'pincode',
      maxLength: 6,
      inputMode: 'numeric',
      placeholder: 'e.g. 600001',
      format: sanitizePincode,
      validate: (v) => String(v || '').replace(/\D/g, '').length === 6,
      errorMsg: {
        en: 'Pincode must be exactly 6 digits.',
        ta: 'அஞ்சல் குறியீடு சரியாக 6 இலக்கங்களாக இருக்க வேண்டும்.'
      }
    };
  }

  // PAN Card Number Field
  if (
    lowerKey.includes('pan_no') ||
    lowerKey.includes('pan_num') ||
    lowerKey.includes('existing_pan') ||
    lowerKey === 'pan' ||
    lowerLabel.includes('pan card') ||
    lowerLabel.includes('pan number') ||
    lowerLabel.includes('பான் எண்')
  ) {
    return {
      kind: 'pan',
      maxLength: 10,
      style: { textTransform: 'uppercase' },
      placeholder: 'e.g. ABCDE1234F',
      format: formatPAN,
      validate: (v) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(String(v || '').trim()),
      errorMsg: {
        en: 'PAN must be 10 characters (e.g. ABCDE1234F).',
        ta: 'பான் (PAN) எண் சரியாக 10 எழுத்துக்களாக இருக்க வேண்டும் (எ.கா. ABCDE1234F).'
      }
    };
  }

  // Smart Ration Card Number Field
  if (
    lowerKey.includes('ration') ||
    lowerKey.includes('smart_card') ||
    lowerLabel.includes('ration') ||
    lowerLabel.includes('ரேஷன்')
  ) {
    return {
      kind: 'ration',
      maxLength: 12,
      inputMode: 'numeric',
      placeholder: 'e.g. 12-digit ration card number',
      format: sanitizeRationCard,
      validate: (v) => {
        const d = String(v || '').replace(/\D/g, '');
        return d.length >= 10 && d.length <= 12;
      },
      errorMsg: {
        en: 'Ration card number must be 10-12 digits.',
        ta: 'ரேஷன் அட்டை எண் 10-12 இலக்கங்களாக இருக்க வேண்டும்.'
      }
    };
  }

  // Voter ID / EPIC Number Field
  if (
    lowerKey.includes('voter') ||
    lowerKey.includes('epic') ||
    lowerLabel.includes('voter') ||
    lowerLabel.includes('epic') ||
    lowerLabel.includes('வாக்காளர்')
  ) {
    return {
      kind: 'voter',
      maxLength: 12,
      style: { textTransform: 'uppercase' },
      placeholder: 'e.g. ABC1234567',
      format: formatVoterID,
      validate: (v) => {
        const s = String(v || '').trim();
        return s.length >= 8 && s.length <= 12;
      },
      errorMsg: {
        en: 'Voter ID must be between 8 and 12 characters.',
        ta: 'வாக்காளர் அடையாள அட்டை எண் 8 முதல் 12 எழுத்துக்களாக இருக்க வேண்டும்.'
      }
    };
  }

  // Generic Number Field
  if (fType === 'number') {
    return {
      kind: 'number',
      inputMode: 'numeric',
      format: (v) => String(v || '').replace(/\D/g, '')
    };
  }

  return { kind: 'text' };
}
