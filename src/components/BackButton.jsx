import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function BackButton({ 
  fallbackPath = '/', 
  label, 
  className = '', 
  variant = 'default',
  showLabel = true 
}) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const handleBack = () => {
    // If user has previous navigation history within the app
    if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  const defaultLabel = lang === 'ta' ? 'பின்செல்ல' : 'Back';
  const buttonLabel = label || defaultLabel;

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleBack}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 font-extrabold text-xs rounded-xl border border-slate-200/90 shadow-2xs hover:border-orange-300 transition-all duration-200 group cursor-pointer ${className}`}
        title={lang === 'ta' ? 'முந்தைய பக்கத்திற்குச் செல்ல' : 'Go back to previous page'}
      >
        <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-600 group-hover:-translate-x-0.5 transition-transform" />
        {showLabel && <span>{buttonLabel}</span>}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-xs hover:shadow-md transition-all duration-200 group cursor-pointer ${className}`}
      title={lang === 'ta' ? 'முந்தைய பக்கத்திற்குச் செல்ல' : 'Go back to previous page'}
    >
      <ArrowLeft className="w-4 h-4 text-orange-400 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
      {showLabel && <span>{buttonLabel}</span>}
    </button>
  );
}
