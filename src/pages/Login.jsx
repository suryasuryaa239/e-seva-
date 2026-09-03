import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    aadhaar_no: '',
    password: ''
  });

  const { loginUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        addToast(isRegister ? 'Registration successful!' : 'Logged in successfully!', 'success');
        loginUser(data.user, data.token);
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get('redirect') || '/dashboard';
        navigate(redirect);
      } else {
        addToast(data.error || 'Authentication failed', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Server connection error', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xl mx-auto shadow">
            eS
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-900">
            {isRegister ? 'Create Citizen Account' : 'Sign In to E-Seva Portal'}
          </h2>
          <p className="text-xs text-slate-500">
            Manage your applications, track status, and view generated receipts.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Karthik Subramanian"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Number *</label>
                <input
                  type="text"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Aadhaar Number (Optional)</label>
                <input
                  type="text"
                  placeholder="12-digit Aadhaar"
                  value={formData.aadhaar_no}
                  onChange={(e) => setFormData({ ...formData, aadhaar_no: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="user@eseva.gov.in"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-50 text-slate-900 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-50 text-slate-900 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>

          {!isRegister && (
            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-[11px] text-indigo-900">
              💡 <strong>Demo Credentials:</strong><br />
              Email: <code className="font-bold">user@eseva.gov.in</code> | Password: <code className="font-bold">Password123</code>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            {isRegister ? 'Register Account' : 'Sign In Now'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          {isRegister ? (
            <span>Already have an account? <button onClick={() => setIsRegister(false)} className="text-indigo-600 font-bold hover:underline">Sign In</button></span>
          ) : (
            <span>Don't have an account? <button onClick={() => setIsRegister(true)} className="text-indigo-600 font-bold hover:underline">Register Here</button></span>
          )}
        </div>
      </div>
    </div>
  );
}
