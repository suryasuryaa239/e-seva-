import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert, LayoutDashboard, FileText, Grid, Users, Mail,
  Briefcase, Search, RefreshCw, Eye, Edit3, CheckCircle2,
  XCircle, Clock, AlertCircle, Plus, ExternalLink, LogOut, DollarSign,
  Menu, X, Award, ChevronRight, TrendingUp, ShieldCheck, Activity,
  Filter, RotateCcw, Inbox
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';

export default function AdminDashboard() {
  const { admin, adminToken, logoutAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('applications');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Data States
  const [customers, setCustomers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [careers, setCareers] = useState([]);
  const [services, setServices] = useState([]);
  const [adminPayments, setAdminPayments] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState('All');

  // New Service Modal State
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
        openAppInspector(selectedApp);
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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications Manager', icon: FileText, count: stats?.total_applications },
    { id: 'services', label: 'Services Directory', icon: Grid },
    { id: 'customers', label: 'Registered Customers', icon: Users },
    { id: 'enquiries', label: 'Contact Enquiries', icon: Mail, count: stats?.unread_enquiries },
    { id: 'payments', label: 'Payments & Fee Audit', icon: DollarSign },
    { id: 'careers', label: 'Careers & Applications', icon: Briefcase }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Main Admin Bar */}
      <header className="bg-[#0b192c] border-b border-slate-800 text-white px-4 sm:px-6 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-lg">
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800 border border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-extrabold shadow-md">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-black text-base text-white tracking-tight">E-SEVA ADMIN</h1>
                <span className="bg-orange-500/20 text-orange-400 text-[10px] font-black px-2 py-0.5 rounded border border-orange-500/30 uppercase tracking-widest">
                  Cockpit
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Operations Management & Verification Portal
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => {
              setLoading(true);
              Promise.all([
                fetchDashboardStats(),
                fetchApplications(),
                fetchCustomers(),
                fetchEnquiries(),
                fetchServices(),
                fetchPayments()
              ]).then(() => setLoading(false));
            }}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors hidden sm:flex items-center space-x-1.5 text-xs font-semibold"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-orange-400' : ''}`} />
            <span>Refresh</span>
          </button>

          <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block leading-none">{admin?.name || 'Administrator'}</span>
              <span className="text-[10px] text-orange-400 font-mono tracking-wider uppercase leading-none mt-1 block">
                {admin?.role || 'Super Admin'}
              </span>
            </div>

            <div className="w-9 h-9 rounded-xl bg-slate-800 text-orange-400 border border-slate-700 flex items-center justify-center font-extrabold text-sm shadow">
              {(admin?.name || 'A')[0].toUpperCase()}
            </div>

            <button
              onClick={() => {
                logoutAdmin();
                navigate('/admin/login');
              }}
              className="bg-slate-900 hover:bg-rose-900/80 text-slate-300 hover:text-white p-2 rounded-xl border border-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex relative">
        
        {/* Navigation Sidebar - Desktop */}
        <aside className="w-64 bg-[#0b192c] text-white border-r border-slate-800 p-4 space-y-1.5 hidden md:flex md:flex-col justify-between min-h-[calc(100vh-61px)] sticky top-[61px] self-start">
          <div className="space-y-1.5">
            <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              NAVIGATION MODULES
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md font-black'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-orange-600' : 'bg-slate-800 text-orange-400'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Desk Portal</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Session active under ID <code className="text-orange-400 font-mono">#ADM-8492</code>. All updates logged.
            </p>
          </div>
        </aside>

        {/* Mobile Slide-out Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
            <aside className="relative w-72 bg-[#0b192c] text-white p-5 space-y-4 flex flex-col justify-between shadow-2xl z-50">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-5 h-5 text-orange-500" />
                    <span className="font-black text-sm text-white">E-SEVA ADMIN MENU</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-orange-500 text-white shadow-md font-black'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-4 h-4 text-slate-400" />
                          <span>{item.label}</span>
                        </div>
                        {item.count !== undefined && item.count > 0 && (
                          <span className="bg-slate-800 text-orange-400 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    logoutAdmin();
                    navigate('/admin/login');
                  }}
                  className="w-full bg-rose-950 hover:bg-rose-900 text-rose-300 font-bold text-xs py-3 rounded-xl border border-rose-800 flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Cockpit</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden max-w-7xl">
          
          {/* Breadcrumb Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-500">
                <Link to="/" className="hover:text-slate-900 transition-colors">Portal Home</Link>
                <span>/</span>
                <span className="text-slate-700">Admin Cockpit</span>
                <span>/</span>
                <span className="text-orange-600 font-bold uppercase tracking-wider">
                  {activeTab}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'applications' && 'Application Management Directory'}
                {activeTab === 'services' && 'Services Catalog Manager'}
                {activeTab === 'customers' && 'Registered Citizen Directory'}
                {activeTab === 'enquiries' && 'Contact Enquiries & Support'}
                {activeTab === 'payments' && 'Payments & Revenue Audit'}
                {activeTab === 'careers' && 'Career & Job Applications'}
              </h2>
            </div>

            <div className="text-xs text-slate-500 font-medium flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-sm self-start sm:self-auto">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>Session: <strong className="text-slate-800">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></span>
            </div>
          </div>

          {/* TAB: APPLICATIONS MANAGEMENT DIRECTORY (STEP 25) */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              
              {/* Page Description Header */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      DESK VERIFICATION
                    </span>
                    <span className="text-xs font-mono text-slate-500">• Real-Time Queue</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Application Review & Verification Desk
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review incoming customer requests, audit uploaded proof documents, and publish status updates.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('All');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>

              {/* Compact Statistics Row (Step 25 Requirement) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total</span>
                  <div className="text-xl font-black text-slate-900">{stats?.total_applications || applications.length}</div>
                </div>

                <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Pending</span>
                  <div className="text-xl font-black text-amber-900">{stats?.pending_applications || 0}</div>
                </div>

                <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Processing</span>
                  <div className="text-xl font-black text-blue-900">{stats?.processing_applications || 0}</div>
                </div>

                <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Approved</span>
                  <div className="text-xl font-black text-emerald-900">{stats?.approved_applications || 0}</div>
                </div>

                <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">Completed</span>
                  <div className="text-xl font-black text-indigo-900">{stats?.completed_applications || 0}</div>
                </div>

                <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">Rejected</span>
                  <div className="text-xl font-black text-rose-900">{stats?.rejected_applications || 0}</div>
                </div>
              </div>

              {/* Search & Filter Bar (Step 25 Requirement) */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  {/* Search Input */}
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Application ID, Name, Phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Count Indicator */}
                  <div className="text-xs text-slate-500 font-medium self-end sm:self-auto">
                    Showing <strong className="text-slate-900">{applications.length}</strong> matching applications
                  </div>
                </div>

                {/* Status Filter Selector Tabs */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  {['All', 'Pending', 'Processing', 'Approved', 'Completed', 'Rejected'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        statusFilter === st
                          ? 'bg-[#0b192c] text-white shadow-sm font-black'
                          : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop Table View (`hidden md:block`) */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-3.5 px-4">Application ID</th>
                        <th className="py-3.5 px-4">Citizen Details</th>
                        <th className="py-3.5 px-4">Category / Service</th>
                        <th className="py-3.5 px-4">Submitted Date & Fee</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 font-mono font-extrabold text-orange-600">
                            {app.application_number}
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-slate-900">{app.user_name}</div>
                            <div className="text-[11px] text-slate-500">{app.user_phone} • {app.user_email}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-slate-800">{app.service_name}</div>
                            <div className="text-[10px] text-slate-500">{app.category_name}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-slate-600">{new Date(app.created_at).toLocaleDateString()}</div>
                            <div className="font-bold text-emerald-600">₹{app.total_fee}</div>
                          </td>
                          <td className="py-4 px-4">
                            <StatusBadge status={app.status} />
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => openAppInspector(app.id)}
                              className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-3.5 py-1.5 rounded-lg text-xs transition-colors shadow flex items-center space-x-1 ml-auto"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect & Action</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Stacked Application Cards View (`md:hidden`) */}
              <div className="space-y-3 md:hidden">
                {applications.map((app) => (
                  <div key={app.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-xs font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          {app.application_number}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">{app.service_name}</h4>
                        <p className="text-[11px] text-slate-500">{app.user_name} ({app.user_phone})</p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs text-slate-600">
                      <div>Date: <strong className="text-slate-800">{new Date(app.created_at).toLocaleDateString()}</strong></div>
                      <div>Fee: <strong className="text-emerald-700">₹{app.total_fee}</strong></div>
                    </div>

                    <button
                      onClick={() => openAppInspector(app.id)}
                      className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-orange-400" />
                      <span>Inspect Application</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Empty State Callout */}
              {applications.length === 0 && !loading && (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-lg text-slate-900">No Applications Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    No customer applications match your current status filter or search parameters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('All');
                    }}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow transition-colors inline-flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Search & Filters</span>
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && stats && (
            <div className="space-y-6">
              
              <div className="bg-[#0b192c] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                      SYSTEM ACTIVE
                    </span>
                    <span className="text-slate-400 text-xs font-mono">• Desk Verification Mode</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Welcome back, {admin?.name || 'Administrator'}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                    Monitor applications, service performance, payments, and citizen enquiries from one unified dashboard.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Total Applications</span>
                  <div className="font-black text-2xl sm:text-3xl text-slate-900">{stats.total_applications}</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2">
                  <span className="text-xs text-amber-700 font-bold uppercase tracking-wider block">Pending Approval</span>
                  <div className="font-black text-2xl sm:text-3xl text-amber-700">{stats.pending_applications}</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-2">
                  <span className="text-xs text-blue-700 font-bold uppercase tracking-wider block">In Processing</span>
                  <div className="font-black text-2xl sm:text-3xl text-blue-700">{stats.processing_applications}</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
                  <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider block">Total Revenue</span>
                  <div className="font-black text-2xl sm:text-3xl text-emerald-700">₹{stats.total_revenue}</div>
                </div>
              </div>

            </div>
          )}

          {/* OTHER SUB-TABS */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <h3 className="font-black text-xl text-slate-900">Services Directory Manager</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((srv) => (
                  <div key={srv.id} className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2">
                    <h4 className="font-bold text-base text-slate-900">{srv.name}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{srv.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-6">
              <h3 className="font-black text-xl text-slate-900">Registered Citizen Directory</h3>
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Full Name</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customers.map((c) => (
                      <tr key={c.id}>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                        <td className="py-3.5 px-4 text-slate-600">{c.email}</td>
                        <td className="py-3.5 px-4 text-slate-600">{c.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <h3 className="font-black text-xl text-slate-900">Contact Enquiries ({enquiries.length})</h3>
              <div className="space-y-3">
                {enquiries.map((eq) => (
                  <div key={eq.id} className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2">
                    <h4 className="font-bold text-sm text-slate-900">{eq.subject}</h4>
                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl">{eq.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h3 className="font-black text-xl text-slate-900">Payments & Revenue Audit</h3>
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Receipt ID</th>
                      <th className="py-3.5 px-4">App ID</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adminPayments.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3.5 px-4 font-mono font-bold">{p.receipt_number}</td>
                        <td className="py-3.5 px-4 font-mono text-orange-600 font-bold">{p.application_number}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-600">₹{p.amount}</td>
                        <td className="py-3.5 px-4"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">{p.payment_status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'careers' && (
            <div className="space-y-6">
              <h3 className="font-black text-xl text-slate-900">Career Submissions ({careers.length})</h3>
              <div className="space-y-3">
                {careers.map((cr) => (
                  <div key={cr.id} className="bg-white border border-slate-200 p-5 rounded-3xl space-y-1">
                    <h4 className="font-bold text-sm text-orange-600">{cr.position}</h4>
                    <p className="text-xs text-slate-900 font-semibold">{cr.applicant_name} ({cr.email})</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* INSPECTOR MODAL */}
      {appDetails && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-extrabold font-mono text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                  {appDetails.application_number}
                </span>
                <h3 className="font-black text-2xl text-slate-900 mt-1">
                  {appDetails.service_name}
                </h3>
              </div>
              <button onClick={() => setAppDetails(null)} className="text-slate-400 hover:text-slate-600 p-2 rounded-xl bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STATUS UPDATE FORM */}
            <form onSubmit={handleUpdateStatusSubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-orange-500" />
                <span>Admin Status & Official Remarks Desk</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Update Status</label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full bg-white text-slate-900 text-xs rounded-xl px-3 py-2.5 border border-slate-300 outline-none"
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Official Remarks (Visible to Citizen)</label>
                  <input
                    type="text"
                    required
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    placeholder="Enter specific verification remarks..."
                    className="w-full bg-white text-slate-900 text-xs rounded-xl px-3 py-2.5 border border-slate-300 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleIssueCertificate(appDetails.id)}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow flex items-center justify-center space-x-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>Issue Official Digital Certificate</span>
                </button>

                <button
                  type="submit"
                  disabled={savingStatus}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow"
                >
                  {savingStatus ? 'Saving Status...' : 'Save & Publish Status Update'}
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div><span className="text-slate-500 block font-medium">Customer Name</span><span className="font-bold text-slate-900">{appDetails.user_name}</span></div>
              <div><span className="text-slate-500 block font-medium">Email</span><span className="font-bold text-slate-900">{appDetails.user_email}</span></div>
              <div><span className="text-slate-500 block font-medium">Phone</span><span className="font-bold text-slate-900">{appDetails.user_phone}</span></div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
