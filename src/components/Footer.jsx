import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, MessageCircle, 
  ShieldCheck, ArrowRight, AlertTriangle, Send, Linkedin, Twitter, Globe
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { lang, t } = useLanguage();

  const [settings, setSettings] = useState({
    social_facebook: '',
    social_instagram: '',
    social_youtube: '',
    social_whatsapp: '+919894059591',
    social_twitter: '',
    social_telegram: '',
    social_linkedin: '',
    contact_phone: '+91 98940 59591',
    contact_email: 'econnectindia@gmail.com',
    contact_address: '45, New Bus stand complex, Sathyamangalam-638402.',
    working_hours: ''
  });

  useEffect(() => {
    let isMounted = true;
    fetch('/api/settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (isMounted && data) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const formatExternalUrl = (url) => {
    if (!url || url.trim() === '') return '#!';
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed}`;
  };

  const formatWhatsAppUrl = (val) => {
    if (!val || val.trim() === '') return 'https://wa.me/919894059591';
    const trimmed = val.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    const digits = trimmed.replace(/\D/g, '');
    if (digits.length === 10) return `https://wa.me/91${digits}`;
    return `https://wa.me/${digits}`;
  };

  const socialLinks = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      url: formatWhatsAppUrl(settings.social_whatsapp),
      active: Boolean(settings.social_whatsapp && settings.social_whatsapp.trim()),
      hoverColor: 'hover:bg-emerald-600 hover:border-emerald-500 text-emerald-400 hover:text-white'
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      url: formatExternalUrl(settings.social_instagram),
      active: Boolean(settings.social_instagram && settings.social_instagram.trim()),
      hoverColor: 'hover:bg-pink-600 hover:border-pink-500 text-pink-400 hover:text-white'
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      url: formatExternalUrl(settings.social_facebook),
      active: Boolean(settings.social_facebook && settings.social_facebook.trim()),
      hoverColor: 'hover:bg-blue-600 hover:border-blue-500 text-blue-400 hover:text-white'
    },
    {
      id: 'youtube',
      label: 'YouTube',
      icon: Youtube,
      url: formatExternalUrl(settings.social_youtube),
      active: Boolean(settings.social_youtube && settings.social_youtube.trim()),
      hoverColor: 'hover:bg-red-600 hover:border-red-500 text-red-400 hover:text-white'
    },
    {
      id: 'twitter',
      label: 'X (Twitter)',
      icon: Twitter,
      url: formatExternalUrl(settings.social_twitter),
      active: Boolean(settings.social_twitter && settings.social_twitter.trim()),
      hoverColor: 'hover:bg-slate-700 hover:border-slate-500 text-slate-300 hover:text-white'
    },
    {
      id: 'telegram',
      label: 'Telegram',
      icon: Send,
      url: formatExternalUrl(settings.social_telegram),
      active: Boolean(settings.social_telegram && settings.social_telegram.trim()),
      hoverColor: 'hover:bg-sky-500 hover:border-sky-400 text-sky-400 hover:text-white'
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      url: formatExternalUrl(settings.social_linkedin),
      active: Boolean(settings.social_linkedin && settings.social_linkedin.trim()),
      hoverColor: 'hover:bg-indigo-600 hover:border-indigo-500 text-indigo-400 hover:text-white'
    }
  ];

  // Display active links if any are configured, or fallback to the 4 primary social links
  const visibleSocials = socialLinks.some(s => s.active)
    ? socialLinks.filter(s => s.active)
    : socialLinks.slice(0, 4);

  return (
    <footer className="bg-[#0b192c] text-slate-300 pt-16 pb-8 text-xs border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 4-COLUMN FOOTER GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* COLUMN 1: E-SEVA BRAND IDENTITY */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo.png" 
                alt="EConnect" 
                className="w-10 h-10 object-contain rounded-xl bg-white p-1 shadow-md shrink-0" 
              />
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
              <div className="flex flex-wrap items-center gap-2">
                {visibleSocials.map((item) => {
                  const Icon = item.icon;
                  const isPlaceholder = item.url === '#!';
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target={isPlaceholder ? undefined : "_blank"}
                      rel={isPlaceholder ? undefined : "noopener noreferrer"}
                      onClick={isPlaceholder ? (e) => e.preventDefault() : undefined}
                      aria-label={item.label}
                      title={item.label}
                      className={`w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center transition-all border border-slate-700/60 shadow-sm ${item.hoverColor}`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* COLUMN 2: SERVICES */}
          <div className="space-y-4">
            <h4 className="font-heading font-extrabold text-orange-400 text-xs tracking-widest uppercase border-b border-slate-800 pb-2">
              {t.services || (lang === 'ta' ? 'சேவைகள்' : 'Services')}
            </h4>
            <ul className="space-y-3 text-slate-300 font-normal">
              <li><Link to="/services/aadhaar" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"><span className="w-1.5 h-1.5 rounded-full bg-orange-500/60 group-hover:bg-orange-400"></span><span>{t.catAadhaar}</span></Link></li>
              <li><Link to="/services/pan-services" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"><span className="w-1.5 h-1.5 rounded-full bg-orange-500/60 group-hover:bg-orange-400"></span><span>{t.catPan}</span></Link></li>
              <li><Link to="/services/voter" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"><span className="w-1.5 h-1.5 rounded-full bg-orange-500/60 group-hover:bg-orange-400"></span><span>{t.catVoter}</span></Link></li>
              <li><Link to="/services/certificates" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"><span className="w-1.5 h-1.5 rounded-full bg-orange-500/60 group-hover:bg-orange-400"></span><span>{t.catCertificate}</span></Link></li>
              <li><Link to="/services/land" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"><span className="w-1.5 h-1.5 rounded-full bg-orange-500/60 group-hover:bg-orange-400"></span><span>{t.catLandPatta}</span></Link></li>
              <li><Link to="/services/passport" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"><span className="w-1.5 h-1.5 rounded-full bg-orange-500/60 group-hover:bg-orange-400"></span><span>{t.catPassport}</span></Link></li>
              <li><Link to="/services/driving-licence" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"><span className="w-1.5 h-1.5 rounded-full bg-orange-500/60 group-hover:bg-orange-400"></span><span>{t.catDriving}</span></Link></li>
              <li><Link to="/services/vehicle" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"><span className="w-1.5 h-1.5 rounded-full bg-orange-500/60 group-hover:bg-orange-400"></span><span>{t.catVehicle}</span></Link></li>
              <li className="pt-1.5">
                <Link to="/services" className="text-orange-400 font-bold hover:text-orange-300 inline-flex items-center gap-1.5 transition-colors">
                  <span>{t.viewAllServices ? t.viewAllServices.replace(' →', '') : (lang === 'ta' ? 'அனைத்து சேவைகளையும் பார்க்க' : 'View All Services')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: QUICK LINKS */}
          <div className="space-y-4">
            <h4 className="font-heading font-extrabold text-orange-400 text-xs tracking-widest uppercase border-b border-slate-800 pb-2">
              {t.quickLinks || (lang === 'ta' ? 'முக்கிய இணைப்புகள்' : 'Quick Links')}
            </h4>
            <ul className="space-y-3 text-slate-300 font-normal">
              <li><Link to="/" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"><span className="w-1.5 h-1.5 rounded-full bg-orange-500/60 group-hover:bg-orange-400"></span><span>{t.home}</span></Link></li>
              <li><Link to="/services" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"><span className="w-1.5 h-1.5 rounded-full bg-orange-500/60 group-hover:bg-orange-400"></span><span>{t.allServices}</span></Link></li>
              <li><Link to="/about" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"><span className="w-1.5 h-1.5 rounded-full bg-orange-500/60 group-hover:bg-orange-400"></span><span>{t.aboutUs}</span></Link></li>
              <li><Link to="/contact" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"><span className="w-1.5 h-1.5 rounded-full bg-orange-500/60 group-hover:bg-orange-400"></span><span>{t.contactUs}</span></Link></li>
              <li><Link to="/track" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"><span className="w-1.5 h-1.5 rounded-full bg-orange-500/60 group-hover:bg-orange-400"></span><span>{t.trackAppNav}</span></Link></li>
              <li><Link to="/login" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"><span className="w-1.5 h-1.5 rounded-full bg-orange-500/60 group-hover:bg-orange-400"></span><span>{t.login}</span></Link></li>
              <li><Link to="/register" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"><span className="w-1.5 h-1.5 rounded-full bg-orange-500/60 group-hover:bg-orange-400"></span><span>{t.registerNav}</span></Link></li>
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
                  <a 
                    href={`tel:${(settings.contact_phone || '+91 98940 59591').replace(/\s+/g, '')}`} 
                    className="block text-white font-mono font-medium hover:text-orange-400 transition-colors"
                  >
                    {settings.contact_phone || '+91 98940 59591'}
                  </a>
                  <span className="text-[11px] text-slate-500">Official Helpline</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <a 
                    href={`mailto:${settings.contact_email || 'econnectindia@gmail.com'}`} 
                    className="block text-white font-medium hover:text-orange-400 transition-colors"
                  >
                    {settings.contact_email || 'econnectindia@gmail.com'}
                  </a>
                  <span className="text-[11px] text-slate-500">24/7 Digital Support</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{settings.contact_address || '45, New Bus stand complex, Sathyamangalam-638402.'}</span>
              </li>

              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white font-medium">
                    {settings.working_hours || (lang === 'ta' ? 'திங்கள் - சனி: காலை 08:00 - மாலை 08:00' : 'Mon - Sat: 08:00 AM - 08:00 PM')}
                  </span>
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
