import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { 
  ShieldAlert, FileText, Upload, CheckCircle2, ArrowRight, ArrowLeft,
  AlertCircle, Lock, Info, Save, Edit3, Check, FileCheck, UserCheck, Clock, Download,
  Phone, Mail, HelpCircle, Shield, Sparkles, Building
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ApplyService() {
  const { slug, serviceId } = useParams();
  const serviceParam = slug || serviceId;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftIdParam = searchParams.get('draftId');

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Wizard Step State (1: Applicant & Custom Fields, 2: Documents, 3: Review, 4: Success/Submitted)
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
      if (res.ok) {
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
      } else {
        // Fallback service definition
        const fallback = DEFAULT_SERVICES_MAP[serviceParam] || DEFAULT_SERVICES_MAP['aadhaar-address-update'];
        setService(fallback);
        const initialFields = {};
        if (fallback.fields) {
          fallback.fields.forEach(f => {
            const key = f.field_name || f.name;
            initialFields[key] = f.default_value || '';
          });
        }
        setFieldValues(initialFields);
      }

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
      const fallback = DEFAULT_SERVICES_MAP[serviceParam] || DEFAULT_SERVICES_MAP['aadhaar-address-update'];
      if (fallback) {
        setService(fallback);
      } else {
        setError(err.message);
      }
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

  // Step 1 Validation (Applicant Details + Custom Fields)
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

    if (service && service.fields) {
      service.fields.forEach(f => {
        if (isFieldVisible(f) && (f.is_required !== false && f.required !== false)) {
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

  // Step 2 Validation (Documents)
  const validateStep2 = () => {
    const errs = {};
    if (service && service.documents) {
      service.documents.forEach(doc => {
        if (doc.is_required !== false && doc.required !== false) {
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
      setCurrentStep(4); // Jump to success step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center font-sans">
        <div className="bg-white rounded-3xl shadow-sm p-8 text-center max-w-sm w-full space-y-4 border border-slate-200">
          <div className="w-12 h-12 border-4 border-[#0b192c] border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-bold text-xs">Loading application form engine...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center font-sans">
        <div className="bg-white rounded-3xl shadow-sm p-8 text-center max-w-md w-full space-y-4 border border-slate-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-xl font-heading font-extrabold text-slate-900">Service Unavailable</h3>
          <p className="text-slate-600 text-xs">{error || 'This service is currently unavailable or disabled.'}</p>
          <Link to="/services" className="inline-flex items-center space-x-2 px-6 py-3 bg-[#0b192c] hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs">
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All Services</span>
          </Link>
        </div>
      </div>
    );
  }

  // Group Dynamic Fields by Section
  const groupedFields = {};
  if (service.fields) {
    service.fields.forEach(f => {
      const secName = f.section || 'Specific Service Information';
      if (!groupedFields[secName]) groupedFields[secName] = [];
      groupedFields[secName].push(f);
    });
  }

  const stepsList = [
    { step: 1, title: 'Details', sub: '01 Personal & Service Info' },
    { step: 2, title: 'Documents', sub: '02 Proof Uploads' },
    { step: 3, title: 'Review', sub: '03 Verification & Summary' },
    { step: 4, title: 'Payment', sub: '04 Fee Submission' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 selection:bg-[#0b192c] selection:text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* BREADCRUMB */}
        <Breadcrumbs 
          items={[
            { label: 'E-Services', path: '/services' },
            { label: service.name, path: `/service/${service.slug || service.id}` },
            { label: 'Apply' },
            ...(currentStep === 2 ? [{ label: 'Documents' }] : currentStep === 3 ? [{ label: 'Review' }] : currentStep === 4 ? [{ label: 'Success' }] : [])
          ]} 
        />

        {/* PAGE HEADING & HEADER BANNER */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-3 py-0.5 rounded-full inline-block">
              {currentStep === 2 ? 'DOCUMENTS' : currentStep === 3 ? 'REVIEW' : 'APPLICATION'}
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
              {currentStep === 2 ? 'Upload Required Documents' : currentStep === 3 ? `Review ${service.name} Application` : `Apply for ${service.name}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              {currentStep === 2 
                ? 'Upload clear and valid documents required for your application.' 
                : 'Submit your required personal details and proof documents for fast online verification and processing.'}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-5 py-3 text-center md:text-right min-w-[130px] flex-1 md:flex-initial">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Service Fee</div>
              <div className="text-2xl font-black text-orange-600">
                {service.fee === 0 ? 'FREE' : `₹${service.fee}`}
              </div>
            </div>

            {currentStep < 4 && (
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={savingDraft}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/80 flex items-center gap-2 transition-colors shrink-0"
                title="Save application progress as draft"
              >
                <Save className="w-4 h-4 text-orange-500" />
                <span className="hidden sm:inline">{savingDraft ? 'Saving...' : 'Save Draft'}</span>
              </button>
            )}
          </div>
        </div>

        {/* DRAFT SAVED NOTIFICATION TOAST */}
        {draftSavedMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{draftSavedMessage}</span>
            </div>
            <Link to="/my-applications" className="text-xs font-extrabold underline hover:text-emerald-900">
              View Drafts
            </Link>
          </div>
        )}

        {submitError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-semibold">{submitError}</span>
          </div>
        )}

        {/* 4-STEP PROGRESS INDICATOR STEPPER */}
        {currentStep < 4 && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
              {stepsList.map((st) => {
                const isActive = currentStep === st.step;
                const isDone = currentStep > st.step;
                return (
                  <div key={st.step} className="flex flex-col items-center text-center relative z-10">
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isActive
                        ? 'bg-[#0b192c] text-white shadow-md ring-4 ring-orange-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}>
                      {isDone ? <Check className="w-5 h-5" /> : `0${st.step}`}
                    </div>
                    <div className="mt-2 space-y-0.5">
                      <div className={`text-xs font-extrabold ${isActive ? 'text-orange-600' : isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                        {st.title}
                      </div>
                      <div className="text-[10px] text-slate-400 hidden sm:block font-normal">{st.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MAIN APPLICATION TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT / MAIN AREA (2 COLS) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* STEP 01: APPLICANT DETAILS & CUSTOM FIELDS */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
                
                <div className="border-b pb-4 border-slate-100 flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-lg text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-orange-500" />
                    <span>Step 01: Applicant Details</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-bold">* Required fields</span>
                </div>

                {/* PRIMARY APPLICANT INFORMATION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      name="user_name"
                      placeholder="e.g. Karthik Subramanian"
                      value={applicantInfo.user_name}
                      onChange={handleApplicantChange}
                      className={`w-full px-4 py-3 bg-slate-50 border ${errors.user_name ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'} rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#0b192c] focus:bg-white transition-all`}
                    />
                    {errors.user_name && <p className="text-[11px] text-rose-600 font-bold mt-1">{errors.user_name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Mobile Number *</label>
                    <input
                      type="tel"
                      name="user_phone"
                      placeholder="e.g. 9876543210"
                      value={applicantInfo.user_phone}
                      onChange={handleApplicantChange}
                      className={`w-full px-4 py-3 bg-slate-50 border ${errors.user_phone ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'} rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#0b192c] focus:bg-white transition-all`}
                    />
                    {errors.user_phone && <p className="text-[11px] text-rose-600 font-bold mt-1">{errors.user_phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      name="user_email"
                      placeholder="e.g. karthik@example.com"
                      value={applicantInfo.user_email}
                      onChange={handleApplicantChange}
                      className={`w-full px-4 py-3 bg-slate-50 border ${errors.user_email ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'} rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#0b192c] focus:bg-white transition-all`}
                    />
                    {errors.user_email && <p className="text-[11px] text-rose-600 font-bold mt-1">{errors.user_email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={applicantInfo.dob}
                      onChange={handleApplicantChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#0b192c] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Gender</label>
                    <select
                      name="gender"
                      value={applicantInfo.gender}
                      onChange={handleApplicantChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#0b192c] focus:bg-white transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">State</label>
                    <input
                      type="text"
                      name="state"
                      value={applicantInfo.state}
                      onChange={handleApplicantChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#0b192c] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">District</label>
                    <input
                      type="text"
                      name="district"
                      placeholder="e.g. Chennai"
                      value={applicantInfo.district}
                      onChange={handleApplicantChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#0b192c] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="600001"
                      value={applicantInfo.pincode}
                      onChange={handleApplicantChange}
                      className={`w-full px-4 py-3 bg-slate-50 border ${errors.pincode ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'} rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#0b192c] focus:bg-white transition-all`}
                    />
                    {errors.pincode && <p className="text-[11px] text-rose-600 font-bold mt-1">{errors.pincode}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Residential Address</label>
                    <textarea
                      rows={2}
                      name="address"
                      placeholder="Door No, Street Name, Area..."
                      value={applicantInfo.address}
                      onChange={handleApplicantChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#0b192c] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* DYNAMIC SERVICE SPECIFIC FIELDS */}
                {Object.keys(groupedFields).length > 0 && (
                  <div className="pt-6 border-t border-slate-100 space-y-6">
                    <h4 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-orange-500" />
                      <span>Service Specific Inputs</span>
                    </h4>

                    {Object.entries(groupedFields).map(([secTitle, secFields], sIdx) => (
                      <div key={sIdx} className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
                        <h5 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200/80 pb-2">
                          {secTitle}
                        </h5>

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
                                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                                  {fLabel} {(f.is_required !== false && f.required !== false) && <span className="text-rose-500">*</span>}
                                </label>

                                {isSelect ? (
                                  <select
                                    value={fieldValues[key] || ''}
                                    onChange={e => handleInputChange(key, e.target.value)}
                                    className={`w-full px-4 py-3 bg-white border ${hasErr ? 'border-rose-500 bg-rose-50' : 'border-slate-200'} rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#0b192c]`}
                                  >
                                    <option value="">-- Select {fLabel} --</option>
                                    {optionsList.map((opt, oIdx) => (
                                      <option key={oIdx} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                ) : isRadio ? (
                                  <div className="flex flex-wrap gap-4 py-1.5">
                                    {optionsList.map((opt, oIdx) => (
                                      <label key={oIdx} className="inline-flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                                        <input
                                          type="radio"
                                          name={key}
                                          value={opt}
                                          checked={fieldValues[key] === opt}
                                          onChange={e => handleInputChange(key, e.target.value)}
                                          className="text-orange-500 focus:ring-orange-500"
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
                                      className="text-orange-500 focus:ring-orange-500 rounded"
                                    />
                                    <span>{f.helpText || 'I agree to this declaration'}</span>
                                  </label>
                                ) : isTextArea ? (
                                  <textarea
                                    rows={3}
                                    placeholder={f.placeholder}
                                    value={fieldValues[key] || ''}
                                    onChange={e => handleInputChange(key, e.target.value)}
                                    className={`w-full px-4 py-3 bg-white border ${hasErr ? 'border-rose-500 bg-rose-50' : 'border-slate-200'} rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#0b192c]`}
                                  />
                                ) : (
                                  <input
                                    type={fType === 'date' ? 'date' : fType === 'number' ? 'number' : 'text'}
                                    placeholder={f.placeholder}
                                    value={fieldValues[key] || ''}
                                    onChange={e => handleInputChange(key, e.target.value)}
                                    className={`w-full px-4 py-3 bg-white border ${hasErr ? 'border-rose-500 bg-rose-50' : 'border-slate-200'} rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#0b192c]`}
                                  />
                                )}

                                {f.helpText && <p className="text-[11px] text-slate-500 mt-1 font-normal">{f.helpText}</p>}
                                {hasErr && <p className="text-[11px] text-rose-600 font-bold mt-1">{hasErr}</p>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* VERIFY DETAILS TRUST NOTICE */}
                <div className="bg-orange-50/70 border border-orange-200/80 p-4 rounded-2xl flex items-start space-x-3 text-xs text-orange-900 font-medium">
                  <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-orange-950">Notice: </span>
                    Please verify your details carefully before continuing to document uploads.
                  </div>
                </div>

                {/* BOTTOM ACTION AREA */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={savingDraft}
                    className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/80 flex items-center gap-2 transition-colors"
                  >
                    <Save className="w-4 h-4 text-orange-500" />
                    <span>{savingDraft ? 'Saving...' : 'Save Draft'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 group/btn"
                  >
                    <span>Continue to Documents</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            )}

            {/* STEP 02: REQUIRED DOCUMENTS UPLOAD */}
            {currentStep === 2 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
                
                <div className="border-b pb-4 border-slate-100 flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-lg text-slate-900 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-emerald-600" />
                    <span>Step 02: Upload Required Proof Documents</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-bold">PDF, JPG, PNG (Max 5MB)</span>
                </div>

                {/* COMPACT APPLICATION SUMMARY CARD */}
                <div className="p-5 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm border border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <span>Ref ID:</span>
                      <span className="text-orange-400 font-mono">{draftId ? `APP-DRAFT-${draftId.toString().padStart(4, '0')}` : 'APP-REF-2026'}</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-white">{service.name}</h4>
                    <p className="text-xs text-slate-300 font-normal">
                      Applicant: <span className="font-bold text-white">{applicantInfo.user_name || 'Karthik S.'}</span>
                    </p>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-xl text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-extrabold">Status</div>
                    <div className="text-xs font-bold text-orange-400">Documents Pending (Step 2 of 4)</div>
                  </div>
                </div>

                {/* REQUIRED DOCUMENTS GRID */}
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
                          setErrors(prev => ({ ...prev, [`doc_${dName}`]: 'File type not supported. Upload PDF, JPG, or PNG.' }));
                          return;
                        }

                        if (selectedFile.size > maxLimitMB * 1024 * 1024) {
                          setErrors(prev => ({ ...prev, [`doc_${dName}`]: `File size exceeds ${maxLimitMB}MB limit.` }));
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
                          className={`p-5 rounded-2xl border-2 border-dashed transition-all ${
                            currentFile 
                              ? 'bg-emerald-50/50 border-emerald-300' 
                              : hasErr 
                              ? 'bg-rose-50/50 border-rose-300' 
                              : 'bg-slate-50 border-slate-200 hover:border-orange-400 hover:bg-slate-100/60'
                          } space-y-3`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                              <FileText className="w-4 h-4 text-orange-500" />
                              <span>{docName}</span>
                            </span>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase ${
                              doc.is_required !== false && doc.required !== false ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {doc.is_required !== false && doc.required !== false ? 'Required' : 'Optional'}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                            {doc.description || 'Upload clear scanned copy or photo proof'}
                          </p>

                          <div className="text-[10px] text-slate-400 font-bold flex items-center gap-2">
                            <span className="bg-slate-200/60 px-2 py-0.5 rounded text-slate-600">PDF, JPG, PNG</span>
                            <span>Max {maxMB}MB</span>
                          </div>

                          {!currentFile ? (
                            <div className="space-y-2 pt-1">
                              <label className="block w-full py-3.5 px-3 bg-white border border-slate-200 rounded-xl text-center cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-colors shadow-xs">
                                <span className="text-xs font-extrabold text-orange-600 flex items-center justify-center gap-1.5">
                                  <Upload className="w-4 h-4" />
                                  <span>Choose File or Drag & Drop</span>
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
                            <div className="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-xs space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 truncate">
                                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  <span className="text-xs font-bold text-slate-800 truncate">{currentFile.name}</span>
                                </div>
                                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                                  {(currentFile.size / (1024 * 1024)).toFixed(2)} MB
                                </span>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                                <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Successfully Uploaded</span>
                                </span>
                                <div className="flex items-center space-x-2">
                                  <label className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer">
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
                            </div>
                          )}

                          {hasErr && (
                            <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{hasErr}</span>
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 text-center rounded-2xl text-slate-600 text-xs font-medium">
                    No document uploads required for this service. Click continue to review.
                  </div>
                )}

                {/* INFORMATION NOTICE CARD */}
                <div className="bg-orange-50/70 border border-orange-200/80 p-4 rounded-2xl flex items-start space-x-3 text-xs text-orange-900 font-medium">
                  <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-orange-950">Document Notice: </span>
                    Please upload clear and readable documents. Make sure the details match your application.
                  </div>
                </div>

                {/* BOTTOM ACTIONS */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 border border-slate-200/80"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Details</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={savingDraft}
                      className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/80 flex items-center gap-2 transition-colors"
                    >
                      <Save className="w-4 h-4 text-orange-500" />
                      <span>{savingDraft ? 'Saving...' : 'Save Draft'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 group/btn"
                    >
                      <span>Continue to Review</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* STEP 03: APPLICATION REVIEW & SUBMISSION */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
                
                <div className="border-b pb-4 border-slate-100 flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-lg text-slate-900 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-orange-500" />
                    <span>Step 03: Review Application Details</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-bold">Final Verification</span>
                </div>

                {/* APPLICANT SUMMARY */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between border-b pb-3 border-slate-200/80">
                    <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Applicant Details</h4>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Full Name</span>
                      <span className="font-bold text-slate-900">{applicantInfo.user_name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Mobile</span>
                      <span className="font-bold text-slate-900">{applicantInfo.user_phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Email</span>
                      <span className="font-bold text-slate-900">{applicantInfo.user_email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-extrabold uppercase">District / State</span>
                      <span className="font-bold text-slate-900">{applicantInfo.district ? `${applicantInfo.district}, ${applicantInfo.state}` : applicantInfo.state}</span>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC FIELD VALUES SUMMARY */}
                {Object.keys(fieldValues).length > 0 && (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between border-b pb-3 border-slate-200/80">
                      <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{service.name} Custom Inputs</h4>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
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
                          <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200/80">
                            <span className="text-slate-400 block text-[10px] font-extrabold uppercase">{label}:</span>
                            <span className="font-bold text-slate-900">{v ? String(v) : 'Not Provided'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* UPLOADED DOCUMENTS SUMMARY */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between border-b pb-3 border-slate-200/80">
                    <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Uploaded Documents</h4>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    {Object.entries(files).map(([dName, fObj], idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80">
                        <span className="font-medium text-slate-700">{dName}</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{fObj ? fObj.name : 'Not Uploaded'}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FEE BREAKDOWN CARD */}
                <div className="p-6 bg-orange-50/60 border border-orange-200/90 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-orange-200 pb-3">
                    <h4 className="text-xs font-extrabold text-orange-950 uppercase tracking-wider">Fee Breakdown</h4>
                    <span className="text-[10px] font-extrabold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                      {service.fee === 0 ? 'FREE Facilitation' : 'Service Fee'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700 font-medium">
                    <div className="flex justify-between">
                      <span>Service Fee ({service.name}):</span>
                      <span className="font-bold">₹{service.fee || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Facilitation Desk Review:</span>
                      <span className="font-bold text-emerald-600">₹0 (Free Facilitation)</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-orange-200 font-extrabold text-slate-900 text-sm">
                      <span>Total Payable:</span>
                      <span className="text-orange-600 text-base font-black">₹{service.fee || 0}</span>
                    </div>
                  </div>
                </div>

                {/* SUBMISSION ACTIONS */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting Application...</span>
                      </>
                    ) : service.fee > 0 ? (
                      <>
                        <span>Pay ₹{service.fee} & Submit</span>
                        <Lock className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Submit Free Application</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR — APPLICATION SUMMARY & HELP CARD (1 COL) */}
          <div className="space-y-6 sticky top-8">
            
            {/* APPLICATION SUMMARY CARD */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-heading font-extrabold text-base text-slate-900 border-b pb-3 border-slate-100">
                Application Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Service</span>
                  <span className="font-extrabold text-slate-900 text-sm">{service.name}</span>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Category</span>
                  <span className="font-bold text-orange-600">{service.category_name}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-500 font-medium">Service Fee:</span>
                  <span className="font-black text-orange-600 text-base">
                    {service.fee === 0 ? 'FREE' : `₹${service.fee}`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Estimated SLA:</span>
                  <span className="font-bold text-slate-900">{service.processing_time || '3-5 Working Days'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Required Proofs:</span>
                  <span className="font-bold text-slate-900">{service.documents ? service.documents.length : 1} File(s)</span>
                </div>
              </div>
            </div>

            {/* NEED HELP CARD */}
            <div className="bg-[#0b192c] text-white rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-orange-400 font-extrabold text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Need Assistance?</span>
              </div>
              <h4 className="font-heading font-extrabold text-lg text-white">
                Application Help Desk
              </h4>
              <p className="text-slate-300 text-xs font-normal leading-relaxed">
                Have questions regarding required documents or application steps? Contact our support team.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                  <span>1800-425-3738</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <Mail className="w-3.5 h-3.5 text-orange-400" />
                  <span>support@e-seva.portal</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* STEP 04: SUCCESS SCREEN */}
        {currentStep === 4 && submittedApp && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">Application Submitted Successfully!</h2>
              <p className="text-slate-600 text-xs sm:text-sm font-normal">
                Your application for <span className="font-bold text-slate-900">{service.name}</span> has been logged into the E-Seva queue.
              </p>
            </div>

            <div className="bg-[#0b192c] text-white rounded-2xl p-6 space-y-2 shadow-md">
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Your Unique Application ID</div>
              <div className="text-3xl sm:text-4xl font-black text-orange-400 font-mono tracking-wider">
                {submittedApp.application_number}
              </div>
              <div className="text-xs text-slate-400 font-normal">
                Submitted on: {new Date(submittedApp.submitted_at || Date.now()).toLocaleDateString()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-left bg-slate-50 p-5 rounded-2xl border border-slate-200 font-medium">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Applicant Name</span>
                <span className="font-bold text-slate-900">{applicantInfo.user_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Initial Status</span>
                <span className="font-bold text-orange-600">SUBMITTED (Under Verification)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Processing SLA</span>
                <span className="font-bold text-slate-900">{service.processing_time || '3-5 Days'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Service Fee</span>
                <span className="font-bold text-emerald-600">{service.fee === 0 ? 'FREE' : `₹${service.fee}`}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/track?appId=${submittedApp.application_number}`}
                className="w-full sm:w-auto px-6 py-3 bg-[#0b192c] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                <span>Track Application</span>
              </Link>

              <Link
                to="/my-applications"
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>View My Applications</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const DEFAULT_SERVICES_MAP = {
  'aadhaar-address-update': {
    id: 1,
    category_name: 'Aadhaar Services',
    category_slug: 'aadhaar-services',
    name: 'Aadhaar Address Update',
    slug: 'aadhaar-address-update',
    description: 'Update your residential address in official UIDAI database with valid proof of address.',
    processing_time: '3-5 Working Days',
    fee: 50,
    fields: [
      { field_name: 'aadhaar_number', field_label: '12-Digit Aadhaar Number', field_type: 'text', placeholder: '1234 5678 9012', is_required: true },
      { field_name: 'new_address', field_label: 'New Address to Update', field_type: 'textarea', placeholder: 'Enter new complete residential address', is_required: true }
    ],
    documents: [
      { name: 'Proof of Address (PoA)', description: 'Electricity Bill, Bank Passbook, or Rent Agreement', required: true }
    ]
  }
};
