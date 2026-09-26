import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FloatingBackButton() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useLanguage();

  // Do not show on Home page or Admin dashboard routes
  const isHomePage = location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/admin-');

  if (isHomePage || isAdminPage) {
    return null;
  }

  const handleBack = () => {
    if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/services');
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <button
        type="button"
        onClick={handleBack}
        className="flex items-center gap-2 bg-[#0b192c]/95 hover:bg-orange-600 text-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl border border-slate-700/60 hover:border-orange-400 backdrop-blur-md transition-all duration-300 transform hover:scale-105 active:scale-95 group cursor-pointer"
        title={lang === 'ta' ? 'முந்தைய பக்கத்திற்குத் திரும்பவும்' : 'Go back to previous page'}
      >
        <ArrowLeft className="w-4 h-4 text-orange-400 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
        <span className="font-heading font-extrabold text-xs tracking-wide">
          {lang === 'ta' ? 'பின்செல்ல' : 'Back'}
        </span>
      </button>
    </div>
  );
}
