import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl space-y-3 border border-slate-800">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-400/30">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Official Data Security & Privacy Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Privacy & Data Security Policy</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Your trust and privacy are fundamental to our digital governance assistance service. This document outlines how we collect, handle, encrypt, and safeguard your personal records and proof documents.
          </p>
        </div>

        {/* Policy Content Body */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">

          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              <span>1. Information Collection & Usage</span>
            </h3>
            <p className="text-slate-600">
              We collect personal information necessary to process your digital service assistance applications. This includes full name, mobile number, email address, proof of address, identity proofs (such as masked Aadhaar copies, PAN cards, or community documents), and transaction identifiers.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Eye className="w-4 h-4 text-indigo-600" />
              <span>2. Sensitive Personal Identifiers & Aadhaar Masking</span>
            </h3>
            <p className="text-slate-600">
              We adhere strictly to privacy guidelines regarding national identity numbers. Sensitive identity numbers such as Aadhaar numbers displayed across citizen interfaces are automatically masked (e.g. <code className="bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-slate-800">XXXX XXXX 1234</code>) to prevent unauthorized exposure.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>3. Document Storage & Security Standards</span>
            </h3>
            <p className="text-slate-600">
              Uploaded proof documents are stored in protected local database directories with strict role-based access control (RBAC). Access to raw document files is restricted strictly to authorized administrative desk verification officers.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>4. Data Retention & Citizen Rights</span>
            </h3>
            <p className="text-slate-600">
              Citizens retain full visibility over their submitted applications, verification logs, and status timelines via their verified citizen account. You may request account deletion or data clarification by contacting our official support desk.
            </p>
          </div>

          {/* Legal Disclaimer Box */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 space-y-1">
            <div className="font-extrabold text-xs flex items-center space-x-1.5 text-amber-900">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>Private Assistance Disclaimer:</span>
            </div>
            <p className="text-xs text-amber-800">
              This platform provides private digital service assistance and dynamic application form processing. It is not an official government agency unless explicitly specified.
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
