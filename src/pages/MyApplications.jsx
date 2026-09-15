import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, Clock, CheckCircle2, AlertCircle, ArrowRight, Search, Filter,
  Eye, Edit3, ShieldAlert, Sparkles, FolderOpen, Calendar, RefreshCw, Plus, Trash2,
  FileCheck, Shield, Award, Layers
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import StatusBadge from '../components/StatusBadge';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

export default function MyApplications() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { addToast } = useToast();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [deleteTargetApp, setDeleteTargetApp] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Real-time polling: fetch applications silently every 4 seconds so admin status changes update live
  useEffect(() => {
    fetchMyApplications(false);
    const interval = setInterval(() => {
      fetchMyApplications(true);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchMyApplications = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login?redirect=/my-applications');
        return;
      }

      const res = await fetch('/api/applications/my', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        if (!isSilent) setApplications([]);
        return;
      }

      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Error loading applications:', err);
      if (!isSilent) setApplications([]);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  const confirmDeleteDraft = async () => {
    if (!deleteTargetApp) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      const targetIdentifier = deleteTargetApp.id || deleteTargetApp.application_number;
      const res = await fetch(`/api/applications/${targetIdentifier}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete draft');

      setApplications(prev => prev.filter(app => 
        String(app.id) !== String(deleteTargetApp.id) && 
        String(app.application_number) !== String(deleteTargetApp.application_number)
      ));
      addToast(
        lang === 'ta' ? 'வரைவு விண்ணப்பம் நீக்கப்பட்டது' : 'Draft application deleted successfully',
        'success',
        3000
      );
      setDeleteTargetApp(null);
    } catch (err) {
      console.error('Delete draft error:', err);
      addToast(err.message || 'Failed to delete draft application', 'error', 3000);
    } finally {
      setDeleting(false);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesStatus = statusFilter === 'All' || app.status?.toUpperCase() === statusFilter.toUpperCase();
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || (
      (app.application_number && app.application_number.toLowerCase().includes(q)) ||
      (app.service_name && app.service_name.toLowerCase().includes(q)) ||
      (app.user_name && app.user_name.toLowerCase().includes(q))
    );
    return matchesStatus && matchesSearch;
  });

  // Calculate live portfolio summary statistics
  const totalCount = applications.length;
  const draftCount = applications.filter(a => a.status === 'DRAFT').length;
  const pendingCount = applications.filter(a => a.status === 'SUBMITTED' || a.status === 'Pending').length;
  const processingCount = applications.filter(a => a.status === 'Processing' || a.status === 'UNDER_REVIEW').length;
  const completedCount = applications.filter(a => a.status === 'Approved' || a.status === 'APPROVED' || a.status === 'Completed' || a.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-orange-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Breadcrumb */}
        <Breadcrumbs items={[{ label: lang === 'ta' ? 'எனது விண்ணப்பங்கள்' : 'My Applications Portfolio' }]} />

        {/* Executive Top Header Banner */}
        <div className="bg-[#0b192c] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <span className="inline-block text-[10px] sm:text-xs font-black text-orange-400 uppercase tracking-widest bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-full">
              {lang === 'ta' ? 'எனது விண்ணப்பத் தொகுப்பு' : 'MY APPLICATION PORTFOLIO'}
            </span>

            <h1 className="text-2xl sm:text-3xl font-black flex items-center space-x-3 tracking-tight text-white">
              <FolderOpen className="w-7 h-7 text-orange-400" />
              <span>{t.myApplications}</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              {lang === 'ta' ? 'உங்கள் மின்னணு சேவை விண்ணப்பங்கள், நிகழ்நேர நிலைகள் மற்றும் அதிகாரப்பூர்வ ரசீதுகளை நிர்வகிக்கவும்.' : 'Manage all your E-Seva service requests, draft submissions, real-time officer audit statuses, and verified receipt records.'}
            </p>
          </div>

          <div className="flex items-center space-x-3 relative z-10 w-full sm:w-auto">
            <button
              onClick={() => fetchMyApplications(false)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center space-x-2 transition-all shadow-sm flex-1 sm:flex-none cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 text-orange-400 ${loading ? 'animate-spin' : ''}`} />
              <span>{lang === 'ta' ? 'புதுப்பி' : 'Refresh'}</span>
            </button>

            <Link
              to="/services"
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-1.5 flex-1 sm:flex-none"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>{t.applyNewService}</span>
            </Link>
          </div>
        </div>

        {/* Live Portfolio Summary Statistics Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div 
            onClick={() => setStatusFilter('All')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${statusFilter === 'All' ? 'bg-[#0b192c] text-white border-[#0b192c] shadow-sm' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'}`}
          >
            <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-70">Total Submitted</span>
            <div className="text-xl font-black font-mono mt-0.5">{totalCount}</div>
          </div>

          <div 
            onClick={() => setStatusFilter('DRAFT')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${statusFilter === 'DRAFT' ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm' : 'bg-amber-50/60 text-amber-900 border-amber-200 hover:border-amber-300'}`}
          >
            <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-80">Draft Submissions</span>
            <div className="text-xl font-black font-mono mt-0.5">{draftCount}</div>
          </div>

          <div 
            onClick={() => setStatusFilter('SUBMITTED')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${statusFilter === 'SUBMITTED' ? 'bg-orange-500 text-white border-orange-500 shadow-sm' : 'bg-orange-50/60 text-orange-950 border-orange-200 hover:border-orange-300'}`}
          >
            <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-80">Pending Verification</span>
            <div className="text-xl font-black font-mono mt-0.5">{pendingCount}</div>
          </div>

          <div 
            onClick={() => setStatusFilter('PROCESSING')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${statusFilter === 'PROCESSING' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-blue-50/60 text-blue-950 border-blue-200 hover:border-blue-300'}`}
          >
            <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-80">In Processing</span>
            <div className="text-xl font-black font-mono mt-0.5">{processingCount}</div>
          </div>

          <div 
            onClick={() => setStatusFilter('COMPLETED')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${statusFilter === 'COMPLETED' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-emerald-50/60 text-emerald-950 border-emerald-200 hover:border-emerald-300'}`}
          >
            <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-80">Completed / Approved</span>
            <div className="text-xl font-black font-mono mt-0.5">{completedCount}</div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchApplicationsPlaceholder || "Search by Application ID or Service Name..."}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#0b192c] focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <label className="text-xs font-extrabold text-slate-700 whitespace-nowrap uppercase tracking-wider">{t.filterLabel}:</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl p-2.5 focus:ring-2 focus:ring-[#0b192c] focus:outline-none flex-1 sm:flex-none cursor-pointer"
            >
              <option value="All">{t.allFilter}</option>
              <option value="DRAFT">{lang === 'ta' ? 'வரைவுகள்' : 'Drafts'}</option>
              <option value="SUBMITTED">{t.pendingCard}</option>
              <option value="PROCESSING">{t.processingCard}</option>
              <option value="APPROVED">{t.approvedCard}</option>
              <option value="COMPLETED">{t.completedCard}</option>
              <option value="REJECTED">{t.rejectedCard}</option>
            </select>
          </div>
        </div>

        {/* Applications Portfolio Table */}
        {loading ? (
          <div className="bg-white rounded-3xl shadow-sm p-12 text-center border border-slate-200">
            <div className="w-10 h-10 border-4 border-[#0b192c] border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-600 font-bold text-xs">
              {lang === 'ta' ? 'உங்கள் விண்ணப்ப விவரங்கள் ஏற்றப்படுகின்றன...' : 'Retrieving your application portfolio...'}
            </p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-10 sm:p-14 text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto border border-orange-200/80 shadow-xs">
              <FolderOpen className="w-8 h-8 text-orange-500" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-slate-900">
                {lang === 'ta' ? 'இன்னும் விண்ணப்பங்கள் எதுவும் செய்யப்படவில்லை' : 'No Applications Submitted Yet'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                {searchTerm || statusFilter !== 'All' 
                  ? (lang === 'ta' ? 'தேடலுக்கு ஏற்ற விண்ணப்பங்கள் எதுவும் கிடைக்கவில்லை.' : 'No applications match your search filter criteria.')
                  : (lang === 'ta' ? 'உங்களின் அரசு சேவைகளுக்கான விண்ணப்பங்களை உடனே தொடங்கலாம்.' : 'Start by exploring our catalog of government digital services and certificates.')}
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/services"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all group"
              >
                <span>{lang === 'ta' ? 'சேவைகளை விண்ணப்பிக்க' : 'Explore & Apply Services'}</span>
                <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
            
            {/* DESKTOP ELEGANT TABLE */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0b192c] text-[11px] font-black text-slate-300 uppercase tracking-wider border-b border-slate-800">
                    <th className="py-4 px-6 text-orange-400">{t.appId || 'Application ID'}</th>
                    <th className="py-4 px-6">{t.serviceName || 'Requested Service'}</th>
                    <th className="py-4 px-6">{t.appliedDate || 'Filing Date'}</th>
                    <th className="py-4 px-6">{t.status || 'Officer Audit Status'}</th>
                    <th className="py-4 px-6">{lang === 'ta' ? 'தொகை' : 'Paid Fee'}</th>
                    <th className="py-4 px-6 text-right">{t.action || 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredApps.map((app) => {
                    const isDraft = app.status === 'DRAFT';

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 font-mono font-black text-slate-900 whitespace-nowrap">
                          <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900 font-mono text-xs">
                            {app.application_number}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900 max-w-xs truncate">
                          {app.service_name || (lang === 'ta' ? 'மின்னணு சேவை' : 'Digital Service')}
                        </td>
                        <td className="py-4 px-6 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                          {new Date(app.created_at || app.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                          <span className="font-extrabold text-emerald-700 text-sm font-mono">₹{app.total_fee || 0}</span>
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          {isDraft ? (
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                to={`/apply/${app.service_id}?draftId=${app.id}`}
                                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>{lang === 'ta' ? 'வரைவைத் தொடரவும்' : 'Resume Draft'}</span>
                              </Link>
                              <button
                                onClick={() => setDeleteTargetApp(app)}
                                className="inline-flex items-center space-x-1 px-3 py-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
                                title="Delete Draft Application"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{lang === 'ta' ? 'நீக்கு' : 'Delete'}</span>
                              </button>
                            </div>
                          ) : (
                            <Link
                              to={`/my-applications/${app.id}`}
                              className="inline-flex items-center space-x-1 px-4 py-2 bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs"
                            >
                              <Eye className="w-3.5 h-3.5 text-orange-400" />
                              <span>{t.viewDetails || 'View Application'}</span>
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
            <div className="md:hidden p-4 space-y-3">
              {filteredApps.map((app) => {
                const isDraft = app.status === 'DRAFT';

                return (
                  <div key={app.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-orange-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        {app.application_number}
                      </span>
                      <StatusBadge status={app.status} />
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-black text-slate-900 text-sm">{app.service_name || 'Digital Service'}</h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-mono">{lang === 'ta' ? 'நாள்:' : 'Logged:'} {new Date(app.created_at || app.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        <span className="font-black text-emerald-700 font-mono text-xs">₹{app.total_fee || 0}</span>
                      </div>
                    </div>

                    <div>
                      {isDraft ? (
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            to={`/apply/${app.service_id}?draftId=${app.id}`}
                            className="w-full inline-flex items-center justify-center space-x-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{lang === 'ta' ? 'தொடர்க' : 'Resume'}</span>
                          </Link>
                          <button
                            onClick={() => setDeleteTargetApp(app)}
                            className="w-full inline-flex items-center justify-center space-x-1 py-2.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{lang === 'ta' ? 'நீக்கு' : 'Delete'}</span>
                          </button>
                        </div>
                      ) : (
                        <Link
                          to={`/my-applications/${app.id}`}
                          className="w-full block text-center py-2.5 bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-xs"
                        >
                          {t.viewDetails || 'View Application'}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

      {/* CONFIRM DELETE DRAFT MODAL */}
      <ConfirmDeleteModal
        isOpen={!!deleteTargetApp}
        onClose={() => setDeleteTargetApp(null)}
        onConfirm={confirmDeleteDraft}
        applicationNumber={deleteTargetApp?.application_number}
        serviceName={deleteTargetApp?.service_name}
        loading={deleting}
      />
    </div>
  );
}
