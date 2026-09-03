import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Clock, CheckCircle2, AlertCircle, ArrowRight, 
  Sparkles, UserCheck, PlusCircle, Search, User, ShieldCheck, FileClock, ChevronRight
} from 'lucide-react';

const STATUS_BADGES = {
  DRAFT: 'bg-amber-100 text-amber-900 border-amber-300',
  SUBMITTED: 'bg-blue-100 text-blue-900 border-blue-300',
  Pending: 'bg-yellow-100 text-yellow-900 border-yellow-300',
  UNDER_REVIEW: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  Processing: 'bg-purple-100 text-purple-900 border-purple-300',
  PROCESSING: 'bg-purple-100 text-purple-900 border-purple-300',
  Approved: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  APPROVED: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  Completed: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  COMPLETED: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  Rejected: 'bg-rose-100 text-rose-900 border-rose-300',
  REJECTED: 'bg-rose-100 text-rose-900 border-rose-300'
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login?redirect=/dashboard');
        return;
      }

      // Fetch User Info
      const userRes = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!userRes.ok) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const userData = await userRes.json();
      setUser(userData);

      // Fetch User Applications
      const appRes = await fetch('/api/applications/my', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (appRes.ok) {
        const appData = await appRes.json();
        setApplications(appData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center font-sans">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-sm w-full space-y-4 border border-slate-200">
          <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium text-xs">Loading citizen dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalCount = applications.length;
  const draftCount = applications.filter(a => a.status === 'DRAFT').length;
  const activeCount = applications.filter(a => ['SUBMITTED', 'Pending', 'UNDER_REVIEW', 'Processing', 'PROCESSING'].includes(a.status)).length;
  const completedCount = applications.filter(a => ['Approved', 'APPROVED', 'Completed', 'COMPLETED'].includes(a.status)).length;

  const recentApps = applications.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-600 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Welcome Header Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-blue-800">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-800/80 text-blue-200 text-xs font-bold rounded-full border border-blue-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Citizen Account</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, <span className="text-amber-400">{user?.name || 'Citizen'}</span>!
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-xl font-normal">
              Track your service submissions, resume saved draft forms, and manage your account details in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/services"
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow transition-all flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Apply for New Service</span>
            </Link>

            <Link
              to="/my-applications"
              className="px-5 py-3 bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors border border-blue-800 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>My Applications</span>
            </Link>
          </div>
        </div>

        {/* 4 Stat Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Submitted</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{totalCount}</div>
            <p className="text-[11px] text-slate-500 font-medium">Applications in DB</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Saved Drafts</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <FileClock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-700">{draftCount}</div>
            <p className="text-[11px] text-slate-500 font-medium">Form progress saved</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Active Processing</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-blue-900">{activeCount}</div>
            <p className="text-[11px] text-slate-500 font-medium">Under desk verification</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Completed / Approved</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-700">{completedCount}</div>
            <p className="text-[11px] text-slate-500 font-medium">Successfully issued</p>
          </div>
        </div>

        {/* Quick Action Cards Grid */}
        <div className="space-y-3">
          <h3 className="text-base font-extrabold text-slate-900">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <Link
              to="/services"
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-900 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center mb-3 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Apply for Service</h4>
              <p className="text-xs text-slate-500 mt-1 font-normal">Browse Aadhaar, Income, Community & Certificate services</p>
            </Link>

            <Link
              to="/track"
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-900 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Track Application</h4>
              <p className="text-xs text-slate-500 mt-1 font-normal">Check real-time desk verification status using Application ID</p>
            </Link>

            <Link
              to="/my-applications"
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-900 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">My Applications</h4>
              <p className="text-xs text-slate-500 mt-1 font-normal">View full details, history timeline & download receipts</p>
            </Link>

            <Link
              to="/profile"
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-900 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">My Profile</h4>
              <p className="text-xs text-slate-500 mt-1 font-normal">Manage contact info, address & account security</p>
            </Link>

          </div>
        </div>

        {/* Recent Applications Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Recent Applications</h3>
              <p className="text-xs text-slate-500">Your latest 5 service submissions</p>
            </div>

            <Link
              to="/my-applications"
              className="text-xs font-bold text-blue-900 hover:underline flex items-center space-x-1"
            >
              <span>View All Applications</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recentApps.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">No applications submitted yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our service catalog to apply for Aadhaar updates, certificates, and government services.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-900 text-white font-bold text-xs rounded-xl hover:bg-blue-950"
              >
                <span>Explore Services Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Application ID</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Applied Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentApps.map((app) => {
                    const badgeClass = STATUS_BADGES[app.status] || STATUS_BADGES.SUBMITTED;
                    const isDraft = app.status === 'DRAFT';

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                          {app.application_number}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {app.service_name}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(app.created_at || app.submitted_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeClass}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isDraft ? (
                            <Link
                              to={`/apply/${app.service_id}?draftId=${app.id}`}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-lg text-[11px]"
                            >
                              Resume Draft
                            </Link>
                          ) : (
                            <Link
                              to={`/my-applications/${app.id}`}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-[11px]"
                            >
                              View Details
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
