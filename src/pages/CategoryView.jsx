import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Fingerprint, CreditCard, Vote, FileText, MapPin, Globe, Car, Briefcase, Zap, Grid,
  Search, ShieldAlert, Clock, FileCheck, ArrowRight, ArrowLeft, Info, Filter, ArrowUpDown
} from 'lucide-react';

const ICON_MAP = {
  Fingerprint, CreditCard, Vote, FileText, MapPin, Globe, Car, Briefcase, Zap, Grid
};

import { DEFAULT_SERVICES_MAP } from '../data/servicesCatalogData';

const OFFLINE_CATEGORIES = {
  'aadhaar': { name: 'Aadhaar Services', slug: 'aadhaar-services', icon: 'Fingerprint', description: 'Assistance for new enrollment, address updates, name corrections, mobile linking, PVC order, and download.' },
  'aadhaar-services': { name: 'Aadhaar Services', slug: 'aadhaar-services', icon: 'Fingerprint', description: 'Assistance for new enrollment, address updates, name corrections, mobile linking, PVC order, and download.' },
  'pan': { name: 'PAN Services', slug: 'pan-services', icon: 'CreditCard', description: 'New PAN Card (Form 49A/49AA), correction in existing PAN, e-PAN download, and PAN-Aadhaar linking assistance.' },
  'pan-services': { name: 'PAN Services', slug: 'pan-services', icon: 'CreditCard', description: 'New PAN Card (Form 49A/49AA), correction in existing PAN, e-PAN download, and PAN-Aadhaar linking assistance.' },
  'voter': { name: 'Voter ID Services', slug: 'voter-id-services', icon: 'Vote', description: 'New voter registration (Form 6), address shift (Form 8), epic download, and corrections.' },
  'voter-id-services': { name: 'Voter ID Services', slug: 'voter-id-services', icon: 'Vote', description: 'New voter registration (Form 6), address shift (Form 8), epic download, and corrections.' },
  'certificates': { name: 'Certificate Services', slug: 'certificates', icon: 'FileText', description: 'Income, Community, Nativity, Residence, First Graduate, and Legal Heir revenue certificates.' },
  'certificate-services': { name: 'Certificate Services', slug: 'certificates', icon: 'FileText', description: 'Income, Community, Nativity, Residence, First Graduate, and Legal Heir revenue certificates.' },
  'land': { name: 'Land & Patta Services', slug: 'land-patta-services', icon: 'MapPin', description: 'Patta/Chitta extraction, Patta transfer, Adangal records, and land document verification assistance.' },
  'land-patta-services': { name: 'Land & Patta Services', slug: 'land-patta-services', icon: 'MapPin', description: 'Patta/Chitta extraction, Patta transfer, Adangal records, and land document verification assistance.' },
  'passport': { name: 'Passport & Travel', slug: 'passport-services', icon: 'Globe', description: 'Fresh passport filing, re-issue, correction, and appointment slot booking assistance.' },
  'passport-services': { name: 'Passport & Travel', slug: 'passport-services', icon: 'Globe', description: 'Fresh passport filing, re-issue, correction, and appointment slot booking assistance.' },
  'driving-licence': { name: 'Vehicle & DL Services', slug: 'driving-vehicle-services', icon: 'Car', description: 'Learner Licence (LLR), Driving Licence renewal, duplicate DL, RC transfer, and FASTag assistance.' },
  'vehicle': { name: 'Vehicle & DL Services', slug: 'driving-vehicle-services', icon: 'Car', description: 'Learner Licence (LLR), Driving Licence renewal, duplicate DL, RC transfer, and FASTag assistance.' },
  'driving-licence-vehicle-services': { name: 'Vehicle & DL Services', slug: 'driving-vehicle-services', icon: 'Car', description: 'Learner Licence (LLR), Driving Licence renewal, duplicate DL, RC transfer, and FASTag assistance.' },
  'business': { name: 'Business Services', slug: 'business-services', icon: 'Briefcase', description: 'Udyam MSME registration, FSSAI Food licence, GST filing, and business documentation.' },
  'business-services': { name: 'Business Services', slug: 'business-services', icon: 'Briefcase', description: 'Udyam MSME registration, FSSAI Food licence, GST filing, and business documentation.' },
  'utility': { name: 'Utility Services', slug: 'utility-services', icon: 'Zap', description: 'Electricity EB new connection application, bill payment assistance, and utility services.' },
  'utility-services': { name: 'Utility Services', slug: 'utility-services', icon: 'Zap', description: 'Electricity EB new connection application, bill payment assistance, and utility services.' },
  'other': { name: 'Ration & Smart Card Services', slug: 'other-services', icon: 'Grid', description: 'General e-Governance digital assistance, Smart Ration card filing, and citizen services.' },
  'other-services': { name: 'Ration & Smart Card Services', slug: 'other-services', icon: 'Grid', description: 'General e-Governance digital assistance, Smart Ration card filing, and citizen services.' }
};

export default function CategoryView() {
  const { category, slug } = useParams();
  const catSlug = (slug || category || 'aadhaar-services').toLowerCase().trim();

  const [categoryData, setCategoryData] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetchCategoryAndServices();
  }, [catSlug]);

  const fetchCategoryAndServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/categories/${catSlug}`);
      if (res.ok) {
        const data = await res.json();
        setCategoryData(data);
        setServices(data.services || []);
      } else {
        // Fallback resolution using OFFLINE_CATEGORIES & DEFAULT_SERVICES_MAP
        const catInfo = OFFLINE_CATEGORIES[catSlug] || {
          name: catSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          slug: catSlug,
          icon: 'Grid',
          description: 'Official digital e-governance service category.'
        };

        const matchingServices = Object.values(DEFAULT_SERVICES_MAP).filter(s => {
          const sCat = (s.category_slug || s.category_name || '').toLowerCase();
          return sCat.includes(catSlug) || catSlug.includes(sCat) || catSlug.split('-')[0] === sCat.split('-')[0];
        });

        setCategoryData(catInfo);
        setServices(matchingServices.length > 0 ? matchingServices : Object.values(DEFAULT_SERVICES_MAP));
      }
    } catch (err) {
      const catInfo = OFFLINE_CATEGORIES[catSlug] || {
        name: catSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        slug: catSlug,
        icon: 'Grid',
        description: 'Official digital e-governance service category.'
      };

      const matchingServices = Object.values(DEFAULT_SERVICES_MAP).filter(s => {
        const sCat = (s.category_slug || s.category_name || '').toLowerCase();
        return sCat.includes(catSlug) || catSlug.includes(sCat) || catSlug.split('-')[0] === sCat.split('-')[0];
      });

      setCategoryData(catInfo);
      setServices(matchingServices.length > 0 ? matchingServices : Object.values(DEFAULT_SERVICES_MAP));
    } finally {
      setLoading(false);
    }
  };

  // Filter & Sort Services
  const filteredServices = services
    .filter(srv => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        srv.name.toLowerCase().includes(q) ||
        srv.description.toLowerCase().includes(q) ||
        srv.slug.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'fee_asc') return a.fee - b.fee;
      if (sortBy === 'fee_desc') return b.fee - a.fee;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const CategoryIcon = categoryData && ICON_MAP[categoryData.icon] ? ICON_MAP[categoryData.icon] : Grid;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-indigo-600">Services</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">{categoryData ? categoryData.name : 'Category'}</span>
        </div>

        {/* NEUTRAL SAFETY / FACILITATION DISCLAIMER NOTICE */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            <span className="font-bold">Notice & Disclaimer: </span>
            This website is a private digital assistance and application facilitation portal. We provide document collection, online form filing, and guidance services to assist citizens. We are <strong>not affiliated with UIDAI, Government of India, or any government department</strong>, and submitting an application here does not directly update government records without official department verification.
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading category services from database...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Info className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Category Not Found</h3>
            <p className="text-slate-600 text-sm">{error}</p>
            <Link to="/services" className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700">
              <ArrowLeft className="w-4 h-4" />
              <span>Browse All Categories</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Category Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold rounded-full">
                  <CategoryIcon className="w-4 h-4" />
                  <span>Category Code #{categoryData.id}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {categoryData.name}
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {categoryData.description}
                </p>
              </div>

              {/* Dynamic Service Count Badge */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-5 text-center flex-shrink-0 min-w-[160px]">
                <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                  {services.length}
                </div>
                <div className="text-xs uppercase font-bold tracking-wider text-slate-300 mt-1">
                  Active Services
                </div>
              </div>
            </div>

            {/* Filter & Search Bar Controls */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Search Within Category */}
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search in ${categoryData.name}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <ArrowUpDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none flex-1 sm:flex-none"
                >
                  <option value="default">Default Order</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="fee_asc">Fee (Low to High)</option>
                  <option value="fee_desc">Fee (High to Low)</option>
                </select>
              </div>

            </div>

            {/* Sub-Service Cards Grid */}
            {filteredServices.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200 space-y-3">
                <Search className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-lg font-bold text-slate-800">No Services Found</h4>
                <p className="text-sm text-slate-500">No sub-service matches your search query "{searchTerm}".</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
                >
                  Clear Search Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((srv) => (
                  <div
                    key={srv.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                  >
                    <div className="p-6 space-y-4">
                      
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {categoryData.name}
                        </span>
                        
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          srv.fee === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {srv.fee === 0 ? 'FREE SERVICE' : `Fee: ₹${srv.fee}`}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1.5">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                          {srv.name}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {srv.description}
                        </p>
                      </div>

                      {/* Meta Pills */}
                      <div className="flex flex-wrap gap-2 pt-2 text-xs">
                        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          <span>SLA: {srv.processing_time || '3-5 Days'}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{srv.required_docs_count || srv.documents_count || 1} Proof Docs</span>
                        </div>
                      </div>

                    </div>

                    {/* Card Action Footer */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                      <Link
                        to={`/service/${srv.slug || srv.id}`}
                        className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        View Details
                      </Link>

                      <Link
                        to={`/apply/${srv.slug || srv.id}`}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-all transform active:scale-95"
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </>
        )}

      </div>
    </div>
  );
}
