import React, { useState } from 'react';
import { Lead, LeadStatus, NotificationItem } from '../types';
import {
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Building2,
  Beaker,
  Mail,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface CrmPipelineViewProps {
  leads: Lead[];
  onSelectLead: (leadId: string) => void;
  onUpdateLead: (updated: Lead) => void;
  onAddNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
}

const STAGES: { id: LeadStatus; label: string; color: string }[] = [
  { id: 'Scouted', label: '1. Scouted', color: 'border-slate-300' },
  { id: 'Qualified', label: '2. Qualified', color: 'border-blue-400' },
  { id: 'Outreach Sent', label: '3. Outreach Sent', color: 'border-indigo-500' },
  { id: 'Replied', label: '4. In Discussion', color: 'border-amber-500' },
  { id: 'Consultation Booked', label: '5. Meeting Booked', color: 'border-purple-500' },
  { id: 'Proposal Sent', label: '6. Proposal Out', color: 'border-teal-500' },
  { id: 'Won', label: '7. Closed Won', color: 'border-emerald-500' },
];

export const CrmPipelineView: React.FC<CrmPipelineViewProps> = ({
  leads,
  onSelectLead,
  onUpdateLead,
  onAddNotification,
}) => {
  const [filterSector, setFilterSector] = useState<'all' | 'commercial' | 'scientific'>('all');

  const getNextStage = (current: LeadStatus): LeadStatus | null => {
    const order: LeadStatus[] = [
      'Scouted',
      'Qualified',
      'Outreach Sent',
      'Replied',
      'Consultation Booked',
      'Proposal Sent',
      'Won',
    ];
    const idx = order.indexOf(current);
    if (idx !== -1 && idx < order.length - 1) return order[idx + 1];
    return null;
  };

  const getPrevStage = (current: LeadStatus): LeadStatus | null => {
    const order: LeadStatus[] = [
      'Scouted',
      'Qualified',
      'Outreach Sent',
      'Replied',
      'Consultation Booked',
      'Proposal Sent',
      'Won',
    ];
    const idx = order.indexOf(current);
    if (idx > 0) return order[idx - 1];
    return null;
  };

  const moveStage = (lead: Lead, targetStage: LeadStatus) => {
    const updated: Lead = {
      ...lead,
      status: targetStage,
      lastActivityDate: new Date().toISOString(),
    };
    onUpdateLead(updated);
    onAddNotification({
      title: `CRM Stage Advanced: ${lead.businessName}`,
      message: `Moved to "${targetStage}".`,
      type: targetStage === 'Won' ? 'lead_qualified' : 'status_change',
      leadId: lead.id,
    });
  };

  const filteredLeads = leads.filter(
    (l) => filterSector === 'all' || l.sector === filterSector
  );

  return (
    <div className="space-y-4">
      {/* Header & Sector Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">CRM Conversion Pipeline</h2>
          <p className="text-xs text-slate-500">
            Track web development client opportunities from initial scout to closed contract.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Filter:</span>
          <button
            onClick={() => setFilterSector('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filterSector === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Opportunities
          </button>
          <button
            onClick={() => setFilterSector('commercial')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              filterSector === 'commercial'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3 h-3" />
            Commercial
          </button>
          <button
            onClick={() => setFilterSector('scientific')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              filterSector === 'scientific'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Beaker className="w-3 h-3" />
            Science & Biotech
          </button>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Container */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1250px]">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.id);
            const stageValue = stageLeads.reduce((acc, l) => acc + l.dealValue, 0);

            return (
              <div
                key={stage.id}
                className="w-72 shrink-0 bg-slate-100/70 rounded-xl p-3 flex flex-col border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all animate-slide-up"
              >
                {/* Column Header */}
                <div className={`border-t-2 ${stage.color} pt-2 mb-3 flex items-start justify-between`}>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{stage.label}</h3>
                    <div className="text-[11px] font-mono text-emerald-700 font-semibold mt-0.5">
                      ${stageValue.toLocaleString()}
                    </div>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-white text-slate-700 text-[11px] font-bold flex items-center justify-center border border-slate-200 shadow-2xs">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Column Lead Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[68vh] pr-0.5">
                  {stageLeads.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs italic">
                      No leads in this stage
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const next = getNextStage(lead.status);
                      const prev = getPrevStage(lead.status);

                      return (
                        <div
                          key={lead.id}
                          className="card-hover bg-white rounded-lg p-3 border border-slate-200 shadow-2xs hover:shadow-lg hover:border-indigo-300 transition-all group flex flex-col justify-between animate-slide-up"
                        >
                          <div
                            onClick={() => onSelectLead(lead.id)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                  lead.sector === 'scientific'
                                    ? 'bg-teal-50 text-teal-700'
                                    : 'bg-indigo-50 text-indigo-700'
                                }`}
                              >
                                {lead.sector === 'scientific' ? 'Science' : 'Commercial'}
                              </span>

                              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-700">
                                <Flame className="w-3 h-3 text-rose-500" />
                                {lead.leadScore}
                              </div>
                            </div>

                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                              {lead.businessName}
                            </h4>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">
                              {lead.contactName} • {lead.country}
                            </p>

                            <div className="mt-2 text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-1.5 rounded border border-slate-100">
                              {lead.painPoints[0]}
                            </div>
                          </div>

                          {/* Card Footer: Deal Value & Move Controls */}
                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-mono font-bold text-emerald-700 text-[11px]">
                              ${lead.dealValue.toLocaleString()}
                            </span>

                            <div className="flex items-center gap-1">
                              {prev && (
                                <button
                                  onClick={() => moveStage(lead, prev)}
                                  title={`Move back to ${prev}`}
                                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {next && (
                                <button
                                  onClick={() => moveStage(lead, next)}
                                  title={`Advance to ${next}`}
                                  className="p-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold transition-colors flex items-center gap-0.5 cursor-pointer text-[10px]"
                                >
                                  <span>Next</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
