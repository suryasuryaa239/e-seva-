import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Clock, FileCheck, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight,
  HelpCircle, CreditCard, UserCheck, Search, Fingerprint, Vote, FileText, MapPin,
  Globe, Car, Briefcase, Zap, Grid, Shield, Check, Info, FileSpreadsheet, Lock
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ServiceDetails() {
  const { serviceId, slug } = useParams();
  const serviceParam = slug || serviceId;
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceParam]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/services/${serviceParam}`);
      if (res.ok) {
        const data = await res.json();
        setService(data);
      } else {
        // Fallback to default catalog item if backend server endpoint is offline
        const fallback = DEFAULT_SERVICES_MAP[serviceParam] || DEFAULT_SERVICES_MAP['aadhaar-address-update'];
        if (fallback) {
          setService(fallback);
        } else {
          throw new Error('Service not found');
        }
      }
    } catch (err) {
      // Use fallback matching serviceParam if possible
      const fallback = DEFAULT_SERVICES_MAP[serviceParam] || DEFAULT_SERVICES_MAP['aadhaar-address-update'];
      if (fallback) {
        setService(fallback);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categorySlug) => {
    switch (categorySlug) {
      case 'aadhaar':
      case 'aadhaar-services': return <Fingerprint className="w-8 h-8 text-orange-500" />;
      case 'pan':
      case 'pan-services': return <CreditCard className="w-8 h-8 text-orange-500" />;
      case 'voter':
      case 'voter-id-services': return <Vote className="w-8 h-8 text-orange-500" />;
      case 'certificates':
      case 'certificate-services': return <FileText className="w-8 h-8 text-orange-500" />;
      case 'land':
      case 'land-patta-services': return <MapPin className="w-8 h-8 text-orange-500" />;
      case 'passport':
      case 'passport-services': return <Globe className="w-8 h-8 text-orange-500" />;
      case 'driving-licence':
      case 'vehicle':
      case 'driving-licence-vehicle-services': return <Car className="w-8 h-8 text-orange-500" />;
      case 'business':
      case 'business-services': return <Briefcase className="w-8 h-8 text-orange-500" />;
      case 'utility':
      case 'utility-services': return <Zap className="w-8 h-8 text-orange-500" />;
      default: return <Grid className="w-8 h-8 text-orange-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center font-sans">
        <div className="bg-white rounded-3xl shadow-sm p-8 text-center max-w-sm w-full space-y-4 border border-slate-200">
          <div className="w-12 h-12 border-4 border-[#0b192c] border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-bold text-xs">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center font-sans">
        <div className="bg-white rounded-3xl shadow-sm p-8 text-center max-w-md w-full space-y-4 border border-slate-200">
          <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto border border-orange-100">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-heading font-extrabold text-slate-900">Service Not Found</h3>
          <p className="text-slate-500 text-xs leading-relaxed">The requested digital service details could not be retrieved from the directory.</p>
          <Link to="/services" className="inline-flex items-center space-x-2 px-6 py-3 bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Services</span>
          </Link>
        </div>
      </div>
    );
  }

  const defaultDocumentsList = [
    { name: 'Proof of Identity (PoI)', description: 'Aadhaar Card, Voter ID, Passport, or Driving Licence', required: true },
    { name: 'Proof of Address (PoA)', description: 'Utility Bill, Bank Passbook, Ration Card, or Rent Agreement', required: true },
    { name: 'Supporting Document / Declaration', description: 'Self-declaration form or gazetted officer certificate', required: true },
    { name: 'Recent Passport Photo', description: 'Color photograph with white background (JPEG/PNG max 2MB)', required: false }
  ];

  const documentsList = service.documents && service.documents.length > 0 
    ? service.documents 
    : defaultDocumentsList;

  const defaultFieldsList = [
    'Applicant Full Name (matching official identity proof)',
    '12-Digit Aadhaar Number or Enrollment ID',
    'Active Mobile Number for OTP Verification & SMS Updates',
    'Current Residential Address with 6-Digit Pincode'
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 selection:bg-[#0b192c] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* BREADCRUMBS */}
        <Breadcrumbs 
          items={[
            { label: 'E-Services', path: '/services' },
            { label: service.category_name || 'Category', path: `/services?category=${service.category_slug || 'all'}` },
            { label: service.name }
          ]} 
        />

        {/* FACILITATION DISCLAIMER */}
        <div className="bg-amber-50/80 border border-amber-200/90 p-4 rounded-2xl shadow-xs flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed font-medium">
            <span className="font-extrabold text-amber-950">Facilitation Desk Disclaimer: </span>
            This online service application is processed through our digital facilitation desk. We assist in document compilation, form filing, and application status tracking. Official issuance remains under the jurisdiction of the respective government authority.
          </div>
        </div>

        {/* TOP MAIN SECTION — TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT SIDE — SERVICE DETAILS (2 COLS) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm space-y-6 relative overflow-hidden">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                {getCategoryIcon(service.category_slug)}
              </div>

              <div className="space-y-1.5 flex-1">
                <span className="inline-block text-[11px] font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-3 py-0.5 rounded-full">
                  {service.category_name || 'DIGITAL SERVICE'}
                </span>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
                  {service.name}
                </h1>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Service Overview</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {service.description || 'Apply for official digital service facilitation online with verified document review and status tracking.'}
              </p>
            </div>

            {/* PRICE & SLA BADGES */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-5 py-3.5 flex items-center space-x-3">
                <div className="text-xs text-slate-500 font-medium">Service Fee:</div>
                <div className="text-2xl font-black text-orange-600">
                  {service.fee === 0 ? 'FREE' : `₹${service.fee}`}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-5 py-3.5 flex items-center space-x-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Estimated Processing (SLA)</div>
                  <div className="text-xs font-extrabold text-slate-900">{service.processing_time || '3-5 Working Days'}</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-5 py-3.5 flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Application Mode</div>
                  <div className="text-xs font-extrabold text-slate-900">100% Online Digital Desk</div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE — APPLICATION CARD (1 COL) */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6 sticky top-8">
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200 px-3 py-0.5 rounded-full inline-block">
                GET STARTED
              </span>
              <h2 className="font-heading font-extrabold text-2xl text-slate-900">
                Ready to Apply?
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Start your application and submit the required details securely online.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                to={`/apply/${service.slug || service.id}`}
                className="w-full py-4 px-6 bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 group/btn"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/track"
                className="w-full py-3 px-6 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200/60"
              >
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span>Check Application Status</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" /> Instant Application ID Generation
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" /> Verified Document Review Desk
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" /> 256-bit SSL Encrypted Portal
              </div>
            </div>
          </div>

        </div>

        {/* INFORMATION SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* ABOUT THIS SERVICE */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-4">
              <h2 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2 border-b pb-4 border-slate-100">
                <Info className="w-5 h-5 text-orange-500" />
                <span>About This Service</span>
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                <p>
                  {service.description || 'This service allows eligible applicants to apply for official digital updates, certificates, and government document facilitation online.'}
                </p>
                <p>
                  {service.eligibility || 'Eligible for resident Indian citizens holding valid identification and address proof documents as prescribed by statutory regulations.'}
                </p>
              </div>
            </div>

            {/* REQUIRED DOCUMENTS CHECKLIST */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b pb-4 border-slate-100">
                <h2 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                  <span>Required Documents Checklist</span>
                </h2>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {documentsList.length} Items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documentsList.map((doc, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-slate-900">{doc.name || doc.document_name}</h4>
                      <p className="text-[11px] text-slate-500 font-normal leading-relaxed">{doc.description || 'Valid proof document in PDF or image format.'}</p>
                      <span className="inline-block text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md mt-1">
                        {doc.required !== false ? 'Required Document' : 'Optional'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REQUIRED INFORMATION FIELDS */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-4">
              <h2 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2 border-b pb-4 border-slate-100">
                <FileSpreadsheet className="w-5 h-5 text-orange-500" />
                <span>Required Information Before Applying</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {defaultFieldsList.map((field, i) => (
                  <div key={i} className="flex items-start space-x-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span>{field}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* APPLICATION PROCESS 4-STEP VISUAL (1 COL) */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
              <h2 className="font-heading font-extrabold text-xl text-slate-900 border-b pb-4 border-slate-100">
                Application Process
              </h2>

              <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                
                {/* STEP 01 */}
                <div className="flex items-start space-x-4 relative">
                  <div className="w-8 h-8 rounded-full bg-[#0b192c] text-white font-extrabold text-xs flex items-center justify-center shrink-0 z-10">
                    01
                  </div>
                  <div className="space-y-1 pt-1">
                    <h4 className="text-xs font-extrabold text-slate-900">Details</h4>
                    <p className="text-[11px] text-slate-500 font-normal">Fill in personal identity & application details.</p>
                  </div>
                </div>

                {/* STEP 02 */}
                <div className="flex items-start space-x-4 relative">
                  <div className="w-8 h-8 rounded-full bg-[#0b192c] text-white font-extrabold text-xs flex items-center justify-center shrink-0 z-10">
                    02
                  </div>
                  <div className="space-y-1 pt-1">
                    <h4 className="text-xs font-extrabold text-slate-900">Documents</h4>
                    <p className="text-[11px] text-slate-500 font-normal">Upload required identity & address proofs.</p>
                  </div>
                </div>

                {/* STEP 03 */}
                <div className="flex items-start space-x-4 relative">
                  <div className="w-8 h-8 rounded-full bg-[#0b192c] text-white font-extrabold text-xs flex items-center justify-center shrink-0 z-10">
                    03
                  </div>
                  <div className="space-y-1 pt-1">
                    <h4 className="text-xs font-extrabold text-slate-900">Review</h4>
                    <p className="text-[11px] text-slate-500 font-normal">Verify all information before final submission.</p>
                  </div>
                </div>

                {/* STEP 04 */}
                <div className="flex items-start space-x-4 relative">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 z-10 shadow-xs">
                    04
                  </div>
                  <div className="space-y-1 pt-1">
                    <h4 className="text-xs font-extrabold text-slate-900">Payment</h4>
                    <p className="text-[11px] text-slate-500 font-normal">Complete service fee payment & get Application ID.</p>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-slate-100 text-center">
                <Link
                  to={`/apply/${service.slug || service.id}`}
                  className="w-full py-3.5 px-6 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition-colors shadow-xs inline-flex items-center justify-center gap-2"
                >
                  <span>Start Application</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

const DEFAULT_SERVICES_MAP = {
  'aadhaar-address-update': {
    id: 1,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Aadhaar Address Update',
    slug: 'aadhaar-address-update',
    description: 'Update your residential address in official UIDAI database with valid proof of address.',
    eligibility: 'Resident Indian citizen holding a valid 12-digit Aadhaar card with active registered mobile number.',
    processing_time: '3-5 Working Days',
    fee: 50,
    documents: [
      { name: 'Proof of Identity (PoI)', description: 'Valid Aadhaar Card or Passport', required: true },
      { name: 'Proof of Address (PoA)', description: 'Electricity Bill, Bank Passbook, or Rent Agreement', required: true },
      { name: 'Mobile OTP Verification', description: 'Active registered mobile for UIDAI OTP validation', required: true }
    ]
  },
  'pvc-aadhaar-card-order': {
    id: 2,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'PVC Aadhaar Card Order',
    slug: 'pvc-aadhaar-card-order',
    description: 'Order durable, waterproof plastic PVC Aadhaar Card with microtext, ghost image, and QR code.',
    eligibility: 'Any registered Aadhaar card holder.',
    processing_time: '7-10 Working Days',
    fee: 50
  },
  'new-pan-card-application': {
    id: 5,
    category_name: 'PAN Services',
    category_slug: 'pan-services',
    name: 'New PAN Card Application (Form 49A)',
    slug: 'new-pan-card-application',
    description: 'Apply for fresh Permanent Account Number (PAN) for individuals and entities.',
    eligibility: 'Any Indian citizen or entity requiring PAN for financial transactions.',
    processing_time: '7-12 Working Days',
    fee: 107
  },
  'income-certificate': {
    id: 9,
    category_name: 'Certificate Services',
    category_slug: 'certificate-services',
    name: 'Income Certificate',
    slug: 'income-certificate',
    description: 'Official revenue document certifying annual family income from all sources.',
    eligibility: 'Permanent residents requiring income verification for education or government subsidies.',
    processing_time: '7-14 Working Days',
    fee: 60
  }
};
