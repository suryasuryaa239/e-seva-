import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldAlert, Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, 
  Sparkles, Layers, ArrowLeft, KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@eseva.gov.in');
  const [password, setPassword] = useState('AdminSecret123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { loginAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        addToast('Admin authentication successful!', 'success');
        loginAdmin(data.admin, data.token);
        navigate('/admin');
      } else {
        addToast(data.error || 'Admin login failed', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Server connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('admin@eseva.gov.in');
  const [forgotToken, setForgotToken] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleAdminForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      if (forgotStep === 1) {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail })
        });
        const data = await res.json();
        if (res.ok) {
          if (data.reset_token) setForgotToken(data.reset_token);
          addToast('Password reset token generated!', 'success');
          setForgotStep(2);
        } else {
          addToast(data.error || 'Failed to request reset', 'error');
        }
      } else if (forgotStep === 2) {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reset_token: forgotToken, new_password: newAdminPass })
        });
        const data = await res.json();
        if (res.ok) {
          addToast('Admin password updated successfully! Please log in.', 'success');
          setShowForgotModal(false);
          setForgotStep(1);
          setPassword(newAdminPass);
        } else {
          addToast(data.error || 'Password reset failed', 'error');
        }
      }
    } catch (err) {
      addToast('Connection error', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-orange-500 selection:text-white">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Main Split-Screen Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
          
          {/* Left Panel - Brand & Visual Showcase (Navy Blue) */}
          <div className="md:col-span-5 bg-[#0b192c] text-white p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
              <Link to="/" className="inline-flex items-center space-x-2 text-slate-300 hover:text-white transition-colors text-xs font-bold">
                <ArrowLeft className="w-4 h-4 text-orange-400" />
                <span>Back to Portal Website</span>
              </Link>

              <div className="space-y-3 pt-4">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-800 text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-700">
                  <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
                  <span>ADMIN PORTAL COCKPIT</span>
                </span>
                
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                  Manage Services. Manage Applications. Manage Support.
                </h2>
                
                <p className="text-slate-300 text-xs leading-relaxed">
                  Secure administration dashboard for authorized E-Seva desk officers, verification personnel, and system operators.
                </p>
              </div>
            </div>

            {/* Switch to Citizen Login CTA */}
            <div className="relative z-10 pt-8 pb-4 space-y-4">
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <div className="flex items-center space-x-2">
                    <KeyRound className="w-4 h-4 text-orange-400" />
                    <span>Citizen Portal User?</span>
                  </div>
                  <Link to="/login" className="text-xs font-bold text-orange-400 hover:underline">
                    Citizen Login →
                  </Link>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  If you are a citizen looking to apply for certificates or track applications, please use the Citizen Gateway.
                </p>
              </div>

              <div className="text-[10px] text-slate-400 font-mono text-center sm:text-left">
                E-Seva Core Operations v2.4 • Confidential Access
              </div>
            </div>
          </div>

          {/* Right Panel - Admin Form Card */}
          <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6">
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100 inline-block">
                  ADMINISTRATIVE AUTHENTICATION
                </span>
                <Link to="/login" className="text-xs font-bold text-[#0b192c] hover:text-orange-600 underline">
                  Citizen Login Portal
                </Link>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Official Admin Sign-In
              </h1>
              <p className="text-xs text-slate-500">
                Sign in using your authorized administrator credentials to manage portal operations.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">
                  Admin Email Address <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@eseva.gov.in"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Secret Password <span className="text-orange-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                  >
                    Forgot Admin Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-3 text-xs font-semibold text-slate-900 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Default Admin Credentials Helper Box */}
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
                <div className="font-extrabold text-amber-900 flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                  <span>System Administrator Credentials:</span>
                </div>
                <div className="font-mono text-[11px] text-amber-900 space-y-0.5 pl-5">
                  <div>Email: <strong className="text-slate-950">admin@eseva.gov.in</strong></div>
                  <div>Password: <strong className="text-slate-950">AdminSecret123</strong></div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer group"
              >
                <span>{loading ? 'Authenticating Admin Session...' : 'Sign In to Cockpit'}</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Security Notice & Citizen Portal Switcher */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Authorized administrators only</span>
              </span>

              <Link to="/login" className="text-[#0b192c] hover:text-orange-600 font-extrabold transition-colors">
                Citizen Portal Login →
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* Forgot Admin Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-slate-900 text-base">
                    Reset Admin Password
                  </h4>
                  <p className="text-xs text-slate-500">
                    Recover your system administrator account credentials
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 transition-colors cursor-pointer text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdminForgotSubmit} className="space-y-3.5 text-xs">
              {forgotStep === 1 ? (
                <>
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-800 block">
                      Admin Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="admin@eseva.gov.in"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                    Enter your registered administrator email to receive a password reset token.
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-800 block">
                      Verification Reset Token *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Paste reset token..."
                      value={forgotToken}
                      onChange={(e) => setForgotToken(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-mono outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-800 block">
                      New Secret Password *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••••••"
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:border-orange-500"
                    />
                  </div>
                </>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-5 py-2.5 bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {forgotLoading
                    ? 'Processing...'
                    : forgotStep === 1
                    ? 'Request Reset Token'
                    : 'Update Password & Save'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}

