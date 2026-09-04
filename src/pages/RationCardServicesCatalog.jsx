import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Grid, FileText, CheckCircle2, Search, ArrowRight, UserPlus, UserMinus, RefreshCw, AlertCircle
} from 'lucide-react';

export default function RationCardServicesCatalog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const services = [
    {
      id: 'ration-smart-card-member-update',
      title: 'Smart Ration Card - Add / Remove Member',
      description: 'Add newly born child or spouse or remove deceased/separated member in Smart Ration Card record.',
      fee: '₹30',
      sla: '7–15 Working Days',
      docs: ['Child Birth Certificate / Marriage Registration', 'Deletions/Surrender Certificate', 'Smart Ration Card Copy'],
      icon: UserPlus,
      badge: 'Popular'
    },
    {
      id: 'new-smart-ration-card-application',
      title: 'New Smart Ration Card Application (Family Card)',
      description: 'Apply for fresh Smart Ration Card for newly married couples or separate family unit creation.',
      fee: '₹50',
      sla: '15–30 Working Days',
      docs: ['Aadhaar Cards of All Family Members', 'Parent Ration Card Deletion Proof', 'Gas Connection Bill / Address Proof'],
      icon: Grid,
      badge: 'Essential'
    },
    {
      id: 'ration-family-head-change',
      title: 'Change Family Head in Smart Ration Card',
      description: 'Transfer family headship post demise or relocation of existing head of family in TNEPDS database.',
      fee: '₹30',
      sla: '7–10 Working Days',
      docs: ['Death Certificate (if applicable)', 'Consent Letter of Family Members', 'New Head Aadhaar & Photo'],
      icon: RefreshCw
    },
    {
      id: 'ration-address-fps-change',
      title: 'Ration Address Shifting & FPS Shop Change',
      description: 'Change residence address and transfer Fair Price Shop (FPS) ration shop allocation to new locality.',
      fee: '₹30',
      sla: '5–7 Working Days',
      docs: ['New Address Proof (EB Bill / Property Tax)', 'Smart Ration Card Number'],
      icon: FileText
    }
  ];

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-teal-800/40">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 border border-teal-400/30 px-3.5 py-1 rounded-full text-xs font-extrabold">
            <Grid className="w-4 h-4 text-teal-400" />
            <span>CIVIL SUPPLIES & SMART RATION CARD DESK</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Smart Ration Card Services (TNEPDS)
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
                Online assistance for Smart Ration Card member additions, new family card applications, family head changes, and address transfers.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 min-w-[240px]">
              <div className="text-[11px] text-teal-200 uppercase font-bold tracking-wider">Civil Supplies Helpline</div>
              <div className="text-xl font-extrabold text-white mt-0.5">1967 (Toll Free)</div>
              <div className="text-[11px] text-slate-300">Mon - Sat: 9:00 AM to 6:00 PM</div>
            </div>
          </div>

          <div className="pt-2 max-w-xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                placeholder="Search Ration services (Add member, new family card, head change)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-teal-950 shadow-sm">
          <AlertCircle className="w-4 h-4 text-teal-700 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-teal-950">Aadhaar Linkage Note:</span> All family members registered on Smart Ration Card must have their 12-digit Aadhaar number seeded into TNEPDS database.
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Available Ration Services ({filtered.length})</h2>
            <p className="text-xs text-slate-500">Select a ration card service to begin guided filing.</p>
          </div>
          <Link to="/tracker" className="text-xs font-bold text-teal-800 hover:underline flex items-center space-x-1">
            <span>Track Application Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => {
            const IconComp = service.icon || Grid;
            return (
              <div key={service.id} className="bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 group-hover:bg-teal-800 group-hover:text-white transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    {service.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 border border-teal-200">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{service.description}</p>
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

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <Link to={`/service/${service.id}`} className="text-xs font-bold text-slate-700 hover:text-teal-800 hover:underline">
                    View Details
                  </Link>
                  <button onClick={() => navigate(`/apply/${service.id}`)} className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center space-x-1.5">
                    <span>Apply Now</span>
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
