import { Lead } from '../types';

export const initialLeads: Lead[] = [
  {
    id: 'lead-1',
    businessName: 'Lumina Aesthetic Dermatology & Laser',
    contactName: 'Dr. Elena Rostova',
    contactEmail: 'contact@lumina-laser-clinic.example',
    phone: '+1 (415) 890-4122',
    industry: 'Medical & Aesthetic Healthcare',
    sector: 'commercial',
    country: 'United States',
    city: 'San Francisco, CA',
    websiteUrl: 'http://lumina-laser-sf.example.org',
    leadScore: 94,
    estimatedBudget: '$6,500 - $12,000',
    dealValue: 8500,
    painPoints: [
      'Insecure HTTP connection triggering browser warnings',
      'No mobile booking system; patients must call during business hours only',
      'Page speed 2.8s desktop, 7.1s mobile with uncompressed hero images'
    ],
    socialActivity: 'Posted 4 times this week on Instagram (14.2k followers) promoting a new laser treatment, but bio link sends users to a broken mobile page.',
    socialChannels: [
      { platform: 'Instagram', handle: '@lumina_aesthetics_sf', followers: '14.2k', activeStatus: 'Posted 2h ago' },
      { platform: 'LinkedIn', handle: 'lumina-dermatology', followers: '1.8k', activeStatus: 'Active' }
    ],
    status: 'Qualified',
    source: 'Google Business Maps & IG Audit',
    createdDate: '2026-10-02T10:15:00Z',
    lastActivityDate: '2026-10-08T14:30:00Z',
    notes: [
      'High-ticket clinic with high client lifetime value ($2,400 avg). Urgent need for HIPAA-compliant booking portal.'
    ],
    outreachHistory: [],
    calendarMeetings: []
  },
  {
    id: 'lead-2',
    businessName: 'Vanguard Functional Genomics Institute',
    contactName: 'Prof. David K. Thorne',
    contactEmail: 'thorne-lab@vanguard-genomics.edu',
    phone: '+1 (617) 555-0198',
    industry: 'Genomics & Biomedical Research',
    sector: 'scientific',
    country: 'United States',
    city: 'Cambridge, MA',
    websiteUrl: 'https://vanguard-genomics.edu/~fac/thorne-archive.html',
    leadScore: 91,
    estimatedBudget: '$8,000 - $18,000',
    dealValue: 12500,
    painPoints: [
      'Hosted on archaic 2012 university subdirectory with table layouts',
      'No interactive molecular structure viewer or genomic variant database',
      'Postdoc recruitment form is a downloaded PDF form instead of a digital portal'
    ],
    socialActivity: 'Just announced a major $3.2M NIH grant and Nature Biotechnology paper; Twitter thread gained 480 retweets with comments asking where to view the dataset.',
    socialChannels: [
      { platform: 'X/Twitter', handle: '@ThorneGenomicsLab', followers: '6.4k', activeStatus: 'Posted yesterday' },
      { platform: 'LinkedIn', handle: 'thorne-laboratory', followers: '2.1k', activeStatus: 'Active' }
    ],
    status: 'Scouted',
    source: 'OpenAlex Scientific Literature & PubMed',
    doi: '10.1038/s41587-026-01892-z',
    createdDate: '2026-10-05T09:00:00Z',
    lastActivityDate: '2026-10-07T11:20:00Z',
    notes: [
      'Research group has dedicated grant funding for digital dissemination and public science outreach.'
    ],
    outreachHistory: [],
    calendarMeetings: []
  },
  {
    id: 'lead-3',
    businessName: 'Atelier Kanso Architects & Urban Design',
    contactName: 'Kenji Takahashi',
    contactEmail: 'projects@atelier-kanso-tokyo.jp',
    phone: '+81 3 5555 0142',
    industry: 'Architecture & Interior Design',
    sector: 'commercial',
    country: 'Japan',
    city: 'Tokyo',
    websiteUrl: 'http://atelier-kanso.tokyo.jp',
    leadScore: 88,
    estimatedBudget: '$7,000 - $15,000',
    dealValue: 9800,
    painPoints: [
      'Flash-era desktop-only navigation that does not scroll on iOS Safari',
      'Portfolio imagery loads slowly without WebP compression or high-DPI retina support',
      'Missing bilingual English/Japanese showcase for global commercial tenders'
    ],
    socialActivity: 'High visual engagement on Instagram (38.5k followers) showcasing award-winning Kyoto residence, but website link causes immediate pinch-zoom frustration.',
    socialChannels: [
      { platform: 'Instagram', handle: '@atelier_kanso', followers: '38.5k', activeStatus: 'Posted 6h ago' }
    ],
    status: 'Outreach Sent',
    source: 'Architectural Digest Directory',
    createdDate: '2026-09-28T08:00:00Z',
    lastActivityDate: '2026-10-06T16:45:00Z',
    notes: [
      'Outreach email sent highlighting visual mobile portfolio prototype.'
    ],
    outreachHistory: [
      {
        id: 'out-101',
        date: '2026-10-06T16:45:00Z',
        subject: 'Mobile showcase concept for Atelier Kanso awards',
        body: 'Kenji-san, admired your Kyoto residence on Instagram. Noticed mobile visitors cannot navigate the project gallery...',
        method: 'Gmail',
        status: 'Sent'
      }
    ],
    calendarMeetings: []
  },
  {
    id: 'lead-4',
    businessName: 'SynapseBio Therapeutics (Trial NCT06148201)',
    contactName: 'Dr. Chantal Mercier',
    contactEmail: 'trials@synapsebiopharma.fr',
    phone: '+33 1 42 68 55 00',
    industry: 'Biotech & Clinical Trials',
    sector: 'scientific',
    country: 'France',
    city: 'Paris',
    websiteUrl: 'https://synapsebio-pharma-static.fr',
    leadScore: 96,
    estimatedBudget: '$14,000 - $28,000',
    dealValue: 18500,
    painPoints: [
      'Clinical trial recruitment relies on phone hotline with no digital screening questionnaire',
      'Lacks GDPR/Health Data compliant patient portal',
      'Website is a 1-page static corporate brochure without trial investigator tools'
    ],
    socialActivity: 'Announced Phase II Alzheimer candidate trial initiation on LinkedIn with 8,900 impressions; patient advocacy groups commenting seeking patient criteria.',
    socialChannels: [
      { platform: 'LinkedIn', handle: 'synapsebio-therapeutics', followers: '5.2k', activeStatus: 'Active 3d ago' }
    ],
    status: 'Consultation Booked',
    source: 'ClinicalTrials.gov Registry',
    createdDate: '2026-09-20T11:00:00Z',
    lastActivityDate: '2026-10-08T09:15:00Z',
    notes: [
      'Discovery call booked via Google Calendar for patient recruitment digital funnel.'
    ],
    outreachHistory: [
      {
        id: 'out-102',
        date: '2026-10-02T10:00:00Z',
        subject: 'Digital patient pre-screening portal for Phase II trial NCT06148201',
        body: 'Dr. Mercier, congrats on advancing to Phase II. We built a rapid screening portal mockup that pre-qualifies eligible subjects...',
        method: 'Gmail',
        status: 'Replied'
      }
    ],
    calendarMeetings: [
      {
        id: 'meet-201',
        title: 'SynapseBio Web Portal Discovery & Architecture Walkthrough',
        startTime: '2026-10-12T14:00:00Z',
        durationMinutes: 45,
        meetLink: 'https://meet.google.com/syn-brio-wkp'
      }
    ]
  },
  {
    id: 'lead-5',
    businessName: 'Nordic Heritage Roasters & Bakery',
    contactName: 'Frederik Lindqvist',
    contactEmail: 'frederik@nordic-heritageroasters.se',
    phone: '+46 8 123 4567',
    industry: 'Artisanal Food & Hospitality',
    sector: 'commercial',
    country: 'Sweden',
    city: 'Stockholm',
    websiteUrl: 'http://nordic-heritage-coffee.se',
    leadScore: 82,
    estimatedBudget: '$4,500 - $8,500',
    dealValue: 5500,
    painPoints: [
      'No e-commerce or coffee subscription checkout despite wholesale demand',
      'Menu is an uploaded PDF that does not render on iPhone Safari',
      'Zero local SEO Schema markup for bakery opening hours'
    ],
    socialActivity: 'Massive local following on TikTok & Instagram (26.3k followers), videos getting 50k+ views asking "Can I order your seasonal sourdough online?".',
    socialChannels: [
      { platform: 'Instagram', handle: '@nordicheritage_sthlm', followers: '26.3k', activeStatus: 'Active 4h ago' },
      { platform: 'TikTok', handle: '@nordicroasters', followers: '18.1k', activeStatus: 'Viral reel 2d ago' }
    ],
    status: 'In Conversation' as any,
    source: 'Yelp & Instagram Food Trends',
    createdDate: '2026-10-01T14:20:00Z',
    lastActivityDate: '2026-10-09T08:00:00Z',
    notes: [
      'Frederik replied enthusiastically to our cold email; interested in Shopify/Next.js hybrid store.'
    ],
    outreachHistory: [
      {
        id: 'out-103',
        date: '2026-10-04T12:00:00Z',
        subject: 'Quick question about shipping your Stockholm roasts to EU',
        body: 'Frederik, love the craft behind Nordic Heritage. Saw your TikTok comments asking how to order your Ethiopian roast...',
        method: 'Gmail',
        status: 'Replied'
      }
    ],
    calendarMeetings: []
  },
  {
    id: 'lead-6',
    businessName: 'Bavaria CleanEnergy Engineering GmbH',
    contactName: 'Dipl.-Ing. Markus Weber',
    contactEmail: 'm.weber@bavaria-cleanenergy.de',
    phone: '+49 89 9876543',
    industry: 'CleanTech & Commercial Solar',
    sector: 'commercial',
    country: 'Germany',
    city: 'Munich',
    websiteUrl: 'https://bavaria-cleanenergy-alt.de',
    leadScore: 89,
    estimatedBudget: '$9,000 - $20,000',
    dealValue: 14000,
    painPoints: [
      'Commercial B2B solar calculator is broken on modern browsers',
      'No interactive project case studies or carbon savings visualizer',
      'Outdated corporate styling with slow rendering'
    ],
    socialActivity: 'Frequently posting industrial rooftop solar completions on LinkedIn, tagged by municipal procurement officers.',
    socialChannels: [
      { platform: 'LinkedIn', handle: 'bavaria-cleanenergy', followers: '4.8k', activeStatus: 'Active yesterday' }
    ],
    status: 'Proposal Sent',
    source: 'Bavarian Chamber of Commerce Listing',
    createdDate: '2026-09-15T09:30:00Z',
    lastActivityDate: '2026-10-07T15:00:00Z',
    notes: [
      'Delivered custom proposal for Next.js interactive solar calculator + B2B quote generator.'
    ],
    outreachHistory: [],
    calendarMeetings: []
  },
  {
    id: 'lead-7',
    businessName: 'Sydney Translational Oncology Lab',
    contactName: 'Dr. Rebecca O’Connor',
    contactEmail: 'roconnor@sydneyoncology.edu.au',
    phone: '+61 2 9351 2222',
    industry: 'Cancer Research & Translational Medicine',
    sector: 'scientific',
    country: 'Australia',
    city: 'Sydney',
    websiteUrl: 'http://sydneyoncology.edu.au/members/~oconnor_lab',
    leadScore: 93,
    estimatedBudget: '$7,500 - $16,000',
    dealValue: 11000,
    painPoints: [
      'Plain text faculty list; no dedicated lab branding or interactive publication search',
      'Missing interactive biobank sample request form',
      'No patient-friendly summaries of clinical trials for trial participants'
    ],
    socialActivity: 'Spoke at World Cancer Congress last week; shared slides on LinkedIn which received 320 likes and inquiries from international researchers.',
    socialChannels: [
      { platform: 'LinkedIn', handle: 'rebecca-oconnor-oncology', followers: '3.9k', activeStatus: 'Active 2d ago' },
      { platform: 'X/Twitter', handle: '@SydOncologyLab', followers: '2.8k', activeStatus: 'Active' }
    ],
    status: 'Scouted',
    source: 'Europe PMC & PubMed Directory',
    doi: '10.1158/2159-8290.CD-26-0312',
    createdDate: '2026-10-06T12:00:00Z',
    lastActivityDate: '2026-10-06T12:00:00Z',
    notes: [],
    outreachHistory: [],
    calendarMeetings: []
  },
  {
    id: 'lead-8',
    businessName: 'Kallio Legal & Tech Counsel',
    contactName: 'Sofia Kallio, LL.M.',
    contactEmail: 'sofia@kallio-law.fi',
    phone: '+358 9 4245 1100',
    industry: 'Legal & IP Advisory',
    sector: 'commercial',
    country: 'Finland',
    city: 'Helsinki',
    websiteUrl: 'https://kallio-law-firm.fi',
    leadScore: 78,
    estimatedBudget: '$5,000 - $10,000',
    dealValue: 8400,
    painPoints: [
      'Website template not updated since 2017; lacks mobile responsive consultation scheduler',
      'Missing secure client document upload intake portal',
      'Poor Finnish/English toggle implementation'
    ],
    socialActivity: 'Publishing weekly EU AI Act legal updates on LinkedIn with high engagement from startup founders in the Nordics.',
    socialChannels: [
      { platform: 'LinkedIn', handle: 'kallio-tech-law', followers: '8.1k', activeStatus: 'Active 1d ago' }
    ],
    status: 'Won',
    source: 'Helsinki Tech Hub Directory',
    createdDate: '2026-09-10T10:00:00Z',
    lastActivityDate: '2026-10-05T17:00:00Z',
    notes: [
      'Contract signed for $8,400 bespoke modern corporate web portal with encrypted intake!'
    ],
    outreachHistory: [],
    calendarMeetings: []
  }
];
