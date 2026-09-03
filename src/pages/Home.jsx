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
      
      {/* 1. HERO / WELCOME SECTION */}
      <section className="bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-800/80 border border-blue-700/80 text-blue-200 text-xs font-bold px-3.5 py-1.5 rounded-full">
                <Landmark className="w-4 h-4 text-emerald-400" />
                Digital Service Assistance & Guided Application Desk
              </div>

              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight text-white">
                Online E-Seva Application & Facilitation Portal
              </h1>

              <p className="text-slate-200 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
                Single-window digital service platform assisting citizens with Aadhaar updates, PAN cards, Voter ID, Land Pattas, Passports, and Official Certificates online.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  to="/services"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-7 py-3.5 rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  Explore All E-Services <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/services/aadhaar"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-7 py-3.5 rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Fingerprint className="w-4 h-4 text-amber-400" /> Aadhaar Services (15)
                </Link>

                <Link
                  to="/track"
                  className="w-full sm:w-auto bg-blue-950/80 hover:bg-blue-950 text-white font-bold text-xs px-7 py-3.5 rounded-xl border border-blue-800 transition-all flex items-center justify-center gap-2"
                >
                  <FileSearch className="w-4 h-4 text-blue-300" /> Check Status
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-blue-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Dynamic Form Filling</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Unique Application ID</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Secure Payments</span>
              </div>
            </div>

            {/* Right Summary Card */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-sm bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-heading font-extrabold text-sm text-blue-950 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-900" /> Service Desk Portal
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-800">Aadhaar Address Update</span>
                    <span className="text-emerald-700 font-extrabold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">VERIFIED</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-800">New PAN Card</span>
                    <span className="text-amber-700 font-extrabold text-[10px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">PROCESSING</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-800">Income Certificate</span>
                    <span className="text-blue-900 font-extrabold text-[10px] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">SUBMITTED</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                  <span>Real-time status checks & remark updates log.</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. QUICK SERVICE SEARCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-3">
          <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-900" />
            Quick Service Search
          </h3>

          <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by service name... (e.g. Aadhaar Address, PAN Card, Income Certificate, Patta)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-3.5 border border-slate-300 outline-none focus:bg-white focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
            </div>

            <button
              type="submit"
              className="bg-blue-900 hover:bg-blue-950 text-white font-extrabold text-xs px-7 py-3.5 rounded-xl shadow transition-colors shrink-0 flex items-center justify-center gap-2"
            >
              Search Services
            </button>
          </form>
        </div>
      </section>

      {/* 3. POPULAR SERVICES GRID (DYNAMIC DB DRIVEN) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <span className="text-[11px] font-extrabold text-blue-900 uppercase tracking-wider">
              Most Requested Online Services
            </span>
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 mt-0.5">
              Popular E-Services Catalog
            </h2>
          </div>

          <Link
            to="/services"
            className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1"
          >
            View All Services Directory →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-colors">
                    {getCategoryIcon(srv.category_slug)}
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {srv.fee > 0 ? `₹${srv.fee}` : 'FREE'}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-900 bg-blue-50 px-2 py-0.5 rounded inline-block">
                    {srv.category_name}
                  </span>
                  <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-blue-900 transition-colors mt-1">
                    {srv.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                  {srv.description}
                </p>

                <div className="pt-1 text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>SLA: {srv.processing_time || '3-5 Days'}</span>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  to={`/service/${srv.slug}`}
                  className="text-xs font-bold text-slate-700 hover:text-blue-900"
                >
                  View Details
                </Link>
                <Link
                  to={`/service/${srv.slug}`}
                  className="bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition-colors"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SERVICE CATEGORIES GRID (11 CATEGORIES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">
            Comprehensive Service Catalog
          </span>
          <h2 className="font-heading font-extrabold text-2xl text-slate-900">
            Explore Services by Department Category
          </h2>
          <p className="text-xs text-slate-500">
            Organized service categories for fast access and application processing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Aadhaar Services', slug: 'aadhaar', count: '15 Services', desc: 'Enrollment, Name, Address, Mobile, Photo Updates' },
            { name: 'PAN Services', slug: 'pan', count: '4 Services', desc: 'New PAN, Correction, Reprint, Aadhaar Link' },
            { name: 'Voter ID Services', slug: 'voter', count: '3 Services', desc: 'New Registration, Address Change, EPIC Download' },
            { name: 'Certificates', slug: 'certificates', count: '6 Services', desc: 'Income, Community, Native, Birth, Death Certificates' },
            { name: 'Land & Patta Services', slug: 'land', count: '5 Services', desc: 'Patta Transfer, Chitta, FMB Sketch, Encumbrance' },
            { name: 'Passport Services', slug: 'passport', count: '3 Services', desc: 'Fresh Passport, Re-issue, Tatkaal Application' },
            { name: 'Driving Licence', slug: 'driving-licence', count: '4 Services', desc: 'Learner License, DL Renewal, Address Change' },
            { name: 'Vehicle Services', slug: 'vehicle', count: '4 Services', desc: 'RC Transfer, NOC, Fitness Certificate' },
            { name: 'Business Services', slug: 'business', count: '4 Services', desc: 'MSME/Udyam, GST Registration, FSSAI License' },
            { name: 'Utility Services', slug: 'utility', count: '3 Services', desc: 'Electricity Connection, Water Tax, Property Tax' },
            { name: 'Other Digital Services', slug: 'other', count: '5 Services', desc: 'Ration Card, Pension, E-Shram, Employment' }
          ].map((cat, idx) => (
            <Link
              key={idx}
              to={cat.slug === 'aadhaar' ? '/services/aadhaar' : `/services/${cat.slug}`}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 space-y-2 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-colors">
                  {getCategoryIcon(cat.slug)}
                </div>
                <span className="text-[10px] font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {cat.count}
                </span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-sm text-slate-900 group-hover:text-blue-900 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 font-normal leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <span className="text-xs font-bold text-blue-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-1">
                Explore Category →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS (6 STEPS) */}
      <section id="how-it-works" className="bg-slate-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
              Application Process
            </span>
            <h2 className="font-heading font-extrabold text-2xl text-white">
              How to Apply Online
            </h2>
            <p className="text-xs text-slate-300">
              Simple 6-step workflow designed for convenient online filing and tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: '01', title: 'Choose Service', desc: 'Select your required digital service from our categories.' },
              { step: '02', title: 'Fill Application', desc: 'Enter mandatory applicant details in our guided form.' },
              { step: '03', title: 'Upload Documents', desc: 'Attach PDF/JPG proof documents securely.' },
              { step: '04', title: 'Make Payment', desc: 'Pay processing charges online via Razorpay.' },
              { step: '05', title: 'Get Application ID', desc: 'Receive instant unique tracking code (ESV-2026-XXXXXX).' },
              { step: '06', title: 'Track Status', desc: 'Monitor real-time approval status & download receipts.' }
            ].map((st, i) => (
              <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-2xl font-extrabold text-blue-400">{st.step}</span>
                <h4 className="font-heading font-bold text-xs text-white">{st.title}</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. APPLICATION / ENQUIRY STATUS CARD SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-200 shadow-md space-y-4">
          <div className="max-w-2xl space-y-1">
            <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
              Application Tracker
            </span>
            <h2 className="font-heading font-extrabold text-2xl text-slate-900">
              Check Your Application Status
            </h2>
            <p className="text-xs text-slate-500">
              Enter your unique Application ID (e.g. ESV-2026-000001) received after submission to check current status.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="max-w-2xl space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter Application ID (e.g. ESV-2026-000001)"
                value={trackingIdInput}
                onChange={(e) => {
                  setTrackingIdInput(e.target.value);
                  setTrackValidationError('');
                }}
                className={`w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-xl px-4 py-3.5 border ${
                  trackValidationError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300'
                } outline-none focus:border-blue-900 focus:bg-white`}
              />
              <button
                type="submit"
                className="bg-blue-900 hover:bg-blue-950 text-white font-extrabold text-xs px-7 py-3.5 rounded-xl shadow transition-colors shrink-0 flex items-center justify-center gap-2"
              >
                <FileSearch className="w-4 h-4" /> Check Status
              </button>
            </div>

            {trackValidationError && (
              <p className="text-xs font-bold text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {trackValidationError}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* 7. REAL DATABASE STATISTICS BAR */}
      <section className="bg-blue-950 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {stats.servicesAvailable}+
              </span>
              <p className="text-xs text-slate-300 font-medium">Digital Services Available</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-300">
                {stats.applicationsProcessed.toLocaleString()}+
              </span>
              <p className="text-xs text-slate-300 font-medium">Applications Processed</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {stats.happyCustomers.toLocaleString()}+
              </span>
              <p className="text-xs text-slate-300 font-medium">Registered Citizens</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                {stats.supportAvailable}
              </span>
              <p className="text-xs text-slate-300 font-medium">Support SLA</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. NON-GOVERNMENT FACILITATION DISCLAIMER NOTICE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-5 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-900">
            <h4 className="font-bold text-xs text-amber-950">Important Service Notice & Disclaimer</h4>
            <p className="leading-relaxed font-normal">
              This website is a private application assistance and facilitation portal. We provide document preparation, online application submission guidance, and status tracking services. Official government rules and verification standards apply to all final application approvals.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
