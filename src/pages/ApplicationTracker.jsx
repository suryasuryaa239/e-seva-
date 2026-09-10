import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileSearch, Search, Clock, CheckCircle2, AlertCircle,
  FileText, ShieldCheck, Download, ExternalLink, RefreshCw, MessageSquare,
  Copy, Check, Printer, ShieldAlert, Phone, HelpCircle, ArrowRight, XCircle, CreditCard, Key, X
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import StatusBadge from '../components/StatusBadge';
import ReceiptPrint from '../components/ReceiptPrint';
import { useLanguage } from '../context/LanguageContext';

const ALL_STATUS_STEPS_EN = [
  { key: 'DRAFT', label: 'Draft', desc: 'Application initiated & draft saved' },
  { key: 'SUBMITTED', label: 'Submitted', desc: 'Successfully submitted & payment verified' },
  { key: 'UNDER_REVIEW', label: 'Under Review', desc: 'Assigned to nodal officer for document verification' },
  { key: 'PROCESSING', label: 'Processing', desc: 'Verification in progress by field department' },
  { key: 'APPROVED', label: 'Approved', desc: 'Application approved & certificate generated' },
  { key: 'COMPLETED', label: 'Completed', desc: 'Digital certificate issued & service delivered' }
];

const ALL_STATUS_STEPS_TA = [
  { key: 'DRAFT', label: 'வரைவு', desc: 'விண்ணப்பம் உருவாக்கப்பட்டு வரைவாக சேமிக்கப்பட்டது' },
  { key: 'SUBMITTED', label: 'சமர்ப்பிக்கப்பட்டது', desc: 'வெற்றிகரமாக சமர்ப்பிக்கப்பட்டு கட்டணம் சரிபார்க்கப்பட்டது' },
  { key: 'UNDER_REVIEW', label: 'ஆய்வில் உள்ளது', desc: 'ஆவண சரிபார்ப்பிற்காக அதிகாரிக்கு அனுப்பப்பட்டது' },
  { key: 'PROCESSING', label: 'பரிசீலனை', desc: 'துறை அதிகாரிகளால் ஆய்வு நடைபெறுகிறது' },
  { key: 'APPROVED', label: 'ஒப்புதல் அளிக்கப்பட்டது', desc: 'விண்ணப்பம் ஏற்கப்பட்டு சான்றிதழ் உருவாக்கப்பட்டது' },
  { key: 'COMPLETED', label: 'சேவை முடிந்தது', desc: 'டிஜிட்டல் சான்றிதழ் வழங்கப்பட்டு சேவை நிறைவடைந்தது' }
];

export default function ApplicationTracker() {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams()[0];
  const initialAppId = searchParams.get('appId') || searchParams.get('appNumber') || '';

  const statusSteps = lang === 'ta' ? ALL_STATUS_STEPS_TA : ALL_STATUS_STEPS_EN;

  const [appId, setAppId] = useState(initialAppId);
  const [phone, setPhone] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedAppId, setCopiedAppId] = useState(false);

  // Forgot Reference ID Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotResults, setForgotResults] = useState([]);

  const handleForgotLookup = async (e) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) return;
    setForgotLoading(true);
    setForgotError('');
    setForgotResults([]);
    try {
      const res = await fetch('/api/applications/forgot-ref', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: forgotIdentifier.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setForgotResults(data.applications || []);
      } else {
        setForgotError(data.error || (lang === 'ta' ? 'விண்ணப்பங்கள் எதுவும் கிடைக்கவில்லை' : 'No matching applications found'));
      }
    } catch (err) {
      setForgotError(lang === 'ta' ? 'தொடர்பு கொள்ள முடியவில்லை' : 'Error connecting to server');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSelectAppNumber = (selectedAppNum) => {
    setAppId(selectedAppNum);
    setShowForgotModal(false);
    fetchStatus(selectedAppNum, phone);
  };

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
        setError(data.error || (lang === 'ta' ? 'கொடுக்கப்பட்ட எண்ணில் எந்த விண்ணப்பமும் இல்லை' : 'No application found with provided ID'));
      }
    } catch (err) {
      console.error(err);
      setError(lang === 'ta' ? 'சேவையகத்துடன் தொடர்பு கொள்ள முடியவில்லை' : 'Error connecting to tracking server');
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
      setError(lang === 'ta' ? 'செல்லுபடியாகும் விண்ணப்ப எண்ணை உள்ளிடவும்.' : 'Please enter a valid Application Reference ID.');
      return;
    }
    fetchStatus(appId, phone);
  };

  // Helper to determine status order index
  const getStatusIndex = (status) => {
    if (!status) return 0;
    const s = status.toUpperCase();
    const idx = statusSteps.findIndex(st => st.key === s);
    return idx >= 0 ? idx : 1; // Default to 1 (SUBMITTED) if unknown
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans selection:bg-orange-500 selection:text-white">
      {/* Breadcrumb */}
      <Breadcrumbs items={[{ label: t.trackTitle }]} />

      {/* 1. HERO / SEARCH SECTION HEADER */}
      <div className="bg-[#0b192c] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden text-center space-y-3">
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <span className="inline-block text-[10px] sm:text-xs font-black text-orange-400 uppercase tracking-widest bg-slate-800/80 border border-slate-700 px-3.5 py-1 rounded-full">
          {lang === 'ta' ? 'விண்ணப்ப நிலை' : 'APPLICATION STATUS'}
        </span>

        <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
          {t.trackTitle}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-xl mx-auto">
          {t.trackSubtitle}
        </p>
      </div>

      {/* 2. SEARCH FORM CARD */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl space-y-4 max-w-3xl mx-auto">
        <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-7 space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                Application Reference ID <span className="text-orange-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(true);
                  setForgotError('');
                  setForgotResults([]);
                }}
                className="text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Key className="w-3 h-3 text-orange-500" />
                <span>{t.forgotRefBtn || 'Forgot Reference ID?'}</span>
              </button>
            </div>
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

            {/* REJECTION ALERT OR OFFICER REMARKS CALLOUT */}
            {trackResult.application.status?.toUpperCase() === 'REJECTED' ? (
              <div className="bg-rose-50 border-2 border-rose-300 p-5 rounded-2xl flex items-start gap-4 text-rose-950 shadow-sm animate-pulse">
                <XCircle className="w-7 h-7 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-rose-700 uppercase tracking-wider bg-rose-200/90 border border-rose-300 px-2.5 py-0.5 rounded-md">
                      {lang === 'ta' ? 'விண்ணப்பம் நிராகரிக்கப்பட்டது' : 'APPLICATION REJECTED'}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-rose-900">
                    {lang === 'ta' ? 'அதிகாரப்பூர்வ நிராகரிப்பு காரணம்:' : 'Official Reason for Rejection:'}
                  </h4>
                  <div className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-inner">
                    <p className="font-extrabold text-xs text-rose-800 leading-relaxed">
                      "{trackResult.application.admin_remarks || (lang === 'ta' ? 'காரணம் குறிப்பிடப்படவில்லை. உதவி மையத்தை தொடர்பு கொள்ளவும்.' : 'No specific reason provided by officer. Please contact support desk.')}"
                    </p>
                  </div>
                  <p className="text-[11px] text-rose-700 font-medium">
                    {lang === 'ta' 
                      ? 'மேலே குறிப்பிடப்பட்டுள்ள குறைபாடுகளை சரிசெய்து புதிய விண்ணப்பத்தை சமர்ப்பிக்கலாம் அல்லது உதவி மையத்தை அணுகவும்.' 
                      : 'Please review the rejection reason above. You may correct the noted deficiencies and re-apply.'}
                  </p>
                </div>
              </div>
            ) : (
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
            )}

            {/* 4. VERTICAL PROGRESS TIMELINE */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{t.appLifecycleTimeline}</span>
              </h3>

              {trackResult.application.status?.toUpperCase() === 'REJECTED' ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-900 text-xs font-bold">
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  <div>
                    <span className="text-sm font-black block">{t.applicationRejectedTitle}</span>
                    <span className="text-slate-600 font-normal">{t.applicationRejectedDesc}</span>
                  </div>
                </div>
              ) : (
                <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-slate-200 ml-2 py-2">
                  {statusSteps.map((st, idx) => {
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
                                {t.currentStageBadge}
                              </span>
                            )}
                            {isDone && (
                              <span className="text-emerald-600 text-[10px] font-extrabold flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> {t.completedBadge}
                              </span>
                            )}
                          </div>
                          <p className={`text-[11px] ${isCurrent ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                            {st.desc}
                          </p>
                        </div>

                        {isCurrent && trackResult.application.updated_at && (
                          <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
                            {lang === 'ta' ? 'புதுப்பிக்கப்பட்டது:' : 'Updated:'} {new Date(trackResult.application.updated_at).toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN')}
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
                <span>{t.auditHistoryLogTitle}</span>
              </h3>

              <div className="space-y-3">
                {trackResult.history && trackResult.history.length > 0 ? (
                  trackResult.history.map((hist, idx) => (
                    <div key={idx} className="relative pl-5 border-l-2 border-slate-200 space-y-1 py-0.5">
                      <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0b192c]"></div>
                      <div className="flex justify-between items-center text-xs">
                        <StatusBadge status={hist.status} />
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(hist.created_at).toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-IN')} {new Date(hist.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium pt-1">
                        {hist.admin_remarks || (lang === 'ta' ? 'அமைப்பில் நிலை புதுப்பிக்கப்பட்டது.' : 'Status updated in system.')}
                      </p>
                      <p className="text-[10px] text-slate-400">{lang === 'ta' ? 'அதிகாரி:' : 'Officer:'} {hist.updated_by || (lang === 'ta' ? 'இ-சேவை மையம்' : 'E-Seva Facilitation Desk')}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">{t.noAuditEventsLogged}</p>
                )}
              </div>
            </div>

            {/* Right Col: Submitted Fields & Documents */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-heading font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                <span>{t.submittedInformationTitle}</span>
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
                  <p className="text-xs text-slate-400">{t.noCustomFieldValues}</p>
                )}
              </div>

              {/* Payment Summary */}
              {trackResult.payment && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-orange-500" />
                    <span>{t.paymentInformationTitle}</span>
                  </h4>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 block">{t.totalFeeLabel}: ₹{trackResult.payment.amount || trackResult.application.total_fee || 0}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{t.txnIdLabel}: {trackResult.payment.transaction_id || 'N/A'}</span>
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
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{t.uploadedProofDocsTitle}</h4>
                  {trackResult.documents.map((doc) => {
                    const isVerified = doc.verification_status === 'Verified';
                    const isDocRejected = doc.verification_status === 'Rejected';

                    return (
                      <div key={doc.id} className={`p-3.5 rounded-xl text-xs space-y-2 border transition-all ${
                        isDocRejected 
                          ? 'bg-rose-50 border-rose-300' 
                          : isVerified 
                          ? 'bg-emerald-50/80 border-emerald-200' 
                          : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className={`font-bold ${isDocRejected ? 'text-rose-950' : isVerified ? 'text-emerald-950' : 'text-slate-900'}`}>
                            {doc.document_name} ({doc.file_name})
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                            isVerified 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                              : isDocRejected 
                              ? 'bg-rose-100 text-rose-800 border-rose-300' 
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}>
                            {isVerified ? '✓ Verified' : isDocRejected ? '⚠ Rejected' : 'Pending Verification'}
                          </span>
                        </div>

                        {isDocRejected && (
                          <div className="p-2.5 bg-white border border-rose-200 rounded-lg text-rose-900 space-y-0.5 shadow-xs">
                            <span className="font-extrabold text-[11px] text-rose-700 block">
                              {lang === 'ta' ? 'ஆவண நிராகரிப்பு காரணம்:' : 'Document Rejection Reason:'}
                            </span>
                            <p className="text-[11px] text-rose-800 font-medium leading-snug">
                              {doc.rejection_reason || (lang === 'ta' ? 'ஆவணம் தெளிவாக இல்லை. புதிய நகலை பதிவேற்றவும்.' : 'Document is unclear or incomplete.')}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-end pt-1">
                          <a
                            href={doc.file_path}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#0b192c] font-bold hover:text-orange-600 flex items-center gap-1 text-[11px]"
                          >
                            <span>{t.viewFileBtn}</span> <ExternalLink className="w-3 h-3 text-orange-500" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
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
              <span>{t.goToDashboardBtn}</span>
            </Link>

            <Link
              to="/services"
              className="px-5 py-2.5 bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>{t.exploreOtherServicesBtn}</span>
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
            <h4 className="text-xs font-extrabold text-slate-900">{t.needHelpWithApp}</h4>
            <p className="text-[11px] text-slate-500 font-medium">{t.supportTeamHere}</p>
          </div>
        </div>

        <Link
          to="/contact"
          className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs rounded-xl border border-slate-300 transition-colors shrink-0"
        >
          {t.contactSupportDeskBtn}
        </Link>
      </div>

      {/* 8. FORGOT APPLICATION REFERENCE ID MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center shrink-0">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-slate-900">
                    {t.findAppModalTitle || (lang === 'ta' ? 'உங்கள் விண்ணப்ப எண்ணைக் கண்டறியவும்' : 'Find Your Application Reference ID')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {t.enterPhoneOrEmail || (lang === 'ta' ? 'பதிவு செய்யப்பட்ட மொபைல் எண் அல்லது மின்னஞ்சலை உள்ளிடவும்' : 'Enter registered Mobile Number or Email Address')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleForgotLookup} className="space-y-3">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                {lang === 'ta' ? 'மொபைல் எண் / மின்னஞ்சல்' : 'Registered Mobile Number or Email'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 9876543210 or name@example.com"
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 font-medium focus:bg-white focus:border-[#0b192c] outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={forgotLoading || !forgotIdentifier.trim()}
                  className="px-5 py-3 bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {forgotLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                  ) : (
                    <Search className="w-4 h-4 text-orange-400" />
                  )}
                  <span>{t.findAppsBtn || (lang === 'ta' ? 'தேடுங்கள்' : 'Find')}</span>
                </button>
              </div>
            </form>

            {/* Results Error */}
            {forgotError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {/* Results List */}
            {forgotResults.length > 0 && (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  {lang === 'ta' ? `கண்டறியப்பட்ட விண்ணப்பங்கள் (${forgotResults.length}):` : `Applications Found (${forgotResults.length}):`}
                </span>
                {forgotResults.map((app) => (
                  <div key={app.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:bg-slate-100/80 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-orange-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {app.application_number}
                        </span>
                        <StatusBadge status={app.status} />
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs">{app.service_name}</h5>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        {lang === 'ta' ? 'தேதி:' : 'Submitted:'} {new Date(app.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectAppNumber(app.application_number)}
                      className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-[11px] rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.selectAndTrack || (lang === 'ta' ? 'கண்காணிக்கவும்' : 'Track')}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}


