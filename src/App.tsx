/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { LeadScoutView } from './components/LeadScoutView';
import { CrmPipelineView } from './components/CrmPipelineView';
import { OutreachCenterView } from './components/OutreachCenterView';
import { AnalyticsView } from './components/AnalyticsView';
import { LeadDetailModal } from './components/LeadDetailModal';
import { initialLeads } from './data/initialLeads';
import { Lead, NotificationItem } from './types';
import { initAuth, googleSignIn, logout } from './services/auth';

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Urgent Web Need Identified',
    message: 'SynapseBio Therapeutics launched Phase II trial but lacks digital patient screening portal.',
    type: 'high_priority',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    read: false,
    leadId: 'lead-4',
  },
  {
    id: 'notif-2',
    title: 'Mobile Traffic Bleed Detected',
    message: 'Lumina Aesthetic Clinic has 14k Instagram followers with a 404 broken mobile booking link.',
    type: 'lead_qualified',
    timestamp: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    read: false,
    leadId: 'lead-1',
  },
  {
    id: 'notif-3',
    title: 'Consultation Confirmed',
    message: 'Google Calendar discovery call with Dr. Chantal Mercier scheduled.',
    type: 'calendar_booked',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    read: true,
    leadId: 'lead-4',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem('webpulse_leads_cache');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return initialLeads;
  });

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Google Workspace Auth State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [hasGoogleToken, setHasGoogleToken] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Persist leads state
  useEffect(() => {
    try {
      localStorage.setItem('webpulse_leads_cache', JSON.stringify(leads));
    } catch (e) {
      // ignore
    }
  }, [leads]);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setHasGoogleToken(!!token);
      },
      () => {
        setGoogleUser(null);
        setHasGoogleToken(false);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    setIsAuthLoading(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setHasGoogleToken(true);
        addNotification({
          title: 'Google Workspace Connected',
          message: `Signed in as ${res.user.email}. Gmail & Calendar integration active.`,
          type: 'lead_qualified',
        });
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      alert(`Google sign in failed: ${err.message || 'Please try again.'}`);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setGoogleUser(null);
      setHasGoogleToken(false);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  // Lead Operations
  const handleAddLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleUpdateLead = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  // Notification Operations
  const addNotification = (
    item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={googleUser}
        hasToken={hasGoogleToken}
        isAuthLoading={isAuthLoading}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAllNotifications={handleClearAllNotifications}
        onSelectLead={(id) => setSelectedLeadId(id)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            leads={leads}
            onSelectLead={(id) => setSelectedLeadId(id)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onGoogleSignIn={handleSignIn}
            hasGoogleToken={hasGoogleToken}
          />
        )}

        {activeTab === 'scout' && (
          <LeadScoutView
            leads={leads}
            onSelectLead={(id) => setSelectedLeadId(id)}
            onAddLead={handleAddLead}
            onAddNotification={addNotification}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {activeTab === 'pipeline' && (
          <CrmPipelineView
            leads={leads}
            onSelectLead={(id) => setSelectedLeadId(id)}
            onUpdateLead={handleUpdateLead}
            onAddNotification={addNotification}
          />
        )}

        {activeTab === 'outreach' && (
          <OutreachCenterView
            leads={leads}
            onSelectLead={(id) => setSelectedLeadId(id)}
            googleUser={googleUser}
            hasGoogleToken={hasGoogleToken}
            onGoogleSignIn={handleSignIn}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView leads={leads} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            WebPulse AI • Global Web Development Lead Intelligence & CRM
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>•</span>
            <span>Gmail & Google Calendar Integrations</span>
            <span>•</span>
            <span>OpenAlex Science Scout</span>
          </div>
        </div>
      </footer>

      {/* Lead Dossier & Workspace Action Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLeadId(null)}
        onUpdateLead={handleUpdateLead}
        googleUser={googleUser}
        hasGoogleToken={hasGoogleToken}
        onGoogleSignIn={handleSignIn}
        onAddNotification={addNotification}
      />
    </div>
  );
}
