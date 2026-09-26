import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Breadcrumbs({ items = [], showBackButton = true, fallbackPath = '/' }) {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 py-2">
      <div className="flex items-center flex-wrap gap-2.5">
        {showBackButton && (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 font-extrabold text-xs rounded-xl border border-slate-200/90 shadow-2xs hover:border-orange-300 transition-all duration-200 group cursor-pointer shrink-0"
            title={lang === 'ta' ? 'முந்தைய பக்கத்திற்குச் செல்ல' : 'Go back to previous page'}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-600 group-hover:-translate-x-0.5 transition-transform" />
            <span>{lang === 'ta' ? 'பின்செல்ல' : 'Back'}</span>
          </button>
        )}

        <nav className="flex items-center text-xs text-slate-500 flex-wrap gap-1.5 font-medium">
          <Link to="/" className="flex items-center gap-1 text-slate-600 hover:text-orange-600 transition-colors font-medium">
            <Home className="w-3.5 h-3.5" />
            <span>{t.home || (lang === 'ta' ? 'முகப்பு' : 'Home')}</span>
          </Link>

          {items.map((item, idx) => {
            const target = item.link || item.path || item.to;
            return (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                {target ? (
                  <Link 
                    to={target} 
                    className="text-slate-600 hover:text-orange-600 hover:underline transition-colors font-medium truncate max-w-[200px]"
                    title={item.label}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-slate-900 font-bold truncate max-w-[250px]" title={item.label}>
                    {item.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
