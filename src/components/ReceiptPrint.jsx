import React from 'react';
import { Printer, Download, CheckCircle, Landmark, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ReceiptPrint({ applicationData, serviceData, fieldValues, paymentData }) {
  const { lang, t } = useLanguage();
  if (!applicationData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Action Header */}
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center no-print">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-sm">{t.acknowledgementReceiptTitle}</span>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors shadow"
        >
          <Printer className="w-4 h-4" />
          {t.downloadPrintReceipt}
        </button>
      </div>

      {/* Printable Body */}
      <div id="printable-receipt" className="p-8 sm:p-12 font-sans">
        
        {/* Government Letterhead Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Landmark className="w-7 h-7 text-indigo-900" />
              <h1 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
                {t.digitalPortalTitle}
              </h1>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {t.officialFilingSub}
            </p>
            <p className="text-[11px] text-slate-500">{t.officialReceiptAudit}</p>
          </div>

          <div className="text-right">
            <span className="inline-block bg-slate-100 text-slate-800 text-xs font-mono font-bold px-3 py-1.5 rounded border border-slate-300">
              {applicationData.application_number}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              {t.dateLabel || 'Date'}: {new Date(applicationData.created_at || Date.now()).toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Status Notification Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8 flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 block">{t.currentStatusLabel}</span>
            <span className="text-lg font-bold text-emerald-900">{applicationData.status || (lang === 'ta' ? 'நிலுவையில்' : 'Pending')}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">{t.categoryAndServiceLabel}</span>
            <span className="font-semibold text-slate-900 text-sm">{serviceData?.name || (lang === 'ta' ? 'டிஜிட்டல் சேவை' : 'Digital Service')}</span>
          </div>
        </div>

        {/* Applicant Information Grid */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">
            {t.applicantInfoSection}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 block">{t.fullName}</span>
              <span className="font-semibold text-slate-900">{applicationData.user_name}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">{t.mobileNumber}</span>
              <span className="font-semibold text-slate-900">{applicationData.user_phone}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">{t.emailAddress}</span>
              <span className="font-semibold text-slate-900">{applicationData.user_email}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Service Form Fields Submitted */}
        {fieldValues && fieldValues.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">
              {t.submittedServiceDetailsSection}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {fieldValues.map((field, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500 block font-medium">{field.field_label}</span>
                  <span className="font-semibold text-slate-800 break-words">{field.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">
            {t.feePaymentReceiptSection}
          </h3>
          <div className="bg-indigo-50/60 rounded-xl border border-indigo-100 p-5 space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-indigo-100 pb-3">
              <div>
                <span className="text-xs text-indigo-700 font-medium block">{t.paymentConfirmationTitle}</span>
                <span className="font-bold text-indigo-900 flex items-center gap-1.5 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  {paymentData?.payment_status || t.paidStatusTag} ({paymentData?.payment_method || (lang === 'ta' ? 'ஆன்லைன் UPI / நெட் பேங்கிங்' : 'Online UPI / NetBanking')})
                </span>
                {paymentData?.payment_transaction_id && (
                  <p className="text-[11px] text-slate-600 font-mono mt-1">
                    {t.transactionRefLabel}: <span className="font-bold text-slate-900">{paymentData.payment_transaction_id}</span>
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block font-medium">{t.totalPayableLabel}</span>
                <span className="font-heading font-extrabold text-2xl text-indigo-950">
                  ₹{applicationData.total_fee || paymentData?.amount || 0}
                </span>
              </div>
            </div>

            {/* Official Facilitation Fee Legal Disclaimer */}
            <p className="text-[11px] text-slate-500 italic bg-white p-3 rounded-lg border border-indigo-100">
              {t.facilitationNoticeDisclaimer}
            </p>
          </div>
        </div>

        {/* Remarks & Security QR Footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold text-slate-800">{t.digitallyAuthenticatedReceipt}</p>
              <p>{t.keepAppIdSafeText}</p>
            </div>
          </div>
          <div className="text-right text-[10px] text-slate-400 font-mono">
            {t.generatedOnText}: {new Date().toLocaleString(lang === 'ta' ? 'ta-IN' : 'en-IN')}
          </div>
        </div>

      </div>
    </div>
  );
}
