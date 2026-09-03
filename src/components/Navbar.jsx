import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Landmark, Search, Menu, X, ArrowRight, User, LogOut,
  ShieldCheck, FileSearch, Fingerprint, CreditCard, Vote, FileText, MapPin, Globe,
  Car, Briefcase, Zap, Grid, ChevronDown, Bell, CheckCircle2, Clock, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, admin, logoutUser } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const megaMenuRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    setMegaMenuOpen(false);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        setMegaMenuOpen(false);
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

  // 11 Categories List
  const serviceCategories = [
    { name: 'Aadhaar Services', slug: 'aadhaar', icon: Fingerprint, desc: 'Enrollment, Name, Address, Mobile, Photo Updates', badge: '15 Services' },
    { name: 'PAN Card Services', slug: 'pan', icon: CreditCard, desc: 'New PAN, Correction, Reprint, Aadhaar Link', badge: 'Popular' },
    { name: 'Voter ID Services', slug: 'voter', icon: Vote, desc: 'New Voter Registration, Address Change, EPIC Download', badge: 'Free' },
    { name: 'Certificates', slug: 'certificates', icon: FileText, desc: 'Income, Community, Native, Birth, Death Certificates', badge: 'Essential' },
    { name: 'Land & Patta Services', slug: 'land', icon: MapPin, desc: 'Patta Transfer, Chitta Extraction, FMB Sketch, EC', badge: 'Land Records' },
    { name: 'Passport Services', slug: 'passport', icon: Globe, desc: 'Fresh Passport, Re-issue, Tatkaal Application', badge: 'National' },
    { name: 'Driving Licence', slug: 'driving-licence', icon: Car, desc: 'Learner License, DL Renewal, Address Change', badge: 'RTO' },
    { name: 'Vehicle Services', slug: 'vehicle', icon: Car, desc: 'RC Transfer, NOC, Fitness Certificate, Tax Payment', badge: 'RTO' },
    { name: 'Business Services', slug: 'business', icon: Briefcase, desc: 'MSME/Udyam, GST Registration, FSSAI License, Trade', badge: 'Business' },
    { name: 'Utility Services', slug: 'utility', icon: Zap, desc: 'Electricity Connection, Water Tax, Property Tax', badge: 'Utility' },
    { name: 'Other Digital Services', slug: 'other', icon: Grid, desc: 'Ration Card, Pension, E-Shram, Employment Registration', badge: 'Digital' }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm text-slate-800 selection:bg-blue-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* 1. BRANDING LOGO */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-900 flex items-center justify-center text-white shadow group-hover:bg-blue-800 transition-colors shrink-0">
              <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-heading font-extrabold text-base sm:text-2xl tracking-tight text-blue-950 flex items-center gap-1 sm:gap-1.5 truncate">
                E-CONNECT <span className="hidden xs:inline-block sm:inline-block text-emerald-700 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded bg-emerald-50 border border-emerald-200">E-SEVA</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium truncate max-w-[170px] xs:max-w-[220px] sm:max-w-none">Digital Service Assistance Desk</p>
            </div>
          </Link>

          {/* 2. DESKTOP SEARCH BAR */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative w-72">
            <input
              type="text"
              placeholder="Search services (Aadhaar, PAN, Patta)..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-300 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 focus:bg-white outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          </form>

          {/* 3. DESKTOP NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-700">
            <Link
              to="/"
              className={`transition-colors ${isActive('/') ? 'text-blue-900 font-extrabold' : 'hover:text-blue-900'}`}
            >
              Home
            </Link>

            {/* SERVICES MEGA-MENU TRIGGER */}
            <div className="relative" ref={megaMenuRef}>
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive('/services') || megaMenuOpen ? 'text-blue-900 font-extrabold' : 'hover:text-blue-900'
                }`}
              >
                Services / E-Services
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180 text-blue-900' : ''}`} />
              </button>

              {/* MEGA-MENU DROPDOWN */}
              {megaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[820px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Grid className="w-4 h-4 text-blue-900" />
                      <span className="font-heading font-extrabold text-sm text-slate-900">E-Service Categories Catalog (11)</span>
                    </div>
                    <Link
                      to="/services"
                      onClick={() => setMegaMenuOpen(false)}
                      className="text-[11px] font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1"
                    >
                      View All Services Directory →
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {serviceCategories.map((cat, idx) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={idx}
                          to={cat.slug === 'aadhaar' ? '/services/aadhaar' : cat.slug === 'pan' ? '/services/pan-services' : `/services/${cat.slug}`}
                          onClick={() => setMegaMenuOpen(false)}
                          className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 transition-all group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 group-hover:border-blue-600 flex items-center justify-center text-blue-900 shrink-0 transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-slate-900 group-hover:text-blue-900 transition-colors">
                                {cat.name}
                              </span>
                              {cat.badge && (
                                <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
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

            <Link
              to="/about"
              className={`transition-colors ${isActive('/about') ? 'text-blue-900 font-extrabold' : 'hover:text-blue-900'}`}
            >
              About
            </Link>

            <Link
              to="/contact"
              className={`transition-colors ${isActive('/contact') ? 'text-blue-900 font-extrabold' : 'hover:text-blue-900'}`}
            >
              Contact
            </Link>

            <Link
              to="/track"
              className={`flex items-center gap-1.5 bg-blue-900 hover:bg-blue-950 text-white px-3.5 py-2 rounded-xl transition-all shadow-sm ${
                isActive('/track') ? 'ring-2 ring-blue-400' : ''
              }`}
            >
              <FileSearch className="w-3.5 h-3.5 text-blue-200" />
              Check Application Status
            </Link>
          </nav>

          {/* 4. USER / ADMIN ACTIONS */}
          <div className="hidden md:flex items-center gap-3">
            {admin ? (
              <Link
                to="/admin"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" /> Admin Cockpit
              </Link>
            ) : user ? (
              <div className="flex items-center gap-2">
                <NotificationBell />
                
                {/* USER PROFILE DROPDOWN */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-blue-900" />
                    <span>{user.name ? user.name.split(' ')[0] : 'User'}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 text-xs">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                      >
                        <User className="w-3.5 h-3.5 text-blue-900" /> My Dashboard
                      </Link>

                      <Link
                        to="/my-applications"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                      >
                        <FileSearch className="w-3.5 h-3.5 text-emerald-700" /> My Applications
                      </Link>

                      <Link
                        to="/payments"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-amber-600" /> Payment History
                      </Link>

                      <Link
                        to="/notifications"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                      >
                        <Bell className="w-3.5 h-3.5 text-purple-600" /> Notifications
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-900"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Profile & Settings
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
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 hover:text-blue-900 px-3 py-2"
                >
                  Sign In / Register
                </Link>
                <Link
                  to="/services"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5"
                >
                  Apply Online <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* 5. MOBILE HAMBURGER BUTTON */}
          <div className="flex items-center md:hidden gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-blue-900" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* 6. MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search services (Aadhaar, PAN, Patta)..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl pl-9 pr-4 py-3 border border-slate-300 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </form>

          <div className="flex flex-col space-y-1 text-sm font-bold text-slate-700 pt-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Home
            </Link>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <button
                onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-100"
              >
                <span>Services Categories (11)</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${mobileCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileCategoryOpen && (
                <div className="px-3 pb-3 space-y-1 text-xs border-t border-slate-200 pt-2 bg-white font-medium">
                  {serviceCategories.map((cat, i) => (
                    <Link
                      key={i}
                      to={cat.slug === 'aadhaar' ? '/services/aadhaar' : `/services/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-2.5 py-1.5 rounded text-slate-700 hover:text-blue-900 hover:bg-slate-100"
                    >
                      • {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              All E-Services Directory
            </Link>

            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 text-blue-900 flex items-center gap-2"
            >
              <FileSearch className="w-4 h-4" /> Check Application Status
            </Link>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              About
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Contact
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-blue-900 text-white font-bold text-xs px-4 py-3 rounded-xl w-full text-center"
                >
                  My Dashboard ({user.name})
                </Link>
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="ml-2 bg-rose-100 text-rose-700 p-3 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-slate-100 text-slate-800 font-bold text-xs py-3 rounded-xl text-center border border-slate-300"
                >
                  Sign In / Register
                </Link>
                <Link
                  to="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-emerald-600 text-white font-bold text-xs py-3 rounded-xl text-center shadow"
                >
                  Apply Online
                </Link>
              </div>
            )}
          </div>

        </div>
      )}
    </header>
  );
}
