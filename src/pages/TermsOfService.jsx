import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileCheck, AlertCircle, HelpCircle, CheckCircle2, Lock, ArrowLeft, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TermsOfService() {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-orange-500 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header Banner */}
        <div className="bg-[#0b192c] rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-4 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-slate-800/90 text-orange-400 text-xs font-black rounded-full border border-slate-700 uppercase tracking-widest relative z-10">
            <FileCheck className="w-4 h-4 text-orange-400" />
            <span>{lang === 'ta' ? 'தள சேவை ஒப்பந்தம் & விதிமுறைகள்' : 'Platform Terms & Service Agreement'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight relative z-10">
            {lang === 'ta' ? 'சேவை விதிகளும் நிபந்தனைகளும்' : 'Terms & Conditions of Service'}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed relative z-10">
            {lang === 'ta' 
              ? 'இ-சேவை போர்ட்டலைப் பயன்படுத்துவதன் மூலம், விண்ணப்ப சமர்ப்பிப்புகள், ஆவண சரிபார்ப்பு செயல்முறைகள் மற்றும் போர்ட்டல் பயன்பாட்டை நிர்வகிக்கும் பின்வரும் விதிமுறைகளை நீங்கள் முழுமையாக ஏற்றுக்கொள்கிறீர்கள்.'
              : 'By utilizing the E-Seva assistance platform, you agree to the following terms governing application submissions, document verification workflows, and platform usage.'}
          </p>
        </div>

        {/* Terms Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">

          {/* Section 1 */}
          <div className="space-y-2.5 border-b border-slate-100 pb-6">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-4.5 h-4.5 text-orange-500 shrink-0" />
              <span>{lang === 'ta' ? '1. சேவை உதவி தளம் பற்றிய அறிவிப்பு' : '1. Private Service Assistance Platform Disclaimer'}</span>
            </h3>
            <p className="text-slate-600 leading-relaxed pl-6">
              {lang === 'ta'
                ? 'இந்த போர்ட்டல் குடிமக்களுக்கு டிஜிட்டல் சேவை உதவி, விண்ணப்பப் படிவங்களை எளிதாகப் பூர்த்தி செய்தல், சான்று ஆவணங்களைச் சரிபார்த்தல் மற்றும் நேரலை கண்காணிப்பு சேவைகளை வழங்குகிறது. இது ஒரு சுயாதீன டிஜிட்டல் சேவை தளமாகும்.'
                : 'This portal provides digital service facilitation, dynamic form assistance, document pre-verification, and live status tracking services. It operates as an independent digital facilitation desk.'}
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2.5 border-b border-slate-100 pb-6">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <FileCheck className="w-4.5 h-4.5 text-orange-500 shrink-0" />
              <span>{lang === 'ta' ? '2. விண்ணப்பதாரரின் பொறுப்பு & ஆவணங்களின் உண்மைத்தன்மை' : '2. Applicant Responsibility & Authenticity'}</span>
            </h3>
            <p className="text-slate-600 leading-relaxed pl-6">
              {lang === 'ta'
                ? 'சமர்ப்பிக்கப்படும் அனைத்து விவரங்களும் ஆவணங்களும் (ஆதார், முகவரிச் சான்று, பிறப்புச் சான்று போன்றவை) உண்மையானவை மற்றும் சரியானவை என்பதை உறுதி செய்வது விண்ணப்பதாரரின் முழுப் பொறுப்பாகும். போலி ஆவணங்களைச் சமர்ப்பித்தால் விண்ணப்பம் உடனடியாக நிராகரிக்கப்படும்.'
                : 'Applicants are strictly responsible for providing authentic, accurate, and legible supporting proof documents. Submitting falsified documents or fraudulent information will result in immediate rejection and application cancellation.'}
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2.5 border-b border-slate-100 pb-6">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <AlertCircle className="w-4.5 h-4.5 text-orange-500 shrink-0" />
              <span>{lang === 'ta' ? '3. செயலாக்க நேரம் & நிலைகள்' : '3. Processing Timelines & Delivery SLAs'}</span>
            </h3>
            <p className="text-slate-600 leading-relaxed pl-6">
              {lang === 'ta'
                ? 'சேவை விவரங்களில் காட்டப்படும் செயலாக்க நேரங்கள் (எ.கா: 2-3 வேலை நாட்கள்) பொதுவான வழிகாட்டுதல்களாகும். அரசுத் துறைகளின் சரிபார்ப்பு நிலைகள் மற்றும் கூடுதல் ஆவணத் தெளிவுபடுத்துதல்களைப் பொறுத்து செயலாக்க நேரத்தில் மாற்றங்கள் ஏற்படலாம்.'
                : 'Estimated processing timelines displayed on service details (e.g. 2–3 working days) are operational guidelines. Actual processing times may vary depending on desk verification queues and administrative verification.'}
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2.5 border-b border-slate-100 pb-6">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <HelpCircle className="w-4.5 h-4.5 text-orange-500 shrink-0" />
              <span>{lang === 'ta' ? '4. சேவைக் கட்டணங்கள் & கட்டண விவரம்' : '4. Service & Facilitation Fee Structure'}</span>
            </h3>
            <p className="text-slate-600 leading-relaxed pl-6">
              {lang === 'ta'
                ? 'சேவைக் கட்டணங்கள் விண்ணப்பப் படிவங்களைச் செயலாக்குதல், ஆவணங்களைச் சரிபார்த்தல், மின்னணுச் சேமிப்பு, குறுஞ்செய்தி (SMS) அறிவிப்புகள் மற்றும் வாடிக்கையாளர் உதவி மையம் ஆகியவற்றிற்குப் பொருந்தும். அனைத்துக் கட்டணங்களும் விண்ணப்பம் சமர்ப்பிக்கும் முன் தெளிவுபடுத்தப்படும்.'
                : 'Service fees cover application processing, document verification, cloud storage, SMS tracking updates, and customer helpline support. All applicable charges are displayed transparently before payment checkout.'}
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-2.5 border-b border-slate-100 pb-6">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Lock className="w-4.5 h-4.5 text-orange-500 shrink-0" />
              <span>{lang === 'ta' ? '5. தரவு பாதுகாப்பு & தனியுரிமை' : '5. Data Security & Confidentiality'}</span>
            </h3>
            <p className="text-slate-600 leading-relaxed pl-6">
              {lang === 'ta'
                ? 'உங்களின் தனிப்பட்ட விவரங்கள் மற்றும் பதிவேற்றப்படும் ஆவணங்கள் 256-பிட் பாதுகாப்பான முறையில் குறியாக்கம் செய்யப்படுகின்றன (Encrypted). உங்களின் அனுமதி இன்றி விவரங்கள் எந்தவொரு மூன்றாம் நபருக்கும் பகிரப்படாது.'
                : 'Your personal Information and uploaded proof documents are encrypted using 256-bit security protocols. Your information is never shared with third parties without explicit consent.'}
            </p>
          </div>

          {/* Warning Note / Self Declaration */}
          <div className="p-5 bg-orange-50 border border-orange-200/80 rounded-2xl text-slate-900 space-y-2">
            <div className="font-extrabold text-xs flex items-center space-x-2 text-orange-950">
              <CheckCircle2 className="w-4.5 h-4.5 text-orange-600 shrink-0" />
              <span>{lang === 'ta' ? 'சுய-உறுதிமொழி ஒப்பந்தம் (Self-Declaration Agreement):' : 'Self-Declaration Agreement:'}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed pl-6">
              {lang === 'ta'
                ? 'இ-சேவை போர்ட்டலில் கணக்கை உருவாக்கும்போதும் அல்லது சேவைக்கு விண்ணப்பிக்கும்போதும், வழங்கப்பட்டுள்ள அனைத்து விவரங்களும் உங்களுடையதே என்றும் அவை முற்றிலும் உண்மையானவை என்றும் உறுதியளிக்கிறீர்கள்.'
                : 'When creating an account or submitting an application via the E-Seva portal, you explicitly confirm that all submitted details and uploaded proof files belong to you and are fully authentic.'}
            </p>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link to="/" className="inline-flex items-center space-x-2 text-xs font-black text-[#0b192c] hover:text-orange-600 transition-colors bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-xs">
            <ArrowLeft className="w-4 h-4 text-orange-500" />
            <span>{lang === 'ta' ? 'முகப்புப் பக்கத்திற்குத் திரும்பவும்' : 'Return to Home Page'}</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
