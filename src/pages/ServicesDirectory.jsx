import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search, Clock, FileCheck, ArrowRight, Filter, AlertCircle, Fingerprint, CreditCard, Vote, FileText, MapPin, Globe, Car, Briefcase, Zap, Grid, X, CheckCircle2
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ServicesDirectory() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((r) => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/services').then((r) => r.ok ? r.json() : []).catch(() => [])
    ])
      .then(([catData, srvData]) => {
        if (Array.isArray(catData) && catData.length > 0) setCategories(catData);
        if (Array.isArray(srvData) && srvData.length > 0) setServices(srvData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredServices = services.filter((srv) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesCategory =
      selectedCategory === 'All' ||
      srv.category_slug === selectedCategory ||
      srv.category_name.toLowerCase() === selectedCategory.toLowerCase();

    if (!q) return matchesCategory;

    const matchesSearch =
      srv.name.toLowerCase().includes(q) ||
      srv.category_name.toLowerCase().includes(q) ||
      (srv.description && srv.description.toLowerCase().includes(q)) ||
      (srv.eligibility && srv.eligibility.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (slug = '') => {
    const s = slug.toLowerCase();
    let img = '/cat_ration.png';
    if (s.includes('aadhaar')) img = '/cat_aadhaar.png';
    else if (s.includes('pan')) img = '/cat_pan.png';
    else if (s.includes('voter')) img = '/cat_voter.png';
    else if (s.includes('certificate')) img = '/cat_certificates.png';
    else if (s.includes('land')) img = '/cat_land.png';
    else if (s.includes('passport')) img = '/cat_passport.png';
    else if (s.includes('driving') || s.includes('vehicle')) img = '/cat_driving.png';
    else if (s.includes('business')) img = '/cat_business.png';
    else if (s.includes('utility')) img = '/cat_utility.png';

    return (
      <img
        src={img}
        alt={slug}
        className="w-full h-full object-contain drop-shadow-sm"
      />
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 selection:bg-[#0b192c] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* BREADCRUMBS */}
        <Breadcrumbs items={[{ label: 'All Services' }]} />

        {/* HEADER SECTION */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm text-center space-y-6 relative overflow-hidden">
          
          {/* Accent Background Orbs */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <div>
              <span className="inline-block text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-3.5 py-1 rounded-full">
                E-SERVICES
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight">
              All Digital Services
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              Find the service you need and get started quickly. Convenient access to official digital services from one central portal.
            </p>
          </div>

          {/* SEARCH BAR AREA */}
          <div className="max-w-2xl mx-auto pt-2 relative z-10">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search services (e.g. Aadhaar, PAN Card, Income Certificate)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-2xl pl-12 pr-10 py-4 border border-slate-300 focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-xs font-medium"
              />
              <Search className="w-5 h-5 text-orange-500 absolute left-4 top-4 pointer-events-none" />
              
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/60 transition-colors"
                  aria-label="Clear Search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-orange-500" /> Filter by Category
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900">{filteredServices.length}</span> services
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
                selectedCategory === 'All'
                  ? 'bg-[#0b192c] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90 shadow-xs'
              }`}
            >
              All Services ({services.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90 shadow-xs'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* SERVICE GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200/70 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between space-y-4 group h-full"
              >
                <div className="space-y-3">
                  {/* CATEGORY ICON & FEE BADGE */}
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-orange-50/30 border border-slate-200/90 p-1.5 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:border-orange-300 transition-all duration-300">
                      {getCategoryIcon(srv.category_slug)}
                    </div>
                    <span className="text-[11px] font-extrabold text-orange-700 bg-orange-50 border border-orange-200/80 px-2.5 py-0.5 rounded-full">
                      {srv.fee > 0 ? `₹${srv.fee}` : 'FREE'}
                    </span>
                  </div>

                  {/* SERVICE NAME & DESCRIPTION */}
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5">
                      {srv.category_name}
                    </span>
                    <h3 className="font-heading font-extrabold text-base text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {srv.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-normal line-clamp-2 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  {/* SLA & PROOF DETAILS */}
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 font-medium">
                      <Clock className="w-3 h-3 text-amber-500 shrink-0" /> SLA: {srv.processing_time || '3-5 Days'}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> Online Application
                    </span>
                  </div>
                </div>

                {/* BOTTOM ACTION BUTTONS */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/service/${srv.slug}`}
                    className="text-xs font-bold text-slate-700 hover:text-orange-600 transition-colors"
                  >
                    View Details →
                  </Link>

                  <Link
                    to={`/service/${srv.slug}`}
                    className="bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 group/btn"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* EMPTY SEARCH RESULT STATE */
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/90 shadow-sm space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto text-orange-500">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-lg text-slate-900">No Services Found</h3>
              <p className="text-xs text-slate-500">
                No digital services match your current search "<span className="font-semibold text-slate-700">{searchQuery}</span>" or selected category filter.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all inline-flex items-center gap-2"
            >
              <span>Clear Search & Filters</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Aadhaar Services', slug: 'aadhaar-services' },
  { id: 2, name: 'PAN Services', slug: 'pan-services' },
  { id: 3, name: 'Voter ID Services', slug: 'voter-id-services' },
  { id: 4, name: 'Certificate Services', slug: 'certificate-services' },
  { id: 5, name: 'Land / Patta Services', slug: 'land-patta-services' },
  { id: 6, name: 'Passport Services', slug: 'passport-services' },
  { id: 7, name: 'Driving Licence / Vehicle', slug: 'driving-licence-vehicle-services' },
  { id: 8, name: 'Business Services', slug: 'business-services' },
  { id: 9, name: 'Utility Services', slug: 'utility-services' },
  { id: 10, name: 'Other Digital Services', slug: 'other-digital-services' }
];

const DEFAULT_SERVICES = [
  {
    id: 1,
    category_id: 1,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Aadhaar Address Update',
    slug: 'aadhaar-address-update',
    description: 'Update your residential address in official UIDAI database with valid proof of address.',
    processing_time: '3-5 Working Days',
    fee: 50
  },
  {
    id: 2,
    category_id: 1,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'PVC Aadhaar Card Order',
    slug: 'pvc-aadhaar-card-order',
    description: 'Order durable, waterproof plastic PVC Aadhaar Card with microtext and QR code.',
    processing_time: '7-10 Working Days',
    fee: 50
  },
  {
    id: 3,
    category_id: 1,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Aadhaar Name & DoB Correction',
    slug: 'aadhaar-name-dob-correction',
    description: 'Correct typographical errors in Name or Date of Birth in your UIDAI record.',
    processing_time: '5-7 Working Days',
    fee: 50
  },
  {
    id: 4,
    category_id: 1,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'New Aadhaar Enrollment Booking',
    slug: 'new-aadhaar-enrollment-booking',
    description: 'Book appointment slot and file initial pre-enrollment for new Aadhaar issuance.',
    processing_time: '15-30 Working Days',
    fee: 0
  },
  {
    id: 5,
    category_id: 2,
    category_name: 'PAN Services',
    category_slug: 'pan-services',
    name: 'New PAN Card Application (Form 49A)',
    slug: 'new-pan-card-application',
    description: 'Apply for fresh Permanent Account Number (PAN) for individuals and entities.',
    processing_time: '7-12 Working Days',
    fee: 107
  },
  {
    id: 6,
    category_id: 2,
    category_name: 'PAN Services',
    category_slug: 'pan-services',
    name: 'PAN Card Correction / Update',
    slug: 'pan-card-correction-update',
    description: 'Correct details in existing PAN card such as Name, DOB, Father Name, or Photo.',
    processing_time: '7-10 Working Days',
    fee: 107
  },
  {
    id: 7,
    category_id: 3,
    category_name: 'Voter ID Services',
    category_slug: 'voter-id-services',
    name: 'New Voter Registration (Form 6)',
    slug: 'new-voter-registration-form-6',
    description: 'Enroll as a new voter in the Electoral Roll of Election Commission of India.',
    processing_time: '15-25 Working Days',
    fee: 0
  },
  {
    id: 8,
    category_id: 3,
    category_name: 'Voter ID Services',
    category_slug: 'voter-id-services',
    name: 'Voter Address Transfer / Correction (Form 8)',
    slug: 'voter-address-transfer-form-8',
    description: 'Shift constituency address or correct voter details in EPIC card.',
    processing_time: '10-20 Working Days',
    fee: 25
  },
  {
    id: 9,
    category_id: 4,
    category_name: 'Certificate Services',
    category_slug: 'certificate-services',
    name: 'Income Certificate',
    slug: 'income-certificate',
    description: 'Official revenue document certifying annual family income from all sources.',
    processing_time: '7-14 Working Days',
    fee: 60
  },
  {
    id: 10,
    category_id: 4,
    category_name: 'Certificate Services',
    category_slug: 'certificate-services',
    name: 'Community / Caste Certificate',
    slug: 'community-caste-certificate',
    description: 'Revenue department certificate verifying community / caste category (BC/MBC/SC/ST).',
    processing_time: '10-15 Working Days',
    fee: 60
  },
  {
    id: 11,
    category_id: 4,
    category_name: 'Certificate Services',
    category_slug: 'certificate-services',
    name: 'Native / Domicile Certificate',
    slug: 'native-domicile-certificate',
    description: 'Official proof of continuous residence in the state for education and job quotas.',
    processing_time: '7-14 Working Days',
    fee: 60
  },
  {
    id: 12,
    category_id: 4,
    category_name: 'Certificate Services',
    category_slug: 'certificate-services',
    name: 'First Graduate Certificate',
    slug: 'first-graduate-certificate',
    description: 'Certificate for students who are the first person in their family to pursue graduation.',
    processing_time: '10-14 Working Days',
    fee: 60
  },
  {
    id: 13,
    category_id: 5,
    category_name: 'Land / Patta Services',
    category_slug: 'land-patta-services',
    name: 'Patta Transfer Application',
    slug: 'patta-transfer-application',
    description: 'Apply for Patta / Chitta ownership name transfer post land purchase or inheritance.',
    processing_time: '15-30 Working Days',
    fee: 100
  },
  {
    id: 14,
    category_id: 5,
    category_name: 'Land / Patta Services',
    category_slug: 'land-patta-services',
    name: 'Chitta Extract & FMB Map Download',
    slug: 'chitta-extract-fmb-download',
    description: 'Get verified digital copy of Chitta land record and Field Measurement Book (FMB) map.',
    processing_time: '1 Working Day',
    fee: 50
  },
  {
    id: 15,
    category_id: 6,
    category_name: 'Passport Services',
    category_slug: 'passport-services',
    name: 'Fresh Passport Application',
    slug: 'fresh-passport-application',
    description: 'Apply for fresh 36 or 60 page Ordinary Indian Passport under Normal scheme.',
    processing_time: '15-20 Working Days',
    fee: 1500
  },
  {
    id: 16,
    category_id: 7,
    category_name: 'Driving Licence / Vehicle',
    category_slug: 'driving-licence-vehicle-services',
    name: 'Learner Licence (LLR) Booking',
    slug: 'learner-licence-llr-booking',
    description: 'Apply for LLR test for Motorcycle, Light Motor Vehicle (Car) or Commercial category.',
    processing_time: '3-5 Working Days',
    fee: 350
  },
  {
    id: 17,
    category_id: 8,
    category_name: 'Business Services',
    category_slug: 'business-services',
    name: 'GST Registration Application',
    slug: 'gst-registration-application',
    description: 'Obtain 15-digit GSTIN for proprietorship, partnership, or private limited business.',
    processing_time: '5-7 Working Days',
    fee: 499
  },
  {
    id: 18,
    category_id: 9,
    category_name: 'Utility Services',
    category_slug: 'utility-services',
    name: 'Electricity Connection (EB) Name Transfer',
    slug: 'electricity-eb-name-transfer',
    description: 'Transfer EB service connection meter to new property owner name.',
    processing_time: '10-15 Working Days',
    fee: 200
  },
  {
    id: 19,
    category_id: 10,
    category_name: 'Other Digital Services',
    category_slug: 'other-digital-services',
    name: 'Ration Smart Card Add/Remove Member',
    slug: 'ration-smart-card-member-update',
    description: 'Add new born child or newly wed spouse or remove deceased member in Smart Ration Card.',
    processing_time: '7-15 Working Days',
    fee: 30
  }
];
