import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Fingerprint, CreditCard, Vote, FileText, MapPin, Globe,
  Car, Briefcase, Zap, Grid, ArrowRight, Search, FileSearch, FileCheck,
  ShieldCheck, CheckCircle2, Clock, Users, PhoneCall, HelpCircle, Headset, MousePointer,
  Mail, Send, AlertCircle, Sparkles, Building2, ExternalLink, ShieldAlert, Award, Lock, Landmark
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedService } from '../data/servicesCatalogData';

export default function Home() {
  const navigate = useNavigate();
  const toast = useToast();
  const addToast = toast?.addToast || (() => {});
  const { lang, t } = useLanguage();

  const [categories, setCategories] = useState([]);
  const [popularServices, setPopularServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [trackValidationError, setTrackValidationError] = useState('');

  // Contact form state
  const [contactForm, setContactForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  
  // Real stats from backend API
  const [stats, setStats] = useState({
    servicesAvailable: 35,
    applicationsProcessed: 1420,
    happyCustomers: 1380,
    supportAvailable: '24/7 SLA'
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((r) => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/services').then((r) => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/admin/dashboard').then((r) => r.ok ? r.json() : null).catch(() => null)
    ])
      .then(([catData, srvData, dashData]) => {
        setCategories(Array.isArray(catData) ? catData : []);
        
        if (srvData && Array.isArray(srvData)) {
          setPopularServices(srvData.slice(0, 8));
        }

        if (dashData && dashData.stats) {
          setStats({
            servicesAvailable: dashData.stats.totalServices || 35,
            applicationsProcessed: dashData.stats.totalApplications || 1420,
            happyCustomers: Math.max(1, (dashData.stats.totalApplications || 1420) - 15),
            supportAvailable: '24/7 SLA'
          });
        }
      })
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/services');
    }
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackingIdInput.trim()) {
      setTrackValidationError('Please enter a valid Application ID (e.g. ESV-2026-000001)');
      addToast('Please enter an Application ID to track status', 'error');
      return;
    }
    setTrackValidationError('');
    navigate(`/track?appId=${encodeURIComponent(trackingIdInput.trim())}`);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.fullName || !contactForm.mobile || !contactForm.message) {
      addToast('Please fill in your name, mobile number, and message.', 'error');
      return;
    }
    setIsSubmittingContact(true);
    setTimeout(() => {
      setIsSubmittingContact(false);
      addToast('Thank you! Your message has been received. Our support team will get back to you shortly.', 'success');
      setContactForm({ fullName: '', mobile: '', email: '', subject: '', message: '' });
    }, 600);
  };

  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'aadhaar':
      case 'aadhaar-services': return <Fingerprint className="w-6 h-6 text-blue-900" />;
      case 'pan':
      case 'pan-services': return <CreditCard className="w-6 h-6 text-blue-900" />;
      case 'voter':
      case 'voter-id-services': return <Vote className="w-6 h-6 text-blue-900" />;
      case 'certificates': return <FileText className="w-6 h-6 text-blue-900" />;
      case 'land':
      case 'land-patta-services': return <MapPin className="w-6 h-6 text-blue-900" />;
      case 'passport':
      case 'passport-services': return <Globe className="w-6 h-6 text-blue-900" />;
      case 'driving-licence':
      case 'vehicle':
      case 'driving-vehicle-services': return <Car className="w-6 h-6 text-blue-900" />;
      case 'business':
      case 'business-services': return <Briefcase className="w-6 h-6 text-blue-900" />;
      case 'utility':
      case 'utility-services': return <Zap className="w-6 h-6 text-blue-900" />;
      default: return <Grid className="w-6 h-6 text-blue-900" />;
    }
  };

  return (
    <div className="space-y-0 bg-slate-50 selection:bg-[#0b192c] selection:text-white">
      
      {/* 1. HERO / WELCOME SECTION (STEP 2 SPECIFICATION) */}
      <section className="bg-gradient-to-b from-slate-100/90 via-slate-50 to-white text-slate-900 py-16 sm:py-20 border-b border-slate-200/80 relative overflow-hidden">
        
        {/* Soft Background Pattern Graphic */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT CONTENT COLUMN */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              {/* SMALL UPPERCASE LABEL */}
              <div>
                <span className="inline-block text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-3.5 py-1 rounded-full">
                  {t.portalName}
                </span>
              </div>

              {/* HEADING */}
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight text-slate-900">
                {t.trustedPartner || t.heroTitle}
              </h1>

              {/* SUPPORTING TEXT */}
              <p className="text-slate-600 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
                {t.heroDesc || t.heroSubtitle}
              </p>

              {/* ACTION BUTTONS */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {/* Primary Button: Explore Services */}
                <Link
                  to="/services"
                  className="w-full sm:w-auto bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 group"
                >
                  <span>{t.exploreServices || (lang === 'ta' ? 'சேவைகளைப் பார்க்கவும்' : 'Explore Services')}</span>
                  <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Secondary Button: Track Application */}
                <Link
                  to="/track"
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm px-8 py-3.5 rounded-xl border border-slate-300 hover:border-slate-800 shadow-xs transition-all text-center"
                >
                  {t.trackAppHero || t.trackApp || (lang === 'ta' ? 'விண்ணப்பத்தை கண்காணிக்கவும்' : 'Track Application')}
                </Link>
              </div>

            </div>

            {/* RIGHT CONTENT COLUMN: DIGITAL SERVICES ILLUSTRATION */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-xl">
                <div className="relative group">
                  <img
                    src="/hero_devices.png"
                    alt="E-Seva Digital Portal Devices Mockup"
                    className="w-full h-auto object-contain rounded-2xl shadow-xl transition-all duration-300 group-hover:scale-[1.01]"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. E-SERVICES CATEGORIES GRID (STEP 3 SPECIFICATION) */}
      <section className="bg-white py-16 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* CENTERED SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-block text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-3.5 py-1 rounded-full">
            {t.servicesCategories || (lang === 'ta' ? 'சேவை வகைகள்' : 'Services Categories')}
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            {t.exploreDigitalServices || (lang === 'ta' ? 'எங்கள் டிஜிட்டல் சேவைகளைப் பாருங்கள்' : 'Explore Our Digital Services')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            {lang === 'ta' ? 'ஒரே இணையதளத்தில் அனைத்து அரசு டிஜிட்டல் சேவைகளையும் எளிதாகப் பெறுங்கள்.' : 'Access a wide range of digital services from one convenient portal.'}
          </p>
        </div>

        {/* 11 SERVICE CATEGORIES GRID */}
        {/* Desktop: 4 per row, Tablet: 2 or 3 per row, Mobile: 1 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[
            { name: 'Aadhaar Services', name_ta: 'ஆதார் சேவைகள்', slug: 'aadhaar', desc: 'Aadhaar enrollment, name, address & mobile updates', desc_ta: 'ஆதார் பதிவு, பெயர், முகவரி மற்றும் மொபைல் எண் புதுப்பித்தல்', icon: <Fingerprint className="w-6 h-6 text-orange-500" />, image: '/cat_aadhaar.png' },
            { name: 'PAN Services', name_ta: 'PAN சேவைகள்', slug: 'pan-services', desc: 'New PAN card application, correction & reprint', desc_ta: 'புதிய PAN கார்டு விண்ணப்பம், திருத்தம் மற்றும் மறுபதிப்பு', icon: <CreditCard className="w-6 h-6 text-orange-500" />, image: '/cat_pan.png' },
            { name: 'Voter ID Services', name_ta: 'வாக்காளர் அட்டை சேவைகள்', slug: 'voter', desc: 'New voter registration & address correction', desc_ta: 'புதிய வாக்காளர் பதிவு மற்றும் முகவரி திருத்தம்', icon: <Vote className="w-6 h-6 text-orange-500" />, image: '/cat_voter.png' },
            { name: 'Certificates', name_ta: 'அரசு சான்றிதழ்கள்', slug: 'certificates', desc: 'Income, community, native, birth & death certificates', desc_ta: 'வருமானம், சாதி, இருப்பிடம், பிறப்பு மற்றும் இறப்பு சான்றிதழ்கள்', icon: <FileText className="w-6 h-6 text-orange-500" />, image: '/cat_certificates.png' },
            { name: 'Land & Patta', name_ta: 'நிலம் & பட்டா சேவைகள்', slug: 'land', desc: 'Patta transfer, Chitta, FMB sketch & encumbrance', desc_ta: 'பட்டா மாற்றம், சிட்டா, FMB வரைபடம் மற்றும் வில்லங்கச் சான்றிதழ்', icon: <MapPin className="w-6 h-6 text-orange-500" />, image: '/cat_land.png' },
            { name: 'Passport Services', name_ta: 'பாஸ்போர்ட் சேவைகள்', slug: 'passport', desc: 'Fresh passport application, re-issue & Tatkaal', desc_ta: 'புதிய பாஸ்போர்ட் விண்ணப்பம், புதுப்பித்தல் மற்றும் தட்கல்', icon: <Globe className="w-6 h-6 text-orange-500" />, image: '/cat_passport.png' },
            { name: 'Driving Licence', name_ta: 'ஓட்டுநர் உரிமம்', slug: 'driving-licence', desc: 'Learner license, DL renewal & address change', desc_ta: 'பழகுநர் உரிமம், DL புதுப்பித்தல் மற்றும் முகவரி மாற்றம்', icon: <Car className="w-6 h-6 text-orange-500" />, image: '/cat_driving.png' },
            { name: 'Vehicle Services', name_ta: 'வாகன சேவைகள்', slug: 'vehicle', desc: 'RC transfer, NOC & fitness certificate', desc_ta: 'RC பெயர் மாற்றம், NOC மற்றும் தகுதிச் சான்றிதழ்', icon: <Car className="w-6 h-6 text-orange-500" />, image: '/cat_driving.png' },
            { name: 'Business Services', name_ta: 'வணிக சேவைகள்', slug: 'business', desc: 'MSME/Udyam registration, GST & FSSAI license', desc_ta: 'MSME/உத்யம் பதிவு, GST மற்றும் FSSAI உரிமம்', icon: <Briefcase className="w-6 h-6 text-orange-500" />, image: '/cat_business.png' },
            { name: 'Utility Services', name_ta: 'பயன்பாட்டுச் சேவைகள்', slug: 'utility', desc: 'Electricity connection, water tax & property tax', desc_ta: 'மின்சார இணைப்பு, குடிநீர் வரி மற்றும் சொத்து வரி', icon: <Zap className="w-6 h-6 text-orange-500" />, image: '/cat_utility.png' },
            { name: 'Other Digital Services', name_ta: 'பிற டிஜிட்டல் சேவைகள்', slug: 'other', desc: 'Ration card, pension schemes & digital services', desc_ta: 'ரேஷன் கார்டு, ஓய்வூதியத் திட்டங்கள் மற்றும் டிஜிட்டல் சேவைகள்', icon: <Grid className="w-6 h-6 text-orange-500" />, image: '/cat_ration.png' }
          ].map((cat, idx) => (
            <Link
              key={idx}
              to={cat.slug === 'aadhaar' ? '/services/aadhaar' : `/services/${cat.slug}`}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group overflow-hidden relative"
            >
              {/* Subtle top accent background glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-orange-500/10 transition-all"></div>

              {/* FLUSH 100% EDGE-TO-EDGE TOP IMAGE BANNER */}
              <div className="relative w-full h-44 bg-gradient-to-br from-slate-50 via-orange-50/20 to-white border-b border-slate-100 p-4 flex items-center justify-center overflow-hidden">
                <img
                  src={cat.image}
                  alt={lang === 'ta' ? cat.name_ta : cat.name}
                  className="w-full h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center">
                  {cat.icon}
                </div>
                <span className="absolute top-3 right-3 text-[10px] font-extrabold text-orange-700 bg-white/95 backdrop-blur-xs border border-orange-200 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  {lang === 'ta' ? 'ஈ-சேவை' : 'E-SERVICE'}
                </span>
              </div>

              {/* CARD CONTENT BODY WITH PADDING */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-orange-600 transition-colors">
                    {lang === 'ta' ? cat.name_ta : cat.name}
                  </h3>
                </div>

                {/* VIEW SERVICES ACTION & ARROW */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-slate-800 group-hover:text-orange-600 transition-colors">
                  <span>{lang === 'ta' ? 'சேவைகளைப் பார்க்க' : 'View Services'}</span>
                  <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CENTERED "VIEW ALL SERVICES" BUTTON */}
        <div className="pt-4 flex justify-center">
          <Link
            to="/services"
            className="bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group"
          >
            <span>{t.viewAllServices ? t.viewAllServices.replace(' →', '') : (lang === 'ta' ? 'அனைத்து சேவைகளையும் பார்க்க' : 'View All Services')}</span>
            <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        </div>
      </section>

      {/* 3. POPULAR SERVICES GRID (STEP 4 SPECIFICATION) */}
      <section className="bg-slate-50/80 py-16 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* CENTERED SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-block text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-3.5 py-1 rounded-full">
            {t.popularServicesTitle || (lang === 'ta' ? 'பிரபலமான சேவைகள்' : 'Popular Services')}
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            {t.mostRequestedServices || (lang === 'ta' ? 'அதிகம் கேட்கப்படும் சேவைகள்' : 'Most Requested Services')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            {lang === 'ta' ? 'எங்கள் பயனர்கள் அதிகம் பயன்படுத்தும் டிஜிட்டல் சேவைகளை எளிதாகப் பெறுங்கள்.' : 'Quickly access the digital services our customers use most often.'}
          </p>
        </div>

        {/* POPULAR SERVICE CARDS GRID */}
        {/* Desktop: 4 per row, Tablet: 2 per row, Mobile: 1 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(popularServices.length > 0 ? popularServices : [
            { id: 1, name: 'Aadhaar Enrollment', category_slug: 'aadhaar', slug: 'aadhaar-services', description: 'New Aadhaar enrollment services & appointment', fee: 0 },
            { id: 2, name: 'Aadhaar Address Update', category_slug: 'aadhaar', slug: 'aadhaar-address-update', description: 'Update Aadhaar address details online', fee: 50 },
            { id: 3, name: 'PAN Card Application', category_slug: 'pan', slug: 'pan-new-application', description: 'New PAN card application & correction', fee: 107 },
            { id: 4, name: 'Voter ID Registration', category_slug: 'voter', slug: 'voter-form-6', description: 'New voter ID application & EPIC download', fee: 0 },
            { id: 5, name: 'Income Certificate', category_slug: 'certificates', slug: 'income-certificate', description: 'Official income certificate application', fee: 60 },
            { id: 6, name: 'Patta Chitta Transfer', category_slug: 'land', slug: 'patta-transfer-application', description: 'Land Patta transfer & Chitta extract', fee: 100 },
            { id: 7, name: 'Passport Application', category_slug: 'passport', slug: 'fresh-passport-application', description: 'Fresh passport & Tatkaal application', fee: 1500 },
            { id: 8, name: 'Driving Licence Renewal', category_slug: 'driving-licence', slug: 'driving-licence-renewal', description: 'Driving licence renewal & address update', fee: 400 }
          ]).map(srv => getLocalizedService(srv, lang)).map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between space-y-4 group h-full"
            >
              <div className="space-y-3">
                {/* ICON & PRICE TAG */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getCategoryIcon(srv.category_slug)}
                  </div>
                  <span className="text-[11px] font-extrabold text-orange-700 bg-orange-50 border border-orange-200/80 px-2.5 py-0.5 rounded-full">
                    {srv.fee > 0 ? `₹${srv.fee}` : (lang === 'ta' ? 'இலவசம்' : 'FREE')}
                  </span>
                </div>

                {/* SERVICE NAME & ONE-LINE DESCRIPTION */}
                <div>
                  <h3 className="font-heading font-extrabold text-base text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {srv.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-normal line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>
              </div>

              {/* APPLY NOW BUTTON WITH ARROW */}
              <div className="pt-2">
                <Link
                  to={srv.slug === 'aadhaar' ? '/services/aadhaar' : `/service/${srv.slug}`}
                  className="w-full bg-[#0b192c] hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 group/btn"
                >
                  <span>{t.applyNow || (lang === 'ta' ? 'இப்போது விண்ணப்பிக்கவும்' : 'Apply Now')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CENTERED "VIEW ALL SERVICES" BUTTON */}
        <div className="pt-2 flex justify-center">
          <Link
            to="/services"
            className="text-xs sm:text-sm font-extrabold text-slate-800 hover:text-orange-600 flex items-center gap-1.5 group transition-colors"
          >
            <span>{t.viewAllServices || (lang === 'ta' ? 'அனைத்து சேவைகளையும் பார்க்க' : 'View All Services')}</span>
            <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION (STEP 5 SPECIFICATION) */}
      <section className="bg-white py-16 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* CENTERED SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-block text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-3.5 py-1 rounded-full">
            {t.howItWorksTitle || (lang === 'ta' ? 'எப்படி செயல்படுகிறது' : 'How It Works')}
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            {t.howItWorksTitle || (lang === 'ta' ? 'எப்படி செயல்படுகிறது' : 'How It Works')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            {lang === 'ta' ? 'சில எளிய படிகளில் உங்கள் டிஜிட்டல் சேவை விண்ணப்பத்தை நிறைவு செய்யுங்கள்.' : 'Complete your digital service application in just a few simple steps.'}
          </p>
        </div>

        {/* 4-STEP PROCESS GRID WITH CONNECTING LINE */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-14 left-24 right-24 h-0.5 bg-slate-200 z-0"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {[
              {
                step: '01',
                title: t.stepChooseService || (lang === 'ta' ? 'ஒரு சேவையைத் தேர்ந்தெடுக்கவும்' : 'Choose a Service'),
                desc: lang === 'ta' ? 'உங்களுக்குத் தேவையான சேவையைத் தேடித் தேர்ந்தெடுக்கவும்.' : 'Find and select the service you need.',
                icon: <Search className="w-6 h-6 text-orange-600" />
              },
              {
                step: '02',
                title: t.stepFillApp || (lang === 'ta' ? 'விண்ணப்பத்தைப் பூர்த்தி செய்யவும்' : 'Fill Application'),
                desc: lang === 'ta' ? 'தேவையான விவரங்களைப் பூர்த்தி செய்து ஆவணங்களைப் பதிவேற்றவும்.' : 'Fill in the required information and upload documents.',
                icon: <FileText className="w-6 h-6 text-orange-600" />
              },
              {
                step: '03',
                title: t.stepMakePayment || (lang === 'ta' ? 'கட்டணத்தைச் செலுத்தவும்' : 'Make Payment'),
                desc: lang === 'ta' ? 'உங்கள் விண்ணப்பத்தைச் சரிபார்த்து கட்டணத்தை நிறைவு செய்யவும்.' : 'Review your application and complete the payment.',
                icon: <CreditCard className="w-6 h-6 text-orange-600" />
              },
              {
                step: '04',
                title: t.stepTrackApp || (lang === 'ta' ? 'விண்ணப்பத்தை கண்காணிக்கவும்' : 'Track Application'),
                desc: lang === 'ta' ? 'விண்ணப்ப எண்ணைப் பெற்று அதன் நிலையை உடனுக்குடன் அறியவும்.' : 'Receive your application ID and track the progress.',
                icon: <FileCheck className="w-6 h-6 text-orange-600" />
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center space-y-4 group"
              >
                {/* ICON & NUMBER BADGE */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 bg-[#0b192c] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full border-2 border-white shadow-xs">
                    {item.step}
                  </span>
                </div>

                {/* TITLE & DESCRIPTION */}
                <div className="space-y-1.5">
                  <h3 className="font-heading font-extrabold text-base text-slate-900 group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* 5. CHECK APPLICATION STATUS BANNER */}
      <section className="bg-slate-50/80 py-16 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* CENTERED SECTION HEADER */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-block text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-3.5 py-1 rounded-full">
              {lang === 'ta' ? 'விண்ணப்ப நிலை' : 'APPLICATION STATUS'}
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              {lang === 'ta' ? 'உங்கள் விண்ணப்பத்தை கண்காணிக்கவும்' : 'Track Your Application'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              {lang === 'ta' ? 'உங்கள் விண்ணப்பத்தின் தற்போதைய நிலையை உடனடியாக அறிந்துகொள்ள உங்கள் விண்ணப்ப எண்ணை உள்ளிடவும்.' : 'Enter your application details to quickly check the current status of your application.'}
            </p>
          </div>

          {/* CENTERED TRACKING CARD */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6">
            <form onSubmit={handleTrackSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  {lang === 'ta' ? 'விண்ணப்ப எண்' : 'Application ID'} <span className="text-orange-500">*</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={lang === 'ta' ? 'விண்ணப்ப எண்ணை உள்ளிடவும் (எ.கா. ESV-2026-000001)' : 'Enter Application ID (e.g. ESV-2026-000001)'}
                      value={trackingIdInput}
                      onChange={(e) => {
                        setTrackingIdInput(e.target.value);
                        setTrackValidationError('');
                      }}
                      className={`w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl pl-11 pr-4 py-3.5 border ${
                        trackValidationError ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20' : 'border-slate-300 focus:border-slate-900 focus:bg-white'
                      } outline-none transition-all font-mono`}
                    />
                    <FileSearch className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all shrink-0 flex items-center justify-center gap-2 group"
                  >
                    <span>{lang === 'ta' ? 'நிலையை சரிபார்க்க' : 'Check Status'}</span>
                    <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* VALIDATION ERROR MESSAGE */}
              {trackValidationError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{trackValidationError}</span>
                </div>
              )}
            </form>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> {lang === 'ta' ? 'உடனடி நேரடி விண்ணப்ப கண்காணிப்பு' : 'Instant Real-Time Application Tracking'}
              </span>
              <Link to="/track" className="font-bold text-slate-800 hover:text-orange-600 transition-colors">
                {lang === 'ta' ? 'விரிவான கண்காணிப்பு பக்கம் →' : 'Advanced Tracking Page →'}
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 6. WHY CHOOSE US SECTION (STEP 6 SPECIFICATION) */}
      <section className="bg-white py-16 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* CENTERED SECTION HEADER */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-block text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-3.5 py-1 rounded-full">
              {t.whyChooseUsTitle || (lang === 'ta' ? 'ஏன் எங்களை தேர்ந்தெடுக்க வேண்டும்' : 'WHY CHOOSE US')}
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              {t.whyChooseUsTitle || (lang === 'ta' ? 'ஏன் எங்களைத் தேர்வு செய்ய வேண்டும்?' : 'Why Choose Our Services?')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              {lang === 'ta' ? 'டிஜிட்டல் சேவைகளைப் பெறுவதற்கான எளிய, வசதியான மற்றும் நம்பகமான வழி.' : 'A simple, convenient and reliable way to access digital services.'}
            </p>
          </div>

          {/* 4 FEATURE CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* CARD 01: EASY TO USE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 flex flex-col items-start space-y-4 group h-full">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MousePointer className="w-6 h-6 text-orange-600" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-heading font-extrabold text-base text-slate-900 group-hover:text-orange-600 transition-colors">
                  {t.easyProcess || (lang === 'ta' ? 'எளிதான பயன்பாடு' : 'Easy to Use')}
                </h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  {lang === 'ta' ? 'டிஜிட்டல் சேவைகளைப் பெறுவதற்கான எளிமையான மற்றும் பயனர் நட்பு முறை.' : 'Simple and user-friendly process for accessing digital services.'}
                </p>
              </div>
            </div>

            {/* CARD 02: SECURE & RELIABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 flex flex-col items-start space-y-4 group h-full">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-orange-600" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-heading font-extrabold text-base text-slate-900 group-hover:text-orange-600 transition-colors">
                  {t.secureService || (lang === 'ta' ? 'பாதுகாப்பான மற்றும் நம்பகமான' : 'Secure & Reliable')}
                </h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  {lang === 'ta' ? 'உங்கள் விண்ணப்பத் தகவல்கள் பாதுகாப்பாகக் கையாளப்படுகின்றன.' : 'Your application information is handled through a secure service process.'}
                </p>
              </div>
            </div>

            {/* CARD 03: QUICK PROCESSING */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 flex flex-col items-start space-y-4 group h-full">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-heading font-extrabold text-base text-slate-900 group-hover:text-orange-600 transition-colors">
                  {t.fastSupport || (lang === 'ta' ? 'வேகமான செயல்முறை' : 'Quick Processing')}
                </h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  {lang === 'ta' ? 'உங்கள் விண்ணப்பத்தை எளிதாகச் சமர்ப்பித்து அதன் நிலையைப் பின்பற்றுங்கள்.' : 'Submit your application conveniently and follow its progress.'}
                </p>
              </div>
            </div>

            {/* CARD 04: CUSTOMER SUPPORT */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 flex flex-col items-start space-y-4 group h-full">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Headset className="w-6 h-6 text-orange-600" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-heading font-extrabold text-base text-slate-900 group-hover:text-orange-600 transition-colors">
                  {t.transparentProcess || (lang === 'ta' ? 'வெளிப்படையான செயல்முறை' : 'Transparent Process')}
                </h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  {lang === 'ta' ? 'உங்கள் விண்ணப்பத்திற்கு உதவி தேவைப்படும்போது எப்போது வேண்டுமானாலும் உதவி பெறுங்கள்.' : 'Get assistance whenever you need help with your application.'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. APPLICATION CTA / TRACK BANNER (STEP 7 SPECIFICATION) */}
      <section className="bg-slate-50/80 py-16 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0b192c] rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl text-white relative overflow-hidden">
            
            {/* Subtle Background Accent Orbs */}
            <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-16 -top-16 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* LEFT CONTENT COLUMN */}
              <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
                <div>
                  <span className="inline-block text-xs font-extrabold text-orange-400 uppercase tracking-widest bg-orange-950/60 border border-orange-500/30 px-3.5 py-1 rounded-full">
                    {t.needHelpApp || (lang === 'ta' ? 'உங்கள் விண்ணப்பத்திற்கு உதவி தேவையா?' : 'NEED HELP WITH YOUR APPLICATION?')}
                  </span>
                </div>

                <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                  {lang === 'ta' ? 'எளிதாக விண்ணப்பிக்கவும். ' : 'Apply Easily. '}
                  <span className="text-orange-400">{lang === 'ta' ? 'எப்போதும் கண்காணிக்கவும்.' : 'Track Anytime.'}</span>
                </h2>

                <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
                  {t.trackAnytime || (lang === 'ta' ? 'உங்கள் விண்ணப்பத்தை ஆன்லைனில் சமர்ப்பித்து எந்த சாதனத்திலிருந்தும் விண்ணப்ப எண்ணைக் கொண்டு கண்காணிக்கவும்.' : 'Submit your application online and keep track of its progress using your Application ID from any device.')}
                </p>
              </div>

              {/* RIGHT BUTTONS COLUMN */}
              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-center lg:justify-end gap-3.5">
                <Link
                  to="/services"
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 group"
                >
                  <span>{t.exploreServices || (lang === 'ta' ? 'சேவைகளைக் கண்டறிய' : 'Explore Services')}</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/track"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl transition-all text-center flex items-center justify-center gap-2 group"
                >
                  <span>{t.trackAppHero || t.trackApp || (lang === 'ta' ? 'விண்ணப்ப நிலை அறிய' : 'Track Application')}</span>
                  <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 8. ABOUT / TRUST SECTION (STEP 8 SPECIFICATION) */}
      <section className="bg-white py-16 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT SIDE: VISUAL MOCKUP */}
          <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-lg">
              <div className="relative group">
                <img
                  src="/hero_devices.png"
                  alt="E-Seva Online Digital Service Portal Platform"
                  className="w-full h-auto object-contain rounded-2xl shadow-lg border border-slate-200/80 transition-all duration-300 group-hover:scale-[1.01]"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: CONTENT & 3 TRUST HIGHLIGHTS */}
          <div className="lg:col-span-6 space-y-6 text-left order-1 lg:order-2">
            
            {/* SMALL UPPERCASE LABEL */}
            <div>
              <span className="inline-block text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-3.5 py-1 rounded-full">
                {lang === 'ta' ? 'இ-சேவை பற்றி' : 'ABOUT E-SEVA'}
              </span>
            </div>

            {/* HEADING */}
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
              {lang === 'ta' ? 'அனைவருக்கும் டிஜிட்டல் சேவைகள் ' : 'Making Digital Services '}
              <span className="text-orange-500 font-extrabold">{lang === 'ta' ? 'எளிதானதாக மாற்றுகிறோம்' : 'Simple for Everyone'}</span>
            </h2>

            {/* SUPPORTING PARAGRAPH */}
            <p className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed">
              {t.simpleSecureConvenient || (lang === 'ta' ? 'இ-சேவை ஒரே இடத்திலிருந்து பல்வேறு டிஜிட்டல் அரசுச் சேவைகளைப் பெற வசதியான தளத்தை வழங்குகிறது.' : 'E-Seva provides a convenient platform to access and manage a wide range of digital service assistance from one place.')}
            </p>

            {/* 3 TRUST / HIGHLIGHT ITEMS */}
            <div className="space-y-4 pt-2">
              
              {/* ITEM 1 */}
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5 font-extrabold text-sm">
                  ✓
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-heading font-extrabold text-xs sm:text-sm text-slate-900">
                    {lang === 'ta' ? 'எளிதான சேவை அணுகல்' : 'Easy Service Access'}
                  </h4>
                  <p className="text-xs text-slate-500 font-normal">
                    {lang === 'ta' ? 'ஒரே தளத்திலிருந்து பல சேவைகளை அணுகலாம்.' : 'Access multiple services from one platform.'}
                  </p>
                </div>
              </div>

              {/* ITEM 2 */}
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5 font-extrabold text-sm">
                  ✓
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-heading font-extrabold text-xs sm:text-sm text-slate-900">
                    {lang === 'ta' ? 'எளிமையான விண்ணப்ப முறை' : 'Simple Application Process'}
                  </h4>
                  <p className="text-xs text-slate-500 font-normal">
                    {lang === 'ta' ? 'எளிதான வழிகாட்டுதல்களுடன் உங்கள் விண்ணப்பத்தைப் பூர்த்தி செய்யுங்கள்.' : 'Complete your application through an easy-to-follow process.'}
                  </p>
                </div>
              </div>

              {/* ITEM 3 */}
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5 font-extrabold text-sm">
                  ✓
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-heading font-extrabold text-xs sm:text-sm text-slate-900">
                    {lang === 'ta' ? 'விண்ணப்பக் கண்காணிப்பு' : 'Application Tracking'}
                  </h4>
                  <p className="text-xs text-slate-500 font-normal">
                    {lang === 'ta' ? 'விண்ணப்ப எண்ணைப் பயன்படுத்தி உங்கள் நிலையை அறியலாம்.' : 'Track your submitted application using your Application ID.'}
                  </p>
                </div>
              </div>

            </div>

            {/* ACTION BUTTON */}
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-center group"
              >
                <span>{t.learnMore || (lang === 'ta' ? 'மேலும் அறிய' : 'Learn More')}</span>
                <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

        </div>
        </div>
      </section>

      {/* 9. CONTACT / SUPPORT SECTION (STEP 9 SPECIFICATION) */}
      <section className="bg-slate-50/80 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* CENTERED SECTION HEADER */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-block text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-3.5 py-1 rounded-full">
              {t.contactUs || (lang === 'ta' ? 'தொடர்புகொள்ள' : 'CONTACT US')}
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              {t.needAssistance || (lang === 'ta' ? 'உதவி தேவையா?' : "We're Here to Help")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              {t.supportTeamHere || (lang === 'ta' ? 'எங்கள் ஆதரவுக் குழு உங்களுக்கு உதவ தயாராக உள்ளது.' : 'Have a question or need assistance? Get in touch with our support team.')}
            </p>
          </div>

          {/* MAIN 2-COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDE: 4 COMPACT CONTACT INFO CARDS */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* CARD 1: PHONE SUPPORT */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-orange-500/40 transition-all flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0 group-hover:scale-105 transition-transform">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-orange-600 transition-colors">
                    {t.phoneSupport || (lang === 'ta' ? 'தொலைபேசி ஆதரவு' : 'Phone Support')}
                  </h4>
                  <p className="text-xs text-slate-600 font-mono font-medium">1800-425-3738 / +91 44 2859 0000</p>
                  <p className="text-[11px] text-slate-400 font-normal">{lang === 'ta' ? 'கட்டணமில்லா உதவி எண் (திங்கள் - சனி)' : 'Toll-Free Helpline (Mon - Sat)'}</p>
                </div>
              </div>

              {/* CARD 2: EMAIL SUPPORT */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-orange-500/40 transition-all flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-orange-600 transition-colors">
                    {t.emailSupport || (lang === 'ta' ? 'மின்னஞ்சல் ஆதரவு' : 'Email Support')}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">support@eseva.gov.in / help@eseva.org</p>
                  <p className="text-[11px] text-slate-400 font-normal">{lang === 'ta' ? '24 மணிநேர பதில் சேவை' : '24-hour response SLA'}</p>
                </div>
              </div>

              {/* CARD 3: OFFICE LOCATION */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-orange-500/40 transition-all flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0 group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-orange-600 transition-colors">
                    {t.serviceLocation || (lang === 'ta' ? 'சேவை மையம்' : 'Service Location')}
                  </h4>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    Digital Seva Bhavan, 123 Service Street, Digital City - 600001
                  </p>
                </div>
              </div>

              {/* CARD 4: SUPPORT HOURS */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-orange-500/40 transition-all flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0 group-hover:scale-105 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-orange-600 transition-colors">
                    {t.supportHours || (lang === 'ta' ? 'ஆதரவு நேரம்' : 'Support Hours')}
                  </h4>
                  <p className="text-xs text-slate-600 font-normal">{lang === 'ta' ? 'திங்கள் - சனி: காலை 08:00 - மாலை 08:00' : 'Mon - Sat: 08:00 AM - 08:00 PM'}</p>
                  <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {lang === 'ta' ? '24/7 போர்ட்டல் சேவை வசதி' : '24/7 Portal Service Access'}
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE: MODERN CONTACT FORM CARD */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-heading font-extrabold text-xl text-slate-900">{t.sendUsMessage || (lang === 'ta' ? 'செய்தி அனுப்பவும்' : 'Send Us a Message')}</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-normal">{t.fillDetailsBelow || (lang === 'ta' ? 'கீழேயுள்ள விவரங்களைப் பூர்த்தி செய்து அனுப்பவும், எங்கள் குழு தொடர்பு கொள்ளும்.' : 'Fill in the details below and our team will get in touch with you.')}</p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* FULL NAME */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                      {lang === 'ta' ? 'முழு பெயர்' : 'Full Name'} <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={lang === 'ta' ? 'உங்கள் முழு பெயரை உள்ளிடவும்' : 'Enter your full name'}
                      value={contactForm.fullName}
                      onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl px-4 py-3 border border-slate-300 focus:border-slate-900 focus:bg-white outline-none transition-all"
                    />
                  </div>

                  {/* MOBILE NUMBER */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                      {lang === 'ta' ? 'மொபைல் எண்' : 'Mobile Number'} <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder={lang === 'ta' ? '10-இலக்க மொபைல் எண்ணை உள்ளிடவும்' : 'Enter 10-digit mobile number'}
                      value={contactForm.mobile}
                      onChange={(e) => setContactForm({ ...contactForm, mobile: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl px-4 py-3 border border-slate-300 focus:border-slate-900 focus:bg-white outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* EMAIL ADDRESS */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                      {lang === 'ta' ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl px-4 py-3 border border-slate-300 focus:border-slate-900 focus:bg-white outline-none transition-all"
                    />
                  </div>

                  {/* SUBJECT */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                      {lang === 'ta' ? 'தலைப்பு' : 'Subject'}
                    </label>
                    <input
                      type="text"
                      placeholder={lang === 'ta' ? 'எ.கா. ஆதார் புதுப்பித்தல் கேள்வி' : 'e.g. Aadhaar Update Query'}
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl px-4 py-3 border border-slate-300 focus:border-slate-900 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                {/* MESSAGE TEXTAREA */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                    {lang === 'ta' ? 'செய்தி' : 'Message'} <span className="text-orange-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder={lang === 'ta' ? 'உங்கள் செய்தி அல்லது சந்தேகங்களை இங்கே தட்டச்சு செய்யவும்...' : 'Type your message or inquiry details here...'}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl px-4 py-3 border border-slate-300 focus:border-slate-900 focus:bg-white outline-none transition-all resize-none"
                  ></textarea>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingContact}
                    className="w-full sm:w-auto bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    <span>{isSubmittingContact ? (lang === 'ta' ? 'அனுப்பப்படுகிறது...' : 'Sending Message...') : (t.sendEnquiry || (lang === 'ta' ? 'விசாரணையை அனுப்பவும்' : 'Send Message'))}</span>
                    <Send className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
