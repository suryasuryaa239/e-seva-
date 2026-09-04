import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Vote, FileText, UserCheck, ShieldCheck, MapPin, Smartphone, 
  Download, Search, CheckCircle2, RefreshCw, AlertCircle, ArrowRight, HelpCircle, UserPlus, FileSearch
} from 'lucide-react';

export default function VoterServicesCatalog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const voterServices = [
    {
      id: 'new-voter-registration-form-6',
      title: 'New Voter Registration (Form 6)',
      description: 'Apply for fresh EPIC voter ID card for Indian citizens who have attained 18 years of age.',
      fee: '₹0 (Free Govt Service)',
      sla: '15–20 Working Days',
      docs: ['Proof of Age (Birth Cert / SSLC)', 'Proof of Residence (Aadhaar / Utility Bill)', 'Passport Photo'],
      icon: UserPlus,
      badge: 'Popular'
    },
    {
      id: 'voter-address-correction-form-8',
      title: 'Voter Address Transfer & Correction (Form 8)',
      description: 'Shift polling constituency address or correct spelling mistakes in EPIC name, age, or photo.',
      fee: '₹30',
      sla: '10–15 Working Days',
      docs: ['Existing EPIC Voter Card', 'New Residence Proof', 'Aadhaar Card'],
      icon: MapPin,
      badge: 'High Demand'
    },
    {
      id: 'voter-aadhaar-linking-form-6b',
      title: 'Voter ID - Aadhaar Linkage (Form 6B)',
      description: 'Link 12-digit Aadhaar number with Electoral Roll EPIC record for authentication and anti-duplication.',
      fee: '₹0 (Free)',
      sla: '24–48 Hours',
      docs: ['EPIC Voter Number', 'Aadhaar Number', 'OTP Verified Mobile'],
      icon: ShieldCheck,
      badge: 'Recommended'
    },
    {
      id: 'epic-digital-download',
      title: 'Instant e-EPIC Digital PDF Download',
      description: 'Download officially signed digital e-EPIC card PDF directly to your device for instant identification.',
      fee: '₹25',
      sla: 'Instant PDF',
      docs: ['EPIC Number or Form Reference ID', 'Registered Mobile OTP'],
      icon: Download,
      badge: 'Instant'
    },
    {
      id: 'replacement-voter-card',
      title: 'Replacement Physical Voter Card (Lost/Damaged)',
      description: 'Order duplicate high-quality plastic EPIC card dispatched to home address for lost or broken cards.',
      fee: '₹50',
      sla: '7–10 Delivery Days',
      docs: ['Existing EPIC Number', 'Police FIR Copy / Self Declaration', 'Postal Address'],
      icon: RefreshCw
    },
    {
      id: 'nri-voter-registration-form-6a',
      title: 'Overseas NRI Voter Enrollment (Form 6A)',
      description: 'Register as Overseas Elector in your home constituency for Indian citizens living abroad.',
      fee: '₹0 (Free)',
      sla: '20–30 Working Days',
      docs: ['Valid Indian Passport Copy', 'Valid Visa / Overseas Residence Permit'],
      icon: FileText
    },
    {
      id: 'electoral-roll-search',
      title: 'Electoral Roll Search & Polling Booth Finder',
      description: 'Locate your name in official Voter List, find Polling Station booth details & Serial Number.',
      fee: '₹0 (Free)',
      sla: 'Instant Report',
      docs: ['EPIC Number or Full Name, State & District'],
      icon: FileSearch,
      badge: 'Free Service'
    },
    {
      id: 'voter-deletion-objection-form-7',
      title: 'Objection / Deletion in Electoral Roll (Form 7)',
      description: 'Submit request to delete voter name due to death, permanent migration, or double entry.',
      fee: '₹0 (Free)',
      sla: '10–15 Working Days',
      docs: ['Death Certificate (if applicable)', 'Applicant EPIC Copy'],
      icon: AlertCircle
    }
  ];

  const filtered = voterServices.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Hero Banner Section */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/30">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-extrabold">
            <Vote className="w-4 h-4 text-emerald-400" />
            <span>ELECTION COMMISSION FACILITATION DESK</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Voter ID Services & Electoral Facilitation Portal
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
                Online registration for new EPIC card (Form 6), Address Transfer (Form 8), Aadhaar Linkage (Form 6B), e-EPIC download, and Polling Booth lookup.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 min-w-[240px]">
              <div className="text-[11px] text-emerald-200 uppercase font-bold tracking-wider">Voter Helpline</div>
              <div className="text-xl font-extrabold text-white mt-0.5">1950 (Toll Free)</div>
              <div className="text-[11px] text-slate-300">Mon - Sat: 10:00 AM to 5:00 PM</div>
            </div>
          </div>

          {/* Search Box */}
          <div className="pt-2">
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search Voter services (Form 6, Form 8, e-EPIC download, Booth search)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Notice Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-emerald-900 shadow-sm">
          <AlertCircle className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-emerald-950">Electoral Notice:</span> Any Indian citizen who completes 18 years of age on or before qualifying dates is eligible to enroll as a voter. Ensure your mobile number is linked to download digital e-EPIC.
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Available Voter Services ({filtered.length})</h2>
            <p className="text-xs text-slate-500">Select a Voter service to begin online application assistance.</p>
          </div>
          <Link
            to="/tracker"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center space-x-1"
          >
            <span>Track Application Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => {
            const IconComp = service.icon || Vote;
            return (
              <div 
                key={service.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    {service.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        service.badge === 'Instant' ? 'bg-emerald-100 text-emerald-800' :
                        service.badge === 'Recommended' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Service Fee:</span>
                      <span className="font-bold text-slate-900">{service.fee}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Processing Time:</span>
                      <span className="font-semibold text-slate-700">{service.sla}</span>
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-700">Required Documents:</div>
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

                {/* Apply Action Bar */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/service/${service.id}`}
                    className="text-xs font-bold text-slate-700 hover:text-emerald-700 hover:underline"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => navigate(`/apply/${service.id}`)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Process Flow */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-emerald-700" />
            <span>How Voter ID Application & Verification Works</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">1</div>
              <div className="font-bold text-slate-800">Select Form Type</div>
              <div className="text-slate-600">Choose Form 6 (New Voter) or Form 8 (Correction / Address Transfer).</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">2</div>
              <div className="font-bold text-slate-800">Fill Application</div>
              <div className="text-slate-600">Enter personal details, assembly constituency, and address details.</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">3</div>
              <div className="font-bold text-slate-800">BLO Field Verification</div>
              <div className="text-slate-600">Booth Level Officer (BLO) performs local verification of details.</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">4</div>
              <div className="font-bold text-slate-800">EPIC Generation</div>
              <div className="text-slate-600">Digital e-EPIC issued & physical voter card dispatched to home address.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
