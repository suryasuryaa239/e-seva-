import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  User, Lock, Mail, Phone, ShieldCheck, ArrowRight, Eye, EyeOff,
  RefreshCw, Sparkles, Clock
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

        addToast(isRegister ? 'Registration successful! Welcome to E-Seva.' : 'Logged in successfully!', 'success');
        loginUser(data.user, data.token);
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get('redirect') || '/dashboard';
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

              addToast('Logged in successfully!', 'success');
              const searchParams = new URLSearchParams(window.location.search);
              const redirect = searchParams.get('redirect') || '/dashboard';
              navigate(redirect);
              return;
            }
          } catch (localErr) {
            console.warn('Fallback login error:', localErr);
          }
        }

        addToast(data.error || 'Authentication failed', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Server connection error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-75px)] bg-slate-50 py-6 sm:py-10 px-4 sm:px-6 font-sans selection:bg-orange-500 selection:text-white flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">

        {/* LEFT PANEL: BRANDING & FEATURES (DESKTOP) */}
        <div className="lg:col-span-5 bg-[#0b192c] p-6 text-white relative overflow-hidden flex flex-col justify-between hidden lg:flex border-r border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-4 relative z-10">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-black text-base flex items-center justify-center shadow-md">
                eS
              </div>
              <span className="font-heading font-black text-xl tracking-tight text-white group-hover:text-orange-400 transition-colors">
                {t.portalName || 'E-Seva Portal'}
              </span>
            </Link>

            <div className="space-y-1.5">
              <span className="inline-block text-[9px] font-black text-orange-400 uppercase tracking-widest bg-slate-800/80 border border-slate-700 px-2.5 py-0.5 rounded-full">
                {lang === 'ta' ? 'குடிமக்கள் சேவை இணையதளம்' : 'CITIZEN SERVICES GATEWAY'}
              </span>
              <h2 className="text-xl font-black text-white leading-tight">
                {isRegister 
                  ? (lang === 'ta' ? 'மில்லியன் கணக்கான குடிமக்களுடன் இணையுங்கள்' : 'Join Millions of Empowered Citizens') 
                  : (lang === 'ta' ? 'டிஜிட்டல் அரசு சேவைகளை 24/7 அணுகுங்கள்' : 'Access Digital Government Services 24/7')}
              </h2>
              <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                {lang === 'ta' ? 'சான்றிதழ்களுக்கு விண்ணப்பிக்கவும், நிகழ்நேரத்தில் சரிபார்ப்பைக் கண்காணிக்கவும்.' : 'Apply for certificates, track verification in real time, and download signed documents.'}
              </p>
            </div>
          </div>

          {/* Feature Bullets */}
          <div className="space-y-3 py-3 relative z-10">
            <div className="flex items-start space-x-2.5">
              <div className="w-6 h-6 rounded-lg bg-slate-800 text-orange-400 flex items-center justify-center shrink-0 border border-slate-700">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-100">{lang === 'ta' ? 'வேகமான ஆன்லைன் சேவை' : 'Fast Online Processing'}</h4>
                <p className="text-[10px] text-slate-400">{lang === 'ta' ? 'வரிசையில் நிற்காமல் விரைவான டிஜிட்டல் விண்ணப்பம்.' : 'Streamlined digital submissions.'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="w-6 h-6 rounded-lg bg-slate-800 text-orange-400 flex items-center justify-center shrink-0 border border-slate-700">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-100">{lang === 'ta' ? 'நிகழ்நேர தணிக்கைக் காலவரிசை' : 'Real-Time Audit Timeline'}</h4>
                <p className="text-[10px] text-slate-400">{lang === 'ta' ? 'அதிகாரிகளின் குறிப்புகள் மற்றும் நிலைகளை கண்காணிக்கவும்.' : 'Track verification stages instantly.'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="w-6 h-6 rounded-lg bg-slate-800 text-orange-400 flex items-center justify-center shrink-0 border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-100">{lang === 'ta' ? 'பாதுகாக்கப்பட்ட சேவை' : 'Verified Security'}</h4>
                <p className="text-[10px] text-slate-400">{lang === 'ta' ? 'பாதுகாப்பான அணுகல்.' : 'Encrypted portal access.'}</p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 relative z-10">
            <span>© 2026 E-Seva Platform</span>
          </div>
        </div>

        {/* RIGHT PANEL: CITIZEN USER AUTHENTICATION FORM */}
        <div className="lg:col-span-7 p-6 flex flex-col justify-center space-y-3.5">

          <div className="space-y-1">
            <span className="inline-block text-[9px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-2.5 py-0.5 rounded-full">
              {isRegister ? t.createAccountTitle : t.welcomeBack}
            </span>

            <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
              {isRegister ? t.createAccountTitle : t.loginToAccount}
            </h2>

            <p className="text-xs text-slate-500 font-normal">
              {isRegister
                ? (lang === 'ta' ? 'டிஜிட்டல் சேவைகளுக்கு விண்ணப்பிக்க பதிவு செய்யவும்.' : 'Register to apply for digital services and track your applications.')
                : (lang === 'ta' ? 'உங்கள் விண்ணப்பங்களை அணுக மற்றும் சேவைகளை நிர்வகிக்க உள்நுழையவும்.' : 'Access your applications and manage your digital services.')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister && (
              <>
                <div>
                  <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider block mb-1">
                    {t.fullNameLabel || 'Full Name'} <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Karthik Subramanian"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl pl-9 pr-3 py-2.5 border border-slate-300 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider block mb-1">
                    {t.mobileLabel || 'Mobile Number'} <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl pl-9 pr-3 py-2.5 border border-slate-300 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider block mb-1">
                    Aadhaar Number ({lang === 'ta' ? 'விருப்பத்திற்குரியது' : 'Optional'})
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="12-digit Aadhaar number"
                      value={formData.aadhaar_no}
                      onChange={(e) => setFormData({ ...formData, aadhaar_no: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 text-xs font-mono font-semibold rounded-xl pl-9 pr-3 py-2.5 border border-slate-300 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider block mb-1">
                {isRegister
                  ? (t.emailLabel || t.authEmail || 'Email Address')
                  : (lang === 'ta' ? 'மின்னஞ்சல் / மொபைல் எண் / ஆதார் எண்' : 'Email / Mobile / Aadhaar Number')} <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={isRegister ? "email" : "text"}
                  required
                  placeholder={isRegister ? "user@eseva.gov.in" : (lang === 'ta' ? 'மின்னஞ்சல், மொபைல் எண் அல்லது ஆதார் எண்' : 'Email, 10-digit mobile or Aadhaar')}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl pl-9 pr-3 py-2.5 border border-slate-300 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider block">
                  {t.passwordLabel || t.authPassword || 'Password'} <span className="text-orange-500">*</span>
                </label>
                {!isRegister && (
                  <Link to="/forgot-password" className="text-[11px] font-bold text-orange-600 hover:text-orange-700 transition-colors">
                    {t.authForgotPass || 'Forgot Password?'}
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
                  className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl pl-9 pr-9 py-2.5 border border-slate-300 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
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

            {/* DEMO CITIZEN CREDENTIALS CALLOUT */}
            {!isRegister && (
              <div className="bg-amber-50/90 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-0.5">
                <span className="font-extrabold text-[10px] uppercase tracking-wider block text-amber-900">
                  💡 Demo Citizen Credentials:
                </span>
                <p className="text-slate-700 font-mono text-[10px]">
                  Email: <strong className="text-slate-900">user@eseva.gov.in</strong> | Pass: <strong className="text-slate-900">Password123</strong>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-black text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer ${
                isRegister
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-[#0b192c] hover:bg-orange-600 text-white'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-400" />
                  <span>{t.msgPleaseWait || 'Please wait'}...</span>
                </>
              ) : (
                <>
                  <span>{isRegister ? (t.authCreateAccount || t.registerBtn || 'Create Account') : (t.loginBtn || 'Sign In')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
            {isRegister ? (
              <span>
                {t.authAlreadyHaveAccount || 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="text-[#0b192c] font-black hover:text-orange-600 underline cursor-pointer ml-1"
                >
                  {t.loginBtn || 'Sign In'}
                </button>
              </span>
            ) : (
              <span>
                {t.authDontHaveAccount || "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="text-[#0b192c] font-black hover:text-orange-600 underline cursor-pointer ml-1"
                >
                  {t.authCreateAccount || 'Create Account'}
                </button>
              </span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
