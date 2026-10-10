import { OutreachTemplate } from '../types';

export const initialTemplates: OutreachTemplate[] = [
  {
    id: 'tmpl-free-audit',
    name: 'Free 3-Point Conversion Audit',
    category: 'Free Value Audit',
    sector: 'all',
    subject: '3 conversion bottlenecks on {{businessName}} website (+ mockup)',
    body: `Hi {{contactName}},

I was reviewing {{businessName}}'s digital presence and was impressed by your recent momentum. 

However, running a quick UX & mobile diagnostic on your site ({{websiteUrl}}), I spotted 3 immediate issues that are likely causing potential clients to bounce:
1. {{detectedIssue1}}
2. {{detectedIssue2}}
3. Mobile loading friction and lack of instant digital booking/inquiry intake.

We drafted a quick interactive 3-screen redesign mockup showing how to solve this and double inquiry conversions. 

Would you be open to a 5-minute video walkthrough or a quick link to check it out? No strings attached.

Best regards,
{{senderName}}
Web Development & Growth Lead`,
    responseRate: 34.2,
    sentCount: 128
  },
  {
    id: 'tmpl-mobile-urgent',
    name: 'Mobile-First Traffic Bleed',
    category: 'Mobile-First Urgency',
    sector: 'commercial',
    subject: 'Quick observation regarding mobile traffic on {{businessName}}',
    body: `Hi {{contactName}},

With over 68% of customers now discovering services like yours on mobile devices, I noticed that {{businessName}}'s website isn't rendering smoothly on iOS/Android devices:

- Navigation elements and buttons are difficult to tap on mobile screens.
- {{detectedIssue1}}

We recently revamped the mobile funnel for a similar firm in the {{industry}} space and increased their booked inquiries by 82% in the first 30 days.

Could I send over a quick 2-minute Loom showing what we found and how an updated responsive experience would look?

Cheers,
{{senderName}}`,
    responseRate: 29.5,
    sentCount: 94
  },
  {
    id: 'tmpl-social-traffic',
    name: 'Social Media to Web Conversion Fix',
    category: 'Social Traffic Leaks',
    sector: 'commercial',
    subject: 'Turning your {{socialFollowers}} followers into direct clients',
    body: `Hi {{contactName}},

I came across {{businessName}}'s active social channels and love the engagement you're building. 

However, there's a big leak in your funnel right now: when interested followers click over to your site from your bio, they're met with {{detectedIssue1}}, with no fast path to book, purchase, or inquire.

You're generating great attention, but the website isn't closing the loop.

We specialize in modern, high-speed Next.js websites built specifically to convert social traffic into paying clients. Would you be open to seeing a free wireframe concept tailored for {{businessName}}?

Warmly,
{{senderName}}`,
    responseRate: 38.0,
    sentCount: 112
  },
  {
    id: 'tmpl-science-biotech',
    name: 'Scientific Lab & Clinical Portal Modernization',
    category: 'Scientific & Biotech',
    sector: 'scientific',
    subject: 'Dedicated digital research & recruitment portal for {{businessName}}',
    body: `Dear {{contactName}},

Congratulations on your recent publication and advancements in {{industry}}.

Given the international interest in your research, I noticed that your team currently lacks a modern, dedicated laboratory portal (currently hosted on {{websiteUrl}}). 

We build modern, interactive scientific web platforms equipped with:
- Interactive 3D molecular/genomic data visualization tools
- High-converting digital patient pre-screening portals for clinical trials
- Streamlined candidate intake for top postdoctoral fellows and grant partners

We recently built an interactive research portal for a translational group that cut their participant screening time by 60%.

Would you or your lab coordinator have 10 minutes next Tuesday to review a preview concept we put together for {{businessName}}?

Sincerely,
{{senderName}}
Scientific Web Engineering Lead`,
    responseRate: 41.5,
    sentCount: 76
  },
  {
    id: 'tmpl-direct-booking',
    name: 'Direct ROI & Online Booking Pitch',
    category: 'Direct Booking',
    sector: 'commercial',
    subject: 'Adding 1-click client booking to {{businessName}}',
    body: `Hi {{contactName}},

Quick question: are you still requiring prospective clients to call during business hours to book with {{businessName}}?

Modern clients expect 24/7 instant online scheduling and digital intake. By adding an automated client booking and qualification workflow, businesses in {{industry}} typically capture 30-45% more qualified clients who browse outside work hours.

We can deploy a brand-new, fast, mobile-optimized site with integrated calendar booking in under 10 days.

Would you be open to a quick 10-minute discovery call this week? You can also pick a slot directly here: [Calendar Link].

Best,
{{senderName}}`,
    responseRate: 26.8,
    sentCount: 88
  }
];
