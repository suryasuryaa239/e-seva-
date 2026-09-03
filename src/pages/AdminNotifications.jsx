import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Bell, CheckCheck, RefreshCw, Filter, ExternalLink, 
  FileText, CreditCard, ShieldAlert, UserCheck, MessageSquare 
} from 'lucide-react';

export default function AdminNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');

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
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'PAYMENTS') return n.type && n.type.includes('PAYMENT');
    if (activeFilter === 'DOCUMENTS') return n.type && n.type.includes('DOCUMENT');
    if (activeFilter === 'SUBMISSIONS') return n.type === 'APPLICATION_SUBMITTED';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead && !n.is_read).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center font-bold shadow">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-white">Admin Operations Alerts</h1>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Cockpit Stream
                </span>
              </div>
              <p className="text-xs text-slate-400">Operational stream for desk verifications, payment ledger events & query replies</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <CheckCheck className="w-4 h-4" /> Mark All Read
              </button>
            )}
            <Link
              to="/admin"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" /> Admin Cockpit
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Alerts:
          </span>
          {[
            { id: 'ALL', label: `All (${notifications.length})` },
            { id: 'SUBMISSIONS', label: 'New Submissions' },
            { id: 'PAYMENTS', label: 'Payment Ledger' },
            { id: 'DOCUMENTS', label: 'Document Events' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === f.id
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Alert Cards */}
        {loading ? (
          <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-400">Loading admin operations feed...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
            <Bell className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-300">No Admin Alerts</h3>
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
                      ? 'bg-slate-900 border-amber-500/50 shadow-lg ring-1 ring-amber-500/20'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isPayment ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        isDoc ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {isPayment ? <CreditCard className="w-5 h-5" /> :
                         isDoc ? <ShieldAlert className="w-5 h-5" /> :
                         <FileText className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white">{n.title}</h4>
                          {isUnread && (
                            <span className="bg-amber-500 text-slate-950 font-mono text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                              UNREAD
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{n.message}</p>
                        <span className="text-[10px] text-slate-500 font-mono block mt-2">
                          {new Date(n.createdAt || n.created_at || Date.now()).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/admin"
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-colors"
                    >
                      <span>Open Inspector</span>
                      <ExternalLink className="w-3.5 h-3.5" />
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
