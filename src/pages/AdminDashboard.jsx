import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert, LayoutDashboard, FileText, Grid, Users, Mail,
  Briefcase, Search, RefreshCw, Eye, Edit3, CheckCircle2,
  XCircle, Clock, AlertCircle, Plus, ExternalLink, LogOut, DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';

export default function AdminDashboard() {
  const { admin, adminToken, logoutAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Inspector & Status Update Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [appDetails, setAppDetails] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('Processing');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  // Customers, Enquiries, Careers, Services State
  const [customers, setCustomers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [careers, setCareers] = useState([]);
  const [services, setServices] = useState([]);
  const [adminPayments, setAdminPayments] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState('All');

  const fetchPayments = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/payments', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) setAdminPayments(await res.json());
    } catch (e) {}
  };

  const handleRefund = async (paymentId) => {
    if (!window.confirm('Are you sure you want to issue a full refund for this payment?')) return;
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        addToast('Payment refunded successfully!', 'success');
        fetchPayments();
      } else {
        addToast(data.error || 'Refund failed', 'error');
      }
    } catch (e) {
      addToast('Refund request failed', 'error');
    }
  };

  // New Service Creation Modal State
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newService, setNewService] = useState({
    category_id: '1',
    name: '',
    description: '',
    eligibility: '',
    processing_info: '',
    processing_time: '3-5 Days',
    fee: 50,
    fields: [
      { field_name: 'full_name', field_label: 'Full Name', field_type: 'text', is_required: true },
      { field_name: 'aadhaar_number', field_label: '12-Digit Aadhaar', field_type: 'text', is_required: true }
    ],
    documents: [
      { document_name: 'Proof of Identity', description: 'Copy of Passport/Aadhaar/Voter ID' }
    ]
  });

  const fetchDashboardStats = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchApplications = async () => {
    if (!adminToken) return;
    try {
      let url = `/api/admin/applications?status=${statusFilter}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCustomers = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/customers', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) setCustomers(await res.json());
    } catch (e) {}
  };

  const fetchEnquiries = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/enquiries', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) setEnquiries(await res.json());
    } catch (e) {}
  };

  const fetchCareers = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/careers', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) setCareers(await res.json());
    } catch (e) {}
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) setServices(await res.json());
    } catch (e) {}
  };

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    setLoading(true);
    Promise.all([
      fetchDashboardStats(),
      fetchApplications(),
      fetchCustomers(),
      fetchEnquiries(),
      fetchCareers(),
      fetchServices(),
      fetchPayments()
    ]).then(() => setLoading(false));
  }, [adminToken, navigate]);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, searchQuery]);

  const openAppInspector = async (appId) => {
    setSelectedApp(appId);
    try {
      const res = await fetch(`/api/applications/${appId}`);
      if (res.ok) {
        const data = await res.json();
        setAppDetails(data);
        setUpdateStatus(data.status);
        setAdminRemarks(data.admin_remarks || '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/admin/applications/${selectedApp}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status: updateStatus,
          admin_remarks: adminRemarks
        })
      });
      const data = await res.json();
      if (res.ok) {
        addToast(`Application status updated to ${updateStatus}`, 'success');
        fetchApplications();
        fetchDashboardStats();
        openAppInspector(selectedApp); // Refresh detail
      } else {
        addToast(data.error || 'Failed to update status', 'error');
      }
    } catch (e) {
      console.error(e);
      addToast('Server error while updating status', 'error');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleIssueCertificate = async (appId) => {
    const certNum = window.prompt('Enter or confirm Certificate Number:', `CERT-2026-${Math.floor(100000 + Math.random() * 900000)}`);
    if (!certNum) return;
    try {
      const res = await fetch(`/api/admin/applications/${appId}/certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ certificate_number: certNum })
      });
      const data = await res.json();
      if (res.ok) {
        addToast('Official Digital Certificate issued successfully!', 'success');
        openAppInspector(appId);
        fetchApplications();
        fetchDashboardStats();
      } else {
        addToast(data.error || 'Failed to issue certificate', 'error');
      }
    } catch (e) {
      addToast('Error issuing certificate', 'error');
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(newService)
      });
      if (res.ok) {
        addToast('New service added successfully!', 'success');
        setShowAddServiceModal(false);
        fetchServices();
      }
    } catch (e) {
      addToast('Failed to create service', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold shadow">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-lg text-white">E-SEVA ADMIN COCKPIT</h1>
            <p className="text-[11px] text-slate-400">Super Administrator Portal • System Operations</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-white block">{admin?.name || 'Administrator'}</span>
            <span className="text-[10px] text-amber-400 uppercase font-mono">{admin?.role || 'Super Admin'}</span>
          </div>

          <button
            onClick={() => {
              logoutAdmin();
              navigate('/admin/login');
            }}
            className="bg-slate-800 hover:bg-rose-900/80 text-slate-300 hover:text-white p-2 rounded-xl border border-slate-700 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900/80 border-r border-slate-800 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard Overview
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'applications' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4" /> All Applications
            </div>
            {stats && (
              <span className="bg-slate-800 text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded-full">
                {stats.total_applications}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'services' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" /> Services Manager
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'customers' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Registered Customers
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'enquiries' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4" /> Contact Enquiries
            </div>
            {stats?.unread_enquiries > 0 && (
              <span className="bg-rose-600 text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
                {stats.unread_enquiries}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'payments' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Payments & Fee Audit
            </div>
          </button>

          <button
            onClick={() => setActiveTab('careers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'careers' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Career Applications
          </button>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && stats && (
            <div className="space-y-8">
              
              {/* Analytics Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <span className="text-xs text-slate-400 font-medium block">Total Applications</span>
                  <div className="font-heading font-extrabold text-3xl text-white">{stats.total_applications}</div>
                  <span className="text-[10px] text-emerald-400">Recorded in DB</span>
                </div>

                <div className="bg-slate-900 border border-amber-900/60 p-5 rounded-2xl space-y-2">
                  <span className="text-xs text-amber-400 font-medium block">Pending Applications</span>
                  <div className="font-heading font-extrabold text-3xl text-amber-400">{stats.pending_applications}</div>
                  <span className="text-[10px] text-amber-300">Requires initial check</span>
                </div>

                <div className="bg-slate-900 border border-blue-900/60 p-5 rounded-2xl space-y-2">
                  <span className="text-xs text-blue-400 font-medium block">In Processing</span>
                  <div className="font-heading font-extrabold text-3xl text-blue-400">{stats.processing_applications}</div>
                  <span className="text-[10px] text-blue-300">Dept Verification</span>
                </div>

                <div className="bg-slate-900 border border-emerald-900/60 p-5 rounded-2xl space-y-2">
                  <span className="text-xs text-emerald-400 font-medium block">Total Revenue</span>
                  <div className="font-heading font-extrabold text-3xl text-emerald-400">₹{stats.total_revenue}</div>
                  <span className="text-[10px] text-emerald-300">Collected Online</span>
                </div>

              </div>

              {/* Status Breakdown Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                  <span className="text-xs text-slate-400">Approved</span>
                  <div className="font-bold text-xl text-emerald-400">{stats.approved_applications}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                  <span className="text-xs text-slate-400">Completed</span>
                  <div className="font-bold text-xl text-emerald-300">{stats.completed_applications}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                  <span className="text-xs text-slate-400">Rejected</span>
                  <div className="font-bold text-xl text-rose-400">{stats.rejected_applications}</div>
                </div>
              </div>

              {/* Recent Applications Quick Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-heading font-bold text-lg text-white">Recent Application Inflow</h3>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="text-xs text-amber-400 font-semibold hover:underline"
                  >
                    View All Applications →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Application ID</th>
                        <th className="py-3 px-4">Customer Name</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {stats.recent_applications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-850">
                          <td className="py-3 px-4 font-mono font-bold text-amber-400">{app.application_number}</td>
                          <td className="py-3 px-4 font-semibold text-white">{app.user_name}</td>
                          <td className="py-3 px-4 text-slate-400">{app.service_name}</td>
                          <td className="py-3 px-4"><StatusBadge status={app.status} /></td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => openAppInspector(app.id)}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1 rounded text-[11px]"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ALL APPLICATIONS FILTERABLE TABLE */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-white">
                    Application Directory Management
                  </h2>
                  <p className="text-xs text-slate-400">
                    Filter by status, search by Application ID, view submitted form fields & documents, and update remarks.
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search App ID, Name, Phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-900 text-white text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-700 focus:border-amber-500 outline-none w-64"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
                {['All', 'Pending', 'Processing', 'Approved', 'Completed', 'Rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                      statusFilter === st
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Applications Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3.5 px-4">Application ID</th>
                        <th className="py-3.5 px-4">Customer Info</th>
                        <th className="py-3.5 px-4">Category / Service</th>
                        <th className="py-3.5 px-4">Date & Fee</th>
                        <th className="py-3.5 px-4">Current Status</th>
                        <th className="py-3.5 px-4 text-right">Manage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-850 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-amber-400">
                            {app.application_number}
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-white">{app.user_name}</div>
                            <div className="text-[11px] text-slate-400">{app.user_phone} • {app.user_email}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-slate-200">{app.service_name}</div>
                            <div className="text-[10px] text-slate-400">{app.category_name}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-slate-300">{new Date(app.created_at).toLocaleDateString()}</div>
                            <div className="font-bold text-emerald-400">₹{app.total_fee}</div>
                          </td>
                          <td className="py-4 px-4">
                            <StatusBadge status={app.status} />
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => openAppInspector(app.id)}
                              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-3.5 py-1.5 rounded-lg text-xs transition-colors shadow flex items-center gap-1 ml-auto"
                            >
                              <Eye className="w-3.5 h-3.5" /> Inspect & Update
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SERVICES MANAGER */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-white">Services Catalog Manager</h2>
                  <p className="text-xs text-slate-400">Manage all services, custom form fields, and required documents.</p>
                </div>
                <button
                  onClick={() => setShowAddServiceModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add New Sub-Service
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((srv) => (
                  <div key={srv.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-base text-white">{srv.name}</h3>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        ₹{srv.fee}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{srv.description}</p>
                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>Category ID: {srv.category_id}</span>
                      <span>SLA: {srv.processing_time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS DIRECTORY */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <h2 className="font-heading font-extrabold text-2xl text-white">Registered Customers</h2>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Aadhaar No</th>
                      <th className="py-3 px-4">Total Applications</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {customers.map((c) => (
                      <tr key={c.id}>
                        <td className="py-3 px-4 font-bold text-white">{c.name}</td>
                        <td className="py-3 px-4 text-slate-400">{c.email}</td>
                        <td className="py-3 px-4 text-slate-400">{c.phone}</td>
                        <td className="py-3 px-4 font-mono">{c.aadhaar_no || 'N/A'}</td>
                        <td className="py-3 px-4 font-bold text-amber-400">{c.total_applications}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <h2 className="font-heading font-extrabold text-2xl text-white">Contact Enquiries ({enquiries.length})</h2>
              <div className="space-y-3">
                {enquiries.map((eq) => (
                  <div key={eq.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-white">{eq.subject}</h4>
                        <span className="text-xs text-slate-400">From: {eq.name} ({eq.email} • {eq.phone})</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{new Date(eq.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">{eq.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PAYMENTS & FEE AUDIT */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-white">Payments & Fee Operations</h2>
                  <p className="text-xs text-slate-400">Monitor payment collections, transaction receipts, and initiate user refunds.</p>
                </div>
                
                {/* Filter Selector */}
                <div className="flex items-center gap-2">
                  {['All', 'PAID', 'PENDING', 'FAILED', 'REFUNDED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setPaymentFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        paymentFilter === st ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transactions Ledger Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Receipt / Txn ID</th>
                      <th className="py-3.5 px-4">App ID</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Service</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-medium">
                    {adminPayments
                      .filter(p => paymentFilter === 'All' || p.payment_status === paymentFilter)
                      .map((p) => {
                        const isPaid = p.payment_status === 'PAID';
                        return (
                          <tr key={p.id} className="hover:bg-slate-850 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-white">
                              <div>{p.receipt_number}</div>
                              <div className="text-[10px] text-slate-400 font-normal">{p.payment_transaction_id}</div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-amber-400 font-bold">{p.application_number}</td>
                            <td className="py-3.5 px-4 text-slate-200">{p.user_name || p.user_email}</td>
                            <td className="py-3.5 px-4 text-slate-300">{p.service_name}</td>
                            <td className="py-3.5 px-4 font-black text-emerald-400 text-sm">₹{p.amount}</td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                isPaid ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                                p.payment_status === 'PENDING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                                p.payment_status === 'REFUNDED' ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                                'bg-rose-950 text-rose-400 border border-rose-800'
                              }`}>
                                {p.payment_status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {isPaid && (
                                <button
                                  onClick={() => handleRefund(p.id)}
                                  className="bg-rose-950 hover:bg-rose-900 text-rose-300 font-bold px-3 py-1 rounded-lg text-xs border border-rose-800 transition-colors"
                                >
                                  Refund
                                </button>
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

          {/* TAB 6: CAREER APPLICATIONS */}
          {activeTab === 'careers' && (
            <div className="space-y-6">
              <h2 className="font-heading font-extrabold text-2xl text-white">Career & Job Applications ({careers.length})</h2>
              <div className="space-y-3">
                {careers.map((cr) => (
                  <div key={cr.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-amber-400">{cr.position}</h4>
                        <p className="text-xs text-white font-semibold">{cr.applicant_name} ({cr.email} • {cr.phone})</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        {cr.experience}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* INSPECTOR & STATUS MANAGER MODAL */}
      {appDetails && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold font-mono text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded border border-amber-800">
                  {appDetails.application_number}
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-white mt-1">
                  {appDetails.service_name}
                </h3>
              </div>
              <button
                onClick={() => setAppDetails(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* STATUS UPDATE MANAGER FORM */}
            <form onSubmit={handleUpdateStatusSubmit} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Admin Status & Remarks Management
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Update Status</label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 outline-none"
                  >
                    <option value="Pending">Pending Verification</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="Processing">In Processing</option>
                    <option value="ACTION_REQUIRED">Action Required (Query)</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Official Admin Remarks (Visible to Citizen)</label>
                  <input
                    type="text"
                    required
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    placeholder="Enter specific verification remarks..."
                    className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => handleIssueCertificate(appDetails.id)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" /> Issue Official Digital Certificate
                </button>

                <button
                  type="submit"
                  disabled={savingStatus}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-colors"
                >
                  {savingStatus ? 'Saving Status...' : 'Save & Publish Status Update'}
                </button>
              </div>
            </form>

            {/* Customer Details */}
            <div className="grid grid-cols-3 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div><span className="text-slate-500 block font-medium">Customer Name</span><span className="font-bold text-white">{appDetails.user_name}</span></div>
              <div><span className="text-slate-500 block font-medium">Email</span><span className="font-bold text-white">{appDetails.user_email}</span></div>
              <div><span className="text-slate-500 block font-medium">Phone</span><span className="font-bold text-white">{appDetails.user_phone}</span></div>
            </div>

            {/* Submitted Form Fields */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Submitted Dynamic Form Fields</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {appDetails.field_values && appDetails.field_values.map((fv) => (
                  <div key={fv.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">{fv.field_label}</span>
                    <span className="font-semibold text-slate-200">{fv.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Uploaded Documents & Admin Document Verification Desk */}
            {appDetails.documents && appDetails.documents.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Uploaded Proof Documents & Verification Desk</span>
                  <span className="text-[10px] text-slate-400 font-normal">Audit log logged on status change</span>
                </h4>

                <div className="space-y-3">
                  {appDetails.documents.map((doc) => {
                    const isVerified = doc.verification_status === 'Verified';
                    const isRejected = doc.verification_status === 'Rejected';

                    const handleVerifyDoc = async (status) => {
                      let rejectionReason = null;
                      if (status === 'Rejected') {
                        rejectionReason = window.prompt('Enter specific rejection reason for this document:', 'Uploaded image is blurry or unreadable.');
                        if (rejectionReason === null) return;
                      }

                      try {
                        const token = localStorage.getItem('token');
                        const res = await fetch(`/api/admin/documents/${doc.id}/verify`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            verification_status: status,
                            rejection_reason: rejectionReason
                          })
                        });

                        if (!res.ok) {
                          const errData = await res.json();
                          throw new Error(errData.error || 'Failed to update document status');
                        }

                        alert(`Document ${doc.document_name} set to ${status}!`);
                        // Refresh inspector application details
                        fetchApplicationInspector(appDetails.application_number);
                      } catch (err) {
                        alert(`Error: ${err.message}`);
                      }
                    };

                    return (
                      <div key={doc.id} className={`p-4 rounded-xl border ${isRejected ? 'border-rose-900 bg-rose-950/30' : isVerified ? 'border-emerald-900 bg-emerald-950/30' : 'border-slate-800 bg-slate-950'} space-y-3`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-sm text-white">{doc.document_name}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                isVerified ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : isRejected ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-slate-800 text-amber-400'
                              }`}>
                                {doc.verification_status || 'Pending Verification'}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 font-mono">
                              File: {doc.original_filename || doc.file_name} ({doc.file_type || 'File'})
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <a
                              href={`/api/documents/${doc.id}/preview`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1"
                            >
                              Preview <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            <a
                              href={`/api/documents/${doc.id}/download`}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1"
                            >
                              Download
                            </a>
                          </div>
                        </div>

                        {isRejected && (
                          <div className="p-2.5 bg-rose-950/70 border border-rose-900 rounded-lg text-xs text-rose-300">
                            <span className="font-bold">Admin Rejection Reason: </span>
                            {doc.rejection_reason || 'Document does not meet verification requirements.'}
                          </div>
                        )}

                        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800/80">
                          <button
                            type="button"
                            onClick={() => handleVerifyDoc('Verified')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                          >
                            ✓ Approve Document
                          </button>
                          <button
                            type="button"
                            onClick={() => handleVerifyDoc('Rejected')}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                          >
                            ✕ Reject Document
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
