import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Car, FileText, CheckCircle2, Search, ArrowRight, Clock, ShieldCheck, RefreshCw, AlertCircle
} from 'lucide-react';

export default function DrivingVehicleServicesCatalog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const services = [
    {
      id: 'learner-licence-llr-booking',
      title: 'Learner Licence (LLR) Slot Booking',
      description: 'Apply for Learners Driving Licence slot booking for 2-wheeler, 4-wheeler (LMV), or Transport commercial categories.',
      fee: '₹350',
      sla: '3–5 Working Days',
      docs: ['Aadhaar Card', 'Blood Group Certificate', 'Proof of Age', 'Passport Photo'],
      icon: Car,
      badge: 'High Demand'
    },
    {
      id: 'permanent-driving-licence',
      title: 'Permanent Driving Licence (DL) Slot',
      description: 'Book RTO driving track test slot post completion of 30 days mandatory LLR period for permanent DL issuance.',
      fee: '₹800',
      sla: '7–10 Working Days',
      docs: ['Valid Active LLR Copy', 'Training School Certificate (Form 5)', 'Vehicle Registration Book (RC)'],
      icon: ShieldCheck,
      badge: 'Popular'
    },
    {
      id: 'dl-renewal-application',
      title: 'Driving Licence Renewal & Address Change',
      description: 'Renew expired driving licence or update residential address / change of surname in existing DL smart card.',
      fee: '₹450',
      sla: '5–7 Working Days',
      docs: ['Original DL Card', 'Medical Fitness Certificate (Form 1A)', 'New Address Proof'],
      icon: RefreshCw
    },
    {
      id: 'vehicle-rc-transfer',
      title: 'Vehicle Registration Certificate (RC) Transfer',
      description: 'Transfer vehicle ownership RC smart card post secondhand vehicle purchase or family inheritance.',
      fee: '₹650',
      sla: '10–15 Working Days',
      docs: ['Form 29 & Form 30 Signed', 'Original RC Smart Card', 'Valid Insurance & PUC Certificate'],
      icon: FileText
    }
  ];

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-rose-800/40">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-rose-500/20 text-rose-300 border border-rose-400/30 px-3.5 py-1 rounded-full text-xs font-extrabold">
            <Car className="w-4 h-4 text-rose-400" />
            <span>RTO & TRANSPORT FACILITATION DESK</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Driving Licence & RTO Vehicle Services
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
                Online assistance for LLR slot booking, Permanent Driving Licence test slots, DL Renewal, and Vehicle RC Transfer.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 min-w-[240px]">
              <div className="text-[11px] text-rose-200 uppercase font-bold tracking-wider">Parivahan RTO Helpline</div>
              <div className="text-xl font-extrabold text-white mt-0.5">1800-180-0151</div>
              <div className="text-[11px] text-slate-300">Mon - Sat: 9:00 AM to 6:00 PM</div>
            </div>
          </div>

          <div className="pt-2 max-w-xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                placeholder="Search RTO services (LLR booking, DL renewal, RC transfer)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-rose-950 shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-700 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-rose-950">RTO Rule:</span> Applicants for LLR computer test must be present at the assigned RTO office with original physical documents and Aadhaar mobile OTP.
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Available RTO Services ({filtered.length})</h2>
            <p className="text-xs text-slate-500">Select an RTO service to begin guided slot booking.</p>
          </div>
          <Link to="/tracker" className="text-xs font-bold text-rose-800 hover:underline flex items-center space-x-1">
            <span>Track Application Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => {
            const IconComp = service.icon || Car;
            return (
              <div key={service.id} className="bg-white rounded-xl border border-slate-200 hover:border-rose-500 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-800 group-hover:bg-rose-800 group-hover:text-white transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    {service.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 border border-rose-200">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-800 transition-colors">
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
                  <Link to={`/service/${service.id}`} className="text-xs font-bold text-slate-700 hover:text-rose-800 hover:underline">
                    View Details
                  </Link>
                  <button onClick={() => navigate(`/apply/${service.id}`)} className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center space-x-1.5">
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
