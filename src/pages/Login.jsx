import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  User, Lock, Mail, Phone, ShieldCheck, ArrowRight, Eye, EyeOff,
  RefreshCw, Shield, Zap, Clock, Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { addToast } = useToast();
  const { t, lang } = useLanguage();

  const [isRegister, setIsRegister] = useState(location.pathname === '/register');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    aadhaar_no: '',
    password: ''
  });

  useEffect(() => {
    setIsRegister(location.pathname === '/register');
  }, [location.pathname]);

  const handleAutoFillDemo = () => {
    setFormData(prev => ({
      ...prev,
      email: 'user@eseva.gov.in',
      password: 'Password123'
    }));
    addToast(
      lang === 'ta'
        ? 'டெமோ பயனர் விவரங்கள் நிரப்பப்பட்டன!'
        : 'Demo citizen credentials auto-filled!',
      'info'
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    const payload = isRegister
      ? {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          aadhaar_no: formData.aadhaar_no.trim(),
          password: formData.password
        }
      : {
          email: formData.email.trim(),
          identifier: formData.email.trim(),
          password: formData.password
        };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        if (isRegister) {
          try {
            const existingLocals = JSON.parse(localStorage.getItem('eseva_registered_users') || '[]');
            const filtered = existingLocals.filter(u => u.email !== payload.email);
            filtered.push({
              id: data.user?.id || Date.now(),
              name: payload.name,
              email: payload.email,
              phone: payload.phone,
              aadhaar_no: payload.aadhaar_no,
              password: payload.password,
              token: data.token
            });
            localStorage.setItem('eseva_registered_users', JSON.stringify(filtered));
          } catch (e) {
            console.warn('LocalStorage backup error:', e);
          }
        }

        addToast(
          isRegister
            ? (lang === 'ta' ? 'பதிவு முடிந்தது! இ-சேவைக்கு வரவேற்கிறோம்.' : 'Registration successful! Welcome to E-Seva.')
            : (lang === 'ta' ? 'வெற்றிகரமாக உள்நுழைந்தீர்கள்!' : 'Logged in successfully!'),
          'success'
        );
        loginUser(data.user, data.token);
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = isRegister ? '/dashboard' : (searchParams.get('redirect') || '/dashboard');
        navigate(redirect);
      } else {
        // Fallback for local registered users if server restart
        if (!isRegister) {
          try {
            const existingLocals = JSON.parse(localStorage.getItem('eseva_registered_users') || '[]');
            const loginId = payload.email.trim().toLowerCase();
            const loginDigits = loginId.replace(/\D/g, '');

            const matchedLocal = existingLocals.find(u =>
              (u.email && u.email.toLowerCase() === loginId) ||
              (u.phone && (u.phone.trim() === loginId || (loginDigits.length >= 10 && u.phone.replace(/\D/g, '') === loginDigits))) ||
              (u.aadhaar_no && (u.aadhaar_no.trim() === loginId || (loginDigits.length >= 10 && u.aadhaar_no.replace(/\D/g, '') === loginDigits)))
            );

            if (matchedLocal && matchedLocal.password === payload.password) {
              fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: matchedLocal.name,
                  email: matchedLocal.email,
                  phone: matchedLocal.phone,
                  aadhaar_no: matchedLocal.aadhaar_no,
                  password: matchedLocal.password
                })
              }).then(r => r.json()).then(syncData => {
                const userToUse = syncData.user || { id: matchedLocal.id, name: matchedLocal.name, email: matchedLocal.email, phone: matchedLocal.phone, aadhaar_no: matchedLocal.aadhaar_no };
                const tokenToUse = syncData.token || matchedLocal.token || ('token_' + Date.now());
                loginUser(userToUse, tokenToUse);
              }).catch(() => {
                loginUser({ id: matchedLocal.id, name: matchedLocal.name, email: matchedLocal.email, phone: matchedLocal.phone, aadhaar_no: matchedLocal.aadhaar_no }, matchedLocal.token || ('token_' + Date.now()));
              });

              addToast(lang === 'ta' ? 'வெற்றிகரமாக உள்நுழைந்தீர்கள்!' : 'Logged in successfully!', 'success');
              navigate('/dashboard');
              return;
            }
          } catch (localErr) {
            console.warn('Fallback login error:', localErr);
          }
        }

        addToast(data.error || (lang === 'ta' ? 'அனுமதி தோல்வி' : 'Authentication failed'), 'error');
      }
    } catch (err) {
      console.error(err);
      addToast(lang === 'ta' ? 'சேவையக இணைப்பு பிழை.' : 'Server connection error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-100/80 py-4 sm:py-6 px-3 sm:px-4 font-sans selection:bg-orange-500 selection:text-white flex items-center justify-center overflow-hidden">
      <div className="max-w-3xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">

        {/* LEFT PANEL: BRANDING & GOVT TRUST BADGES (DESKTOP) */}
        <div className="lg:col-span-5 bg-[#0f172a] p-5 lg:p-6 text-white relative overflow-hidden flex flex-col justify-between hidden lg:flex border-r border-slate-800">
          
          <div className="space-y-4 relative z-10">
            {/* Header Brand Badge */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                eS
              </div>
              <div>
                <span className="font-heading font-black text-lg tracking-tight text-white block leading-none">
                  {t.portalName || 'E-Seva TN'}
                </span>
                <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase block mt-0.5">
                  Govt of Tamil Nadu
                </span>
              </div>
            </Link>

            <div className="space-y-2 pt-1">
              <div className="inline-flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700/80 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-orange-400" />
                <span className="text-[9px] font-extrabold text-orange-300 uppercase tracking-wider">
                  {lang === 'ta' ? 'பாதுகாப்பான சேவை' : 'OFFICIAL CITIZEN PORTAL'}
                </span>
              </div>

              <h2 className="text-xl font-black text-white leading-snug tracking-tight">
                {isRegister 
                  ? (lang === 'ta' ? 'புதிய குடிமகன் கணக்கு' : 'Empowering Citizens with Digital Access') 
                  : (lang === 'ta' ? 'டிஜிட்டல் அரசு சேவைகள் 24/7' : 'Access Digital Govt Services 24/7')}
              </h2>

              <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                {lang === 'ta' 
                  ? 'சான்றிதழ்களுக்கு விண்ணப்பிக்கவும், சரிபார்ப்பைக் கண்காணிக்கவும்.' 
                  : 'Apply for certificates, track verifications, and download official documents.'}
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3 py-3 relative z-10 border-t border-b border-slate-800/80 my-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-orange-400 flex items-center justify-center shrink-0 border border-slate-700/60">
                <Zap className="w-3.5 h-3.5 text-orange-400" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-100">{lang === 'ta' ? 'விரைவான சேவை விண்ணப்பம்' : 'Instant Online Application'}</h4>
                <p className="text-[10px] text-slate-400">{lang === 'ta' ? 'நேரடியாக விண்ணப்பிக்கவும்.' : 'Paperless digital submissions.'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-orange-400 flex items-center justify-center shrink-0 border border-slate-700/60">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-100">{lang === 'ta' ? 'நிகழ்நேர கண்காணிப்பு' : 'Live Status Tracking'}</h4>
                <p className="text-[10px] text-slate-400">{lang === 'ta' ? 'நிலைகளை உடனுக்குடன் அறியவும்.' : 'Track verification stage in real time.'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-orange-400 flex items-center justify-center shrink-0 border border-slate-700/60">
                <Shield className="w-3.5 h-3.5 text-orange-400" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-100">{lang === 'ta' ? 'பாதுகாக்கப்பட்ட முறை' : 'Bank-Grade Security'}</h4>
                <p className="text-[10px] text-slate-400">{lang === 'ta' ? 'பாதுகாப்பான தரவு பரிமாற்றம்.' : 'Encrypted official data safety.'}</p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-[10px] text-slate-400 relative z-10 flex items-center justify-between">
            <span>© 2026 E-Seva</span>
            <span className="font-semibold text-slate-300">TNeGA Certified</span>
          </div>
        </div>

        {/* RIGHT PANEL: CLEAN COMPACT FORM (FIT WITHOUT SCROLLING) */}
        <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-center space-y-4">

          {/* Header & Mode Switcher Pill */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/70 px-2.5 py-0.5 rounded-full inline-block mb-1">
                {isRegister ? (lang === 'ta' ? 'புதிய கணக்கு' : 'REGISTER ACCOUNT') : (lang === 'ta' ? 'வரவேற்கிறோம்' : 'CITIZEN LOGIN')}
              </span>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                {isRegister 
                  ? (lang === 'ta' ? 'கணக்கை உருவாக்குங்கள்' : 'Create Your Account') 
                  : (lang === 'ta' ? 'உள்நுழையவும்' : 'Sign in to E-Seva')}
              </h2>
            </div>

            {/* Quick Toggle Button */}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-[11px] font-bold text-[#0f172a] hover:text-orange-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
            >
              {isRegister ? (lang === 'ta' ? 'உள்நுழைவு' : 'Sign In') : (lang === 'ta' ? 'பதிவு செய்ய' : 'Register')}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      {t.fullNameLabel || (lang === 'ta' ? 'முழு பெயர்' : 'Full Name')} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Karthik Subramanian"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-50/70 text-slate-900 text-xs font-medium rounded-lg pl-9 pr-3 py-2 border border-slate-200 focus:border-[#0f172a] focus:bg-white focus:ring-2 focus:ring-[#0f172a]/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      {t.mobileLabel || (lang === 'ta' ? 'கைபேசி எண்' : 'Mobile Number')} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50/70 text-slate-900 text-xs font-medium rounded-lg pl-9 pr-3 py-2 border border-slate-200 focus:border-[#0f172a] focus:bg-white focus:ring-2 focus:ring-[#0f172a]/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      {t.emailLabel || t.authEmail || (lang === 'ta' ? 'மின்னஞ்சல்' : 'Email Address')} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="user@eseva.gov.in"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50/70 text-slate-900 text-xs font-medium rounded-lg pl-9 pr-3 py-2 border border-slate-200 focus:border-[#0f172a] focus:bg-white focus:ring-2 focus:ring-[#0f172a]/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      {lang === 'ta' ? 'ஆதார் எண்' : 'Aadhaar'} ({lang === 'ta' ? 'விருப்பம்' : 'Optional'})
                    </label>
                    <div className="relative">
                      <ShieldCheck className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="12-digit Aadhaar"
                        value={formData.aadhaar_no}
                        onChange={(e) => setFormData({ ...formData, aadhaar_no: e.target.value })}
                        className="w-full bg-slate-50/70 text-slate-900 text-xs font-mono font-medium rounded-lg pl-9 pr-3 py-2 border border-slate-200 focus:border-[#0f172a] focus:bg-white focus:ring-2 focus:ring-[#0f172a]/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {lang === 'ta' ? 'மின்னஞ்சல் / மொபைல் / ஆதார் எண்' : 'Email / Mobile / Aadhaar Number'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder={lang === 'ta' ? 'மின்னஞ்சல் அல்லது மொபைல் எண்' : 'Email, 10-digit mobile or Aadhaar'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50/70 text-slate-900 text-xs font-medium rounded-lg pl-9 pr-3 py-2.5 border border-slate-200 focus:border-[#0f172a] focus:bg-white focus:ring-2 focus:ring-[#0f172a]/10 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  {t.passwordLabel || t.authPassword || (lang === 'ta' ? 'கடவுச்சொல்' : 'Password')} <span className="text-rose-500">*</span>
                </label>
                {!isRegister && (
                  <Link to="/forgot-password" className="text-[11px] font-bold text-orange-600 hover:text-orange-700 transition-colors">
                    {t.authForgotPass || (lang === 'ta' ? 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?' : 'Forgot Password?')}
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-50/70 text-slate-900 text-xs font-medium rounded-lg pl-9 pr-9 py-2 border border-slate-200 focus:border-[#0f172a] focus:bg-white focus:ring-2 focus:ring-[#0f172a]/10 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* DEMO CITIZEN CREDENTIALS QUICK FILL BAR */}
            {!isRegister && (
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-600">
                  <Info className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block text-[10px]">{lang === 'ta' ? 'டெமோ பயனர்:' : 'Demo Citizen:'}</span>
                    <span className="font-mono text-[10px] text-slate-500">user@eseva.gov.in</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAutoFillDemo}
                  className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/80 rounded-lg font-bold text-[10px] transition-colors cursor-pointer shrink-0"
                >
                  {lang === 'ta' ? 'விவரங்களை நிரப்பு' : 'Fill Demo Details'}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-extrabold text-xs py-2.5 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer ${
                isRegister
                  ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                  : 'bg-[#0f172a] hover:bg-slate-800 text-white shadow-slate-900/20'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-400" />
                  <span>{t.msgPleaseWait || (lang === 'ta' ? 'காத்திருக்கவும்...' : 'Authenticating...')}</span>
                </>
              ) : (
                <>
                  <span>{isRegister ? (t.authCreateAccount || (lang === 'ta' ? 'கணக்கை உருவாக்கு' : 'Create Account')) : (t.loginBtn || (lang === 'ta' ? 'உள்நுழைவு' : 'Sign In'))}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Navigation Link */}
          <div className="text-center text-xs text-slate-500 pt-1.5 border-t border-slate-100">
            {isRegister ? (
              <span>
                {t.authAlreadyHaveAccount || (lang === 'ta' ? 'ஏற்கனவே கணக்கு உள்ளதா?' : 'Already have an account?')}{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="text-[#0f172a] font-extrabold hover:text-orange-600 underline cursor-pointer ml-1"
                >
                  {t.loginBtn || (lang === 'ta' ? 'உள்நுழைவு' : 'Sign In')}
                </button>
              </span>
            ) : (
              <span>
                {t.authDontHaveAccount || (lang === 'ta' ? 'புதிய பயனரா?' : "Don't have an account?")}{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="text-[#0f172a] font-extrabold hover:text-orange-600 underline cursor-pointer ml-1"
                >
                  {t.authCreateAccount || (lang === 'ta' ? 'கணக்கை உருவாக்குங்கள்' : 'Create Account')}
                </button>
              </span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
