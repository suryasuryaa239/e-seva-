import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileSearch, Search, Clock, CheckCircle2, AlertCircle,
  FileText, ShieldCheck, Download, ExternalLink, RefreshCw, MessageSquare,
  Copy, Check, Printer, ShieldAlert, Phone, HelpCircle, ArrowRight, XCircle, CreditCard
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import StatusBadge from '../components/StatusBadge';
import ReceiptPrint from '../components/ReceiptPrint';

const ALL_STATUS_STEPS = [
  { key: 'DRAFT', label: 'Draft', desc: 'Application initiated & draft saved' },
  { key: 'SUBMITTED', label: 'Submitted', desc: 'Successfully submitted & payment verified' },
  { key: 'UNDER_REVIEW', label: 'Under Review', desc: 'Assigned to nodal officer for document verification' },
  { key: 'PROCESSING', label: 'Processing', desc: 'Verification in progress by field department' },
  { key: 'APPROVED', label: 'Approved', desc: 'Application approved & certificate generated' },
  { key: 'COMPLETED', label: 'Completed', desc: 'Digital certificate issued & service delivered' }
];

export default function ApplicationTracker() {
  const [searchParams] = useSearchParams();
  const initialAppId = searchParams.get('appId') || '';

  const [appId, setAppId] = useState(initialAppId);
  const [phone, setPhone] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedAppId, setCopiedAppId] = useState(false);

  const fetchStatus = async (queryId, queryPhone) => {
    if (!queryId.trim()) return;
    setLoading(true);
    setError('');
    try {
      let url = `/api/applications/track/${encodeURIComponent(queryId.trim())}`;
      if (queryPhone.trim()) {
        url += `?phone=${encodeURIComponent(queryPhone.trim())}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setTrackResult(data);
      } else {
        setTrackResult(null);
        setError(data.error || 'No application found with provided ID');
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to tracking server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialAppId) {
      fetchStatus(initialAppId, '');
    }
  }, [initialAppId]);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!appId.trim()) {
      setError('Please enter a valid Application Reference ID.');
      return;
    }
    fetchStatus(appId, phone);
  };

  // Helper to determine status order index
  const getStatusIndex = (status) => {
    if (!status) return 0;
    const s = status.toUpperCase();
    const idx = ALL_STATUS_STEPS.findIndex(st => st.key === s);
    return idx >= 0 ? idx : 1; // Default to 1 (SUBMITTED) if unknown
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans selection:bg-orange-500 selection:text-white">
      {/* Breadcrumb */}
      <Breadcrumbs items={[{ label: 'Track Application Status' }]} />

      {/* 1. HERO / SEARCH SECTION HEADER */}
      <div className="bg-[#0b192c] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden text-center space-y-3">
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <span className="inline-block text-[10px] sm:text-xs font-black text-orange-400 uppercase tracking-widest bg-slate-800/80 border border-slate-700 px-3.5 py-1 rounded-full">
          APPLICATION STATUS
        </span>

        <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
          Track Your Application
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-xl mx-auto">
          Enter your Application ID to view the latest status and application details.
        </p>
      </div>

      {/* 2. SEARCH FORM CARD */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl space-y-4 max-w-3xl mx-auto">
        <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-7 space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
              Application Reference ID <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. ESV-2026-000001"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs font-mono font-bold rounded-xl px-4 py-3.5 border border-slate-300 focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner"
            />
          </div>

          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
              Mobile Number (Optional)
            </label>
            <input
              type="text"
              placeholder="10-digit phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-4 py-3.5 border border-slate-300 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="sm:col-span-12 pt-2">
            <button
              type="submit"
              disabled={loading || !appId.trim()}
              className="w-full bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                  <span>Retrieving Status Record...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                  <span>Check Application Status</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-5 rounded-2xl flex items-center gap-3 text-xs shadow-sm max-w-3xl mx-auto">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="font-extrabold text-slate-900">Application Record Not Found</p>
            <p className="text-slate-600 mt-0.5">{error}. Please double-check your Application Reference ID.</p>
          </div>
        </div>
      )}

      {/* 3. SEARCH RESULT & STATUS TIMELINE */}
      {trackResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Main Status Summary Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm font-black text-orange-400 bg-[#0b192c] px-3 py-1 rounded-xl shadow-xs">
                    {trackResult.application.application_number}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (trackResult.application.application_number) {
                        navigator.clipboard.writeText(trackResult.application.application_number);
                        setCopiedAppId(true);
                        setTimeout(() => setCopiedAppId(false), 2000);
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border cursor-pointer ${
                      copiedAppId ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                    }`}
                  >
                    {copiedAppId ? <Check className="w-3 h-3 text-emerald-200" /> : <Copy className="w-3 h-3 text-slate-500" />}
                    <span>{copiedAppId ? 'Copied!' : 'Copy ID'}</span>
                  </button>

                  <StatusBadge status={trackResult.application.status} />
                </div>

                <h2 className="font-heading font-extrabold text-xl text-slate-900">
                  {trackResult.service.name}
                </h2>
                
                <p className="text-xs text-slate-500 font-normal">
                  Category: <strong className="text-slate-800">{trackResult.service.category_name}</strong> • Logged: <strong className="text-slate-800">{new Date(trackResult.application.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
                </p>
              </div>

              <div className="text-left sm:text-right bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 block uppercase font-extrabold">Applicant Details</span>
                <span className="font-black text-slate-900 text-sm block">{trackResult.application.user_name}</span>
                <span className="text-xs text-slate-500 block font-mono">{trackResult.application.user_phone}</span>
              </div>
            </div>

            {/* OFFICER REMARKS CALLOUT */}
            <div className="bg-amber-50/90 border border-amber-200 p-4.5 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
              <MessageSquare className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-amber-950 uppercase tracking-wider block">
                  Officer Remarks & Notes
                </span>
                <p className="font-medium text-amber-900 leading-relaxed">
                  "{trackResult.application.admin_remarks || 'Application submitted successfully and assigned to executive queue for review.'}"
                </p>
              </div>
            </div>

            {/* 4. VERTICAL PROGRESS TIMELINE */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Application Lifecycle Timeline</span>
              </h3>

              {trackResult.application.status === 'REJECTED' ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-900 text-xs font-bold">
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  <div>
                    <span className="text-sm font-black block">Application Rejected</span>
                    <span className="text-slate-600 font-normal">This application has been rejected by the verifying authority. Please check officer remarks for further details.</span>
                  </div>
                </div>
              ) : (
                <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-slate-200 ml-2 py-2">
                  {ALL_STATUS_STEPS.map((st, idx) => {
                    const currentIdx = getStatusIndex(trackResult.application.status);
                    const isDone = currentIdx > idx;
                    const isCurrent = currentIdx === idx;

                    return (
                      <div key={st.key} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        {/* Timeline Circle Marker */}
                        <div className={`absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-[#0b192c] border-orange-500 text-orange-400 shadow-md ring-4 ring-orange-500/20'
                            : 'bg-white border-slate-300 text-slate-300'
                        }`}>
                          {isDone ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : isCurrent ? (
                            <div className="w-2 h-2 rounded-full bg-orange-400 animate-ping"></div>
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                          )}
                        </div>

                        {/* Step Details */}
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-extrabold ${isCurrent ? 'text-orange-600' : isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                              {st.label}
                            </span>
                            {isCurrent && (
                              <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Current Stage
                              </span>
                            )}
                            {isDone && (
                              <span className="text-emerald-600 text-[10px] font-extrabold flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> Completed
                              </span>
                            )}
                          </div>
                          <p className={`text-[11px] ${isCurrent ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                            {st.desc}
                          </p>
                        </div>

                        {isCurrent && trackResult.application.updated_at && (
                          <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
                            Updated: {new Date(trackResult.application.updated_at).toLocaleDateString('en-IN')}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* 5. APPLICATION INFORMATION & DOCUMENTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Col: Audit History Timeline */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-heading font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Audit History Log</span>
              </h3>

              <div className="space-y-3">
                {trackResult.history && trackResult.history.length > 0 ? (
                  trackResult.history.map((hist, idx) => (
                    <div key={idx} className="relative pl-5 border-l-2 border-slate-200 space-y-1 py-0.5">
                      <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0b192c]"></div>
                      <div className="flex justify-between items-center text-xs">
                        <StatusBadge status={hist.status} />
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(hist.created_at).toLocaleDateString('en-IN')} {new Date(hist.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium pt-1">
                        {hist.admin_remarks || 'Status updated in system.'}
                      </p>
                      <p className="text-[10px] text-slate-400">Officer: {hist.updated_by || 'E-Seva Facilitation Desk'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No additional audit events logged.</p>
                )}
              </div>
            </div>

            {/* Right Col: Submitted Fields & Documents */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-heading font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                <span>Submitted Information</span>
              </h3>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {trackResult.field_values && trackResult.field_values.length > 0 ? (
                  trackResult.field_values.map((fv) => (
                    <div key={fv.id} className="p-3 bg-slate-50 rounded-xl text-xs flex justify-between border border-slate-200">
                      <span className="text-slate-500 font-semibold">{fv.field_label}:</span>
                      <span className="font-bold text-slate-900">{fv.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No custom field values recorded.</p>
                )}
              </div>

              {/* Payment Summary */}
              {trackResult.payment && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-orange-500" />
                    <span>Payment Information</span>
                  </h4>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 block">Total Fee: ₹{trackResult.payment.amount || trackResult.application.total_fee || 0}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Txn: {trackResult.payment.transaction_id || 'N/A'}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-full font-black text-[10px]">
                      {trackResult.payment.status || 'PAID'}
                    </span>
                  </div>
                </div>
              )}

              {/* Uploaded Documents */}
              {trackResult.documents && trackResult.documents.length > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Uploaded Proof Documents</h4>
                  {trackResult.documents.map((doc) => (
                    <div key={doc.id} className="p-3 bg-emerald-50/70 rounded-xl text-xs flex justify-between items-center border border-emerald-200">
                      <span className="font-bold text-emerald-950">{doc.document_name} ({doc.file_name})</span>
                      <a
                        href={doc.file_path}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0b192c] font-bold hover:text-orange-600 flex items-center gap-1"
                      >
                        <span>View File</span> <ExternalLink className="w-3 h-3 text-orange-500" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* 6. RECEIPT PRINT & ACTIONS */}
          <ReceiptPrint
            applicationData={trackResult.application}
            serviceData={trackResult.service}
            fieldValues={trackResult.field_values}
            paymentData={trackResult.payment}
          />

          {/* Quick Actions Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <Link
              to="/my-applications"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl border border-slate-300 transition-colors inline-flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-orange-500" />
              <span>Go to My Applications</span>
            </Link>

            <Link
              to="/services"
              className="px-5 py-2.5 bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Explore Other E-Services</span>
              <ArrowRight className="w-4 h-4 text-orange-400" />
            </Link>
          </div>

        </div>
      )}

      {/* 7. HELP & SUPPORT SECTION */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200/80 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900">Need help with your application?</h4>
            <p className="text-[11px] text-slate-500 font-medium">Contact our E-Seva customer support desk for status inquiries</p>
          </div>
        </div>

        <Link
          to="/contact"
          className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs rounded-xl border border-slate-300 transition-colors shrink-0"
        >
          Contact Support Desk
        </Link>
      </div>

    </div>
  );
}


