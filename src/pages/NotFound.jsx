import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <Landmark className="w-8 h-8" />
        </div>
        
        <div>
          <span className="text-4xl font-extrabold text-indigo-600 tracking-tight">404</span>
          <h2 className="font-heading font-extrabold text-2xl text-slate-900 mt-2">Page Not Found</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            The requested service page or route does not exist or has been moved within the E-Seva portal.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Home
          </Link>
          <Link
            to="/services"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" /> Browse Services
          </Link>
        </div>
      </div>
    </div>
  );
}
