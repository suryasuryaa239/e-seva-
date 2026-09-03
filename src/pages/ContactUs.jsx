import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ContactUs() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        addToast('Message sent! An support ticket has been created.', 'success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        addToast(data.error || 'Failed to send message', 'error');
      }
    } catch (e) {
      addToast('Server error', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Help & Contact Support' }]} />

      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
          Citizen Helpdesk & Support Center
        </h1>
        <p className="text-slate-300 text-sm mt-2">
          Reach out to our official e-Governance technical assistance team for help with application submissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Toll-Free Helpline</h4>
              <p className="text-xs text-slate-500 mt-1">1800-123-ESEVA (37382)</p>
              <p className="text-[11px] text-slate-400">Mon - Sat: 8:00 AM - 8:00 PM</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Official Support Email</h4>
              <p className="text-xs text-slate-500 mt-1">support@eseva.gov.in</p>
              <p className="text-[11px] text-slate-400">Guaranteed 24-hour SLA response</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Central Directorate Office</h4>
              <p className="text-xs text-slate-500 mt-1">
                e-Governance Tower, Block 4, Digital Administrative Complex, New Delhi - 110001
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-heading font-bold text-xl text-slate-900">
            Submit a Technical Inquiry or Feedback
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Karthik Subramanian"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 text-sm rounded-xl px-4 py-3 border border-slate-200 outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 text-sm rounded-xl px-4 py-3 border border-slate-200 outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Phone *</label>
                <input
                  type="text"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 text-sm rounded-xl px-4 py-3 border border-slate-200 outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Subject / Application ID</label>
                <input
                  type="text"
                  placeholder="Issue with PAN card application"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 text-sm rounded-xl px-4 py-3 border border-slate-200 outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Inquiry Details *</label>
              <textarea
                rows={4}
                required
                placeholder="Describe your issue or query..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-50 text-slate-900 text-sm rounded-xl px-4 py-3 border border-slate-200 outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Sending Ticket...' : 'Send Inquiry Message'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
