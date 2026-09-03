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

      {/* 3. POPULAR SERVICES GRID (EXACT REFERENCE MATCHER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
              Popular Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              Most requested online application services
            </p>
          </div>

          <Link
            to="/services"
            className="text-xs font-bold text-slate-800 hover:text-orange-600 flex items-center gap-1 shrink-0 transition-colors"
          >
            View All Services <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { title: 'Aadhaar Enrollment', desc: 'New Aadhaar enrollment services', slug: 'aadhaar-services', icon: <Fingerprint className="w-6 h-6 text-orange-500" /> },
            { title: 'Aadhaar Update', desc: 'Update Aadhaar details online', slug: 'aadhaar', icon: <Fingerprint className="w-6 h-6 text-orange-500" /> },
            { title: 'PAN Card', desc: 'New PAN card application', slug: 'pan-services', icon: <CreditCard className="w-6 h-6 text-blue-600" /> },
            { title: 'Voter ID', desc: 'New voter ID application', slug: 'voter', icon: <Vote className="w-6 h-6 text-amber-700" /> },
            { title: 'Passport', desc: 'Passport application services', slug: 'passport', icon: <Globe className="w-6 h-6 text-blue-900" /> },
            { title: 'Driving Licence', desc: 'Driving licence application', slug: 'driving-licence', icon: <Car className="w-6 h-6 text-slate-800" /> }
          ].map((srv, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between items-center text-center space-y-4 group"
            >
              <div className="space-y-2 flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {srv.icon}
                </div>

                <h3 className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-slate-800 transition-colors">
                  {srv.title}
                </h3>

                <p className="text-xs text-slate-500 font-normal">
                  {srv.desc}
                </p>
              </div>

              <Link
                to={srv.slug === 'aadhaar' ? '/services/aadhaar' : `/services/${srv.slug}`}
                className="w-auto bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs px-6 py-2 rounded-lg border border-slate-300 hover:border-slate-800 transition-colors shadow-2xs"
              >
                Apply Now
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CHECK APPLICATION STATUS BANNER (EXACT REFERENCE MATCHER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-blue-50/70 rounded-2xl border border-blue-100/90 p-8 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Search Input */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
                  Check Application Status
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
                  Enter your application ID to track the status of your application
                </p>
              </div>

              <form onSubmit={handleTrackSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter Application ID"
                    value={trackingIdInput}
                    onChange={(e) => {
                      setTrackingIdInput(e.target.value);
                      setTrackValidationError('');
                    }}
                    className={`w-full bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl px-4 py-3.5 border ${
                      trackValidationError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300'
                    } outline-none focus:border-slate-800 shadow-xs`}
                  />
                  <button
                    type="submit"
                    className="bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded-xl shadow-md transition-colors shrink-0"
                  >
                    Check Status
                  </button>
                </div>

                {trackValidationError && (
                  <p className="text-xs font-bold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {trackValidationError}
                  </p>
                )}
              </form>
            </div>

            {/* Right Magnifying Glass / Application Status Clipboard Illustration */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-48 sm:w-56 bg-white p-5 rounded-2xl shadow-md border border-blue-100 text-center space-y-3">
                <div className="bg-[#0b192c] text-white py-1.5 px-3 rounded-lg text-[11px] font-extrabold tracking-wider uppercase inline-block">
                  APPLICATION STATUS
                </div>
                <div className="space-y-2 text-left text-[10px] text-slate-600">
                  <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-2 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-2 bg-slate-200 rounded w-2/3"></div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 shadow-xs">
                    <Search className="w-6 h-6" />
                  </div>
                </div>
              </div>
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
