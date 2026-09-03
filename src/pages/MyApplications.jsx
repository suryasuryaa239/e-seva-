import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, Clock, CheckCircle2, AlertCircle, ArrowRight, Search, Filter,
  Eye, Edit3, ShieldAlert, Sparkles, FolderOpen, Calendar, RefreshCw
} from 'lucide-react';

const STATUS_BADGES = {
  DRAFT: 'bg-amber-100 text-amber-800 border-amber-200',
  SUBMITTED: 'bg-blue-100 text-blue-800 border-blue-200',
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  UNDER_REVIEW: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Processing: 'bg-purple-100 text-purple-800 border-purple-200',
  PROCESSING: 'bg-purple-100 text-purple-800 border-purple-200',
  Approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  APPROVED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Rejected: 'bg-rose-100 text-rose-800 border-rose-200',
  REJECTED: 'bg-rose-100 text-rose-800 border-rose-200'
};

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
        // Redirect to login if unauthenticated
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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">My Applications</span>
        </div>

        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center space-x-3">
              <FolderOpen className="w-8 h-8 text-indigo-400" />
              <span>User Application Dashboard</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Manage all your E-Seva service requests, draft submissions, real-time application status, and verified receipt records.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchMyApplications}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center space-x-2 backdrop-blur-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>

            <Link
              to="/services"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
            >
              <span>+ New Service Request</span>
            </Link>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Application ID or Service Name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Filter Status:</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none flex-1 sm:flex-none"
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
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium text-sm">Retrieving your personal application records...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-slate-200">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-800">Error Loading Applications</h4>
            <p className="text-xs text-slate-600 mt-1">{error}</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-200 space-y-4">
            <FolderOpen className="w-16 h-16 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">No Applications Found</h3>
              <p className="text-xs text-slate-500">You have no applications matching status "{statusFilter}".</p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 shadow-md"
            >
              <span>Explore Services & Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3.5 px-4 sm:px-6">Application ID</th>
                    <th className="py-3.5 px-4 sm:px-6">Service Name</th>
                    <th className="py-3.5 px-4 sm:px-6">Date Logged</th>
                    <th className="py-3.5 px-4 sm:px-6">Current Status</th>
                    <th className="py-3.5 px-4 sm:px-6">SLA / Fee</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredApps.map((app) => {
                    const isDraft = app.status === 'DRAFT';
                    const badgeClass = STATUS_BADGES[app.status] || STATUS_BADGES.SUBMITTED;

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {app.application_number}
                        </td>
                        <td className="py-4 px-4 sm:px-6 font-bold text-slate-800 max-w-xs truncate">
                          {app.service_name || 'Digital Service'}
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-slate-600 whitespace-nowrap">
                          {new Date(app.created_at || app.submitted_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${badgeClass}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-slate-600 whitespace-nowrap">
                          <span className="font-bold text-emerald-700">₹{app.total_fee || 0}</span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                          {isDraft ? (
                            <Link
                              to={`/apply/${app.service_id}?draftId=${app.id}`}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Resume Draft</span>
                            </Link>
                          ) : (
                            <Link
                              to={`/my-applications/${app.id}`}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 text-slate-800 font-bold text-xs rounded-lg hover:bg-slate-200 border border-slate-200 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-indigo-600" />
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
          </div>
        )}

      </div>
    </div>
  );
}
