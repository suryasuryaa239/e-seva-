import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Careers() {
  const { addToast } = useToast();
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('Senior Full Stack Developer');
  const [experience, setExperience] = useState('3-5 Years');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant_name: applicantName,
          email,
          phone,
          position,
          experience
        })
      });
      if (res.ok) {
        addToast('Application submitted! Our HR team will reach out.', 'success');
        setApplicantName('');
        setEmail('');
        setPhone('');
      } else {
        addToast('Failed to submit career application', 'error');
      }
    } catch (e) {
      addToast('Server error', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const positions = [
    { title: 'Senior Full Stack Developer', dept: 'Digital Products', type: 'Full Time', location: 'New Delhi / Remote' },
    { title: 'e-Governance Operations Officer', dept: 'Public Delivery', type: 'Full Time', location: 'Chennai / On-site' },
    { title: 'UI/UX Government Specialist', dept: 'Design Division', type: 'Full Time', location: 'Bengaluru / Remote' },
    { title: 'Cybersecurity Audit Lead', dept: 'InfoSec Division', type: 'Full Time', location: 'New Delhi' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Careers & Recruitment' }]} />

      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
          Join Digital India Workforce
        </span>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mt-3">
          Careers at E-Seva Governance Portal
        </h1>
        <p className="text-slate-300 text-sm mt-2 max-w-2xl">
          Build next-generation digital public infrastructure serving millions of citizens daily across the nation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Open Positions List */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-heading font-bold text-xl text-slate-900">Current Open Positions</h2>
          {positions.map((p, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">{p.title}</h3>
                  <span className="text-xs text-indigo-600 font-semibold">{p.dept}</span>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
                  {p.type}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {p.location}</span>
              </div>
              <button
                onClick={() => setPosition(p.title)}
                className="bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold text-xs py-2 px-4 rounded-xl transition-colors self-start"
              >
                Apply For Position →
              </button>
            </div>
          ))}
        </div>

        {/* Quick Job Application Form */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-heading font-bold text-xl text-slate-900">Apply Online</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Target Position</label>
              <input
                type="text"
                readOnly
                value={position}
                className="w-full bg-slate-100 font-bold text-indigo-950 text-xs rounded-xl px-4 py-3 border border-slate-200 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Applicant name"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-4 py-3 border border-slate-200 outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-4 py-3 border border-slate-200 outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Phone *</label>
              <input
                type="text"
                required
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-4 py-3 border border-slate-200 outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Years of Experience</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-4 py-3 border border-slate-200 outline-none focus:bg-white"
              >
                <option value="0-1 Years">0-1 Years (Entry)</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="5+ Years">5+ Years (Senior)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting Application...' : 'Submit Job Application'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
