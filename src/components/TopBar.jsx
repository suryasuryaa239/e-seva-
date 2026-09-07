import React from 'react';
import { Phone, Clock, ShieldCheck, Landmark, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TopBar() {
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <div className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <span className="flex items-center gap-1 font-medium text-emerald-400">
            <Landmark className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{t.govTag}</span>
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-300">
            <Phone className="w-3 h-3 text-indigo-400" />
            <span>{t.tollFree}</span>
          </span>
          <span className="hidden lg:inline text-slate-700">|</span>
          <span className="hidden lg:flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{t.workingHours}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white px-2.5 py-0.5 rounded-full font-bold text-[11px] transition-all shadow-sm cursor-pointer border border-orange-400"
            title="Switch Language / மொழியை மாற்றவும்"
          >
            <Globe className="w-3 h-3 text-amber-200 animate-spin-slow" />
            <span>{lang === 'en' ? 'English (EN)' : 'தமிழ் (TA)'}</span>
            <span className="bg-slate-950/40 text-[9px] px-1.5 py-0.2 rounded-full font-mono text-orange-200">
              {lang === 'en' ? 'தமிழ்' : 'EN'}
            </span>
          </button>

          <span className="hidden sm:flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60 text-[10px] sm:text-xs font-medium">
            <ShieldCheck className="w-3 h-3" />
            <span>256-bit SSL</span>
          </span>
        </div>
      </div>
    </div>
  );
}
