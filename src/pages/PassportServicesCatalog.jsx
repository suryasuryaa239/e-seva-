import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Globe, FileText, CheckCircle2, Search, ArrowRight, ShieldCheck, Clock, AlertCircle, HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedService } from '../data/servicesCatalogData';

export default function PassportServicesCatalog() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const services = [
    {
      id: 'fresh-passport-application',
      title: 'Fresh Passport Application (36 / 60 Pages)',
      description: 'Apply for fresh 10-year Ordinary Passport under Normal scheme with Passport Seva Kendra (PSK) appointment slot booking.',
      fee: '₹1,500',
      sla: '15–20 Working Days',
      docs: ['Aadhaar Card', 'Proof of Date of Birth (SSLC / Birth Cert)', 'Bank Passbook / Electricity Bill'],
      icon: Globe,
      badge: 'Popular'
    },
    {
      id: 'tatkaal-passport-urgent',
      title: 'Tatkaal Urgent Passport Issuance',
      description: 'Expedited passport processing scheme for urgent travel requirements with 3-day dispatch post PSK interview.',
      fee: '₹3500',
      sla: '3–5 Working Days',
      docs: ['3 Annexure Verification Proofs (Aadhaar, PAN, Voter ID)', 'Address Proof'],
      icon: ShieldCheck,
      badge: 'Urgent Processing'
    },
    {
      id: 'passport-reissue-renewal',
      title: 'Passport Re-issue / Validity Extension',
      description: 'Re-issue expired passport, exhausted page booklets, or change of address / spouse name in existing passport.',
      fee: '₹1,500',
      sla: '10–15 Working Days',
      docs: ['Existing Old Passport Booklet', 'Self-Attested Copy of First & Last Pages', 'Updated Address Proof'],
      icon: Clock
    },
    {
      id: 'police-clearance-certificate-pcc',
      title: 'Police Clearance Certificate (PCC) Assistance',
      description: 'Apply for PCC required for employment visa, overseas immigration, permanent residency, or student visas.',
      fee: '₹500',
      sla: '7–10 Working Days',
      docs: ['Valid Passport Copy', 'Current Employment / Visa Grant Letter'],
      icon: FileText,
      badge: 'Visa Essential'
    }
  ];

  const localizedServices = services.map(s => {
    const loc = getLocalizedService({ slug: s.id, name: s.title, description: s.description }, lang);
    return {
      ...s,
      title: loc.name || s.title,
      description: loc.description || s.description
    };
  });

  const filtered = localizedServices.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-sky-800/40">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-sky-500/20 text-sky-300 border border-sky-400/30 px-3.5 py-1 rounded-full text-xs font-extrabold">
            <Globe className="w-4 h-4 text-sky-400" />
            <span>{lang === 'ta' ? 'பாஸ்போர்ட் சேவா உதவி மையம்' : 'PASSPORT SEVA FACILITATION DESK'}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {lang === 'ta' ? 'பாஸ்போர்ட் சேவைகள் போர்ட்டல்' : 'Passport Seva & Visa Facilitation Portal'}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
                {lang === 'ta' ? 'புதிய பாஸ்போர்ட் விண்ணப்பம், தட்கல் பாஸ்போர்ட், புதுப்பித்தல் மற்றும் PCC சான்றிதழ் ஆன்லைன் முன்பதிவு.' : 'Appointment booking for Fresh Passports, Tatkaal schemes, Expired Passport Renewals, and Police Clearance Certificates (PCC).'}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 min-w-[240px]">
              <div className="text-[11px] text-sky-200 uppercase font-bold tracking-wider">{lang === 'ta' ? 'பாஸ்போர்ட் உதவி மையம்' : 'Passport Seva Call Center'}</div>
              <div className="text-xl font-extrabold text-white mt-0.5">1800-258-1800</div>
              <div className="text-[11px] text-slate-300">{lang === 'ta' ? '24/7 இலவச உதவி சேவை' : 'Toll Free 24x7 Support'}</div>
            </div>
          </div>

          <div className="pt-2 max-w-xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                placeholder={lang === 'ta' ? 'பாஸ்போர்ட் சேவைகளைத் தேடுங்கள் (புதிய பாஸ்போர்ட், தட்கல், PCC)...' : 'Search Passport services (Fresh Passport, Tatkaal, Renewal, PCC)...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-sky-950 shadow-sm">
          <AlertCircle className="w-4 h-4 text-sky-700 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-sky-950">{lang === 'ta' ? 'அசல் சான்றிதழ் குறிப்பு:' : 'Original Document Note:'}</span> {lang === 'ta' ? 'நேர்காணல் நாளில் PSK மையத்திற்கு அசல் சான்றிதழ்கள் மற்றும் நகல்களை நேரில் கொண்டு வர வேண்டும்.' : 'Applicants must carry original documents along with self-attested photocopies to Passport Seva Kendra (PSK) on appointment date.'}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{lang === 'ta' ? `கிடைக்கும் பாஸ்போர்ட் சேவைகள் (${filtered.length})` : `Available Passport Services (${filtered.length})`}</h2>
            <p className="text-xs text-slate-500">{lang === 'ta' ? 'ஆன்லைன் முன்பதிவைத் தொடங்க சேவையைத் தேர்ந்தெடுக்கவும்.' : 'Select a Passport service to start application slot booking.'}</p>
          </div>
          <Link to="/tracker" className="text-xs font-bold text-sky-800 hover:underline flex items-center space-x-1">
            <span>{lang === 'ta' ? 'விண்ணப்ப நிலை அறிய' : 'Track Application Status'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => {
            const IconComp = service.icon || Globe;
            return (
              <div key={service.id} className="bg-white rounded-xl border border-slate-200 hover:border-sky-500 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-800 group-hover:bg-sky-800 group-hover:text-white transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    {service.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 border border-sky-200">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-800 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{service.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>{lang === 'ta' ? 'சேவை கட்டணம்:' : 'Service Fee:'}</span>
                      <span className="font-bold text-slate-900">{service.fee}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>{lang === 'ta' ? 'செயலாக்க காலம்:' : 'Processing Time:'}</span>
                      <span className="font-semibold text-slate-700">{service.sla}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-700">{lang === 'ta' ? 'தேவையான சான்றுகள்:' : 'Required Documents:'}</div>
                    <ul className="space-y-1">
                      {service.docs.map((doc, idx) => (
                        <li key={idx} className="text-[11px] text-slate-600 flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span className="truncate">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <Link to={`/service/${service.id}`} className="text-xs font-bold text-slate-700 hover:text-sky-800 hover:underline">
                    {lang === 'ta' ? 'விவரங்கள்' : 'View Details'}
                  </Link>
                  <button onClick={() => navigate(`/apply/${service.id}`)} className="px-4 py-2 bg-sky-800 hover:bg-sky-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center space-x-1.5">
                    <span>{t.applyNow || (lang === 'ta' ? 'விண்ணப்பிக்க' : 'Apply Now')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
