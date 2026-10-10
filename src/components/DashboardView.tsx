import React from 'react';
import { Lead } from '../types';
import {
  Users,
  Target,
  Send,
  Calendar,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Beaker,
  Building2,
  AlertTriangle,
  Globe2,
  CheckCircle2,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface DashboardViewProps {
  leads: Lead[];
  onSelectLead: (leadId: string) => void;
  onNavigateTab: (tab: 'scout' | 'pipeline' | 'outreach' | 'analytics') => void;
  onGoogleSignIn: () => void;
  hasGoogleToken: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  onSelectLead,
  onNavigateTab,
  onGoogleSignIn,
  hasGoogleToken,
}) => {
  const totalLeads = leads.length;
  const avgScore = Math.round(
    leads.reduce((acc, l) => acc + l.leadScore, 0) / (totalLeads || 1)
  );

  const outreachCount = leads.filter(
    (l) => l.outreachHistory && l.outreachHistory.length > 0
  ).length;

  const meetingsCount = leads.reduce(
    (acc, l) => acc + (l.calendarMeetings?.length || 0),
    0
  );

  const pipelineValue = leads
    .filter((l) => l.status !== 'Lost')
    .reduce((acc, l) => acc + l.dealValue, 0);

  const closedWonValue = leads
    .filter((l) => l.status === 'Won')
    .reduce((acc, l) => acc + l.dealValue, 0);

  // High Urgency leads (Score >= 90)
  const urgentLeads = leads
    .filter((l) => l.leadScore >= 90)
    .sort((a, b) => b.leadScore - a.leadScore)
    .slice(0, 4);

  // Commercial vs Scientific breakdown
  const commercialCount = leads.filter((l) => l.sector === 'commercial').length;
  const scienceCount = leads.filter((l) => l.sector === 'scientific').length;

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Workspace Connection Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Global Web Development Lead Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Convert Businesses & Research Labs Needing Modern Websites
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Scout public business registries, social media activity, and scientific publication indices. Diagnose website bottlenecks with Gemini AI and dispatch personalized Gmail outreach with synced Calendar consultations.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('scout')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Globe2 className="w-4 h-4" />
              <span>Launch Lead Scout</span>
            </button>
            <button
              onClick={() => onNavigateTab('pipeline')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Manage CRM Pipeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {!hasGoogleToken && (
              <button
                onClick={onGoogleSignIn}
                className="px-4 py-2 bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Connect Gmail & Calendar</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Leads</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">{totalLeads}</div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
            <span>{commercialCount} commercial, {scienceCount} science</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avg Need Score</span>
            <Target className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
            {avgScore}<span className="text-sm font-normal text-slate-400">/100</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">
            High redesign intent
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Outreach Sent</span>
            <Send className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">{outreachCount}</div>
          <div className="mt-1 text-[11px] text-slate-500">
            via connected Gmail
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Calls Booked</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">{meetingsCount}</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">
            Synced with Google Cal
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pipeline Value</span>
            <DollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
            ${(pipelineValue / 1000).toFixed(1)}k
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">
            ${(closedWonValue / 1000).toFixed(1)}k won deals
          </div>
        </div>
      </div>

      {/* Main Grid: Urgent Radar & Sector Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Action Radar (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Urgent Web Need Radar</h3>
                <p className="text-xs text-slate-500">Top leads with severe mobile/booking conversion leaks</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('scout')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View All Leads</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {urgentLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead.id)}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 truncate">
                      {lead.businessName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        lead.sector === 'scientific'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {lead.sector === 'scientific' ? 'Science' : 'Commercial'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate">
                    {lead.painPoints[0]}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                    <span>{lead.country}</span>
                    <span>•</span>
                    <span>Contact: {lead.contactName}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">${lead.dealValue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-black text-rose-600 font-mono">
                    {lead.leadScore}
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Need Score</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sector Scout Split & Fast Actions (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Target Sectors</h3>
            
            <div className="space-y-3">
              <div
                onClick={() => onNavigateTab('scout')}
                className="p-3 rounded-lg border border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    Commercial & SMB Businesses
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-600">{commercialCount}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Local clinics, law practices, retail, restaurants, architecture firms with outdated sites.
                </p>
              </div>

              <div
                onClick={() => onNavigateTab('scout')}
                className="p-3 rounded-lg border border-teal-100 bg-teal-50/40 hover:bg-teal-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                    <Beaker className="w-3.5 h-3.5 text-teal-600" />
                    Science, Academic & Biotech
                  </span>
                  <span className="text-xs font-mono font-bold text-teal-600">{scienceCount}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Research labs, clinical trial sponsors, and genomics institutes needing interactive portals.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Pipeline Conversion Rate:</span>
              <span className="font-bold text-emerald-600">32.4%</span>
            </div>
          </div>

          {/* Quick Start Tip */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Conversion Pro-Tip</span>
            </div>
            <p className="leading-relaxed">
              Leads with active social accounts (Instagram/LinkedIn) but broken mobile links have a <strong>3x higher reply rate</strong> when you attach a free 3-point conversion audit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
