import React from 'react';
import { Trash2, X, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  applicationNumber,
  serviceName,
  confirmText,
  cancelText,
  loading = false
}) {
  const { lang } = useLanguage();

  if (!isOpen) return null;

  const modalTitle = title || (
    lang === 'ta' ? 'வரைவு விண்ணப்பத்தை நீக்கவா?' : 'Delete Draft Application?'
  );

  const modalDescription = description || (
    lang === 'ta' ? (
      <>
        நீங்கள் <strong className="font-bold text-slate-900 font-mono">{applicationNumber || 'வரைவு'}</strong> ({serviceName || 'சேவை'}) விண்ணப்பத்தை நிச்சயமாக நீக்க விரும்புகிறீர்களா? இந்தச் செயலைத் திரும்பப் பெற முடியாது.
      </>
    ) : (
      <>
        Are you sure you want to delete draft <strong className="font-bold text-slate-900 font-mono">{applicationNumber || 'this application'}</strong> ({serviceName || 'Service'})? This action cannot be undone.
      </>
    )
  );

  const btnConfirmText = confirmText || (lang === 'ta' ? 'ஆம், நீக்கவும்' : 'Yes, Delete');
  const btnCancelText = cancelText || (lang === 'ta' ? 'ரத்து செய்க' : 'Cancel');

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xs sm:max-w-sm bg-white rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-2xl shadow-slate-900/30 space-y-4 text-center animate-in zoom-in-95 duration-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Badge Icon */}
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center mx-auto text-rose-600 shadow-xs">
          <Trash2 className="w-6 h-6 stroke-[2.2]" />
        </div>

        {/* Modal Text Heading & Subtitle */}
        <div className="space-y-1.5">
          <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-snug">
            {modalTitle}
          </h3>
          <p className="text-slate-600 text-xs leading-relaxed max-w-xs mx-auto">
            {modalDescription}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            {btnCancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{lang === 'ta' ? 'நீக்குகிறது...' : 'Deleting...'}</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>{btnConfirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
