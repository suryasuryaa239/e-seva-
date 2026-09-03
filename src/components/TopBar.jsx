import React from 'react';
import { Phone, Clock, ShieldCheck, Landmark } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <span className="flex items-center gap-1 font-medium text-emerald-400">
            <Landmark className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Digital E-Services Portal</span>
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-300">
            <Phone className="w-3 h-3 text-indigo-400" />
            Helpline: <strong>1800-425-3738</strong>
          </span>
          <span className="hidden lg:inline text-slate-700">|</span>
          <span className="hidden lg:flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3 text-amber-400" />
            Mon-Sat: 08:00 AM - 08:00 PM
          </span>
        </div>

        <div className="flex items-center">
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60 text-[10px] sm:text-xs font-medium">
            <ShieldCheck className="w-3 h-3" />
            <span>256-bit SSL Secure</span>
          </span>
        </div>
      </div>
    </div>
  );
}
