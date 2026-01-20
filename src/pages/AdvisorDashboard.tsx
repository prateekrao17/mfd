import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockAdvisor, mockClients } from '../data/mockData';
import { Client } from '../types';
import { ClientJourneyCard } from '../components/ClientJourneyCard';
import { AdvisorCard } from '../components/AdvisorCard';
import { ChatWidget } from '../components/ChatWidget';
import { FollowUpScheduler } from '../components/FollowUpScheduler';
import { ThemeToggle } from '../components/ThemeToggle';
import { DashboardStatsSkeleton } from '../components/SkeletonLoader';
import { pageTransition, staggerContainer, staggerItem } from '../utils/animations';
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
} from 'recharts';

/**
 * Advisor Dashboard - Control Center
 * 
 * Product Logic:
 * - Shows all clients with their journey stages
 * - Flags stalled clients (no action in X hours) for proactive follow-up
 * - Provides business snapshot (active clients, conversions)
 * - Enables quick navigation to client details/curation
 * 
 * UX Principle: Clean, actionable, no clutter
 */
export const AdvisorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStage, setSelectedStage] = useState<
    'ALL' | Client['journeyStage'] | 'STALLED'
  >('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demonstration
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const now = Date.now();
  const hoursSince = (iso: string) =>
    Math.round((now - new Date(iso).getTime()) / (1000 * 60 * 60));

  const stageLabel: Record<Client['journeyStage'], string> = {
    KYC_PENDING: 'KYC Pending',
    PROFILE_COMPLETED: 'Profile Completed',
    PROPOSAL_VIEWED: 'Proposal Viewed',
    PAYMENT_STARTED: 'Payment Started',
    INVESTED: 'Converted',
  };

  // Business metrics calculation
  const metrics = useMemo(() => {
    const totalClients = mockClients.length;
    const activeClients = mockClients.filter(
      c => c.journeyStage !== 'INVESTED' && !c.isStalled
    ).length;
    const stalledClients = mockClients.filter(c => c.isStalled).length;
    const investedClients = mockClients.filter(c => c.journeyStage === 'INVESTED').length;
    const conversionRate = totalClients > 0 
      ? Math.round((investedClients / totalClients) * 100) 
      : 0;

    return {
      totalClients,
      activeClients,
      stalledClients,
      investedClients,
      conversionRate,
    };
  }, []);

  const funnelStages: Client['journeyStage'][] = [
    'KYC_PENDING',
    'PROFILE_COMPLETED',
    'PROPOSAL_VIEWED',
    'PAYMENT_STARTED',
    'INVESTED',
  ];

  const funnelData = useMemo(() => {
    const byStage = funnelStages.map((s) => ({
      stage: stageLabel[s],
      stageKey: s,
      value: mockClients.filter((c) => !c.isStalled && c.journeyStage === s)
        .length,
    }));

    return byStage.map((d, idx) => {
      const prev = byStage[idx - 1];
      const next = byStage[idx + 1];
      const conversionFromPrevious =
        prev && prev.value > 0 ? Math.round((d.value / prev.value) * 100) : null;
      const dropOffToNext =
        next && d.value > 0
          ? Math.round(((d.value - next.value) / d.value) * 100)
          : null;
      return { ...d, conversionFromPrevious, dropOffToNext };
    });
  }, []);

  // Group clients by journey stage for better visibility
  const clientsByStage = useMemo(() => {
    const groups: Record<string, Client[]> = {
      stalled: [],
      kyc_pending: [],
      profile_completed: [],
      proposal_viewed: [],
      payment_started: [],
      invested: [],
    };

    mockClients.forEach(client => {
      if (client.isStalled) {
        groups.stalled.push(client);
      } else {
        groups[client.journeyStage.toLowerCase()].push(client);
      }
    });

    return groups;
  }, []);

  const filteredClientsByStage = useMemo(() => {
    if (selectedStage === 'ALL') return clientsByStage;

    const empty: Record<string, Client[]> = {
      stalled: [],
      kyc_pending: [],
      profile_completed: [],
      proposal_viewed: [],
      payment_started: [],
      invested: [],
    };

    if (selectedStage === 'STALLED') {
      empty.stalled = clientsByStage.stalled;
      return empty;
    }

    const key = selectedStage.toLowerCase();
    empty[key] = clientsByStage[key] ?? [];
    return empty;
  }, [clientsByStage, selectedStage]);

  const handleViewClient = (clientId: string) => {
    navigate(`/advisor/client/${clientId}`);
  };

  const handleCreateProposal = (clientId: string) => {
    navigate(`/advisor/curate/${clientId}`);
  };

  const MetricCard: React.FC<{
    title: string;
    value: string;
    deltaLabel: string;
    deltaTone: 'positive' | 'warning';
    data: { x: string; value: number }[];
  }> = ({ title, value, deltaLabel, deltaTone, data }) => {
    const [hover, setHover] = useState(false);
    const stroke = deltaTone === 'positive' ? '#22c55e' : '#f59e0b';

    return (
      <div
        className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-white/10 backdrop-blur-xl shadow-lg dark:shadow-[0_18px_55px_rgba(2,6,23,0.55)] transition-transform duration-150 hover:-translate-y-0.5"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-[11px] tracking-[0.18em] uppercase text-gray-600 dark:text-gray-600 dark:text-slate-300/80">
              {title}
            </div>
            <div
              className={`text-[11px] font-medium ${
                deltaTone === 'positive' ? 'text-emerald-600 dark:text-emerald-300' : 'text-amber-600 dark:text-amber-300'
              }`}
            >
              {deltaLabel}
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-3">
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
            <div className="h-10 w-28">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={stroke}
                    strokeWidth={2.2}
                    dot={false}
                    isAnimationActive
                    animationDuration={420}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            className={`mt-2 text-xs text-gray-600 dark:text-gray-600 dark:text-slate-300/80 transition-all duration-150 ${
              hover ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-0.5'
            }`}
          >
            Detailed breakdown available on hover (mock).
          </div>
        </div>
      </div>
    );
  };

  const AlertsPanel: React.FC = () => {
    const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
    const [snoozedUntil, setSnoozedUntil] = useState<Record<string, number>>({});
    const nowMs = Date.now();

    const estimatedValue: Record<string, number> = {
      client_001: 650000,
      client_002: 1200000,
      client_003: 320000,
      client_004: 2500000,
      client_005: 900000,
    };

    const alerts = useMemo(() => {
      const base = mockClients.flatMap((c) => {
        const h = hoursSince(c.lastActivityAt);
        const out: {
          id: string;
          priority: number;
          title: string;
          message: string;
          tone: 'warning' | 'positive';
        }[] = [];

        // Clients stuck >48hrs at any stage (or flagged stalled)
        if (c.isStalled || h > 48) {
          out.push({
            id: `stuck:${c.id}`,
            priority: 0,
            title: 'Client stuck >48h',
            message: `${c.name} has been inactive for ${h} hours in ${stageLabel[c.journeyStage]}.`,
            tone: 'warning',
          });
        }

        // Proposal viewed but no action in 24hrs
        if (c.journeyStage === 'PROPOSAL_VIEWED' && h > 24) {
          out.push({
            id: `proposal_idle:${c.id}`,
            priority: 1,
            title: 'Proposal viewed, no action',
            message: `${c.name} viewed the proposal and has been idle for ${h} hours.`,
            tone: 'warning',
          });
        }

        // High-value disengagement (mock value threshold)
        if ((estimatedValue[c.id] ?? 0) >= 1000000 && h > 24) {
          out.push({
            id: `high_value:${c.id}`,
            priority: 2,
            title: 'High-value disengagement',
            message: `${c.name} (₹${(estimatedValue[c.id] ?? 0).toLocaleString(
              'en-IN'
            )}) shows low engagement (${h} hours).`,
            tone: 'positive',
          });
        }

        return out;
      });

      return base.sort((a, b) => a.priority - b.priority);
    }, []);

    const visible = alerts.filter((a) => {
      if (dismissed[a.id]) return false;
      const until = snoozedUntil[a.id];
      return !until || until < nowMs;
    });

    const snooze = (id: string, minutes: number) => {
      setSnoozedUntil((p) => ({ ...p, [id]: Date.now() + minutes * 60 * 1000 }));
    };

    const dismiss = (id: string) => setDismissed((p) => ({ ...p, [id]: true }));

    return (
      <div className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-white/10 backdrop-blur-xl shadow-lg dark:shadow-[0_18px_55px_rgba(2,6,23,0.55)]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Smart Alerts</div>
          <div className="text-xs text-gray-600 dark:text-gray-600 dark:text-slate-300/80">{visible.length} active</div>
        </div>
        <div className="max-h-[320px] overflow-auto px-4 pb-4 space-y-2">
          {visible.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-600 dark:text-gray-600 dark:text-slate-300/80">
              All clear. No alerts requiring attention.
            </div>
          ) : (
            visible.map((a) => (
              <div
                key={a.id}
                className="group rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-950/30 p-3 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block h-2.5 w-2.5 rounded-full ${
                          a.tone === 'positive' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{a.title}</div>
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-600 dark:text-slate-300/80">{a.message}</div>
                  </div>
                  <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => snooze(a.id, 30)}
                      className="rounded-full border border-gray-300 dark:border-white/15 bg-gray-100 dark:bg-white/10 px-2.5 py-1 text-xs text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/15 transition"
                    >
                      Snooze 30m
                    </button>
                    <button
                      onClick={() => dismiss(a.id)}
                      className="rounded-full border border-red-400/40 bg-red-500/10 px-2.5 py-1 text-xs text-red-600 dark:text-red-200 hover:bg-red-500/15 transition"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900"
    >
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Advisor Dashboard</h1>
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {/* Quick Access Dropdown */}
              <div className="relative group">
                <button
                  className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                  aria-label="Quick access menu"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="hidden sm:inline">Quick Access</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    <button
                      onClick={() => navigate('/advisor/curate-advanced/client_001')}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Advanced Fund Curation</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">AI-powered fund selection tool</div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => navigate('/client/proposal')}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Client Proposal View</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Preview client experience</div>
                        </div>
                      </div>
                    </button>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                    <button
                      onClick={() => navigate('/advisor/clients')}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Client Management Table</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Advanced client list view</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/advisor/onboarding-link')}
                className="btn-primary hidden sm:flex"
                aria-label="Share client onboarding link"
              >
                Share Onboarding Link
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Advisor Profile Card */}
        {isLoading ? (
          <div className="mb-8">
            <DashboardStatsSkeleton />
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mb-8"
          >
            <AdvisorCard advisor={mockAdvisor} />
          </motion.div>
        )}

        {/* Advanced Business Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Revenue trending"
            value="₹12.8L"
            deltaLabel="+12% MoM"
            deltaTone="positive"
            data={[
              { x: 'Aug', value: 8 },
              { x: 'Sep', value: 9 },
              { x: 'Oct', value: 10 },
              { x: 'Nov', value: 10.8 },
              { x: 'Dec', value: 12.2 },
              { x: 'Jan', value: 12.8 },
            ]}
          />
          <MetricCard
            title="AUM growth"
            value="₹4.5Cr"
            deltaLabel="+9% (6m)"
            deltaTone="positive"
            data={[
              { x: 'Aug', value: 3.9 },
              { x: 'Sep', value: 4.05 },
              { x: 'Oct', value: 4.18 },
              { x: 'Nov', value: 4.3 },
              { x: 'Dec', value: 4.42 },
              { x: 'Jan', value: 4.5 },
            ]}
          />
          <MetricCard
            title="Client acquisition cost"
            value="₹740"
            deltaLabel="-7% (trend)"
            deltaTone="positive"
            data={[
              { x: 'Aug', value: 900 },
              { x: 'Sep', value: 860 },
              { x: 'Oct', value: 835 },
              { x: 'Nov', value: 810 },
              { x: 'Dec', value: 780 },
              { x: 'Jan', value: 740 },
            ]}
          />
          <MetricCard
            title="Avg time-to-conversion"
            value="9.4 days"
            deltaLabel="-15% vs prev"
            deltaTone="positive"
            data={[
              { x: 'Prev', value: 11.1 },
              { x: 'Now', value: 9.4 },
            ]}
          />
        </div>

        {/* Journey funnel + heatmap + alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Funnel */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-white/10 backdrop-blur-xl shadow-lg dark:shadow-[0_18px_55px_rgba(2,6,23,0.55)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  Client Journey Funnel
                </div>
                <div className="text-xs text-gray-600 dark:text-slate-300/80">
                  Click a segment to filter the client list.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedStage('ALL')}
                  className={`rounded-full px-3 py-1 text-xs border transition ${
                    selectedStage === 'ALL'
                      ? 'border-emerald-300/70 bg-emerald-400/10 text-emerald-200'
                      : 'border-gray-300 dark:border-white/15 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-white/10'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedStage('STALLED')}
                  className={`rounded-full px-3 py-1 text-xs border transition ${
                    selectedStage === 'STALLED'
                      ? 'border-amber-300/70 bg-amber-400/10 text-amber-200'
                      : 'border-gray-300 dark:border-white/15 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-white/10'
                  }`}
                >
                  Stalled
                </button>
              </div>
            </div>

            <div className="h-[240px] px-4 pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const p: any = payload[0]?.payload;
                      return (
                        <div className="rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-slate-950/90 px-3 py-2 text-xs text-gray-900 dark:text-white shadow-lg">
                          <div className="font-semibold">{p.stage}</div>
                          <div className="text-gray-600 dark:text-slate-300/80">{p.value} clients</div>
                          {p.conversionFromPrevious != null && (
                            <div className="text-gray-600 dark:text-slate-300/80">
                              Conv: {p.conversionFromPrevious}%
                            </div>
                          )}
                          {p.dropOffToNext != null && (
                            <div className="text-amber-200">
                              Drop-off: {p.dropOffToNext}%
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Funnel
                    dataKey="value"
                    data={funnelData as any}
                    isAnimationActive
                    animationDuration={420}
                    onClick={(d: any) => {
                      const key = d?.payload?.stageKey as Client['journeyStage'] | undefined;
                      if (!key) return;
                      setSelectedStage(key);
                    }}
                  />
                </FunnelChart>
              </ResponsiveContainer>
            </div>

            <div className="px-4 pb-4 text-xs text-gray-600 dark:text-slate-300/80 flex items-center justify-between">
              <span>
                Overall conversion:{' '}
                <span className="text-emerald-300 font-semibold">
                  {metrics.conversionRate}%
                </span>
              </span>
              <span className="hidden md:block">
                Hover for drop-off indicators between stages.
              </span>
            </div>
          </div>

          {/* Heatmap */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-white/10 backdrop-blur-xl shadow-lg dark:shadow-[0_18px_55px_rgba(2,6,23,0.55)]">
            <div className="px-4 py-3">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Client Activity Heatmap</div>
              <div className="text-xs text-gray-600 dark:text-slate-300/80">
                Best follow-up windows by day/hour (mock).
              </div>
            </div>
            <div className="px-4 pb-4">
              {(() => {
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
                const cells = days.flatMap((day, d) =>
                  hours.map((hour, h) => {
                    const v = Math.max(
                      0,
                      Math.round(
                        (Math.sin((h / hours.length) * Math.PI) + 1) * 6 +
                          (d >= 1 && d <= 3 ? 4 : 0) +
                          (d === 6 ? -4 : 0)
                      )
                    );
                    return { day, hour, v };
                  })
                );
                const max = Math.max(...cells.map((c) => c.v));
                const bg = (v: number) => {
                  if (v <= 0 || max === 0) return 'rgba(2,6,23,0.35)';
                  const t = v / max;
                  return `rgba(34,197,94,${0.12 + t * 0.78})`;
                };

                return (
                  <div className="grid grid-cols-[auto_1fr] gap-2">
                    <div className="pt-6 space-y-[6px]">
                      {days.map((day) => (
                        <div key={day} className="h-4 text-[11px] text-gray-600 dark:text-slate-300/80">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-[6px]">
                      {days.map((day) => (
                        <div
                          key={day}
                          className="grid"
                          style={{
                            gridTemplateColumns: `repeat(${hours.length}, minmax(0, 1fr))`,
                            gap: 4,
                          }}
                        >
                          {hours.map((hour) => {
                            const v = cells.find((c) => c.day === day && c.hour === hour)?.v ?? 0;
                            return (
                              <div
                                key={`${day}-${hour}`}
                                title={`${day} ${hour}:00 • ${v} events`}
                                className="h-4 rounded border border-white/10 transition-transform duration-150 hover:-translate-y-[1px]"
                                style={{ backgroundColor: bg(v) }}
                              />
                            );
                          })}
                        </div>
                      ))}
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300/70">
                        <span>{hours[0]}:00</span>
                        <span>{hours[Math.floor(hours.length / 2)]}:00</span>
                        <span>{hours[hours.length - 1]}:00</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-300/70">
                        <span>Low</span>
                        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                          <div
                            key={t}
                            className="h-2 w-4 rounded-full"
                            style={{ backgroundColor: `rgba(34,197,94,${0.12 + t * 0.78})` }}
                          />
                        ))}
                        <span>High</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <AlertsPanel />
        </div>

        {/* Stalled Clients (Priority Section) */}
        {filteredClientsByStage.stalled.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                ⚠️ Stalled Clients ({clientsByStage.stalled.length})
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-300/80">
                No activity in last 24+ hours - follow up needed
              </p>
            </div>
            <div className="space-y-3">
              {filteredClientsByStage.stalled.map(client => (
                <ClientJourneyCard
                  key={client.id}
                  client={client}
                  onViewDetails={handleViewClient}
                />
              ))}
            </div>
          </section>
        )}

        {/* Client Journey Stages */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Clients</h2>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-300/80">
              <span>Filter:</span>
              <select
                value={selectedStage}
                onChange={(e) =>
                  setSelectedStage(e.target.value as any)
                }
                className="rounded-full border border-gray-300 dark:border-white/15 bg-white dark:bg-white/10 px-3 py-1 text-xs text-gray-900 dark:text-white outline-none"
              >
                <option value="ALL">All</option>
                <option value="STALLED">Stalled</option>
                <option value="KYC_PENDING">KYC Pending</option>
                <option value="PROFILE_COMPLETED">Profile Completed</option>
                <option value="PROPOSAL_VIEWED">Proposal Viewed</option>
                <option value="PAYMENT_STARTED">Payment Started</option>
                <option value="INVESTED">Converted</option>
              </select>
            </div>
          </div>
          
          {/* KYC Pending */}
          {filteredClientsByStage.kyc_pending.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-3">
                KYC Pending ({filteredClientsByStage.kyc_pending.length})
              </h3>
              <div className="space-y-3">
                {filteredClientsByStage.kyc_pending.map(client => (
                  <ClientJourneyCard
                    key={client.id}
                    client={client}
                    onViewDetails={handleViewClient}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Profile Completed */}
          {filteredClientsByStage.profile_completed.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-3">
                Profile Completed ({filteredClientsByStage.profile_completed.length})
              </h3>
              <div className="space-y-3">
                {filteredClientsByStage.profile_completed.map(client => (
                  <div key={client.id} className="card flex items-center justify-between">
                    <div className="flex-1">
                      <ClientJourneyCard
                        client={client}
                        onViewDetails={handleViewClient}
                      />
                    </div>
                    <button
                      onClick={() => handleCreateProposal(client.id)}
                      className="btn-primary ml-4"
                    >
                      Create Proposal
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proposal Viewed */}
          {filteredClientsByStage.proposal_viewed.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-3">
                Proposal Viewed ({filteredClientsByStage.proposal_viewed.length})
              </h3>
              <div className="space-y-3">
                {filteredClientsByStage.proposal_viewed.map(client => (
                  <ClientJourneyCard
                    key={client.id}
                    client={client}
                    onViewDetails={handleViewClient}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Payment Started */}
          {filteredClientsByStage.payment_started.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-3">
                Payment Started ({filteredClientsByStage.payment_started.length})
              </h3>
              <div className="space-y-3">
                {filteredClientsByStage.payment_started.map(client => (
                  <ClientJourneyCard
                    key={client.id}
                    client={client}
                    onViewDetails={handleViewClient}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Invested */}
          {filteredClientsByStage.invested.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-3">
                Converted ({filteredClientsByStage.invested.length})
              </h3>
              <div className="space-y-3">
                {filteredClientsByStage.invested.map(client => (
                  <ClientJourneyCard
                    key={client.id}
                    client={client}
                    onViewDetails={handleViewClient}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Follow-Up Scheduler Section */}
        <section className="mt-8">
          <FollowUpScheduler />
        </section>
      </main>

      {/* Chat Widget */}
      <ChatWidget
        userType="advisor"
        advisorName={mockAdvisor.name}
        clientName="Priya Sharma"
      />
    </motion.div>
  );
};
