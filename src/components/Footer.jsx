import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, ShieldCheck, FileSearch, PhoneCall, Mail, Clock, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-14 pb-8 text-xs selection:bg-blue-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* COLUMN 1: BRANDING & ABOUT */}
          <div className="lg:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                E-CONNECT <span className="text-emerald-400 text-xs font-bold uppercase">E-SEVA</span>
              </span>
            </Link>
            
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-normal">
              Digital service application assistance portal guiding citizens with Aadhaar updates, PAN cards, Land Pattas, Passports, and official certificates.
            </p>

            <div className="space-y-1 text-xs text-slate-300">
              <p className="flex items-center gap-2">📞 <span>Toll-Free Helpline: <strong>1800-425-3738</strong></span></p>
              <p className="flex items-center gap-2">📧 <span>Email: <strong>support@eseva.gov.in</strong></span></p>
              <p className="flex items-center gap-2">🕒 <span>Hours: Mon - Sat: 08:00 AM - 08:00 PM</span></p>
            </div>
          </div>

          {/* COLUMN 2: POPULAR E-SERVICES */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Popular E-Services</h4>
            <ul className="space-y-1.5">
              <li><Link to="/services/aadhaar" className="hover:text-emerald-400 transition-colors">Aadhaar Address Update (15)</Link></li>
              <li><Link to="/services/pan-services" className="hover:text-emerald-400 transition-colors font-semibold text-emerald-400">New PAN Card Application</Link></li>
              <li><Link to="/services/certificates" className="hover:text-emerald-400 transition-colors">Income Certificate</Link></li>
              <li><Link to="/services/land" className="hover:text-emerald-400 transition-colors">Patta Chitta Transfer</Link></li>
              <li><Link to="/services/voter" className="hover:text-emerald-400 transition-colors">Voter ID Correction</Link></li>
              <li><Link to="/services/passport" className="hover:text-emerald-400 transition-colors">Passport Re-issue</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: SERVICE CATEGORIES */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Service Categories</h4>
            <ul className="space-y-1.5">
              <li><Link to="/services/aadhaar" className="hover:text-emerald-400 transition-colors">Aadhaar Services</Link></li>
              <li><Link to="/services/pan-services" className="hover:text-emerald-400 transition-colors font-semibold text-emerald-400">PAN Card Services</Link></li>
              <li><Link to="/services/certificates" className="hover:text-emerald-400 transition-colors">Revenue Certificates</Link></li>
              <li><Link to="/services/land" className="hover:text-emerald-400 transition-colors">Land & Patta Records</Link></li>
              <li><Link to="/services/driving-licence" className="hover:text-emerald-400 transition-colors">RTO & Driving License</Link></li>
              <li><Link to="/services/business" className="hover:text-emerald-400 transition-colors">MSME & GST Business</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: QUICK & LEGAL LINKS */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Quick & Legal</h4>
            <ul className="space-y-1.5">
              <li><Link to="/track" className="hover:text-emerald-400 transition-colors font-bold text-blue-300">Check Application Status</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link></li>
              <li><Link to="/careers" className="hover:text-emerald-400 transition-colors">Careers</Link></li>
              <li><Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="hover:text-emerald-400 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* DISCLAIMER & COPYRIGHT */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-normal">
            <p className="font-bold text-slate-300 mb-0.5">Important Facilitation Notice:</p>
            This portal is a private application assistance platform designed to guide citizens with document preparation, form filing, and application tracking. Official government departmental rules and verification standards strictly apply to all final application submissions.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 pt-1">
            <p>© {new Date().getFullYear()} E-Connect E-Seva Facilitation Portal. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <Link to="/privacy" className="hover:text-slate-300">Privacy</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-slate-300">Terms</Link>
              <span>•</span>
              <Link to="/refund-policy" className="hover:text-slate-300">Refunds</Link>
              <span>•</span>
              <Link to="/track" className="hover:text-slate-300">Track Status</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
