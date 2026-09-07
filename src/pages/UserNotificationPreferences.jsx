import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Mail, Smartphone, MessageSquare, ShieldCheck, CheckCircle2, Save } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';

export default function UserNotificationPreferences() {
  const { lang, t } = useLanguage();
  const [prefs, setPrefs] = useState({ inApp: true, email: true, sms: true, messaging: true });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchPrefs();
  }, []);

  const fetchPrefs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/profile/notification-preferences', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPrefs(data);
      }
    } catch (e) {} finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/profile/notification-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(prefs)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-orange-500 selection:text-white">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Breadcrumb */}
        <Breadcrumbs items={[
          { label: lang === 'ta' ? 'பயனர் சுயவிவரம்' : 'User Profile', path: '/profile' },
          { label: t.notificationsTitle || 'Notification Preferences' }
        ]} />

        {/* Navy Header Banner */}
        <div className="bg-[#0b192c] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden space-y-2">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <span className="inline-block text-[10px] sm:text-xs font-black text-orange-400 uppercase tracking-widest bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-full">
            {lang === 'ta' ? 'தொடர்பு விருப்பத்தேர்வுகள் & விழிப்பூட்டல்கள்' : 'COMMUNICATION PREFERENCES & ALERTS'}
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 tracking-tight">
            <Bell className="w-7 h-7 text-orange-400" />
            <span>{t.notificationsTitle || 'Communication Preferences'}</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            {lang === 'ta' ? 'விண்ணப்ப நிலை விழிப்பூட்டல்கள், அதிகாரி வினவல்கள் மற்றும் மின்னணு சான்றிதழ் தகவல்களை எவ்வாறு பெற விரும்புகிறீர்கள் என்பதை நிர்வகிக்கவும்.' : 'Manage how you receive application status alerts, officer queries, and digital certificate dispatches.'}
          </p>
        </div>

        {saved && (
          <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-2xl flex items-center gap-3 text-xs font-black shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{lang === 'ta' ? 'அறிவிப்பு விருப்பத்தேர்வுகள் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டன!' : 'Notification preferences updated successfully!'}</span>
          </div>
        )}

        {/* Preferences Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">

          <div className="divide-y divide-slate-100">
            {/* In-App */}
            <div className="py-4.5 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200/80 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">{lang === 'ta' ? 'போர்டல் உள் அறிவிப்புகள்' : 'In-App Portal Notifications'}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{lang === 'ta' ? 'தலைப்பு மணி ஐகான் மற்றும் முகப்புப்பலகையில் நிகழ்நேர அறிவிப்புகளைப் பெறுங்கள்' : 'Receive real-time alerts in header notification bell & dashboard feed'}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.inApp}
                onChange={() => handleToggle('inApp')}
                className="w-5 h-5 text-orange-600 rounded-lg border-slate-300 focus:ring-orange-500 cursor-pointer"
              />
            </div>

            {/* Email */}
            <div className="py-4.5 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">{lang === 'ta' ? 'மின்னஞ்சல் அறிவிப்புகள்' : 'Email Notifications'}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{lang === 'ta' ? 'பதிவு செய்யப்பட்ட மின்னஞ்சல் மூலம் அதிகாரப்பூர்வ கட்டண ரசீதுகள் மற்றும் சான்றிதழ்களைப் பெறுங்கள்' : 'Receive official payment receipts & digital certificates via registered email'}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.email}
                onChange={() => handleToggle('email')}
                className="w-5 h-5 text-orange-600 rounded-lg border-slate-300 focus:ring-orange-500 cursor-pointer"
              />
            </div>

            {/* SMS */}
            <div className="py-4.5 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">{lang === 'ta' ? 'SMS குறுஞ்செய்தி விழிப்பூட்டல்கள்' : 'SMS Alerts'}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{lang === 'ta' ? 'நிலை மாற்றங்கள் மற்றும் ஆவண வினவல்களுக்கு உடனடி SMS அறிவிப்பு' : 'Instant SMS dispatch for status changes & document queries'}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.sms}
                onChange={() => handleToggle('sms')}
                className="w-5 h-5 text-orange-600 rounded-lg border-slate-300 focus:ring-orange-500 cursor-pointer"
              />
            </div>

            {/* Messaging / WhatsApp */}
            <div className="py-4.5 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">{lang === 'ta' ? 'வாட்ஸ்அப் / செய்தி தளம்' : 'WhatsApp / Messaging Channel'}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{lang === 'ta' ? 'சேவை சரிபார்ப்பு நிலைகள் குறித்து வாட்ஸ்அப் வழியாக நேரடி அறிவிப்புகளைப் பெறுங்கள்' : 'Receive direct WhatsApp messaging updates on service verification'}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.messaging}
                onChange={() => handleToggle('messaging')}
                className="w-5 h-5 text-orange-600 rounded-lg border-slate-300 focus:ring-orange-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-[#0b192c] hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-orange-400" />
              <span>{lang === 'ta' ? 'விருப்பங்களை சேமிக்கவும்' : 'Save Preferences'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

