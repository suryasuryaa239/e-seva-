import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, Share2, Send, X, ShieldCheck, FileText, Phone, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function WhatsAppSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [shareDocModal, setShareDocModal] = useState(false);
  const [appIdInput, setAppIdInput] = useState('');
  const [userMsgInput, setUserMsgInput] = useState('');
  const location = useLocation();
  const { lang } = useLanguage();

  // Support WhatsApp Number (Configurable - User Specified 6374889944)
  const whatsappNumber = '916374889944'; 

  // Generate contextual WhatsApp message based on current page
  const getContextualChatMessage = () => {
    const currentUrl = window.location.href;
    const pagePath = location.pathname;

    if (pagePath.includes('/service/')) {
      return encodeURIComponent(`Hello E-Seva Support, I need assistance regarding this service:\n${currentUrl}`);
    } else if (pagePath.includes('/apply/')) {
      return encodeURIComponent(`Hello E-Seva Support, I am filling an application and need help.\nPage: ${currentUrl}`);
    } else if (pagePath.includes('/track')) {
      return encodeURIComponent(`Hello E-Seva Support, I want to track my application status.\nPage: ${currentUrl}`);
    } else {
      return encodeURIComponent(`Hello E-Seva Support, I have a query regarding E-Seva digital services.\nPage: ${currentUrl}`);
    }
  };

  const handleDirectChat = () => {
    const text = getContextualChatMessage();
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleSharePage = () => {
    const pageTitle = document.title || 'E-Seva Digital Portal';
    const currentUrl = window.location.href;
    const shareText = encodeURIComponent(`Check out this E-Seva digital service:\n*${pageTitle}*\n${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleSendAppInfoToWhatsApp = (e) => {
    e.preventDefault();
    if (!appIdInput.trim() && !userMsgInput.trim()) return;

    let msg = `Hello E-Seva Support,\nHere is my information:\n`;
    if (appIdInput.trim()) msg += `• *Application ID / Mobile:* ${appIdInput.trim()}\n`;
    if (userMsgInput.trim()) msg += `• *Message / Query:* ${userMsgInput.trim()}\n`;
    msg += `• *Page:* ${window.location.href}`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    setShareDocModal(false);
    setIsOpen(false);
    setAppIdInput('');
    setUserMsgInput('');
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 font-sans">
        
        {/* Toggle Button with Notification Aura */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer border-2 border-white/80"
          aria-label="WhatsApp Support & Share"
        >
          {/* Subtle Pulse Aura */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none group-hover:opacity-0" />
          
          {/* WhatsApp Icon */}
          <svg className="w-7 h-7 fill-current relative z-10" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </button>

        {/* Popover Menu Window */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-in fade-in slide-in-from-bottom-3 duration-200">
            
            {/* Header */}
            <div className="bg-[#0b192c] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0">
                  <MessageSquare className="w-4.5 h-4.5 fill-current" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs">WhatsApp E-Seva Helpdesk</h4>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Instant Support
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Options Body */}
            <div className="p-4 space-y-2.5 text-xs">
              
              {/* Option 1: Direct Support Chat */}
              <button
                onClick={handleDirectChat}
                className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 p-3 rounded-2xl flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-900 group-hover:text-emerald-700">
                      {lang === 'ta' ? 'வாட்ஸ்அப் ஆதரவு அரட்டை' : 'Chat with Support'}
                    </h5>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {lang === 'ta' ? 'நேரடி வாட்ஸ்அப் உதவி பெறுக' : 'Direct help & query clarification'}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Option 2: Share Page / Service */}
              <button
                onClick={handleSharePage}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 p-3 rounded-2xl flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-900 group-hover:text-orange-600">
                      {lang === 'ta' ? 'இந்த பக்கத்தை பகிரவும்' : 'Share This Page'}
                    </h5>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {lang === 'ta' ? 'சேவை விவரங்களை வாட்ஸ்அப்பில் பகிர' : 'Share service info via WhatsApp'}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Option 3: Share App Info / Doc Details */}
              <button
                onClick={() => {
                  setShareDocModal(true);
                  setIsOpen(false);
                }}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 p-3 rounded-2xl flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-900 group-hover:text-blue-600">
                      {lang === 'ta' ? 'விவரங்களை அனுப்பவும்' : 'Send Info / App ID'}
                    </h5>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {lang === 'ta' ? 'விண்ணப்ப எண் / கேள்விகளை அனுப்ப' : 'Share App ID or details to agent'}
                    </p>
                  </div>
                </div>
                <Send className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

            </div>

            {/* Footer Notice */}
            <div className="bg-slate-50 border-t border-slate-100 p-3 text-center">
              <span className="text-[10px] text-slate-500 font-semibold flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Official E-Seva Tamil Nadu Support Channel
              </span>
            </div>

          </div>
        )}
      </div>

      {/* Send Application Info Modal */}
      {shareDocModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-slate-900 text-base">
                    {lang === 'ta' ? 'விவரங்களை வாட்ஸ்அப்பில் அனுப்ப' : 'Share Information via WhatsApp'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {lang === 'ta' ? 'உங்கள் விண்ணப்ப எண் அல்லது கேள்வியை பதிவிடவும்' : 'Send Application ID or questions to support'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShareDocModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendAppInfoToWhatsApp} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-extrabold text-slate-800 block">
                  {lang === 'ta' ? 'விண்ணப்ப எண் / மொபைல் எண்' : 'Application ID / Mobile Number'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. ESV-2026-000001 or 9876543210"
                  value={appIdInput}
                  onChange={(e) => setAppIdInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-mono outline-none focus:border-[#25D366]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-800 block">
                  {lang === 'ta' ? 'உங்கள் கேள்வி / செய்தி' : 'Your Query / Message'}
                </label>
                <textarea
                  rows={3}
                  placeholder={lang === 'ta' ? 'உங்களுக்கு என்ன உதவி தேவை என்பதை உள்ளிடவும்...' : 'Type what assistance or document details you need...'}
                  value={userMsgInput}
                  onChange={(e) => setUserMsgInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 outline-none focus:border-[#25D366]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShareDocModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  {lang === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={!appIdInput.trim() && !userMsgInput.trim()}
                  className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{lang === 'ta' ? 'வாட்ஸ்அப்பில் அனுப்பு' : 'Open in WhatsApp'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
