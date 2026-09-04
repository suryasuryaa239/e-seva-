import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Fingerprint, CreditCard, Vote, FileText, MapPin, Globe,
  Car, Briefcase, Zap, Grid, ArrowRight, Layers
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

const iconMap = {
  Fingerprint, CreditCard, Vote, FileText, MapPin, Globe, Car, Briefcase, Zap, Grid
};

const getCategoryImage = (slug = '') => {
  const s = slug.toLowerCase();
  if (s.includes('aadhaar')) return '/cat_aadhaar.png';
  if (s.includes('pan')) return '/cat_pan.png';
  if (s.includes('voter')) return '/cat_voter.png';
  if (s.includes('certificate')) return '/cat_certificates.png';
  if (s.includes('land')) return '/cat_land.png';
  if (s.includes('passport')) return '/cat_passport.png';
  if (s.includes('driving') || s.includes('vehicle')) return '/cat_driving.png';
  if (s.includes('business')) return '/cat_business.png';
  if (s.includes('utility')) return '/cat_utility.png';
  return '/cat_ration.png';
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Service Categories' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Service Categories Architecture
        </h1>
        <p className="text-slate-600 text-sm mt-2 max-w-3xl">
          Browse official government e-services categorized by department. Each category hosts specialized sub-services with tailored application workflows.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const IconComp = iconMap[cat.icon] || Grid;
            const imgPath = getCategoryImage(cat.slug);
            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-50 to-orange-50/30 border border-slate-200 p-2 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <img src={imgPath} alt={cat.name} className="w-full h-full object-contain drop-shadow-lg" />
                    </div>
                    <span className="text-xs font-bold bg-orange-50 text-orange-700 px-3 py-1 rounded-full border border-orange-100">
                      {cat.services_count || 0} Sub-Services
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  {/* Sample sub-services pills */}
                  {cat.sub_services && cat.sub_services.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {cat.sub_services.slice(0, 3).map((sub) => (
                        <span key={sub.id} className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
                          {sub.name}
                        </span>
                      ))}
                      {cat.sub_services.length > 3 && (
                        <span className="text-[11px] text-indigo-600 font-semibold px-1 py-0.5">
                          +{cat.sub_services.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100">
                  <Link
                    to={`/category/${cat.slug}`}
                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    View All {cat.name} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
