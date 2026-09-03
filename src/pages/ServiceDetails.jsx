import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Clock, FileCheck, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight,
  HelpCircle, CreditCard, UserCheck, Upload, Send, Search, Sparkles
} from 'lucide-react';

export default function ServiceDetails() {
  const { serviceId, slug } = useParams();
  const serviceParam = slug || serviceId;
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceParam]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/services/${serviceParam}`);
      if (!res.ok) {
        throw new Error('Service not found');
      }

      const data = await res.json();
      setService(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center font-sans">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-sm w-full space-y-4 border border-slate-200">
          <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium text-xs">Fetching service details from database...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center font-sans">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md w-full space-y-4 border border-slate-200">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-800">Service Not Found</h3>
          <p className="text-slate-600 text-xs">The requested service details could not be retrieved from the database catalog.</p>
          <Link to="/services" className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-900 text-white font-bold text-xs rounded-xl hover:bg-blue-950">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Services Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-600 selection:text-white">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
          <Link to="/" className="hover:text-blue-900">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-blue-900">Services</Link>
          <span>/</span>
          <Link to={`/services/${service.category_slug || 'aadhaar'}`} className="hover:text-blue-900">
            {service.category_name || 'Category'}
          </Link>
          <span>/</span>
          <span className="font-bold text-slate-900">{service.name}</span>
        </div>

        {/* FACILITATION DISCLAIMER */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed font-normal">
            <span className="font-bold">Facilitation Disclaimer: </span>
            This application process is handled through our online facilitation desk. We assist in document compilation, form submission, and status tracking. Official verification and issuance remain under the sole jurisdiction of the respective government department.
          </div>
        </div>

        {/* Main Service Header Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 rounded-2xl p-6 sm:p-10 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-800/80 border border-blue-700/80 text-blue-200 text-xs font-bold rounded-full">
              <span>{service.category_name}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {service.name}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-normal">
              {service.description}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center min-w-[220px] w-full md:w-auto space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Service Fee</div>
            <div className="text-3xl font-black text-emerald-400">
              {service.fee === 0 ? 'FREE' : `₹${service.fee}`}
            </div>
            <Link
              to={`/apply/${service.slug || service.id}`}
              className="block w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow transition-all text-center"
            >
              Apply Now
            </Link>
          </div>
        </div>

        {/* Key Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Estimated Processing (SLA)</div>
              <div className="text-xs font-bold text-slate-900">{service.processing_time || '3-5 Working Days'}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Required Proof Documents</div>
              <div className="text-xs font-bold text-slate-900">
                {service.documents ? service.documents.length : 1} Upload File(s)
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Payment Methods</div>
              <div className="text-xs font-bold text-slate-900">UPI, Net Banking, Card</div>
            </div>
          </div>
        </div>

        {/* Section 1: Eligibility */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2 border-b pb-3 border-slate-100">
            <UserCheck className="w-5 h-5 text-blue-900" />
            <span>Eligibility / Who Can Apply</span>
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 font-normal">
            {service.eligibility || 'Resident Indian citizens with valid proof documents as specified in official regulations.'}
          </p>
        </div>

        {/* Section 2: Required Documents */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2 border-b pb-3 border-slate-100">
            <FileCheck className="w-5 h-5 text-emerald-700" />
            <span>Required Documents Checklist</span>
          </h2>
          
          {service.documents && service.documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.documents.map((doc, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900">{doc.name || doc.document_name}</h4>
                    <p className="text-[11px] text-slate-500">{doc.description}</p>
                    <div className="pt-1">
                      <span className="inline-block px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold uppercase rounded">
                        {doc.required !== false ? 'Mandatory Upload' : 'Optional'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No upload documents required for this service query.</p>
          )}
        </div>

        {/* Section 3: Important Instructions */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2 border-b pb-3 border-slate-100">
            <HelpCircle className="w-5 h-5 text-amber-700" />
            <span>Important Instructions</span>
          </h2>
          <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside bg-amber-50/60 p-4 rounded-xl border border-amber-200 leading-relaxed font-normal">
            <li>{service.instructions || 'Ensure all details entered match your official proof of identity.'}</li>
            <li>Uploaded documents must be clear, legible copies in PDF, JPG, or PNG format.</li>
            <li>An Application ID will be generated upon submission for real-time status tracking.</li>
          </ul>
        </div>

        {/* Bottom Apply CTA */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 text-center space-y-3 shadow-md">
          <h3 className="text-xl font-extrabold">Ready to Apply for {service.name}?</h3>
          <p className="text-slate-300 text-xs max-w-xl mx-auto font-normal">
            Click below to start filling the dynamic application form. Fast, secure processing with instant Application ID generation.
          </p>
          <div className="pt-2">
            <Link
              to={`/apply/${service.slug || service.id}`}
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition-all"
            >
              <span>Start Application Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
