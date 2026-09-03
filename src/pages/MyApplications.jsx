import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, Clock, CheckCircle2, AlertCircle, ArrowRight, Search, Filter,
  Eye, Edit3, ShieldAlert, Sparkles, FolderOpen, Calendar, RefreshCw, Plus
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import StatusBadge from '../components/StatusBadge';

export default function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
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
        throw new Error('Failed to load user applications');
      }

      const data = await res.json();
      setApplications(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesStatus = statusFilter === 'All' || app.status.toUpperCase() === statusFilter.toUpperCase();
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || (
      app.application_number.toLowerCase().includes(q) ||
      (app.service_name && app.service_name.toLowerCase().includes(q)) ||
      (app.user_name && app.user_name.toLowerCase().includes(q))
    );
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-orange-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Breadcrumb */}
        <Breadcrumbs items={[{ label: 'My Applications Portfolio' }]} />

        {/* Top Header Card */}
        <div className="bg-[#0b192c] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-2 relative z-10">
            <span className="inline-block text-[10px] sm:text-xs font-black text-orange-400 uppercase tracking-widest bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-full">
              MY APPLICATION PORTFOLIO
            </span>

            <h1 className="text-2xl sm:text-3xl font-black flex items-center space-x-3 tracking-tight text-white">
              <FolderOpen className="w-7 h-7 text-orange-400" />
              <span>User Application Dashboard</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Manage all your E-Seva service requests, draft submissions, real-time application status, and verified receipt records.
            </p>
          </div>

          <div className="flex items-center space-x-3 relative z-10 w-full sm:w-auto">
            <button
              onClick={fetchMyApplications}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center space-x-2 transition-all shadow-sm flex-1 sm:flex-none"
            >
              <RefreshCw className={`w-4 h-4 text-orange-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              to="/services"
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-1.5 flex-1 sm:flex-none"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>New Service Request</span>
            </Link>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Application ID or Service Name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#0b192c] focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <label className="text-xs font-extrabold text-slate-700 whitespace-nowrap uppercase tracking-wider">Status:</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl p-3 focus:ring-2 focus:ring-[#0b192c] focus:outline-none flex-1 sm:flex-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="DRAFT">Drafts</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="PROCESSING">Processing</option>
              <option value="APPROVED">Approved</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

        </div>

        {/* Applications List Grid / Table */}
        {loading ? (
          <div className="bg-white rounded-3xl shadow-sm p-12 text-center border border-slate-200">
            <div className="w-12 h-12 border-4 border-[#0b192c] border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-bold text-xs">Retrieving your personal application records...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl shadow-sm p-8 text-center border border-slate-200">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h4 className="text-base font-extrabold text-slate-900">Error Loading Applications</h4>
            <p className="text-xs text-slate-600 mt-1">{error}</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-10 text-center border border-slate-200 space-y-4 max-w-lg mx-auto">
            <FolderOpen className="w-16 h-16 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">No applications yet</h3>
              <p className="text-xs text-slate-500">
                {searchTerm || statusFilter !== 'All' 
                  ? `No applications matching filter criteria.` 
                  : `Start by choosing a digital service from our catalog.`}
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center space-x-2 px-5 py-3 bg-[#0b192c] text-white font-extrabold text-xs rounded-xl hover:bg-orange-600 shadow-md transition-all"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4 text-orange-400" />
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
            
            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0b192c] text-[11px] font-black text-slate-300 uppercase tracking-wider border-b border-slate-800">
                    <th className="py-4 px-4 sm:px-6 text-orange-400">Application Reference ID</th>
                    <th className="py-4 px-4 sm:px-6">Service Name</th>
                    <th className="py-4 px-4 sm:px-6">Date Logged</th>
                    <th className="py-4 px-4 sm:px-6">Current Status</th>
                    <th className="py-4 px-4 sm:px-6">Total Fee</th>
                    <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredApps.map((app) => {
                    const isDraft = app.status === 'DRAFT';

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4.5 px-4 sm:px-6 font-mono font-bold text-slate-900 whitespace-nowrap">
                          <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-900">
                            {app.application_number}
                          </span>
                        </td>
                        <td className="py-4.5 px-4 sm:px-6 font-bold text-slate-800 max-w-xs truncate">
                          {app.service_name || 'Digital Service'}
                        </td>
                        <td className="py-4.5 px-4 sm:px-6 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                          {new Date(app.created_at || app.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-4.5 px-4 sm:px-6 whitespace-nowrap">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="py-4.5 px-4 sm:px-6 text-slate-600 whitespace-nowrap">
                          <span className="font-extrabold text-emerald-700 text-sm">₹{app.total_fee || 0}</span>
                        </td>
                        <td className="py-4.5 px-4 sm:px-6 text-right whitespace-nowrap">
                          {isDraft ? (
                            <Link
                              to={`/apply/${app.service_id}?draftId=${app.id}`}
                              className="inline-flex items-center space-x-1 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Resume Draft</span>
                            </Link>
                          ) : (
                            <Link
                              to={`/my-applications/${app.id}`}
                              className="inline-flex items-center space-x-1 px-3.5 py-2 bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs"
                            >
                              <Eye className="w-3.5 h-3.5 text-orange-400" />
                              <span>View Details</span>
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
                        <span className="font-mono">Logged: {new Date(app.created_at || app.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        <span className="font-black text-emerald-700">₹{app.total_fee || 0}</span>
                      </div>
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

          </div>
        )}

      </div>
    </div>
  );
}

