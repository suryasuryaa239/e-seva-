import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, Plus, Save, CheckCircle2, Variable, Sparkles } from 'lucide-react';

export default function AdminNotificationTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTpl, setEditingTpl] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/notification-templates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTemplates(data || []);
      }
    } catch (e) {
      console.error(e);
    } fontally: {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    if (!editingTpl) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/notification-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingTpl)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        setEditingTpl(null);
        fetchTemplates();
      }
    } catch (e) {}
  };

  const variables = [
    '{{userName}}', '{{applicationId}}', '{{serviceName}}', 
    '{{status}}', '{{amount}}', '{{transactionId}}', 
    '{{documentName}}', '{{rejectionReason}}', '{{trackUrl}}'
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
              <Link to="/admin" className="hover:text-amber-400">Admin Cockpit</Link>
              <span>/</span>
              <span className="text-amber-400 font-bold">Notification Templates</span>
            </div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" /> Communication Template Management
            </h1>
            <p className="text-xs text-slate-400">Configure email, SMS, and in-app message text with dynamic variable substitution</p>
          </div>

          <Link
            to="/admin"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" /> Back to Cockpit
          </Link>
        </div>

        {saved && (
          <div className="p-4 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold shadow">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Notification template saved & updated in delivery queue!</span>
          </div>
        )}

        {/* Template Variables Legend */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Variable className="w-4 h-4" /> Supported Variable Placeholders
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {variables.map(v => (
              <span key={v} className="bg-slate-950 text-amber-300 font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-800">
                {v}
              </span>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(tpl => (
            <div key={tpl.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm text-white">{tpl.name}</h3>
                  <span className="bg-slate-800 text-amber-400 border border-slate-700 font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {tpl.channel}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                  <p className="text-slate-300 font-bold mb-1">Subject: {tpl.subject}</p>
                  <p className="text-slate-400 leading-snug line-clamp-3">{tpl.message}</p>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs border-t border-slate-800">
                <span className={`text-[10px] font-bold ${tpl.active ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {tpl.active ? '● Active' : '○ Disabled'}
                </span>
                <button
                  onClick={() => setEditingTpl(tpl)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow transition-colors"
                >
                  Edit Template
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal / Form */}
        {editingTpl && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <form onSubmit={handleSaveTemplate} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> Edit Template: {editingTpl.name}
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Template Name</label>
                  <input
                    type="text"
                    value={editingTpl.name}
                    onChange={(e) => setEditingTpl({ ...editingTpl, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email Subject</label>
                  <input
                    type="text"
                    value={editingTpl.subject}
                    onChange={(e) => setEditingTpl({ ...editingTpl, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Message Body (Supports Variables)</label>
                  <textarea
                    rows={4}
                    value={editingTpl.message}
                    onChange={(e) => setEditingTpl({ ...editingTpl, message: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-500 font-mono text-xs"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="tplActive"
                    checked={Boolean(editingTpl.active)}
                    onChange={(e) => setEditingTpl({ ...editingTpl, active: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400 cursor-pointer"
                  />
                  <label htmlFor="tplActive" className="text-slate-300 font-bold cursor-pointer">
                    Enable this template for automated dispatch
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingTpl(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
