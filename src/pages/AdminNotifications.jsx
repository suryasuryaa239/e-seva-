import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Bell, CheckCheck, RefreshCw, Filter, ExternalLink, 
  FileText, CreditCard, ShieldAlert, UserCheck, MessageSquare, Search, ArrowLeft
} from 'lucide-react';

export default function AdminNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAdminNotifications();
  }, []);

  const fetchAdminNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/admin/notifications/read-all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdminNotifications();
    } catch (e) {}
  };

  const filtered = notifications.filter(n => {
    const matchesSearch = !searchQuery || 
      (n.title && n.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (n.message && n.message.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesFilter = true;
    if (activeFilter === 'PAYMENTS') matchesFilter = n.type && n.type.includes('PAYMENT');
    else if (activeFilter === 'DOCUMENTS') matchesFilter = n.type && n.type.includes('DOCUMENT');
    else if (activeFilter === 'SUBMISSIONS') matchesFilter = n.type === 'APPLICATION_SUBMITTED';

    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead && !n.is_read).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-4 sm:p-8 font-sans selection:bg-orange-500 selection:text-white">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#0b192c] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-2xl flex items-center justify-center font-bold shadow-sm">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/30">
                  COCKPIT ALERTS STREAM
                </span>
                <span className="text-xs font-mono text-slate-400">• Operational Feed</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">Admin Notifications & Alerts</h1>
              <p className="text-xs text-slate-300">Live system stream for citizen submissions, payment audit receipts & verification events.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-extrabold rounded-xl border border-orange-200 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <CheckCheck className="w-4 h-4" /> Mark All Read
              </button>
            )}
            <Link
              to="/admin"
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Admin Workspace
            </Link>
          </div>
        </div>

        {/* Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Operations Alerts</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">{notifications.length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Unread Alerts</span>
            <div className="text-xl font-black text-amber-600 mt-0.5">{unreadCount}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Submissions Stream</span>
            <div className="text-xl font-black text-blue-600 mt-0.5">
              {notifications.filter(n => n.type === 'APPLICATION_SUBMITTED').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Payment Ledger Events</span>
            <div className="text-xl font-black text-emerald-600 mt-0.5">
              {notifications.filter(n => n.type && n.type.includes('PAYMENT')).length}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'ALL', label: `All (${notifications.length})` },
                { id: 'SUBMISSIONS', label: 'New Submissions' },
                { id: 'PAYMENTS', label: 'Payment Ledger' },
                { id: 'DOCUMENTS', label: 'Document Events' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeFilter === f.id
                      ? 'bg-[#0b192c] text-white shadow-sm font-black'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alert Stream Cards */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500 font-medium">Loading admin operations feed...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <Bell className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Operations Alerts Found</h3>
            <p className="text-xs text-slate-500">Operational alerts for citizen applications will stream here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => {
              const isUnread = !n.isRead && !n.is_read;
              const isPayment = n.type && n.type.includes('PAYMENT');
              const isDoc = n.type && n.type.includes('DOCUMENT');

              return (
                <div
                  key={n.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    isUnread
                      ? 'bg-orange-50/40 border-orange-200 shadow-md ring-1 ring-orange-400/20'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${
                        isPayment ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200' :
                        isDoc ? 'bg-rose-500/10 text-rose-600 border border-rose-200' :
                        'bg-orange-500/10 text-orange-600 border border-orange-200'
                      }`}>
                        {isPayment ? <CreditCard className="w-5 h-5" /> :
                         isDoc ? <ShieldAlert className="w-5 h-5" /> :
                         <FileText className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-extrabold text-slate-900">{n.title}</h4>
                          {isUnread && (
                            <span className="bg-amber-100 text-amber-900 font-mono text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-300">
                              UNREAD
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-slate-400 font-mono block mt-2">
                          {new Date(n.createdAt || n.created_at || Date.now()).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/admin"
                      className="px-3.5 py-2 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center space-x-1.5 transition-colors shadow"
                    >
                      <span>Open Workspace</span>
                      <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
