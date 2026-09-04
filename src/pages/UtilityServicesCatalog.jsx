import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Zap, FileText, CheckCircle2, Search, ArrowRight, RefreshCw, Landmark, AlertCircle
} from 'lucide-react';

export default function UtilityServicesCatalog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const services = [
    {
      id: 'electricity-eb-name-transfer',
      title: 'Electricity Meter (EB) Name Transfer',
      description: 'Transfer TNEB electricity consumer connection meter post property purchase or legal heir inheritance.',
      fee: '₹200',
      sla: '10–15 Working Days',
      docs: ['Registered Sale Deed', 'Latest Paid EB Bill Receipt', 'NOC from Previous Owner', 'Aadhaar Card'],
      icon: Zap,
      badge: 'Popular'
    },
    {
      id: 'new-eb-electricity-connection',
      title: 'New Electricity Connection (EB Tariff)',
      description: 'Apply for fresh low tension (LT) domestic or commercial electricity meter connection.',
      fee: '₹350',
      sla: '7–10 Working Days',
      docs: ['Property Tax Receipt / Patta Copy', 'Wiring Completion Certificate', 'Aadhaar Card'],
      icon: RefreshCw
    },
    {
      id: 'property-tax-assessment',
      title: 'Property Tax Name Transfer & Assessment',
      description: 'Update municipal property tax records and house tax assessment name to current property owner.',
      fee: '₹150',
      sla: '7–12 Working Days',
      docs: ['Registered Sale Deed Copy', 'Patta Copy', 'Old Property Tax Receipt'],
      icon: Landmark,
      badge: 'Essential'
    }
  ];

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-amber-800/40">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-extrabold">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>PUBLIC UTILITY & TAXES DESK</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Electricity EB & Property Tax Services
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
                Online assistance for Electricity Connection EB Name Transfer, New Connection, and Municipal Property Tax Assessment.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 min-w-[240px]">
              <div className="text-[11px] text-amber-200 uppercase font-bold tracking-wider">TNEB Utility Helpline</div>
              <div className="text-xl font-extrabold text-white mt-0.5">1912 (24x7)</div>
              <div className="text-[11px] text-slate-300">Toll Free Support</div>
            </div>
          </div>

          <div className="pt-2 max-w-xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                placeholder="Search Utility services (EB name transfer, new connection, property tax)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-amber-950 shadow-sm">
          <AlertCircle className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-amber-950">Outstanding Arrears Note:</span> Ensure all previous electricity consumption bills and property taxes are cleared before filing a name transfer application.
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Available Utility Services ({filtered.length})</h2>
            <p className="text-xs text-slate-500">Select a utility service to begin online filing.</p>
          </div>
          <Link to="/tracker" className="text-xs font-bold text-amber-800 hover:underline flex items-center space-x-1">
            <span>Track Application Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => {
            const IconComp = service.icon || Zap;
            return (
              <div key={service.id} className="bg-white rounded-xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-800 group-hover:bg-amber-800 group-hover:text-white transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    {service.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
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
                  <Link to={`/service/${service.id}`} className="text-xs font-bold text-slate-700 hover:text-amber-800 hover:underline">
                    View Details
                  </Link>
                  <button onClick={() => navigate(`/apply/${service.id}`)} className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center space-x-1.5">
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
