import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileCheck, AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl space-y-3 border border-slate-800">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-400/30">
            <FileCheck className="w-4 h-4 text-indigo-400" />
            <span>Platform Terms & Service Agreement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Terms & Conditions of Service</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            By utilizing the E-Seva assistance platform, you agree to the following terms governing application submissions, document verification workflows, and platform usage.
          </p>
        </div>

        {/* Terms Body */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">

          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>1. Private Assistance Platform Disclaimer</span>
            </h3>
            <p className="text-slate-600">
              This platform provides private digital service assistance, dynamic form assistance, document pre-verification, and status tracking services. It operates as an independent private assistance platform and does not claim official government representation unless explicitly stated.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <span>2. Applicant Responsibility & Authenticity</span>
            </h3>
            <p className="text-slate-600">
              Applicants are strictly responsible for providing authentic, accurate, and legible supporting proof documents. Submitting falsified documents or fraudulent information will result in immediate rejection, application cancellation, and potential legal action under applicable laws.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-indigo-600" />
              <span>3. Processing Times & SLAs</span>
            </h3>
            <p className="text-slate-600">
              Estimated processing timelines displayed on service details cards (e.g. 3–5 working days) are operational guidelines. Processing times may vary based on desk verification queues, document clarifications, and administrative workload.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>4. Service Fee Structure</span>
            </h3>
            <p className="text-slate-600">
              Service fees cover dynamic application form processing, document verification desk review, digital storage, SMS/Email tracking updates, and customer support assistance. All fees are displayed transparently before application checkout.
            </p>
          </div>

          {/* Warning Note */}
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-indigo-950 space-y-1">
            <div className="font-extrabold text-xs flex items-center space-x-1.5 text-indigo-900">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Self-Declaration Agreement:</span>
            </div>
            <p className="text-xs text-indigo-800">
              When submitting an application form via our 7-step wizard, you explicitly check the self-declaration box confirming that all submitted identity details and proof files belong to you.
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
