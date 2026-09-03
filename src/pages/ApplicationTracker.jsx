import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileSearch, Search, Clock, CheckCircle2, AlertCircle,
  FileText, ShieldCheck, Download, ExternalLink, RefreshCw, MessageSquare
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans selection:bg-blue-600 selection:text-white">
      <Breadcrumbs items={[{ label: 'Track Application Status' }]} />

      {/* CENTERED SECTION HEADER (STEP 5 SPECIFICATION) */}
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-4">
        <span className="inline-block text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-3 py-1 rounded-full">
          APPLICATION STATUS
        </span>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Track Your Application
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
          Enter your application details to quickly check the current status of your application.
        </p>
      </div>

      {/* CENTERED TRACKING CARD */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-3xl mx-auto">
        <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-7">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-1.5">
              Application ID <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. ESV-2026-000001"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs font-mono rounded-xl px-4 py-3 border border-slate-300 focus:border-slate-900 focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-1.5">
              Mobile Number (Optional)
            </label>
            <input
              type="text"
              placeholder="10-digit phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-4 py-3 border border-slate-300 focus:border-slate-900 focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="sm:col-span-12 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                  <span>Checking Status...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                  <span>Check Status</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-5 rounded-xl flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="font-bold">Tracking Record Not Found</p>
            <p className="text-slate-600 mt-0.5">{error}. Please verify your Application ID.</p>
          </div>
        </div>
      )}

      {/* TRACKING RESULTS VIEW */}
      {trackResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Main Status Summary Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-extrabold text-blue-950 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                    {trackResult.application.application_number}
                  </span>
                  <StatusBadge status={trackResult.application.status} />
                </div>
                <h2 className="font-heading font-extrabold text-xl text-slate-900 mt-1">
                  {trackResult.service.name}
                </h2>
                <p className="text-xs text-slate-500 font-normal">
                  Category: {trackResult.service.category_name} • Filed on: {new Date(trackResult.application.created_at).toLocaleString()}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-slate-400 block uppercase font-bold">Applicant Name</span>
                <span className="font-bold text-slate-900 text-sm">{trackResult.application.user_name}</span>
                <span className="text-xs text-slate-500 block">{trackResult.application.user_phone}</span>
              </div>
            </div>

            {/* ADMIN REMARKS CALLOUT CARD */}
            <div className="bg-blue-50/80 border border-blue-200 p-4.5 rounded-xl flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block">
                  Official Admin Remarks & Processing Note
                </span>
                <p className="text-xs font-medium text-slate-800 leading-relaxed">
                  "{trackResult.application.admin_remarks || 'Application submitted successfully. Awaiting document verification.'}"
                </p>
              </div>
            </div>

            {/* Application Progress Timeline Stepper */}
            <div>
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
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
                      className={`p-3 rounded-xl border text-xs font-bold ${
                        isCurrent
                          ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                          : isDone
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      <div>Step {idx + 1}</div>
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
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-base text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-900" />
                Status History Audit Trail
              </h3>

              <div className="space-y-3">
                {trackResult.history && trackResult.history.map((hist, idx) => (
                  <div key={idx} className="relative pl-5 border-l-2 border-blue-200 space-y-1 py-0.5">
                    <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-900"></div>
                    <div className="flex justify-between items-center text-xs">
                      <StatusBadge status={hist.status} />
                      <span className="text-[10px] text-slate-400">
                        {new Date(hist.created_at).toLocaleDateString()} {new Date(hist.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium pt-1">
                      {hist.admin_remarks}
                    </p>
                    <p className="text-[10px] text-slate-400">Updated by: {hist.updated_by || 'Admin'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Submitted Fields & Documents */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-base text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-900" />
                Submitted Field Information
              </h3>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {trackResult.field_values && trackResult.field_values.map((fv) => (
                  <div key={fv.id} className="p-2.5 bg-slate-50 rounded-xl text-xs flex justify-between border border-slate-150">
                    <span className="text-slate-500 font-medium">{fv.field_label}:</span>
                    <span className="font-bold text-slate-900">{fv.value}</span>
                  </div>
                ))}
              </div>

              {/* Uploaded Documents */}
              {trackResult.documents && trackResult.documents.length > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Uploaded Documents</h4>
                  {trackResult.documents.map((doc) => (
                    <div key={doc.id} className="p-2.5 bg-emerald-50 rounded-xl text-xs flex justify-between items-center border border-emerald-200">
                      <span className="font-bold text-emerald-950">{doc.document_name} ({doc.file_name})</span>
                      <a
                        href={doc.file_path}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-900 font-bold hover:underline flex items-center gap-1"
                      >
                        View File <ExternalLink className="w-3 h-3" />
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
