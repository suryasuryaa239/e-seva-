import React from 'react';
import { Clock, Loader2, CheckCircle, CheckCheck, XCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function StatusBadge({ status }) {
  const { lang, t } = useLanguage();
  const normalized = status ? status.toLowerCase() : 'pending';

  switch (normalized) {
    case 'pending':
    case 'submitted':
    case 'draft':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          {lang === 'ta' ? 'சமர்ப்பிக்கப்பட்டது / ஆய்வில்' : 'Pending Review'}
        </span>
      );
    case 'processing':
    case 'under_review':
    case 'in_review':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
          {lang === 'ta' ? 'அதிகாரி ஆய்வில் உள்ளது' : 'Processing'}
        </span>
      );
    case 'approved':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          {lang === 'ta' ? 'ஒப்புதல் அளிக்கப்பட்டது' : 'Approved'}
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
          <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
          {lang === 'ta' ? 'சான்றிதழ் தயார்' : 'Completed'}
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          {lang === 'ta' ? 'நிராகரிக்கப்பட்டது' : 'Rejected'}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {status}
        </span>
      );
  }
}
