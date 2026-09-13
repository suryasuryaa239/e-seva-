import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Breadcrumbs({ items = [] }) {
  const { lang, t } = useLanguage();

  return (
    <nav className="flex items-center text-xs text-slate-500 py-3 px-1 flex-wrap gap-1.5 font-medium">
      <Link to="/" className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 transition-colors font-medium">
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
                className="text-slate-600 hover:text-indigo-600 hover:underline transition-colors font-medium truncate max-w-[200px]"
                title={item.label}
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900 font-semibold truncate max-w-[250px]" title={item.label}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
