import React from 'react';
import { Phone, Clock, ShieldCheck, Landmark, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TopBar() {
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <div className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-4 truncate">
          <span className="flex items-center gap-1 font-medium text-emerald-400 shrink-0">
            <Landmark className="w-3.5 h-3.5" />
            <span className="truncate">{t.govTag}</span>
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-300 shrink-0">
            <Phone className="w-3 h-3 text-indigo-400" />
            <span>{t.tollFree}</span>
          </span>
          <span className="hidden lg:inline text-slate-700">|</span>
          <span className="hidden lg:flex items-center gap-1 text-slate-400 shrink-0">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{t.workingHours}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/80 text-[10px] sm:text-xs font-semibold tracking-wide">
            <ShieldCheck className="w-3 h-3" />
            <span>256-bit SSL</span>
          </span>
        </div>
      </div>
    </div>
  );
}
