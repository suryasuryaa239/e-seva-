import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, RefreshCw, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl space-y-3 border border-slate-800">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Service Fee & Refund SLA Policy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Refund & Cancellation Policy</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Transparent refund guidelines governing service charges, administrative desk review fees, and cancellation requests across all digital service applications.
          </p>
        </div>

        {/* Policy Body */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">

          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1. Eligible Refund Scenarios</span>
            </h3>
            <p className="text-slate-600">
              A full or partial refund of service fees is issued under the following conditions:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Duplicate payment charged for the same application due to network or gateway glitch.</li>
              <li>Application cancelled prior to desk verification processing.</li>
              <li>Administrative inability to process service due to system errors.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>2. Non-Refundable Scenarios</span>
            </h3>
            <p className="text-slate-600">
              Refunds will not be issued in the following instances:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Application rejected due to fraudulent or fake proof documents submitted by the applicant.</li>
              <li>Service already verified, approved, and output certificate generated.</li>
              <li>User change of mind after verification processing has commenced.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-indigo-600" />
              <span>3. Refund Processing SLA</span>
            </h3>
            <p className="text-slate-600">
              Approved refunds are credited back to the original source payment method (UPI / Debit Card / Net Banking) within <strong>5–7 working days</strong>. Admin ledger logs maintain complete record of refund approvals.
            </p>
          </div>

          {/* Contact Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 space-y-1">
            <div className="font-extrabold text-xs flex items-center space-x-1.5 text-slate-900">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>How to Request a Refund:</span>
            </div>
            <p className="text-xs text-slate-600">
              To request a refund, navigate to your <Link to="/my-applications" className="text-indigo-600 font-bold underline">My Applications</Link> dashboard or email support with your Application ID (<code className="bg-slate-200 px-1 py-0.5 rounded font-mono">ESV-2026-XXXXXX</code>) and Payment Transaction ID.
            </p>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link to="/" className="text-xs font-bold text-indigo-600 hover:underline">
            ← Return to Home Page
          </Link>
        </div>

      </div>
    </div>
  );
}
