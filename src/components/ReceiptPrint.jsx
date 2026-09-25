import React, { useState } from 'react';
import ReceiptModal from './ReceiptModal';
import { FileText, Printer } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ReceiptPrint({ applicationData, serviceData, fieldValues, paymentData }) {
  const [isOpen, setIsOpen] = useState(false);
  const { lang } = useLanguage();

  if (!applicationData) return null;

  return (
    <>
      {/* Tracker Receipt Action Card */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200/80 flex items-center justify-center shrink-0 shadow-2xs">
            <FileText className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">
              {lang === 'ta' ? 'அதிகாரப்பூர்வ கட்டண ரசீது' : 'Official Payment Receipt'}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'ta' ? 'அரசு சேவை கட்டணம் செலுத்தியதற்கான சரிபார்க்கப்பட்ட டிஜிட்டல் ரசீது.' : 'Download or print the authenticated e-Seva government fee receipt.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-5 py-2.5 bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm flex items-center space-x-2 shrink-0 cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <Printer className="w-4 h-4 text-orange-400" />
          <span>{lang === 'ta' ? 'ரசீதை பார்க்க / அச்சிடுக' : 'View / Print Receipt'}</span>
        </button>
      </div>

      {/* Official Receipt Modal with functional close handler */}
      {isOpen && (
        <ReceiptModal
          application={{
            ...applicationData,
            payment_transaction_id: paymentData?.payment_transaction_id || applicationData?.payment_transaction_id,
            payment_method: paymentData?.payment_method || applicationData?.payment_method,
            total_fee: paymentData?.amount || applicationData?.total_fee || applicationData?.amount
          }}
          service={serviceData}
          fieldValues={fieldValues}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
