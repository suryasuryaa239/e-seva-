import React from 'react';
import { Clock, Loader2, CheckCircle, CheckCheck, XCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function StatusBadge({ status }) {
  const { lang, t } = useLanguage();
  const normalized = status ? status.toUpperCase().replace(/\s+/g, '_') : 'PENDING';

  switch (normalized) {
    case 'DRAFT':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          {t.statusDraft || (lang === 'ta' ? 'வரைவு' : 'Draft')}
        </span>
      );
    case 'SUBMITTED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          {t.statusSubmitted || (lang === 'ta' ? 'சமர்ப்பிக்கப்பட்டது' : 'Submitted')}
        </span>
      );
    case 'UNDER_REVIEW':
    case 'IN_REVIEW':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
          {t.statusUnderReview || (lang === 'ta' ? 'பரிசீலனையில் உள்ளது' : 'Under Review')}
        </span>
      );
    case 'PROCESSING':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
          {t.statusProcessing || (lang === 'ta' ? 'செயலாக்கத்தில் உள்ளது' : 'Processing')}
        </span>
      );
    case 'APPROVED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          {t.statusApproved || (lang === 'ta' ? 'அங்கீகரிக்கப்பட்டது' : 'Approved')}
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
          <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
          {t.statusCompleted || (lang === 'ta' ? 'நிறைவு பெற்றது' : 'Completed')}
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          {t.statusRejected || (lang === 'ta' ? 'நிராகரிக்கப்பட்டது' : 'Rejected')}
        </span>
      );
    case 'PAID':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          {t.payStatusPaid || (lang === 'ta' ? 'செலுத்தப்பட்டது' : 'Paid')}
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          {t.payStatusPending || (lang === 'ta' ? 'நிலுவையில் உள்ளது' : 'Pending')}
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          {t.payStatusFailed || (lang === 'ta' ? 'தோல்வியடைந்தது' : 'Failed')}
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
          <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />
          {t.payStatusCancelled || (lang === 'ta' ? 'ரத்து செய்யப்பட்டது' : 'Cancelled')}
        </span>
      );
    case 'REFUNDED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
          {t.payStatusRefunded || (lang === 'ta' ? 'பணம் திருப்பி வழங்கப்பட்டது' : 'Refunded')}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
          {status}
        </span>
      );
  }
}
