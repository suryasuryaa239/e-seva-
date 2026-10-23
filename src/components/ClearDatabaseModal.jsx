import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Trash2, X, Loader2, CheckCircle2, ShieldAlert, 
  Database, RefreshCw, Layers, FileText, CreditCard, Users, MessageSquare, Bell 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function ClearDatabaseModal({
  isOpen,
  onClose,
  onSuccess,
  getAuthToken
}) {
  const { addToast } = useToast();
  const [scope, setScope] = useState('all');
  const [confirmationInput, setConfirmationInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const token = getAuthToken ? getAuthToken() : (localStorage.getItem('eseva_admin_token') || localStorage.getItem('token'));

  // Fetch live stats when modal opens
  useEffect(() => {
    if (isOpen) {
      setConfirmationInput('');
      fetchStats();
    }
  }, [isOpen]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await fetch('/api/admin/database/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.warn('Failed to fetch database stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isConfirmed = confirmationInput.trim().toUpperCase() === 'CLEAR DATABASE';

  const handleExecuteClear = async () => {
    if (!isConfirmed) {
      addToast('Please type "CLEAR DATABASE" exactly to confirm.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/admin/database/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          scope,
          confirmation: 'CLEAR DATABASE'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to clear database');
      }

      addToast(data.message || 'Database cleared successfully!', 'success');
      if (onSuccess) {
        onSuccess(scope, data.cleared);
      }
      onClose();
    } catch (err) {
      addToast(err.message || 'Error occurred while clearing database', 'error');
    } finally {
      setLoading(false);
    }
  };

  const scopeOptions = [
    {
      id: 'all',
      title: 'Reset All Operational Test Data (Recommended)',
      description: 'Purges all applications, uploaded documents, payment records, contact queries, and non-admin citizen accounts. Keeps Admin login, Services, and Categories intact.',
      icon: Database,
      badge: 'Full Operational Reset',
      color: 'rose'
    },
    {
      id: 'applications',
      title: 'Clear Applications & Documents Only',
      description: 'Wipes all submitted and draft applications, field values, uploaded document files, and audit records.',
      icon: FileText,
      badge: `${stats ? stats.applications : 0} Applications`,
      color: 'orange'
    },
    {
      id: 'payments',
      title: 'Clear Payments Ledger Only',
      description: 'Wipes all transaction audit records and payment histories. Citizen accounts and services are untouched.',
      icon: CreditCard,
      badge: `${stats ? stats.payments : 0} Payments`,
      color: 'amber'
    },
    {
      id: 'users',
      title: 'Clear Citizen User Accounts',
      description: 'Purges all test citizen registrations. Super Admin and Administrator accounts are safely preserved.',
      icon: Users,
      badge: `${stats ? stats.users : 0} Citizens`,
      color: 'sky'
    },
    {
      id: 'messages',
      title: 'Clear Enquiries & Job Applications',
      description: 'Wipes all contact queries, support requests, and career form submissions.',
      icon: MessageSquare,
      badge: `${stats ? (stats.contact_messages + stats.career_applications) : 0} Messages`,
      color: 'purple'
    },
    {
      id: 'notifications',
      title: 'Clear Notifications & Logs',
      description: 'Wipes internal notification streams and delivery logs.',
      icon: Bell,
      badge: `${stats ? stats.notifications : 0} Alerts`,
      color: 'slate'
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-2xl shadow-rose-950/20 space-y-6 animate-in zoom-in-95 duration-200 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  DANGER ZONE
                </span>
                <span className="text-xs font-mono text-slate-400">• Admin System Tool</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                Clear Database & Reset Data
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database Live Stats Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-300 flex items-center space-x-1.5">
              <Database className="w-4 h-4 text-orange-400" />
              <span>Current Database Records Status</span>
            </span>
            <button
              type="button"
              onClick={fetchStats}
              disabled={statsLoading}
              className="text-slate-400 hover:text-white flex items-center space-x-1 text-[11px] font-mono cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${statsLoading ? 'animate-spin text-orange-400' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Applications</p>
              <p className="text-base font-black text-orange-400 font-mono mt-0.5">
                {stats ? stats.applications : '...'}
              </p>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Payments</p>
              <p className="text-base font-black text-emerald-400 font-mono mt-0.5">
                {stats ? stats.payments : '...'}
              </p>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Citizen Users</p>
              <p className="text-base font-black text-sky-400 font-mono mt-0.5">
                {stats ? stats.users : '...'}
              </p>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Services (Safe)</p>
              <p className="text-base font-black text-amber-400 font-mono mt-0.5">
                {stats ? stats.services : '...'}
              </p>
            </div>
          </div>
        </div>

        {/* Scope Selection */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
            Select What You Want To Clear:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
            {scopeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = scope === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setScope(opt.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-rose-50/80 border-rose-500 shadow-sm ring-2 ring-rose-400/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black text-slate-900 leading-tight">
                        {opt.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 shrink-0">
                      {opt.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                    {opt.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-extrabold">Warning: This action is permanent and cannot be undone.</p>
            <p className="text-amber-800 leading-relaxed">
              Targeted records will be wiped from both TiDB Cloud MySQL and local storage.
              {scope === 'all' && (
                <strong className="block text-slate-900 font-bold mt-1">
                  🛡️ Administrator accounts and Government Service Catalogs will NOT be deleted.
                </strong>
              )}
            </p>
          </div>
        </div>

        {/* Safety Confirmation Input Barrier */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-black text-slate-900 block">
            Type <span className="text-rose-600 font-mono font-black uppercase bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">CLEAR DATABASE</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder="Type CLEAR DATABASE exactly"
            disabled={loading}
            className="w-full px-4 py-3 text-sm font-mono border-2 border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 rounded-2xl outline-hidden transition-all bg-white"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel & Keep Data
          </button>

          <button
            type="button"
            onClick={handleExecuteClear}
            disabled={!isConfirmed || loading}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-black flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer ${
              isConfirmed && !loading
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30 ring-2 ring-rose-500/20 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing Database Clear...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Confirm & Execute Clear</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
