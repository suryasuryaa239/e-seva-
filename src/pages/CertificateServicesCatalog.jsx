import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, Award, UserCheck, ShieldCheck, MapPin, Building, 
  Download, Search, CheckCircle2, AlertCircle, ArrowRight, HelpCircle, Briefcase, Landmark, BookOpen
} from 'lucide-react';

export default function CertificateServicesCatalog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const certificateServices = [
    {
      id: 'income-certificate',
      title: 'Income Certificate Application',
      description: 'Official Revenue Department certificate confirming total annual family income from all sources.',
      fee: '₹60',
      sla: '7–10 Working Days',
      docs: ['Aadhaar Card', 'Ration Card / Smart Card', 'Salary Slip / Income Proof', 'Self Declaration'],
      icon: Landmark,
      badge: 'High Demand'
    },
    {
      id: 'community-caste-certificate',
      title: 'Community / Caste Certificate',
      description: 'Government revenue certificate certifying community status (BC / MBC / SC / ST) for reservation.',
      fee: '₹60',
      sla: '7–12 Working Days',
      docs: ['Parent Community Certificate', 'School TC / Marksheet', 'Aadhaar Card', 'Smart Ration Card'],
      icon: Award,
      badge: 'Popular'
    },
    {
      id: 'native-domicile-certificate',
      title: 'Native / Domicile Certificate',
      description: 'Official proof verifying permanent domicile & native residence status in the state.',
      fee: '₹60',
      sla: '7–10 Working Days',
      docs: ['Aadhaar Card', '5 Year School Study Proof or Birth Certificate', 'Property Tax Receipt / Ration Card'],
      icon: MapPin,
      badge: 'Essential'
    },
    {
      id: 'first-graduate-certificate',
      title: 'First Graduate Certificate',
      description: 'Fee concession certificate for students who are first person in their family to pursue higher education.',
      fee: '₹60',
      sla: '10–14 Working Days',
      docs: ['Applicant & Parent Aadhaar', 'Sibling TC / Declaration', 'Ration Card', 'Self Declaration Affidavit'],
      icon: BookOpen,
      badge: 'Educational'
    },
    {
      id: 'no-male-child-certificate',
      title: 'No Male Child Certificate',
      description: 'Revenue certificate issued to families having only female children for welfare scheme eligibility.',
      fee: '₹60',
      sla: '7–10 Working Days',
      docs: ['Birth Certificates of Female Children', 'Parents Aadhaar & Ration Card', 'Doctor / VAO Report'],
      icon: UserCheck
    },
    {
      id: 'legal-heir-certificate',
      title: 'Legal Heir Certificate Application',
      description: 'Official document identifying surviving legal heirs post deceased family member for asset transfer.',
      fee: '₹120',
      sla: '15–30 Working Days',
      docs: ['Death Certificate of Deceased', 'Aadhaar of All Legal Heirs', 'Smart Ration Card', 'VAO / RI Verification'],
      icon: ShieldCheck,
      badge: 'Important'
    },
    {
      id: 'solvency-certificate',
      title: 'Solvency Certificate Application',
      description: 'Financial stability certificate issued by Revenue Dept for contractors, tenders, and bank guarantees.',
      fee: '₹150',
      sla: '15–20 Working Days',
      docs: ['Property Sale Deed / Encumbrance Certificate (EC)', 'Property Valuation Report', 'Aadhaar & PAN'],
      icon: Building
    },
    {
      id: 'unmarried-certificate',
      title: 'Unmarried / Single Status Certificate',
      description: 'Official revenue certificate certifying single/unmarried status for passport, visa & govt job requirements.',
      fee: '₹60',
      sla: '5–7 Working Days',
      docs: ['Aadhaar Card', 'Passport Copy', 'Affidavit executed before Notary', 'VAO Verification'],
      icon: FileText
    }
  ];

  const filtered = certificateServices.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3.5 py-1 rounded-full text-xs font-extrabold">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>REVENUE & E-DISTRICT CERTIFICATE FACILITATION</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Government Certificate Services Catalog
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
                Apply online for Revenue Department Certificates: Income, Community/Caste, Native Domicile, First Graduate, Legal Heir, and Solvency certificates with digital tracking.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 min-w-[240px]">
              <div className="text-[11px] text-blue-200 uppercase font-bold tracking-wider">Revenue Desk Line</div>
              <div className="text-xl font-extrabold text-white mt-0.5">1800-425-1333</div>
              <div className="text-[11px] text-slate-300">Mon - Sat: 9:30 AM to 6:00 PM</div>
            </div>
          </div>

          {/* Search Box */}
          <div className="pt-2">
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search certificates (Income, Community, Native, First Graduate, Legal Heir)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Notice Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-blue-950 shadow-sm">
          <AlertCircle className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-blue-950">Mandatory Verification:</span> Revenue certificates are verified by Village Administrative Officer (VAO) and Revenue Inspector (RI) prior to Tahsildar approval. Ensure all uploaded supporting documents match your Smart Ration Card.
          </div>
        </div>

        {/* Services Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Available Revenue Certificates ({filtered.length})</h2>
            <p className="text-xs text-slate-500">Select a certificate type to open guided application wizard.</p>
          </div>
          <Link
            to="/tracker"
            className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center space-x-1"
          >
            <span>Track Existing Certificate Application</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => {
            const IconComp = service.icon || FileText;
            return (
              <div 
                key={service.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 group-hover:bg-blue-800 group-hover:text-white transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    {service.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        service.badge === 'Educational' ? 'bg-indigo-100 text-indigo-800' :
                        service.badge === 'Essential' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Service Fee:</span>
                      <span className="font-bold text-slate-900">{service.fee}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Estimated Processing SLA:</span>
                      <span className="font-semibold text-slate-700">{service.sla}</span>
                    </div>
                  </div>

                  {/* Documents Checklist */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-700">Mandatory Attachments:</div>
                    <ul className="space-y-1">
                      {service.docs.map((doc, idx) => (
                        <li key={idx} className="text-[11px] text-slate-600 flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span className="truncate">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Apply Action Bar */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/service/${service.id}`}
                    className="text-xs font-bold text-slate-700 hover:text-blue-800 hover:underline"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => navigate(`/apply/${service.id}`)}
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Process Flow */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-blue-800" />
            <span>Revenue Certificate Approval Workflow</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs">1</div>
              <div className="font-bold text-slate-800">Online Submission</div>
              <div className="text-slate-600">Submit details and clear scans of mandatory supporting documents.</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs">2</div>
              <div className="font-bold text-slate-800">VAO & RI Inspection</div>
              <div className="text-slate-600">Village Administrative Officer inspects address & verifies documents.</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs">3</div>
              <div className="font-bold text-slate-800">Tahsildar Digital Sign</div>
              <div className="text-slate-600">Zonal Deputy Tahsildar reviews inspection report & signs digitally.</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs">4</div>
              <div className="font-bold text-slate-800">Download Certificate</div>
              <div className="text-slate-600">Download QR-code verified official certificate PDF with digital stamp.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
