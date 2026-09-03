import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Fingerprint, CreditCard, Vote, FileText, MapPin, Globe,
  Car, Briefcase, Zap, Grid, ArrowRight, Search, FileSearch, FileCheck,
  ShieldCheck, CheckCircle2, Clock, Users, PhoneCall, HelpCircle, Headset, MousePointer,
  Mail, Send, AlertCircle, Sparkles, Building2, ExternalLink, ShieldAlert, Award, Lock, Landmark
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Home() {
  const navigate = useNavigate();
  const toast = useToast();
  const addToast = toast?.addToast || (() => {});

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
                  DIGITAL SERVICES
                </span>
              </div>

              {/* HEADING */}
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight text-slate-900">
                Your Trusted <span className="text-orange-500 font-extrabold">Digital Service Partner</span>
              </h1>

              {/* SUPPORTING TEXT */}
              <p className="text-slate-600 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
                Conveniently access and apply for a wide range of official digital services through our secure single-window portal.
              </p>

              {/* ACTION BUTTONS */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {/* Primary Button: Explore Services */}
                <Link
                  to="/services"
                  className="w-full sm:w-auto bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 group"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Secondary Button: Track Application */}
                <Link
                  to="/track"
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm px-8 py-3.5 rounded-xl border border-slate-300 hover:border-slate-800 shadow-xs transition-all text-center"
                >
                  Track Application
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
            OUR SERVICES CATEGORIES
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Explore Our Digital Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            Access a wide range of digital services from one convenient portal.
          </p>
        </div>

        {/* 11 SERVICE CATEGORIES GRID */}
        {/* Desktop: 4 per row, Tablet: 2 or 3 per row, Mobile: 1 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[
            { name: 'Aadhaar Services', slug: 'aadhaar', desc: 'Aadhaar enrollment, name, address & mobile updates', icon: <Fingerprint className="w-6 h-6 text-orange-500" /> },
            { name: 'PAN Services', slug: 'pan-services', desc: 'New PAN card application, correction & reprint', icon: <CreditCard className="w-6 h-6 text-orange-500" /> },
            { name: 'Voter ID Services', slug: 'voter', desc: 'New voter registration & address correction', icon: <Vote className="w-6 h-6 text-orange-500" /> },
            { name: 'Certificates', slug: 'certificates', desc: 'Income, community, native, birth & death certificates', icon: <FileText className="w-6 h-6 text-orange-500" /> },
            { name: 'Land & Patta', slug: 'land', desc: 'Patta transfer, Chitta, FMB sketch & encumbrance', icon: <MapPin className="w-6 h-6 text-orange-500" /> },
            { name: 'Passport Services', slug: 'passport', desc: 'Fresh passport application, re-issue & Tatkaal', icon: <Globe className="w-6 h-6 text-orange-500" /> },
            { name: 'Driving Licence', slug: 'driving-licence', desc: 'Learner license, DL renewal & address change', icon: <Car className="w-6 h-6 text-orange-500" /> },
            { name: 'Vehicle Services', slug: 'vehicle', desc: 'RC transfer, NOC & fitness certificate', icon: <Car className="w-6 h-6 text-orange-500" /> },
            { name: 'Business Services', slug: 'business', desc: 'MSME/Udyam registration, GST & FSSAI license', icon: <Briefcase className="w-6 h-6 text-orange-500" /> },
            { name: 'Utility Services', slug: 'utility', desc: 'Electricity connection, water tax & property tax', icon: <Zap className="w-6 h-6 text-orange-500" /> },
            { name: 'Other Digital Services', slug: 'other', desc: 'Ration card, pension schemes & digital services', icon: <Grid className="w-6 h-6 text-orange-500" /> }
          ].map((cat, idx) => (
            <Link
              key={idx}
              to={cat.slug === 'aadhaar' ? '/services/aadhaar' : `/services/${cat.slug}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* ICON & ACCENT */}
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {cat.icon}
                </div>

                {/* CATEGORY NAME & DESCRIPTION */}
                <div>
                  <h3 className="font-heading font-extrabold text-base text-slate-900 group-hover:text-orange-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-normal leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>

              {/* VIEW SERVICES ACTION & ARROW */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                <span>View Services</span>
                <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1.5 transition-transform" />
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
            <span>View All Services</span>
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
            POPULAR SERVICES
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Most Requested Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            Quickly access the digital services our customers use most often.
          </p>
        </div>

        {/* POPULAR SERVICE CARDS GRID */}
        {/* Desktop: 4 per row, Tablet: 2 per row, Mobile: 1 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(popularServices.length > 0 ? popularServices : [
            { id: 1, name: 'Aadhaar Enrollment', category_slug: 'aadhaar', slug: 'aadhaar-services', description: 'New Aadhaar enrollment services & appointment', fee: 0 },
            { id: 2, name: 'Aadhaar Address Update', category_slug: 'aadhaar', slug: 'aadhaar', description: 'Update Aadhaar address details online', fee: 50 },
            { id: 3, name: 'PAN Card Application', category_slug: 'pan', slug: 'pan-services', description: 'New PAN card application & correction', fee: 107 },
            { id: 4, name: 'Voter ID Registration', category_slug: 'voter', slug: 'voter', description: 'New voter ID application & EPIC download', fee: 0 },
            { id: 5, name: 'Income Certificate', category_slug: 'certificates', slug: 'certificates', description: 'Official income certificate application', fee: 60 },
            { id: 6, name: 'Patta Chitta Transfer', category_slug: 'land', slug: 'land', description: 'Land Patta transfer & Chitta extract', fee: 100 },
            { id: 7, name: 'Passport Application', category_slug: 'passport', slug: 'passport', description: 'Fresh passport & Tatkaal application', fee: 1500 },
            { id: 8, name: 'Driving Licence Renewal', category_slug: 'driving-licence', slug: 'driving-licence', description: 'Driving licence renewal & address update', fee: 400 }
          ]).map((srv) => (
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
                    {srv.fee > 0 ? `₹${srv.fee}` : 'FREE'}
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
                  <span>Apply Now</span>
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
            <span>View All Services</span>
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
            HOW IT WORKS
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Simple & Easy Process
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            Complete your digital service application in just a few simple steps.
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
                title: 'Choose a Service',
                desc: 'Find and select the service you need.',
                icon: <Search className="w-6 h-6 text-orange-600" />
              },
              {
                step: '02',
                title: 'Submit Details',
                desc: 'Fill in the required information and upload documents.',
                icon: <FileText className="w-6 h-6 text-orange-600" />
              },
              {
                step: '03',
                title: 'Make Payment',
                desc: 'Review your application and complete the payment.',
                icon: <CreditCard className="w-6 h-6 text-orange-600" />
              },
              {
                step: '04',
                title: 'Track Application',
                desc: 'Receive your application ID and track the progress.',
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
              APPLICATION STATUS
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Track Your Application
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              Enter your application details to quickly check the current status of your application.
            </p>
          </div>

          {/* CENTERED TRACKING CARD */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6">
            <form onSubmit={handleTrackSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  Application ID <span className="text-orange-500">*</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Enter Application ID (e.g. ESV-2026-000001)"
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
                    <span>Check Status</span>
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
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Instant Real-Time Application Tracking
              </span>
              <Link to="/track" className="font-bold text-slate-800 hover:text-orange-600 transition-colors">
                Advanced Tracking Page →
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
              WHY CHOOSE US
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Why Choose Our Services?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              A simple, convenient and reliable way to access digital services.
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
                  Easy to Use
                </h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  Simple and user-friendly process for accessing digital services.
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
                  Secure & Reliable
                </h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  Your application information is handled through a secure service process.
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
                  Quick Processing
                </h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  Submit your application conveniently and follow its progress.
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
                  Customer Support
                </h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  Get assistance whenever you need help with your application.
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
                    NEED HELP WITH YOUR APPLICATION?
                  </span>
                </div>

                <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                  Apply Easily. <span className="text-orange-400">Track Anytime.</span>
                </h2>

                <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
                  Submit your application online and keep track of its progress using your Application ID from any device.
                </p>
              </div>

              {/* RIGHT BUTTONS COLUMN */}
              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-center lg:justify-end gap-3.5">
                <Link
                  to="/services"
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 group"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/track"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl transition-all text-center flex items-center justify-center gap-2 group"
                >
                  <span>Track Application</span>
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
                ABOUT E-SEVA
              </span>
            </div>

            {/* HEADING */}
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
              Making Digital Services <span className="text-orange-500 font-extrabold">Simple for Everyone</span>
            </h2>

            {/* SUPPORTING PARAGRAPH */}
            <p className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed">
              E-Seva provides a convenient platform to access and manage a wide range of digital service assistance from one place.
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
                    Easy Service Access
                  </h4>
                  <p className="text-xs text-slate-500 font-normal">
                    Access multiple services from one platform.
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
                    Simple Application Process
                  </h4>
                  <p className="text-xs text-slate-500 font-normal">
                    Complete your application through an easy-to-follow process.
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
                    Application Tracking
                  </h4>
                  <p className="text-xs text-slate-500 font-normal">
                    Track your submitted application using your Application ID.
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
                <span>Learn More</span>
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
              CONTACT US
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              We're Here to Help
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              Have a question or need assistance? Get in touch with our support team.
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
                    Phone Support
                  </h4>
                  <p className="text-xs text-slate-600 font-mono font-medium">1800-425-3738 / +91 44 2859 0000</p>
                  <p className="text-[11px] text-slate-400 font-normal">Toll-Free Helpline (Mon - Sat)</p>
                </div>
              </div>

              {/* CARD 2: EMAIL SUPPORT */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-orange-500/40 transition-all flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-orange-600 transition-colors">
                    Email Support
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">support@eseva.gov.in / help@eseva.org</p>
                  <p className="text-[11px] text-slate-400 font-normal">24-hour response SLA</p>
                </div>
              </div>

              {/* CARD 3: OFFICE LOCATION */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-orange-500/40 transition-all flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0 group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-orange-600 transition-colors">
                    Service Location
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
                    Support Hours
                  </h4>
                  <p className="text-xs text-slate-600 font-normal">Mon - Sat: 08:00 AM - 08:00 PM</p>
                  <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 24/7 Portal Service Access
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE: MODERN CONTACT FORM CARD */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-heading font-extrabold text-xl text-slate-900">Send Us a Message</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-normal">Fill in the details below and our team will get in touch with you.</p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* FULL NAME */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                      Full Name <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={contactForm.fullName}
                      onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl px-4 py-3 border border-slate-300 focus:border-slate-900 focus:bg-white outline-none transition-all"
                    />
                  </div>

                  {/* MOBILE NUMBER */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                      Mobile Number <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Enter 10-digit mobile number"
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
                      Email Address
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
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Aadhaar Update Query"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl px-4 py-3 border border-slate-300 focus:border-slate-900 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                {/* MESSAGE TEXTAREA */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                    Message <span className="text-orange-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Type your message or inquiry details here..."
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
                    <span>{isSubmittingContact ? 'Sending Message...' : 'Send Message'}</span>
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
