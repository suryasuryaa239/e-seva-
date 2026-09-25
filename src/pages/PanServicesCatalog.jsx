import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CreditCard, FileText, UserCheck, ShieldCheck, MapPin, Smartphone, 
  Mail, Calendar, Download, Search, CheckCircle2, RefreshCw, AlertCircle, FileCheck, ArrowRight, HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedService } from '../data/servicesCatalogData';
import { useLiveServices } from '../utils/useLiveServices';

export default function PanServicesCatalog() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { getServiceFeeText } = useLiveServices();
  const [searchTerm, setSearchTerm] = useState('');

  const panServices = [
    {
      id: 'new-pan-card-indian',
      title: 'New PAN Card Application (Form 49A)',
      description: 'Apply for fresh 10-digit Permanent Account Number for Indian citizens and resident individuals.',
      fee: '₹110',
      sla: '5–7 Working Days',
      docs: ['Proof of Identity (Aadhaar/Voter)', 'Proof of Address', 'Date of Birth Proof', '2 Passport Photos'],
      icon: CreditCard,
      badge: 'Most Popular'
    },
    {
      id: 'pan-card-correction',
      title: 'PAN Card Name, DOB & Photo Correction',
      description: 'Correct spelling mistakes in name, parent name, date of birth, photo, or signature in existing PAN record.',
      fee: '₹110',
      sla: '5–7 Working Days',
      docs: ['Copy of Existing PAN', 'Supporting Marriage/Gazette Proof', 'Aadhaar / Passport'],
      icon: UserCheck,
      badge: 'High Demand'
    },
    {
      id: 'pan-aadhaar-linking',
      title: 'PAN-Aadhaar Linking Assistance',
      description: 'Link your PAN card with Aadhaar number to ensure continuous IT compliance and active status.',
      fee: '₹50',
      sla: '24–48 Hours',
      docs: ['10-Digit PAN Number', '12-Digit Aadhaar Number', 'Linked Mobile Number'],
      icon: ShieldCheck,
      badge: 'Mandatory'
    },
    {
      id: 'epan-download-instant',
      title: 'Instant e-PAN Download (Digital PDF)',
      description: 'Download password-protected digitally signed e-PAN card PDF copy instantly for emergency submission.',
      fee: '₹30',
      sla: 'Instant Download',
      docs: ['PAN Number or Ack Number', 'Aadhaar Registered OTP'],
      icon: Download,
      badge: 'Instant'
    },
    {
      id: 'pan-reprint-lost-damaged',
      title: 'Reprint Lost or Damaged Physical PAN Card',
      description: 'Order exact duplicate physical plastic PAN card dispatched to your home address for lost/broken cards.',
      fee: '₹100',
      sla: '5–7 Delivery Days',
      docs: ['Existing PAN Number', 'Delivery Postal Address', 'Aadhaar Copy'],
      icon: RefreshCw
    },
    {
      id: 'new-pan-foreign-national',
      title: 'New PAN Card for NRI / Foreign Citizen (Form 49AA)',
      description: 'PAN card application for Foreign Nationals, NRIs, Overseas Companies, and Foreign Entities.',
      fee: '₹1,020',
      sla: '7–10 Working Days',
      docs: ['Valid Passport', 'Bank Account Statement / OCI Card', 'Overseas Address Proof'],
      icon: FileText
    },
    {
      id: 'minor-to-major-pan-update',
      title: 'Minor to Major PAN Card Update',
      description: 'Update PAN record upon turning 18 years of age with new photo, adult signature, and updated records.',
      fee: '₹110',
      sla: '5–7 Working Days',
      docs: ['Proof of Age (18+)', 'Current Aadhaar Copy', 'Fresh Signature Scan'],
      icon: Calendar
    },
    {
      id: 'pan-status-verification',
      title: 'PAN Active Status & Verification Check',
      description: 'Check active status, AO Code, jurisdiction details, and verification report for any valid PAN card.',
      fee: '₹0 (Free)',
      sla: 'Instant Report',
      docs: ['10-Digit PAN Number', 'Full Name as per PAN', 'Date of Birth'],
      icon: CheckCircle2,
      badge: 'Free Service'
    }
  ];

  const localizedPanServices = panServices.map(s => {
    const loc = getLocalizedService({ slug: s.id, name: s.title, description: s.description }, lang);
    return {
      ...s,
      title: loc.name || s.title,
      description: loc.description || s.description
    };
  });

  const filteredServices = localizedPanServices.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Banner Section */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-indigo-800/40">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold">
            <CreditCard className="w-3.5 h-3.5" />
            <span>{lang === 'ta' ? 'PAN சேவை மைய பயன்பாட்டு போர்ட்டல்' : 'Official Facilitation & Application Assistance Portal'}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {lang === 'ta' ? 'PAN கார்டு சேவைகள் பட்டியல்' : 'PAN Services Portal & Application Facilitation'}
              </h1>
              <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                {lang === 'ta' ? 'புதிய PAN கார்டு (படிவம் 49A/49AA), பெயர் & பிறந்த தேதி திருத்தம், PAN-ஆதார் இணைப்பு மற்றும் e-PAN பதிவிறக்கம்.' : 'Apply for New PAN Card (Form 49A/49AA), Name & DOB Correction, PAN-Aadhaar Linking, Physical Card Reprint, and e-PAN Download with doorstep processing support.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              {/* PAN Card Visual Mockup Frame */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 shadow-2xl flex items-center justify-center w-full sm:w-64 h-36 overflow-hidden group hover:border-indigo-400/50 transition-all">
                <img 
                  src="/pan_card.png" 
                  alt="Income Tax Department Government of India PAN Card" 
                  className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300 rounded-lg"
                />
              </div>

              {/* Helpdesk Helpline */}
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 min-w-[200px] w-full sm:w-auto shrink-0">
                <div className="text-xs text-indigo-200 uppercase font-bold tracking-wider">{lang === 'ta' ? 'உதவி எண்' : 'Helpdesk Helpline'}</div>
                <div className="text-lg font-extrabold text-white mt-0.5">1800-180-1961</div>
                <div className="text-[11px] text-slate-300">{lang === 'ta' ? 'திங்கள் - சனி: காலை 9:00 - மாலை 7:00' : 'Mon - Sat: 9:00 AM to 7:00 PM'}</div>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="pt-2">
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={lang === 'ta' ? 'PAN சேவைகளைத் தேடுங்கள் (படிவம் 49A, பெயர் திருத்தம், இணைப்பு)...' : 'Search PAN services (e.g. Form 49A, Name Correction, Linking, e-PAN PDF)...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Quick Statutory Notice Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-blue-900 shadow-sm">
          <AlertCircle className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-blue-950">{lang === 'ta' ? 'முக்கிய அறிவிப்பு:' : 'Important Notice:'}</span> {lang === 'ta' ? 'வருமான வரி சட்டம் பிரிவு 272B-ன் படி ஒன்றுக்கும் மேற்பட்ட PAN அட்டை வைத்திருப்பது சட்டவிரோதமானது. ஏற்கனவே PAN இருந்தால் திருத்தம் அல்லது மறுபதிப்பிற்கு விண்ணப்பிக்கவும்.' : 'Holding more than one PAN card is illegal under Section 272B of Income Tax Act 1961 and attracts ₹10,000 penalty.'}
          </div>
        </div>

        {/* Services Grid Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{lang === 'ta' ? `கிடைக்கும் PAN சேவைகள் (${filteredServices.length})` : `Available PAN Services (${filteredServices.length})`}</h2>
            <p className="text-xs text-slate-500">{lang === 'ta' ? 'ஆன்லைன் விண்ணப்பத்தைத் தொடங்க கீழே உள்ள சேவையைத் தேர்ந்தெடுக்கவும்.' : 'Select a PAN service below to start your online application wizard.'}</p>
          </div>
          <Link
            to="/tracker"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center space-x-1"
          >
            <span>{lang === 'ta' ? 'ஏற்கனவே விண்ணப்பித்தீர்களா? நிலை அறிய' : 'Already Applied? Track Application'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    {service.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        service.badge === 'Instant' ? 'bg-emerald-100 text-emerald-800' :
                        service.badge === 'Mandatory' ? 'bg-amber-100 text-amber-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>{lang === 'ta' ? 'சேவை கட்டணம்:' : 'Service Fee:'}</span>
                      <span className="font-bold text-slate-900">{getServiceFeeText(service.id, service.fee, lang)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>{lang === 'ta' ? 'செயலாக்க காலம்:' : 'Processing Time:'}</span>
                      <span className="font-semibold text-slate-700">{service.sla}</span>
                    </div>
                  </div>

                  {/* Required Documents Section */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-700">{lang === 'ta' ? 'தேவையான சான்றுகள்:' : 'Required Documents:'}</div>
                    <ul className="space-y-1">
                      {service.docs.map((doc, idx) => (
                        <li key={idx} className="text-[11px] text-slate-600 flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span className="truncate">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Apply Action Bar */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/enquiry/${service.id}`}
                    className="text-xs font-bold text-slate-700 hover:text-indigo-600 hover:underline"
                  >
                    {lang === 'ta' ? 'விவரங்கள்' : 'View Details'}
                  </Link>

                  <button
                    onClick={() => navigate(`/apply/${service.id}`)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
                  >
                    <span>{t.applyNow || (lang === 'ta' ? 'விண்ணப்பிக்க' : 'Apply Now')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guidelines / How PAN Application Works */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <span>How PAN Card Application Process Works</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">1</div>
              <div className="font-bold text-slate-800">Select Service</div>
              <div className="text-slate-600">Choose New PAN (Form 49A), Correction, or Linking service card.</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">2</div>
              <div className="font-bold text-slate-800">Fill Details</div>
              <div className="text-slate-600">Enter applicant name, DOB, father name, and address details.</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">3</div>
              <div className="font-bold text-slate-800">Upload Documents</div>
              <div className="text-slate-600">Upload identity proof, address proof, DOB certificate & photo.</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">4</div>
              <div className="font-bold text-slate-800">Get Application ID</div>
              <div className="text-slate-600">Receive instant Acknowledgement Number & track status online.</div>
            </div>
          </div>
        </div>

        {/* PHYSICAL & DIGITAL PAN CARD SPECIFICATION HIGHLIGHT */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-sm w-full bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shadow-2xl">
                <img 
                  src="/pan_card.png" 
                  alt="Government of India Permanent Account Number PAN Card"
                  className="w-full h-auto object-contain rounded-xl drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
                <div className="mt-2.5 text-center text-[11px] text-indigo-200 font-semibold tracking-wide">
                  {lang === 'ta' ? 'அங்கீகரிக்கப்பட்ட இந்திய அரசு PAN அட்டை மாதிரி' : 'Authorized Government of India PAN Card Specimen'}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <span className="inline-block text-[11px] font-extrabold text-indigo-300 uppercase tracking-widest bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full">
                {lang === 'ta' ? 'அதிகாரப்பூர்வ PAN அட்டை வசதிகள்' : 'OFFICIAL PAN CARD FEATURES'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {lang === 'ta' ? '10 இலக்க நிரந்தர கணக்கு எண் (Permanent Account Number)' : '10-Digit Alphanumeric Permanent Account Number'}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {lang === 'ta' 
                  ? 'இந்திய வருமான வரித்துறையால் (Income Tax Department) வழங்கப்படுகின்ற இந்த PAN அட்டை, அனைத்து வங்கி கணக்குகள், நிதி பரிவர்த்தனைகள் மற்றும் வருமான வரிக் கணக்கு தாக்கல் செய்ய கட்டாயமானது. புதிய அட்டை, திருத்தம் மற்றும் மறுபதிப்பு சேவைகளை இ-சேவை மையம் மூலம் எளிதாகப் பெறுங்கள்.'
                  : 'Issued by the Income Tax Department of India. Mandatory for opening bank accounts, major financial transactions, filing IT returns, and investments. Get your laminated PVC card and instant e-PAN PDF delivered.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/10 border border-white/10 rounded-xl p-3 text-center">
                  <div className="text-sm sm:text-base font-extrabold text-emerald-400">QR Code</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">{lang === 'ta' ? 'டிஜிட்டல் சரிபார்ப்பு' : 'Enhanced Security'}</div>
                </div>
                <div className="bg-white/10 border border-white/10 rounded-xl p-3 text-center">
                  <div className="text-sm sm:text-base font-extrabold text-indigo-300">Hologram</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">{lang === 'ta' ? 'அரசு முத்திரை' : 'Govt ITD Emblem'}</div>
                </div>
                <div className="bg-white/10 border border-white/10 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                  <div className="text-sm sm:text-base font-extrabold text-amber-300">Speed Post</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">{lang === 'ta' ? 'வீட்டுக்கே டெலிவரி' : 'Doorstep Dispatch'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
