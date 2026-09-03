import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Clock, FileCheck, Shield, ArrowRight, Grid, AlertCircle, Filter } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ServicesDirectory() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/services').then((r) => r.json())
    ])
      .then(([catData, srvData]) => {
        setCategories(catData);
        setServices(srvData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredServices = services.filter((srv) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesCategory =
      selectedCategory === 'All' ||
      srv.category_slug === selectedCategory ||
      srv.category_name.toLowerCase() === selectedCategory.toLowerCase();

    if (!q) return matchesCategory;

    const matchesSearch =
      srv.name.toLowerCase().includes(q) ||
      srv.category_name.toLowerCase().includes(q) ||
      (srv.description && srv.description.toLowerCase().includes(q)) ||
      (srv.eligibility && srv.eligibility.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Services Directory' }]} />

      {/* Directory Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
            Official E-Governance Service Directory
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mt-2">
            Explore All Digital Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
            Select a category or search for Aadhaar updates, PAN Card, Voter ID, Revenue Certificates, Patta Transfers, and Passports.
          </p>
        </div>

        {/* Quick Search Box */}
        <div className="pt-2">
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search for a service (e.g., Aadhaar Address Update, PAN Card, Income Certificate)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-white placeholder-slate-400 text-sm rounded-2xl pl-11 pr-4 py-3.5 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950 outline-none transition-all shadow-inner"
            />
            <Search className="w-5 h-5 text-indigo-400 absolute left-3.5 top-4" />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 shrink-0 mr-2">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
            selectedCategory === 'All'
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Categories ({services.length})
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
              selectedCategory === cat.slug
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sub-Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 bg-slate-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-100">
                    {srv.category_name}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {srv.fee > 0 ? `₹${srv.fee}` : 'FREE'}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {srv.name}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {srv.description}
                </p>

                <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                    <Clock className="w-3 h-3 text-amber-500" /> SLA: {srv.processing_time || '3-5 Days'}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                    <FileCheck className="w-3 h-3 text-emerald-600" /> Proof Docs Required
                  </span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/service/${srv.slug}`}
                  className="text-xs font-semibold text-slate-700 hover:text-indigo-600"
                >
                  View Details
                </Link>

                <Link
                  to={`/service/${srv.slug}`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow flex items-center gap-1.5"
                >
                  Apply Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-lg text-slate-800">No matching services found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search keyword or selected category filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="inline-block bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
