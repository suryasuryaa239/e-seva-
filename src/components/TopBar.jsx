import React from 'react';
import { Phone, Clock, ShieldCheck, Landmark } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <Landmark className="w-3.5 h-3.5" />
            Official Digital E-Services Portal
          </span>
          <span className="hidden md:inline text-slate-700">|</span>
          <span className="flex items-center gap-1 text-slate-300">
            <Phone className="w-3 h-3 text-indigo-400" />
            Helpline: <strong>1800-425-3738</strong> (Toll Free)
          </span>
          <span className="hidden md:inline text-slate-700">|</span>
          <span className="hidden lg:flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3 text-amber-400" />
            Operating Hours: 08:00 AM - 08:00 PM (Mon-Sat)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 font-medium">
            <ShieldCheck className="w-3 h-3" />
            256-bit SSL Encrypted & Secure
          </span>
        </div>
      </div>
    </div>
  );
}
