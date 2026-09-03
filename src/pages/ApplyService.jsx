import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { 
  ShieldAlert, FileText, Upload, CheckCircle2, ArrowRight, ArrowLeft,
  AlertCircle, Lock, Building, Info, Sparkles, Save, Edit3, Check, FileCheck, UserCheck, Clock, Download
} from 'lucide-react';

export default function ApplyService() {
  const { slug, serviceId } = useParams();
  const serviceParam = slug || serviceId;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftIdParam = searchParams.get('draftId');

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Wizard Step State (1: Applicant, 2: Service Fields, 3: Documents, 4: Review, 5: Success/Submitted)
  const [currentStep, setCurrentStep] = useState(1);

  // Application Draft Reference
  const [draftId, setDraftId] = useState(draftIdParam || null);
  const [submittedApp, setSubmittedApp] = useState(null);

  // Form Field State
  const [applicantInfo, setApplicantInfo] = useState({
    user_name: '',
    dob: '',
    gender: 'Male',
    user_phone: '',
    user_email: '',
    address: '',
    district: '',
    state: 'Tamil Nadu',
    pincode: ''
  });

  const [fieldValues, setFieldValues] = useState({});
  const [files, setFiles] = useState({});
  
  // Validation Errors State
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftSavedMessage, setDraftSavedMessage] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const parseOptions = (opts) => {
    if (!opts) return [];
    if (Array.isArray(opts)) return opts;
    if (typeof opts === 'string') {
      try {
        const parsed = JSON.parse(opts);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
      return opts.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  useEffect(() => {
    fetchService();
  }, [serviceParam]);

  const fetchService = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/services/${serviceParam}`);
      if (!res.ok) {
        throw new Error('Service not found or currently disabled.');
      }

      const data = await res.json();
      setService(data);

      // Pre-fill initial dynamic field values
      const initialFields = {};
      if (data.fields) {
        data.fields.forEach(f => {
          const key = f.field_name || f.name;
          initialFields[key] = f.default_value || '';
        });
      }
      setFieldValues(initialFields);

      // Check user session to prefill applicant info if logged in
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const meRes = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (meRes.ok) {
            const userData = await meRes.json();
            setApplicantInfo(prev => ({
              ...prev,
              user_name: userData.name || prev.user_name,
              user_email: userData.email || prev.user_email,
              user_phone: userData.phone || prev.user_phone
            }));
          }
        } catch (e) {}
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicantChange = (e) => {
    const { name, value } = e.target;
    setApplicantInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleInputChange = (fieldName, val) => {
    setFieldValues(prev => ({ ...prev, [fieldName]: val }));
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleFileChange = (docName, file) => {
    setFiles(prev => ({ ...prev, [docName]: file }));
    if (errors[`doc_${docName}`]) {
      setErrors(prev => ({ ...prev, [`doc_${docName}`]: null }));
    }
  };

  // Dynamic Conditional Field Visibility Evaluation
  const isFieldVisible = (field) => {
    if (!field.depends_on_field) return true;
    const parentVal = fieldValues[field.depends_on_field];
    if (!parentVal) return false;
    if (field.depends_on_value) {
      return String(parentVal).toLowerCase() === String(field.depends_on_value).toLowerCase();
    }
    return true;
  };

  // Step 1 Validation (Applicant Details)
  const validateStep1 = () => {
    const errs = {};
    if (!applicantInfo.user_name.trim()) errs.user_name = 'Please enter your full name.';
    if (!applicantInfo.user_phone.trim()) {
      errs.user_phone = 'Please enter your mobile number.';
    } else if (!/^\d{10}$/.test(applicantInfo.user_phone.trim())) {
      errs.user_phone = 'Please enter a valid 10-digit mobile number.';
    }
    if (!applicantInfo.user_email.trim()) {
      errs.user_email = 'Please enter your email address.';
    } else if (!/\S+@\S+\.\S+/.test(applicantInfo.user_email.trim())) {
      errs.user_email = 'Please enter a valid email address.';
    }
    if (applicantInfo.pincode && !/^\d{6}$/.test(applicantInfo.pincode.trim())) {
      errs.pincode = 'Please enter a valid 6-digit pincode.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation (Service Dynamic Fields)
  const validateStep2 = () => {
    const errs = {};
    if (service && service.fields) {
      service.fields.forEach(f => {
        if (isFieldVisible(f) && f.is_required) {
          const key = f.field_name || f.name;
          const val = fieldValues[key];
          if (!val || String(val).trim() === '') {
            errs[key] = `Please enter ${f.field_label || f.label}.`;
          }
        }
      });
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation (Documents)
  const validateStep3 = () => {
    const errs = {};
    if (service && service.documents) {
      service.documents.forEach(doc => {
        if (doc.is_required !== false) {
          const docName = doc.document_name || doc.name;
          if (!files[docName]) {
            errs[`doc_${docName}`] = `Please upload ${docName}.`;
          }
        }
      });
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) setCurrentStep(4);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Save Draft Handler
  const handleSaveDraft = async () => {
    try {
      setSavingDraft(true);
      setDraftSavedMessage(null);

      const formData = new FormData();
      if (draftId) formData.append('application_id', draftId);
      formData.append('service_id', service.id);
      formData.append('user_name', applicantInfo.user_name);
      formData.append('user_email', applicantInfo.user_email);
      formData.append('user_phone', applicantInfo.user_phone);
      formData.append('current_step', currentStep);
      formData.append('field_values', JSON.stringify({ ...applicantInfo, ...fieldValues }));

      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch('/api/applications/draft', {
        method: 'POST',
        headers,
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save draft');

      setDraftId(data.application_id);
      setDraftSavedMessage(`Draft saved! Reference Code: ${data.application_number}`);
      setTimeout(() => setDraftSavedMessage(null), 5000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSavingDraft(false);
    }
  };

  // Final Submission Handler
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      const formData = new FormData();
      if (draftId) formData.append('draft_id', draftId);
      formData.append('service_id', service.id);
      formData.append('user_name', applicantInfo.user_name);
      formData.append('user_email', applicantInfo.user_email);
      formData.append('user_phone', applicantInfo.user_phone);
      formData.append('field_values', JSON.stringify({ ...applicantInfo, ...fieldValues }));

      // Attach file uploads
      Object.entries(files).forEach(([docName, fileObj]) => {
        if (fileObj) {
          const safeKey = `doc_${docName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
          formData.append(safeKey, fileObj);
        }
      });

      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers,
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit application');

      setSubmittedApp(data);
      setCurrentStep(5); // Jump to success step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-sm w-full space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium text-sm">Building dynamic application form engine...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md w-full space-y-4 border border-slate-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-xl font-bold text-slate-800">Service Unavailable</h3>
          <p className="text-slate-600 text-sm">{error || 'This service is currently unavailable or disabled.'}</p>
          <Link to="/services" className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All Available Services</span>
          </Link>
        </div>
      </div>
    );
  }

  // Group Dynamic Fields by Section
  const groupedFields = {};
  if (service.fields) {
    service.fields.forEach(f => {
      const secName = f.section || 'Service Details';
      if (!groupedFields[secName]) groupedFields[secName] = [];
      groupedFields[secName].push(f);
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-indigo-600">Services</Link>
          <span>/</span>
          <Link to={`/service/${service.slug}`} className="hover:text-indigo-600">{service.name}</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">Application Form</span>
        </div>

        {/* NEUTRAL FACILITATION DISCLAIMER */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            <span className="font-bold">E-Seva Facilitation Notice: </span>
            You are submitting an application through E-Seva Private Facilitation Desk. All entries are reviewed by our application desk before submission to official department portals.
          </div>
        </div>

        {/* Header Title Banner */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md">
              <span>{service.category_name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {service.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Complete the dynamic application steps below. Save as draft anytime.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center sm:text-right min-w-[120px]">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Service Fee</div>
              <div className="text-xl font-black text-emerald-600">
                {service.fee === 0 ? 'FREE' : `₹${service.fee}`}
              </div>
            </div>

            {currentStep < 5 && (
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={savingDraft}
                className="px-3.5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 flex items-center space-x-1.5 transition-colors"
                title="Save application progress as draft"
              >
                <Save className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">{savingDraft ? 'Saving...' : 'Save Draft'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Toast / Draft Saved Notification */}
        {draftSavedMessage && (
          <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg text-emerald-800 text-sm flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center space-x-2 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{draftSavedMessage}</span>
            </div>
            <Link to="/my-applications" className="text-xs font-bold underline hover:text-emerald-900">
              View My Drafts
            </Link>
          </div>
        )}

        {submitError && (
          <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-lg text-rose-800 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* 5-STEP WIZARD PROGRESS INDICATOR */}
        {currentStep < 5 && (
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
              {[
                { step: 1, title: 'Applicant Details', sub: '01 Personal Info' },
                { step: 2, title: 'Service Details', sub: '02 Specific Fields' },
                { step: 3, title: 'Documents', sub: '03 Proof Uploads' },
                { step: 4, title: 'Review & Submit', sub: '04 Final Check' }
              ].map((st) => {
                const isActive = currentStep === st.step;
                const isDone = currentStep > st.step;
                return (
                  <div key={st.step} className="flex flex-col items-center text-center relative z-10">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full font-black text-xs sm:text-sm flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isActive
                        ? 'bg-indigo-600 text-white shadow-md ring-4 ring-indigo-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-300'
                    }`}>
                      {isDone ? <Check className="w-4 h-4" /> : st.step}
                    </div>
                    <div className="mt-2 space-y-0.5">
                      <div className={`text-xs font-bold ${isActive ? 'text-indigo-600' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                        {st.title}
                      </div>
                      <div className="text-[10px] text-slate-400 hidden sm:block">{st.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 01: APPLICANT DETAILS */}
        {/* ======================================================== */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b pb-4 border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-indigo-600" />
                <span>Step 01: Applicant Primary Information</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">* Required fields</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="user_name"
                  placeholder="Karthik Subramanian"
                  value={applicantInfo.user_name}
                  onChange={handleApplicantChange}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border ${errors.user_name ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300'} rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white`}
                />
                {errors.user_name && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.user_name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  name="user_phone"
                  placeholder="9876543210"
                  value={applicantInfo.user_phone}
                  onChange={handleApplicantChange}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border ${errors.user_phone ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300'} rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white`}
                />
                {errors.user_phone && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.user_phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="user_email"
                  placeholder="karthik@example.com"
                  value={applicantInfo.user_email}
                  onChange={handleApplicantChange}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border ${errors.user_email ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300'} rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white`}
                />
                {errors.user_email && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.user_email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={applicantInfo.dob}
                  onChange={handleApplicantChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={applicantInfo.gender}
                  onChange={handleApplicantChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={applicantInfo.state}
                  onChange={handleApplicantChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  name="district"
                  placeholder="Chennai / Coimbatore"
                  value={applicantInfo.district}
                  onChange={handleApplicantChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="600001"
                  value={applicantInfo.pincode}
                  onChange={handleApplicantChange}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border ${errors.pincode ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300'} rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white`}
                />
                {errors.pincode && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.pincode}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  name="address"
                  placeholder="Door No, Street Name, Area..."
                  value={applicantInfo.address}
                  onChange={handleApplicantChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center space-x-2"
              >
                <span>Proceed to Service Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 02: DYNAMIC SERVICE FIELDS */}
        {/* ======================================================== */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b pb-4 border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>Step 02: {service.name} Custom Fields</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Dynamically generated schema</span>
            </div>

            {Object.keys(groupedFields).length === 0 ? (
              <div className="p-6 bg-slate-50 text-center rounded-xl text-slate-600 text-sm">
                No custom service inputs required for this service. Proceed to document checklist.
              </div>
            ) : (
              Object.entries(groupedFields).map(([secTitle, secFields], sIdx) => (
                <div key={sIdx} className="space-y-4 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
                    {secTitle}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {secFields.filter(isFieldVisible).map((f, fIdx) => {
                      const key = f.field_name || f.name;
                      const fType = (f.field_type || f.type || 'text').toLowerCase();
                      const fLabel = f.field_label || f.label || key;
                      const hasErr = errors[key];
                      const isTextArea = fType === 'textarea';
                      const isSelect = fType === 'select';
                      const isRadio = fType === 'radio';
                      const isCheckbox = fType === 'checkbox';
                      const optionsList = parseOptions(f.options_json || f.options || f.field_options);

                      return (
                        <div key={fIdx} className={isTextArea ? 'sm:col-span-2' : ''}>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            {fLabel} {(f.is_required !== false && f.required !== false) && <span className="text-rose-500">*</span>}
                          </label>

                          {isSelect ? (
                            <select
                              value={fieldValues[key] || ''}
                              onChange={e => handleInputChange(key, e.target.value)}
                              className={`w-full px-3.5 py-2.5 bg-white border ${hasErr ? 'border-rose-500 bg-rose-50' : 'border-slate-300'} rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500`}
                            >
                              <option value="">-- Select {fLabel} --</option>
                              {optionsList.map((opt, oIdx) => (
                                <option key={oIdx} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : isRadio ? (
                            <div className="flex flex-wrap gap-4 py-1">
                              {optionsList.map((opt, oIdx) => (
                                <label key={oIdx} className="inline-flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={key}
                                    value={opt}
                                    checked={fieldValues[key] === opt}
                                    onChange={e => handleInputChange(key, e.target.value)}
                                    className="text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          ) : isCheckbox ? (
                            <label className="inline-flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer py-1">
                              <input
                                type="checkbox"
                                checked={!!fieldValues[key]}
                                onChange={e => handleInputChange(key, e.target.checked)}
                                className="text-indigo-600 focus:ring-indigo-500 rounded"
                              />
                              <span>{f.helpText || 'I agree to this condition'}</span>
                            </label>
                          ) : isTextArea ? (
                            <textarea
                              rows={3}
                              placeholder={f.placeholder}
                              value={fieldValues[key] || ''}
                              onChange={e => handleInputChange(key, e.target.value)}
                              className={`w-full px-3.5 py-2.5 bg-white border ${hasErr ? 'border-rose-500 bg-rose-50' : 'border-slate-300'} rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500`}
                            />
                          ) : (
                            <input
                              type={fType === 'date' ? 'date' : fType === 'number' ? 'number' : 'text'}
                              placeholder={f.placeholder}
                              value={fieldValues[key] || ''}
                              onChange={e => handleInputChange(key, e.target.value)}
                              className={`w-full px-3.5 py-2.5 bg-white border ${hasErr ? 'border-rose-500 bg-rose-50' : 'border-slate-300'} rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500`}
                            />
                          )}

                          {f.helpText && <p className="text-[11px] text-slate-500 mt-1">{f.helpText}</p>}
                          {hasErr && <p className="text-xs text-rose-600 font-semibold mt-1">{hasErr}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Applicant Details</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center space-x-2"
              >
                <span>Proceed to Required Documents</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 03: DOCUMENTS UPLOAD */}
        {/* ======================================================== */}
        {currentStep === 3 && (
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b pb-4 border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                <span>Step 03: Upload Required Proof Documents</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">PDF, JPG, PNG (Max 5MB per file)</span>
            </div>

            {service.documents && service.documents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.documents.map((doc, idx) => {
                  const docName = doc.document_name || doc.name;
                  const currentFile = files[docName];
                  const hasErr = errors[`doc_${docName}`];
                  const maxMB = doc.max_file_size || 5;

                  const handleFileDrop = (e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      processSelectedFile(docName, e.dataTransfer.files[0], maxMB);
                    }
                  };

                  const processSelectedFile = (dName, selectedFile, maxLimitMB) => {
                    const validExts = ['.pdf', '.jpg', '.jpeg', '.png'];
                    const ext = '.' + selectedFile.name.split('.').pop().toLowerCase();
                    
                    if (!validExts.includes(ext)) {
                      setErrors(prev => ({ ...prev, [`doc_${dName}`]: 'File type not supported. Please upload PDF, JPG, or PNG.' }));
                      return;
                    }

                    if (selectedFile.size > maxLimitMB * 1024 * 1024) {
                      setErrors(prev => ({ ...prev, [`doc_${dName}`]: `File size exceeds the allowed ${maxLimitMB}MB limit.` }));
                      return;
                    }

                    setErrors(prev => ({ ...prev, [`doc_${dName}`]: null }));
                    handleFileChange(dName, selectedFile);
                  };

                  return (
                    <div 
                      key={idx}
                      onDragOver={e => e.preventDefault()}
                      onDrop={handleFileDrop}
                      className={`p-5 rounded-xl border-2 border-dashed transition-all ${
                        currentFile 
                          ? 'bg-emerald-50/50 border-emerald-300' 
                          : hasErr 
                          ? 'bg-rose-50/50 border-rose-300' 
                          : 'bg-slate-50 border-slate-300 hover:border-indigo-400 hover:bg-slate-100/60'
                      } space-y-3`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span>{docName}</span>
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          doc.is_required !== false ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {doc.is_required !== false ? 'Required' : 'Optional'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-normal">
                        {doc.description || 'Upload clear scanned copy or photo proof'}
                      </p>

                      <div className="text-[10px] text-slate-400 font-medium">
                        Allowed: PDF, JPG, PNG • Max Size: {maxMB}MB
                      </div>

                      {!currentFile ? (
                        <div className="space-y-2 pt-1">
                          <label className="block w-full py-2.5 px-3 bg-white border border-slate-300 rounded-lg text-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
                            <span className="text-xs font-bold text-indigo-600 flex items-center justify-center space-x-1">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Drag & Drop or Choose File</span>
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={e => e.target.files[0] && processSelectedFile(docName, e.target.files[0], maxMB)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      ) : (
                        <div className="p-3 bg-white rounded-lg border border-emerald-200 shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 truncate">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              <span className="text-xs font-bold text-slate-800 truncate">{currentFile.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {(currentFile.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          </div>

                          <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-100">
                            <label className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer">
                              Replace
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={e => e.target.files[0] && processSelectedFile(docName, e.target.files[0], maxMB)}
                                className="hidden"
                              />
                            </label>
                            <span className="text-slate-300">|</span>
                            <button
                              type="button"
                              onClick={() => setFiles(prev => ({ ...prev, [docName]: null }))}
                              className="text-[11px] font-bold text-rose-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}

                      {hasErr && (
                        <p className="text-xs text-rose-600 font-semibold flex items-center space-x-1">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{hasErr}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 text-center rounded-xl text-slate-600 text-sm">
                No document uploads required for this service. Click proceed to review.
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Service Details</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center space-x-2"
              >
                <span>Proceed to Application Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 04: REVIEW & PAYMENT SUMMARY */}
        {/* ======================================================== */}
        {currentStep === 4 && (
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b pb-4 border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <span>Step 04: Application Summary & Payment Fee</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Verify details before submission</span>
            </div>

            {/* Applicant Summary Box */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Applicant Information</h4>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center space-x-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Full Name:</span>
                  <span className="font-bold text-slate-800">{applicantInfo.user_name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Mobile:</span>
                  <span className="font-bold text-slate-800">{applicantInfo.user_phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Email:</span>
                  <span className="font-bold text-slate-800">{applicantInfo.user_email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">District / State:</span>
                  <span className="font-bold text-slate-800">{applicantInfo.district ? `${applicantInfo.district}, ${applicantInfo.state}` : applicantInfo.state}</span>
                </div>
              </div>
            </div>

            {/* Service Custom Fields Summary Box */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{service.name} Dynamic Inputs</h4>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center space-x-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(fieldValues).map(([k, v], idx) => {
                  const fDef = service.fields ? service.fields.find(f => (f.field_name || f.name) === k) : null;
                  const label = fDef ? (fDef.field_label || fDef.label || k) : k.replace(/_/g, ' ');
                  return (
                    <div key={idx} className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-slate-500 block font-medium">{label}:</span>
                      <span className="font-bold text-slate-800">{v ? String(v) : 'Not Provided'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Documents Summary Box */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Uploaded Proof Documents</h4>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center space-x-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <div className="space-y-1.5 text-xs">
                {Object.entries(files).map(([dName, fObj], idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded border border-slate-200">
                    <span className="font-medium text-slate-700">{dName}</span>
                    <span className="font-bold text-emerald-600 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{fObj ? fObj.name : 'Not Uploaded'}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ORDER SUMMARY & FACILITATION FEE CARD */}
            <div className="p-5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-200 pb-3">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Payment Order Breakdown</h4>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                  {service.fee === 0 || service.payment_required === false ? 'No Payment Required' : 'Online Payment Required'}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Application Service Fee ({service.name}):</span>
                  <span className="font-bold">₹{service.fee || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Facilitation Processing Charge:</span>
                  <span className="font-bold text-emerald-600">₹0 (Free Portal Processing)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-indigo-200 font-extrabold text-slate-900 text-sm">
                  <span>Total Fee Payable:</span>
                  <span className="text-indigo-900 text-base font-black">₹{service.fee || 0}</span>
                </div>
              </div>

              {/* Facilitation Disclaimer */}
              <p className="text-[11px] text-slate-500 italic bg-white p-3 rounded-lg border border-indigo-100">
                <span className="font-bold text-indigo-900">Notice:</span> Service charges displayed on this portal are facilitation/service charges. Official government fees, where applicable, may be separate.
              </p>
            </div>

            {/* Submission Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center space-x-2 transform active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Payment & Submission...</span>
                  </>
                ) : service.fee > 0 && service.payment_required !== false ? (
                  <>
                    <span>Pay ₹{service.fee} & Submit Application</span>
                    <Lock className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Confirm & Submit Free Application</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 05: SUCCESS SCREEN */}
        {/* ======================================================== */}
        {currentStep === 5 && submittedApp && (
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Application Submitted Successfully!</h2>
              <p className="text-slate-600 text-sm">
                Your application for <span className="font-bold text-slate-800">{service.name}</span> has been logged into the E-Seva queue.
              </p>
            </div>

            {/* Generated Unique Application ID Banner */}
            <div className="bg-slate-900 text-white rounded-xl p-6 space-y-2 shadow-md">
              <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">Your Unique Application ID</div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-wider">
                {submittedApp.application_number}
              </div>
              <div className="text-xs text-slate-400">
                Submitted on: {new Date(submittedApp.submitted_at).toLocaleDateString()}
              </div>
            </div>

            {/* Status & SLA Box */}
            <div className="grid grid-cols-2 gap-4 text-xs text-left bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">Applicant Name:</span>
                <span className="font-bold text-slate-800">{applicantInfo.user_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Initial Status:</span>
                <span className="font-bold text-indigo-600">SUBMITTED (Under Verification)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Processing Time:</span>
                <span className="font-bold text-slate-800">{service.processing_time || '3-5 Days'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Service Fee:</span>
                <span className="font-bold text-emerald-600">{service.fee === 0 ? 'FREE' : `₹${service.fee}`}</span>
              </div>
            </div>

            {/* Next Steps List */}
            <div className="text-left bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-2 text-xs text-indigo-900">
              <div className="font-bold text-indigo-950 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>What Happens Next?</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed">
                <li>E-Seva executive team will verify submitted documents within 24 hours.</li>
                <li>You can track application updates anytime using your Application ID.</li>
                <li>SMS / Email notification will be sent upon approval or document verification update.</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/track?appId=${submittedApp.application_number}`}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Clock className="w-4 h-4" />
                <span>Track Application</span>
              </Link>

              <Link
                to="/my-applications"
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>View My Applications</span>
              </Link>

              <button
                type="button"
                onClick={() => alert(`Downloading Receipt for ${submittedApp.application_number}...`)}
                className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Receipt</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
