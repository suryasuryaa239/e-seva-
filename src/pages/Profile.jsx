import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Calendar, ShieldCheck, Save, CheckCircle2, 
  AlertCircle, Bell, Lock, FileText, Search, PlusCircle, RefreshCw, LogOut
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    aadhaar_no: '',
    address: '',
    district: '',
    state: 'Tamil Nadu',
    pincode: '',
    created_at: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login?redirect=/profile');
        return;
      }

      const res = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Failed to load profile credentials');
      }

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      setError(null);

      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
          district: profile.district,
          state: profile.state,
          pincode: profile.pincode
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update profile');
      }

      setMessage('Profile updated successfully!');
      // Update local stored user
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, name: profile.name, phone: profile.phone }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-slate-50 py-12 px-4 flex items-center justify-center font-sans">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-sm w-full space-y-4 border border-slate-200">
          <div className="w-12 h-12 border-4 border-[#0b192c] border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-700 font-extrabold text-xs">Loading citizen profile credentials...</p>
        </div>
      </div>
    );
  }

  const userInitial = profile.name ? profile.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-orange-500 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* 1. BREADCRUMB */}
        <Breadcrumbs items={[{ label: 'My Account' }, { label: 'Profile' }]} />

        {/* 2. PROFILE HEADER CARD */}
        <div className="bg-[#0b192c] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-orange-500 text-white font-black text-3xl flex items-center justify-center shadow-lg border-2 border-orange-400 shrink-0">
              {userInitial}
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 px-3 py-0.5 bg-slate-800 text-orange-400 text-[10px] font-black rounded-full border border-slate-700 uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>Verified Citizen Account</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {profile.name || 'Citizen User'}
              </h1>
              <p className="text-slate-300 text-xs font-mono">
                {profile.email} • Mobile: {profile.phone || 'Not provided'}
              </p>
              <p className="text-[11px] text-slate-400">
                Registered on: {new Date(profile.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="relative z-10 w-full sm:w-auto flex justify-center">
            <Link
              to="/profile/notifications"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl border border-slate-700 shadow-sm transition-all flex items-center space-x-2"
            >
              <Bell className="w-4 h-4 text-orange-400" />
              <span>Notification Settings</span>
            </Link>
          </div>
        </div>

        {/* FEEDBACK MESSAGES */}
        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-900 flex items-center space-x-2 shadow-xs">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-900 flex items-center space-x-2 shadow-xs">
            <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 3. PERSONAL INFORMATION FORM */}
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
          
          <div className="border-b pb-4 border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-base">Personal Information</h3>
              <p className="text-xs text-slate-500">Keep your personal contact details and residential address updated.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">
                Email Address (Read-only)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-500 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">
                Mobile Number <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">
                Aadhaar Number (Protected)
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  disabled
                  value={profile.aadhaar_no ? `XXXX-XXXX-${profile.aadhaar_no.slice(-4)}` : 'Not Linked'}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs font-mono font-semibold text-slate-500 cursor-not-allowed outline-none"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6 border-slate-100 space-y-4">
            <div>
              <h3 className="font-black text-slate-900 text-sm">Communication & Residence Address</h3>
              <p className="text-xs text-slate-500">Official address for physical certificate dispatch and local desk processing.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">
                  Street Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={profile.address}
                    onChange={e => setProfile({ ...profile, address: e.target.value })}
                    placeholder="Door No, Street name, Area"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">
                    District
                  </label>
                  <input
                    type="text"
                    value={profile.district}
                    onChange={e => setProfile({ ...profile, district: e.target.value })}
                    placeholder="e.g. Chennai, Coimbatore"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={profile.state}
                    onChange={e => setProfile({ ...profile, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">
                    Pincode
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={profile.pincode}
                    onChange={e => setProfile({ ...profile, pincode: e.target.value })}
                    placeholder="600001"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-mono font-semibold text-slate-900 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2 group cursor-pointer"
            >
              <Save className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>

        {/* 4. ACCOUNT SETTINGS & QUICK ACTIONS CARD */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/my-applications"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:border-[#0b192c] transition-all group flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0b192c] flex items-center justify-center shrink-0 group-hover:bg-[#0b192c] group-hover:text-white transition-colors">
              <FileText className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs">My Applications</h4>
              <p className="text-[11px] text-slate-500">View logged submissions</p>
            </div>
          </Link>

          <Link
            to="/track"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:border-[#0b192c] transition-all group flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors border border-amber-200">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs">Track Status</h4>
              <p className="text-[11px] text-slate-500">Check desk verification</p>
            </div>
          </Link>

          <Link
            to="/profile/notifications"
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:border-[#0b192c] transition-all group flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center shrink-0 group-hover:bg-indigo-900 group-hover:text-white transition-colors border border-indigo-200">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs">Notification Alerts</h4>
              <p className="text-[11px] text-slate-500">Manage SMS & Email alerts</p>
            </div>
          </Link>
        </div>

        {/* 5. SECURITY NOTICE */}
        <div className="bg-amber-50/90 p-4 sm:p-5 rounded-2xl border border-amber-200/90 flex items-start space-x-3 text-xs text-amber-950">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-amber-900">Keep Your Profile Information Current</h4>
            <p className="text-slate-700 leading-relaxed">
              Ensure your mobile number, email address, and residential details are accurate so officers can reach you without delay during desk verification.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

