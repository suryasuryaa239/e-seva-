import React from 'react';
import { Award, ShieldCheck, Printer, CheckCircle, QrCode } from 'lucide-react';

export default function CertificatePrint({ application, onClose }) {
  if (!application) return null;

  const handlePrint = () => {
    window.print();
  };

  const certNumber = application.certificate_number || `CERT-2026-${String(application.id).padStart(6, '0')}`;
  const issueDate = application.certificate_issued_at
    ? new Date(application.certificate_issued_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto print:p-0 print:static print:bg-white">
      <div className="bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 print:shadow-none print:border-none print:w-full print:max-w-none">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Award className="w-4 h-4" /> Official Digital Certificate Preview
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Certificate Container */}
        <div className="p-8 md:p-12 relative font-serif print:p-8">
          
          {/* Certificate Watermark Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <ShieldCheck className="w-96 h-96 text-slate-900" />
          </div>

          {/* Decorative Border Frame */}
          <div className="border-4 border-double border-amber-600 p-6 md:p-8 rounded-xl relative z-10 bg-amber-50/20">
            
            {/* Header / Government Seal */}
            <div className="text-center space-y-2 border-b-2 border-amber-600/30 pb-6">
              <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-widest text-slate-900">
                E-Seva Digital Governance Portal
              </h1>
              <p className="text-xs uppercase font-sans tracking-wider text-slate-600 font-semibold">
                Government Facilitation Service • State e-Governance Hub
              </p>
              <div className="inline-block bg-amber-600 text-white font-sans text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider mt-2">
                Official Digital Certificate of Verification
              </div>
            </div>

            {/* Certificate Body */}
            <div className="py-8 space-y-6 text-center">
              <p className="text-xs font-sans uppercase tracking-widest text-slate-500 font-bold">
                Certificate Registration No: <span className="font-mono text-slate-900 font-extrabold text-sm">{certNumber}</span>
              </p>

              <div className="space-y-3 max-w-xl mx-auto">
                <p className="text-sm font-serif italic text-slate-700">
                  This is to officially certify that the digital application submitted for
                </p>
                <h2 className="text-xl md:text-2xl font-bold font-sans text-amber-700 underline decoration-amber-500/40 underline-offset-4">
                  {application.service_name}
                </h2>
                <p className="text-sm font-serif italic text-slate-700">
                  has been verified, validated, and processed in full compliance with prescribed statutory norms for
                </p>
                <div className="p-4 bg-white/80 rounded-xl border border-amber-200 shadow-sm inline-block w-full">
                  <span className="block text-xs font-sans text-slate-500 uppercase tracking-wider font-bold">Applicant Name</span>
                  <span className="text-lg md:text-xl font-bold font-sans text-slate-900">{application.user_name}</span>
                  <span className="block text-xs font-sans text-slate-500 mt-1 font-mono">App No: {application.application_number}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-center gap-2 text-emerald-700 font-sans font-bold text-sm bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl inline-flex mx-auto">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Officially Approved & Digitally Verified
              </div>
            </div>

            {/* Footer Signatures & QR Code */}
            <div className="pt-6 border-t-2 border-amber-600/30 flex justify-between items-end text-xs font-sans">
              
              {/* Left Info & Date */}
              <div className="space-y-1">
                <p className="text-slate-500 font-semibold">Date of Issue: <span className="font-bold text-slate-900">{issueDate}</span></p>
                <p className="text-slate-500 font-semibold">Place of Issue: <span className="font-bold text-slate-900">E-Seva Central Portal</span></p>
                <p className="text-[10px] text-slate-400 max-w-xs mt-2">
                  This digital certificate is computer generated. Verification code validates origin and authenticity on portal.
                </p>
              </div>

              {/* Security QR Verification */}
              <div className="text-center">
                <div className="w-20 h-20 bg-slate-950 text-amber-400 p-2 rounded-xl flex items-center justify-center shadow mx-auto">
                  <QrCode className="w-16 h-16" />
                </div>
                <span className="text-[9px] font-mono text-slate-500 block mt-1">Scan to Verify</span>
              </div>

              {/* Digital Seal */}
              <div className="text-center space-y-1">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-600 flex items-center justify-center mx-auto text-[9px] font-bold uppercase text-amber-800 bg-amber-100/50">
                  Digital<br/>Seal
                </div>
                <p className="font-bold text-slate-900 text-[11px] pt-1">Competent Authority</p>
                <p className="text-[10px] text-slate-500">State E-Governance Hub</p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
