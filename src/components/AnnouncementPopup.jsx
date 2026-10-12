import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, ArrowRight, ExternalLink, BellRing, CheckCircle2 } from 'lucide-react';

export default function AnnouncementPopup({ 
  previewMode = false, 
  previewData = null, 
  onClosePreview = null 
}) {
  const navigate = useNavigate();
  const [popup, setPopup] = useState(previewData || null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(!previewMode);

  // If in preview mode, react to previewData changes
  useEffect(() => {
    if (previewMode && previewData) {
      setPopup(previewData);
      setIsOpen(true);
      setLoading(false);
      return;
    }

    if (!previewMode) {
      checkAndFetchPopup();
    }
  }, [previewMode, previewData]);

  const checkAndFetchPopup = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/popup-updates/active');
      if (!res.ok) return;

      const data = await res.json();
      if (!data || !data.id || (data.status && data.status.toLowerCase() !== 'active')) {
        setIsOpen(false);
        return;
      }

      setPopup(data);

      // Unique key based on ID and update timestamp so any admin update triggers a fresh popup
      const popupKey = `eseva_popup_seen_${data.id}_${data.updated_at || data.created_at || 'v1'}`;
      const alreadySeen = sessionStorage.getItem(popupKey);

      if (!alreadySeen) {
        // Small delay for smooth entry after page load/login transition
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch (err) {
      console.warn('Could not fetch announcement popup:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    if (previewMode && onClosePreview) {
      onClosePreview();
      return;
    }
    if (popup) {
      const popupKey = `eseva_popup_seen_${popup.id}_${popup.updated_at || popup.created_at || 'v1'}`;
      sessionStorage.setItem(popupKey, 'true');
    }
  };

  const handleActionClick = () => {
    handleDismiss();
    if (previewMode) return;

    const targetUrl = (popup?.button_url || '/services').trim();
    if (!targetUrl) return;

    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate(targetUrl);
    }
  };

  if (!isOpen || !popup) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleDismiss();
      }}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Background Glow */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-amber-400 to-[#0b192c]" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          type="button"
          aria-label="Close Announcement"
          className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-md hover:scale-105 active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Optional Hero Image */}
        {popup.image_url ? (
          <div className="relative w-full h-52 sm:h-60 bg-slate-950 overflow-hidden group">
            <img
              src={popup.image_url}
              alt={popup.title || 'Announcement'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent pointer-events-none" />

            {/* Badge on top of image */}
            <div className="absolute top-3.5 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wide uppercase bg-orange-600/90 text-white shadow-lg backdrop-blur-md border border-orange-400/40">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                {popup.badge_text || 'NEW UPDATE'}
              </span>
            </div>
          </div>
        ) : (
          /* Header Banner when no image */
          <div className="pt-6 px-6 pb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wide uppercase bg-orange-50 text-orange-600 border border-orange-200">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              {popup.badge_text || 'NEW UPDATE'}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className={`p-6 sm:p-7 space-y-4 ${popup.image_url ? '-mt-4 relative z-10' : ''}`}>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {popup.title || 'Official Announcement'}
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
              {popup.content || 'Stay tuned for official updates and service announcements.'}
            </p>
          </div>

          {/* Quick Notice Pill */}
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-amber-900 text-xs">
            <BellRing className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="font-medium text-[11px] leading-tight">
              Official e-Seva announcement verified for citizens.
            </span>
          </div>

          {/* Action Footer Buttons */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all hover:bg-slate-50 cursor-pointer text-center"
            >
              Dismiss
            </button>

            <button
              type="button"
              onClick={handleActionClick}
              className="w-full sm:flex-1 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-[#0b192c] hover:from-orange-600 hover:to-[#091424] text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>{popup.button_text || 'Check Now'}</span>
              {popup.button_url && (popup.button_url.startsWith('http://') || popup.button_url.startsWith('https://')) ? (
                <ExternalLink className="w-4 h-4 text-orange-200 group-hover:translate-x-0.5 transition-transform" />
              ) : (
                <ArrowRight className="w-4 h-4 text-orange-200 group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
