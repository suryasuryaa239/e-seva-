import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, ExternalLink, ShieldAlert, Award, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000); // Poll every 15s
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (e) {
      console.error('Error fetching notifications:', e);
    }
  };

  const markAsRead = async (id, link) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
      if (link) {
        setIsOpen(false);
        navigate(link);
      }
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

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors focus:outline-none"
        title="Notifications Cockpit"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-rose-500 text-white font-mono font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse border-2 border-slate-900 shadow">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden font-sans">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/80">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Notifications Cockpit</h4>
              {unreadCount > 0 && (
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length > 0 ? (
              notifications.map((n) => {
                const isActionRequired = n.type === 'ACTION_REQUIRED';
                const isCert = n.type === 'CERTIFICATE_ISSUED';
                const isUnread = !n.is_read;

                return (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id, n.link)}
                    className={`p-3.5 hover:bg-slate-800/50 cursor-pointer transition-colors space-y-1 ${
                      isUnread ? 'bg-slate-850/80 border-l-4 border-amber-500' : 'opacity-80'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {isActionRequired ? (
                          <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        ) : isCert ? (
                          <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        )}
                        <h5 className={`text-xs font-bold ${isUnread ? 'text-white' : 'text-slate-300'}`}>
                          {n.title}
                        </h5>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 pl-6">
                      {n.message}
                    </p>

                    <div className="pl-6 pt-1 flex justify-between items-center text-[10px]">
                      <span className="text-amber-400 font-semibold flex items-center gap-1 hover:underline">
                        View Details <ExternalLink className="w-3 h-3" />
                      </span>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <Bell className="w-8 h-8 mx-auto opacity-30 text-slate-400" />
                <p className="text-xs">No notifications yet</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-950 text-center border-t border-slate-800">
            <button
              onClick={() => { setIsOpen(false); navigate('/dashboard'); }}
              className="text-[11px] font-bold text-slate-400 hover:text-white transition-colors"
            >
              View Full Dashboard Alerts
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
