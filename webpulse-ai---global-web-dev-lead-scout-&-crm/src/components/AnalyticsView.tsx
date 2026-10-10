import React, { useState } from 'react';
import { Lead } from '../types';
import {
  BarChart3,
  TrendingUp,
  Download,
  Copy,
  Check,
  Building2,
  Beaker,
  DollarSign,
  Users,
  Target,
  Send,
  Calendar,
  FileText,
} from 'lucide-react';

interface AnalyticsViewProps {
  leads: Lead[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ leads }) => {
  const [copiedReport, setCopiedReport] = useState(false);

  const total = leads.length;
  const contacted = leads.filter((l) => l.outreachHistory?.length > 0).length;
  const replied = leads.filter(
    (l) => l.status === 'Replied' || l.status === 'Consultation Booked' || l.status === 'Proposal Sent' || l.status === 'Won'
  ).length;
  const meetings = leads.filter((l) => (l.calendarMeetings?.length || 0) > 0 || l.status === 'Consultation Booked' || l.status === 'Won').length;
  const won = leads.filter((l) => l.status === 'Won').length;

  const totalValue = leads.reduce((acc, l) => acc + l.dealValue, 0);
  const wonValue = leads
    .filter((l) => l.status === 'Won')
    .reduce((acc, l) => acc + l.dealValue, 0);

  const commercialLeads = leads.filter((l) => l.sector === 'commercial');
  const scienceLeads = leads.filter((l) => l.sector === 'scientific');

  const commercialAvgDeal = Math.round(
    commercialLeads.reduce((acc, l) => acc + l.dealValue, 0) / (commercialLeads.length || 1)
  );
  const scienceAvgDeal = Math.round(
    scienceLeads.reduce((acc, l) => acc + l.dealValue, 0) / (scienceLeads.length || 1)
  );

  // Generate Executive Pipeline Report Text
  const generateReportMarkdown = () => {
    return `# WebPulse AI — Executive Lead Generation & Pipeline Report
Generated: ${new Date().toLocaleDateString()} | Agency Performance Summary

## 1. Executive Summary
- Total Qualified Prospects: ${total}
- Commercial Small Businesses: ${commercialLeads.length}
- Scientific & Biotech Labs: ${scienceLeads.length}
- Total Active Pipeline Value: $${totalValue.toLocaleString()}
- Closed Revenue (Won): $${wonValue.toLocaleString()}

## 2. Sales Conversion Funnel
- 1. Scouted / In Database: ${total} leads (100%)
- 2. Outreach Dispatched (Gmail): ${contacted} leads (${Math.round((contacted / (total || 1)) * 100)}%)
- 3. In Active Discussion: ${replied} leads (${Math.round((replied / (contacted || 1)) * 100)}% of contacted)
- 4. Consultations Booked (Google Calendar): ${meetings} discovery calls
- 5. Closed Won Contracts: ${won} deals

## 3. Sector Breakdown & Deal Economics
- Commercial SMBs:
  - Average Deal Size: $${commercialAvgDeal.toLocaleString()}
  - Top Pain Points: Lack of mobile booking, slow mobile rendering, broken Instagram bio links.
- Scientific & Biotech Research Hubs:
  - Average Deal Size: $${scienceAvgDeal.toLocaleString()}
  - Top Pain Points: No patient recruitment portal for clinical trials, plain-text faculty directory, absence of interactive molecular/data viewers.

## 4. Recommended Next Actions
1. Follow up on 3 urgent leads scoring above 90 with free Figma mockups.
2. Continue leveraging OpenAlex scientific index for high-ticket ($14k+) clinical trial portals.
3. Sync Google Calendar discovery call slots for upcoming week.
`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateReportMarkdown());
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Analytics KPI Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Performance & Conversion Analytics</h2>
          <p className="text-xs text-slate-500">
            Real-time tracking of lead qualification rates, outreach efficiency, and pipeline velocity.
          </p>
        </div>

        <button
          onClick={handleCopyReport}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {copiedReport ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Report Copied!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Export Executive Report</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Conversion Funnel */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
          Agency Lead Conversion Funnel
        </h3>

        <div className="space-y-3 text-xs">
          {/* Stage 1 */}
          <div>
            <div className="flex items-center justify-between mb-1 font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                1. Scouted & Qualified
              </span>
              <span className="font-mono">{total} leads (100%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full w-full" />
            </div>
          </div>

          {/* Stage 2 */}
          <div>
            <div className="flex items-center justify-between mb-1 font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-blue-600" />
                2. Personalized Outreach Sent (Gmail)
              </span>
              <span className="font-mono">
                {contacted} leads ({Math.round((contacted / (total || 1)) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{ width: `${Math.round((contacted / (total || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Stage 3 */}
          <div>
            <div className="flex items-center justify-between mb-1 font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-600" />
                3. Prospect Replied / In Discussion
              </span>
              <span className="font-mono">
                {replied} leads ({Math.round((replied / (total || 1)) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{ width: `${Math.max(12, Math.round((replied / (total || 1)) * 100))}%` }}
              />
            </div>
          </div>

          {/* Stage 4 */}
          <div>
            <div className="flex items-center justify-between mb-1 font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                4. Discovery Consultation Booked (Google Cal)
              </span>
              <span className="font-mono">
                {meetings} meetings ({Math.round((meetings / (total || 1)) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all"
                style={{ width: `${Math.max(8, Math.round((meetings / (total || 1)) * 100))}%` }}
              />
            </div>
          </div>

          {/* Stage 5 */}
          <div>
            <div className="flex items-center justify-between mb-1 font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                5. Closed Won Contracts
              </span>
              <span className="font-mono text-emerald-700 font-bold">
                {won} deals (${wonValue.toLocaleString()})
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${Math.max(5, Math.round((won / (total || 1)) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sector Economics Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Commercial & SMB Sector
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono text-xs font-bold">
              {commercialLeads.length} leads
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block">Avg Project Size</span>
              <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
                ${commercialAvgDeal.toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block">Sales Cycle</span>
              <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
                7 - 14 Days
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            High volume, rapid closing cycles. Focus pitches on immediate online booking capture, mobile responsiveness, and turning Instagram traffic into customers.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Beaker className="w-4 h-4 text-teal-600" />
              Scientific, Clinical & Biotech Sector
            </span>
            <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-mono text-xs font-bold">
              {scienceLeads.length} leads
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block">Avg Project Size</span>
              <span className="text-base font-bold text-teal-900 font-mono mt-0.5 block">
                ${scienceAvgDeal.toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block">Sales Cycle</span>
              <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
                14 - 30 Days
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            High ticket sizes backed by NIH/EU grant funding or venture capital. Focus pitches on digital clinical trial patient intake and interactive molecular/genomic publication portals.
          </p>
        </div>
      </div>

      {/* Executive Report Preview Box */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-5 shadow-xl border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Executive Report Preview
            </h3>
          </div>
          <button
            onClick={handleCopyReport}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Full Markdown</span>
          </button>
        </div>

        <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-64 border border-slate-800">
          {generateReportMarkdown()}
        </pre>
      </div>
    </div>
  );
};
