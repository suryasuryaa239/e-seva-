import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Brand & Header
    portalName: "E-SEVA PORTAL",
    tagline: "Digital Services Made Easy",
    govTag: "GOVERNMENT OF TAMIL NADU E-SEVA SERVICES",
    
    // Nav Items
    home: "HOME",
    eServices: "E-SERVICES",
    more: "MORE",
    about: "ABOUT",
    contact: "CONTACT",
    checkStatus: "CHECK APPLICATION STATUS",
    signIn: "SIGN IN",
    register: "REGISTER",
    myDashboard: "My Dashboard",
    myApplications: "My Applications",
    paymentHistory: "Payment History",
    notifications: "Notifications",
    profileSettings: "Profile Settings",
    logout: "Logout",

    // Hero & Search
    heroTitle: "One Portal for All Digital Government Services",
    heroSubtitle: "Apply for Community, Income, Aadhaar, Patta, PAN, Voter ID and Utility services online with instant verification and SMS tracking.",
    searchPlaceholder: "Search services (Aadhaar, PAN, Patta, Income Certificate)...",
    searchBtn: "Search Services",
    trackApp: "Track Application",
    
    // Quick Stats / Badges
    activeServicesCount: "100+ Active Services",
    digitalProcessing: "100% Paperless & Secure",
    fastDelivery: "2-3 Days Fast Processing",

    // Categories
    allCategories: "All Service Categories",
    aadhaarServices: "Aadhaar Services",
    aadhaarDesc: "Enrollment, Address, Mobile & Photo Updates",
    panServices: "PAN Card Services",
    panDesc: "New PAN, Corrections, Reprint & Aadhaar Link",
    voterServices: "Voter ID Services",
    voterDesc: "New Registration, Address Change & EPIC Download",
    certificates: "Certificates",
    certificatesDesc: "Income, Community, Native, Birth & Death",
    landServices: "Land & Patta Services",
    landDesc: "Patta Transfer, Chitta, FMB Sketch & EC",
    passportServices: "Passport Services",
    passportDesc: "Fresh Passport, Re-issue & Tatkaal",
    drivingLicence: "Driving Licence",
    drivingDesc: "Learner License, DL Renewal & Address Updates",
    vehicleServices: "Vehicle Services",
    vehicleDesc: "RC Transfer, NOC, Fitness & Tax Payment",
    businessServices: "Business Services",
    businessDesc: "MSME/Udyam, GST & FSSAI Licenses",
    utilityServices: "Utility Services",
    utilityDesc: "Electricity, Water & Property Tax Payments",
    otherServices: "Other Services",
    otherDesc: "Ration Card, Pension & Employment Reg.",

    // Dashboard & Applications
    welcomeUser: "Welcome,",
    userDashboardTitle: "User Dashboard & Application Cockpit",
    userDashboardDesc: "Manage your applications, view progress, and access 100+ digital services.",
    totalSubmitted: "Total Submitted Applications",
    inProcessing: "In Processing / Under Review",
    approvedApps: "Approved & Completed",
    rejectedApps: "Action Required / Rejected",
    quickActions: "Quick Actions",
    applyNewService: "Apply for New Service",
    trackAppStatus: "Track Application Status",
    viewPaymentLedger: "View Payment History",
    myRecentApplications: "My Recent Applications",
    appId: "Application ID",
    serviceName: "Service Name",
    appliedDate: "Applied Date",
    status: "Status",
    action: "Action",
    viewDetails: "View Details",
    noApplicationsFound: "No applications submitted yet.",

    // Application Tracker
    trackTitle: "Track Application Status",
    trackSubtitle: "Enter your Application ID to view current progress and download issued certificates.",
    enterAppId: "Enter Application ID (e.g., APP-2026-8492)",
    trackNow: "Track Now",
    statusTimeline: "Application Processing Timeline",
    dateSubmitted: "Date Submitted",
    lastUpdated: "Last Updated",
    trackingHelp: "Need help tracking your application? Contact our 24/7 helpline at 1800-425-1337.",

    // Auth (Login / Register / Forgot Password)
    loginTitle: "Sign In to E-Seva Portal",
    loginSubtitle: "Access your dashboard, track application status, and apply for digital services.",
    registerTitle: "Create Citizen Account",
    registerSubtitle: "Register with your mobile number or email to access 100+ e-governance services.",
    forgotPasswordTitle: "Forgot Password",
    forgotPasswordSubtitle: "Enter your registered email address to receive password reset instructions.",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm Password",
    rememberMe: "Remember me",
    forgotPasswordLink: "Forgot Password?",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    registerNow: "Register Now",
    loginBtn: "Sign In",
    registerBtn: "Create Account",
    resetPasswordBtn: "Send Reset Link",

    // User Profile & Settings
    profileTitle: "User Profile & Account Settings",
    personalInfo: "Personal Information",
    saveChanges: "Save Changes",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    notificationPrefs: "Notification Preferences",
    emailNotifications: "Email Notifications",
    smsNotifications: "SMS Notifications",

    // Payments & Receipts
    paymentLedgerTitle: "Payment History & Receipts",
    transactionId: "Transaction ID",
    paymentDate: "Payment Date",
    amountPaid: "Amount Paid",
    paymentStatus: "Payment Status",
    paymentMethod: "Payment Method",
    downloadReceiptBtn: "Download PDF Receipt",
    paymentSuccessful: "Payment Successful",

    // Admin Panel
    adminPortal: "E-Seva Admin Control Cockpit",
    adminDashboardTitle: "System Administration & Applications Overview",
    totalUsers: "Total Registered Citizens",
    totalApplicationsCount: "Total Applications Processed",
    revenueGenerated: "Total Revenue Facilitated",
    pendingApplications: "Pending Approvals",
    allApplicationsList: "All Citizen Applications",
    filterStatus: "Filter by Status",
    updateStatusBtn: "Update Application Status",
    approveApplication: "Approve Application",
    rejectApplication: "Reject Application",
    sendNotification: "Send SMS / Email Alert",

    // Static Pages & Errors
    aboutTitle: "About E-Seva Portal",
    contactTitle: "Contact Helpline & Service Outlets",
    careersTitle: "Careers & Government Project Openings",
    privacyTitle: "Privacy Policy & Citizen Data Security",
    termsTitle: "Terms of Service & Usage Disclaimer",
    refundTitle: "Cancellation & Refund Policy",
    pageNotFoundTitle: "Page Not Found (404)",
    pageNotFoundDesc: "The page or service route you requested does not exist or has been moved.",

    // Status Badges
    statusPending: "Pending Review",
    statusSubmitted: "Submitted",
    statusInReview: "In Review / Processing",
    statusApproved: "Approved & Ready",
    statusRejected: "Rejected / Requires Fix",

    // Application Form & Apply Service
    applicationFormTitle: "Digital Service Application Form",
    applicantInformation: "1. Applicant Information",
    fullName: "Full Name (as per Aadhaar)",
    mobileNumber: "Mobile Number",
    emailAddress: "Email Address",
    residentialAddress: "Residential Address",
    aadhaarNumber: "Aadhaar Card Number",
    requiredDocuments: "2. Required Proof Documents",
    uploadDocNote: "Please upload clear scanned copies or clear photos (PDF, PNG, JPG - max 5MB).",
    feeSummary: "3. Government & Processing Fee",
    govtFee: "Government Fee",
    portalFee: "Portal Facilitation Fee",
    totalFee: "Total Payable Amount",
    submitAndPay: "Submit Application & Proceed to Payment",
    uploadingDoc: "Uploading Document...",

    // Section Titles & Buttons
    popularServices: "Popular E-Seva Digital Services",
    viewAllServices: "View All Directory →",
    howItWorks: "How E-Seva Portal Works",
    step1Title: "Select Service",
    step1Desc: "Choose from 100+ government and digital services",
    step2Title: "Fill & Upload",
    step2Desc: "Enter details and attach required proof documents",
    step3Title: "Pay & Track",
    step3Desc: "Pay official fee online and get instant SMS status updates",
    applyNow: "Apply Now",
    backToHome: "Back to Home",
    submitApplication: "Submit Application",
    downloadReceipt: "Download Receipt",
    contactSupport: "Contact Helpline Support",

    // Footer
    footerDesc: "Official Digital E-Seva Services Gateway empowering citizens with transparent, fast, and accessible digital governance.",
    quickLinks: "Quick Links",
    helpDesk: "Helpline & Support",
    tollFree: "Toll Free Helpline: 1800-425-1337",
    workingHours: "Mon - Sat: 9:00 AM - 6:00 PM",
    copyright: "© 2026 E-Seva Portal. Government of Tamil Nadu Digital Governance Project."
  },
  ta: {
    // Brand & Header
    portalName: "இ-சேவை போர்ட்டல்",
    tagline: "மின்னணு சேவைகள் எளிதாக",
    govTag: "தமிழ்நாடு அரசு மின்னணு இ-சேவை மையம்",
    
    // Nav Items
    home: "முகப்பு",
    eServices: "மின்னணு சேவைகள்",
    more: "மேலும்",
    about: "எங்களைப் பற்றி",
    contact: "தொடர்பு கொள்ள",
    checkStatus: "விண்ணப்ப நிலையை அறிய",
    signIn: "உள்நுழைவு",
    register: "பதிவு செய்ய",
    myDashboard: "என் டாஷ்போர்டு",
    myApplications: "என் விண்ணப்பங்கள்",
    paymentHistory: "கட்டண வரலாறு",
    notifications: "அறிவிப்புகள்",
    profileSettings: "சுயவிவர அமைப்புகள்",
    logout: "வெளியேறு",

    // Hero & Search
    heroTitle: "அனைத்து அரசு சேவைகளுக்கும் ஒரே இணையதளம்",
    heroSubtitle: "வருமானம், சாதி, ஆதார், பட்டா, பான், வாக்காளர் அட்டை மற்றும் பிற மின் சேவைகளுக்கு ஆன்லைனில் விண்ணப்பித்து உடனடி நிலை அறியலாம்.",
    searchPlaceholder: "சேவைகளைத் தேடவும் (ஆதார், பான், பட்டா, வருமானச் சான்றிதழ்)...",
    searchBtn: "சேவையைத் தேடு",
    trackApp: "விண்ணப்பத்தை ஆராய்",

    // Quick Stats / Badges
    activeServicesCount: "100+ நேரலை சேவைகள்",
    digitalProcessing: "100% பாதுகாப்பான மின்னணு முறை",
    fastDelivery: "2-3 நாட்களில் விரைவு சேவை",

    // Categories
    allCategories: "அனைத்து சேவைப் பிரிவுகள்",
    aadhaarServices: "ஆதார் சேவைகள்",
    aadhaarDesc: "புதிய ஆதார், முகவரி, போன் எண் மாற்றம்",
    panServices: "பான் கார்டு சேவைகள்",
    panDesc: "புதிய பான் கார்டு, திருத்தங்கள், ஆதார் இணைப்பு",
    voterServices: "வாக்காளர் அட்டை",
    voterDesc: "புதிய வாக்காளர் பதிவு, முகவரி மாற்றம்",
    certificates: "அரசு சான்றிதழ்கள்",
    certificatesDesc: "வருமானம், சாதி, இருப்பிடம், பிறப்பு/இறப்பு",
    landServices: "நிலம் & பட்டா சிட்டா",
    landDesc: "பட்டா மாறுதல், சிட்டா நகல், வில்லங்கச் சான்று",
    passportServices: "பாஸ்போர்ட் சேவைகள்",
    passportDesc: "புதிய பாஸ்போர்ட், புதுப்பித்தல், தட்கல்",
    drivingLicence: "ஓட்டுநர் உரிமம் (DL)",
    drivingDesc: "எல்.எல்.ஆர் (LLR), புதுப்பித்தல், முகவரி மாற்றம்",
    vehicleServices: "வாகன சேவைகள்",
    vehicleDesc: "ஆர்.சி (RC) பெயர் மாற்றம், என்.ஓ.சி, வரி செலுத்துதல்",
    businessServices: "வணிக சேவைகள்",
    businessDesc: "எம்.எஸ்.எம்.இ (MSME), ஜி.எஸ்.டி, உணவு உரிமம் (FSSAI)",
    utilityServices: "பயன்பாட்டுக் கட்டணங்கள்",
    utilityDesc: "மின்சாரக் கட்டணம், குடிநீர் & சொத்து வரி",
    otherServices: "இதர சேவைகள்",
    otherDesc: "ரேஷன் கார்டு, ஓய்வூதியம், வேலைவாய்ப்புப் பதிவு",

    // Dashboard & Applications
    welcomeUser: "வரவேற்கிறோம்,",
    userDashboardTitle: "பயனர் டாஷ்போர்டு & விண்ணப்ப மையம்",
    userDashboardDesc: "உங்கள் விண்ணப்பங்களைக் கண்காணிக்கலாம் மற்றும் 100+ சேவைகளுக்கு விண்ணப்பிக்கலாம்.",
    totalSubmitted: "சமர்ப்பிக்கப்பட்ட விண்ணப்பங்கள்",
    inProcessing: "ஆய்வில் உள்ள விண்ணப்பங்கள்",
    approvedApps: "ஒப்புதல் அளிக்கப்பட்டவை",
    rejectedApps: "நிராகரிக்கப்பட்ட / நடவடிக்கை தேவை",
    quickActions: "விரைவுச் செயல்பாடுகள்",
    applyNewService: "புதிய சேவைக்கு விண்ணப்பிக்க",
    trackAppStatus: "விண்ணப்ப நிலையை அறிய",
    viewPaymentLedger: "கட்டண வரலாற்றைப் பார்க்க",
    myRecentApplications: "என் சமீபத்திய விண்ணப்பங்கள்",
    appId: "விண்ணப்ப எண்",
    serviceName: "சேவையின் பெயர்",
    appliedDate: "விண்ணப்பித்த தேதி",
    status: "தற்போதைய நிலை",
    action: "செயல்பாடு",
    viewDetails: "விவரங்களைப் பார்க்க",
    noApplicationsFound: "இதுவரை எந்த விண்ணப்பமும் சமர்ப்பிக்கப்படவில்லை.",

    // Application Tracker
    trackTitle: "விண்ணப்ப நிலையை அறிதல்",
    trackSubtitle: "தற்போதைய நிலையைப் பார்க்க மற்றும் சான்றிதழ் பதிவிறக்கம் செய்ய விண்ணப்ப எண்ணை உள்ளிடவும்.",
    enterAppId: "விண்ணப்ப எண்ணை உள்ளிடவும் (எ.கா: APP-2026-8492)",
    trackNow: "நிலை அறிய",
    statusTimeline: "விண்ணப்ப பரிசீலனை நிலைகள்",
    dateSubmitted: "சமர்ப்பிக்கப்பட்ட தேதி",
    lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது",
    trackingHelp: "உதவி தேவையா? கட்டணமில்லா உதவி எண்ணை அழைக்கவும்: 1800-425-1337.",

    // Auth (Login / Register / Forgot Password)
    loginTitle: "இ-சேவை மையத்தில் உள்நுழையவும்",
    loginSubtitle: "உங்கள் டாஷ்போர்டு அணுகவும், விண்ணப்ப நிலையை அறியவும்.",
    registerTitle: "புதிய கணக்கு தொடங்க",
    registerSubtitle: "100+ மின்னணு அரசு சேவைகளைப் பெற பதிவு செய்யவும்.",
    forgotPasswordTitle: "கடவுச்சொல்லை மீட்டெடுக்க",
    forgotPasswordSubtitle: "உங்கள் பதிவெண் மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
    emailLabel: "மின்னஞ்சல் முகவரி",
    passwordLabel: "கடவுச்சொல்",
    confirmPasswordLabel: "கடவுச்சொல்லை உறுதிப்படுத்துக",
    rememberMe: "என்னை நினைவில் கொள்க",
    forgotPasswordLink: "கடவுச்சொல் மறந்துவிட்டதா?",
    dontHaveAccount: "கணக்கு இல்லையா?",
    alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    registerNow: "இப்போதே பதிவு செய்ய",
    loginBtn: "உள்நுழைக",
    registerBtn: "கணக்கை உருவாக்கு",
    resetPasswordBtn: "மீட்டமைப்பு இணைப்பு அனுப்புக",

    // User Profile & Settings
    profileTitle: "பயனர் சுயவிவரம் & கணக்கு அமைப்புகள்",
    personalInfo: "தனிப்பட்ட விவரங்கள்",
    saveChanges: "மாற்றங்களைச் சேமி",
    changePassword: "கடவுச்சொல்லை மாற்றுக",
    currentPassword: "தற்போதைய கடவுச்சொல்",
    newPassword: "புதிய கடவுச்சொல்",
    notificationPrefs: "அறிவிப்பு விருப்பங்கள்",
    emailNotifications: "மின்னஞ்சல் அறிவிப்புகள்",
    smsNotifications: "குறுஞ்செய்தி (SMS) அறிவிப்புகள்",

    // Payments & Receipts
    paymentLedgerTitle: "கட்டண வரலாறு & ரசீதுகள்",
    transactionId: "பரிவர்த்தனை எண்",
    paymentDate: "செலுத்திய தேதி",
    amountPaid: "செலுத்தப்பட்ட தொகை",
    paymentStatus: "கட்டண நிலை",
    paymentMethod: "செலுத்தும் முறை",
    downloadReceiptBtn: "PDF ரசீது பதிவிறக்கம்",
    paymentSuccessful: "கட்டணம் வெற்றிகரமாக செலுத்தப்பட்டது",

    // Admin Panel
    adminPortal: "இ-சேவை நிர்வாகி கட்டுப்பாட்டு மையம்",
    adminDashboardTitle: "முறைமை நிர்வாகம் & விண்ணப்பங்கள் மேலாண்மை",
    totalUsers: "மொத்த பயனர்கள்",
    totalApplicationsCount: "மொத்த விண்ணப்பங்கள்",
    revenueGenerated: "மொத்த பெறப்பட்ட கட்டணம்",
    pendingApplications: "நிலுவையில் உள்ள ஒப்புதல்கள்",
    allApplicationsList: "அனைத்து குடிமக்கள் விண்ணப்பங்கள்",
    filterStatus: "நிலை வாரியாக பிரிக்க",
    updateStatusBtn: "விண்ணப்ப நிலையை மாற்றுக",
    approveApplication: "ஒப்புதல் அளிக்கவும்",
    rejectApplication: "நிராகரிக்கவும்",
    sendNotification: "SMS / மின்னஞ்சல் அனுப்பவும்",

    // Static Pages & Errors
    aboutTitle: "இ-சேவை போர்ட்டல் பற்றி",
    contactTitle: "உதவி மையம் & தொடர்பு விவரங்கள்",
    careersTitle: "வேலைவாய்ப்பு & அரசு திட்ட பணி வாய்ப்புகள்",
    privacyTitle: "தனியுரிமைக் கொள்கை & தரவு பாதுகாப்பு",
    termsTitle: "சேவை விதிகள் & நிபந்தனைகள்",
    refundTitle: "கட்டணத் திரும்பப் பெறல் கொள்கை",
    pageNotFoundTitle: "பக்கம் கிடைக்கவில்லை (404)",
    pageNotFoundDesc: "நீங்கள் தேடிய பக்கம் அல்லது சேவை முகவரி கிடைக்கவில்லை.",

    // Status Badges
    statusPending: "ஆய்வுக்கு நிலுவையில் உள்ளது",
    statusSubmitted: "சமர்ப்பிக்கப்பட்டது",
    statusInReview: "ஆய்வில் உள்ளது",
    statusApproved: "ஒப்புதல் அளிக்கப்பட்டது",
    statusRejected: "நிராகரிக்கப்பட்டது",

    // Application Form & Apply Service
    applicationFormTitle: "மின்னணு சேவை விண்ணப்பப் படிவம்",
    applicantInformation: "1. விண்ணப்பதாரர் விவரங்கள்",
    fullName: "முழு பெயர் (ஆதாரில் உள்ளபடி)",
    mobileNumber: "கைபேசி எண்",
    emailAddress: "மின்னஞ்சல் முகவரி",
    residentialAddress: "வீட்டு முகவரி",
    aadhaarNumber: "ஆதார் கார்டு எண்",
    requiredDocuments: "2. தேவையான சான்று ஆவணங்கள்",
    uploadDocNote: "தெளிவான நகல்கள் அல்லது புகைப்படங்களை பதிவேற்றவும் (PDF, PNG, JPG - அதிகபட்சம் 5MB).",
    feeSummary: "3. அரசு & சேவை கட்டண விவரம்",
    govtFee: "அரசு கட்டணம்",
    portalFee: "இ-சேவை கட்டணம்",
    totalFee: "மொத்த செலுத்துகைத் தொகை",
    submitAndPay: "விண்ணப்பத்தைச் சமர்ப்பித்து கட்டணம் செலுத்தவும்",
    uploadingDoc: "ஆவணம் பதிவேற்றப்படுகிறது...",

    // Section Titles & Buttons
    popularServices: "முக்கியமான இ-சேவைகள்",
    viewAllServices: "அனைத்து சேவைகளையும் பார்க்க →",
    howItWorks: "இ-சேவை போர்ட்டல் எவ்வாறு செயல்படுகிறது?",
    step1Title: "சேவையைத் தேர்ந்தெடுக்கவும்",
    step1Desc: "100-க்கும் மேற்பட்ட அரசு சேவைகளில் தேவையானதைத் தேர்வு செய்யவும்",
    step2Title: "விவரங்களை நிரப்பி பதிவேற்றவும்",
    step2Desc: "விவரங்களை பூர்த்தி செய்து தேவையான சான்றுகளை பதிவேற்றவும்",
    step3Title: "கட்டணம் செலுத்தி கண்காணிக்கவும்",
    step3Desc: "ஆன்லைன் மூலம் கட்டணம் செலுத்தி குறுஞ்செய்தி மூலம் நிலை அறியலாம்",
    applyNow: "விண்ணப்பிக்க",
    backToHome: "முகப்பிற்குச் செல்ல",
    submitApplication: "விண்ணப்பத்தைச் சமர்ப்பி",
    downloadReceipt: "ரசீது பதிவிறக்கம்",
    contactSupport: "உதவி மையத்தைத் தொடர்புகொள்ள",

    // Footer
    footerDesc: "பொதுமக்களுக்கு வேகமான, வெளிப்படையான டிஜிட்டல் அரசு சேவைகளை வழங்கும் அதிகாரப்பூர்வ இ-சேவை போர்ட்டல்.",
    quickLinks: "முக்கிய இணைப்புகள்",
    helpDesk: "உதவி மையம் & ஆதரவு",
    tollFree: "கட்டணமில்லா உதவி எண்: 1800-425-1337",
    workingHours: "திங்கள் - சனி: காலை 9:00 - மாலை 6:00",
    copyright: "© 2026 இ-சேவை போர்ட்டல். தமிழ்நாடு அரசு டிஜிட்டல் ஆளுகைத் திட்டம்."
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('eseva_lang') || 'en';
  });

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'ta' : 'en';
    setLang(nextLang);
    localStorage.setItem('eseva_lang', nextLang);
  };

  const setLanguage = (newLang) => {
    if (newLang === 'en' || newLang === 'ta') {
      setLang(newLang);
      localStorage.setItem('eseva_lang', newLang);
    }
  };

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

