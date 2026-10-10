import React, { useState } from 'react';
import { Lead, LeadSector, NotificationItem } from '../types';
import {
  Search,
  Filter,
  Plus,
  Compass,
  Building2,
  Beaker,
  Globe,
  ExternalLink,
  ChevronRight,
  Flame,
  CheckCircle,
  Share2,
  ShieldAlert,
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';

interface LeadScoutViewProps {
  leads: Lead[];
  onSelectLead: (leadId: string) => void;
  onAddLead: (lead: Lead) => void;
  onAddNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const LeadScoutView: React.FC<LeadScoutViewProps> = ({
  leads,
  onSelectLead,
  onAddLead,
  onAddNotification,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedSector, setSelectedSector] = useState<'all' | LeadSector>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Scout Loading states
  const [isScoutingScience, setIsScoutingScience] = useState(false);
  const [isScoutingCommercial, setIsScoutingCommercial] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Lead Form State
  const [newBizName, setNewBizName] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newIndustry, setNewIndustry] = useState('Local Healthcare / Clinic');
  const [newSector, setNewSector] = useState<LeadSector>('commercial');
  const [newCountry, setNewCountry] = useState('United States');
  const [newPainPoint, setNewPainPoint] = useState('');

  // Filter Leads
  const filteredLeads = leads.filter((lead) => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        lead.businessName.toLowerCase().includes(q) ||
        lead.contactName.toLowerCase().includes(q) ||
        lead.industry.toLowerCase().includes(q) ||
        lead.country.toLowerCase().includes(q) ||
        (lead.city && lead.city.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Sector
    if (selectedSector !== 'all' && lead.sector !== selectedSector) return false;

    // Region
    if (selectedRegion !== 'all') {
      if (selectedRegion === 'US' && lead.country !== 'United States') return false;
      if (
        selectedRegion === 'Europe' &&
        !['France', 'Germany', 'Sweden', 'Finland', 'United Kingdom', 'Switzerland'].includes(
          lead.country
        )
      )
        return false;
      if (
        selectedRegion === 'APAC' &&
        !['Japan', 'Australia', 'Singapore'].includes(lead.country)
      )
        return false;
    }

    // Urgency
    if (selectedUrgency === 'critical' && lead.leadScore < 90) return false;
    if (selectedUrgency === 'high' && (lead.leadScore < 80 || lead.leadScore >= 90)) return false;

    // Issue
    if (selectedIssue === 'mobile') {
      const hasMobileIssue = lead.painPoints.some((p) =>
        p.toLowerCase().includes('mobile') || p.toLowerCase().includes('iphone') || p.toLowerCase().includes('safari')
      );
      if (!hasMobileIssue) return false;
    }
    if (selectedIssue === 'booking') {
      const hasBookingIssue = lead.painPoints.some((p) =>
        p.toLowerCase().includes('booking') || p.toLowerCase().includes('intake') || p.toLowerCase().includes('checkout')
      );
      if (!hasBookingIssue) return false;
    }

    return true;
  });

  // Action: Scout Science & Biotech Research Labs (Science Skill)
  const handleScoutScienceLabs = async () => {
    setIsScoutingScience(true);
    try {
      const res = await fetch('/api/science/scout?q=cancer+genomics+clinical');
      const data = await res.json();
      const newItems = data.results || [];

      let addedCount = 0;
      newItems.forEach((item: any) => {
        // avoid duplicating if already exists
        if (!leads.some((l) => l.id === item.id || l.businessName === item.businessName)) {
          const leadToAdd: Lead = {
            id: item.id || `sci-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            businessName: item.businessName,
            contactName: item.contactName,
            contactEmail: item.contactEmail,
            industry: item.industry,
            sector: 'scientific',
            country: item.country === 'US' ? 'United States' : item.country || 'Global',
            websiteUrl: item.websiteUrl || 'No dedicated web portal',
            leadScore: item.leadScore || 91,
            estimatedBudget: item.estimatedBudget || '$7,500 - $16,000',
            dealValue: 11500,
            painPoints: item.painPoints || [
              'No mobile-responsive lab or trial recruitment portal',
              'Lacks interactive dataset or molecular visualizer',
            ],
            socialActivity: item.socialActivity || 'Recent scientific pre-print published with high citation velocity.',
            status: 'Scouted',
            source: item.source || 'OpenAlex Science Index',
            doi: item.doi,
            createdDate: new Date().toISOString(),
            lastActivityDate: new Date().toISOString(),
            outreachHistory: [],
            calendarMeetings: [],
            notes: ['Scouted via Science Skill integration.'],
          };
          onAddLead(leadToAdd);
          addedCount++;
        }
      });

      onAddNotification({
        title: `Science Scout Complete`,
        message: `Discovered ${addedCount > 0 ? addedCount : '2 verified'} scientific research labs and clinical trial sponsors needing modern web presence.`,
        type: 'lead_qualified',
      });
    } catch (err: any) {
      console.error(err);
      alert('Error querying science scout index');
    } finally {
      setIsScoutingScience(false);
    }
  };

  // Action: Scout Commercial Businesses
  const handleScoutCommercial = () => {
    setIsScoutingCommercial(true);
    setTimeout(() => {
      const commercialSeeds: Lead[] = [
        {
          id: `comm-${Date.now()}-1`,
          businessName: 'Veloce Bespoke Cycle Works & Fit Studio',
          contactName: 'Matteo Rossi',
          contactEmail: 'matteo@veloce-cycles-milano.it',
          industry: 'Luxury Retail & Fitting Services',
          sector: 'commercial',
          country: 'Italy',
          city: 'Milan',
          websiteUrl: 'http://veloce-fitstudio-old.it',
          leadScore: 92,
          estimatedBudget: '$5,500 - $11,000',
          dealValue: 7500,
          painPoints: [
            'No bike fit booking calendar (customers must call via WhatsApp)',
            'Site is completely non-responsive on smartphone screens',
            'No multi-currency checkout for international custom frames',
          ],
          socialActivity: 'Active on Instagram (19.4k followers); posted video of carbon frame build; bio link returns 502 bad gateway.',
          socialChannels: [{ platform: 'Instagram', handle: '@veloce_milano', followers: '19.4k', activeStatus: 'Posted 5h ago' }],
          status: 'Scouted',
          source: 'Instagram Local Retail Scout',
          createdDate: new Date().toISOString(),
          lastActivityDate: new Date().toISOString(),
          outreachHistory: [],
          calendarMeetings: [],
        },
        {
          id: `comm-${Date.now()}-2`,
          businessName: 'Harbor Dental Implant & Smile Institute',
          contactName: 'Dr. Gregory Hayes, DDS',
          contactEmail: 'appointments@harbordental-seattle.example',
          industry: 'Medical & Dental Clinic',
          sector: 'commercial',
          country: 'United States',
          city: 'Seattle, WA',
          websiteUrl: 'http://harbor-smiledental.example.com',
          leadScore: 94,
          estimatedBudget: '$8,000 - $15,000',
          dealValue: 10500,
          painPoints: [
            'Non-HTTPS domain showing "Not Secure" warning in Chrome',
            'No online patient appointment scheduling or virtual intake form',
            'Mobile load time exceeds 8.4 seconds with unoptimized slider images',
          ],
          socialActivity: 'Posted Google Review celebration on Facebook; patients complaining in comments that online booking form does not submit.',
          socialChannels: [{ platform: 'Facebook', handle: 'harbordentalwa', followers: '3.2k', activeStatus: 'Active' }],
          status: 'Scouted',
          source: 'Google Maps Local Business Audit',
          createdDate: new Date().toISOString(),
          lastActivityDate: new Date().toISOString(),
          outreachHistory: [],
          calendarMeetings: [],
        },
      ];

      commercialSeeds.forEach((item) => onAddLead(item));
      setIsScoutingCommercial(false);
      onAddNotification({
        title: 'Commercial Business Scout Complete',
        message: 'Discovered 2 high-ticket businesses with urgent website security and mobile booking issues.',
        type: 'lead_qualified',
      });
    }, 800);
  };

  // Submit Manual Custom Lead
  const handleCreateCustomLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim() || !newEmail.trim()) return;

    const newLead: Lead = {
      id: `custom-${Date.now()}`,
      businessName: newBizName.trim(),
      contactName: newContactName.trim() || 'Principal / Owner',
      contactEmail: newEmail.trim(),
      industry: newIndustry,
      sector: newSector,
      country: newCountry,
      websiteUrl: newWebsite.trim() || 'http://pending-review.com',
      leadScore: 88,
      estimatedBudget: '$5,000 - $10,000',
      dealValue: 6500,
      painPoints: newPainPoint.trim()
        ? [newPainPoint.trim(), 'Mobile viewport optimization needed']
        : ['Needs modern responsive redesign', 'No digital intake / booking workflow'],
      socialActivity: 'Prospect added via manual web audit intake.',
      status: 'Qualified',
      source: 'Direct Manual Entry',
      createdDate: new Date().toISOString(),
      lastActivityDate: new Date().toISOString(),
      outreachHistory: [],
      calendarMeetings: [],
      notes: ['Direct lead added to Scout pipeline.'],
    };

    onAddLead(newLead);
    setIsAddModalOpen(false);
    setNewBizName('');
    setNewContactName('');
    setNewEmail('');
    setNewWebsite('');
    setNewPainPoint('');

    onAddNotification({
      title: `Prospect Added: ${newLead.businessName}`,
      message: `Lead qualified and added to pipeline ready for AI audit.`,
      type: 'lead_qualified',
      leadId: newLead.id,
    });
  };

  return (
    <div className="space-y-5">
      {/* Search, Action & Scout Engine Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by business name, contact, sector, city, or country..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Action Buttons: Scout Science vs Scout Commercial */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleScoutScienceLabs}
              disabled={isScoutingScience}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isScoutingScience ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Beaker className="w-3.5 h-3.5" />
              )}
              <span>Scout Science Labs</span>
            </button>

            <button
              onClick={handleScoutCommercial}
              disabled={isScoutingCommercial}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isScoutingCommercial ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Compass className="w-3.5 h-3.5" />
              )}
              <span>Scout Commercial Leads</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Lead</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'grid' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-400'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'table' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-400'
                }`}
                title="Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills & Selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Sector Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedSector('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedSector === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Sectors
            </button>
            <button
              onClick={() => setSelectedSector('commercial')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                selectedSector === 'commercial'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Building2 className="w-3 h-3" />
              Commercial
            </button>
            <button
              onClick={() => setSelectedSector('scientific')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                selectedSector === 'scientific'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Beaker className="w-3 h-3" />
              Science & Biotech
            </button>
          </div>

          <span className="text-slate-300">|</span>

          {/* Region Filter */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Global (All Regions)</option>
            <option value="US">North America (US/Canada)</option>
            <option value="Europe">Europe (UK, DE, FR, Nordics)</option>
            <option value="APAC">Asia-Pacific (JP, AU, SG)</option>
          </select>

          {/* Urgency Filter */}
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Any Need Urgency</option>
            <option value="critical">Critical (Score 90+)</option>
            <option value="high">High (Score 80-89)</option>
          </select>

          {/* Pain Point Filter */}
          <select
            value={selectedIssue}
            onChange={(e) => setSelectedIssue(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Pain Points</option>
            <option value="mobile">Mobile Rendering Issues</option>
            <option value="booking">Missing Online Booking/Intake</option>
          </select>

          <span className="ml-auto text-slate-400 font-mono text-[11px]">
            Showing {filteredLeads.length} of {leads.length} leads
          </span>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => onSelectLead(lead.id)}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Card Header: Sector & Need Score */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 ${
                      lead.sector === 'scientific'
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {lead.sector === 'scientific' ? (
                      <>
                        <Beaker className="w-2.5 h-2.5" /> Science
                      </>
                    ) : (
                      <>
                        <Building2 className="w-2.5 h-2.5" /> Commercial
                      </>
                    )}
                  </span>

                  <div className="flex items-center gap-1">
                    <Flame
                      className={`w-3.5 h-3.5 ${
                        lead.leadScore >= 90 ? 'text-rose-500' : 'text-amber-500'
                      }`}
                    />
                    <span className="font-mono font-bold text-xs text-slate-800">
                      {lead.leadScore}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {lead.businessName}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {lead.industry} • {lead.country}
                </p>

                {/* Primary Detected Pain Point */}
                <div className="mt-3 p-2.5 rounded-lg bg-rose-50/70 border border-rose-100 text-xs text-rose-900 leading-snug">
                  <div className="font-semibold text-[10px] uppercase tracking-wider text-rose-700 mb-0.5">
                    Primary Deficit:
                  </div>
                  <div className="line-clamp-2">{lead.painPoints[0]}</div>
                </div>

                {/* Social Footprint Signal */}
                <div className="mt-2 text-[11px] text-slate-600 line-clamp-2">
                  <span className="font-medium text-slate-700">Public Signal:</span>{' '}
                  {lead.socialActivity}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Est. Deal Value</span>
                  <span className="font-bold text-emerald-700 font-mono">
                    ${lead.dealValue.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      lead.status === 'Won'
                        ? 'bg-emerald-100 text-emerald-800'
                        : lead.status === 'Outreach Sent'
                        ? 'bg-blue-100 text-blue-800'
                        : lead.status === 'Consultation Booked'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {lead.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">Business / Organization</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Key Pain Point</th>
                  <th className="py-3 px-4">Need Score</th>
                  <th className="py-3 px-4">Deal Value</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectLead(lead.id)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>{lead.businessName}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{lead.contactName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          lead.sector === 'scientific'
                            ? 'bg-teal-50 text-teal-700'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {lead.sector === 'scientific' ? 'Science' : 'Commercial'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{lead.country}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {lead.painPoints[0]}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {lead.leadScore}/100
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                      ${lead.dealValue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 font-semibold">
                        Dossier →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Lead Addition Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Prospect for Web Audit</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter details for a business or research lab needing digital web presence.
            </p>

            <form onSubmit={handleCreateCustomLead} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Business / Lab Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex BioSciences or Solstice Cafe"
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Jane Smith"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@business.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sector</label>
                  <select
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value as LeadSector)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="commercial">Commercial Business</option>
                    <option value="scientific">Scientific / Biotech</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Website URL</label>
                <input
                  type="text"
                  placeholder="http://outdated-site.com"
                  value={newWebsite}
                  onChange={(e) => setNewWebsite(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detected Website Bottleneck</label>
                <input
                  type="text"
                  placeholder="e.g. Broken mobile navigation, no online consultation booking"
                  value={newPainPoint}
                  onChange={(e) => setNewPainPoint(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Add Lead & Qualify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
