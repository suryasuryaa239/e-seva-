import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, MessageCircle, ShieldCheck, ArrowRight
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b192c] text-slate-300 pt-16 pb-8 text-xs border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 4-COLUMN FOOTER GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* COLUMN 1: E-SEVA BRAND IDENTITY */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md font-extrabold text-lg">
                E
              </div>
              <div>
                <span className="font-heading font-extrabold text-xl text-white tracking-tight block">
                  E-SEVA
                </span>
                <span className="text-[10px] text-orange-400 font-semibold uppercase tracking-wider block">
                  Digital Services Portal
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs font-normal leading-relaxed">
              A convenient platform for accessing digital service assistance from anywhere, anytime.
            </p>

            <div className="pt-1 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Connect With Us
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/50"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/50"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/50"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="WhatsApp"
                  className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/50"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* COLUMN 2: SERVICES */}
          <div className="space-y-4">
            <h4 className="font-heading font-extrabold text-orange-400 text-xs tracking-widest uppercase border-b border-slate-800 pb-2">
              Services
            </h4>
            <ul className="space-y-2 text-slate-400 font-normal">
              <li><Link to="/services/aadhaar" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">Aadhaar Services</Link></li>
              <li><Link to="/services/pan-services" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">PAN Services</Link></li>
              <li><Link to="/services/voter" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">Voter ID Services</Link></li>
              <li><Link to="/services/certificates" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">Certificate Services</Link></li>
              <li><Link to="/services/land" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">Land & Patta Services</Link></li>
              <li><Link to="/services/passport" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">Passport Services</Link></li>
              <li><Link to="/services/driving-licence" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">Driving Licence</Link></li>
              <li><Link to="/services/vehicle" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">Vehicle Services</Link></li>
              <li className="pt-1">
                <Link to="/services" className="text-orange-400 font-bold hover:text-orange-300 inline-flex items-center gap-1 transition-colors">
                  <span>View All Services</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: QUICK LINKS */}
          <div className="space-y-4">
            <h4 className="font-heading font-extrabold text-orange-400 text-xs tracking-widest uppercase border-b border-slate-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-slate-400 font-normal">
              <li><Link to="/" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">Home</Link></li>
              <li><Link to="/services" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">All Services</Link></li>
              <li><Link to="/about" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">Contact Us</Link></li>
              <li><Link to="/track" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">Check Application Status</Link></li>
              <li><Link to="/login" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">Register</Link></li>
              <li className="pt-1 border-t border-slate-800/60"><Link to="/admin/login" className="text-orange-400 font-bold hover:text-orange-300 hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">🛡️ Admin Portal Cockpit</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT INFO */}
          <div className="space-y-4">
            <h4 className="font-heading font-extrabold text-orange-400 text-xs tracking-widest uppercase border-b border-slate-800 pb-2">
              Contact Us
            </h4>
            
            <ul className="space-y-3 text-slate-400 font-normal leading-relaxed">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white font-mono font-medium">1800-425-3738</span>
                  <span className="text-[11px] text-slate-500">+91 44 2859 0000 (Toll-Free)</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white font-medium">support@eseva.gov.in</span>
                  <span className="text-[11px] text-slate-500">help@eseva.org</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>Digital Seva Bhavan, 123 Service Street, Digital City - 600001</span>
              </li>

              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white font-medium">Mon - Sat: 08:00 AM - 08:00 PM</span>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> 24/7 Portal Access
                  </span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & LEGAL LINKS BAR */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} E-Seva. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-slate-700">|</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <span className="text-slate-700">|</span>
            <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
