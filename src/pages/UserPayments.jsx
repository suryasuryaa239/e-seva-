import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, ShieldCheck, CheckCircle2, Clock, AlertCircle, FileText, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function UserPayments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryingId, setRetryingId] = useState(null);

  useEffect(() => {
    fetchUserPayments();
  }, []);

  const fetchUserPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login?redirect=/payments');
        return;
      }

      const res = await fetch('/api/payments/my', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to fetch payment ledger');

      const data = await res.json();
      setPayments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = async (appId) => {
    try {
      setRetryingId(appId);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/payments/retry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ application_id: appId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Retry failed');

      navigate(`/my-applications/${appId}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'User Payment Ledger' }]} />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-950 text-emerald-400 text-xs font-bold rounded-full border border-emerald-800">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Digital Payment Ledger & Receipts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Payment Transactions</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Track online facilitation charges, download official receipts, and retry incomplete payment orders.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Payments Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>Payment Audit Trail</span>
          </h2>
          <span className="text-xs font-mono text-slate-500 font-semibold">Total Records: {payments.length}</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
            <p className="text-xs font-medium">Loading transaction ledger...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-600 font-bold text-sm">No payment history recorded yet</p>
            <p className="text-xs text-slate-400">Your service payment receipts will appear here once you submit an application.</p>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow hover:bg-indigo-700 transition-colors"
            >
              Browse Services <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Receipt / Txn ID</th>
                  <th className="py-3.5 px-6">Application ID</th>
                  <th className="py-3.5 px-6">Service</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {payments.map((p) => {
                  const isPaid = p.payment_status === 'PAID';
                  const isPending = p.payment_status === 'PENDING';
                  const isFailed = p.payment_status === 'FAILED';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-mono text-slate-900 font-bold">
                        <div>{p.receipt_number}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{p.payment_transaction_id}</div>
                      </td>
                      <td className="py-4 px-6 font-mono text-indigo-600 font-bold">
                        <Link to={`/my-applications/${p.application_id}`} className="hover:underline">
                          {p.application_number}
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-slate-900 font-semibold">{p.service_name}</td>
                      <td className="py-4 px-6 font-extrabold text-slate-900">₹{p.amount}</td>
                      <td className="py-4 px-6 text-slate-500">
                        {new Date(p.initiated_at || p.created_at || Date.now()).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                          isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          isPending ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {isPaid ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3" />}
                          {p.payment_status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {isPaid ? (
                          <Link
                            to={`/my-applications/${p.application_id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" /> View Receipt
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleRetryPayment(p.application_id)}
                            disabled={retryingId === p.application_id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-colors shadow"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${retryingId === p.application_id ? 'animate-spin' : ''}`} />
                            Retry Payment
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Facilitation Disclaimer */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <p>
          <span className="font-bold text-slate-700">Notice:</span> Service charges displayed on this portal are facilitation/service charges. Official government fees, where applicable, may be separate.
        </p>
      </div>

    </div>
  );
}
