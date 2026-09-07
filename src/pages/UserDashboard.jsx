import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Clock, CheckCircle2, AlertCircle, ArrowRight, 
  Sparkles, UserCheck, PlusCircle, Search, User, ShieldCheck, FileClock, ChevronRight,
  FolderOpen, XCircle, CreditCard, ExternalLink, HelpCircle
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useLanguage } from '../context/LanguageContext';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
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
        setApplications(appData || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-slate-50 py-12 px-4 flex items-center justify-center font-sans">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-sm w-full space-y-4 border border-slate-200">
          <div className="w-12 h-12 border-4 border-[#0b192c] border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-700 font-extrabold text-xs">Loading citizen dashboard...</p>
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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-orange-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* 1. DASHBOARD WELCOME SECTION */}
        <div className="bg-[#0b192c] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-slate-800/90 text-orange-400 text-[10px] font-black rounded-full border border-slate-700 uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              <span>{t.govTag || 'VERIFIED CITIZEN ACCOUNT'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {t.welcomeUser} <span className="text-orange-400">{user?.name || (lang === 'ta' ? 'குடிமகன்' : 'Citizen')}</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
              {t.userDashboardDesc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <Link
              to="/services"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center space-x-2 group"
            >
              <PlusCircle className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span>{t.applyNewService}</span>
            </Link>

            <Link
              to="/my-applications"
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors border border-slate-700 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4 text-orange-400" />
              <span>{t.myApplications}</span>
            </Link>
          </div>
        </div>

        {/* 2. APPLICATION OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider">{t.totalSubmitted}</span>
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#0b192c] flex items-center justify-center border border-slate-200">
                <FileText className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{totalCount}</div>
            <p className="text-[11px] text-slate-400 font-medium">{lang === 'ta' ? 'பதிவு செய்யப்பட்டவை' : 'Logged applications'}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-extrabold text-amber-700 uppercase tracking-wider">{lang === 'ta' ? 'சேமிக்கப்பட்டவை' : 'Saved Drafts'}</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <FileClock className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-700">{draftCount}</div>
            <p className="text-[11px] text-slate-400 font-medium">{lang === 'ta' ? 'வரைவு வடிவில் உள்ளன' : 'Form progress saved'}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-extrabold text-indigo-900 uppercase tracking-wider">{t.inProcessing}</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center border border-indigo-200">
                <Clock className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="text-3xl font-black text-indigo-900">{activeCount}</div>
            <p className="text-[11px] text-slate-400 font-medium">{lang === 'ta' ? 'அதிகாரி ஆய்வில் உள்ளது' : 'Under verification'}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-extrabold text-emerald-800 uppercase tracking-wider">{t.approvedApps}</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-800">{completedCount}</div>
            <p className="text-[11px] text-slate-400 font-medium">{lang === 'ta' ? 'சான்றிதழ்கள் தயார்' : 'Digital certificates ready'}</p>
          </div>
        </div>

        {/* 3. QUICK ACTIONS GRID */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">{t.quickActions}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <Link
              to="/services"
              className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-[#0b192c] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0b192c] flex items-center justify-center mb-3 group-hover:bg-[#0b192c] group-hover:text-white transition-colors border border-slate-200">
                <PlusCircle className="w-5 h-5 text-orange-500 group-hover:text-orange-400" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">{t.applyNewService}</h4>
              <p className="text-xs text-slate-500 mt-1 font-normal">{lang === 'ta' ? 'ஆதார், வருமானம், சாதி & பட்டா சான்றிதழ்கள்' : 'Browse Aadhaar, Income, Community & Certificate services'}</p>
            </Link>

            <Link
              to="/track"
              className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-[#0b192c] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors border border-amber-200">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">{t.trackAppStatus}</h4>
              <p className="text-xs text-slate-500 mt-1 font-normal">{lang === 'ta' ? 'விண்ணப்ப எண்ணைப் பயன்படுத்தி நிலை அறியலாம்' : 'Check live desk status using Application Reference ID'}</p>
            </Link>

            <Link
              to="/my-applications"
              className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-[#0b192c] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:bg-emerald-700 group-hover:text-white transition-colors border border-emerald-200">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">{t.myApplications}</h4>
              <p className="text-xs text-slate-500 mt-1 font-normal">{lang === 'ta' ? 'விண்ணப்பங்களை பார்வையிட்டு ரசீது பெறலாம்' : 'View full application portfolio & download digital receipts'}</p>
            </Link>

            <Link
              to="/profile"
              className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-[#0b192c] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors border border-slate-200">
                <User className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">{t.profileSettings}</h4>
              <p className="text-xs text-slate-500 mt-1 font-normal">{lang === 'ta' ? 'தொலைபேசி எண் & கணக்கு அமைப்புகள்' : 'Manage contact info, notification alerts & account security'}</p>
            </Link>

          </div>
        </div>

        {/* 4. RECENT APPLICATIONS SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">{t.myRecentApplications}</h3>
              <p className="text-xs text-slate-500">{lang === 'ta' ? 'உங்கள் சமீபத்திய சேவை விண்ணப்பங்கள்' : 'Your latest service submissions'}</p>
            </div>

            <Link
              to="/my-applications"
              className="text-xs font-extrabold text-[#0b192c] hover:text-orange-600 hover:underline flex items-center space-x-1 transition-colors"
            >
              <span>{lang === 'ta' ? 'அனைத்தையும் பார்க்க' : 'View All Applications'}</span>
              <ChevronRight className="w-4 h-4 text-orange-500" />
            </Link>
          </div>

          {/* EMPTY STATE */}
          {recentApps.length === 0 ? (
            <div className="p-10 text-center bg-slate-50/80 rounded-3xl border border-slate-200 space-y-3 max-w-lg mx-auto">
              <FolderOpen className="w-14 h-14 text-slate-300 mx-auto" />
              <h4 className="font-black text-slate-900 text-base">{t.noApplicationsFound}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === 'ta' ? 'அரசு சேவைப் பட்டியலிலிருந்து உங்களுக்குத் தேவையான சேவையைத் தேர்ந்தெடுத்து விண்ணப்பிக்கலாம்.' : 'Start by choosing a digital service from our catalog to submit your first application.'}
              </p>
              <Link
                to="/services"
                className="inline-flex items-center space-x-2 px-5 py-3 bg-[#0b192c] text-white font-extrabold text-xs rounded-xl hover:bg-orange-600 shadow-md transition-all"
              >
                <span>{t.applyNewService}</span>
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </Link>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-[#0b192c] text-slate-300 font-black uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4 text-orange-400">{t.appId}</th>
                      <th className="py-3.5 px-4">{t.serviceName}</th>
                      <th className="py-3.5 px-4">{t.appliedDate}</th>
                      <th className="py-3.5 px-4">{t.status}</th>
                      <th className="py-3.5 px-4 text-right">{t.action}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {recentApps.map((app) => {
                      const isDraft = app.status === 'DRAFT';

                      return (
                        <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-slate-900">
                            <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                              {app.application_number}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-extrabold text-slate-900">
                            {app.service_name || (lang === 'ta' ? 'மின்னணு சேவை' : 'Digital Service')}
                          </td>
                          <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                            {new Date(app.created_at || app.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-4 px-4">
                            <StatusBadge status={app.status} />
                          </td>
                          <td className="py-4 px-4 text-right">
                            {isDraft ? (
                              <Link
                                to={`/apply/${app.service_id}?draftId=${app.id}`}
                                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-xs transition-colors inline-block"
                              >
                                {lang === 'ta' ? 'வரைவைத் தொடரவும்' : 'Resume Draft'}
                              </Link>
                            ) : (
                              <Link
                                to={`/my-applications/${app.id}`}
                                className="px-3.5 py-2 bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs transition-all shadow-xs inline-block"
                              >
                                {t.viewDetails}
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE STACKED CARDS */}
              <div className="md:hidden space-y-3">
                {recentApps.map((app) => {
                  const isDraft = app.status === 'DRAFT';

                  return (
                    <div key={app.id} className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-orange-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                          {app.application_number}
                        </span>
                        <StatusBadge status={app.status} />
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 text-sm">{app.service_name || 'Digital Service'}</h4>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Logged: {new Date(app.created_at || app.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <div>
                        {isDraft ? (
                          <Link
                            to={`/apply/${app.service_id}?draftId=${app.id}`}
                            className="w-full block text-center py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs"
                          >
                            Resume Draft
                          </Link>
                        ) : (
                          <Link
                            to={`/my-applications/${app.id}`}
                            className="w-full block text-center py-2.5 bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-xs"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

