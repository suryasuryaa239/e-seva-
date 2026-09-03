import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b192c] text-slate-300 pt-16 pb-8 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 4-COLUMN FOOTER GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* COLUMN 1: SERVICES */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-white text-sm tracking-wide uppercase">Services</h4>
            <ul className="space-y-2 text-slate-400 font-normal">
              <li><Link to="/services/aadhaar" className="hover:text-white transition-colors">Aadhaar Services</Link></li>
              <li><Link to="/services/pan-services" className="hover:text-white transition-colors">PAN Services</Link></li>
              <li><Link to="/services/voter" className="hover:text-white transition-colors">Voter ID Services</Link></li>
              <li><Link to="/services/certificates" className="hover:text-white transition-colors">Certificate Services</Link></li>
              <li><Link to="/services/land" className="hover:text-white transition-colors">Land & Patta Services</Link></li>
              <li><Link to="/services/passport" className="hover:text-white transition-colors">Passport Services</Link></li>
              <li><Link to="/services/driving-licence" className="hover:text-white transition-colors">Driving Licence Services</Link></li>
              <li><Link to="/services/vehicle" className="hover:text-white transition-colors">Vehicle Services</Link></li>
              <li><Link to="/services" className="hover:text-orange-400 font-semibold transition-colors">View All Services</Link></li>
            </ul>
          </div>

          {/* COLUMN 2: ABOUT */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-white text-sm tracking-wide uppercase">About</h4>
            <ul className="space-y-2 text-slate-400 font-normal">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><Link to="/about" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: QUICK LINKS */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-white text-sm tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-2 text-slate-400 font-normal">
              <li><Link to="/track" className="hover:text-white transition-colors">Check Application Status</Link></li>
              <li><Link to="/track" className="hover:text-white transition-colors">Track Application</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Career</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">News & Updates</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT INFO */}
          <div className="space-y-4">
            <h4 className="font-heading font-extrabold text-white text-sm tracking-wide uppercase">Contact Info</h4>
            
            <ul className="space-y-3 text-slate-400 font-normal leading-relaxed">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>123, Service Street, Digital City, DC 600001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span>+91 12345 67890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>info@eseva.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block">Mon - Sat: 9:00 AM - 6:00 PM</span>
                  <span className="block text-slate-500">Sunday: Closed</span>
                </div>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="pt-2 flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & LEGAL LINKS BAR */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} E-Seva. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <span>|</span>
            <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
            <span>|</span>
            <Link to="/privacy" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
