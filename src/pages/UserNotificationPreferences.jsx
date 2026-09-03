import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Mail, Smartphone, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function UserNotificationPreferences() {
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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Link to="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
            <span>/</span>
            <Link to="/profile" className="hover:text-indigo-600">Profile</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">Notification Settings</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-600" /> Communication Preferences
          </h1>
          <p className="text-xs text-slate-500">Manage how you receive application status alerts and digital certificate notices</p>
        </div>

        {saved && (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold shadow">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Notification preferences updated successfully!</span>
          </div>
        )}

        {/* Preferences Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">

          <div className="divide-y divide-slate-100">
            {/* In-App */}
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">In-App Portal Notifications</h4>
                  <p className="text-[11px] text-slate-500">Receive alerts in header notification bell & dashboard feed</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.inApp}
                onChange={() => handleToggle('inApp')}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            {/* Email */}
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Email Notifications</h4>
                  <p className="text-[11px] text-slate-500">Receive official receipts & digital certificates via registered email</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.email}
                onChange={() => handleToggle('email')}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            {/* SMS */}
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">SMS Alerts</h4>
                  <p className="text-[11px] text-slate-500">Instant SMS dispatch for application status changes & document queries</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.sms}
                onChange={() => handleToggle('sms')}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            {/* Messaging / WhatsApp */}
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">WhatsApp / Messaging Channel</h4>
                  <p className="text-[11px] text-slate-500">Receive direct WhatsApp messaging updates on service verification</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.messaging}
                onChange={() => handleToggle('messaging')}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors"
            >
              Save Communication Preferences
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
