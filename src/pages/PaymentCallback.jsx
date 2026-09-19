import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  Printer, 
  FileText, 
  ShieldCheck, 
  RefreshCw, 
  Home,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { addToast } = useToast();

  const merchantTransactionId = searchParams.get('merchantTransactionId') || searchParams.get('txnId');
  const appId = searchParams.get('appId');

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!merchantTransactionId) {
      setError(
        lang === 'ta'
          ? 'பரிவர்த்தனை குறிப்பு எண் காணப்படவில்லை (Transaction ID missing).'
          : 'Transaction reference ID missing from payment response.'
      );
      setLoading(false);
      return;
    }

    verifyPayment();
  }, [merchantTransactionId]);

  const verifyPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/payments/phonepe/verify/${encodeURIComponent(merchantTransactionId)}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setPaymentData(data);
      } else if (data.state === 'PENDING') {
        setPaymentData({ state: 'PENDING', message: data.message });
      } else {
        setError(data.message || (lang === 'ta' ? 'கட்டணம் செலுத்துதல் தோல்வியுற்றது அல்லது ரத்து செய்யப்பட்டது.' : 'Payment was not completed or failed.'));
        setPaymentData(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to verify payment status with server');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = async () => {
    const targetAppId = appId || paymentData?.application_id;
    if (!targetAppId) {
      navigate('/my-applications');
      return;
    }

    try {
      setRetrying(true);
      const res = await fetch('/api/payments/phonepe/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: targetAppId })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to re-initiate PhonePe payment');
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setRetrying(false);
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast(lang === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied to clipboard!', 'success', 2000);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-orange-500 selection:text-white flex items-center justify-center">
      <div className="max-w-2xl w-full">

        {/* LOADING STATE */}
        {loading && (
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-slate-200/90 text-center space-y-6 animate-pulse">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-200">
                <ShieldCheck className="w-4 h-4" />
                <span>PhonePe Secure Gateway</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {lang === 'ta' ? 'கட்டணம் சரிபார்க்கப்படுகிறது...' : 'Verifying Payment with PhonePe...'}
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {lang === 'ta'
                  ? 'தயவுசெய்து காத்திருக்கவும் அல்லது பக்கத்தைப் புதுப்பிக்க வேண்டாம்.'
                  : 'Please do not refresh or close this window while we verify your transaction status.'}
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {!loading && paymentData && paymentData.success && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden print:border-none print:shadow-none">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 sm:p-10 text-white text-center space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="w-20 h-20 bg-white text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl ring-8 ring-emerald-500/30">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>PhonePe Verified Payment</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {lang === 'ta' ? 'கட்டணம் வெற்றிகரமாக செலுத்தப்பட்டது!' : 'Payment Received Successfully!'}
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm max-w-md mx-auto">
                {lang === 'ta'
                  ? 'உங்கள் விண்ணப்பக் கட்டணம் PhonePe வழியாக பெறப்பட்டு, விண்ணப்பம் சரிபார்ப்புக்கு சமர்ப்பிக்கப்பட்டது.'
                  : 'Your fee has been securely processed via PhonePe and your application is now submitted for official verification.'}
              </p>
            </div>

            {/* Receipt Details Card */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
                  <span className="text-xs font-medium text-slate-500">
                    {lang === 'ta' ? 'செலுத்தப்பட்ட தொகை' : 'Amount Paid'}
                  </span>
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    ₹{paymentData.amount || 0}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">{lang === 'ta' ? 'விண்ணப்ப எண்' : 'Application Ref Number'}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono">{paymentData.application_number || 'N/A'}</span>
                      {paymentData.application_number && (
                        <button
                          onClick={() => handleCopy(paymentData.application_number)}
                          className="text-slate-400 hover:text-slate-700 transition-colors"
                          title="Copy Application Number"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">{lang === 'ta' ? 'PhonePe பரிவர்த்தனை எண்' : 'PhonePe Transaction ID'}</span>
                    <span className="font-bold text-slate-900 font-mono truncate block">{paymentData.transaction_id || merchantTransactionId}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">{lang === 'ta' ? 'கட்டண முறை' : 'Payment Mode'}</span>
                    <span className="font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md inline-block">
                      {paymentData.payment_method || 'PhonePe UPI'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">{lang === 'ta' ? 'ரசீது எண்' : 'Receipt Number'}</span>
                    <span className="font-bold text-slate-900 font-mono">{paymentData.receipt_number || 'REC-CONFIRMED'}</span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block mb-0.5">{lang === 'ta' ? 'செலுத்தப்பட்ட நேரம்' : 'Paid At'}</span>
                    <span className="font-medium text-slate-700">
                      {paymentData.paid_at ? new Date(paymentData.paid_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Hidden on Print) */}
              <div className="space-y-3 print:hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handlePrint}
                    className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200"
                  >
                    <Printer className="w-4 h-4 text-slate-600" />
                    <span>{lang === 'ta' ? 'ரசீதை அச்சிடுக' : 'Print Fee Receipt'}</span>
                  </button>

                  <Link
                    to={`/my-applications/${paymentData.application_id || appId}`}
                    className="w-full py-3.5 px-4 bg-[#0b192c] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-orange-400" />
                    <span>{lang === 'ta' ? 'விண்ணப்பத்தைப் பார்க்கவும்' : 'View Application'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="text-center pt-2">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>{lang === 'ta' ? 'முகப்பு டாஷ்போர்டுக்கு செல்க' : 'Return to Citizen Dashboard'}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PENDING STATE */}
        {!loading && paymentData && paymentData.state === 'PENDING' && (
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-amber-200 text-center space-y-6">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                Payment Verification Pending
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                {lang === 'ta' ? 'கட்டணம் இன்னும் நிலுவையில் உள்ளது' : 'Payment Awaiting Confirmation'}
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {paymentData.message || (lang === 'ta'
                  ? 'உங்கள் கட்டணம் வங்கி அல்லது PhonePe மூலம் இன்னும் செயலாக்கத்தில் உள்ளது. சில வினாடிகள் கழித்து சரிபார்க்கவும்.'
                  : 'Your bank or PhonePe is currently processing this transaction. Click below to verify the updated status.')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={verifyPayment}
                className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{lang === 'ta' ? 'மீண்டும் சரிபார்க்கவும்' : 'Check Status Again'}</span>
              </button>
              <Link
                to="/my-applications"
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>{lang === 'ta' ? 'என் விண்ணப்பங்கள்' : 'Go to My Applications'}</span>
              </Link>
            </div>
          </div>
        )}

        {/* FAILED OR ERROR STATE */}
        {!loading && (error || (paymentData && !paymentData.success && paymentData.state !== 'PENDING')) && (
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-rose-200 text-center space-y-6">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                Transaction Incomplete
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                {lang === 'ta' ? 'கட்டணம் செலுத்தப்படவில்லை / தோல்வி' : 'Payment Not Completed'}
              </h2>
              <p className="text-xs text-rose-600 max-w-md mx-auto font-medium">
                {error || paymentData?.message || (lang === 'ta'
                  ? 'பரிவர்த்தனை ரத்து செய்யப்பட்டது அல்லது வங்கியால் அங்கீகரிக்கப்படவில்லை.'
                  : 'The transaction was cancelled or could not be completed at this time.')}
              </p>
              <p className="text-[11px] text-slate-400">
                {lang === 'ta'
                  ? 'கவலை வேண்டாம்! உங்கள் விண்ணப்பப் படிவத் தகவல்கள் பாதுகாப்பாகச் சேமிக்கப்பட்டுள்ளன.'
                  : 'Don\'t worry! Your uploaded documents and application draft remain safely stored.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRetryPayment}
                disabled={retrying}
                className="w-full sm:w-auto px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:bg-slate-300"
              >
                {retrying ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                <span>{lang === 'ta' ? 'PhonePe மூலம் மீண்டும் செலுத்தவும்' : 'Retry Payment with PhonePe'}</span>
              </button>

              <Link
                to="/my-applications"
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>{lang === 'ta' ? 'என் விண்ணப்பங்கள்' : 'View My Applications'}</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
