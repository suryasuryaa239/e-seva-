import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert, LayoutDashboard, FileText, Grid, Users, Mail,
  Briefcase, Search, RefreshCw, Eye, Edit3, CheckCircle2,
  XCircle, Clock, AlertCircle, Plus, ExternalLink, LogOut, DollarSign,
  Menu, X, Award, ChevronRight, TrendingUp, ShieldCheck, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';

export default function AdminDashboard() {
  const { admin, adminToken, logoutAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
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
        
        {/* Left Branding & Mobile Drawer Trigger */}
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

        {/* Right Header Admin Profile & Actions */}
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

          {/* Sidebar Bottom Security Notice */}
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
                {activeTab === 'applications' && 'Applications Directory'}
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

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && stats && (
            <div className="space-y-6">
              
              {/* Welcome Hero Banner */}
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

              {/* Statistics Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2 hover:border-slate-300 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Applications</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="font-black text-2xl sm:text-3xl text-slate-900">{stats.total_applications}</div>
                  <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                    <Activity className="w-3 h-3 text-blue-500" />
                    <span>Recorded in DB</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2 hover:border-amber-300 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-amber-700 font-bold uppercase tracking-wider">Pending Approval</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="font-black text-2xl sm:text-3xl text-amber-700">{stats.pending_applications}</div>
                  <div className="text-[11px] text-amber-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Requires initial check</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-2 hover:border-blue-300 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-blue-700 font-bold uppercase tracking-wider">In Processing</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="font-black text-2xl sm:text-3xl text-blue-700">{stats.processing_applications}</div>
                  <div className="text-[11px] text-blue-600 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Dept Verification</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2 hover:border-emerald-300 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Total Revenue</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm">
                      ₹
                    </div>
                  </div>
                  <div className="font-black text-2xl sm:text-3xl text-emerald-700">₹{stats.total_revenue}</div>
                  <div className="text-[11px] text-emerald-600 flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Collected Online</span>
                  </div>
                </div>

              </div>

              {/* Status Breakdown Bar Grid */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Application Status Distribution</h4>
                  <span className="text-[11px] text-slate-500">Live Breakdown</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100 space-y-1">
                    <span className="text-[11px] text-emerald-700 font-bold block">Approved</span>
                    <div className="text-xl font-black text-emerald-800">{stats.approved_applications}</div>
                  </div>

                  <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100 space-y-1">
                    <span className="text-[11px] text-blue-700 font-bold block">Completed</span>
                    <div className="text-xl font-black text-blue-800">{stats.completed_applications}</div>
                  </div>

                  <div className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-100 space-y-1">
                    <span className="text-[11px] text-rose-700 font-bold block">Rejected</span>
                    <div className="text-xl font-black text-rose-800">{stats.rejected_applications}</div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[11px] text-slate-600 font-bold block">Action Required</span>
                    <div className="text-xl font-black text-slate-800">
                      {stats.total_applications - (stats.approved_applications + stats.completed_applications + stats.rejected_applications)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Applications Quick Table */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-black text-base text-slate-900">Recent Application Inflow</h3>
                    <p className="text-xs text-slate-500">Latest submissions awaiting processing or verification</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="text-xs text-orange-600 font-extrabold hover:text-orange-700 transition-colors flex items-center space-x-1"
                  >
                    <span>View All Applications</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">Application ID</th>
                        <th className="py-3.5 px-4">Citizen Name</th>
                        <th className="py-3.5 px-4">Service</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {stats.recent_applications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-extrabold text-orange-600">{app.application_number}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{app.user_name}</td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">{app.service_name}</td>
                          <td className="py-3.5 px-4"><StatusBadge status={app.status} /></td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => openAppInspector(app.id)}
                              className="bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold px-3 py-1.5 rounded-lg text-[11px] transition-colors"
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
                  <h3 className="font-black text-xl text-slate-900">Application Management Directory</h3>
                  <p className="text-xs text-slate-500">Filter by status, search by App ID or citizen details, view proof documents & update remarks.</p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search App ID, Name, Phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white text-slate-900 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-300 focus:border-[#0b192c] outline-none w-64 shadow-sm"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                {['All', 'Pending', 'Processing', 'Approved', 'Completed', 'Rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      statusFilter === st
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Applications Table */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">Application ID</th>
                        <th className="py-3.5 px-4">Citizen Info</th>
                        <th className="py-3.5 px-4">Category / Service</th>
                        <th className="py-3.5 px-4">Date & Fee</th>
                        <th className="py-3.5 px-4">Current Status</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 font-mono font-extrabold text-orange-600">{app.application_number}</td>
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
                          <td className="py-4 px-4"><StatusBadge status={app.status} /></td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => openAppInspector(app.id)}
                              className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs transition-colors shadow flex items-center space-x-1 ml-auto"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect</span>
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
                  <h3 className="font-black text-xl text-slate-900">Services Catalog Manager</h3>
                  <p className="text-xs text-slate-500">Configure public services, fees, processing SLAs, and document requirements.</p>
                </div>
                <button
                  onClick={() => setShowAddServiceModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Sub-Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((srv) => (
                  <div key={srv.id} className="bg-white border border-slate-200/90 p-5 rounded-3xl space-y-3 shadow-sm hover:border-slate-300 transition-all">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-base text-slate-900">{srv.name}</h4>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        ₹{srv.fee}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{srv.description}</p>
                    <div className="text-[11px] text-slate-500 flex justify-between pt-2 border-t border-slate-100 font-medium">
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
              <h3 className="font-black text-xl text-slate-900">Registered Citizen Directory</h3>
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Full Name</th>
                      <th className="py-3.5 px-4">Email Address</th>
                      <th className="py-3.5 px-4">Mobile Number</th>
                      <th className="py-3.5 px-4">Aadhaar No</th>
                      <th className="py-3.5 px-4">Total Applications</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customers.map((c) => (
                      <tr key={c.id}>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                        <td className="py-3.5 px-4 text-slate-600">{c.email}</td>
                        <td className="py-3.5 px-4 text-slate-600">{c.phone}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-700">{c.aadhaar_no || 'N/A'}</td>
                        <td className="py-3.5 px-4 font-extrabold text-orange-600">{c.total_applications}</td>
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
              <h3 className="font-black text-xl text-slate-900">Contact Enquiries ({enquiries.length})</h3>
              <div className="space-y-3">
                {enquiries.map((eq) => (
                  <div key={eq.id} className="bg-white border border-slate-200/90 p-5 rounded-3xl space-y-2 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{eq.subject}</h4>
                        <span className="text-xs text-slate-500">From: {eq.name} ({eq.email} • {eq.phone})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{new Date(eq.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">{eq.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PAYMENTS & FEE AUDIT */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-black text-xl text-slate-900">Payments & Fee Audit Operations</h3>
                  <p className="text-xs text-slate-500">Monitor transaction receipts, gateway logs, and initiate user refunds.</p>
                </div>
                
                <div className="flex items-center space-x-1.5 self-start sm:self-auto">
                  {['All', 'PAID', 'PENDING', 'FAILED', 'REFUNDED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setPaymentFilter(st)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        paymentFilter === st ? 'bg-orange-500 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Receipt / Txn ID</th>
                      <th className="py-3.5 px-4">App ID</th>
                      <th className="py-3.5 px-4">Citizen</th>
                      <th className="py-3.5 px-4">Service</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {adminPayments
                      .filter(p => paymentFilter === 'All' || p.payment_status === paymentFilter)
                      .map((p) => {
                        const isPaid = p.payment_status === 'PAID';
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                              <div>{p.receipt_number}</div>
                              <div className="text-[10px] text-slate-400 font-normal">{p.payment_transaction_id}</div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-orange-600 font-extrabold">{p.application_number}</td>
                            <td className="py-3.5 px-4 text-slate-800">{p.user_name || p.user_email}</td>
                            <td className="py-3.5 px-4 text-slate-600">{p.service_name}</td>
                            <td className="py-3.5 px-4 font-black text-emerald-600 text-sm">₹{p.amount}</td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                p.payment_status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                p.payment_status === 'REFUNDED' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                <span>{p.payment_status}</span>
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {isPaid && (
                                <button
                                  onClick={() => handleRefund(p.id)}
                                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3 py-1 rounded-lg text-xs border border-rose-200 transition-colors"
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

          {/* TAB 7: CAREER APPLICATIONS */}
          {activeTab === 'careers' && (
            <div className="space-y-6">
              <h3 className="font-black text-xl text-slate-900">Career & Job Submissions ({careers.length})</h3>
              <div className="space-y-3">
                {careers.map((cr) => (
                  <div key={cr.id} className="bg-white border border-slate-200/90 p-5 rounded-3xl space-y-2 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-orange-600">{cr.position}</h4>
                        <p className="text-xs text-slate-900 font-semibold">{cr.applicant_name} ({cr.email} • {cr.phone})</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
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
              <button
                onClick={() => setAppDetails(null)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STATUS UPDATE MANAGER FORM */}
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
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>Issue Official Digital Certificate</span>
                </button>

                <button
                  type="submit"
                  disabled={savingStatus}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow transition-colors"
                >
                  {savingStatus ? 'Saving Status...' : 'Save & Publish Status Update'}
                </button>
              </div>
            </form>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div><span className="text-slate-500 block font-medium">Customer Name</span><span className="font-bold text-slate-900">{appDetails.user_name}</span></div>
              <div><span className="text-slate-500 block font-medium">Email</span><span className="font-bold text-slate-900">{appDetails.user_email}</span></div>
              <div><span className="text-slate-500 block font-medium">Phone</span><span className="font-bold text-slate-900">{appDetails.user_phone}</span></div>
            </div>

            {/* Submitted Form Fields */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Submitted Form Fields</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {appDetails.field_values && appDetails.field_values.map((fv) => (
                  <div key={fv.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">{fv.field_label}</span>
                    <span className="font-bold text-slate-800">{fv.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Uploaded Documents */}
            {appDetails.documents && appDetails.documents.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Uploaded Proof Documents & Verification Desk
                </h4>

                <div className="space-y-3">
                  {appDetails.documents.map((doc) => {
                    const isVerified = doc.verification_status === 'Verified';
                    const isRejected = doc.verification_status === 'Rejected';

                    return (
                      <div key={doc.id} className={`p-4 rounded-2xl border ${isRejected ? 'border-rose-200 bg-rose-50/50' : isVerified ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'} space-y-3`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-sm text-slate-900">{doc.document_name}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                isVerified ? 'bg-emerald-100 text-emerald-800' : isRejected ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {doc.verification_status || 'Pending Verification'}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 font-mono">
                              File: {doc.original_filename || doc.file_name} ({doc.file_type || 'File'})
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <a
                              href={`/api/documents/${doc.id}/preview`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-white text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center space-x-1"
                            >
                              <span>Preview</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`/api/documents/${doc.id}/download`}
                              className="px-3 py-1.5 bg-white text-orange-600 text-xs font-bold rounded-lg border border-slate-300"
                            >
                              Download
                            </a>
                          </div>
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
