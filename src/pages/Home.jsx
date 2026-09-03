import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Fingerprint, CreditCard, Vote, FileText, MapPin, Globe,
  Car, Briefcase, Zap, Grid, ArrowRight, Search, FileSearch,
  ShieldCheck, CheckCircle2, Clock, Users, PhoneCall, HelpCircle,
  AlertCircle, Sparkles, Building2, ExternalLink, ShieldAlert, Award, Lock, Landmark
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Home() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [popularServices, setPopularServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [trackValidationError, setTrackValidationError] = useState('');
  
  // Real stats from backend API
  const [stats, setStats] = useState({
    servicesAvailable: 35,
    applicationsProcessed: 1420,
    happyCustomers: 1380,
    supportAvailable: '24/7 SLA'
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/services').then((r) => r.json()),
      fetch('/api/admin/dashboard').then((r) => r.ok ? r.json() : null)
    ])
      .then(([catData, srvData, dashData]) => {
        setCategories(catData || []);
        
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
      .catch((err) => console.error(err));
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
    <div className="space-y-12 pb-16 bg-slate-50 selection:bg-blue-600 selection:text-white">
      
      {/* 1. HERO / WELCOME SECTION (EXACT REFERENCE IMAGE MATCH) */}
      <section className="bg-gradient-to-b from-slate-100/80 via-slate-50 to-white text-slate-900 py-14 sm:py-20 border-b border-slate-200/80 relative overflow-hidden">
        
        {/* Soft Background City Silhouette Pattern Graphic */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* ========================================================================= */}
            {/* LEFT CONTENT COLUMN */}
            {/* ========================================================================= */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              {/* Heading: Welcome to E-Seva */}
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight text-slate-900">
                Welcome to <span className="text-orange-500 font-extrabold">E-Seva</span>
              </h1>

              {/* Subtitle text */}
              <p className="text-slate-600 text-lg sm:text-xl max-w-xl font-medium leading-relaxed">
                Your one-stop solution for all your online service needs
              </p>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {/* Explore Services Button */}
                <Link
                  to="/services"
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all text-center"
                >
                  Explore Services
                </Link>

                {/* Track Application Button */}
                <Link
                  to="/track"
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm px-8 py-3.5 rounded-lg border border-slate-300 hover:border-slate-800 shadow-xs transition-all text-center"
                >
                  Track Application
                </Link>
              </div>

            </div>

            {/* ========================================================================= */}
            {/* RIGHT CONTENT COLUMN: EXACT DEVICE MOCKUP IMAGE */}
            {/* ========================================================================= */}
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-12 pb-6">
        
        {/* CENTERED SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-block text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-3 py-1 rounded-full">
            OUR SERVICES
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Explore Our Digital Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            Choose from our wide range of digital services and assistance.
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

      </section>

      {/* 3. POPULAR SERVICES GRID (STEP 4 SPECIFICATION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-10 border-t border-slate-200/80">
        
        {/* CENTERED SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-block text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-3 py-1 rounded-full">
            POPULAR SERVICES
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Most Requested Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            Quickly access the services our customers use most often.
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

      </section>

      {/* 4. CHECK APPLICATION STATUS BANNER (STEP 5 SPECIFICATION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200/80">
        <div className="space-y-10">
          
          {/* CENTERED SECTION HEADER */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-block text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-3 py-1 rounded-full">
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

      {/* 5. VALUE PROPOSITIONS (EASY TO USE, SECURE & RELIABLE, 24/7 SUPPORT) */}
      <section className="bg-[#f8fafc] border-y border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-slate-900 shrink-0">
                <Grid className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-sm text-slate-900">Easy to Use</h4>
                <p className="text-xs text-slate-500 mt-0.5 font-normal">Simple and user-friendly interface for all your needs</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-slate-900 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-sm text-slate-900">Secure & Reliable</h4>
                <p className="text-xs text-slate-500 mt-0.5 font-normal">Your data is safe with our secure platform</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-slate-900 shrink-0">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-sm text-slate-900">24/7 Support</h4>
                <p className="text-xs text-slate-500 mt-0.5 font-normal">We're here to help you anytime, anywhere</p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
