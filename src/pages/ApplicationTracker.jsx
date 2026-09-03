import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileSearch, Search, Clock, CheckCircle2, AlertCircle,
  FileText, ShieldCheck, Download, ExternalLink, RefreshCw, MessageSquare,
  Copy, Check, Printer, ShieldAlert
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import StatusBadge from '../components/StatusBadge';
import ReceiptPrint from '../components/ReceiptPrint';

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
    fetchStatus(appId, phone);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans selection:bg-orange-500 selection:text-white">
      <Breadcrumbs items={[{ label: 'Track Application Status' }]} />

      {/* NAVY HEADER BANNER */}
      <div className="bg-[#0b192c] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden text-center space-y-3">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <span className="inline-block text-[10px] sm:text-xs font-black text-orange-400 uppercase tracking-widest bg-slate-800/80 border border-slate-700 px-3.5 py-1 rounded-full">
          APPLICATION TRACKER & REAL-TIME AUDIT
        </span>

        <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
          Track Your Application
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-xl mx-auto">
          Enter your Application ID to track live verification status, official officer remarks, and download digital receipts.
        </p>
      </div>

      {/* TRACKING INPUT CARD */}
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
              className="w-full bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
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

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-5 rounded-2xl flex items-center gap-3 text-xs shadow-sm max-w-3xl mx-auto">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="font-extrabold">Tracking Record Not Found</p>
            <p className="text-slate-600 mt-0.5">{error}. Please verify your Application ID and try again.</p>
          </div>
        </div>
      )}

      {/* TRACKING RESULTS VIEW */}
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
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
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

              <div className="text-left sm:text-right bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block uppercase font-extrabold">Applicant Name</span>
                <span className="font-black text-slate-900 text-sm">{trackResult.application.user_name}</span>
                <span className="text-xs text-slate-500 block font-mono">{trackResult.application.user_phone}</span>
              </div>
            </div>

            {/* ADMIN REMARKS CALLOUT CARD */}
            <div className="bg-amber-50/80 border border-amber-200/90 p-4.5 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
              <MessageSquare className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-amber-950 uppercase tracking-wider block">
                  Official Officer Remarks & Processing Status
                </span>
                <p className="font-medium text-amber-900 leading-relaxed">
                  "{trackResult.application.admin_remarks || 'Application submitted successfully and assigned to executive queue for review.'}"
                </p>
              </div>
            </div>

            {/* 4-Step Application Progress Timeline Stepper */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Application Progress Stepper
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {['Pending', 'Processing', 'Approved', 'Completed'].map((st, idx) => {
                  const currIndex = ['Pending', 'Processing', 'Approved', 'Completed'].indexOf(trackResult.application.status);
                  const isDone = currIndex >= idx;
                  const isCurrent = trackResult.application.status === st;

                  return (
                    <div
                      key={st}
                      className={`p-3.5 rounded-2xl border text-xs font-extrabold transition-all ${
                        isCurrent
                          ? 'bg-[#0b192c] text-white border-slate-900 shadow-md ring-2 ring-orange-400/40'
                          : isDone
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      <div className="text-[10px] opacity-70 uppercase tracking-wider font-mono">Step 0{idx + 1}</div>
                      <div className="text-xs mt-0.5">{st}</div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* AUDIT TRAIL HISTORY & SUBMITTED DATA GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Col: Status Audit Trail History */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-heading font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Status History Audit Trail</span>
              </h3>

              <div className="space-y-3">
                {trackResult.history && trackResult.history.map((hist, idx) => (
                  <div key={idx} className="relative pl-5 border-l-2 border-slate-200 space-y-1 py-0.5">
                    <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0b192c]"></div>
                    <div className="flex justify-between items-center text-xs">
                      <StatusBadge status={hist.status} />
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(hist.created_at).toLocaleDateString('en-IN')} {new Date(hist.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium pt-1">
                      {hist.admin_remarks}
                    </p>
                    <p className="text-[10px] text-slate-400">Officer: {hist.updated_by || 'E-Seva Facilitation Desk'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Submitted Fields & Documents */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-heading font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                <span>Submitted Field Information</span>
              </h3>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {trackResult.field_values && trackResult.field_values.map((fv) => (
                  <div key={fv.id} className="p-3 bg-slate-50 rounded-xl text-xs flex justify-between border border-slate-200">
                    <span className="text-slate-500 font-semibold">{fv.field_label}:</span>
                    <span className="font-bold text-slate-900">{fv.value}</span>
                  </div>
                ))}
              </div>

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

          {/* RECEIPT PRINT VIEW */}
          <ReceiptPrint
            applicationData={trackResult.application}
            serviceData={trackResult.service}
            fieldValues={trackResult.field_values}
            paymentData={trackResult.payment}
          />

        </div>
      )}
    </div>
  );
}

