/**
 * Comprehensive Tamil Localization Helper Module for E-Seva Application Forms
 * Provides automatic Tamil translations for section headers, field labels, select options,
 * placeholders, document titles, status badges, and help text.
 */

// 1. SECTION HEADERS MAPPING
const SECTION_TRANSLATIONS = {
  'specific service information': 'சேவை தொடர்பான விவரங்கள்',
  'specific service info': 'சேவை தொடர்பான விவரங்கள்',
  'personal & applicant information': 'விண்ணப்பதாரரின் தனிப்பட்ட விவரங்கள்',
  'personal details': 'தனிப்பட்ட விவரங்கள்',
  'applicant details': 'விண்ணப்பதாரர் விவரங்கள்',
  'address details': 'முகவரி விவரங்கள்',
  'residential address': 'இருப்பிட முகவரி விவரங்கள்',
  'contact information': 'தொடர்பு விவரங்கள்',
  'contact details': 'தொடர்பு விவரங்கள்',
  'document uploads': 'தேவையான ஆவணங்கள் பதிவேற்றம்',
  'documents required': 'தேவையான சான்று ஆவணங்கள்',
  'property details': 'சொத்து / நிலம் விவரங்கள்',
  'land details': 'நில விவரங்கள்',
  'family details': 'குடும்ப உறுப்பினர்களின் விவரங்கள்',
  'income details': 'வருமான விவரங்கள்',
  'employment details': 'வேலைவாய்ப்பு விவரங்கள்',
  'other information': 'இதர விவரங்கள்',
  'general information': 'பொதுவான விவரங்கள்'
};

export function getLocalizedSectionTitle(secTitle, lang = 'en') {
  if (!secTitle || lang !== 'ta') return secTitle;
  const key = String(secTitle).trim().toLowerCase();
  return SECTION_TRANSLATIONS[key] || secTitle;
}

// 2. FIELD LABELS MAPPING
const FIELD_LABEL_TRANSLATIONS = {
  '12-digit aadhaar number': '12-இலக்க ஆதார் எண்',
  'aadhaar number': 'ஆதார் எண்',
  'aadhaar card number': 'ஆதார் கார்டு எண்',
  'aadhaar_number': 'ஆதார் எண்',
  'aadhaar_no': 'ஆதார் எண்',
  'linked mobile number': 'இணைக்கப்பட்ட மொபைல் எண்',

  'full name': 'முழுப் பெயர் (ஆதாரில் உள்ளபடி)',
  'full name of applicant': 'விண்ணப்பதாரரின் முழுப் பெயர்',
  'full name (as in aadhaar)': 'முழுப் பெயர் (ஆதாரில் உள்ளபடி)',
  'applicant name': 'விண்ணப்பதாரர் பெயர்',
  'name': 'பெயர்',

  'father / mother / guardian name': 'தந்தை / தாய் / காப்பாளர் பெயர்',
  'c/o (father / husband / guardian name)': 'தந்தை / கணவர் / காப்பாளர் பெயர்',
  "father's name": 'தந்தை பெயர்',
  "mother's name": 'தாய் பெயர்',
  "husband's name": 'கணவர் பெயர்',
  'guardian name': 'காப்பாளர் பெயர்',
  'father / husband name': 'தந்தை / கணவர் பெயர்',

  'house / building / apartment no.': 'வீடு / கட்டிடம் / கதவு எண்',
  'new house / door / flat no': 'புதிய வீடு / கதவு / பிளாட் எண்',
  'house / flat / door no.': 'வீடு / கதவு எண்',
  'door no': 'கதவு எண்',
  'house no': 'வீட்டு எண்',
  'current address in aadhaar': 'ஆதாரில் உள்ள தற்போதைய முகவரி',
  'residential address': 'இருப்பிட முகவரி',
  'address': 'முகவரி',

  'street / road / lane name': 'தெரு / சாலை பெயர்',
  'street / road name': 'தெரு / சாலை பெயர்',
  'street name': 'தெரு பெயர்',

  'landmark': 'அடையாள இடம் (Landmark)',
  'land mark': 'அடையாள இடம் (Landmark)',

  'area / locality / sector': 'பகுதி / ஊர் பெயர்',
  'area / locality': 'பகுதி / கிராமம் / நகர்',
  'locality': 'பகுதி / நகர்',
  'village / town': 'கிராமம் / நகரம்',

  'city / town': 'நகரம் / கிராமம்',
  'city': 'நகரம்',

  'reason for address change': 'முகவரி மாற்றத்திற்கான காரணம்',
  'reason for update': 'மாற்றத்திற்கான காரணம்',
  'reason': 'காரணம்',

  'district': 'மாவட்டம்',
  'state': 'மாநிலம்',

  '6-digit pin code': '6-இலக்க அஞ்சல் குறியீட்டு எண் (PIN)',
  '6-digit pincode': '6-இலக்க அஞ்சல் குறியீடு (PIN)',
  'pin code': 'அஞ்சல் குறியீட்டு எண் (PIN)',
  'pincode': 'அஞ்சல் குறியீடு (PIN)',

  'mobile number': 'கைபேசி / மொபைல் எண்',
  'mobile': 'மொபைல் எண்',
  'phone number': 'தொலைபேசி எண்',

  'email address': 'மின்னஞ்சல் முகவரி',
  'email id': 'மின்னஞ்சல் முகவரி',
  'email': 'மின்னஞ்சல்',

  'date of birth': 'பிறந்த தேதி',
  'dob': 'பிறந்த தேதி',

  'gender': 'பாலினம்',
  'marital status': 'திருமண நிலை',
  'religion': 'மதம்',
  'community / caste': 'சாதி / சமூகம்',
  'caste': 'சாதி',
  'sub caste': 'உட்பிரிவு சாதி',
  'community certificate number': 'சாதிச் சான்றிதழ் எண்',

  'annual family income': 'ஆண்டு குடும்ப வருமானம்',
  'annual income': 'ஆண்டு வருமானம்',
  'occupation': 'தொழில் / வேலை',
  'profession': 'தொழில்',

  'father full name': 'தந்தை பெயர்',
  'father_name': 'தந்தை பெயர்',
  'mother full name': 'தாய் பெயர்',
  'mother_name': 'தாய் பெயர்',
  'correct applicant full name': 'சரியான விண்ணப்பதாரர் பெயர்',
  'correct father full name': 'சரியான தந்தை பெயர்',
  'correct date of birth': 'சரியான பிறந்த தேதி',
  'correct dob': 'சரியான பிறந்த தேதி',
  'village & taluk': 'கிராமம் & வட்டம்',
  'village & taluk name': 'கிராமம் & வட்டம்',
  'taluk': 'வட்டம்',
  'village': 'கிராமம்',
  'village / town': 'கிராமம் / நகரம்',
  'sub-division number': 'உட்பிரிவு எண்',
  'search period (years)': 'தேடல் காலம் (ஆண்டுகள்)',
  'sub-registrar office': 'சார்பதிவாளர் அலுவலகம்',
  'source of income': 'வருமான ஆதாரம்',
  'caste / community category': 'சாதிப் பிரிவு',
  'sub-caste name': 'உட்பிரிவு சாதி பெயர்',
  'survey number / patta number': 'புல எண் / பட்டா எண்',
  'survey / plot number': 'புல எண் / மனை எண்',

  'ration card number': 'ரேஷன் கார்டு எண்',
  'smart ration card no': 'ஸ்மார்ட் ரேஷன் கார்டு எண்',
  'family card number': 'குடும்ப அட்டை எண்',

  'relationship': 'உறவு முறை',
  'relation with applicant': 'விண்ணப்பதாரருடன் உள்ள உறவு',

  'purpose of certificate': 'சான்றிதழின் நோக்கம்',
  'purpose': 'நோக்கம்',

  'survey number': 'சர்வே எண்',
  'patta number': 'பட்டா எண்',
  'sub division number': 'உட்பிரிவு எண்',
  'extent / area in sq.ft': 'பரப்பளவு (சதுர அடி / சென்ட்)',

  'vehicle registration number': 'வாகனப் பதிவு எண்',
  'driving license number': 'ஓட்டுநர் உரிம எண்',

  'pan card number': 'PAN கார்டு எண்',
  'pan number': 'PAN எண்',

  'voter id number': 'வாக்காளர் அடையாள அட்டை எண்',
  'epic number': 'EPIC (வாக்காளர்) எண்',
  'assembly constituency': 'சட்டமன்ற தொகுதி'
};

export function getLocalizedFieldLabel(fLabel, lang = 'en') {
  if (!fLabel || lang !== 'ta') return fLabel;
  const key = String(fLabel).trim().toLowerCase();
  if (FIELD_LABEL_TRANSLATIONS[key]) return FIELD_LABEL_TRANSLATIONS[key];

  // Specific familial relations MUST precede generic 'name' / 'full name' checks!
  if (key.includes('mother')) return FIELD_LABEL_TRANSLATIONS["mother's name"] || 'தாய் பெயர்';
  if (key.includes('father') || key.includes('husband') || key.includes('guardian')) return FIELD_LABEL_TRANSLATIONS['father / mother / guardian name'];

  // Aadhaar, Gender, DOB
  if (key.includes('aadhaar')) return FIELD_LABEL_TRANSLATIONS['aadhaar number'];
  if (key.includes('gender')) return FIELD_LABEL_TRANSLATIONS['gender'];
  if (key.includes('dob') || key.includes('date of birth') || key.includes('birth date')) return FIELD_LABEL_TRANSLATIONS['date of birth'];

  // Applicant Name / Full Name
  if (key.includes('full name') || key.includes('applicant name')) return FIELD_LABEL_TRANSLATIONS['full name'];

  // Address and contact components
  if (key.includes('house') || key.includes('door') || key.includes('flat')) return FIELD_LABEL_TRANSLATIONS['house / building / apartment no.'];
  if (key.includes('street') || key.includes('road')) return FIELD_LABEL_TRANSLATIONS['street / road / lane name'];
  if (key.includes('landmark')) return FIELD_LABEL_TRANSLATIONS['landmark'];
  if (key.includes('reason')) return FIELD_LABEL_TRANSLATIONS['reason for address change'];
  if (key.includes('pincode') || key.includes('pin code')) return FIELD_LABEL_TRANSLATIONS['6-digit pin code'];
  if (key.includes('district')) return FIELD_LABEL_TRANSLATIONS['district'];
  if (key.includes('state')) return FIELD_LABEL_TRANSLATIONS['state'];
  if (key.includes('mobile') || key.includes('phone')) return FIELD_LABEL_TRANSLATIONS['mobile number'];
  if (key.includes('email')) return FIELD_LABEL_TRANSLATIONS['email address'];
  if (key.includes('taluk')) return 'வட்டம்';
  if (key.includes('village')) return 'கிராமம்';
  if (key.includes('survey')) return 'சர்வே எண்';
  if (key.includes('patta')) return 'பட்டா எண்';

  return fLabel;
}

// 3. SELECT DROPDOWN OPTIONS MAPPING
const OPTION_TRANSLATIONS = {
  'male': 'ஆண்',
  'female': 'பெண்',
  'transgender': 'திருநங்கை / திருநம்பி',
  'other': 'மற்றவை',

  'tamil nadu': 'தமிழ்நாடு',
  'puducherry': 'புதுச்சேரி',
  'kerala': 'கேரளா',
  'karnataka': 'கர்நாடகா',
  'andhra pradesh': 'ஆந்திர பிரதேசம்',
  'telangana': 'தெலங்கானா',

  'self': 'சுய',
  'father': 'தந்தை',
  'mother': 'தாய்',
  'husband': 'கணவர்',
  'spouse': 'கணவர் / மனைவி',
  'wife': 'மனைவி',
  'guardian': 'காப்பாளர்',
  'son': 'மகன்',
  'daughter': 'மகள்',

  'single': 'திருமணமாகாதவர்',
  'married': 'திருமணமானவர்',
  'widow': 'கைம்பெண் (விதவை)',
  'widower': 'மனைவியை இழந்தவர்',
  'divorced': 'விவாகரத்து பெற்றவர்',

  'address change': 'முகவரி மாற்றம்',
  'name correction': 'பெயர் திருத்தம்',
  'dob update': 'பிறந்த தேதி புதுப்பிப்பு',
  'mobile linking': 'மொபைல் எண் இணைப்பு',

  'bc': 'பிற்படுத்தப்பட்டோர் (BC)',
  'mbc': 'மிகவும் பிற்படுத்தப்பட்டோர் (MBC)',
  'sc': 'பட்டியல் சாதியினர் (SC)',
  'st': 'பழங்குடியினர் (ST)',
  'oc': 'பொதுப்பிரிவு (OC / General)',
  'general': 'பொதுப்பிரிவு (General)',
  'fc': 'முற்படுத்தப்பட்டோர் (FC)'
};

export function getLocalizedOption(opt, lang = 'en') {
  if (!opt || lang !== 'ta') return opt;
  const key = String(opt).trim().toLowerCase();
  return OPTION_TRANSLATIONS[key] || opt;
}

// 4. PLACEHOLDERS MAPPING
export function getLocalizedPlaceholder(placeholder, fieldLabel, lang = 'en') {
  if (lang !== 'ta') return placeholder;
  if (!placeholder) {
    const locLabel = getLocalizedFieldLabel(fieldLabel, lang);
    return locLabel ? `${locLabel} உள்ளிடவும்` : '';
  }

  const pLower = String(placeholder).trim().toLowerCase();
  if (pLower.startsWith('e.g.')) {
    return placeholder.replace(/e\.g\./i, 'எ.கா.');
  }
  if (pLower.includes('old address')) return 'பழைய முகவரி விவரங்கள்';
  if (pLower.includes('flat') || pLower.includes('sunshine')) return 'கதவு எண் 3B, காந்தி நகர்';
  if (pLower.includes('gandhi road')) return 'காந்தி சாலை';
  if (pLower.includes('adyar')) return 'அடையாறு / கிராமத்தின் பெயர்';
  if (pLower.includes('chennai')) return 'சென்னை';
  if (pLower.includes('select')) {
    const locLabel = getLocalizedFieldLabel(fieldLabel, lang);
    return `-- ${locLabel} தேர்ந்தெடுக்கவும் --`;
  }

  return placeholder;
}

// 5. DOCUMENT NAMES MAPPING
const DOCUMENT_NAME_TRANSLATIONS = {
  'identity proof': 'அடையாளச் சான்று',
  'proof of identity': 'அடையாளச் சான்று',
  'address proof': 'முகவரிச் சான்று',
  'proof of address': 'முகவரிச் சான்று',
  'valid address proof': 'செல்லுபடியாகும் முகவரிச் சான்று',
  'aadhaar card copy': 'ஆதார் கார்டு நகல்',
  'existing aadhaar card': 'தற்போதுள்ள ஆதார் கார்டு',
  'date of birth proof': 'பிறந்த தேதி சான்று',
  'passport photograph': 'பாஸ்போர்ட் அளவு புகைப்படம்',
  'passport size photo': 'பாஸ்போர்ட் அளவு புகைப்படம்',
  'photo': 'புகைப்படம்',
  'ration card copy': 'ரேஷன் கார்டு நகல்',
  'smart ration card': 'ஸ்மார்ட் ரேஷன் கார்டு',
  'bank passbook': 'வங்கி பாஸ்புக் நகல்',
  'bank passbook copy': 'வங்கி பாஸ்புக் நகல்',
  'income proof': 'வருமான சான்று / சம்பள சீட்டு',
  'self declaration form': 'சுய உறுதிமொழி படிவம்',
  'self declaration': 'சுய உறுதிமொழி படிவம்',
  'educational certificate': 'கல்விச் சான்றிதழ் / மதிப்பெண் பட்டியல்',
  'school leaving marksheet': 'பள்ளி சான்றிதழ் / மதிப்பெண் பட்டியல்',
  'patta / chitta document': 'பட்டா / சிட்டா நகல்',
  'property document': 'சொத்து ஆவணம்',
  'encumbrance certificate': 'வில்லங்கச் சான்றிதழ்',
  'death certificate': 'இறப்புச் சான்றிதழ்',
  'marriage certificate': 'திருமணச் சான்றிதழ்',
  'old pan card copy': 'பழைய PAN கார்டு நகல்',
  'voter id copy': 'வாக்காளர் அடையாள அட்டை நகல்',
  'driving license copy': 'ஓட்டுநர் உரிம நகல்',
  'previous sale deed / property tax receipt': 'முந்தைய கிரைய பத்திரம் / சொத்து வரி ரசீது',
  'previous sale deed': 'முந்தைய கிரைய பத்திரம்',
  'property tax receipt': 'சொத்து வரி ரசீது',
  'sale deed': 'கிரைய பத்திரம்'
};

export function getLocalizedDocName(docName, lang = 'en') {
  if (!docName || lang !== 'ta') return docName;
  const key = String(docName).trim().toLowerCase();
  if (DOCUMENT_NAME_TRANSLATIONS[key]) return DOCUMENT_NAME_TRANSLATIONS[key];

  if (key.includes('identity')) return DOCUMENT_NAME_TRANSLATIONS['identity proof'];
  if (key.includes('address')) return DOCUMENT_NAME_TRANSLATIONS['address proof'];
  if (key.includes('aadhaar')) return DOCUMENT_NAME_TRANSLATIONS['aadhaar card copy'];
  if (key.includes('birth') || key.includes('dob')) return DOCUMENT_NAME_TRANSLATIONS['date of birth proof'];
  if (key.includes('photo') || key.includes('photograph')) return DOCUMENT_NAME_TRANSLATIONS['passport photograph'];
  if (key.includes('ration')) return DOCUMENT_NAME_TRANSLATIONS['ration card copy'];
  if (key.includes('bank') || key.includes('passbook')) return DOCUMENT_NAME_TRANSLATIONS['bank passbook copy'];
  if (key.includes('deed') || key.includes('tax receipt') || key.includes('sale deed')) return DOCUMENT_NAME_TRANSLATIONS['previous sale deed / property tax receipt'];

  return docName;
}

// 6. DOCUMENT DESCRIPTIONS MAPPING
export function getLocalizedDocDesc(desc, docName = '', isMandatory = true, lang = 'en') {
  if (lang === 'ta') {
    const lowerDesc = String(desc || '').toLowerCase();
    const lowerName = String(docName || '').toLowerCase();

    if (lowerName.includes('deed') || lowerDesc.includes('deed') || lowerDesc.includes('tax receipt') || lowerName.includes('tax receipt')) {
      return isMandatory
        ? 'முந்தைய கிரைய பத்திரம் அல்லது சொத்து வரி ரசீதின் தெளிவான நகலைப் பதிவேற்றவும்'
        : 'முந்தைய பத்திரம் அல்லது சொத்து வரி ரசீதின் தெளிவான நகல் (விருப்பத்தேர்வு)';
    }
    if (lowerName.includes('aadhaar') || lowerDesc.includes('aadhaar')) {
      return isMandatory ? 'விண்ணப்பதாரரின் தெளிவான ஆதார் அட்டை நகல்' : 'ஆதார் அட்டை நகல் (விருப்பத்தேர்வு)';
    }
    if (lowerName.includes('photo') || lowerName.includes('photograph')) {
      return isMandatory ? 'சமீபத்திய பாஸ்போர்ட் அளவு புகைப்படம்' : 'புகைப்படம் (விருப்பத்தேர்வு)';
    }
    if (lowerName.includes('ration') || lowerName.includes('smart card')) {
      return isMandatory ? 'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு நகல்' : 'ரேஷன் கார்டு நகல் (விருப்பத்தேர்வு)';
    }

    if (desc) {
      let translated = String(desc);
      if (translated.includes('(Optional)')) translated = translated.replace(/\(Optional\)/gi, '(விருப்பத்தேர்வு)');
      if (translated.includes('(optional)')) translated = translated.replace(/\(optional\)/gi, '(விருப்பத்தேர்வு)');
      if (translated.startsWith('Upload clear copy of ')) {
        const item = translated.replace('Upload clear copy of ', '').replace(/\s*\(விருப்பத்தேர்வு\)/gi, '').trim();
        const locItem = getLocalizedDocName(item, 'ta');
        return isMandatory 
          ? `${locItem} தெளிவான நகலைப் பதிவேற்றவும்` 
          : `${locItem} தெளிவான நகல் (விருப்பத்தேர்வு)`;
      }
      if (isMandatory) {
        return translated.replace(/\s*\((விருப்பத்தேர்வு|optional)\)/gi, '').trim();
      }
      return translated;
    }

    return isMandatory 
      ? 'தெளிவான ஸ்கேன் நகல் அல்லது புகைப்பட சான்றைப் பதிவேற்றவும்' 
      : 'சான்று நகலைப் பதிவேற்றவும் (விருப்பத்தேர்வு)';
  }

  // English
  if (isMandatory) {
    return String(desc || 'Upload clear scanned copy or photo proof').replace(/\s*\((optional|விருப்பத்தேர்வு)\)/gi, '').trim();
  } else {
    let clean = String(desc || 'Upload clear copy or photo proof');
    if (!clean.toLowerCase().includes('optional')) {
      clean += ' (Optional)';
    }
    return clean;
  }
}
