import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, MessageCircle, ShieldCheck, ArrowRight, AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { lang, t } = useLanguage();

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
                  {t.portalName}
                </span>
                <span className="text-[10px] text-orange-400 font-semibold uppercase tracking-wider block">
                  {t.tagline}
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs font-normal leading-relaxed">
              {t.footerDesc}
            </p>

            <div className="pt-1 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.connectWithUs || (lang === 'ta' ? 'எங்களுடன் இணையுங்கள்' : 'Connect With Us')}
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href="#!"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/50"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#!"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/50"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#!"
                  onClick={(e) => e.preventDefault()}
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/50"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="#!"
                  onClick={(e) => e.preventDefault()}
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
              {t.services || (lang === 'ta' ? 'சேவைகள்' : 'Services')}
            </h4>
            <ul className="space-y-2 text-slate-400 font-normal">
              <li><Link to="/services/aadhaar" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">{t.catAadhaar}</Link></li>
              <li><Link to="/services/pan-services" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">{t.catPan}</Link></li>
              <li><Link to="/services/voter" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">{t.catVoter}</Link></li>
              <li><Link to="/services/certificates" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">{t.catCertificate}</Link></li>
              <li><Link to="/services/land" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">{t.catLandPatta}</Link></li>
              <li><Link to="/services/passport" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">{t.catPassport}</Link></li>
              <li><Link to="/services/driving-licence" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">{t.catDriving}</Link></li>
              <li><Link to="/services/vehicle" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">{t.catVehicle}</Link></li>
              <li className="pt-1">
                <Link to="/services" className="text-orange-400 font-bold hover:text-orange-300 inline-flex items-center gap-1 transition-colors">
                  <span>{t.viewAllServices ? t.viewAllServices.replace(' →', '') : (lang === 'ta' ? 'அனைத்து சேவைகளையும் பார்க்க' : 'View All Services')}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: QUICK LINKS */}
          <div className="space-y-4">
            <h4 className="font-heading font-extrabold text-orange-400 text-xs tracking-widest uppercase border-b border-slate-800 pb-2">
              {t.quickLinks || (lang === 'ta' ? 'முக்கிய இணைப்புகள்' : 'Quick Links')}
            </h4>
            <ul className="space-y-2 text-slate-400 font-normal">
              <li><Link to="/" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">{t.home}</Link></li>
              <li><Link to="/services" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">{t.allServices}</Link></li>
              <li><Link to="/about" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">{t.aboutUs}</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">{t.contactUs}</Link></li>
              <li><Link to="/track" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">{t.trackAppNav}</Link></li>
              <li><Link to="/login" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">{t.login}</Link></li>
              <li><Link to="/register" className="hover:text-white hover:translate-x-0.5 inline-block transition-all">{t.registerNav}</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT INFO */}
          <div className="space-y-4">
            <h4 className="font-heading font-extrabold text-orange-400 text-xs tracking-widest uppercase border-b border-slate-800 pb-2">
              {t.contactUs || (lang === 'ta' ? 'தொடர்புகொள்ள' : 'Contact Us')}
            </h4>
            
            <ul className="space-y-3 text-slate-400 font-normal leading-relaxed">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white font-mono font-medium">1800-425-3738</span>
                  <span className="text-[11px] text-slate-500">+91 44 2859 0000 ({lang === 'ta' ? 'கட்டணமில்லா சேவை' : 'Toll-Free'})</span>
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
                  <span className="block text-white font-medium">{t.workingHours || (lang === 'ta' ? 'திங்கள் - சனி: காலை 08:00 - மாலை 08:00' : 'Mon - Sat: 08:00 AM - 08:00 PM')}</span>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> {lang === 'ta' ? '24/7 போர்ட்டல் சேவை வசதி' : '24/7 Portal Access'}
                  </span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* STEP 5 DISCLAIMER BOX */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-start gap-3 text-slate-400 text-xs leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            {t.footerDisclaimer || (lang === 'ta' ? 'இது ஒரு தனியார் டிஜிட்டல் சேவை உதவி தளமாகும். இது அரசு சார்ந்த அதிகாரப்பூர்வ இணையதளம் அல்ல.' : 'This is a private digital services assistance portal and is not an official government website.')}
          </p>
        </div>

        {/* BOTTOM COPYRIGHT & LEGAL LINKS BAR */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} {t.portalName}. {t.allRightsReserved || (lang === 'ta' ? 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.' : 'All Rights Reserved.')}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <Link to="/privacy" className="hover:text-white transition-colors">{t.privacyPolicy || (lang === 'ta' ? 'தனியுரிமைக் கொள்கை' : 'Privacy Policy')}</Link>
            <span className="text-slate-700">|</span>
            <Link to="/terms" className="hover:text-white transition-colors">{t.termsConditions || (lang === 'ta' ? 'விதிமுறைகள் மற்றும் நிபந்தனைகள்' : 'Terms & Conditions')}</Link>
            <span className="text-slate-700">|</span>
            <Link to="/refund-policy" className="hover:text-white transition-colors">{t.refundPolicy || (lang === 'ta' ? 'ரீஃபண்ட் கொள்கை' : 'Refund Policy')}</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
