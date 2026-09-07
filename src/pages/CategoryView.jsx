import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Fingerprint, CreditCard, Vote, FileText, MapPin, Globe, Car, Briefcase, Zap, Grid,
  Search, ShieldAlert, Clock, FileCheck, ArrowRight, ArrowLeft, Info, Filter, ArrowUpDown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DEFAULT_SERVICES_MAP, getLocalizedService } from '../data/servicesCatalogData';

const ICON_MAP = {
  Fingerprint, CreditCard, Vote, FileText, MapPin, Globe, Car, Briefcase, Zap, Grid
};

const OFFLINE_CATEGORIES = {
  'aadhaar': { name: 'Aadhaar Services', name_ta: 'ஆதார் சேவைகள்', slug: 'aadhaar-services', icon: 'Fingerprint', description: 'Assistance for new enrollment, address updates, name corrections, mobile linking, PVC order, and download.', description_ta: 'புதிய சேர்க்கை, முகவரி மாற்றம், பெயர் திருத்தம், மொபைல் எண் இணைப்பு மற்றும் பிவிசி கார்டு விண்ணப்பங்கள்.' },
  'aadhaar-services': { name: 'Aadhaar Services', name_ta: 'ஆதார் சேவைகள்', slug: 'aadhaar-services', icon: 'Fingerprint', description: 'Assistance for new enrollment, address updates, name corrections, mobile linking, PVC order, and download.', description_ta: 'புதிய சேர்க்கை, முகவரி மாற்றம், பெயர் திருத்தம், மொபைல் எண் இணைப்பு மற்றும் பிவிசி கார்டு விண்ணப்பங்கள்.' },
  'pan': { name: 'PAN Services', name_ta: 'பான் கார்டு சேவைகள்', slug: 'pan-services', icon: 'CreditCard', description: 'New PAN Card (Form 49A/49AA), correction in existing PAN, e-PAN download, and PAN-Aadhaar linking assistance.', description_ta: 'புதிய பான் கார்டு, பான் அட்டை திருத்தங்கள், மின்-பான் பதிவிறக்கம் மற்றும் ஆதார் இணைப்பு.' },
  'pan-services': { name: 'PAN Services', name_ta: 'பான் கார்டு சேவைகள்', slug: 'pan-services', icon: 'CreditCard', description: 'New PAN Card (Form 49A/49AA), correction in existing PAN, e-PAN download, and PAN-Aadhaar linking assistance.', description_ta: 'புதிய பான் கார்டு, பான் அட்டை திருத்தங்கள், மின்-பான் பதிவிறக்கம் மற்றும் ஆதார் இணைப்பு.' },
  'voter': { name: 'Voter ID Services', name_ta: 'வாக்காளர் அடையாள அட்டை சேவைகள்', slug: 'voter-id-services', icon: 'Vote', description: 'New voter registration (Form 6), address shift (Form 8), epic download, and corrections.', description_ta: 'புதிய வாக்காளர் பதிவு, முகவரி மாற்றம், EPIC கார்டு பதிவிறக்கம் மற்றும் விவரத் திருத்தங்கள்.' },
  'voter-id-services': { name: 'Voter ID Services', name_ta: 'வாக்காளர் அடையாள அட்டை சேவைகள்', slug: 'voter-id-services', icon: 'Vote', description: 'New voter registration (Form 6), address shift (Form 8), epic download, and corrections.', description_ta: 'புதிய வாக்காளர் பதிவு, முகவரி மாற்றம், EPIC கார்டு பதிவிறக்கம் மற்றும் விவரத் திருத்தங்கள்.' },
  'certificates': { name: 'Certificate Services', name_ta: 'வருவாய் & ஈ-மாவட்ட சான்றிதழ்கள்', slug: 'certificates', icon: 'FileText', description: 'Income, Community, Nativity, Residence, First Graduate, and Legal Heir revenue certificates.', description_ta: 'வருமானம், சாதி, இருப்பிடம், முதல் பட்டதாரி மற்றும் வாரிசு சான்றிதழ் விண்ணப்பங்கள்.' },
  'certificate-services': { name: 'Certificate Services', name_ta: 'வருவாய் & ஈ-மாவட்ட சான்றிதழ்கள்', slug: 'certificates', icon: 'FileText', description: 'Income, Community, Nativity, Residence, First Graduate, and Legal Heir revenue certificates.', description_ta: 'வருமானம், சாதி, இருப்பிடம், முதல் பட்டதாரி மற்றும் வாரிசு சான்றிதழ் விண்ணப்பங்கள்.' },
  'land': { name: 'Land & Patta Services', name_ta: 'நிலப் பட்டா & சிட்டா சேவைகள்', slug: 'land-patta-services', icon: 'MapPin', description: 'Patta/Chitta extraction, Patta transfer, Adangal records, and land document verification assistance.', description_ta: 'பட்டா மாற்றம், சிட்டா பதிவிறக்கம், FMB வரைபடம் மற்றும் நில ஆவணங்கள் பெற.' },
  'land-patta-services': { name: 'Land & Patta Services', name_ta: 'நிலப் பட்டா & சிட்டா சேவைகள்', slug: 'land-patta-services', icon: 'MapPin', description: 'Patta/Chitta extraction, Patta transfer, Adangal records, and land document verification assistance.', description_ta: 'பட்டா மாற்றம், சிட்டா பதிவிறக்கம், FMB வரைபடம் மற்றும் நில ஆவணங்கள் பெற.' },
  'passport': { name: 'Passport & Travel', name_ta: 'பாஸ்போர்ட் சேவைகள்', slug: 'passport-services', icon: 'Globe', description: 'Fresh passport filing, re-issue, correction, and appointment slot booking assistance.', description_ta: 'புதிய பாஸ்போர்ட் விண்ணப்பம், புதுப்பித்தல், தட்கல் நியமனம் மற்றும் PCC சான்றிதழ்.' },
  'passport-services': { name: 'Passport & Travel', name_ta: 'பாஸ்போர்ட் சேவைகள்', slug: 'passport-services', icon: 'Globe', description: 'Fresh passport filing, re-issue, correction, and appointment slot booking assistance.', description_ta: 'புதிய பாஸ்போர்ட் விண்ணப்பம், புதுப்பித்தல், தட்கல் நியமனம் மற்றும் PCC சான்றிதழ்.' },
  'driving-licence': { name: 'Vehicle & DL Services', name_ta: 'ஓட்டுநர் உரிமம் & RTO சேவைகள்', slug: 'driving-vehicle-services', icon: 'Car', description: 'Learner Licence (LLR), Driving Licence renewal, duplicate DL, RC transfer, and FASTag assistance.', description_ta: 'LLR விண்ணப்பம், நிரந்தர ஓட்டுநர் உரிமம், புதுப்பித்தல் மற்றும் RC பெயர் மாற்றம்.' },
  'vehicle': { name: 'Vehicle & DL Services', name_ta: 'ஓட்டுநர் உரிமம் & RTO சேவைகள்', slug: 'driving-vehicle-services', icon: 'Car', description: 'Learner Licence (LLR), Driving Licence renewal, duplicate DL, RC transfer, and FASTag assistance.', description_ta: 'LLR விண்ணப்பம், நிரந்தர ஓட்டுநர் உரிமம், புதுப்பித்தல் மற்றும் RC பெயர் மாற்றம்.' },
  'driving-licence-vehicle-services': { name: 'Vehicle & DL Services', name_ta: 'ஓட்டுநர் உரிமம் & RTO சேவைகள்', slug: 'driving-vehicle-services', icon: 'Car', description: 'Learner Licence (LLR), Driving Licence renewal, duplicate DL, RC transfer, and FASTag assistance.', description_ta: 'LLR விண்ணப்பம், நிரந்தர ஓட்டுநர் உரிமம், புதுப்பித்தல் மற்றும் RC பெயர் மாற்றம்.' },
  'business': { name: 'Business Services', name_ta: 'வணிகம் & வர்த்தக சேவைகள்', slug: 'business-services', icon: 'Briefcase', description: 'Udyam MSME registration, FSSAI Food licence, GST filing, and business documentation.', description_ta: 'ஜிஎஸ்டி பதிவு, MSME உத்யம் சான்றிதழ் மற்றும் FSSAI உணவு பாதுகாப்பு உரிமம்.' },
  'business-services': { name: 'Business Services', name_ta: 'வணிகம் & வர்த்தக சேவைகள்', slug: 'business-services', icon: 'Briefcase', description: 'Udyam MSME registration, FSSAI Food licence, GST filing, and business documentation.', description_ta: 'ஜிஎஸ்டி பதிவு, MSME உத்யம் சான்றிதழ் மற்றும் FSSAI உணவு பாதுகாப்பு உரிமம்.' },
  'utility': { name: 'Utility Services', name_ta: 'மின்சாரம் & நகராட்சி சேவைகள்', slug: 'utility-services', icon: 'Zap', description: 'Electricity EB new connection application, bill payment assistance, and utility services.', description_ta: 'மின் இணைப்பு பெயர் மாற்றம், புதிய EB இணைப்பு மற்றும் சொத்து வரி செலுத்துதல்.' },
  'utility-services': { name: 'Utility Services', name_ta: 'மின்சாரம் & நகராட்சி சேவைகள்', slug: 'utility-services', icon: 'Zap', description: 'Electricity EB new connection application, bill payment assistance, and utility services.', description_ta: 'மின் இணைப்பு பெயர் மாற்றம், புதிய EB இணைப்பு மற்றும் சொத்து வரி செலுத்துதல்.' },
  'other': { name: 'Ration & Smart Card Services', name_ta: 'ரேஷன் அட்டை சேவைகள் (TNEPDS)', slug: 'other-services', icon: 'Grid', description: 'General e-Governance digital assistance, Smart Ration card filing, and citizen services.', description_ta: 'ஸ்மார்ட் ரேஷன் கார்டில் குடும்ப உறுப்பினர் சேர்க்கை, முகவரி மாற்றம் மற்றும் புதிய கார்டு.' },
  'other-services': { name: 'Ration & Smart Card Services', name_ta: 'ரேஷன் அட்டை சேவைகள் (TNEPDS)', slug: 'other-services', icon: 'Grid', description: 'General e-Governance digital assistance, Smart Ration card filing, and citizen services.', description_ta: 'ஸ்மார்ட் ரேஷன் கார்டில் குடும்ப உறுப்பினர் சேர்க்கை, முகவரி மாற்றம் மற்றும் புதிய கார்டு.' }
};

export default function CategoryView() {
  const { lang, t } = useLanguage();
  const { category, slug } = useParams();
  const catSlug = (slug || category || 'aadhaar-services').toLowerCase().trim();

  const [categoryData, setCategoryData] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetchCategoryAndServices();
  }, [catSlug, lang]);

  const fetchCategoryAndServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/categories/${catSlug}`);
      let catInfo = null;
      let rawServices = [];

      if (res.ok) {
        const data = await res.json();
        catInfo = data;
        rawServices = data.services || [];
      } else {
        const fallbackCat = OFFLINE_CATEGORIES[catSlug] || {
          name: catSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          slug: catSlug,
          icon: 'Grid',
          description: 'Official digital e-governance service category.'
        };

        const matchingServices = Object.values(DEFAULT_SERVICES_MAP).filter(s => {
          const sCat = (s.category_slug || s.category_name || '').toLowerCase();
          return sCat.includes(catSlug) || catSlug.includes(sCat) || catSlug.split('-')[0] === sCat.split('-')[0];
        });

        catInfo = fallbackCat;
        rawServices = matchingServices.length > 0 ? matchingServices : Object.values(DEFAULT_SERVICES_MAP);
      }

      setCategoryData({
        ...catInfo,
        displayName: lang === 'ta' && catInfo.name_ta ? catInfo.name_ta : catInfo.name,
        displayDesc: lang === 'ta' && catInfo.description_ta ? catInfo.description_ta : catInfo.description
      });

      const localizedList = rawServices.map(s => {
        const loc = getLocalizedService({ slug: s.slug || s.id, name: s.name, description: s.description }, lang);
        return {
          ...s,
          name: loc.name || s.name,
          description: loc.description || s.description
        };
      });

      setServices(localizedList);
    } catch (err) {
      const fallbackCat = OFFLINE_CATEGORIES[catSlug] || {
        name: catSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        slug: catSlug,
        icon: 'Grid',
        description: 'Official digital e-governance service category.'
      };

      const matchingServices = Object.values(DEFAULT_SERVICES_MAP).filter(s => {
        const sCat = (s.category_slug || s.category_name || '').toLowerCase();
        return sCat.includes(catSlug) || catSlug.includes(sCat) || catSlug.split('-')[0] === sCat.split('-')[0];
      });

      setCategoryData({
        ...fallbackCat,
        displayName: lang === 'ta' && fallbackCat.name_ta ? fallbackCat.name_ta : fallbackCat.name,
        displayDesc: lang === 'ta' && fallbackCat.description_ta ? fallbackCat.description_ta : fallbackCat.description
      });

      const localizedList = (matchingServices.length > 0 ? matchingServices : Object.values(DEFAULT_SERVICES_MAP)).map(s => {
        const loc = getLocalizedService({ slug: s.slug || s.id, name: s.name, description: s.description }, lang);
        return {
          ...s,
          name: loc.name || s.name,
          description: loc.description || s.description
        };
      });

      setServices(localizedList);
    } finally {
      setLoading(false);
    }
  };

  // Filter & Sort Services
  const filteredServices = services
    .filter(srv => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        srv.name.toLowerCase().includes(q) ||
        srv.description.toLowerCase().includes(q) ||
        (srv.slug && srv.slug.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'fee_asc') return a.fee - b.fee;
      if (sortBy === 'fee_desc') return b.fee - a.fee;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const CategoryIcon = categoryData && ICON_MAP[categoryData.icon] ? ICON_MAP[categoryData.icon] : Grid;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <Link to="/" className="hover:text-indigo-600">{lang === 'ta' ? 'முகப்பு' : 'Home'}</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-indigo-600">{lang === 'ta' ? 'சேவைகள்' : 'Services'}</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">{categoryData ? (categoryData.displayName || categoryData.name) : 'Category'}</span>
        </div>

        {/* NEUTRAL SAFETY / FACILITATION DISCLAIMER NOTICE */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            <span className="font-bold">{lang === 'ta' ? 'அறிவிப்பு & சேவை மைய தகவல்: ' : 'Notice & Disclaimer: '}</span>
            {lang === 'ta' ? 'இந்த தளம் ஒரு தனியார் டிஜிட்டல் உதவி மையமாகும். ஆவணங்கள் சேகரிப்பு மற்றும் படிவங்களை பூர்த்தி செய்ய உதவிகளை வழங்குகிறோம்.' : 'This website is a private digital assistance and application facilitation portal. We provide document collection, online form filing, and guidance services to assist citizens.'}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">{lang === 'ta' ? 'சேவைகள் ஏற்றப்படுகின்றன...' : 'Loading category services from database...'}</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Info className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">{lang === 'ta' ? 'பிரிவு கிடைக்கவில்லை' : 'Category Not Found'}</h3>
            <p className="text-slate-600 text-sm">{error}</p>
            <Link to="/services" className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700">
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'ta' ? 'அனைத்து பிரிவுகளையும் பார்க்க' : 'Browse All Categories'}</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Category Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold rounded-full">
                  <CategoryIcon className="w-4 h-4" />
                  <span>{lang === 'ta' ? 'சேவை பிரிவு' : 'Category Code'} #{categoryData.id || 1}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {categoryData.displayName || categoryData.name}
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {categoryData.displayDesc || categoryData.description}
                </p>
              </div>

              {/* Dynamic Service Count Badge */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-5 text-center flex-shrink-0 min-w-[160px]">
                <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                  {services.length}
                </div>
                <div className="text-xs uppercase font-bold tracking-wider text-slate-300 mt-1">
                  {lang === 'ta' ? 'செயலில் உள்ள சேவைகள்' : 'Active Services'}
                </div>
              </div>
            </div>

            {/* Filter & Search Bar Controls */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Search Within Category */}
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={lang === 'ta' ? 'இப்பிரிவில் சேவைகளைத் தேட...' : `Search in ${categoryData.displayName || categoryData.name}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <ArrowUpDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">{lang === 'ta' ? 'வரிசைப்படுத்து:' : 'Sort By:'}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none flex-1 sm:flex-none"
                >
                  <option value="default">{lang === 'ta' ? 'இயல்புநிலை' : 'Default Order'}</option>
                  <option value="name">{lang === 'ta' ? 'பெயர் (அகரவரிசை)' : 'Name (A-Z)'}</option>
                  <option value="fee_asc">{lang === 'ta' ? 'கட்டணம் (குறைவிலிருந்து அதிக)' : 'Fee (Low to High)'}</option>
                  <option value="fee_desc">{lang === 'ta' ? 'கட்டணம் (அதிகத்திலிருந்து குறைவு)' : 'Fee (High to Low)'}</option>
                </select>
              </div>

            </div>

            {/* Sub-Service Cards Grid */}
            {filteredServices.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200 space-y-3">
                <Search className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-lg font-bold text-slate-800">{lang === 'ta' ? 'சேவைகள் ஏதும் கிடைக்கவில்லை' : 'No Services Found'}</h4>
                <p className="text-sm text-slate-500">{lang === 'ta' ? 'உங்கள் தேடலுக்கு ஏற்ற சேவைகள் இல்லை.' : `No sub-service matches your search query "${searchTerm}".`}</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
                >
                  {lang === 'ta' ? 'தேடலை அழிக்கவும்' : 'Clear Search Filter'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((srv) => (
                  <div
                    key={srv.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                  >
                    <div className="p-6 space-y-4">
                      
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {categoryData.displayName || categoryData.name}
                        </span>
                        
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          srv.fee === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {srv.fee === 0 ? (lang === 'ta' ? 'இலவச சேவை' : 'FREE SERVICE') : `${lang === 'ta' ? 'கட்டணம்' : 'Fee'}: ₹${srv.fee}`}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1.5">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                          {srv.name}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {srv.description}
                        </p>
                      </div>

                      {/* Meta Pills */}
                      <div className="flex flex-wrap gap-2 pt-2 text-xs">
                        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          <span>SLA: {srv.processing_time || (lang === 'ta' ? '3-5 நாட்கள்' : '3-5 Days')}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{srv.required_docs_count || srv.documents_count || 1} {lang === 'ta' ? 'ஆவணங்கள்' : 'Proof Docs'}</span>
                        </div>
                      </div>

                    </div>

                    {/* Card Action Footer */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                      <Link
                        to={`/service/${srv.slug || srv.id}`}
                        className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        {lang === 'ta' ? 'விவரங்கள்' : 'View Details'}
                      </Link>

                      <Link
                        to={`/apply/${srv.slug || srv.id}`}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-all transform active:scale-95"
                      >
                        <span>{t.applyNow || (lang === 'ta' ? 'விண்ணப்பிக்க' : 'Apply Now')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </>
        )}

      </div>
    </div>
  );
}
