import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@eseva.gov.in');
  const [password, setPassword] = useState('AdminSecret123');
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

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-2xl mx-auto shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-white">
            Protected Admin Cockpit
          </h2>
          <p className="text-xs text-slate-400">
            Authorized E-Seva System Administrators Portal
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Admin Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 text-white text-sm rounded-xl px-4 py-3 border border-slate-700 focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Secret Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 text-white text-sm rounded-xl px-4 py-3 border border-slate-700 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="bg-amber-950/60 p-3 rounded-xl border border-amber-800/80 text-[11px] text-amber-200">
            🔒 <strong>Default Admin Credentials:</strong><br />
            Email: <code className="font-bold">admin@eseva.gov.in</code><br />
            Password: <code className="font-bold">AdminSecret123</code>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Access Admin Panel'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
