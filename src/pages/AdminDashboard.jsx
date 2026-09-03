import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert, LayoutDashboard, FileText, Grid, Users, Mail,
  Briefcase, Search, RefreshCw, Eye, Edit3, CheckCircle2,
  XCircle, Clock, AlertCircle, Plus, ExternalLink, LogOut, DollarSign,
  Menu, X, Award, ChevronRight, TrendingUp, ShieldCheck, Activity,
  Filter, RotateCcw, Inbox, UserCheck, FileCheck, History, MessageSquare,
  User, Phone, Mail as MailIcon, Calendar, CheckCircle, Shield
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

  // User Inspector Modal State (STEP 27)
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('All');

  // Service Inspector Modal State (STEP 28)
  const [selectedService, setSelectedService] = useState(null);
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('All');

  // Data States
  const [customers, setCustomers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [careers, setCareers] = useState([]);
  const [services, setServices] = useState([]);
  const [adminPayments, setAdminPayments] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState('All');

  // New Service Modal State
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

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
    { id: 'customers', label: 'Users Directory', icon: Users, count: stats?.total_users || customers.length },
    { id: 'enquiries', label: 'Contact Enquiries', icon: Mail, count: stats?.unread_enquiries },
    { id: 'payments', label: 'Payments & Fee Audit', icon: DollarSign },
    { id: 'careers', label: 'Careers & Applications', icon: Briefcase }
  ];

  // Filtered Users List
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = !userSearchQuery || 
      (c.name && c.name.toLowerCase().includes(userSearchQuery.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(userSearchQuery.toLowerCase())) ||
      (c.phone && c.phone.includes(userSearchQuery));
    const matchesStatus = userStatusFilter === 'All' || (userStatusFilter === 'Active' && (!c.status || c.status === 'Active'));
    return matchesSearch && matchesStatus;
  });

  // Filtered Services List & Categories (STEP 28)
  const serviceCategories = ['All', ...Array.from(new Set(services.map(s => s.category_name || s.category || 'General')))];
  
  const filteredServices = services.filter(s => {
    const matchesSearch = !serviceSearchQuery ||
      (s.name && s.name.toLowerCase().includes(serviceSearchQuery.toLowerCase())) ||
      (s.category_name && s.category_name.toLowerCase().includes(serviceSearchQuery.toLowerCase())) ||
      (s.description && s.description.toLowerCase().includes(serviceSearchQuery.toLowerCase()));
    const matchesCategory = selectedServiceCategory === 'All' || 
      s.category_name === selectedServiceCategory || 
      s.category === selectedServiceCategory;
    return matchesSearch && matchesCategory;
  });

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
                  {activeTab === 'customers' ? 'Users' : activeTab}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'applications' && 'Application Management Directory'}
                {activeTab === 'services' && 'Services Catalog Manager'}
                {activeTab === 'customers' && 'Registered Users Directory'}
                {activeTab === 'enquiries' && 'Contact Enquiries & Support'}
                {activeTab === 'payments' && 'Payments & Revenue Audit'}
                {activeTab === 'careers' && 'Careers & Applications'}
              </h2>
            </div>

            <div className="text-xs text-slate-500 font-medium flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-sm self-start sm:self-auto">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>Session: <strong className="text-slate-800">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></span>
            </div>
          </div>

          {/* TAB: REGISTERED USERS DIRECTORY (STEP 27) */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      CITIZEN REGISTRY
                    </span>
                    <span className="text-xs font-mono text-slate-500">• User Accounts</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Registered Users Directory & Profiles
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage registered citizen accounts, view contact details, and audit application history.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      setUserSearchQuery('');
                      setUserStatusFilter('All');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Search</span>
                  </button>
                </div>
              </div>

              {/* User Statistics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Registered Users</span>
                    <div className="text-2xl font-black text-slate-900">{stats?.total_users || customers.length}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Accounts</span>
                    <div className="text-2xl font-black text-slate-900">{customers.length}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Applications Logged</span>
                    <div className="text-2xl font-black text-slate-900">{stats?.total_applications || applications.length}</div>
                  </div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search User Name, Email, or Phone..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner"
                    />
                    {userSearchQuery && (
                      <button
                        onClick={() => setUserSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 font-medium self-end sm:self-auto">
                    Showing <strong className="text-slate-900">{filteredCustomers.length}</strong> matching user records
                  </div>
                </div>
              </div>

              {/* Desktop Users Table (`hidden md:block`) */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-3.5 px-4">User</th>
                        <th className="py-3.5 px-4">Contact Details</th>
                        <th className="py-3.5 px-4">Registration Date</th>
                        <th className="py-3.5 px-4">Applications</th>
                        <th className="py-3.5 px-4">Account Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCustomers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 rounded-xl bg-[#0b192c] text-orange-400 font-black flex items-center justify-center text-sm shadow-sm">
                                {(user.name || 'U')[0].toUpperCase()}
                              </div>
                              <div>
                                <div className="font-extrabold text-slate-900">{user.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono">ID: #{user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-slate-800">{user.email}</div>
                            <div className="text-[11px] text-slate-500">{user.phone || 'No Phone Registered'}</div>
                          </td>
                          <td className="py-4 px-4 text-slate-600 font-medium">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Registered'}
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-slate-100 text-slate-800 text-xs font-black px-2.5 py-1 rounded-lg border border-slate-200">
                              {user.application_count || applications.filter(a => a.user_email === user.email || a.user_name === user.name).length || 0} Apps
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs transition-colors shadow flex items-center space-x-1.5 ml-auto"
                            >
                              <Eye className="w-3.5 h-3.5 text-orange-400" />
                              <span>Inspect Details</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Stacked User Cards (`md:hidden`) */}
              <div className="space-y-3 md:hidden">
                {filteredCustomers.map((user) => (
                  <div key={user.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0b192c] text-orange-400 font-black flex items-center justify-center text-sm shadow-sm">
                        {(user.name || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{user.name}</h4>
                        <p className="text-[11px] text-slate-500">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs text-slate-600">
                      <div>Phone: <strong className="text-slate-800">{user.phone || 'N/A'}</strong></div>
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                        Active Account
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedUser(user)}
                      className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-orange-400" />
                      <span>Inspect Citizen Details</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB: SERVICES CATALOG MANAGER (STEP 28) */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      SERVICES DIRECTORY
                    </span>
                    <span className="text-xs font-mono text-slate-500">• Official Catalog</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Services Catalog & Configuration Manager
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage digital service offerings, government fees, dynamic form fields, and required proof documents.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      setServiceSearchQuery('');
                      setSelectedServiceCategory('All');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>

              {/* Service Statistics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black">
                    <Grid className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Services</span>
                    <div className="text-xl font-black text-slate-900">{services.length}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Active Services</span>
                    <div className="text-xl font-black text-slate-900">{services.filter(s => !s.status || s.status === 'Active' || s.is_active).length}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Categories</span>
                    <div className="text-xl font-black text-slate-900">{serviceCategories.length - 1}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-black">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Average Fee</span>
                    <div className="text-xl font-black text-emerald-600">
                      ₹{services.length > 0 ? Math.round(services.reduce((acc, curr) => acc + (curr.total_fee || curr.govt_fee || 50), 0) / services.length) : 60}
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Chips & Search Bar */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Service Name or Description..."
                      value={serviceSearchQuery}
                      onChange={(e) => setServiceSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner"
                    />
                    {serviceSearchQuery && (
                      <button
                        onClick={() => setServiceSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 font-medium self-end sm:self-auto">
                    Showing <strong className="text-slate-900">{filteredServices.length}</strong> matching services
                  </div>
                </div>

                {/* Category Chips Horizontal Scroll */}
                <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-slate-100 pb-1 scrollbar-none">
                  {serviceCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedServiceCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        selectedServiceCategory === cat
                          ? 'bg-[#0b192c] text-white shadow-sm font-black'
                          : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop Services Table (`hidden md:block`) */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-3.5 px-4">Service Details</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Govt & Portal Fee</th>
                        <th className="py-3.5 px-4">Processing SLA</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredServices.map((srv) => (
                        <tr key={srv.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 font-black flex items-center justify-center text-sm shadow-sm">
                                <Grid className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-extrabold text-slate-900 text-sm">{srv.name}</div>
                                <div className="text-[11px] text-slate-500 max-w-xs truncate">{srv.description || 'Digital e-Seva processing service'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg border border-slate-200 text-[11px]">
                              {srv.category_name || srv.category || 'General'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-black text-emerald-600 text-sm">₹{srv.total_fee || srv.govt_fee || 60}</div>
                            <div className="text-[10px] text-slate-400 font-mono">Official Fee</div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-slate-700">
                            {srv.processing_time || '2-3 Business Days'}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => setSelectedService(srv)}
                              className="bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs transition-colors shadow flex items-center space-x-1.5 ml-auto"
                            >
                              <Eye className="w-3.5 h-3.5 text-orange-400" />
                              <span>Inspect Configuration</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Stacked Service Cards (`md:hidden`) */}
              <div className="space-y-3 md:hidden">
                {filteredServices.map((srv) => (
                  <div key={srv.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-200 text-[10px]">
                          {srv.category_name || srv.category || 'General'}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900">{srv.name}</h4>
                      </div>
                      <span className="font-black text-emerald-600 text-sm">₹{srv.total_fee || srv.govt_fee || 60}</span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">{srv.description || 'Digital e-Seva processing service'}</p>

                    <button
                      onClick={() => setSelectedService(srv)}
                      className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-orange-400" />
                      <span>Inspect Service Details</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB: APPLICATIONS MANAGEMENT DIRECTORY */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              
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

              {/* Compact Statistics Row */}
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

              {/* Search & Filter Bar */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
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

                  <div className="text-xs text-slate-500 font-medium self-end sm:self-auto">
                    Showing <strong className="text-slate-900">{applications.length}</strong> matching applications
                  </div>
                </div>

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
                              <span>Inspect & Review</span>
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

            </div>
          )}

          {/* DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && stats && (
            <div className="space-y-6">
              <div className="bg-[#0b192c] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Welcome back, {admin?.name || 'Administrator'}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm">
                    Monitor applications, service performance, payments, and citizen enquiries.
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* USER DETAILS INSPECTOR MODAL (STEP 27) */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0b192c] text-orange-400 font-black flex items-center justify-center text-lg shadow-sm">
                  {(selectedUser.name || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">{selectedUser.name}</h3>
                  <span className="text-xs text-slate-500 font-mono">Citizen Account #{selectedUser.id}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Email Address</span>
                  <span className="font-bold text-slate-900">{selectedUser.email}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Mobile Phone</span>
                  <span className="font-bold text-slate-900">{selectedUser.phone || 'N/A'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Account Status</span>
                  <span className="font-bold text-emerald-600">Active</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Registered Date</span>
                  <span className="font-bold text-slate-900">
                    {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Submitted Applications for this User */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-orange-500" />
                  <span>Submitted Applications History</span>
                </h4>

                {applications.filter(a => a.user_email === selectedUser.email || a.user_name === selectedUser.name).length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {applications.filter(a => a.user_email === selectedUser.email || a.user_name === selectedUser.name).map(app => (
                      <div key={app.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-orange-600 text-xs">{app.application_number}</span>
                          <span className="text-slate-900 font-bold block text-xs">{app.service_name}</span>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                    No applications submitted by this citizen yet.
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors shadow"
            >
              Close Details Inspector
            </button>

          </div>
        </div>
      )}

      {/* INSPECTOR & REVIEW WORKSPACE MODAL (STEP 26) */}
      {appDetails && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-100 border border-slate-300 rounded-3xl max-w-6xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Application Review Header */}
            <div className="bg-[#0b192c] text-white p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-black text-orange-400 bg-orange-500/20 px-2.5 py-0.5 rounded border border-orange-500/30">
                    {appDetails.application_number}
                  </span>
                  <StatusBadge status={appDetails.status} />
                </div>
                <h3 className="font-black text-2xl text-white mt-1">
                  {appDetails.service_name}
                </h3>
                <p className="text-xs text-slate-300">
                  Submitted by <strong className="text-white">{appDetails.user_name}</strong> on {new Date(appDetails.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setAppDetails(null)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl border border-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* TWO-COLUMN REVIEW WORKSPACE (STEP 26) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LEFT COLUMN: APPLICANT INFO, FIELDS, DOCS, PAYMENTS, HISTORY */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Applicant Information Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                    <UserCheck className="w-4 h-4 text-orange-500" />
                    <span>Applicant Primary Contact Information</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block font-medium">Citizen Name</span>
                      <span className="font-bold text-slate-900 text-sm">{appDetails.user_name || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block font-medium">Mobile Number</span>
                      <span className="font-bold text-slate-900 text-sm">{appDetails.user_phone || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block font-medium">Email Address</span>
                      <span className="font-bold text-slate-900 text-sm truncate block">{appDetails.user_email || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Submitted Dynamic Service Fields */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                    <FileText className="w-4 h-4 text-orange-500" />
                    <span>Submitted Service Application Values</span>
                  </h4>
                  {appDetails.field_values && appDetails.field_values.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {appDetails.field_values.map((fv) => (
                        <div key={fv.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-slate-500 block font-medium">{fv.field_label}</span>
                          <span className="font-bold text-slate-900">{fv.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No dynamic form fields submitted.</p>
                  )}
                </div>

                {/* 3. Uploaded Documents & Verification Desk */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="flex items-center space-x-2">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>Uploaded Proof Documents & Verification Desk</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Officer Audit Logged</span>
                  </h4>

                  {appDetails.documents && appDetails.documents.length > 0 ? (
                    <div className="space-y-3">
                      {appDetails.documents.map((doc) => {
                        const isVerified = doc.verification_status === 'Verified';
                        const isRejected = doc.verification_status === 'Rejected';

                        return (
                          <div key={doc.id} className={`p-4 rounded-xl border ${
                            isRejected ? 'border-rose-200 bg-rose-50/50' : isVerified ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'
                          } space-y-3`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="space-y-0.5">
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-sm text-slate-900">{doc.document_name}</span>
                                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
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
                                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center space-x-1"
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
                  ) : (
                    <p className="text-xs text-slate-500">No proof documents uploaded for this application.</p>
                  )}
                </div>

                {/* 4. Payment Information Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Payment Information</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block font-medium">Service Fee</span>
                      <span className="font-extrabold text-emerald-600 text-sm">₹{appDetails.total_fee || 50}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block font-medium">Payment Status</span>
                      <span className="font-bold text-emerald-700 uppercase">PAID (Online)</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block font-medium">Gateway</span>
                      <span className="font-bold text-slate-800">Razorpay Direct</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block font-medium">Audit Txn</span>
                      <span className="font-mono text-slate-600 text-[11px]">#PAY-2026-OK</span>
                    </div>
                  </div>
                </div>

                {/* 5. Status History Timeline */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                    <History className="w-4 h-4 text-orange-500" />
                    <span>Application Status Audit Timeline</span>
                  </h4>
                  {appDetails.history && appDetails.history.length > 0 ? (
                    <div className="relative border-l-2 border-slate-200 ml-3 space-y-4 pl-6 py-2">
                      {appDetails.history.map((hist, idx) => (
                        <div key={idx} className="relative">
                          <div className="w-3 h-3 bg-orange-500 rounded-full absolute -left-[31px] top-1 ring-4 ring-white"></div>
                          <div className="text-xs space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-900 uppercase">{hist.status}</span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-500">{new Date(hist.created_at).toLocaleString()}</span>
                            </div>
                            <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">{hist.admin_remarks}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Initial submission status active.</p>
                  )}
                </div>

              </div>

              {/* RIGHT COLUMN: ACTION & STATUS DESK */}
              <div className="space-y-6">
                
                {/* Status Update Form */}
                <form onSubmit={handleUpdateStatusSubmit} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                  <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                    <Edit3 className="w-4 h-4 text-orange-500" />
                    <span>Admin Status & Remarks Desk</span>
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Target Status</label>
                      <select
                        value={updateStatus}
                        onChange={(e) => setUpdateStatus(e.target.value)}
                        className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-3 py-2.5 border border-slate-300 outline-none font-bold"
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

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Official Remarks (Citizen Visible)</label>
                      <textarea
                        rows={3}
                        required
                        value={adminRemarks}
                        onChange={(e) => setAdminRemarks(e.target.value)}
                        placeholder="Enter specific verification remarks..."
                        className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl p-3 border border-slate-300 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingStatus}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl shadow transition-colors"
                    >
                      {savingStatus ? 'Saving Status...' : 'Save & Publish Status Update'}
                    </button>
                  </div>
                </form>

                {/* Digital Certificate Generator */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                  <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                    <Award className="w-4 h-4 text-orange-500" />
                    <span>Digital Certificate Desk</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Generate and issue an official verified digital certificate for this customer request.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleIssueCertificate(appDetails.id)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs py-3 rounded-xl shadow transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Award className="w-4 h-4" />
                    <span>Issue Digital Certificate</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* SERVICE DETAILS & CONFIGURATION INSPECTOR MODAL (STEP 28) */}
      {selectedService && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 font-black flex items-center justify-center text-lg shadow-sm">
                  <Grid className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      {selectedService.category_name || selectedService.category || 'General'}
                    </span>
                    <span className="text-xs font-mono text-emerald-600 font-bold">• Active Catalog</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">{selectedService.name}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedService(null)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Basic Overview & Fee Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Government & Service Fee</span>
                  <span className="font-black text-emerald-600 text-base">₹{selectedService.total_fee || selectedService.govt_fee || 60}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Processing SLA</span>
                  <span className="font-bold text-slate-900">{selectedService.processing_time || '2-3 Business Days'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-slate-500 block font-medium">Status</span>
                  <span className="font-bold text-emerald-600 uppercase">Active</span>
                </div>
              </div>

              {/* Service Description */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Service Scope & Description</span>
                <p className="text-slate-700 leading-relaxed">
                  {selectedService.description || 'Official digital services processing and government department application assistance.'}
                </p>
              </div>

              {/* Configured Form Fields Desk */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-orange-500" />
                  <span>Configured Dynamic Application Form Fields</span>
                </h4>

                {selectedService.fields && selectedService.fields.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedService.fields.map((fld, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-900 block">{fld.label || fld.name || `Field #${idx+1}`}</span>
                          <span className="text-[10px] text-slate-500 font-mono">Type: {fld.type || 'text'}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          fld.required ? 'bg-orange-100 text-orange-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {fld.required ? 'Required' : 'Optional'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                      <span>1. Citizen Identity & Full Legal Name</span>
                      <span className="bg-orange-100 text-orange-800 text-[10px] px-2 py-0.5 rounded">Required</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800 pt-1 border-t border-slate-200/60">
                      <span>2. Mobile Phone Number & Email Address</span>
                      <span className="bg-orange-100 text-orange-800 text-[10px] px-2 py-0.5 rounded">Required</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Configured Required Documents Desk */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Configured Required Proof Documents</span>
                </h4>

                {selectedService.required_documents && selectedService.required_documents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedService.required_documents.map((doc, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-900">{typeof doc === 'string' ? doc : doc.name}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">Format: PDF/JPEG (Max 5MB)</span>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          Mandatory Verification
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900">Aadhaar Card / Government Identity Proof</span>
                        <span className="text-[10px] text-slate-400 block font-mono">Format: PDF/JPEG (Max 5MB)</span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Mandatory
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>

            <button
              onClick={() => setSelectedService(null)}
              className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors shadow"
            >
              Close Service Inspector
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
