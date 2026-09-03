import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, ShieldCheck, CheckCircle2, Award, Users, Clock, ArrowRight } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs items={[{ label: 'About E-Seva Portal' }]} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-4">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
            About Our Mission
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Empowering Citizens Through Digital E-Governance
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
            E-Seva Digital Portal is built to streamline citizen access to government and commercial digital services. We eliminate long physical queues, complex paperwork, and fragmented portals by providing a transparent, unified digital filing and status tracking platform.
          </p>
        </div>
      </div>

      {/* Core Objectives & Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-slate-900">100% Encrypted & Verified</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All submitted documents and personal details are processed through encrypted e-Governance backend gateways, adhering to official digital privacy standards.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-slate-900">Transparent SLA Delivery</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every service contains defined turnaround timelines (SLA) with step-by-step progress tracking and official departmental officer remarks.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-slate-900">Single-Window Access</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            From Aadhaar updates and PAN cards to Revenue certificates, Patta transfers, and Passports—apply and manage everything inside one citizen account.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="font-heading font-extrabold text-2xl text-white">Ready to Apply for a Service?</h3>
          <p className="text-xs text-slate-400 mt-1">Browse our complete directory of digital government services.</p>
        </div>
        <Link
          to="/services"
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs px-6 py-3.5 rounded-xl shadow transition-colors flex items-center gap-2"
        >
          Explore All Services <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
