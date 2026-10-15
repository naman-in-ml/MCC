'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useDashboardStore } from '@/stores/dashboardStore';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Send,
  Search,
  ArrowLeft,
  Phone,
  UserCheck,
  Check,
  Eye,
  AlertOctagon,
} from 'lucide-react';

export const AllAlertsCrisisScreen: React.FC = () => {
  const {
    incidents,
    selectedIncidentId,
    setSelectedIncidentId,
    confirmRumorFake,
    sendAuthRequest,
  } = useDashboardStore();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'AuthSent' | 'ConfirmedFake'>('All');
  const [divisionFilter, setDivisionFilter] = useState('All');

  // Form states inside the action flexbox
  const [rebuttalNotes, setRebuttalNotes] = useState('');
  const [authUrgency, setAuthUrgency] = useState<'Urgent' | 'High' | 'Standard'>('Urgent');
  const [authNotes, setAuthNotes] = useState('');
  const [showFakeConfirmDialog, setShowFakeConfirmDialog] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Currently selected incident
  const currentSelectedId = selectedIncidentId || (incidents.length > 0 ? incidents[0].id : null);
  const selectedIncident = useMemo(() => {
    return incidents.find((inc) => inc.id === currentSelectedId) || incidents[0] || null;
  }, [incidents, currentSelectedId]);

  // Toast auto-clear
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setFeedbackToast({ message, type });
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4000);
  };

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      // Search
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        incident.id.toLowerCase().includes(q) ||
        incident.summary.toLowerCase().includes(q) ||
        incident.district.toLowerCase().includes(q) ||
        incident.source.toLowerCase().includes(q) ||
        Boolean(incident.category && incident.category.toLowerCase().includes(q));

      // Severity
      const matchesSeverity = severityFilter === 'All' || incident.severity === severityFilter;

      // Status
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Pending' && !incident.isConfirmedFake && !incident.authRequestSent) ||
        (statusFilter === 'AuthSent' && incident.authRequestSent) ||
        (statusFilter === 'ConfirmedFake' && incident.isConfirmedFake);

      // Division
      const matchesDivision =
        divisionFilter === 'All' || incident.division === divisionFilter;

      return matchesSearch && matchesSeverity && matchesStatus && matchesDivision;
    });
  }, [incidents, searchQuery, severityFilter, statusFilter, divisionFilter]);

  // Metric counts
  const highSeverityCount = incidents.filter((i) => i.severity === 'High').length;
  const authSentCount = incidents.filter((i) => i.authRequestSent).length;
  const confirmedFakeCount = incidents.filter((i) => i.isConfirmedFake || i.verificationStatus === 'Confirmed Fake').length;
  const urgentSLACount = incidents.filter((i) => i.slaMinutes <= 45).length;

  // Handle Confirm Rumor is Fake
  const handleConfirmFake = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedIncident) return;

    confirmRumorFake(selectedIncident.id, rebuttalNotes || undefined);
    setShowFakeConfirmDialog(false);
    setRebuttalNotes('');
    showToast(
      `✓ Rumor confirmed fake for ${selectedIncident.id}. Counter-rebuttal issued and dispatched to media channels.`,
      'success'
    );
  };

  // Handle Send Authenticating Request
  const handleSendAuthRequest = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedIncident) return;

    const notes = authNotes
      ? `[Priority: ${authUrgency}] ${authNotes}`
      : `Priority: ${authUrgency}. Immediate field investigation requested for ${selectedIncident.district}.`;
    sendAuthRequest(selectedIncident.id, notes);
    setShowAuthForm(false);
    setAuthNotes('');
    showToast(
      `✓ Authenticating request dispatched to District Collector & DIO desk (${selectedIncident.district}). Tracking ID: REQ-${Date.now().toString().slice(-5)}`,
      'info'
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1780px] w-full mx-auto space-y-5">
      {/* Toast Notification */}
      {feedbackToast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-xl border flex items-center gap-3 transition-all transform animate-bounce ${
            feedbackToast.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : 'bg-blue-900 text-white border-blue-700'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{feedbackToast.message}</span>
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-borderLine-standard">
        <div>
          <div className="flex items-center gap-2 text-xs text-content-muted mb-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-gov-blue hover:text-gov-blue-hover hover:underline font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-content-secondary font-medium">Crisis Desk</span>
            <span>/</span>
            <span className="text-content-primary font-bold">Zone 5 Incident Registry</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-red-100 text-red-700">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gov-primary tracking-tight">
                All Alerts & Crisis
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                सर्व आपत्कालीन सतर्कता आणि संकट निवारण केंद्र • 90-Minute SLA Rumor Refutation & Collector Verification Desk
              </p>
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-red-100 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span>{incidents.length} Monitored Incidents</span>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>94.2% SLA Compliance</span>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-surface border border-borderLine-standard rounded-lg p-3.5 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Active Crisis
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
              {incidents.length}
            </div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">
              Across {new Set(incidents.map((i) => i.district)).size} Maharashtra Districts
            </div>
          </div>
          <div className="p-3 rounded-md bg-blue-50 text-blue-700">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface border border-borderLine-standard rounded-lg p-3.5 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              High Severity Threat
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-red-600 mt-0.5">
              {highSeverityCount}
            </div>
            <div className="text-[10px] text-red-600 font-semibold mt-0.5">
              {urgentSLACount} under 45m critical SLA
            </div>
          </div>
          <div className="p-3 rounded-md bg-red-50 text-red-700">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface border border-borderLine-standard rounded-lg p-3.5 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Auth Requests Sent
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-0.5">
              {authSentCount}
            </div>
            <div className="text-[10px] text-amber-700 font-medium mt-0.5">
              Awaiting Collector / DIO field report
            </div>
          </div>
          <div className="p-3 rounded-md bg-amber-50 text-amber-700">
            <Send className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface border border-borderLine-standard rounded-lg p-3.5 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Confirmed Debunked
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-0.5">
              {confirmedFakeCount}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
              Official rebuttals live in press & social
            </div>
          </div>
          <div className="p-3 rounded-md bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface border border-borderLine-standard rounded-lg p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rumors by keyword, incident ID (e.g. INC-2025-0417), district, platform..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gov-blue focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Division Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase whitespace-nowrap">Division:</span>
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-gov-blue"
            >
              <option value="All">All Maharashtra</option>
              <option value="Pune">Pune</option>
              <option value="Konkan">Konkan</option>
              <option value="Nagpur">Nagpur</option>
              <option value="Nashik">Nashik</option>
              <option value="Aurangabad">Chhatrapati Sambhajinagar</option>
              <option value="Amravati">Amravati</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Severity:</span>
            {(['All', 'High', 'Medium', 'Low'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  severityFilter === sev
                    ? 'bg-gov-primary text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}

            <span className="text-[11px] font-bold text-slate-500 uppercase ml-2 mr-1">Status:</span>
            {[
              { id: 'All', label: 'All' },
              { id: 'Pending', label: 'Action Required' },
              { id: 'AuthSent', label: 'Auth Requested' },
              { id: 'ConfirmedFake', label: 'Confirmed Fake' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id as 'All' | 'Pending' | 'AuthSent' | 'ConfirmedFake')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  statusFilter === st.id
                    ? 'bg-gov-blue text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredIncidents.length}</span> of {incidents.length} incidents
          </div>
        </div>
      </div>

      {/* Main Operational Flexbox Layout: List on Left, Action Flexbox on Right */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Left Column: Incidents Cards Feed */}
        <div className="flex-1 w-full space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Zone 5 Crisis Incident Stream ({filteredIncidents.length})</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Click any incident to open action flexbox</span>
          </div>

          {filteredIncidents.length === 0 ? (
            <div className="bg-surface border border-slate-200 rounded-lg p-8 text-center text-slate-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold">No incidents found matching current filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSeverityFilter('All');
                  setStatusFilter('All');
                  setDivisionFilter('All');
                }}
                className="text-xs font-bold text-gov-blue hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            filteredIncidents.map((incident) => {
              const isSelected = selectedIncident?.id === incident.id;
              const isHigh = incident.severity === 'High';
              const isMedium = incident.severity === 'Medium';
              const isFake = incident.isConfirmedFake;
              const isAuthSent = incident.authRequestSent;

              return (
                <div
                  key={incident.id}
                  onClick={() => {
                    setSelectedIncidentId(incident.id);
                    setShowFakeConfirmDialog(false);
                    setShowAuthForm(false);
                  }}
                  className={`bg-surface border rounded-lg p-3.5 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'border-gov-blue ring-2 ring-gov-blue/20 shadow-md bg-blue-50/20'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  {/* Top Metadata Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {incident.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isHigh
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : isMedium
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {incident.severity} Severity
                      </span>
                      <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                        {incident.source}
                      </span>
                      <span className="text-[10px] font-semibold text-gov-blue bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        {incident.district}
                      </span>
                    </div>

                    {/* SLA Timer */}
                    <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{incident.slaRemaining}</span>
                    </div>
                  </div>

                  {/* Summary Headline */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {incident.summary}
                    </h3>
                    {incident.category && (
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Category: {incident.category} • Viral Velocity: {incident.viralReach || 'Tracking in progress'}
                      </p>
                    )}
                  </div>

                  {/* Bottom Row: Status & Action Cue */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-medium">Status:</span>
                      {isFake ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Confirmed Fake</span>
                        </span>
                      ) : isAuthSent ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          <Send className="w-3 h-3 text-blue-600" />
                          <span>Auth Request Sent</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>{incident.verificationStatus}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-gov-blue">
                      <span>{isSelected ? 'Currently Selected' : 'Take Action →'}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Interactive Action Flexbox Panel */}
        <div className="w-full lg:w-[480px] xl:w-[540px] shrink-0 sticky top-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Crisis Resolution & Action Flexbox</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Authorized Desk</span>
          </div>

          {selectedIncident ? (
            <div className="bg-surface border-2 border-slate-300 rounded-xl p-4 sm:p-5 shadow-sm space-y-4 flex flex-col justify-between">
              {/* Flexbox Header */}
              <div className="pb-3 border-b border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                      {selectedIncident.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        selectedIncident.severity === 'High'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : selectedIncident.severity === 'Medium'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {selectedIncident.severity} Severity
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>SLA: {selectedIncident.slaRemaining} left</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {selectedIncident.summary}
                </h3>
              </div>

              {/* Flex Details Container */}
              <div className="space-y-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-medium">District & Division</span>
                    <span className="font-bold text-slate-800">
                      {selectedIncident.district} ({selectedIncident.division || 'Maharashtra'})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Platform / Source</span>
                    <span className="font-bold text-slate-800">{selectedIncident.source}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Reported Timeline</span>
                    <span className="font-bold text-slate-800">{selectedIncident.reportedTime || 'Recent'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Viral Reach Impact</span>
                    <span className="font-bold text-red-700">{selectedIncident.viralReach || 'High Velocity'}</span>
                  </div>
                </div>

                {/* Full Description & Claims */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400 block font-medium mb-1">Rumor Narrative & Claims Under Scrutiny:</span>
                  <p className="text-slate-800 font-medium leading-relaxed bg-white p-2.5 rounded border border-slate-200 text-xs">
                    {selectedIncident.fullDescription || selectedIncident.summary}
                  </p>
                </div>

                {/* Assigned District Officer Card */}
                {selectedIncident.dioOfficer && (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Concerned District Officer</span>
                      <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-gov-blue" />
                        {selectedIncident.dioOfficer}
                      </span>
                    </div>
                    {selectedIncident.dioPhone && (
                      <a
                        href={`tel:${selectedIncident.dioPhone}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-gov-blue bg-blue-50 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{selectedIncident.dioPhone}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Status Badges in Flexbox */}
              <div className="space-y-2">
                {selectedIncident.isConfirmedFake && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>RUMOR CONFIRMED FAKE • COUNTER-REBUTTAL ACTIVE</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-medium leading-relaxed">
                      {selectedIncident.counterStatement || 'Official rebuttal dispatched across state press releases and verified social channels.'}
                    </p>
                  </div>
                )}

                {selectedIncident.authRequestSent && (
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-300 text-blue-900 text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold text-blue-800">
                      <Send className="w-4 h-4 text-blue-600" />
                      <span>AUTHENTICATING REQUEST ACTIVE</span>
                    </div>
                    <p className="text-[11px] text-blue-700 font-medium">
                      Dispatched to District Collector & DIO ({selectedIncident.district}). Awaiting on-ground verification report.
                    </p>
                  </div>
                )}
              </div>

              {/* ACTION FLEXBOX SECTION: The two required user flows */}
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                  <span>Take Verification Action</span>
                  <span className="text-[10px] text-slate-400 font-normal">Collector / Admin Authorization</span>
                </div>

                {/* Action 1: Confirm Rumour is Fake */}
                <div className="border border-emerald-200 bg-emerald-50/50 rounded-lg p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-emerald-900">
                          Action 1: Confirm Rumour is Fake
                        </h4>
                        <p className="text-[10px] text-emerald-700 font-medium">
                          Issue immediate debunking counter-statement & mark rumor refuted
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowFakeConfirmDialog(!showFakeConfirmDialog);
                        setShowAuthForm(false);
                      }}
                      className="px-2.5 py-1 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded shadow-xs transition-colors shrink-0"
                    >
                      {showFakeConfirmDialog ? 'Close' : selectedIncident.isConfirmedFake ? 'Edit Rebuttal' : 'Confirm Fake'}
                    </button>
                  </div>

                  {showFakeConfirmDialog && (
                    <form onSubmit={handleConfirmFake} className="pt-2 border-t border-emerald-200 space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                          Official Debunk Statement (Broadcasted to Press & Social):
                        </label>
                        <textarea
                          rows={3}
                          value={rebuttalNotes || selectedIncident.counterStatement || ''}
                          onChange={(e) => setRebuttalNotes(e.target.value)}
                          placeholder="Enter verified facts and official counter-rebuttal text..."
                          className="w-full p-2 text-xs bg-white border border-emerald-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowFakeConfirmDialog(false)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded shadow-sm inline-flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Dispatch Counter-Rebuttal</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Action 2: Send Authenticating Request */}
                <div className="border border-blue-200 bg-blue-50/50 rounded-lg p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-blue-100 text-gov-blue">
                        <Send className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gov-primary">
                          Action 2: Send Authenticating Request
                        </h4>
                        <p className="text-[10px] text-blue-700 font-medium">
                          Dispatch urgent inquiry to District Collector & DIO field desk
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowAuthForm(!showAuthForm);
                        setShowFakeConfirmDialog(false);
                      }}
                      className="px-2.5 py-1 text-xs font-bold bg-gov-blue hover:bg-gov-blue-hover text-white rounded shadow-xs transition-colors shrink-0"
                    >
                      {showAuthForm ? 'Close' : selectedIncident.authRequestSent ? 'Update Request' : 'Send Request'}
                    </button>
                  </div>

                  {showAuthForm && (
                    <form onSubmit={handleSendAuthRequest} className="pt-2 border-t border-blue-200 space-y-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                            Target Office:
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={`Collector & DIO (${selectedIncident.district})`}
                            className="w-full px-2 py-1 text-xs bg-slate-100 border border-slate-300 rounded text-slate-800 font-medium cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                            Priority Urgency:
                          </label>
                          <select
                            value={authUrgency}
                            onChange={(e) => setAuthUrgency(e.target.value as 'Urgent' | 'High' | 'Standard')}
                            className="w-full px-2 py-1 text-xs bg-white border border-blue-300 rounded text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-gov-blue"
                          >
                            <option value="Urgent">Urgent (30 Min Mandate)</option>
                            <option value="High">High (60 Min)</option>
                            <option value="Standard">Standard (90 Min)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                          Verification Directives & Checkpoints:
                        </label>
                        <textarea
                          rows={2}
                          value={authNotes}
                          onChange={(e) => setAuthNotes(e.target.value)}
                          placeholder="e.g. Requesting physical inspection of water reservoir pump houses and formal lab testing report..."
                          className="w-full p-2 text-xs bg-white border border-blue-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-gov-blue font-medium"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAuthForm(false)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1.5 text-xs font-bold bg-gov-blue hover:bg-gov-blue-hover text-white rounded shadow-sm inline-flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch to District Desk</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface border border-slate-200 rounded-lg p-8 text-center text-slate-500">
              <Eye className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold">Select an incident from the stream</p>
              <p className="text-xs text-slate-400 mt-1">
                Choose any crisis record to inspect details and perform authentication actions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
