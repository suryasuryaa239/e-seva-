import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, CheckCheck, Trash2, ExternalLink, ShieldAlert, Award, 
  CreditCard, CheckCircle2, Clock, Filter, ArrowLeft, RefreshCw 
} from 'lucide-react';

export default function UserNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login?redirect=/notifications');
        return;
      }

      const res = await fetch('/api/notifications', {
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

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (e) {}
  };

  const markAsUnread = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/notifications/${id}/unread`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (e) {}
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (e) {}
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (e) {}
  };

  // Filter Logic
  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'UNREAD') return !n.isRead && !n.is_read;
    if (activeFilter === 'PAYMENTS') return n.type && n.type.includes('PAYMENT');
    if (activeFilter === 'DOCUMENTS') return n.type && (n.type.includes('DOCUMENT') || n.type.includes('ACTION_REQUIRED'));
    if (activeFilter === 'APPLICATIONS') return n.type && (n.type.includes('APPLICATION') || n.type.includes('CERTIFICATE'));
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead && !n.is_read).length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link to="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
              <span>/</span>
              <span className="font-semibold text-slate-800">Notifications Center</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Notification & Alert Center</h1>
                <p className="text-xs text-slate-500">Real-time status tracking, document queries, & payment alerts</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 flex items-center gap-1.5 transition-colors"
              >
                <CheckCheck className="w-4 h-4 text-indigo-600" />
                <span>Mark All Read</span>
              </button>
            )}
            <button
              onClick={fetchNotifications}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              title="Refresh Feed"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'ALL', label: `All Alerts (${notifications.length})` },
            { id: 'UNREAD', label: `Unread (${unreadCount})` },
            { id: 'APPLICATIONS', label: 'Applications' },
            { id: 'DOCUMENTS', label: 'Document Queries' },
            { id: 'PAYMENTS', label: 'Payments' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeFilter === f.id
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notifications Feed */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500">Loading your notification feed...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <Bell className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Notifications Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You are all caught up! New application updates and document queries will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((n) => {
              const isUnread = !n.isRead && !n.is_read;
              const isActionReq = n.type === 'ACTION_REQUIRED' || n.type === 'DOCUMENT_REJECTED';
              const isCert = n.type === 'CERTIFICATE_ISSUED' || n.type === 'APPLICATION_APPROVED';
              const isPayment = n.type && n.type.includes('PAYMENT');

              const appLink = n.applicationId || (n.metadata && n.metadata.applicationId)
                ? `/my-applications/${n.applicationId || n.metadata.applicationId}`
                : n.link || '/dashboard';

              return (
                <div
                  key={n.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    isUnread
                      ? 'bg-white border-amber-300 shadow-md ring-1 ring-amber-400/30'
                      : 'bg-white/80 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isActionReq ? 'bg-rose-100 text-rose-600' :
                        isCert ? 'bg-amber-100 text-amber-600' :
                        isPayment ? 'bg-emerald-100 text-emerald-600' :
                        'bg-indigo-100 text-indigo-600'
                      }`}>
                        {isActionReq ? <ShieldAlert className="w-5 h-5" /> :
                         isCert ? <Award className="w-5 h-5" /> :
                         isPayment ? <CreditCard className="w-5 h-5" /> :
                         <CheckCircle2 className="w-5 h-5" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                          {isUnread && (
                            <span className="bg-amber-500 text-slate-950 font-mono text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-1 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(n.createdAt || n.created_at || Date.now()).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Top Action Menu */}
                    <div className="flex items-center space-x-1">
                      {isUnread ? (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors"
                          title="Mark as Read"
                        >
                          Read
                        </button>
                      ) : (
                        <button
                          onClick={() => markAsUnread(n.id)}
                          className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-400 text-[11px] font-medium rounded-lg transition-colors"
                          title="Mark as Unread"
                        >
                          Unread
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(n.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete Notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Related Application Link Bar */}
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-400 text-[11px] font-mono">
                      Ref: {n.metadata && n.metadata.application_number ? n.metadata.application_number : 'E-Seva Record'}
                    </span>

                    <button
                      onClick={() => {
                        markAsRead(n.id);
                        navigate(appLink);
                      }}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors"
                    >
                      <span>View Application</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
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
