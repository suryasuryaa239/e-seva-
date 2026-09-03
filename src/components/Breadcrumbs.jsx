import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center text-xs text-slate-500 py-3 px-1 flex-wrap gap-1.5 font-medium">
      <Link to="/" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          {item.link ? (
            <Link to={item.link} className="hover:text-indigo-600 transition-colors truncate max-w-[200px]">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-semibold truncate max-w-[250px]">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
