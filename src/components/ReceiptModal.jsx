import React, { useEffect } from 'react';
import { Printer, X, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ReceiptModal({ application, service, applicantInfo, fieldValues, onClose }) {
  const { lang } = useLanguage();

  const handleClose = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose(e);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!application) return null;

  // Normalizing fields
  const appNumber = application.application_number || application.app_id || 'ESV-2026-000001';
  const recNumber = `TNREC-${(appNumber.replace(/[^0-9]/g, '') || Date.now().toString().slice(-6))}`;
  const serviceName = service?.name || application.service_name || (lang === 'ta' ? 'இ-சேவை சான்றிதழ் சேவை' : 'Aadhaar Address Update');
  const amountPaid = Number(application.total_fee || application.amount || service?.fee || 50);
  const payMode = (application.payment_method || application.payment_mode || 'UPI / ONLINE').toUpperCase();
  const dateStr = new Date(application.submitted_at || application.created_at || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) + ', ' + new Date(application.submitted_at || application.created_at || Date.now()).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).toLowerCase();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200 eseva-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose(e);
      }}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* MODAL ACTION HEADER (no-print) */}
        <div className="px-5 py-3 bg-[#0b192c] text-white flex items-center justify-between border-b border-slate-800 no-print">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center border border-orange-500/30">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xs text-white">
                {lang === 'ta' ? 'அதிகாரப்பூர்வ இ-சேவை கட்டண ரசீது' : 'Official E-Seva Payment Receipt'}
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">
                {lang === 'ta' ? 'ரசீதை அச்சிடுக அல்லது PDF ஆக சேமிக்கவும்' : 'Print receipt or save as PDF document'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-[11px] rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'ta' ? 'அச்சிடுக / PDF' : 'Print / Save PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close receipt modal"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MODAL SCROLLABLE BODY / PRINTABLE RECEIPT TEMPLATE */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-100">
          
          <div id="printable-receipt" className="bg-white rounded-2xl border border-slate-300 text-slate-900 font-sans max-w-md mx-auto shadow-sm overflow-hidden">
            
            {/* GOVT OFFICIAL TOP BANNER */}
            <div className="bg-[#0b192c] text-white px-4 py-3.5 flex items-center justify-between border-b-2 border-orange-500">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-black text-sm border border-orange-500/40">
                  TN
                </div>
                <div>
                  <h1 className="font-heading font-black text-xs text-white tracking-wide uppercase leading-tight">
                    TN e-Seva
                  </h1>
                  <p className="text-[9px] text-orange-400 font-extrabold tracking-wider uppercase">
                    Digital Services
                  </p>
                </div>
              </div>

              {/* COMPACT PAYMENT RECEIPT BADGE */}
              <div className="text-right">
                <span className="font-heading font-extrabold text-[9px] tracking-wider uppercase text-white bg-orange-500/20 px-2 py-0.5 rounded border border-orange-500/40 inline-block">
                  PAYMENT RECEIPT
                </span>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                  {recNumber}
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-4 text-xs">

              {/* PAYMENT METADATA STRIP WITH ENHANCED LABEL-TO-VALUE SPACING */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-5 bg-slate-50/90 p-4 rounded-xl border border-slate-200">
                <div className="space-y-2">
                  <span className="text-slate-500 text-[10px] font-extrabold uppercase tracking-wider block">
                    Application ID
                  </span>
                  <span className="font-mono font-black text-slate-900 text-xs sm:text-sm tracking-tight block">
                    {appNumber}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-500 text-[10px] font-extrabold uppercase tracking-wider block">
                    Date & Time
                  </span>
                  <span className="font-semibold text-slate-800 text-xs sm:text-sm block">
                    {dateStr}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-500 text-[10px] font-extrabold uppercase tracking-wider block">
                    Payment Method
                  </span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm uppercase block">
                    {payMode}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-500 text-[10px] font-extrabold uppercase tracking-wider block">
                    Payment Status
                  </span>
                  <span className="font-extrabold text-emerald-700 text-xs sm:text-sm block">
                    PAID SUCCESSFUL
                  </span>
                </div>
              </div>

              {/* FEE BREAKDOWN TABLE */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between border-b pb-1 border-slate-200">
                  <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[10px]">
                    Fee Description & Charges
                  </h3>
                  <span className="text-[9px] font-bold text-slate-500">INR (₹)</span>
                </div>

                <table className="w-full border-collapse border border-slate-200 text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-[9px] font-extrabold uppercase border-b border-slate-200">
                      <th className="p-2 border-r border-slate-200 w-8 text-center">#</th>
                      <th className="p-2 border-r border-slate-200">Description</th>
                      <th className="p-2 text-right w-20">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium text-xs">
                    <tr>
                      <td className="p-2 border-r border-slate-200 font-mono text-center text-slate-500 text-[11px]">1</td>
                      <td className="p-2 border-r border-slate-200 font-bold text-slate-900 leading-snug">
                        {serviceName} - Government Application Fee
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-slate-900 text-xs">
                        ₹{amountPaid.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-200 font-mono text-center text-slate-500 text-[11px]">2</td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">
                        Convenience & Processing Fee
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-emerald-700 text-xs">
                        ₹0.00
                      </td>
                    </tr>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-t border-slate-300 text-[10px]">
                      <td colSpan="2" className="p-2 border-r border-slate-200 text-right uppercase text-slate-600">Sub-Total:</td>
                      <td className="p-2 text-right font-mono font-bold text-slate-900 text-xs">₹{amountPaid.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* TOTAL PAID & COMPACT SUCCESS BADGE */}
              <div className="bg-emerald-50/90 border border-emerald-300 p-3 rounded-xl flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[9px] font-black uppercase tracking-wider block">
                    TOTAL AMOUNT PAID
                  </span>
                  <span className="font-heading font-black text-xl text-emerald-950 font-mono tracking-tight block">
                    ₹{amountPaid.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-emerald-600 text-white px-2.5 py-1 rounded-md shadow-xs border border-emerald-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white flex-shrink-0" />
                  <span className="font-heading font-black text-[10px] uppercase tracking-wider block">
                    PAID SUCCESSFUL
                  </span>
                </div>
              </div>

              {/* OFFICIAL FOOTER NOTES */}
              <div className="pt-2.5 border-t border-slate-200 text-[9px] text-slate-500 space-y-0.5 text-center font-medium">
                <p className="font-semibold text-slate-700">
                  TN e-Seva Portal | No physical signature is required.
                </p>
                <p className="text-slate-400 font-mono">
                  Email: support.eseva@tn.gov.in
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* MODAL FOOTER ACTIONS (no-print) */}
        <div className="px-4 py-2.5 bg-slate-100 text-slate-800 flex items-center justify-between border-t border-slate-200 no-print">
          <span className="text-[10px] text-slate-500 font-medium">
            Receipt No: <strong className="font-mono text-slate-900">{recNumber}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
            >
              {lang === 'ta' ? 'மூடுக' : 'Close'}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1 bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-[11px] rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-orange-400" />
              <span>{lang === 'ta' ? 'அச்சிடுக / பதிவிறக்குக' : 'Print / Save Receipt'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
