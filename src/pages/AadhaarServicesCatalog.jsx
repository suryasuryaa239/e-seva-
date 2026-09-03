import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Fingerprint, CreditCard, UserCheck, ShieldCheck, MapPin, Smartphone, 
  Mail, Calendar, Image as ImageIcon, FileCheck, ArrowRight, Download, Search, CheckCircle2, Landmark 
} from 'lucide-react';

export default function AadhaarServicesCatalog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const aadhaarServices = [
    {
      id: 'aadhaar-address-update',
      title: 'Aadhaar Address Update Assistance',
      description: 'Update home address on Aadhaar card using valid electricity bill, rent agreement, or passport proof.',
      fee: '₹100',
      sla: '3–5 Working Days',
      docs: ['Address Proof (Passport/Utility Bill)', 'Current Aadhaar Copy'],
      icon: MapPin,
      badge: 'Popular'
    },
    {
      id: 'aadhaar-mobile-update',
      title: 'Aadhaar Mobile Number Update',
      description: 'Link or update active mobile number for OTP verification, DigiLocker login, and online services.',
      fee: '₹50',
      sla: '24–48 Hours',
      docs: ['Aadhaar Number', 'Active Mobile Number'],
      icon: Smartphone,
      badge: 'Fast SLA'
    },
    {
      id: 'aadhaar-name-update',
      title: 'Aadhaar Name Correction / Update',
      description: 'Correct spelling errors or update name post-marriage/gazette notification with proof.',
      fee: '₹100',
      sla: '3–5 Working Days',
      docs: ['Identity Proof (PAN/Voter/Passport)', 'Gazette Certificate (if applicable)'],
      icon: UserCheck
    },
    {
      id: 'aadhaar-email-update',
      title: 'Aadhaar Email ID Update',
      description: 'Link official email address to receive digital e-Aadhaar PDF alerts and verification notifications.',
      fee: '₹50',
      sla: '24 Hours',
      docs: ['Active Email Address', 'Aadhaar Number'],
      icon: Mail
    },
    {
      id: 'aadhaar-dob-update',
      title: 'Aadhaar Date of Birth Update',
      description: 'Update or correct date of birth with official Birth Certificate, SSLC Marksheet, or Passport.',
      fee: '₹100',
      sla: '3–5 Working Days',
      docs: ['Birth Certificate / SSLC Marksheet', 'Aadhaar Copy'],
      icon: Calendar
    },
    {
      id: 'aadhaar-photo-biometric',
      title: 'Aadhaar Photo & Biometric Update',
      description: 'Book appointment for photo, fingerprint scan, and iris scan updates for adults and children.',
      fee: '₹125',
      sla: 'Scheduled Desk Slot',
      docs: ['Existing Aadhaar Copy'],
      icon: ImageIcon
    },
    {
      id: 'aadhaar-pvc-card',
      title: 'Aadhaar PVC Smart Card Order',
      description: 'Order durable, water-resistant PVC Aadhaar card with secure hologram and microtext.',
      fee: '₹75',
      sla: '5–7 Delivery Days',
      docs: ['Aadhaar Number', 'Delivery Address'],
      icon: CreditCard,
      badge: 'Trending'
    },
    {
      id: 'aadhaar-download-print',
      title: 'Aadhaar Instant Download & Print',
      description: 'Download password-protected e-Aadhaar PDF copy with digital signature verification.',
      fee: '₹30',
      sla: 'Instant PDF',
      docs: ['Aadhaar Number / Enrollment EID', 'Linked Mobile OTP'],
      icon: Download
    },
    {
      id: 'aadhaar-document-update',
      title: 'Mandatory 10-Year Document Re-Validation',
      description: 'Re-validate PoI and PoA for Aadhaar issued over 10 years ago as per UIDAI guidelines.',
      fee: '₹50',
      sla: '3–5 Working Days',
      docs: ['Proof of Identity (PoI)', 'Proof of Address (PoA)'],
      icon: FileCheck
    },
    {
      id: 'aadhaar-pan-linking',
      title: 'Aadhaar-PAN Linking Assistance',
      description: 'Verify and link Aadhaar number with PAN card to ensure active income tax compliance.',
      fee: '₹50',
      sla: '24 Hours',
      docs: ['PAN Card Copy', 'Aadhaar Copy'],
      icon: ShieldCheck
    },
    {
      id: 'aadhaar-new-enrollment',
      title: 'New Aadhaar Enrollment Desk Slot',
      description: 'Assistance for first-time Aadhaar enrollment appointment for newborns, children, and adults.',
      fee: '₹0 (Free Govt Service)',
      sla: 'Appointment Slot',
      docs: ['Birth Certificate', 'Parent Aadhaar (for minors)'],
      icon: Fingerprint
    },
    {
      id: 'aadhaar-gender-update',
      title: 'Aadhaar Gender Update',
      description: 'Update gender record in Aadhaar database with valid identity self-declaration or medical proof.',
      fee: '₹100',
      sla: '3 Days',
      docs: ['Medical / Identity Self-Declaration'],
      icon: UserCheck
    }
  ];

  const filtered = aadhaarServices.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-600 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Hero Banner with Stylized Aadhaar Digital Identity Graphic */}
        <div className="bg-[#0b192c] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800 space-y-6">
          
          {/* Stylized Aadhaar Digital Identity Vector Pattern Background Overlay */}
          <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-end overflow-hidden">
            <svg className="w-full h-full max-w-2xl text-orange-500 opacity-30 transform translate-x-1/4 scale-125" viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="50" y="40" width="400" height="220" rx="20" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" />
              <circle cx="120" cy="120" r="35" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
              <path d="M120 95 C110 95 105 105 105 120 C105 135 120 145 120 145 C120 145 135 135 135 120 C135 105 130 95 120 95 Z" stroke="currentColor" strokeWidth="1.5" />
              <rect x="180" y="95" width="220" height="12" rx="4" fill="currentColor" fillOpacity="0.3" />
              <rect x="180" y="120" width="160" height="10" rx="4" fill="currentColor" fillOpacity="0.2" />
              <rect x="180" y="140" width="190" height="10" rx="4" fill="currentColor" fillOpacity="0.2" />
              <rect x="75" y="190" width="325" height="40" rx="8" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1" />
              <path d="M90 210 H380" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
            </svg>
          </div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-orange-500/10 text-orange-400 text-xs font-extrabold rounded-full border border-orange-500/20">
              <Fingerprint className="w-4 h-4 text-orange-400" />
              <span>AADHAAR DIGITAL ASSISTANCE DESK</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-white">
              Aadhaar Services Catalog
            </h1>
            
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal max-w-2xl">
              Professional application assistance for address updates, mobile linking, PVC smart card orders, mandatory 10-year document re-validations, and instant e-Aadhaar downloads.
            </p>
          </div>

          {/* Search Input Box */}
          <div className="relative z-10 pt-2 max-w-xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-orange-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Aadhaar services (e.g. Address, Mobile, PVC, Name)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/80 text-white placeholder-slate-400 text-xs sm:text-sm rounded-2xl pl-11 pr-4 py-3.5 border border-slate-700 focus:border-orange-500 focus:bg-slate-900 outline-none transition-all shadow-xs font-medium"
              />
            </div>
          </div>

        </div>

        {/* Sub-Services Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-blue-900" />
              <span>Aadhaar Service Options ({filtered.length})</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Private Application Assistance Desk</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((service) => {
              const IconComp = service.icon || Fingerprint;
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-colors">
                        <IconComp className="w-5 h-5" />
                      </div>
                      {service.badge && (
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed font-normal">
                        {service.description}
                      </p>
                    </div>

                    {/* Docs Required */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Required Documents:
                      </span>
                      <ul className="text-[11px] text-slate-600 space-y-0.5">
                        {service.docs.map((doc, idx) => (
                          <li key={idx} className="flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                            <span className="truncate">{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Fee & Action Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Service Fee</span>
                      <span className="text-sm font-black text-slate-900">{service.fee}</span>
                    </div>

                    <button
                      onClick={() => navigate(`/apply/${service.id}`)}
                      className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition-all"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
