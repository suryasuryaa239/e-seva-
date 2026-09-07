import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, ShieldCheck, CheckCircle2, Clock, AlertCircle, FileText, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import StatusBadge from '../components/StatusBadge';
import { useLanguage } from '../context/LanguageContext';

export default function UserPayments() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans selection:bg-orange-500 selection:text-white">
      <Breadcrumbs items={[{ label: t.paymentLedgerTitle || (lang === 'ta' ? 'கட்டணப் பதிவேடு' : 'User Payment Ledger') }]} />

      {/* Header Banner */}
      <div className="bg-[#0b192c] text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-950/80 text-orange-400 text-xs font-bold rounded-full border border-orange-800/80">
            <CreditCard className="w-3.5 h-3.5" />
            <span>{t.digitalPaymentBadge || (lang === 'ta' ? 'டிஜிட்டல் கட்டண பதிவேடு & ரசீதுகள்' : 'Digital Payment Ledger & Receipts')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{t.paymentLedgerTitle}</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {t.paymentLedgerSubtitle}
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
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
            <span>{t.paymentAuditTrailTitle || (lang === 'ta' ? 'கட்டண தணிக்கைப் பதிவு' : 'Payment Audit Trail')}</span>
          </h2>
          <span className="text-xs font-mono text-slate-500 font-semibold">{t.totalRecordsLabel || (lang === 'ta' ? 'மொத்த பதிவுகள்:' : 'Total Records:')} {payments.length}</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-orange-500" />
            <p className="text-xs font-medium">{lang === 'ta' ? 'கட்டணப் பதிவேடு ஏற்றப்படுகிறது...' : 'Loading transaction ledger...'}</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-600 font-bold text-sm">{t.noPaymentHistoryTitle}</p>
            <p className="text-xs text-slate-400">{t.noPaymentHistoryDesc}</p>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-orange-500 text-white rounded-xl font-extrabold text-xs shadow hover:bg-orange-600 transition-colors"
            >
              {t.exploreOtherServicesBtn} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">{t.receiptTxnIdHeader || (lang === 'ta' ? 'ரசீது / பரிவர்த்தனை எண்' : 'Receipt / Txn ID')}</th>
                  <th className="py-3.5 px-6">{t.appIdHeader || (lang === 'ta' ? 'விண்ணப்ப எண்' : 'Application ID')}</th>
                  <th className="py-3.5 px-6">{t.serviceHeader || (lang === 'ta' ? 'சேவை' : 'Service')}</th>
                  <th className="py-3.5 px-6">{t.amountHeader || (lang === 'ta' ? 'தொகை' : 'Amount')}</th>
                  <th className="py-3.5 px-6">{t.dateHeader || (lang === 'ta' ? 'தேதி' : 'Date')}</th>
                  <th className="py-3.5 px-6">{t.statusHeader || (lang === 'ta' ? 'நிலை' : 'Status')}</th>
                  <th className="py-3.5 px-6 text-right">{t.actionsHeader || (lang === 'ta' ? 'செயல்கள்' : 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {payments.map((p) => {
                  const isPaid = p.payment_status === 'PAID';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-mono text-slate-900 font-bold">
                        <div>{p.receipt_number}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{p.payment_transaction_id}</div>
                      </td>
                      <td className="py-4 px-6 font-mono text-orange-600 font-bold">
                        <Link to={`/my-applications/${p.application_id}`} className="hover:underline">
                          {p.application_number}
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-slate-900 font-semibold">{p.service_name}</td>
                      <td className="py-4 px-6 font-extrabold text-slate-900">₹{p.amount}</td>
                      <td className="py-4 px-6 text-slate-500">
                        {new Date(p.initiated_at || p.created_at || Date.now()).toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={p.payment_status} />
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {isPaid ? (
                          <Link
                            to={`/my-applications/${p.application_id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-xs font-bold transition-colors border border-orange-200/80"
                          >
                            <FileText className="w-3.5 h-3.5" /> {t.viewReceiptBtn}
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleRetryPayment(p.application_id)}
                            disabled={retryingId === p.application_id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-colors shadow"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${retryingId === p.application_id ? 'animate-spin' : ''}`} />
                            {t.retryPaymentBtn}
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
        <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
        <p>{t.facilitationNoticeDisclaimer}</p>
      </div>

    </div>
  );
}
