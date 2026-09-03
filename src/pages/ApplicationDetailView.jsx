import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FileText, Clock, CheckCircle2, AlertCircle, ArrowLeft, ShieldAlert,
  UserCheck, FileCheck, Download, History, MessageSquare, ExternalLink, Award, Copy, Check, Printer
} from 'lucide-react';
import CertificatePrint from '../components/CertificatePrint';

const STATUS_BADGES = {
  DRAFT: 'bg-amber-100 text-amber-800 border-amber-200',
  SUBMITTED: 'bg-blue-100 text-blue-800 border-blue-200',
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  UNDER_REVIEW: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Processing: 'bg-purple-100 text-purple-800 border-purple-200',
  PROCESSING: 'bg-purple-100 text-purple-800 border-purple-200',
  Approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  APPROVED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Rejected: 'bg-rose-100 text-rose-800 border-rose-200',
  REJECTED: 'bg-rose-100 text-rose-800 border-rose-200'
};

export default function ApplicationDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [copiedAppId, setCopiedAppId] = useState(false);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`/api/applications/${id}`, { headers });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Unauthorized access. You can only view your own applications.');
        }
        throw new Error('Application details not found');
      }

      const data = await res.json();
      setDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-sm w-full space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium text-sm">Retrieving application details from database...</p>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md w-full space-y-4 border border-slate-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-xl font-bold text-slate-800">Access Restricted</h3>
          <p className="text-slate-600 text-sm">{error || 'Could not access application details.'}</p>
          <Link to="/my-applications" className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Applications</span>
          </Link>
        </div>
      </div>
    );
  }

  const badgeClass = STATUS_BADGES[details.status] || STATUS_BADGES.SUBMITTED;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <Link to="/my-applications" className="hover:text-indigo-600">My Applications</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">{details.application_number}</span>
        </div>

        {/* Neutral Facilitation Disclaimer */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            <span className="font-bold">E-Seva Facilitation Notice: </span>
            This record reflects your application submitted through E-Seva. Official department verification is handled by authorized executives.
          </div>
        </div>

        {/* Top Summary Banner */}
        <div className="bg-[#0b192c] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-3 relative z-10">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${badgeClass}`}>
                STATUS: {details.status}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Logged: {new Date(details.created_at || details.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div className="flex items-center space-x-3 flex-wrap gap-y-2">
              <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-wide text-orange-400 select-all">
                {details.application_number}
              </h1>

              <button
                type="button"
                onClick={() => {
                  if (details.application_number) {
                    navigator.clipboard.writeText(details.application_number);
                    setCopiedAppId(true);
                    setTimeout(() => setCopiedAppId(false), 2000);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center space-x-1 border ${
                  copiedAppId 
                    ? 'bg-emerald-600 text-white border-emerald-500' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                }`}
              >
                {copiedAppId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-orange-400" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-slate-300 text-sm font-semibold">
              {details.service_name || 'Digital Service'} ({details.category_name || 'E-Seva Category'})
            </p>
          </div>

          <div className="flex items-center space-x-3 flex-wrap gap-2 relative z-10">
            {(details.status === 'Approved' || details.status === 'APPROVED' || details.status === 'Completed' || details.status === 'COMPLETED') && (
              <button
                onClick={() => setShowCertModal(true)}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-2"
              >
                <Award className="w-4 h-4" />
                <span>View / Print Certificate</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Download / Print Receipt</span>
            </button>
          </div>
        </div>

        {/* Action Required Banner */}
        {(details.status === 'ACTION_REQUIRED' || details.status === 'Action Required') && (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl space-y-2 text-xs text-rose-900 shadow-sm">
            <div className="flex items-center space-x-2 font-bold text-sm text-rose-700">
              <AlertCircle className="w-5 h-5" />
              <span>Action Required: Verification Query from E-Seva Officer</span>
            </div>
            <p>
              One or more of your uploaded proof documents require re-upload or clarification. Please review the rejected documents below and click <strong>"Replace Document"</strong> to submit corrected copies.
            </p>
          </div>
        )}

        {/* Section 1: Applicant Information */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b pb-3 border-slate-100 flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <span>Applicant Primary Contact</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block font-medium">Full Name</span>
              <span className="font-bold text-slate-800 text-sm">{details.user_name || 'N/A'}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block font-medium">Mobile Number</span>
              <span className="font-bold text-slate-800 text-sm">{details.user_phone || 'N/A'}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block font-medium">Email Address</span>
              <span className="font-bold text-slate-800 text-sm truncate block">{details.user_email || 'N/A'}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block font-medium">Service Fee</span>
              <span className="font-bold text-emerald-600 text-sm">₹{details.total_fee || 0}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Submitted Dynamic Service Fields */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b pb-3 border-slate-100 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Submitted Dynamic Form Values</span>
          </h3>

          {details.field_values && details.field_values.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {details.field_values.map((fv, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-semibold block">{fv.field_label || fv.field_name}:</span>
                  <span className="font-bold text-slate-900">{fv.value || 'N/A'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No dynamic form values logged for this entry.</p>
          )}
        </div>

        {/* Section 3: Uploaded Documents */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b pb-3 border-slate-100 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <span>Uploaded Proof Documents</span>
            </span>
            <span className="text-xs font-semibold text-slate-500">Protected Document Access</span>
          </h3>

          {details.documents && details.documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {details.documents.map((doc, idx) => {
                const isVerified = doc.verification_status === 'Verified';
                const isRejected = doc.verification_status === 'Rejected';

                const handleReplaceFile = async (selectedFile) => {
                  if (!selectedFile) return;
                  try {
                    const formData = new FormData();
                    formData.append('file', selectedFile);

                    const token = localStorage.getItem('token');
                    const headers = {};
                    if (token) headers.Authorization = `Bearer ${token}`;

                    const res = await fetch(`/api/documents/${doc.id}/replace`, {
                      method: 'POST',
                      headers,
                      body: formData
                    });

                    if (!res.ok) {
                      const errData = await res.json();
                      throw new Error(errData.error || 'Failed to replace document');
                    }

                    alert('Document replaced successfully!');
                    fetchApplicationDetails();
                  } catch (err) {
                    alert(`Error: ${err.message}`);
                  }
                };

                return (
                  <div key={idx} className={`p-4 bg-slate-50 border ${isRejected ? 'border-rose-300 bg-rose-50/30' : isVerified ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'} rounded-xl space-y-3`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm block">{doc.document_name}</span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        isVerified
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isRejected
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {isVerified ? '✓ Verified' : isRejected ? '⚠ Rejected' : 'Pending Verification'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 font-mono truncate">
                      File: {doc.original_filename || doc.file_name}
                    </div>

                    {isRejected && (
                      <div className="p-3 bg-rose-100/80 border border-rose-200 rounded-lg text-xs text-rose-900 space-y-1">
                        <div className="font-bold flex items-center space-x-1">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Rejection Reason:</span>
                        </div>
                        <p className="leading-relaxed">{doc.rejection_reason || 'Document copy is unclear. Please upload a clearer copy.'}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <div className="flex items-center space-x-2">
                        <a
                          href={`/api/documents/${doc.id}/preview`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-200 flex items-center space-x-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </a>

                        <a
                          href={`/api/documents/${doc.id}/download`}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 flex items-center space-x-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      </div>

                      {(isRejected || details.status === 'DRAFT') && (
                        <label className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer flex items-center space-x-1">
                          <span>Replace Document</span>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={e => e.target.files[0] && handleReplaceFile(e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No proof documents attached.</p>
          )}
        </div>

        {/* Section 4: Audit Status Timeline & Admin Remarks */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b pb-3 border-slate-100 flex items-center space-x-2">
            <History className="w-5 h-5 text-indigo-600" />
            <span>Application Status Audit History</span>
          </h3>

          {details.history && details.history.length > 0 ? (
            <div className="relative border-l-2 border-slate-200 ml-3 space-y-4 pl-6 py-2">
              {details.history.map((hist, idx) => (
                <div key={idx} className="relative">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full absolute -left-[31px] top-1 ring-4 ring-white"></div>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 uppercase">{hist.status}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{new Date(hist.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">{hist.admin_remarks}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No status updates logged yet.</p>
          )}
        </div>

        {/* Section 5: Application Messages Chat Panel */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <span>Application Support Chat & Query Messages</span>
            </h3>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              Direct Officer Support
            </span>
          </div>

          <ApplicationChatBox applicationId={details.id} />
        </div>

        {/* Certificate Modal */}
        {showCertModal && (
          <CertificatePrint
            application={details}
            onClose={() => setShowCertModal(false)}
          />
        )}

      </div>
    </div>
  );
}

function ApplicationChatBox({ applicationId }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [applicationId]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/applications/${applicationId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data || []);
      }
    } catch (e) {}
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/applications/${applicationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMsg, senderType: 'USER' })
      });
      if (res.ok) {
        setNewMsg('');
        fetchMessages();
      }
    } catch (e) {} finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="max-h-64 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            No messages sent yet. Send a message if you have questions regarding document verification or status.
          </div>
        ) : (
          messages.map((m, i) => {
            const isUser = m.senderType === 'USER';
            return (
              <div key={i} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-md p-3 rounded-2xl text-xs ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none shadow-sm'
                }`}>
                  <div className="flex items-center space-x-2 text-[10px] opacity-80 mb-1 font-mono font-bold">
                    <span>{m.senderName || (isUser ? 'Applicant' : 'Admin Officer')}</span>
                    <span>•</span>
                    <span>{new Date(m.createdAt || m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="leading-relaxed">{m.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message to the verification officer..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
        />
        <button
          type="submit"
          disabled={loading || !newMsg.trim()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
