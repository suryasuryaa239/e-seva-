import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search, Clock, FileCheck, ArrowRight, Filter, AlertCircle, Fingerprint, CreditCard, Vote, FileText, MapPin, Globe, Car, Briefcase, Zap, Grid, X, CheckCircle2
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedService } from '../data/servicesCatalogData';

const CATEGORY_TA_NAMES = {
  'aadhaar-services': 'ஆதார் சேவைகள்',
  'Aadhaar Services': 'ஆதார் சேவைகள்',
  'pan-services': 'PAN சேவைகள்',
  'PAN Services': 'PAN சேவைகள்',
  'voter-id-services': 'வாக்காளர் அடையாள அட்டை சேவைகள்',
  'Voter ID Services': 'வாக்காளர் அடையாள அட்டை சேவைகள்',
  'certificate-services': 'சான்றிதழ் சேவைகள்',
  'certificates': 'சான்றிதழ் சேவைகள்',
  'Certificate Services': 'சான்றிதழ் சேவைகள்',
  'land-patta-services': 'நிலம் & பட்டா சேவைகள்',
  'land-services': 'நிலம் & பட்டா சேவைகள்',
  'Land / Patta Services': 'நிலம் & பட்டா சேவைகள்',
  'passport-services': 'பாஸ்போர்ட் சேவைகள்',
  'Passport Services': 'பாஸ்போர்ட் சேவைகள்',
  'driving-licence-vehicle-services': 'ஓட்டுநர் உரிமம் & வாகனம்',
  'driving-services': 'ஓட்டுநர் உரிமம் & வாகனம்',
  'Driving Licence / Vehicle': 'ஓட்டுநர் உரிமம் & வாகனம்',
  'business-services': 'வணிகச் சேவைகள்',
  'Business Services': 'வணிகச் சேவைகள்',
  'utility-services': 'பயன்பாட்டுச் சேவைகள்',
  'Utility Services': 'பயன்பாட்டுச் சேவைகள்',
  'other-digital-services': 'பிற டிஜிட்டல் சேவைகள்',
  'Other Digital Services': 'பிற டிஜிட்டல் சேவைகள்',
  'ration-card-services': 'ரேஷன் கார்டு சேவைகள்',
  'Ration Card Services': 'ரேஷன் கார்டு சேவைகள்'
};

export default function ServicesDirectory() {
  const { lang, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('popular');
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

  const localizedServices = services.map(srv => getLocalizedService(srv, lang));

  const filteredServices = localizedServices.filter((srv) => {
    const q = searchQuery.toLowerCase().trim();
    const catNameStr = (srv.category_name || '').toLowerCase();
    const matchesCategory =
      selectedCategory === 'All' ||
      srv.category_slug === selectedCategory ||
      catNameStr === selectedCategory.toLowerCase();

    if (!q) return matchesCategory;

    const matchesSearch =
      (srv.name || '').toLowerCase().includes(q) ||
      catNameStr.includes(q) ||
      (srv.description && srv.description.toLowerCase().includes(q)) ||
      (srv.eligibility && srv.eligibility.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === 'price_low_high') return (a.fee || 0) - (b.fee || 0);
    if (sortBy === 'price_high_low') return (b.fee || 0) - (a.fee || 0);
    if (sortBy === 'newest') return (b.id || 0) - (a.id || 0);
    return 0;
  });

  const getCategoryIcon = (slug = '') => {
    const s = slug.toLowerCase();
    let img = '/cat_ration.png';
    let FallbackIcon = Grid;

    if (s.includes('aadhaar')) { img = '/cat_aadhaar.png'; FallbackIcon = Fingerprint; }
    else if (s.includes('pan')) { img = '/cat_pan.png'; FallbackIcon = CreditCard; }
    else if (s.includes('voter')) { img = '/cat_voter.png'; FallbackIcon = Vote; }
    else if (s.includes('certificate')) { img = '/cat_certificates.png'; FallbackIcon = FileText; }
    else if (s.includes('land')) { img = '/cat_land.png'; FallbackIcon = MapPin; }
    else if (s.includes('passport')) { img = '/cat_passport.png'; FallbackIcon = Globe; }
    else if (s.includes('driving') || s.includes('vehicle')) { img = '/cat_driving.png'; FallbackIcon = Car; }
    else if (s.includes('business')) { img = '/cat_business.png'; FallbackIcon = Briefcase; }
    else if (s.includes('utility')) { img = '/cat_utility.png'; FallbackIcon = Zap; }

    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <img
          src={img}
          alt={slug}
          className="w-full h-full object-contain drop-shadow-sm"
          onError={(e) => {
            e.target.style.display = 'none';
            if (e.target.nextSibling) {
              e.target.nextSibling.style.display = 'flex';
            }
          }}
        />
        <div className="hidden w-full h-full items-center justify-center text-orange-500">
          <FallbackIcon className="w-8 h-8" />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 selection:bg-[#0b192c] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* BREADCRUMBS */}
        <Breadcrumbs items={[{ label: t.allServices || (lang === 'ta' ? 'அனைத்து சேவைகள்' : 'All Services') }]} />

        {/* HEADER SECTION */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm text-center space-y-6 relative overflow-hidden">
          
          {/* Accent Background Orbs */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <div>
              <span className="inline-block text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-3.5 py-1 rounded-full">
                {t.portalName}
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight">
              {t.allServices || (lang === 'ta' ? 'அனைத்து சேவைகள்' : 'All Services')}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              {t.findServiceSubtitle || (lang === 'ta' ? 'உங்களுக்குத் தேவையான சேவையைத் தேடுங்கள்' : 'Find the service you need')}
            </p>
          </div>

          {/* SEARCH BAR AREA */}
          <div className="max-w-2xl mx-auto pt-2 relative z-10">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={t.searchServicesPlaceholder || (lang === 'ta' ? 'சேவைகளைத் தேடுங்கள்...' : 'Search services...')}
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

        {/* CATEGORY FILTER TABS & SORTING */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-orange-500" /> {t.categoriesTitle || (lang === 'ta' ? 'சேவை வகைகள்' : 'Categories')}
              </span>
              <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/80">
                {filteredServices.length} {t.servicesCountSuffix || (lang === 'ta' ? 'சேவைகள்' : 'Services')}
              </span>
            </div>

            {/* SORTING CONTROLS */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-bold text-slate-500">{t.sortByTitle || (lang === 'ta' ? 'வரிசைப்படுத்து' : 'Sort By')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-1.5 focus:border-[#0b192c] outline-none shadow-xs cursor-pointer"
              >
                <option value="popular">{t.sortPopular || (lang === 'ta' ? 'பிரபலமானவை' : 'Popular')}</option>
                <option value="newest">{t.sortNewest || (lang === 'ta' ? 'புதியவை' : 'Newest')}</option>
                <option value="price_low_high">{t.sortPriceLowHigh || (lang === 'ta' ? 'விலை: குறைவிலிருந்து அதிகம்' : 'Price: Low to High')}</option>
                <option value="price_high_low">{t.sortPriceHighLow || (lang === 'ta' ? 'விலை: அதிகத்திலிருந்து குறைவு' : 'Price: High to Low')}</option>
              </select>
            </div>
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
              {t.allCategoriesFilter || (lang === 'ta' ? 'அனைத்து வகைகள்' : 'All Categories')} ({services.length})
            </button>

            {categories.map((cat) => {
              const catName = lang === 'ta' ? (CATEGORY_TA_NAMES[cat.slug] || CATEGORY_TA_NAMES[cat.name] || cat.name) : cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
                    selectedCategory === cat.slug
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90 shadow-xs'
                  }`}
                >
                  {catName}
                </button>
              );
            })}
          </div>
        </div>

        {/* SERVICE GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200/70 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : sortedServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sortedServices.map((srv) => (
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
                      {srv.fee > 0 ? `₹${srv.fee}` : (lang === 'ta' ? 'இலவசம்' : 'FREE')}
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
                      <Clock className="w-3 h-3 text-amber-500 shrink-0" /> {lang === 'ta' ? 'செயலாக்க நேரம்:' : 'SLA:'} {srv.processing_time || (lang === 'ta' ? '3-5 வேலை நாட்கள்' : '3-5 Days')}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> {lang === 'ta' ? 'மின்னணு முறை' : 'Online Application'}
                    </span>
                  </div>
                </div>

                {/* BOTTOM ACTION BUTTONS */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/enquiry/${srv.slug}`}
                    className="text-xs font-bold text-slate-700 hover:text-orange-600 transition-colors"
                  >
                    {t.viewDetailsBtn || (lang === 'ta' ? 'விவரங்களைப் பார்க்கவும்' : 'View Details')} →
                  </Link>

                  <Link
                    to={`/apply/${srv.slug || srv.id}`}
                    className="bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 group/btn"
                  >
                    <span>{t.applyNowBtn || (lang === 'ta' ? 'இப்போது விண்ணப்பிக்கவும்' : 'Apply Now')}</span>
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
              <h3 className="font-heading font-extrabold text-lg text-slate-900">
                {t.noServicesFound || (lang === 'ta' ? 'சேவைகள் எதுவும் கிடைக்கவில்லை' : 'No services found')}
              </h3>
              <p className="text-xs text-slate-500">
                {t.tryChangingSearch || (lang === 'ta'
                  ? 'உங்கள் தேடல் அல்லது வடிகட்டிகளை மாற்றிப் பார்க்கவும்.'
                  : 'Try changing your search or filters.')}
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all inline-flex items-center gap-2"
            >
              <span>{t.clearFiltersBtn || (lang === 'ta' ? 'வடிகட்டிகளை அழிக்கவும்' : 'Clear Filters')}</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
