import React, { useState } from 'react';
import { Award, ShieldCheck, Printer, CheckCircle, QrCode, Download, ExternalLink, FileText } from 'lucide-react';

export default function CertificatePrint({ application, onClose }) {
  if (!application) return null;

  const [viewMode, setViewMode] = useState(application?.certificate_url ? 'document' : 'certificate');

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

  const certUrl = application?.certificate_url || '';
  const isPdf = certUrl.toLowerCase().includes('.pdf');
  const isImage = certUrl.match(/\.(jpe?g|png|webp)/i) || certUrl.startsWith('data:image/');

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto print:p-0 print:static print:bg-white">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 print:shadow-none print:border-none print:w-full print:max-w-none flex flex-col max-h-[92vh]">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-slate-900 text-white p-4 flex flex-wrap justify-between items-center gap-3 print:hidden border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Award className="w-4 h-4" /> 
              <span>Official Certificate Desk</span>
            </div>

            {/* Toggle Modes if file is uploaded */}
            {certUrl && (
              <div className="bg-slate-800 p-0.5 rounded-xl border border-slate-700 flex items-center text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('document')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${viewMode === 'document' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  📄 Uploaded File
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('certificate')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${viewMode === 'certificate' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  📜 Digital Slip
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {certUrl && (
              <a
                href={certUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow"
              >
                <Download className="w-4 h-4" /> 
                <span>Download Admin File</span>
              </a>
            )}
            {viewMode === 'certificate' && (
              <button
                type="button"
                onClick={handlePrint}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6">
          
          {/* VIEW MODE 1: ADMIN UPLOADED DOCUMENT (PDF or IMAGE) */}
          {viewMode === 'document' && certUrl && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                      Official Admin-Uploaded Certificate Document
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Ref: {certNumber} • Issued: {issueDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={certUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Original</span>
                  </a>
                  <a
                    href={certUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-white text-slate-700 font-bold text-xs rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in New Tab</span>
                  </a>
                </div>
              </div>

              {/* Document Preview Frame */}
              <div className="bg-slate-100 rounded-2xl border border-slate-200 p-2 sm:p-4 flex items-center justify-center min-h-[400px]">
                {isImage ? (
                  <img
                    src={certUrl}
                    alt="Official Certificate"
                    className="max-h-[75vh] w-auto mx-auto rounded-xl shadow-md object-contain border border-slate-200"
                  />
                ) : isPdf ? (
                  <iframe
                    src={certUrl}
                    title="Certificate PDF Preview"
                    className="w-full h-[70vh] rounded-xl border border-slate-300 bg-white"
                  />
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Official Document Attached</h4>
                      <p className="text-xs text-slate-500">File is ready for download and offline verification.</p>
                    </div>
                    <a
                      href={certUrl}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg"
                    >
                      <Download className="w-4 h-4" /> Download Certificate
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW MODE 2: DIGITAL CERTIFICATE SLIP TEMPLATE */}
          {(viewMode === 'certificate' || !certUrl) && (
            <div className="p-4 sm:p-8 md:p-10 relative font-serif print:p-0">
              
              {/* Certificate Watermark Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <ShieldCheck className="w-96 h-96 text-slate-900" />
              </div>

              {/* Decorative Border Frame */}
              <div className="border-4 border-double border-amber-600 p-6 md:p-8 rounded-2xl relative z-10 bg-amber-50/20 shadow-xs">
                
                {/* Header / Government Seal */}
                <div className="text-center space-y-2 border-b-2 border-amber-600/30 pb-6">
                  <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-widest text-slate-900 font-sans">
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
                <div className="py-6 sm:py-8 space-y-6 text-center font-sans">
                  <p className="text-xs font-sans uppercase tracking-widest text-slate-500 font-bold">
                    Certificate Registration No: <span className="font-mono text-slate-900 font-extrabold text-sm">{certNumber}</span>
                  </p>

                  <div className="space-y-3 max-w-xl mx-auto font-serif">
                    <p className="text-sm italic text-slate-700">
                      This is to officially certify that the digital application submitted for
                    </p>
                    <h2 className="text-lg sm:text-xl font-bold font-sans text-amber-700 underline decoration-amber-500/40 underline-offset-4">
                      {application.service_name}
                    </h2>
                    <p className="text-sm italic text-slate-700">
                      has been verified, validated, and processed in full compliance with prescribed statutory norms for
                    </p>
                    <div className="p-4 bg-white/80 rounded-xl border border-amber-200 shadow-sm inline-block w-full">
                      <span className="block text-xs font-sans text-slate-500 uppercase tracking-wider font-bold">Applicant Name</span>
                      <span className="text-base sm:text-lg font-bold font-sans text-slate-900">{application.user_name}</span>
                      <span className="block text-xs font-sans text-slate-500 mt-1 font-mono">App No: {application.application_number}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-center gap-2 text-emerald-700 font-sans font-bold text-xs sm:text-sm bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl inline-flex mx-auto">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    Officially Approved & Digitally Verified
                  </div>
                </div>

                {/* Footer Signatures & QR Code */}
                <div className="pt-6 border-t-2 border-amber-600/30 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 text-xs font-sans">
                  
                  {/* Left Info & Date */}
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-slate-500 font-semibold">Date of Issue: <span className="font-bold text-slate-900">{issueDate}</span></p>
                    <p className="text-slate-500 font-semibold">Place of Issue: <span className="font-bold text-slate-900">E-Seva Central Portal</span></p>
                    <p className="text-[10px] text-slate-400 max-w-xs mt-1">
                      This digital certificate is computer generated. Verification code validates origin and authenticity on portal.
                    </p>
                  </div>

                  {/* Security QR Verification */}
                  <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-950 text-amber-400 p-2 rounded-xl flex items-center justify-center shadow mx-auto">
                      <QrCode className="w-full h-full" />
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 block mt-1">Scan to Verify</span>
                  </div>

                  {/* Digital Seal */}
                  <div className="text-center space-y-1">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-amber-600 flex items-center justify-center mx-auto text-[9px] font-bold uppercase text-amber-800 bg-amber-100/50">
                      Digital<br/>Seal
                    </div>
                    <p className="font-bold text-slate-900 text-[11px] pt-1">Competent Authority</p>
                    <p className="text-[10px] text-slate-500">State E-Governance Hub</p>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
