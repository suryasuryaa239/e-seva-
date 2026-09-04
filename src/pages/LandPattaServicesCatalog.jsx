import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, FileText, CheckCircle2, Search, ArrowRight, Download, RefreshCw, AlertCircle, HelpCircle, Landmark
} from 'lucide-react';

export default function LandPattaServicesCatalog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const services = [
    {
      id: 'patta-transfer-application',
      title: 'Patta / Chitta Name Transfer Application',
      description: 'Apply for official Patta transfer in revenue land records post property purchase or inheritance.',
      fee: '₹100',
      sla: '15–30 Working Days',
      docs: ['Registered Sale Deed', 'Parent Patta Copy', 'Property Tax Receipt', 'Aadhaar Card'],
      icon: MapPin,
      badge: 'High Demand'
    },
    {
      id: 'chitta-extract-download',
      title: 'A-Register & Chitta Extract Copy',
      description: 'Get officially verified digital extract of A-Register & land ownership Chitta statement.',
      fee: '₹50',
      sla: '1–2 Working Days',
      docs: ['District, Taluk, Village Name', 'Survey Number / Sub-division'],
      icon: Download,
      badge: 'Instant PDF'
    },
    {
      id: 'fmb-sketch-map',
      title: 'Field Measurement Book (FMB) Sketch Copy',
      description: 'Download field sketch map showing exact boundary measurements for your survey land number.',
      fee: '₹60',
      sla: '2–3 Working Days',
      docs: ['Taluk & Village Details', 'Survey Number & Sub-division'],
      icon: FileText
    },
    {
      id: 'encumbrance-certificate-ec',
      title: 'Encumbrance Certificate (EC) Application',
      description: 'Obtain certified Encumbrance Certificate verifying historical ownership sales & mortgage encumbrances.',
      fee: '₹120',
      sla: '3–5 Working Days',
      docs: ['Property Location Details', 'Survey Number', 'Search Period (Years)'],
      icon: Landmark,
      badge: 'Popular'
    },
    {
      id: 'land-subdivision-patta',
      title: 'Sub-division Patta Issuance',
      description: 'Apply for separate individual sub-division Patta when purchasing part of a larger survey plot.',
      fee: '₹200',
      sla: '30–45 Working Days',
      docs: ['Sale Deed with Layout Plan', 'Original Joint Patta Copy', 'Field Survey Report'],
      icon: RefreshCw
    }
  ];

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-amber-800/40">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-extrabold">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>REVENUE LAND RECORDS FACILITATION DESK</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Land Records & Patta Transfer Services
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
                Online assistance for Patta Transfer, Chitta Extract downloads, FMB Map copies, Encumbrance Certificate (EC), and Sub-division land records.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 min-w-[240px]">
              <div className="text-[11px] text-amber-200 uppercase font-bold tracking-wider">Land Revenue Helpdesk</div>
              <div className="text-xl font-extrabold text-white mt-0.5">1800-425-1500</div>
              <div className="text-[11px] text-slate-300">Mon - Sat: 9:30 AM to 6:00 PM</div>
            </div>
          </div>

          <div className="pt-2 max-w-xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                placeholder="Search land services (Patta transfer, Chitta, FMB sketch, EC)..."
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
            <span className="font-bold text-amber-950">Important Requirement:</span> Ensure survey number, sub-division number, and registered sale deed number match exactly with your local Taluk revenue office records.
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Available Land Services ({filtered.length})</h2>
            <p className="text-xs text-slate-500">Select a service to start your online land records application.</p>
          </div>
          <Link to="/tracker" className="text-xs font-bold text-amber-800 hover:underline flex items-center space-x-1">
            <span>Track Application Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => {
            const IconComp = service.icon || MapPin;
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
