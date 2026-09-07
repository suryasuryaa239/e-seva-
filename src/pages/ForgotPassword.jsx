import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, ArrowLeft, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ForgotPassword() {
  const { lang, t } = useLanguage();
  const [step, setStep] = useState(1); // 1: Request Email, 2: Reset Token & Password
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (lang === 'ta' ? 'கோரிக்கை தோல்வியடைந்தது' : 'Request failed'));

      setMessage(data.message);
      if (data.reset_token) {
        setResetToken(data.reset_token);
      }
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError(t.passwordsDoNotMatchErr || (lang === 'ta' ? 'கடவுச்சொற்கள் பொருந்தவில்லை' : 'Passwords do not match'));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset_token: resetToken, new_password: newPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (lang === 'ta' ? 'கடவுச்சொல் மீட்டமைப்பு தோல்வியடைந்தது' : 'Password reset failed'));

      setMessage(data.message);
      setStep(3); // Success step
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 flex items-center justify-center font-sans selection:bg-orange-500 selection:text-white">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto border border-orange-100">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">{t.forgotPasswordTitle}</h2>
          <p className="text-xs text-slate-500">
            {step === 1 ? t.forgotPasswordDesc : (lang === 'ta' ? 'மீட்டமைப்பு டோக்கன் மற்றும் புதிய கடவுச்சொல்லை உள்ளிடவும்.' : 'Enter your reset token and new password.')}
          </p>
        </div>

        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestToken} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t.emailAddressLabel}</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pl-10 text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#0b192c] outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0b192c] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              {loading ? (lang === 'ta' ? 'கோரிக்கை அனுப்பப்படுகிறது...' : 'Sending Request...') : t.sendResetLinkBtn}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{lang === 'ta' ? 'மீட்டமைப்பு டோக்கன்' : 'Reset Verification Token'}</label>
              <input
                type="text"
                required
                value={resetToken}
                onChange={e => setResetToken(e.target.value)}
                placeholder={lang === 'ta' ? 'டோக்கனை ஒட்டவும்' : 'Paste token or check system response'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:border-[#0b192c] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{lang === 'ta' ? 'புதிய கடவுச்சொல்' : 'New Password'}</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#0b192c] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t.confirmPasswordLabel}</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#0b192c] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              {loading ? (lang === 'ta' ? 'கடவுச்சொல் புதுப்பிக்கப்படுகிறது...' : 'Updating Password...') : (lang === 'ta' ? 'கடவுச்சொல்லை மீட்டமைக்கவும்' : 'Reset Password & Save')}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center space-y-4 pt-2">
            <Link
              to="/login"
              className="inline-block w-full py-3 bg-[#0b192c] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-colors text-center"
            >
              {t.loginBtn}
            </Link>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 text-center">
          <Link to="/login" className="text-xs font-bold text-orange-600 hover:underline inline-flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.backToLoginLink}</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
