import React, { useState, useEffect, useMemo } from 'react';
import {
  FileSpreadsheet, Users, Clock, CreditCard, DollarSign, AlertCircle,
  Search, Filter, Download, Printer, RefreshCw, ChevronRight, Eye,
  CheckCircle2, AlertTriangle, ArrowUpDown, Calendar, Phone, Mail,
  Send, Database, ShieldAlert, Sparkles, ExternalLink, Check, Trash2,
  FileCheck, Clock3, UserCheck, Shield, HelpCircle, X
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import StatusBadge from './StatusBadge';

export default function AdminReports({
  getAuthToken,
  refreshKey,
  onInspectApp,
  onInspectUser,
  onOpenClearDb
}) {
  const { addToast } = useToast();
  const getActiveToken = () => {
    return (getAuthToken ? getAuthToken() : null) || localStorage.getItem('eseva_admin_token') || localStorage.getItem('adminToken') || localStorage.getItem('token');
  };

  // Active Report Tab: 'user_profiles' | 'pending' | 'payment_pending' | 'payment_paid' | 'abandoned'
  const [activeReport, setActiveReport] = useState('user_profiles');

  // Loading & Data States
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [subStatusFilter, setSubStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | '7days' | '30days'
  const [sortField, setSortField] = useState('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Manual Paid Modal State
  const [markPaidModal, setMarkPaidModal] = useState({
    isOpen: false,
    app: null,
    paymentMethod: 'Cash / Desk Counter',
    remarks: 'Desk cash verified by admin',
    loading: false
  });

  // Fetch report data on active report change or external refreshKey
  useEffect(() => {
    fetchActiveReportData();
    setSearchQuery('');
    setSubStatusFilter('All');
  }, [activeReport, refreshKey]);

  const fetchActiveReportData = async () => {
    try {
      setLoading(true);
      let endpoint = '/api/admin/reports/user-profiles';
      if (activeReport === 'pending') endpoint = '/api/admin/reports/pending';
      if (activeReport === 'payment_pending') endpoint = '/api/admin/reports/payment-pending';
      if (activeReport === 'payment_paid') endpoint = '/api/admin/reports/payment-paid';
      if (activeReport === 'abandoned') endpoint = '/api/admin/reports/abandoned';

      const activeToken = getActiveToken();
      const res = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch report data (${res.status})`);
      }

      const data = await res.json();
      setReportData(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('[REPORT ERROR]', err);
      addToast(err.message || 'Error loading report', 'error');
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtered & Sorted Data
  const filteredData = useMemo(() => {
    let result = [...reportData];

    // 1. Text Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item => {
        const name = (item.name || item.applicant_name || '').toLowerCase();
        const email = (item.email || item.applicant_email || '').toLowerCase();
        const phone = (item.phone || item.applicant_phone || '').toLowerCase();
        const appNo = (item.application_number || '').toLowerCase();
        const srv = (item.service_name || '').toLowerCase();
        const receipt = (item.receipt_number || '').toLowerCase();
        const txn = (item.transaction_id || '').toLowerCase();
        const district = (item.district || '').toLowerCase();

        return (
          name.includes(q) ||
          email.includes(q) ||
          phone.includes(q) ||
          appNo.includes(q) ||
          srv.includes(q) ||
          receipt.includes(q) ||
          txn.includes(q) ||
          district.includes(q)
        );
      });
    }

    // 2. Sub-status Filter
    if (subStatusFilter !== 'All') {
      result = result.filter(item => {
        if (activeReport === 'pending') {
          return (item.status || '').toLowerCase() === subStatusFilter.toLowerCase();
        }
        if (activeReport === 'abandoned') {
          return (item.stage_name || '').includes(subStatusFilter);
        }
        return true;
      });
    }

    // 3. Date Filter
    if (dateFilter !== 'all') {
      const now = new Date();
      result = result.filter(item => {
        const dateStr = item.paid_at || item.submitted_at || item.created_at || item.last_updated;
        if (!dateStr) return true;
        const itemDate = new Date(dateStr);
        const diffMs = now - itemDate;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (dateFilter === 'today') return diffDays < 1;
        if (dateFilter === '7days') return diffDays <= 7;
        if (dateFilter === '30days') return diffDays <= 30;
        return true;
      });
    }

    return result;
  }, [reportData, searchQuery, subStatusFilter, dateFilter, activeReport]);

  // Dynamic Summary Metrics
  const summaryMetrics = useMemo(() => {
    if (activeReport === 'user_profiles') {
      const totalUsers = filteredData.length;
      const totalApps = filteredData.reduce((acc, u) => acc + (u.total_applications || 0), 0);
      const totalSpent = filteredData.reduce((acc, u) => acc + (u.total_spent || 0), 0);
      const withPending = filteredData.filter(u => u.pending_count > 0).length;
      return [
        { label: 'Total Registered Citizens', value: totalUsers, icon: Users, color: 'sky' },
        { label: 'Total Applications Lodged', value: totalApps, icon: FileSpreadsheet, color: 'orange' },
        { label: 'Citizens With Pending Apps', value: withPending, icon: Clock, color: 'amber' },
        { label: 'Total Revenue Contributed', value: `₹${totalSpent.toLocaleString('en-IN')}`, icon: DollarSign, color: 'emerald' }
      ];
    }

    if (activeReport === 'pending') {
      const total = filteredData.length;
      const submitted = filteredData.filter(a => (a.status || '').toLowerCase() === 'submitted').length;
      const underReview = filteredData.filter(a => (a.status || '').toLowerCase().includes('review')).length;
      const processing = filteredData.filter(a => (a.status || '').toLowerCase().includes('process')).length;
      const overdue = filteredData.filter(a => a.days_pending > 3).length;
      return [
        { label: 'Total Pending Applications', value: total, icon: Clock, color: 'orange' },
        { label: 'Submitted (New Queue)', value: submitted, icon: Clock3, color: 'amber' },
        { label: 'Under Review / Processing', value: underReview + processing, icon: RefreshCw, color: 'sky' },
        { label: 'Aging > 3 Days (Urgent)', value: overdue, icon: AlertTriangle, color: 'rose' }
      ];
    }

    if (activeReport === 'payment_pending') {
      const total = filteredData.length;
      const totalAmount = filteredData.reduce((sum, a) => sum + (Number(a.fee_amount) || 0), 0);
      const overdue24h = filteredData.filter(a => a.days_overdue >= 1).length;
      return [
        { label: 'Unpaid Applications', value: total, icon: CreditCard, color: 'rose' },
        { label: 'Total Outstanding Fees', value: `₹${totalAmount.toLocaleString('en-IN')}`, icon: DollarSign, color: 'amber' },
        { label: 'Pending > 24 Hours', value: overdue24h, icon: Clock, color: 'orange' },
        { label: 'Payment Gateway', value: 'PhonePe PG', icon: Shield, color: 'sky' }
      ];
    }

    if (activeReport === 'payment_paid') {
      const total = filteredData.length;
      const totalAmount = filteredData.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      const avgFee = total > 0 ? Math.round(totalAmount / total) : 0;
      return [
        { label: 'Verified Paid Transactions', value: total, icon: CheckCircle2, color: 'emerald' },
        { label: 'Total Revenue Collected', value: `₹${totalAmount.toLocaleString('en-IN')}`, icon: DollarSign, color: 'emerald' },
        { label: 'Average Transaction Value', value: `₹${avgFee}`, icon: Sparkles, color: 'sky' },
        { label: 'Payment Status', value: '100% Settled', icon: Shield, color: 'indigo' }
      ];
    }

    if (activeReport === 'abandoned') {
      const total = filteredData.length;
      const paymentDrops = filteredData.filter(a => a.drop_reason && a.drop_reason.includes('Payment')).length;
      const formDrops = total - paymentDrops;
      const recoverableValue = filteredData.reduce((sum, a) => sum + (Number(a.fee_amount) || 0), 0);
      return [
        { label: 'Total Abandoned Applications', value: total, icon: AlertCircle, color: 'rose' },
        { label: 'Form Draft Drop-offs', value: formDrops, icon: FileSpreadsheet, color: 'amber' },
        { label: 'Payment Checkout Drop-offs', value: paymentDrops, icon: CreditCard, color: 'orange' },
        { label: 'Potential Recoverable Revenue', value: `₹${recoverableValue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'sky' }
      ];
    }

    return [];
  }, [activeReport, filteredData]);

  // Export to CSV Function
  const handleExportCSV = () => {
    if (!filteredData.length) {
      addToast('No records available to export', 'error');
      return;
    }

    let headers = [];
    let rows = [];

    if (activeReport === 'user_profiles') {
      headers = ['User ID', 'Citizen Name', 'Email', 'Phone', 'Aadhaar No', 'District', 'Address', 'Status', 'Registered Date', 'Total Applications', 'Pending Applications', 'Completed Applications', 'Total Fees Contributed (INR)'];
      rows = filteredData.map(u => [
        u.id,
        `"${(u.name || '').replace(/"/g, '""')}"`,
        `"${u.email || ''}"`,
        `"${u.phone || ''}"`,
        `"${u.aadhaar_no || ''}"`,
        `"${(u.district || '').replace(/"/g, '""')}"`,
        `"${(u.address || '').replace(/"/g, '""')}"`,
        u.status,
        new Date(u.created_at).toLocaleDateString('en-IN'),
        u.total_applications,
        u.pending_count,
        u.completed_count,
        u.total_spent
      ]);
    } else if (activeReport === 'pending') {
      headers = ['Application Number', 'Applicant Name', 'Phone', 'Email', 'Service Name', 'Category', 'Status', 'Current Step', 'Fee (INR)', 'Payment Status', 'Submission Date', 'Days Pending', 'Remarks'];
      rows = filteredData.map(a => [
        a.application_number,
        `"${(a.applicant_name || '').replace(/"/g, '""')}"`,
        `"${a.applicant_phone || ''}"`,
        `"${a.applicant_email || ''}"`,
        `"${(a.service_name || '').replace(/"/g, '""')}"`,
        `"${(a.category_name || '').replace(/"/g, '""')}"`,
        a.status,
        a.current_step,
        a.fee_amount,
        a.payment_status,
        new Date(a.submitted_at || a.created_at).toLocaleDateString('en-IN'),
        a.days_pending,
        `"${(a.remarks || '').replace(/"/g, '""')}"`
      ]);
    } else if (activeReport === 'payment_pending') {
      headers = ['Application Number', 'Applicant Name', 'Phone', 'Email', 'Service Name', 'Outstanding Fee (INR)', 'Initiated Date', 'Days Overdue', 'Gateway', 'Payment Status'];
      rows = filteredData.map(a => [
        a.application_number,
        `"${(a.applicant_name || '').replace(/"/g, '""')}"`,
        `"${a.applicant_phone || ''}"`,
        `"${a.applicant_email || ''}"`,
        `"${(a.service_name || '').replace(/"/g, '""')}"`,
        a.fee_amount,
        new Date(a.created_at).toLocaleDateString('en-IN'),
        a.days_overdue,
        a.payment_gateway,
        a.payment_status
      ]);
    } else if (activeReport === 'payment_paid') {
      headers = ['Receipt Number', 'Transaction ID', 'Application Number', 'Citizen Name', 'Phone', 'Email', 'Service Name', 'Amount Paid (INR)', 'Payment Method', 'Paid Date', 'Status'];
      rows = filteredData.map(p => [
        p.receipt_number,
        p.transaction_id,
        p.application_number,
        `"${(p.applicant_name || '').replace(/"/g, '""')}"`,
        `"${p.applicant_phone || ''}"`,
        `"${p.applicant_email || ''}"`,
        `"${(p.service_name || '').replace(/"/g, '""')}"`,
        p.amount,
        `"${p.payment_method || 'PhonePe'}"`,
        new Date(p.paid_at).toLocaleString('en-IN'),
        p.status
      ]);
    } else if (activeReport === 'abandoned') {
      headers = ['Draft/Application No', 'Citizen Name', 'Phone', 'Email', 'Service Name', 'Stage Dropped', 'Step', 'Drop Reason', 'Fee Amount (INR)', 'Created Date', 'Last Active'];
      rows = filteredData.map(a => [
        a.application_number,
        `"${(a.applicant_name || '').replace(/"/g, '""')}"`,
        `"${a.applicant_phone || ''}"`,
        `"${a.applicant_email || ''}"`,
        `"${(a.service_name || '').replace(/"/g, '""')}"`,
        `"${a.stage_name}"`,
        a.current_step,
        `"${a.drop_reason}"`,
        a.fee_amount,
        new Date(a.created_at).toLocaleDateString('en-IN'),
        new Date(a.last_updated).toLocaleString('en-IN')
      ]);
    }

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `eseva_${activeReport}_report_${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Report exported to CSV successfully!', 'success');
  };

  // Print Report Handler
  const handlePrintReport = () => {
    window.print();
  };

  // Mark Fee as Paid Handler (Manual desk/cash)
  const handleConfirmMarkPaid = async () => {
    if (!markPaidModal.app) return;
    try {
      setMarkPaidModal(prev => ({ ...prev, loading: true }));
      const res = await fetch(`/api/admin/applications/${markPaidModal.app.id}/mark-paid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          payment_method: markPaidModal.paymentMethod,
          remarks: markPaidModal.remarks
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to mark as paid');

      addToast(`Payment marked as PAID for ${markPaidModal.app.application_number}!`, 'success');
      setMarkPaidModal({ isOpen: false, app: null, paymentMethod: 'Cash / Desk Counter', remarks: '', loading: false });
      fetchActiveReportData();
    } catch (err) {
      addToast(err.message || 'Error marking payment', 'error');
      setMarkPaidModal(prev => ({ ...prev, loading: false }));
    }
  };

  // Send Payment Reminder Handler
  const handleSendReminder = async (app) => {
    try {
      const res = await fetch(`/api/admin/applications/${app.id}/send-payment-reminder`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send reminder');
      addToast(`Payment reminder sent to ${app.applicant_name || 'applicant'}!`, 'success');
    } catch (err) {
      addToast(err.message || 'Error sending reminder', 'error');
    }
  };

  const reportTabs = [
    { id: 'user_profiles', label: '1. User Profile List', icon: Users, desc: 'Registered Citizen Profiles' },
    { id: 'pending', label: '2. Pending List', icon: Clock, desc: 'Awaiting Review & Approval' },
    { id: 'payment_pending', label: '3. Payment Pending List', icon: CreditCard, desc: 'Unpaid / Checkout Due' },
    { id: 'payment_paid', label: '4. Payment Paid List', icon: DollarSign, desc: 'Settled & Verified Ledger' },
    { id: 'abandoned', label: '5. Abandoned List', icon: AlertCircle, desc: 'Drafts & Drop-off Sessions' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header & Report Navigation */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                OFFICIAL AUDIT & REPORTS
              </span>
              <span className="text-xs font-mono text-slate-500">• State E-Seva Administration</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center space-x-2">
              <span>Government Portal Reports & Analytics</span>
            </h2>
            <p className="text-xs text-slate-500">
              Live exportable registries for citizen profiles, pending applications, fee collections, and abandoned drafts.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {onOpenClearDb && (
              <button
                type="button"
                onClick={onOpenClearDb}
                className="px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Clear Database</span>
              </button>
            )}

            <button
              type="button"
              onClick={fetchActiveReportData}
              disabled={loading}
              className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-orange-500' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* 5 Dedicated Report Tabs Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2 border-t border-slate-100">
          {reportTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeReport === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveReport(tab.id)}
                className={`p-3 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#0b192c] text-white border-[#0b192c] shadow-md ring-2 ring-orange-400/30'
                    : 'bg-slate-50/80 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-orange-500 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-black truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {tab.label}
                  </span>
                </div>
                <p className={`text-[10px] truncate ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                  {tab.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Printable Official Letterhead Header (Shows in Print Mode) */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-xl font-black uppercase text-slate-900">
          Government of Tamil Nadu • Digital E-Seva Portal
        </h1>
        <p className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">
          Official Administrative Report • {reportTabs.find(t => t.id === activeReport)?.label}
        </p>
        <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 mt-3 pt-2 border-t border-slate-300">
          <span>Date Generated: {new Date().toLocaleString('en-IN')}</span>
          <span>Total Records: {filteredData.length}</span>
          <span>Authentication: Verified Admin Desk</span>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div 
              key={idx}
              className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  {metric.label}
                </p>
                <p className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 font-mono">
                  {metric.value}
                </p>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-700">
                <Icon className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters & Export Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 print:hidden">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${reportTabs.find(t => t.id === activeReport)?.label}... (Name, Phone, Email, App No)`}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-hidden transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Date Filter & Sub-status Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {activeReport === 'pending' && (
            <select
              value={subStatusFilter}
              onChange={(e) => setSubStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Pending Statuses</option>
              <option value="Submitted">Submitted (New)</option>
              <option value="Under Review">Under Review</option>
              <option value="Processing">Processing</option>
            </select>
          )}

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Dates</option>
            <option value="today">Today Only</option>
            <option value="7days">Past 7 Days</option>
            <option value="30days">Past 30 Days</option>
          </select>

          {/* Export to CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Print Report Button */}
          <button
            type="button"
            onClick={handlePrintReport}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading audit report records...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">No records found for this report</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery ? 'Try adjusting your search criteria or clearing filters.' : 'There are currently no records matching this report category.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            
            {/* 1. USER PROFILE LIST TABLE */}
            {activeReport === 'user_profiles' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    <th className="py-3.5 px-4">Citizen Profile</th>
                    <th className="py-3.5 px-4">Contact Details</th>
                    <th className="py-3.5 px-4">Aadhaar / ID</th>
                    <th className="py-3.5 px-4">District & Address</th>
                    <th className="py-3.5 px-4 text-center">Applications Summary</th>
                    <th className="py-3.5 px-4 text-right">Total Contributed</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right print:hidden">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredData.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-black text-xs flex items-center justify-center shadow-xs">
                            {(user.name || 'C')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              Joined {new Date(user.created_at).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-slate-800 font-bold">{user.phone || 'No Mobile'}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-44">{user.email || 'No Email'}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {user.aadhaar_no}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {user.district || 'Tamil Nadu'}
                        </span>
                        <p className="text-[10px] text-slate-400 truncate max-w-44 mt-0.5">{user.address || 'Address not registered'}</p>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center space-x-1.5 font-mono text-[11px]">
                          <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-bold border border-orange-200" title="Total Apps">
                            {user.total_applications} Apps
                          </span>
                          {user.pending_count > 0 && (
                            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-200" title="Pending">
                              {user.pending_count} Pending
                            </span>
                          )}
                          {user.completed_count > 0 && (
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200" title="Completed">
                              {user.completed_count} Done
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-black font-mono text-emerald-600">
                        ₹{(user.total_spent || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right print:hidden">
                        {onInspectUser ? (
                          <button
                            type="button"
                            onClick={() => onInspectUser(user)}
                            className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
                            title="Inspect Citizen Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 2. PENDING APPLICATIONS LIST TABLE */}
            {activeReport === 'pending' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    <th className="py-3.5 px-4">Application No</th>
                    <th className="py-3.5 px-4">Applicant</th>
                    <th className="py-3.5 px-4">Service & Category</th>
                    <th className="py-3.5 px-4 text-center">Stage / Step</th>
                    <th className="py-3.5 px-4 text-center">Current Status</th>
                    <th className="py-3.5 px-4">Aging / Days Pending</th>
                    <th className="py-3.5 px-4 text-right">Fee / Payment</th>
                    <th className="py-3.5 px-4 text-right print:hidden">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredData.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded border border-slate-200">
                          {app.application_number}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{app.applicant_name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{app.applicant_phone || app.applicant_email}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{app.service_name}</p>
                        <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 inline-block mt-0.5">
                          {app.category_name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full text-[10px] font-black border border-sky-200">
                          Step {app.current_step} of 5
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5">
                          <Clock className={`w-3.5 h-3.5 ${app.days_pending > 3 ? 'text-rose-500' : 'text-amber-500'}`} />
                          <span className={`font-mono text-xs font-bold ${app.days_pending > 3 ? 'text-rose-600' : 'text-slate-700'}`}>
                            {app.days_pending === 0 ? 'Submitted Today' : `${app.days_pending} day${app.days_pending > 1 ? 's' : ''} pending`}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {new Date(app.submitted_at || app.created_at).toLocaleDateString('en-IN')}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <p className="font-black font-mono text-slate-900">₹{app.fee_amount}</p>
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                          (app.payment_status || '').toLowerCase() === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {app.payment_status || 'PENDING'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right print:hidden">
                        {onInspectApp ? (
                          <button
                            type="button"
                            onClick={() => onInspectApp(app)}
                            className="px-2.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-xs font-black transition-colors cursor-pointer"
                          >
                            Update
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 3. PAYMENT PENDING LIST TABLE */}
            {activeReport === 'payment_pending' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    <th className="py-3.5 px-4">Application Number</th>
                    <th className="py-3.5 px-4">Citizen / Applicant</th>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4 text-right">Pending Amount</th>
                    <th className="py-3.5 px-4">Overdue Aging</th>
                    <th className="py-3.5 px-4">Gateway</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right print:hidden">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <span className="bg-rose-50 text-rose-700 px-2 py-1 rounded border border-rose-200">
                          {item.application_number}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{item.applicant_name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{item.applicant_phone || item.applicant_email}</p>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {item.service_name}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black font-mono text-base text-rose-600">
                        ₹{item.fee_amount}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          item.days_overdue >= 2 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {item.days_overdue === 0 ? 'Initiated Today' : `${item.days_overdue} day(s) overdue`}
                        </span>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {new Date(item.created_at).toLocaleDateString('en-IN')}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-[11px] font-mono text-slate-600">
                        {item.payment_gateway}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="bg-rose-50 text-rose-700 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-rose-200">
                          Payment Pending
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right print:hidden">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setMarkPaidModal({ isOpen: true, app: item, paymentMethod: 'Cash / Desk Counter', remarks: 'Desk cash verified by admin', loading: false })}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-black transition-colors cursor-pointer"
                            title="Mark as Paid (Desk/Cash)"
                          >
                            Mark Paid
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendReminder(item)}
                            className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
                            title="Send Payment Reminder Alert"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 4. PAYMENT PAID LIST TABLE */}
            {activeReport === 'payment_paid' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    <th className="py-3.5 px-4">Receipt Number</th>
                    <th className="py-3.5 px-4">Transaction ID</th>
                    <th className="py-3.5 px-4">Application No</th>
                    <th className="py-3.5 px-4">Citizen Name</th>
                    <th className="py-3.5 px-4">Service Rendered</th>
                    <th className="py-3.5 px-4 text-right">Amount Paid</th>
                    <th className="py-3.5 px-4">Channel / Method</th>
                    <th className="py-3.5 px-4">Settled At</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                          {item.receipt_number}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {item.transaction_id}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-800 font-bold">
                        {item.application_number}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{item.applicant_name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{item.applicant_phone}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-bold">
                        {item.service_name}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black font-mono text-sm text-emerald-600">
                        ₹{item.amount}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {item.payment_method}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500">
                        {new Date(item.paid_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 5. ABANDONED LIST TABLE */}
            {activeReport === 'abandoned' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    <th className="py-3.5 px-4">Draft / App Number</th>
                    <th className="py-3.5 px-4">Citizen Details</th>
                    <th className="py-3.5 px-4">Service Selected</th>
                    <th className="py-3.5 px-4">Stage Abandoned</th>
                    <th className="py-3.5 px-4">Drop-off Reason</th>
                    <th className="py-3.5 px-4 text-right">Fee (INR)</th>
                    <th className="py-3.5 px-4">Last Activity</th>
                    <th className="py-3.5 px-4 text-right print:hidden">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {item.application_number}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{item.applicant_name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{item.applicant_phone || item.applicant_email}</p>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {item.service_name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200">
                          {item.stage_name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {item.drop_reason}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-black font-mono text-slate-900">
                        ₹{item.fee_amount}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500">
                        {new Date(item.last_updated).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="py-3.5 px-4 text-right print:hidden">
                        <button
                          type="button"
                          onClick={() => handleSendReminder(item)}
                          className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          title="Send follow-up message"
                        >
                          Notify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>
        )}

        {/* Footer Statistics */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Showing <strong className="text-slate-800">{filteredData.length}</strong> records in this report
          </span>
          <span className="font-mono text-[11px]">
            Live Sync: {lastUpdated.toLocaleTimeString('en-IN')}
          </span>
        </div>
      </div>

      {/* Manual Mark Paid Modal */}
      {markPaidModal.isOpen && markPaidModal.app && (
        <div 
          className="fixed inset-0 z-[170] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setMarkPaidModal({ isOpen: false, app: null, paymentMethod: 'Cash / Desk Counter', remarks: '', loading: false })}
        >
          <div 
            className="w-full max-w-md bg-white rounded-3xl p-6 border border-emerald-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">Mark Fee as Paid (Desk / Counter)</h3>
              </div>
              <button
                type="button"
                onClick={() => setMarkPaidModal({ isOpen: false, app: null, paymentMethod: 'Cash / Desk Counter', remarks: '', loading: false })}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Application No:</span>
                <span className="font-bold text-slate-900">{markPaidModal.app.application_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-bold text-slate-900">{markPaidModal.app.applicant_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-900">{markPaidModal.app.service_name}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-700 font-bold">Total Fee Payable:</span>
                <span className="font-black text-emerald-600 text-sm">₹{markPaidModal.app.fee_amount}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Payment Collection Mode:
                </label>
                <select
                  value={markPaidModal.paymentMethod}
                  onChange={(e) => setMarkPaidModal(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                >
                  <option value="Cash / Desk Counter">Cash at Counter</option>
                  <option value="Bank Challan / NEFT">Bank Challan / NEFT</option>
                  <option value="Direct UPI / QR Transfer">Direct UPI / QR Transfer</option>
                  <option value="POS Card Swipe">POS Card Swipe</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Admin Verification Remarks:
                </label>
                <input
                  type="text"
                  value={markPaidModal.remarks}
                  onChange={(e) => setMarkPaidModal(prev => ({ ...prev, remarks: e.target.value }))}
                  placeholder="e.g. Received cash at counter desk"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setMarkPaidModal({ isOpen: false, app: null, paymentMethod: 'Cash / Desk Counter', remarks: '', loading: false })}
                disabled={markPaidModal.loading}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmMarkPaid}
                disabled={markPaidModal.loading}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md cursor-pointer"
              >
                {markPaidModal.loading ? 'Updating...' : 'Confirm Paid'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
