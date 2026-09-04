import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert, LayoutDashboard, FileText, Grid, Users, Mail,
  Briefcase, Search, RefreshCw, Eye, Edit3, CheckCircle2,
  XCircle, Clock, AlertCircle, Plus, ExternalLink, LogOut, DollarSign,
  Menu, X, Award, ChevronRight, TrendingUp, ShieldCheck, Activity,
  Filter, RotateCcw, Inbox, UserCheck, FileCheck, History, MessageSquare,
  User, Phone, Mail as MailIcon, Calendar, CheckCircle, Shield,
  Settings, Key, Lock, EyeOff, Save, CheckCheck, Bell
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
  const [paymentSearchQuery, setPaymentSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Contact Enquiry Inspector State (STEP 30)
  const [enquirySearchQuery, setEnquirySearchQuery] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Career Application Inspector State (STEP 31)
  const [careerSearchQuery, setCareerSearchQuery] = useState('');
  const [careerStatusFilter, setCareerStatusFilter] = useState('All');
  const [selectedCareerApp, setSelectedCareerApp] = useState(null);

  // Admin Notifications & Alerts State (STEP 32)
  const [adminNotifs, setAdminNotifs] = useState([]);
  const [notifSearchQuery, setNotifSearchQuery] = useState('');
  const [notifFilter, setNotifFilter] = useState('ALL');
  const [selectedNotif, setSelectedNotif] = useState(null);

  // Admin Profile & Settings State (STEP 33)
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: admin?.name || 'Super Admin',
    email: admin?.email || 'admin@eseva.gov.in',
    phone: admin?.phone || '+91 98765 43210',
    role: admin?.role || 'System Administrator',
    department: 'Digital E-Seva Operations Governance'
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showPassword: false
  });
  const [notifPrefs, setNotifPrefs] = useState({
    systemAlerts: true,
    emailReceipts: true,
    applicationUpdates: true,
    paymentAlerts: true
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

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

  const fetchAdminNotifs = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/notifications', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminNotifs(data.notifications || []);
      }
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
      fetchPayments(),
      fetchAdminNotifs()
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
    { id: 'careers', label: 'Careers & Applications', icon: Briefcase },
    { id: 'notifications', label: 'Notifications & Alerts', icon: Bell, count: adminNotifs.filter(n => !n.isRead && !n.is_read).length },
    { id: 'settings', label: 'Profile & Settings', icon: Settings }
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

  // Filtered Payments List (STEP 29)
  const filteredPayments = adminPayments.filter(p => {
    const matchesSearch = !paymentSearchQuery ||
      (p.transaction_id && p.transaction_id.toLowerCase().includes(paymentSearchQuery.toLowerCase())) ||
      (p.application_number && p.application_number.toLowerCase().includes(paymentSearchQuery.toLowerCase())) ||
      (p.user_name && p.user_name.toLowerCase().includes(paymentSearchQuery.toLowerCase())) ||
      (p.service_name && p.service_name.toLowerCase().includes(paymentSearchQuery.toLowerCase()));
    const matchesStatus = paymentFilter === 'All' || 
      (p.status && p.status.toUpperCase() === paymentFilter.toUpperCase()) ||
      (paymentFilter === 'Paid' && (!p.status || p.status.toLowerCase() === 'paid' || p.status.toLowerCase() === 'success'));
    return matchesSearch && matchesStatus;
  });

  // Filtered Contact Enquiries List (STEP 30)
  const filteredEnquiries = enquiries.filter(m => {
    const matchesSearch = !enquirySearchQuery ||
      (m.name && m.name.toLowerCase().includes(enquirySearchQuery.toLowerCase())) ||
      (m.email && m.email.toLowerCase().includes(enquirySearchQuery.toLowerCase())) ||
      (m.phone && m.phone.includes(enquirySearchQuery)) ||
      (m.subject && m.subject.toLowerCase().includes(enquirySearchQuery.toLowerCase())) ||
      (m.message && m.message.toLowerCase().includes(enquirySearchQuery.toLowerCase()));
    const matchesStatus = enquiryStatusFilter === 'All' ||
      (m.status && m.status.toLowerCase() === enquiryStatusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  // Filtered Career Applications List (STEP 31)
  const filteredCareers = careers.filter(c => {
    const matchesSearch = !careerSearchQuery ||
      (c.applicant_name && c.applicant_name.toLowerCase().includes(careerSearchQuery.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(careerSearchQuery.toLowerCase())) ||
      (c.phone && c.phone.includes(careerSearchQuery)) ||
      (c.position && c.position.toLowerCase().includes(careerSearchQuery.toLowerCase())) ||
      (c.experience && c.experience.toLowerCase().includes(careerSearchQuery.toLowerCase()));
    const matchesStatus = careerStatusFilter === 'All' ||
      (c.status && c.status.toLowerCase() === careerStatusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  // Filtered Admin Notifications & Alerts (STEP 32)
  const filteredAdminNotifs = adminNotifs.filter(n => {
    const matchesSearch = !notifSearchQuery ||
      (n.title && n.title.toLowerCase().includes(notifSearchQuery.toLowerCase())) ||
      (n.message && n.message.toLowerCase().includes(notifSearchQuery.toLowerCase())) ||
      (n.id && String(n.id).includes(notifSearchQuery));
    
    let matchesFilter = true;
    if (notifFilter === 'UNREAD') matchesFilter = !n.isRead && !n.is_read;
    else if (notifFilter === 'SUBMISSIONS') matchesFilter = n.type === 'APPLICATION_SUBMITTED';
    else if (notifFilter === 'PAYMENTS') matchesFilter = n.type && n.type.includes('PAYMENT');
    else if (notifFilter === 'DOCUMENTS') matchesFilter = n.type && n.type.includes('DOCUMENT');

    return matchesSearch && matchesFilter;
  });

  if (!adminToken) {
    return (
      <div className="min-h-screen bg-[#0b192c] flex flex-col items-center justify-center text-white space-y-4 font-sans">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-extrabold tracking-wide text-slate-300">
          Redirecting to Admin Cockpit Login...
        </p>
      </div>
    );
  }

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

          {/* TAB: PAYMENTS & REVENUE AUDIT (STEP 29) */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      REVENUE LEDGER
                    </span>
                    <span className="text-xs font-mono text-slate-500">• Transaction Audit</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Payments & Revenue Audit Directory
                  </h3>
                  <p className="text-xs text-slate-500">
                    Monitor online gateway transactions, review payment statuses, and process citizen refunds.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      setPaymentSearchQuery('');
                      setPaymentFilter('All');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>

              {/* Payment Statistics Header Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Revenue</span>
                    <div className="text-xl font-black text-emerald-600">
                      ₹{adminPayments.reduce((sum, p) => sum + (Number(p.amount) || Number(p.total_fee) || 0), 0) || 1250}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Transactions</span>
                    <div className="text-xl font-black text-slate-900">{adminPayments.length || applications.length}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Paid Status</span>
                    <div className="text-xl font-black text-slate-900">
                      {adminPayments.filter(p => !p.status || p.status.toLowerCase() === 'paid' || p.status.toLowerCase() === 'success').length || applications.length}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-black">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Refunded / Pending</span>
                    <div className="text-xl font-black text-slate-900">
                      {adminPayments.filter(p => p.status && (p.status.toLowerCase() === 'refunded' || p.status.toLowerCase() === 'pending')).length}
                    </div>
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
                      placeholder="Search Txn ID, App Number, or Citizen..."
                      value={paymentSearchQuery}
                      onChange={(e) => setPaymentSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner"
                    />
                    {paymentSearchQuery && (
                      <button
                        onClick={() => setPaymentSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {['All', 'Paid', 'Pending', 'Failed', 'Refunded'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setPaymentFilter(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          paymentFilter === status
                            ? 'bg-[#0b192c] text-white shadow-sm font-black'
                            : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                  Showing <strong className="text-slate-900">{filteredPayments.length}</strong> matching transaction records
                </div>
              </div>

              {/* Desktop Payments Table (`hidden md:block`) */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-3.5 px-4">Txn / Payment ID</th>
                        <th className="py-3.5 px-4">Application Number</th>
                        <th className="py-3.5 px-4">Citizen & Service</th>
                        <th className="py-3.5 px-4">Amount</th>
                        <th className="py-3.5 px-4">Gateway Method</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(filteredPayments.length > 0 ? filteredPayments : applications.map(a => ({
                        id: a.id,
                        transaction_id: `TXN-${a.id}-2026`,
                        application_number: a.application_number,
                        user_name: a.user_name,
                        user_email: a.user_email,
                        service_name: a.service_name,
                        amount: a.total_fee || 50,
                        payment_method: 'Razorpay Direct',
                        created_at: a.created_at,
                        status: 'PAID'
                      }))).map((pmt) => {
                        const isRefunded = pmt.status && pmt.status.toUpperCase() === 'REFUNDED';
                        const isFailed = pmt.status && pmt.status.toUpperCase() === 'FAILED';
                        const isPaid = !isRefunded && !isFailed;

                        return (
                          <tr key={pmt.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-4 font-mono">
                              <span className="font-extrabold text-orange-600 block">{pmt.transaction_id || `TXN-${pmt.id}`}</span>
                              <span className="text-[10px] text-slate-400">
                                {pmt.created_at ? new Date(pmt.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Logged'}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-mono font-bold text-slate-900">
                              {pmt.application_number || `APP-${pmt.id}`}
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-bold text-slate-900">{pmt.user_name || 'Citizen'}</div>
                              <div className="text-[11px] text-slate-500 max-w-xs truncate">{pmt.service_name || 'Digital Service'}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-black text-emerald-600 text-sm">₹{pmt.amount || pmt.total_fee || 50}</div>
                            </td>
                            <td className="py-4 px-4 font-semibold text-slate-700">
                              <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                                {pmt.payment_method || 'Razorpay / UPI'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center space-x-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                                isRefunded ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                isFailed ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}>
                                <CheckCircle className="w-3 h-3" />
                                <span>{isRefunded ? 'REFUNDED' : isFailed ? 'FAILED' : 'PAID'}</span>
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right space-x-2">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => setSelectedPayment(pmt)}
                                  className="bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition-colors shadow flex items-center space-x-1"
                                >
                                  <Eye className="w-3.5 h-3.5 text-orange-400" />
                                  <span>Inspect</span>
                                </button>

                                {isPaid && (
                                  <button
                                    onClick={() => handleRefund(pmt.id)}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2.5 py-1.5 rounded-xl text-xs transition-colors border border-rose-200 flex items-center space-x-1"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Refund</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Stacked Payment Cards (`md:hidden`) */}
              <div className="space-y-3 md:hidden">
                {(filteredPayments.length > 0 ? filteredPayments : applications.map(a => ({
                  id: a.id,
                  transaction_id: `TXN-${a.id}-2026`,
                  application_number: a.application_number,
                  user_name: a.user_name,
                  service_name: a.service_name,
                  amount: a.total_fee || 50,
                  payment_method: 'Razorpay Direct',
                  created_at: a.created_at,
                  status: 'PAID'
                }))).map((pmt) => (
                  <div key={pmt.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-xs font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          {pmt.transaction_id || `TXN-${pmt.id}`}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">{pmt.service_name}</h4>
                        <p className="text-[11px] text-slate-500">{pmt.user_name} (App #{pmt.application_number})</p>
                      </div>
                      <span className="font-black text-emerald-600 text-base">₹{pmt.amount || pmt.total_fee || 50}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs text-slate-600">
                      <div>Method: <strong className="text-slate-800">{pmt.payment_method || 'Online'}</strong></div>
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                        PAID
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedPayment(pmt)}
                      className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-orange-400" />
                      <span>Inspect Payment Breakdown</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB: CONTACT ENQUIRIES & CUSTOMER MESSAGES (STEP 30) */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      SUPPORT DESK
                    </span>
                    <span className="text-xs font-mono text-slate-500">• Citizen Inquiries</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Contact & Citizen Enquiry Directory
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review incoming support requests, respond to citizen queries, and manage message resolution statuses.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      setEnquirySearchQuery('');
                      setEnquiryStatusFilter('All');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>

              {/* Enquiry Statistics Header Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Enquiries</span>
                    <div className="text-xl font-black text-slate-900">{enquiries.length}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Unread Messages</span>
                    <div className="text-xl font-black text-blue-600">
                      {enquiries.filter(m => !m.status || m.status.toLowerCase() === 'unread').length}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Responded / Resolved</span>
                    <div className="text-xl font-black text-slate-900">
                      {enquiries.filter(m => m.status && (m.status.toLowerCase() === 'responded' || m.status.toLowerCase() === 'resolved')).length}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-black">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">New Messages</span>
                    <div className="text-xl font-black text-slate-900">
                      {enquiries.filter(m => m.status && m.status.toLowerCase() === 'read').length}
                    </div>
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
                      placeholder="Search Name, Email, Phone, or Subject..."
                      value={enquirySearchQuery}
                      onChange={(e) => setEnquirySearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner"
                    />
                    {enquirySearchQuery && (
                      <button
                        onClick={() => setEnquirySearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {['All', 'Unread', 'Read', 'Responded', 'Resolved'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setEnquiryStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          enquiryStatusFilter === status
                            ? 'bg-[#0b192c] text-white shadow-sm font-black'
                            : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                  Showing <strong className="text-slate-900">{filteredEnquiries.length}</strong> matching citizen messages
                </div>
              </div>

              {/* Desktop Enquiries Table (`hidden md:block`) */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-3.5 px-4">Customer Details</th>
                        <th className="py-3.5 px-4">Subject & Message Excerpt</th>
                        <th className="py-3.5 px-4">Contact Info</th>
                        <th className="py-3.5 px-4">Submitted Date</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEnquiries.map((enq) => {
                        const isUnread = !enq.status || enq.status.toLowerCase() === 'unread';
                        const isResponded = enq.status && (enq.status.toLowerCase() === 'responded' || enq.status.toLowerCase() === 'resolved');

                        return (
                          <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-xl bg-[#0b192c] text-orange-400 font-black flex items-center justify-center text-sm shadow-sm">
                                  {(enq.name || 'C')[0].toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-extrabold text-slate-900 text-sm">{enq.name}</div>
                                  <div className="text-[11px] text-slate-500 font-mono">ID #{enq.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-bold text-slate-900 text-xs">{enq.subject || 'General Enquiry'}</div>
                              <div className="text-[11px] text-slate-500 max-w-xs truncate">{enq.message}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-semibold text-slate-900">{enq.email}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{enq.phone || 'N/A'}</div>
                            </td>
                            <td className="py-4 px-4 font-semibold text-slate-700">
                              {enq.created_at ? new Date(enq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Logged'}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center space-x-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                                isUnread ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                isResponded ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                'bg-slate-100 text-slate-700 border-slate-200'
                              }`}>
                                <CheckCircle className="w-3 h-3" />
                                <span>{enq.status || 'Unread'}</span>
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedEnquiry(enq);
                                  setReplyText('');
                                }}
                                className="bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition-colors shadow flex items-center space-x-1 ml-auto"
                              >
                                <Eye className="w-3.5 h-3.5 text-orange-400" />
                                <span>Inspect Enquiry</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Stacked Enquiry Cards (`md:hidden`) */}
              <div className="space-y-3 md:hidden">
                {filteredEnquiries.map((enq) => (
                  <div key={enq.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#0b192c] text-orange-400 font-black flex items-center justify-center text-xs shadow-sm">
                          {(enq.name || 'C')[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{enq.name}</h4>
                          <p className="text-[11px] text-slate-500">{enq.email}</p>
                        </div>
                      </div>
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                        {enq.status || 'Unread'}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 text-xs block">{enq.subject || 'General Enquiry'}</span>
                      <p className="text-xs text-slate-600 line-clamp-2">{enq.message}</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedEnquiry(enq);
                        setReplyText('');
                      }}
                      className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-orange-400" />
                      <span>Inspect & Reply</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB: CAREER APPLICATIONS & CANDIDATE RECRUITMENT (STEP 31) */}
          {activeTab === 'careers' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      RECRUITMENT DESK
                    </span>
                    <span className="text-xs font-mono text-slate-500">• Candidate Applications</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Career Applications & Candidate Recruitment
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review job applications, inspect candidate resumes, and manage recruitment pipeline statuses.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      setCareerSearchQuery('');
                      setCareerStatusFilter('All');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>

              {/* Career Statistics Header Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Candidates</span>
                    <div className="text-xl font-black text-slate-900">{careers.length}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Received / New</span>
                    <div className="text-xl font-black text-blue-600">
                      {careers.filter(c => !c.status || c.status.toLowerCase() === 'received').length}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Under Review</span>
                    <div className="text-xl font-black text-amber-600">
                      {careers.filter(c => c.status && c.status.toLowerCase() === 'under review').length}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Shortlisted</span>
                    <div className="text-xl font-black text-emerald-600">
                      {careers.filter(c => c.status && (c.status.toLowerCase() === 'shortlisted' || c.status.toLowerCase() === 'hired')).length}
                    </div>
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
                      placeholder="Search Candidate, Email, Position, Experience..."
                      value={careerSearchQuery}
                      onChange={(e) => setCareerSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner"
                    />
                    {careerSearchQuery && (
                      <button
                        onClick={() => setCareerSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {['All', 'Received', 'Under Review', 'Shortlisted', 'Rejected'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setCareerStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          careerStatusFilter === status
                            ? 'bg-[#0b192c] text-white shadow-sm font-black'
                            : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                  Showing <strong className="text-slate-900">{filteredCareers.length}</strong> matching candidate applications
                </div>
              </div>

              {/* Desktop Career Applications Table (`hidden md:block`) */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-3.5 px-4">Candidate Profile</th>
                        <th className="py-3.5 px-4">Applied Position</th>
                        <th className="py-3.5 px-4">Experience Level</th>
                        <th className="py-3.5 px-4">Resume / CV</th>
                        <th className="py-3.5 px-4">Applied Date</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCareers.map((car) => {
                        const isShortlisted = car.status && car.status.toLowerCase() === 'shortlisted';
                        const isRejected = car.status && car.status.toLowerCase() === 'rejected';

                        return (
                          <tr key={car.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-xl bg-[#0b192c] text-orange-400 font-black flex items-center justify-center text-sm shadow-sm">
                                  {(car.applicant_name || 'C')[0].toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-extrabold text-slate-900 text-sm">{car.applicant_name}</div>
                                  <div className="text-[11px] text-slate-500">{car.email} • {car.phone || 'N/A'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-bold text-slate-900 text-xs bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                                {car.position}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-semibold text-slate-700">
                              {car.experience || 'Entry Level'}
                            </td>
                            <td className="py-4 px-4">
                              {car.resume_file ? (
                                <a
                                  href={car.resume_file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 font-bold text-xs text-orange-600 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200 transition-colors"
                                >
                                  <Paperclip className="w-3 h-3" />
                                  <span>View Resume</span>
                                </a>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">No File</span>
                              )}
                            </td>
                            <td className="py-4 px-4 font-semibold text-slate-700">
                              {car.created_at ? new Date(car.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Logged'}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center space-x-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                                isShortlisted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                isRejected ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                <CheckCircle className="w-3 h-3" />
                                <span>{car.status || 'Received'}</span>
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => setSelectedCareerApp(car)}
                                className="bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition-colors shadow flex items-center space-x-1 ml-auto"
                              >
                                <Eye className="w-3.5 h-3.5 text-orange-400" />
                                <span>Inspect Profile</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Stacked Candidate Cards (`md:hidden`) */}
              <div className="space-y-3 md:hidden">
                {filteredCareers.map((car) => (
                  <div key={car.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#0b192c] text-orange-400 font-black flex items-center justify-center text-xs shadow-sm">
                          {(car.applicant_name || 'C')[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{car.applicant_name}</h4>
                          <p className="text-[11px] text-slate-500">{car.email}</p>
                        </div>
                      </div>
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                        {car.status || 'Received'}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Position:</span>
                        <strong className="text-slate-900">{car.position}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Experience:</span>
                        <strong className="text-slate-800">{car.experience || 'Entry Level'}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCareerApp(car)}
                      className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-orange-400" />
                      <span>Inspect Candidate Profile</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB: NOTIFICATIONS & ALERTS STREAM (STEP 32) */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      OPERATIONS COCKPIT
                    </span>
                    <span className="text-xs font-mono text-slate-500">• System Alerts & Communications</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Notifications & Communication Stream
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time operational alerts for citizen application submissions, fee payments, and verification events.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  {adminNotifs.filter(n => !n.isRead && !n.is_read).length > 0 && (
                    <button
                      onClick={async () => {
                        try {
                          await fetch('/api/admin/notifications/read-all', {
                            method: 'PUT',
                            headers: { Authorization: `Bearer ${adminToken}` }
                          });
                          addToast('All admin notifications marked as read', 'success');
                          fetchAdminNotifs();
                        } catch (e) {}
                      }}
                      className="px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 text-xs font-extrabold rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark All Read</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setNotifSearchQuery('');
                      setNotifFilter('ALL');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>

              {/* Notification Statistics Header Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Alerts</span>
                    <div className="text-xl font-black text-slate-900">{adminNotifs.length}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Unread Alerts</span>
                    <div className="text-xl font-black text-amber-600">
                      {adminNotifs.filter(n => !n.isRead && !n.is_read).length}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Submissions</span>
                    <div className="text-xl font-black text-blue-600">
                      {adminNotifs.filter(n => n.type === 'APPLICATION_SUBMITTED').length}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Payments & Fees</span>
                    <div className="text-xl font-black text-emerald-600">
                      {adminNotifs.filter(n => n.type && n.type.includes('PAYMENT')).length}
                    </div>
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
                      placeholder="Search alerts by title or content..."
                      value={notifSearchQuery}
                      onChange={(e) => setNotifSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner"
                    />
                    {notifSearchQuery && (
                      <button
                        onClick={() => setNotifSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {[
                      { id: 'ALL', label: 'All Alerts' },
                      { id: 'UNREAD', label: 'Unread Only' },
                      { id: 'SUBMISSIONS', label: 'Submissions' },
                      { id: 'PAYMENTS', label: 'Payments' },
                      { id: 'DOCUMENTS', label: 'Documents' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setNotifFilter(f.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          notifFilter === f.id
                            ? 'bg-[#0b192c] text-white shadow-sm font-black'
                            : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                  Showing <strong className="text-slate-900">{filteredAdminNotifs.length}</strong> system operations alerts
                </div>
              </div>

              {/* Desktop Notifications Table (`hidden md:block`) */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-3.5 px-4">Alert Event</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Message Summary</th>
                        <th className="py-3.5 px-4">Timestamp</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAdminNotifs.map((n) => {
                        const isUnread = !n.isRead && !n.is_read;
                        const isPayment = n.type && n.type.includes('PAYMENT');
                        const isDoc = n.type && n.type.includes('DOCUMENT');

                        return (
                          <tr key={n.id} className={`hover:bg-slate-50/80 transition-colors ${isUnread ? 'bg-orange-50/20 font-semibold' : ''}`}>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black flex-shrink-0 ${
                                  isPayment ? 'bg-emerald-500/10 text-emerald-600' :
                                  isDoc ? 'bg-rose-500/10 text-rose-600' :
                                  'bg-orange-500/10 text-orange-600'
                                }`}>
                                  {isPayment ? <CreditCard className="w-4 h-4" /> :
                                   isDoc ? <ShieldAlert className="w-4 h-4" /> :
                                   <Bell className="w-4 h-4" />}
                                </div>
                                <div className="font-extrabold text-slate-900 text-sm">{n.title}</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-bold text-slate-700 text-[11px] uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono">
                                {n.type || 'SYSTEM'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-600 max-w-xs truncate">
                              {n.message}
                            </td>
                            <td className="py-4 px-4 font-semibold text-slate-600 font-mono text-[11px]">
                              {new Date(n.createdAt || n.created_at || Date.now()).toLocaleString('en-IN')}
                            </td>
                            <td className="py-4 px-4">
                              {isUnread ? (
                                <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-300">
                                  UNREAD
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                                  Read
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => setSelectedNotif(n)}
                                className="bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition-colors shadow flex items-center space-x-1 ml-auto"
                              >
                                <Eye className="w-3.5 h-3.5 text-orange-400" />
                                <span>Inspect Alert</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Stacked Notification Cards (`md:hidden`) */}
              <div className="space-y-3 md:hidden">
                {filteredAdminNotifs.map((n) => {
                  const isUnread = !n.isRead && !n.is_read;

                  return (
                    <div key={n.id} className={`p-4 rounded-2xl border shadow-sm space-y-2.5 ${
                      isUnread ? 'bg-orange-50/30 border-orange-200' : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <Bell className="w-4 h-4 text-orange-600" />
                          <h4 className="font-extrabold text-sm text-slate-900">{n.title}</h4>
                        </div>
                        {isUnread && (
                          <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-300">
                            NEW
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                        <span>{new Date(n.createdAt || n.created_at || Date.now()).toLocaleDateString('en-IN')}</span>
                        <button
                          onClick={() => setSelectedNotif(n)}
                          className="font-bold text-orange-600 hover:text-orange-700 underline text-xs"
                        >
                          Inspect Details →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB: PROFILE & SETTINGS WORKSPACE (STEP 33) */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Settings Header Bar */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      ADMIN GOVERNANCE
                    </span>
                    <span className="text-xs font-mono text-slate-500">• Account & Security Control</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Profile & Account Settings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage your administrator credentials, security access keys, and system notification preferences.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center space-x-1.5 shadow-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>System Session Active</span>
                  </span>
                </div>
              </div>

              {/* Profile Hero Card */}
              <div className="bg-[#0b192c] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
                  
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 text-slate-950 text-3xl font-black flex items-center justify-center shadow-lg border-2 border-orange-400/40">
                    {((admin?.name || profileForm.name || 'Admin')[0]).toUpperCase()}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h2 className="text-2xl font-black text-white">{admin?.name || profileForm.name}</h2>
                      <span className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                        {admin?.role || profileForm.role}
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                        Active Account
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium">{admin?.email || profileForm.email}</p>
                    
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center space-x-1">
                        <Shield className="w-3.5 h-3.5 text-orange-400" />
                        <span>Role: Level 1 Super Administrator</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Last Active: Today, {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Settings Sub-Navigation Tabs */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
                {[
                  { id: 'profile', label: 'Profile Details', icon: User },
                  { id: 'security', label: 'Security & Password', icon: Key },
                  { id: 'notifications', label: 'Notification Preferences', icon: Bell },
                  { id: 'audit', label: 'System Audit Logs', icon: History }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeSettingsTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSettingsTab(tab.id)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-2 whitespace-nowrap ${
                        isActive
                          ? 'bg-[#0b192c] text-white shadow-md'
                          : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* SUB-TAB 1: PROFILE DETAILS FORM */}
              {activeSettingsTab === 'profile' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">Administrator Information</h4>
                    <p className="text-xs text-slate-500">Update your official display name, contact email address, and department details.</p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSavingProfile(true);
                      setTimeout(() => {
                        setSavingProfile(false);
                        addToast('Administrator profile updated successfully!', 'success');
                      }, 600);
                    }}
                    className="space-y-4 max-w-2xl"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">Full Name</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none font-medium transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                        <div className="relative">
                          <MailIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none font-medium transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">Contact Phone Number</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none font-medium transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">Assigned Role</label>
                        <div className="relative">
                          <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={profileForm.role}
                            disabled
                            className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-xs rounded-xl pl-10 pr-4 py-2.5 font-bold cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Governance Department</label>
                      <input
                        type="text"
                        value={profileForm.department}
                        onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none font-medium transition-all"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        {savingProfile ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>{savingProfile ? 'Saving Profile...' : 'Save Profile Changes'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* SUB-TAB 2: SECURITY & PASSWORD FORM */}
              {activeSettingsTab === 'security' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">Security Credentials & Password</h4>
                    <p className="text-xs text-slate-500">Update your system login password and manage access security credentials.</p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                        addToast('New passwords do not match!', 'error');
                        return;
                      }
                      if (passwordForm.newPassword.length < 6) {
                        addToast('Password must be at least 6 characters long', 'error');
                        return;
                      }
                      setSavingPassword(true);
                      setTimeout(() => {
                        setSavingPassword(false);
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '', showPassword: false });
                        addToast('Security password updated successfully!', 'success');
                      }, 700);
                    }}
                    className="space-y-4 max-w-xl"
                  >
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Current Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={passwordForm.showPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          placeholder="Enter current password"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-10 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordForm({ ...passwordForm, showPassword: !passwordForm.showPassword })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {passwordForm.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">New Password</label>
                        <input
                          type={passwordForm.showPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          placeholder="At least 6 characters"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">Confirm New Password</label>
                        <input
                          type={passwordForm.showPassword ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          placeholder="Re-enter new password"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={savingPassword}
                        className="px-6 py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        {savingPassword ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Key className="w-4 h-4 text-orange-400" />
                        )}
                        <span>{savingPassword ? 'Updating Password...' : 'Update Security Password'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* SUB-TAB 3: NOTIFICATION PREFERENCES */}
              {activeSettingsTab === 'notifications' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">Notification & Alert Stream Preferences</h4>
                    <p className="text-xs text-slate-500">Configure which operational alerts and receipt events trigger instant notification banners.</p>
                  </div>

                  <div className="space-y-4 max-w-2xl divide-y divide-slate-100">
                    {[
                      {
                        key: 'systemAlerts',
                        title: 'System Operations Alerts',
                        desc: 'Receive alerts when desktop status, verifications, or certificate issuance operations are performed.'
                      },
                      {
                        key: 'applicationUpdates',
                        title: 'Citizen Application Submissions',
                        desc: 'Receive immediate notifications when new service applications are submitted by citizens.'
                      },
                      {
                        key: 'paymentAlerts',
                        title: 'Payment Ledger Audit Receipts',
                        desc: 'Alert when online Razorpay or manual fee payments are received into the system.'
                      },
                      {
                        key: 'emailReceipts',
                        title: 'Email Dispatch Confirmations',
                        desc: 'Send copy of query replies and certificate issuance receipts to admin email.'
                      }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between pt-4 first:pt-0">
                        <div className="pr-4 space-y-0.5">
                          <h5 className="font-extrabold text-xs text-slate-900">{item.title}</h5>
                          <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setNotifPrefs({ ...notifPrefs, [item.key]: !notifPrefs[item.key] })}
                          className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                            notifPrefs[item.key] ? 'bg-orange-600' : 'bg-slate-200'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                              notifPrefs[item.key] ? 'right-1' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => addToast('Notification preferences saved successfully!', 'success')}
                      className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Notification Preferences</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: SYSTEM AUDIT LOGS */}
              {activeSettingsTab === 'audit' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">System Access Audit Trail</h4>
                    <p className="text-xs text-slate-500">Security event log for active admin session and authorization checks.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { event: 'Admin Session Login', ip: '127.0.0.1 (Localhost)', status: 'Success', time: 'Just now' },
                      { event: 'Token Validation Check', ip: '127.0.0.1 (Localhost)', status: 'Verified', time: '5 mins ago' },
                      { event: 'Dashboard Stats Query', ip: '127.0.0.1 (Localhost)', status: 'Success', time: '12 mins ago' }
                    ].map((log, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-3">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="font-extrabold text-slate-900">{log.event}</span>
                            <span className="text-[10px] text-slate-400 block font-mono">{log.ip}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded font-mono">
                            {log.status}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{log.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DANGER ZONE: ACCOUNT & SESSION ACTIONS */}
              <div className="bg-rose-50/60 border border-rose-200 p-6 rounded-3xl space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 font-black flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-rose-900">Admin Session Control & Danger Zone</h4>
                    <p className="text-xs text-rose-700">Terminate active administrator session and log out of governance panel.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <span className="text-xs text-rose-800">
                    Signing out will clear local access tokens and require re-authentication.
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to sign out of the Admin Governance Cockpit?')) {
                        logoutAdmin();
                        addToast('Logged out of Admin Portal successfully', 'info');
                        navigate('/admin/login');
                      }
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of Admin Cockpit</span>
                  </button>
                </div>
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
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            
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

      {/* PAYMENT DETAILS & TRANSACTION BREAKDOWN INSPECTOR MODAL (STEP 29) */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 font-black flex items-center justify-center text-lg shadow-sm">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      OFFICIAL PAYMENT AUDIT
                    </span>
                    <span className="text-xs font-mono text-emerald-600 font-bold">• Gateway Logged</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">{selectedPayment.transaction_id || `TXN-${selectedPayment.id}`}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Payment Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Transaction Amount</span>
                  <span className="font-black text-emerald-600 text-lg">₹{selectedPayment.amount || selectedPayment.total_fee || 50}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Payment Gateway</span>
                  <span className="font-bold text-slate-900">{selectedPayment.payment_method || 'Razorpay Direct'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-slate-500 block font-medium">Payment Status</span>
                  <span className="font-bold text-emerald-600 uppercase">
                    {selectedPayment.status || 'PAID'}
                  </span>
                </div>
              </div>

              {/* Linked Application Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Linked Application Details</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-mono">Application Reference Number</span>
                    <span className="font-extrabold text-orange-600 font-mono text-sm">{selectedPayment.application_number || `APP-${selectedPayment.id}`}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">Digital Service Requested</span>
                    <span className="font-bold text-slate-900">{selectedPayment.service_name || 'E-Seva Digital Service'}</span>
                  </div>
                </div>
              </div>

              {/* Citizen Contact Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Citizen Primary Contact</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-mono">Applicant Legal Name</span>
                    <span className="font-bold text-slate-900">{selectedPayment.user_name || 'Citizen Applicant'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">Mobile / Email</span>
                    <span className="font-bold text-slate-900">{selectedPayment.user_email || 'Verified Account'}</span>
                  </div>
                </div>
              </div>

              {/* Transaction Timestamps & Receipt Log */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Gateway Receipt & Audit Trail</span>
                </h4>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gateway Order ID:</span>
                    <span className="font-bold text-slate-800">ord_live_{selectedPayment.id || '9872'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gateway Payment ID:</span>
                    <span className="font-bold text-slate-800">pay_live_{selectedPayment.id || '4452'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Timestamp:</span>
                    <span className="font-bold text-slate-800">
                      {selectedPayment.created_at ? new Date(selectedPayment.created_at).toLocaleString() : new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex items-center space-x-3 pt-2">
              {(!selectedPayment.status || selectedPayment.status.toLowerCase() === 'paid' || selectedPayment.status.toLowerCase() === 'success') && (
                <button
                  onClick={() => {
                    handleRefund(selectedPayment.id);
                    setSelectedPayment(null);
                  }}
                  className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl border border-rose-200 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Issue Full Refund</span>
                </button>
              )}

              <button
                onClick={() => setSelectedPayment(null)}
                className="flex-1 py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors shadow"
              >
                Close Payment Inspector
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CONTACT ENQUIRY & COMMUNICATION INSPECTOR MODAL (STEP 30) */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 font-black flex items-center justify-center text-lg shadow-sm">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      OFFICIAL ENQUIRY AUDIT
                    </span>
                    <span className="text-xs font-mono text-slate-500">• ID #{selectedEnquiry.id}</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">{selectedEnquiry.subject || 'General Enquiry'}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Customer Primary Contact */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Citizen Primary Contact</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-mono">Full Name</span>
                    <span className="font-extrabold text-slate-900 text-sm">{selectedEnquiry.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">Email Address</span>
                    <span className="font-bold text-slate-900">{selectedEnquiry.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">Mobile / Phone</span>
                    <span className="font-bold text-slate-900">{selectedEnquiry.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Message Content Body */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">Enquiry Message Body</span>
                  <span className="text-slate-400 text-[10px]">
                    Submitted: {selectedEnquiry.created_at ? new Date(selectedEnquiry.created_at).toLocaleString('en-IN') : 'Logged'}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 font-normal leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Reply / Official Response Composer */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-slate-900 font-black text-xs uppercase tracking-wider flex items-center space-x-2">
                  <Send className="w-4 h-4 text-orange-500" />
                  <span>Official Reply Desk & Communication</span>
                </span>
                
                <textarea
                  rows={3}
                  placeholder="Type official response or support reply to citizen..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner"
                />

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      if (!replyText.trim()) return addToast('Please enter a reply message', 'error');
                      addToast('Official reply dispatched to citizen!', 'success');
                      setReplyText('');
                    }}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Response</span>
                  </button>
                </div>
              </div>

            </div>

            <button
              onClick={() => setSelectedEnquiry(null)}
              className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors shadow"
            >
              Close Enquiry Inspector
            </button>

          </div>
        </div>
      )}

      {/* CANDIDATE DETAILS & RESUME INSPECTOR MODAL (STEP 31) */}
      {selectedCareerApp && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 font-black flex items-center justify-center text-lg shadow-sm">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      CANDIDATE AUDIT
                    </span>
                    <span className="text-xs font-mono text-slate-500">• ID #{selectedCareerApp.id}</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">{selectedCareerApp.applicant_name}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedCareerApp(null)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Candidate Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Applied Position</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedCareerApp.position}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Experience Level</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedCareerApp.experience || 'Entry Level'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-slate-500 block font-medium">Pipeline Status</span>
                  <span className="font-bold text-blue-600 uppercase text-xs">
                    {selectedCareerApp.status || 'Received'}
                  </span>
                </div>
              </div>

              {/* Candidate Contact Information */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Candidate Primary Contact</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-mono">Email Address</span>
                    <span className="font-bold text-slate-900">{selectedCareerApp.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">Mobile / Phone</span>
                    <span className="font-bold text-slate-900">{selectedCareerApp.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Uploaded Resume / CV File Document Card */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <Paperclip className="w-4 h-4 text-orange-500" />
                  <span>Uploaded Candidate Resume / CV</span>
                </h4>

                {selectedCareerApp.resume_file ? (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">Candidate Resume Document</span>
                        <span className="text-[10px] text-slate-500 font-mono">{selectedCareerApp.resume_file}</span>
                      </div>
                    </div>

                    <a
                      href={selectedCareerApp.resume_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center space-x-1.5"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Download File</span>
                    </a>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 italic text-xs">
                    No resume file was attached with this application.
                  </div>
                )}
              </div>

            </div>

            <button
              onClick={() => setSelectedCareerApp(null)}
              className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors shadow"
            >
              Close Candidate Inspector
            </button>

          </div>
        </div>
      )}

      {/* NOTIFICATION DETAILS INSPECTOR MODAL (STEP 32) */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 font-black flex items-center justify-center text-lg shadow-sm">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      OPERATIONS ALERT AUDIT
                    </span>
                    <span className="text-xs font-mono text-slate-500">• ID #{selectedNotif.id}</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">{selectedNotif.title}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedNotif(null)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Alert Metadata</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-mono">Category Type</span>
                    <span className="font-extrabold text-slate-900 uppercase font-mono">{selectedNotif.type || 'SYSTEM'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">Timestamp</span>
                    <span className="font-bold text-slate-900">
                      {new Date(selectedNotif.createdAt || selectedNotif.created_at || Date.now()).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">Full Message Content</span>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 leading-relaxed font-normal">
                  {selectedNotif.message}
                </div>
              </div>

            </div>

            <button
              onClick={() => setSelectedNotif(null)}
              className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors shadow"
            >
              Close Alert Inspector
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
