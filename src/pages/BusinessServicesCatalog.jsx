import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, FileText, CheckCircle2, Search, ArrowRight, ShieldCheck, Building, Landmark, AlertCircle
} from 'lucide-react';

export default function BusinessServicesCatalog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const services = [
    {
      id: 'gst-registration-application',
      title: 'GST Registration (New GSTIN)',
      description: 'Obtain 15-digit GSTIN number for sole proprietorship, partnership, OPC, or private limited business.',
      fee: '₹499',
      sla: '5–7 Working Days',
      docs: ['PAN Card of Business / Proprietor', 'Aadhaar Card', 'Electricity Bill of Business Premises', 'Bank Account Proof'],
      icon: Briefcase,
      badge: 'Popular'
    },
    {
      id: 'msme-udyam-registration',
      title: 'MSME Udyam Registration Certificate',
      description: 'Government MSME Udyam registration for micro, small, and medium enterprises to access priority credit.',
      fee: '₹150',
      sla: '1–2 Working Days',
      docs: ['Aadhaar Number of Proprietor / Director', 'PAN Number', 'Bank Account & IFSC Code'],
      icon: Building,
      badge: 'Instant'
    },
    {
      id: 'fssai-food-license-registration',
      title: 'FSSAI Food License / Registration',
      description: 'Food Safety and Standards Authority of India (FSSAI) license for food manufacturers, cloud kitchens & shops.',
      fee: '₹350',
      sla: '7–10 Working Days',
      docs: ['Passport Photo', 'Identity Proof (Aadhaar / Voter)', 'Business Premises Address Proof'],
      icon: ShieldCheck
    },
    {
      id: 'trade-license-application',
      title: 'Commercial Trade License Assistance',
      description: 'Municipal trade license approval for operating retail outlets, commercial offices, and industrial units.',
      fee: '₹600',
      sla: '10–15 Working Days',
      docs: ['Property Tax Receipt / Lease Agreement', 'Building Plan Sanction', 'NOC from Fire / Health Dept'],
      icon: Landmark
    }
  ];

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-purple-800/40">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-300 border border-purple-400/30 px-3.5 py-1 rounded-full text-xs font-extrabold">
            <Briefcase className="w-4 h-4 text-purple-400" />
            <span>BUSINESS REGISTRATION & COMPLIANCE DESK</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Business & MSME Compliance Services
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
                Online registration for New GSTIN, MSME Udyam Certificates, FSSAI Food Licenses, and Municipal Trade Licenses.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 min-w-[240px]">
              <div className="text-[11px] text-purple-200 uppercase font-bold tracking-wider">Business Helpdesk</div>
              <div className="text-xl font-extrabold text-white mt-0.5">1800-11-3444</div>
              <div className="text-[11px] text-slate-300">Mon - Sat: 9:30 AM to 6:00 PM</div>
            </div>
          </div>

          <div className="pt-2 max-w-xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                placeholder="Search Business services (GSTIN, MSME Udyam, FSSAI, Trade License)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-purple-950 shadow-sm">
          <AlertCircle className="w-4 h-4 text-purple-700 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-purple-950">GST Compliance Note:</span> GST registration is mandatory for businesses with turnover exceeding ₹40 Lakhs (Goods) or ₹20 Lakhs (Services), or engaged in inter-state e-commerce.
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Available Business Services ({filtered.length})</h2>
            <p className="text-xs text-slate-500">Select a business service to begin online filing.</p>
          </div>
          <Link to="/tracker" className="text-xs font-bold text-purple-800 hover:underline flex items-center space-x-1">
            <span>Track Application Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => {
            const IconComp = service.icon || Briefcase;
            return (
              <div key={service.id} className="bg-white rounded-xl border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-800 group-hover:bg-purple-800 group-hover:text-white transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    {service.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-200">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-800 transition-colors">
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
                  <Link to={`/service/${service.id}`} className="text-xs font-bold text-slate-700 hover:text-purple-800 hover:underline">
                    View Details
                  </Link>
                  <button onClick={() => navigate(`/apply/${service.id}`)} className="px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center space-x-1.5">
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
