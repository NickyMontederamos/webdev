import React, { useState } from 'react';
import {
  Lead,
  LeadStatus,
  OutreachTemplate,
  NotificationItem,
} from '../types';
import { initialTemplates } from '../data/outreachTemplates';
import {
  X,
  ExternalLink,
  Mail,
  Calendar,
  Globe,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Clock,
  DollarSign,
  Send,
  FileEdit,
  Video,
  ChevronRight,
  TrendingUp,
  FileText,
  Building2,
  Beaker,
  ShieldAlert,
} from 'lucide-react';
import { sendGmailMessage, createGmailDraft } from '../services/gmail';
import { createGoogleCalendarEvent } from '../services/calendar';
import { ConfirmationModal } from './ConfirmationModal';
import { User } from 'firebase/auth';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLead: (updated: Lead) => void;
  googleUser: User | null;
  hasGoogleToken: boolean;
  onGoogleSignIn: () => void;
  onAddNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdateLead,
  googleUser,
  hasGoogleToken,
  onGoogleSignIn,
  onAddNotification,
}) => {
  if (!isOpen || !lead) return null;

  const [activeTab, setActiveTab] = useState<'audit' | 'outreach' | 'calendar' | 'timeline'>('audit');

  // AI Diagnostic State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Outreach State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    lead.sector === 'scientific' ? 'tmpl-science-biotech' : 'tmpl-free-audit'
  );
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isGeneratingAiPitch, setIsGeneratingAiPitch] = useState(false);
  const [selectedAngle, setSelectedAngle] = useState('Value-First Free Audit');

  // Calendar State
  const [meetingDate, setMeetingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    d.setHours(14, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [meetingDuration, setMeetingDuration] = useState<number>(30);
  const [meetingTitle, setMeetingTitle] = useState(
    `WebPulse Consultation: ${lead.businessName} Website Redesign`
  );
  const [meetingDescription, setMeetingDescription] = useState(
    `Discovery call to review digital conversion bottlenecks and proposed modern web architecture for ${lead.businessName}.`
  );

  // Notes state
  const [newNote, setNewNote] = useState('');

  // Confirmation Modal State (Mandatory for Workspace operations)
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: 'gmail_send' | 'gmail_draft' | 'calendar_create';
    itemDetails: { label: string; value: string }[];
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    actionType: 'gmail_send',
    itemDetails: [],
    onConfirm: async () => {},
  });
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Initialize or populate email fields from template
  React.useEffect(() => {
    const tmpl = initialTemplates.find((t) => t.id === selectedTemplateId) || initialTemplates[0];
    const sub = tmpl.subject
      .replace(/{{businessName}}/g, lead.businessName)
      .replace(/{{socialFollowers}}/g, lead.socialChannels?.[0]?.followers || '10k+');
    const body = tmpl.body
      .replace(/{{contactName}}/g, lead.contactName)
      .replace(/{{businessName}}/g, lead.businessName)
      .replace(/{{websiteUrl}}/g, lead.websiteUrl)
      .replace(/{{industry}}/g, lead.industry)
      .replace(/{{detectedIssue1}}/g, lead.painPoints[0] || 'Mobile rendering bottlenecks')
      .replace(/{{detectedIssue2}}/g, lead.painPoints[1] || 'Missing online booking engine')
      .replace(/{{senderName}}/g, googleUser?.displayName || 'Alex Chen, Lead Web Architect');

    setEmailSubject(sub);
    setEmailBody(body);
  }, [selectedTemplateId, lead, googleUser]);

  // Handle AI Website Deep Audit
  const handleRunAiAudit = async () => {
    setIsAnalyzing(true);
    setAiError(null);
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: lead.businessName,
          websiteUrl: lead.websiteUrl,
          industry: lead.industry,
          socialNotes: lead.socialActivity,
          detectedIssues: lead.painPoints,
          country: lead.country,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to run AI analysis');
      }

      const data = await res.json();
      const updated: Lead = {
        ...lead,
        aiAudit: {
          summary: data.summary,
          criticalIssues: data.criticalIssues || [],
          redesignOpportunities: data.redesignOpportunities || [],
          recommendedBudget: data.recommendedBudget || lead.estimatedBudget,
          urgencyScore: data.urgencyScore || lead.leadScore,
          auditedAt: new Date().toISOString(),
        },
        lastActivityDate: new Date().toISOString(),
      };
      onUpdateLead(updated);
      onAddNotification({
        title: `AI Audit Complete: ${lead.businessName}`,
        message: `Generated deep diagnostic: ${data.criticalIssues?.length || 3} critical conversion issues identified.`,
        type: 'lead_qualified',
        leadId: lead.id,
      });
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Error executing AI audit');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle AI Custom Pitch Generation
  const handleGenerateAiPitch = async () => {
    setIsGeneratingAiPitch(true);
    try {
      const res = await fetch('/api/gemini/generate-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead,
          angle: selectedAngle,
          senderName: googleUser?.displayName || 'Alex Chen',
          agencyName: 'WebPulse Digital',
        }),
      });

      if (!res.ok) throw new Error('Failed to generate pitch');
      const data = await res.json();
      if (data.subject) setEmailSubject(data.subject);
      if (data.body) setEmailBody(data.body);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsGeneratingAiPitch(false);
    }
  };

  // Trigger Send via Gmail with Confirmation
  const promptSendGmail = () => {
    if (!hasGoogleToken) {
      onGoogleSignIn();
      return;
    }

    setConfirmConfig({
      isOpen: true,
      title: 'Send Outreach Email via Gmail',
      description: `You are about to send a personalized web development outreach email directly from your Gmail account (${googleUser?.email}) to ${lead.contactName} at ${lead.businessName}.`,
      actionType: 'gmail_send',
      itemDetails: [
        { label: 'Recipient', value: `${lead.contactName} <${lead.contactEmail}>` },
        { label: 'Subject', value: emailSubject },
        { label: 'Business', value: lead.businessName },
      ],
      onConfirm: async () => {
        setIsProcessingAction(true);
        try {
          const result = await sendGmailMessage({
            to: lead.contactEmail,
            subject: emailSubject,
            body: emailBody,
          });

          if (result.success) {
            const updatedOutreach = [
              ...(lead.outreachHistory || []),
              {
                id: `out-${Date.now()}`,
                date: new Date().toISOString(),
                subject: emailSubject,
                body: emailBody,
                method: 'Gmail' as const,
                status: 'Sent' as const,
              },
            ];

            const updatedLead: Lead = {
              ...lead,
              status: lead.status === 'Scouted' || lead.status === 'Qualified' ? 'Outreach Sent' : lead.status,
              outreachHistory: updatedOutreach,
              lastActivityDate: new Date().toISOString(),
            };

            onUpdateLead(updatedLead);
            setActionSuccessMessage(`Successfully sent outreach email to ${lead.contactEmail} via Gmail!`);
            onAddNotification({
              title: `Outreach Sent: ${lead.businessName}`,
              message: `Email "${emailSubject}" delivered via Gmail to ${lead.contactEmail}.`,
              type: 'email_sent',
              leadId: lead.id,
            });
            setTimeout(() => setActionSuccessMessage(null), 5000);
          }
        } catch (err: any) {
          alert(`Error sending email: ${err.message}`);
        } finally {
          setIsProcessingAction(false);
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Trigger Create Draft with Confirmation
  const promptCreateDraft = () => {
    if (!hasGoogleToken) {
      onGoogleSignIn();
      return;
    }

    setConfirmConfig({
      isOpen: true,
      title: 'Save Outreach as Gmail Draft',
      description: `Create an outreach draft in your Gmail account so you can review and polish before sending.`,
      actionType: 'gmail_draft',
      itemDetails: [
        { label: 'To', value: lead.contactEmail },
        { label: 'Subject', value: emailSubject },
      ],
      onConfirm: async () => {
        setIsProcessingAction(true);
        try {
          const res = await createGmailDraft({
            to: lead.contactEmail,
            subject: emailSubject,
            body: emailBody,
          });
          if (res.success) {
            setActionSuccessMessage(`Draft saved in your Gmail account.`);
            setTimeout(() => setActionSuccessMessage(null), 4000);
          }
        } catch (err: any) {
          alert(`Error saving draft: ${err.message}`);
        } finally {
          setIsProcessingAction(false);
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Trigger Book Google Calendar Consultation with Confirmation
  const promptScheduleCalendar = () => {
    if (!hasGoogleToken) {
      onGoogleSignIn();
      return;
    }

    const startDate = new Date(meetingDate);
    const endDate = new Date(startDate.getTime() + meetingDuration * 60000);

    setConfirmConfig({
      isOpen: true,
      title: 'Schedule Consultation on Google Calendar',
      description: `Create a discovery meeting on your Google Calendar (${googleUser?.email}) with video conferencing for ${lead.businessName}.`,
      actionType: 'calendar_create',
      itemDetails: [
        { label: 'Meeting Title', value: meetingTitle },
        { label: 'Start Time', value: startDate.toLocaleString() },
        { label: 'Duration', value: `${meetingDuration} minutes` },
        { label: 'Client Attendee', value: lead.contactEmail },
      ],
      onConfirm: async () => {
        setIsProcessingAction(true);
        try {
          const res = await createGoogleCalendarEvent({
            summary: meetingTitle,
            description: `${meetingDescription}\n\nClient: ${lead.contactName}\nWebsite: ${lead.websiteUrl}`,
            startDateTime: startDate.toISOString(),
            endDateTime: endDate.toISOString(),
            attendeeEmail: lead.contactEmail,
          });

          if (res.success) {
            const updatedMeetings = [
              ...(lead.calendarMeetings || []),
              {
                id: `meet-${Date.now()}`,
                title: meetingTitle,
                startTime: startDate.toISOString(),
                durationMinutes: meetingDuration,
                meetLink: res.hangoutLink || res.htmlLink,
                calendarEventId: res.eventId,
              },
            ];

            const updatedLead: Lead = {
              ...lead,
              status: 'Consultation Booked',
              calendarMeetings: updatedMeetings,
              lastActivityDate: new Date().toISOString(),
            };

            onUpdateLead(updatedLead);
            setActionSuccessMessage(`Google Calendar event booked and video link generated!`);
            onAddNotification({
              title: `Consultation Booked: ${lead.businessName}`,
              message: `Calendar event scheduled for ${startDate.toLocaleDateString()} at ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
              type: 'calendar_booked',
              leadId: lead.id,
            });
            setTimeout(() => setActionSuccessMessage(null), 5000);
          }
        } catch (err: any) {
          alert(`Error creating calendar event: ${err.message}`);
        } finally {
          setIsProcessingAction(false);
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Add Note
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const notes = lead.notes || [];
    const timestamp = new Date().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const updated: Lead = {
      ...lead,
      notes: [`[${timestamp}] ${newNote.trim()}`, ...notes],
      lastActivityDate: new Date().toISOString(),
    };
    onUpdateLead(updated);
    setNewNote('');
  };

  // Update Status
  const handleStatusChange = (newStatus: LeadStatus) => {
    const updated: Lead = {
      ...lead,
      status: newStatus,
      lastActivityDate: new Date().toISOString(),
    };
    onUpdateLead(updated);
    onAddNotification({
      title: `Status Updated: ${lead.businessName}`,
      message: `Lead transitioned to stage "${newStatus}".`,
      type: 'status_change',
      leadId: lead.id,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
          {/* Header Banner */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 ${
                    lead.sector === 'scientific'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  {lead.sector === 'scientific' ? (
                    <>
                      <Beaker className="w-3 h-3" /> Science & Biotech
                    </>
                  ) : (
                    <>
                      <Building2 className="w-3 h-3" /> Commercial Business
                    </>
                  )}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {lead.industry} • {lead.city ? `${lead.city}, ` : ''}{lead.country}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white truncate">
                {lead.businessName}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-300">
                <span className="font-medium">
                  Contact: <strong className="text-white">{lead.contactName}</strong> ({lead.contactEmail})
                </span>
                <a
                  href={lead.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[200px]">{lead.websiteUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Lead Urgency Badge */}
              <div className="text-right">
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {lead.leadScore}
                  <span className="text-xs text-slate-400 font-normal">/100</span>
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Web Need Urgency</div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Actions & Status Strip */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-500">Pipeline Stage:</span>
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800 shadow-2xs focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Scouted">Scouted</option>
                <option value="Qualified">Qualified</option>
                <option value="Outreach Sent">Outreach Sent</option>
                <option value="Replied">Replied</option>
                <option value="Consultation Booked">Consultation Booked</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Won">Won (Deal Closed)</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div className="flex items-center gap-4 text-slate-600">
              <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <DollarSign className="w-3.5 h-3.5" /> Est. Deal: ${lead.dealValue.toLocaleString()}
              </span>
              <span className="text-slate-400">Budget: {lead.estimatedBudget}</span>
            </div>
          </div>

          {/* Success Banner */}
          {actionSuccessMessage && (
            <div className="mx-6 mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="px-6 border-b border-slate-200 flex gap-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('audit')}
              className={`py-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'audit'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Website & Social Audit</span>
            </button>
            <button
              onClick={() => setActiveTab('outreach')}
              className={`py-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'outreach'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Gmail Outreach</span>
              {lead.outreachHistory?.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 text-[10px] flex items-center justify-center font-bold">
                  {lead.outreachHistory.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`py-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'calendar'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar Booking</span>
              {lead.calendarMeetings?.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] flex items-center justify-center font-bold">
                  {lead.calendarMeetings.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'timeline'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Notes & Timeline</span>
            </button>
          </div>

          {/* Modal Tab Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* TAB 1: WEBSITE & SOCIAL AUDIT */}
            {activeTab === 'audit' && (
              <div className="space-y-6">
                {/* Diagnostic Indicators */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    Detected Digital Conversion Leaks & Pain Points
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50">
                      <div className="text-[11px] font-semibold text-rose-700 uppercase">Mobile Usability</div>
                      <div className="text-sm font-bold text-rose-900 mt-1">Severe Friction Detected</div>
                      <p className="text-xs text-rose-800/80 mt-1">High bounce rate on smartphone viewports.</p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50">
                      <div className="text-[11px] font-semibold text-amber-700 uppercase">Lead Capture / Booking</div>
                      <div className="text-sm font-bold text-amber-900 mt-1">Missing Digital Intake</div>
                      <p className="text-xs text-amber-800/80 mt-1">Requires manual phone call or static email.</p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50">
                      <div className="text-[11px] font-semibold text-blue-700 uppercase">Speed & Modern Stack</div>
                      <div className="text-sm font-bold text-blue-900 mt-1">Legacy CMS / Outdated</div>
                      <p className="text-xs text-blue-800/80 mt-1">Needs fast Next.js / React rebuild.</p>
                    </div>
                  </div>

                  <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-semibold text-slate-700">Specific Detected Issues:</span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {lead.painPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Social Media Activity Context */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-indigo-600" />
                    Public Business Listing & Social Activity
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {lead.socialActivity}
                  </p>

                  {lead.socialChannels && lead.socialChannels.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {lead.socialChannels.map((c, idx) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-lg text-xs flex items-center gap-1.5 text-indigo-900"
                        >
                          <span className="font-semibold">{c.platform}:</span>
                          <span>{c.handle}</span>
                          {c.followers && <span className="text-indigo-600 font-mono">({c.followers})</span>}
                          <span className="text-[10px] text-slate-400">• {c.activeStatus}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {lead.doi && (
                    <div className="mt-2 text-xs text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 flex items-center gap-1.5">
                      <Beaker className="w-3.5 h-3.5" />
                      <span>Scientific Publication DOI: <strong>{lead.doi}</strong></span>
                    </div>
                  )}
                </div>

                {/* AI Deep Website Diagnostic */}
                <div className="p-4 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <h3 className="text-sm font-bold text-slate-900">Gemini AI Website Diagnostic</h3>
                    </div>
                    <button
                      onClick={handleRunAiAudit}
                      disabled={isAnalyzing}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Diagnosing Site...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{lead.aiAudit ? 'Re-Run AI Diagnosis' : 'Run Full AI Diagnostic'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {aiError && (
                    <div className="p-3 mb-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                      {aiError}
                    </div>
                  )}

                  {lead.aiAudit ? (
                    <div className="space-y-3 animate-in fade-in">
                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
                        <strong className="text-slate-900 block mb-1">Executive Assessment:</strong>
                        {lead.aiAudit.summary}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-white rounded-lg border border-rose-100">
                          <span className="font-bold text-rose-800 block mb-1.5">Critical UX & CRO Issues:</span>
                          <ul className="space-y-1 text-slate-600">
                            {lead.aiAudit.criticalIssues.map((iss, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-rose-500 font-bold">•</span>
                                <span>{iss}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-emerald-100">
                          <span className="font-bold text-emerald-800 block mb-1.5">Redesign Opportunities:</span>
                          <ul className="space-y-1 text-slate-600">
                            {lead.aiAudit.redesignOpportunities.map((opp, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-emerald-500 font-bold">✓</span>
                                <span>{opp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                        <span>Recommended Scope: <strong className="text-slate-800">{lead.aiAudit.recommendedBudget}</strong></span>
                        <span>Audited: {new Date(lead.aiAudit.auditedAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      Click "Run Full AI Diagnostic" to generate an executive conversion audit and customized redesign strategy using Gemini.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: AUTOMATED OUTREACH (GMAIL) */}
            {activeTab === 'outreach' && (
              <div className="space-y-5">
                {/* Google Auth Status Alert if not signed in */}
                {!hasGoogleToken && (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Connect your Google Workspace account to send or draft personalized emails directly through Gmail.</span>
                    </div>
                    <button
                      onClick={onGoogleSignIn}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shrink-0 transition-colors"
                    >
                      Connect Gmail
                    </button>
                  </div>
                )}

                {/* Template Selector & AI Pitch Generator */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-700">Outreach Template:</span>
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => setSelectedTemplateId(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:ring-1 focus:ring-indigo-500"
                    >
                      {initialTemplates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.responseRate}% reply rate)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* AI Custom Pitch Button */}
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedAngle}
                      onChange={(e) => setSelectedAngle(e.target.value)}
                      className="px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700"
                    >
                      <option value="Value-First Free Audit">Free Value Audit Angle</option>
                      <option value="Mobile-First Urgent Fix">Mobile Traffic Bleed Angle</option>
                      <option value="Social-to-Web Conversion">Social-to-Web Conversion</option>
                      <option value="Scientific & Biotech Portal">Scientific Research Portal</option>
                      <option value="Direct ROI & Booking Pitch">Direct 1-Click Booking</option>
                    </select>
                    <button
                      onClick={handleGenerateAiPitch}
                      disabled={isGeneratingAiPitch}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      {isGeneratingAiPitch ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>AI Re-Write Pitch</span>
                    </button>
                  </div>
                </div>

                {/* Email Subject & Body Editor */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Subject:
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Email Body:
                      </label>
                      <span className="text-[11px] text-slate-400">
                        Targeting: <strong>{lead.contactName}</strong> ({lead.contactEmail})
                      </span>
                    </div>
                    <textarea
                      rows={9}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                  <div className="text-xs text-slate-500">
                    Sending directly from: <strong className="text-slate-800">{googleUser?.email || 'Your Gmail Account'}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={promptCreateDraft}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Save as Gmail Draft</span>
                    </button>
                    <button
                      onClick={promptSendGmail}
                      className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send via Gmail</span>
                    </button>
                  </div>
                </div>

                {/* Outreach History Log */}
                {lead.outreachHistory && lead.outreachHistory.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Previous Outreach History ({lead.outreachHistory.length})
                    </h4>
                    <div className="space-y-2">
                      {lead.outreachHistory.map((rec) => (
                        <div key={rec.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-800">{rec.subject}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(rec.date).toLocaleDateString()} via {rec.method}
                            </span>
                          </div>
                          <p className="text-slate-600 line-clamp-2">{rec.body}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              Status: {rec.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: CALENDAR BOOKING */}
            {activeTab === 'calendar' && (
              <div className="space-y-5">
                {!hasGoogleToken && (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Connect your Google Workspace account to sync discovery calls with Google Calendar.</span>
                    </div>
                    <button
                      onClick={onGoogleSignIn}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shrink-0 transition-colors"
                    >
                      Connect Calendar
                    </button>
                  </div>
                )}

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    Book Client Consultation / Discovery Session
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Meeting Date & Time:</label>
                      <input
                        type="datetime-local"
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Duration:</label>
                      <select
                        value={meetingDuration}
                        onChange={(e) => setMeetingDuration(parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value={15}>15 Minutes (Quick Alignment)</option>
                        <option value={30}>30 Minutes (Standard Discovery)</option>
                        <option value={45}>45 Minutes (Full Audit Walkthrough)</option>
                        <option value={60}>60 Minutes (Proposal & Architecture)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Meeting Title:</label>
                    <input
                      type="text"
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Agenda / Meeting Notes:</label>
                    <textarea
                      rows={3}
                      value={meetingDescription}
                      onChange={(e) => setMeetingDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-500">
                      Attendee: <strong className="text-slate-800">{lead.contactEmail}</strong>
                    </span>
                    <button
                      onClick={promptScheduleCalendar}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book on Google Calendar</span>
                    </button>
                  </div>
                </div>

                {/* Existing Scheduled Meetings */}
                {lead.calendarMeetings && lead.calendarMeetings.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Upcoming Consultations ({lead.calendarMeetings.length})
                    </h4>
                    <div className="space-y-2">
                      {lead.calendarMeetings.map((m) => (
                        <div
                          key={m.id}
                          className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200 text-xs flex items-center justify-between"
                        >
                          <div>
                            <div className="font-semibold text-emerald-900">{m.title}</div>
                            <div className="text-[11px] text-emerald-700 mt-0.5">
                              {new Date(m.startTime).toLocaleString()} ({m.durationMinutes} min)
                            </div>
                          </div>
                          {m.meetLink && (
                            <a
                              href={m.meetLink}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-emerald-700 transition-colors"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Join Meet</span>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: CRM NOTES & TIMELINE */}
            {activeTab === 'timeline' && (
              <div className="space-y-5">
                {/* Add Note Form */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Add Team Note / Sales Activity:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Spoke to assistant, founder reviewing mockup on Friday..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddNote();
                      }}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleAddNote}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Post Note
                    </button>
                  </div>
                </div>

                {/* Notes List */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Internal Notes ({lead.notes?.length || 0})
                  </h4>
                  {lead.notes && lead.notes.length > 0 ? (
                    <div className="space-y-2">
                      {lead.notes.map((note, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                          {note}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No notes recorded yet.</p>
                  )}
                </div>

                {/* Audit & Lifecycle Milestones */}
                <div className="pt-3 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Milestone Audit Trail
                  </h4>
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
                    <div className="relative">
                      <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-2 ring-white" />
                      <div className="font-semibold text-slate-900">Lead Discovered</div>
                      <div className="text-slate-500 text-[11px]">
                        Scouted from {lead.source} on {new Date(lead.createdDate).toLocaleDateString()}
                      </div>
                    </div>
                    {lead.outreachHistory?.length > 0 && (
                      <div className="relative">
                        <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white" />
                        <div className="font-semibold text-slate-900">First Outreach Dispatched</div>
                        <div className="text-slate-500 text-[11px]">
                          Sent via {lead.outreachHistory[0].method}
                        </div>
                      </div>
                    )}
                    {lead.calendarMeetings?.length > 0 && (
                      <div className="relative">
                        <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-white" />
                        <div className="font-semibold text-slate-900">Consultation Scheduled</div>
                        <div className="text-slate-500 text-[11px]">
                          Google Calendar booking confirmed
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mandatory Google Workspace User Confirmation Dialog */}
      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        description={confirmConfig.description}
        actionType={confirmConfig.actionType}
        itemDetails={confirmConfig.itemDetails}
        confirmLabel="Confirm & Execute"
        cancelLabel="Cancel"
        isProcessing={isProcessingAction}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};
