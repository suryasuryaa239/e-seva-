import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Landmark, Search, Menu, X, ArrowRight, User, LogOut,
  ShieldCheck, FileSearch, Fingerprint, CreditCard, Vote, FileText, MapPin, Globe,
  Car, Briefcase, Zap, Grid, ChevronDown, Bell, HelpCircle, FileCheck, Layers, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, admin, logoutUser } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const servicesMenuRef = useRef(null);
  const moreMenuRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setServicesMenuOpen(false);
    setMoreMenuOpen(false);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target)) {
        setServicesMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setMoreMenuOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/services?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  // 11 Service Categories List
  const serviceCategories = [
    { name: 'Aadhaar Services', slug: 'aadhaar', icon: Fingerprint, desc: 'Enrollment, Name, Address, Mobile & Photo Updates', badge: '15 Services' },
    { name: 'PAN Card Services', slug: 'pan', icon: CreditCard, desc: 'New PAN, Corrections, Reprint & Aadhaar Link', badge: 'Popular' },
    { name: 'Voter ID Services', slug: 'voter', icon: Vote, desc: 'New Voter Registration, Address Change & EPIC Download', badge: 'Free' },
    { name: 'Certificates', slug: 'certificates', icon: FileText, desc: 'Income, Community, Native, Birth & Death Certificates', badge: 'Essential' },
    { name: 'Land & Patta Services', slug: 'land', icon: MapPin, desc: 'Patta Transfer, Chitta Extraction, FMB Sketch & EC', badge: 'Land Records' },
    { name: 'Passport Services', slug: 'passport', icon: Globe, desc: 'Fresh Passport, Re-issue & Tatkaal Applications', badge: 'National' },
    { name: 'Driving Licence', slug: 'driving-licence', icon: Car, desc: 'Learner License, DL Renewal & Address Updates', badge: 'RTO' },
    { name: 'Vehicle Services', slug: 'vehicle', icon: Car, desc: 'RC Transfer, NOC, Fitness Certificate & Tax Payment', badge: 'RTO' },
    { name: 'Business Services', slug: 'business', icon: Briefcase, desc: 'MSME/Udyam, GST Registration & FSSAI Licenses', badge: 'Business' },
    { name: 'Utility Services', slug: 'utility', icon: Zap, desc: 'Electricity Connection, Water & Property Tax Payments', badge: 'Utility' },
    { name: 'Other Digital Services', slug: 'other', icon: Grid, desc: 'Ration Card, Pension, E-Shram & Employment Reg.', badge: 'Digital' }
  ];

  // More Navigation Links
  const moreLinks = [
    { name: 'My Applications', path: '/my-applications', icon: FileCheck, desc: 'Track and manage your submitted applications' },
    { name: 'Payment History', path: '/payments', icon: CreditCard, desc: 'View past fee payments and receipts' },
    { name: 'Careers & Portal Jobs', path: '/careers', icon: Briefcase, desc: 'Join the E-Seva digital operations team' },
    { name: 'Privacy Policy', path: '/privacy', icon: ShieldCheck, desc: 'Data privacy and security standards' },
    { name: 'Terms of Service', path: '/terms', icon: FileText, desc: 'Portal terms of use and compliance' },
    { name: 'Refund Policy', path: '/refund-policy', icon: HelpCircle, desc: 'Fee refund guidelines and processing' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm text-slate-800 selection:bg-slate-900 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* ========================================================================= */}
          {/* LEFT: E-SEVA LOGO, BRAND NAME & TAGLINE */}
          {/* ========================================================================= */}
          <Link to="/" className="flex items-center gap-3 group shrink-0 py-1">
            {/* E-Seva Emblem Icon */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md group-hover:bg-slate-800 transition-all border border-slate-800 relative">
              <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              {/* Subtle orange accent badge dot */}
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-orange-500 ring-2 ring-white"></span>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                  E-SEVA
                </span>
                <span className="bg-orange-50 text-orange-600 border border-orange-200 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md">
                  PORTAL
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-wide">
                Digital Services Made Easy
              </p>
            </div>
          </Link>

          {/* ========================================================================= */}
          {/* CENTER: DESKTOP NAVIGATION LINKS */}
          {/* ========================================================================= */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-bold text-slate-700">
            
            {/* 1. HOME */}
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-all ${
                isActive('/') 
                  ? 'text-slate-900 bg-slate-100 font-extrabold' 
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              HOME
            </Link>

            {/* 2. E-SERVICES ▼ DROPDOWN / MEGA-MENU */}
            <div className="relative" ref={servicesMenuRef}>
              <button
                onClick={() => {
                  setServicesMenuOpen(!servicesMenuOpen);
                  setMoreMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                  isActive('/services') || location.pathname.startsWith('/services') || servicesMenuOpen
                    ? 'text-slate-900 bg-slate-100 font-extrabold'
                    : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>E-SERVICES</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesMenuOpen ? 'rotate-180 text-orange-500' : 'text-slate-400'}`} />
              </button>

              {/* E-SERVICES MEGA-MENU */}
              {servicesMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[840px] bg-white border border-slate-200 rounded-2xl shadow-xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-heading font-extrabold text-sm text-slate-900">E-Service Categories Catalog</span>
                        <p className="text-[11px] text-slate-500 font-normal">Select a category to explore & apply for official digital services</p>
                      </div>
                    </div>
                    <Link
                      to="/services"
                      onClick={() => setServicesMenuOpen(false)}
                      className="text-xs font-bold text-slate-900 hover:text-orange-600 flex items-center gap-1 bg-slate-50 hover:bg-orange-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                    >
                      View All Directory →
                    </Link>
                  </div>

                  {/* 11 Dynamic Categories Grid */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {serviceCategories.map((cat, idx) => {
                      const Icon = cat.icon;
                      const catPath = cat.slug === 'aadhaar' 
                        ? '/services/aadhaar' 
                        : cat.slug === 'pan' 
                        ? '/services/pan-services' 
                        : `/services/${cat.slug}`;
                      
                      return (
                        <Link
                          key={idx}
                          to={catPath}
                          onClick={() => setServicesMenuOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 hover:border-slate-300 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 group-hover:border-orange-500 flex items-center justify-center text-slate-800 group-hover:text-orange-600 shrink-0 transition-colors shadow-xs">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                                {cat.name}
                              </span>
                              {cat.badge && (
                                <span className="text-[9px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.2 rounded shrink-0">
                                  {cat.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                              {cat.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. MORE ▼ DROPDOWN */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => {
                  setMoreMenuOpen(!moreMenuOpen);
                  setServicesMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                  moreMenuOpen ? 'text-slate-900 bg-slate-100 font-extrabold' : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>MORE</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreMenuOpen ? 'rotate-180 text-orange-500' : 'text-slate-400'}`} />
              </button>

              {/* MORE DROPDOWN MENU */}
              {moreMenuOpen && (
                <div className="absolute top-full left-0 mt-3 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1 mb-1">
                    Portal Resources & Info
                  </div>
                  <div className="space-y-1">
                    {moreLinks.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={idx}
                          to={item.path}
                          onClick={() => setMoreMenuOpen(false)}
                          className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-100/80 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 group-hover:border-slate-400 flex items-center justify-center text-slate-700 group-hover:text-slate-900 shrink-0 mt-0.5">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900 group-hover:text-slate-950">
                              {item.name}
                            </div>
                            <p className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 4. ABOUT */}
            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg transition-all ${
                isActive('/about') 
                  ? 'text-slate-900 bg-slate-100 font-extrabold' 
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              ABOUT
            </Link>

            {/* 5. CONTACT */}
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-lg transition-all ${
                isActive('/contact') 
                  ? 'text-slate-900 bg-slate-100 font-extrabold' 
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              CONTACT
            </Link>
          </nav>

          {/* ========================================================================= */}
          {/* RIGHT: BUTTONS & AUTH ACTIONS */}
          {/* ========================================================================= */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* CHECK APPLICATION STATUS - Outlined Button */}
            <Link
              to="/track"
              className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-lg border border-slate-300 hover:border-slate-800 text-slate-800 hover:bg-slate-50 transition-all ${
                isActive('/track') ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' : ''
              }`}
            >
              <FileSearch className="w-3.5 h-3.5 text-slate-600" />
              <span>CHECK APPLICATION STATUS</span>
            </Link>

            {/* SIGN IN & REGISTER / USER PROFILE LOGIC */}
            {admin ? (
              <Link
                to="/admin"
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-orange-400" /> Admin Cockpit
              </Link>
            ) : user ? (
              <div className="flex items-center gap-2">
                <NotificationBell />
                
                {/* User Profile Menu */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-700" />
                    <span>{user.name ? user.name.split(' ')[0] : 'User'}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium"
                      >
                        <User className="w-3.5 h-3.5 text-slate-600" /> My Dashboard
                      </Link>

                      <Link
                        to="/my-applications"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> My Applications
                      </Link>

                      <Link
                        to="/payments"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-orange-500" /> Payment History
                      </Link>

                      <Link
                        to="/notifications"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium"
                      >
                        <Bell className="w-3.5 h-3.5 text-blue-600" /> Notifications
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-600" /> Profile Settings
                      </Link>

                      <div className="pt-1 border-t border-slate-100 mt-1">
                        <button
                          onClick={() => {
                            logoutUser();
                            setUserDropdownOpen(false);
                            navigate('/');
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors font-bold"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* SIGN IN */}
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 hover:text-slate-950 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  SIGN IN
                </Link>

                {/* REGISTER - Primary Dark Blue Button */}
                <Link
                  to="/register"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5 border border-slate-800"
                >
                  REGISTER <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                </Link>
              </div>
            )}

          </div>

          {/* ========================================================================= */}
          {/* MOBILE HAMBURGER BUTTON */}
          {/* ========================================================================= */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 text-slate-800 hover:text-slate-950 border border-slate-300 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE RESPONSIVE NAVIGATION DRAWER */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-lg">
          
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search services (Aadhaar, PAN, Patta)..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs rounded-lg pl-9 pr-4 py-2.5 border border-slate-300 focus:border-slate-800 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>

          {/* Navigation Links List */}
          <div className="flex flex-col space-y-1 text-xs font-bold text-slate-800">
            
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg ${isActive('/') ? 'bg-slate-100 text-slate-950 font-extrabold' : 'hover:bg-slate-50'}`}
            >
              HOME
            </Link>

            {/* Accordion 1: E-SERVICES */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left font-bold text-slate-900"
              >
                <span>E-SERVICES CATEGORIES ({serviceCategories.length})</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${mobileServicesOpen ? 'rotate-180 text-orange-500' : ''}`} />
              </button>

              {mobileServicesOpen && (
                <div className="px-3 pb-3 space-y-1 border-t border-slate-200 pt-2 bg-white font-medium text-xs">
                  {serviceCategories.map((cat, i) => (
                    <Link
                      key={i}
                      to={cat.slug === 'aadhaar' ? '/services/aadhaar' : cat.slug === 'pan' ? '/services/pan-services' : `/services/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-2.5 py-2 rounded-md text-slate-700 hover:text-slate-950 hover:bg-slate-100 flex items-center justify-between"
                    >
                      <span>• {cat.name}</span>
                      {cat.badge && (
                        <span className="text-[9px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.2 rounded">
                          {cat.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                  <Link
                    to="/services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-2.5 py-2 rounded-md font-bold text-slate-900 bg-orange-50 text-orange-700 text-center mt-2 border border-orange-200"
                  >
                    View Full Directory →
                  </Link>
                </div>
              )}
            </div>

            {/* Accordion 2: MORE LINKS */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
              <button
                onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left font-bold text-slate-900"
              >
                <span>MORE RESOURCES ({moreLinks.length})</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${mobileMoreOpen ? 'rotate-180 text-orange-500' : ''}`} />
              </button>

              {mobileMoreOpen && (
                <div className="px-3 pb-3 space-y-1 border-t border-slate-200 pt-2 bg-white font-medium text-xs">
                  {moreLinks.map((item, i) => (
                    <Link
                      key={i}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-2.5 py-2 rounded-md text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                    >
                      • {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg ${isActive('/about') ? 'bg-slate-100 text-slate-950 font-extrabold' : 'hover:bg-slate-50'}`}
            >
              ABOUT
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg ${isActive('/contact') ? 'bg-slate-100 text-slate-950 font-extrabold' : 'hover:bg-slate-50'}`}
            >
              CONTACT
            </Link>

            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg bg-slate-100 text-slate-900 flex items-center gap-2 border border-slate-300 font-bold"
            >
              <FileSearch className="w-4 h-4 text-slate-700" /> CHECK APPLICATION STATUS
            </Link>
          </div>

          {/* Mobile Bottom Action Buttons */}
          <div className="pt-3 border-t border-slate-200">
            {user ? (
              <div className="flex items-center justify-between gap-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-slate-900 text-white font-bold text-xs px-4 py-3 rounded-xl w-full text-center"
                >
                  My Dashboard ({user.name})
                </Link>
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="bg-rose-100 text-rose-700 p-3 rounded-xl hover:bg-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-slate-100 text-slate-900 font-bold text-xs py-3 rounded-xl text-center border border-slate-300 hover:bg-slate-200"
                >
                  SIGN IN
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-slate-900 text-white font-bold text-xs py-3 rounded-xl text-center shadow hover:bg-slate-800 flex items-center justify-center gap-1"
                >
                  REGISTER <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                </Link>
              </div>
            )}
          </div>

        </div>
      )}
    </header>
  );
}

