export type LeadSector = 'commercial' | 'scientific';

export type LeadStatus =
  | 'Scouted'
  | 'Qualified'
  | 'Outreach Sent'
  | 'Replied'
  | 'Consultation Booked'
  | 'Proposal Sent'
  | 'Won'
  | 'Lost';

export interface SocialChannel {
  platform: 'Instagram' | 'LinkedIn' | 'X/Twitter' | 'Facebook' | 'TikTok';
  handle: string;
  followers?: string;
  activeStatus: string;
}

export interface OutreachRecord {
  id: string;
  date: string;
  subject: string;
  body: string;
  method: 'Gmail' | 'Draft' | 'Manual';
  status: 'Draft' | 'Sent' | 'Delivered' | 'Replied';
}

export interface CalendarMeeting {
  id: string;
  title: string;
  startTime: string;
  durationMinutes: number;
  meetLink?: string;
  calendarEventId?: string;
}

export interface AiWebsiteAudit {
  summary: string;
  criticalIssues: string[];
  redesignOpportunities: string[];
  recommendedBudget: string;
  urgencyScore: number;
  auditedAt: string;
}

export interface Lead {
  id: string;
  businessName: string;
  contactName: string;
  contactEmail: string;
  phone?: string;
  industry: string;
  sector: LeadSector;
  country: string;
  city?: string;
  websiteUrl: string;
  leadScore: number; // 0 - 100
  estimatedBudget: string;
  dealValue: number;
  painPoints: string[];
  socialActivity: string;
  socialChannels?: SocialChannel[];
  status: LeadStatus;
  source: string;
  doi?: string;
  notes?: string[];
  outreachHistory: OutreachRecord[];
  calendarMeetings: CalendarMeeting[];
  aiAudit?: AiWebsiteAudit;
  createdDate: string;
  lastActivityDate: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'lead_qualified' | 'email_sent' | 'calendar_booked' | 'status_change' | 'high_priority';
  timestamp: string;
  read: boolean;
  leadId?: string;
}

export interface OutreachTemplate {
  id: string;
  name: string;
  category: 'Free Value Audit' | 'Mobile-First Urgency' | 'Social Traffic Leaks' | 'Scientific & Biotech' | 'Direct Booking';
  sector: 'commercial' | 'scientific' | 'all';
  subject: string;
  body: string;
  responseRate: number;
  sentCount: number;
}
