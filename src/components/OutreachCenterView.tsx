import React, { useState } from 'react';
import { Lead, OutreachTemplate } from '../types';
import { initialTemplates } from '../data/outreachTemplates';
import {
  Send,
  Mail,
  Sparkles,
  TrendingUp,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  Beaker,
  AlertCircle,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface OutreachCenterViewProps {
  leads: Lead[];
  onSelectLead: (leadId: string) => void;
  googleUser: User | null;
  hasGoogleToken: boolean;
  onGoogleSignIn: () => void;
}

export const OutreachCenterView: React.FC<OutreachCenterViewProps> = ({
  leads,
  onSelectLead,
  googleUser,
  hasGoogleToken,
  onGoogleSignIn,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<OutreachTemplate>(
    initialTemplates[0]
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Leads ready for outreach (Scouted or Qualified without sent emails)
  const pendingLeads = leads.filter(
    (l) =>
      (l.status === 'Scouted' || l.status === 'Qualified') &&
      (!l.outreachHistory || l.outreachHistory.length === 0)
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Connected Gmail Account & Deliverability Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Personalized Gmail Outreach Engine</h2>
            <p className="text-xs text-slate-500">
              Emails are dispatched directly through your verified Google Workspace account with RFC 2822 formatting.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasGoogleToken ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Connected: <strong>{googleUser?.email}</strong></span>
            </div>
          ) : (
            <button
              onClick={onGoogleSignIn}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Connect Gmail Account</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates Selector (1 Col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Proven Outreach Templates ({initialTemplates.length})
          </h3>

          <div className="space-y-2">
            {initialTemplates.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                className={`p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                  selectedTemplate.id === t.id
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{t.name}</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                    {t.responseRate}% reply
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1">{t.subject}</div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="capitalize">{t.category}</span>
                  <span>{t.sentCount} sent</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Template Live Preview (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {selectedTemplate.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedTemplate.name}
                </h3>
              </div>

              <button
                onClick={() => handleCopy(selectedTemplate.id, `${selectedTemplate.subject}\n\n${selectedTemplate.body}`)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedId === selectedTemplate.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Template</span>
                  </>
                )}
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject Line Blueprint:
              </label>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-800">
                {selectedTemplate.subject}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Body Copy Blueprint:
              </label>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
                {selectedTemplate.body}
              </div>
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                All variables like <code>&#123;&#123;businessName&#125;&#125;</code> and detected audit pain points are automatically resolved in real-time when sending to any lead.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Outreach Opportunities */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs animate-slide-up">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Leads Ready For Outreach ({pendingLeads.length})
            </h3>
            <p className="text-xs text-slate-500">
              Scouted prospects waiting for personalized pitch dispatch via Gmail.
            </p>
          </div>
        </div>

        {pendingLeads.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs italic">
            All current scouted leads have received initial outreach! Use Lead Scout to find new opportunities.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead.id)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        lead.sector === 'scientific'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {lead.sector === 'scientific' ? 'Science' : 'Commercial'}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-amber-600">
                      Score: {lead.leadScore}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{lead.businessName}</h4>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {lead.contactName} ({lead.contactEmail})
                  </p>
                  <p className="text-[11px] text-rose-700 mt-1 line-clamp-1">
                    {lead.painPoints[0]}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-emerald-700">
                    ${lead.dealValue.toLocaleString()}
                  </span>
                  <span className="text-indigo-600 font-semibold flex items-center gap-1">
                    <span>Dispatch Pitch</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
