import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockClients } from '../data/mockData';
import { Client, JourneyStage, RiskProfile } from '../types';

type SortColumn = 'name' | 'journeyStage' | 'engagementScore' | 'potentialAUM' | 'createdAt' | 'lastActivityAt';
type SortDirection = 'asc' | 'desc';

interface FilterPreset {
  id: string;
  name: string;
  filters: ActiveFilters;
}

interface ActiveFilters {
  search?: string;
  journeyStages?: JourneyStage[];
  riskProfiles?: RiskProfile[];
  engagementMin?: number;
  engagementMax?: number;
  aumMin?: number;
  aumMax?: number;
  tags?: string[];
}

const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'hot_leads',
    name: 'Hot Leads',
    filters: {
      journeyStages: ['PROPOSAL_VIEWED', 'PAYMENT_STARTED'],
      engagementMin: 70,
    },
  },
  {
    id: 'stalled',
    name: 'Stalled >3 days',
    filters: {
      // We'll filter by lastActivityAt manually
    },
  },
  {
    id: 'high_net_worth',
    name: 'High Net Worth',
    filters: {
      aumMin: 2000000,
    },
  },
];

/**
 * Advanced Client Management Table
 * Features: Multi-level filtering, dynamic columns, inline actions, bulk operations, engagement scoring
 */
export const ClientManagementTable: React.FC = () => {
  const navigate = useNavigate();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [sortColumn, setSortColumn] = useState<SortColumn>('engagementScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(['name', 'email', 'journeyStage', 'riskProfile', 'engagementScore', 'potentialAUM', 'actions'])
  );
  const [quickViewClient, setQuickViewClient] = useState<Client | null>(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // All available columns
  const allColumns = [
    { id: 'name', label: 'Name', sortable: true },
    { id: 'email', label: 'Email', sortable: false },
    { id: 'phone', label: 'Phone', sortable: false },
    { id: 'journeyStage', label: 'Stage', sortable: true },
    { id: 'riskProfile', label: 'Risk Profile', sortable: false },
    { id: 'engagementScore', label: 'Engagement', sortable: true },
    { id: 'potentialAUM', label: 'Potential AUM', sortable: true },
    { id: 'tags', label: 'Tags', sortable: false },
    { id: 'createdAt', label: 'Created', sortable: true },
    { id: 'lastActivityAt', label: 'Last Activity', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false },
  ];

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    let filtered = [...mockClients];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.phone.includes(term) ||
          c.tags?.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    // Apply filters
    if (activeFilters.journeyStages?.length) {
      filtered = filtered.filter((c) => activeFilters.journeyStages!.includes(c.journeyStage));
    }
    if (activeFilters.riskProfiles?.length) {
      filtered = filtered.filter((c) => c.riskProfile && activeFilters.riskProfiles!.includes(c.riskProfile));
    }
    if (activeFilters.engagementMin !== undefined) {
      filtered = filtered.filter((c) => (c.engagementScore ?? 0) >= activeFilters.engagementMin!);
    }
    if (activeFilters.engagementMax !== undefined) {
      filtered = filtered.filter((c) => (c.engagementScore ?? 0) <= activeFilters.engagementMax!);
    }
    if (activeFilters.aumMin !== undefined) {
      filtered = filtered.filter((c) => (c.potentialAUM ?? 0) >= activeFilters.aumMin!);
    }
    if (activeFilters.aumMax !== undefined) {
      filtered = filtered.filter((c) => (c.potentialAUM ?? 0) <= activeFilters.aumMax!);
    }
    if (activeFilters.tags?.length) {
      filtered = filtered.filter((c) => c.tags?.some((tag) => activeFilters.tags!.includes(tag)));
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortColumn) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'journeyStage':
          aVal = a.journeyStage;
          bVal = b.journeyStage;
          break;
        case 'engagementScore':
          aVal = a.engagementScore ?? 0;
          bVal = b.engagementScore ?? 0;
          break;
        case 'potentialAUM':
          aVal = a.potentialAUM ?? 0;
          bVal = b.potentialAUM ?? 0;
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case 'lastActivityAt':
          aVal = new Date(a.lastActivityAt).getTime();
          bVal = new Date(b.lastActivityAt).getTime();
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [mockClients, searchTerm, activeFilters, sortColumn, sortDirection]);

  // Handlers
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(filteredAndSortedClients.map((c) => c.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (clientId: string, checked: boolean) => {
    const newSelection = new Set(selectedRows);
    if (checked) {
      newSelection.add(clientId);
    } else {
      newSelection.delete(clientId);
    }
    setSelectedRows(newSelection);
  };

  const handleApplyPreset = (preset: FilterPreset) => {
    setActiveFilters(preset.filters);
  };

  const handleRemoveFilter = (filterKey: keyof ActiveFilters) => {
    const newFilters = { ...activeFilters };
    delete newFilters[filterKey];
    setActiveFilters(newFilters);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on ${selectedRows.size} clients`);
    // In real app, this would call an API
    setSelectedRows(new Set());
  };

  const toggleColumnVisibility = (columnId: string) => {
    const newColumns = new Set(visibleColumns);
    if (newColumns.has(columnId)) {
      newColumns.delete(columnId);
    } else {
      newColumns.add(columnId);
    }
    setVisibleColumns(newColumns);
  };

  const getEngagementColor = (score: number) => {
    if (score < 30) return 'text-red-600 bg-red-50';
    if (score < 70) return 'text-amber-600 bg-amber-50';
    return 'text-emerald-600 bg-emerald-50';
  };

  const formatAUM = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  const getDaysInStage = (client: Client) => {
    const days = Math.floor((Date.now() - new Date(client.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const stageLabels: Record<JourneyStage, string> = {
    KYC_PENDING: 'KYC Pending',
    PROFILE_COMPLETED: 'Profile Done',
    PROPOSAL_VIEWED: 'Proposal Viewed',
    PAYMENT_STARTED: 'Payment Started',
    INVESTED: 'Converted',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Client Management</h1>
              <p className="text-sm text-slate-300/80 mt-1">
                {filteredAndSortedClients.length} clients
                {selectedRows.size > 0 && ` • ${selectedRows.size} selected`}
              </p>
            </div>
            <button onClick={() => navigate('/advisor/dashboard')} className="btn-secondary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by name, email, phone, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/15 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className="px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white hover:bg-white/15 transition"
            >
              Columns
            </button>
          </div>

          {/* Filter Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-300/80">Quick filters:</span>
            {FILTER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="px-3 py-1.5 bg-white/10 border border-white/15 rounded-lg text-sm text-white hover:bg-white/15 transition"
              >
                {preset.name}
              </button>
            ))}
            {Object.keys(activeFilters).length > 0 && (
              <button
                onClick={() => setActiveFilters({})}
                className="px-3 py-1.5 bg-red-500/20 border border-red-400/30 rounded-lg text-sm text-red-200 hover:bg-red-500/30 transition"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* Active Filter Chips */}
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null;
            return (
              <div
                key={key}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-500/20 border border-primary-400/30 rounded-lg text-sm text-primary-200"
              >
                <span>
                  {key}: {Array.isArray(value) ? value.join(', ') : value}
                </span>
                <button
                  onClick={() => handleRemoveFilter(key as keyof ActiveFilters)}
                  className="hover:text-white transition"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        {/* Column Selector */}
        {showColumnSelector && (
          <div className="mb-4 p-4 bg-white/10 border border-white/15 rounded-xl">
            <h3 className="text-sm font-semibold text-white mb-3">Show/Hide Columns</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {allColumns.map((col) => (
                <label key={col.id} className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleColumns.has(col.id)}
                    onChange={() => toggleColumnVisibility(col.id)}
                    className="rounded border-white/15 bg-white/10 text-primary-600"
                  />
                  {col.label}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Bulk Actions Bar */}
        {selectedRows.size > 0 && (
          <div className="mb-4 p-4 bg-primary-500/20 border border-primary-400/30 rounded-xl flex items-center justify-between">
            <span className="text-sm text-white">
              {selectedRows.size} client{selectedRows.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('reminder')}
                className="px-3 py-1.5 bg-white/10 border border-white/15 rounded-lg text-sm text-white hover:bg-white/15 transition"
              >
                Send Reminder
              </button>
              <button
                onClick={() => handleBulkAction('tag')}
                className="px-3 py-1.5 bg-white/10 border border-white/15 rounded-lg text-sm text-white hover:bg-white/15 transition"
              >
                Add Tag
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1.5 bg-white/10 border border-white/15 rounded-lg text-sm text-white hover:bg-white/15 transition"
              >
                Export
              </button>
              <button
                onClick={() => setSelectedRows(new Set())}
                className="px-3 py-1.5 bg-red-500/20 border border-red-400/30 rounded-lg text-sm text-red-200 hover:bg-red-500/30 transition"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === filteredAndSortedClients.length && filteredAndSortedClients.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-white/15 bg-white/10 text-primary-600"
                    />
                  </th>
                  {allColumns.map(
                    (col) =>
                      visibleColumns.has(col.id) && (
                        <th key={col.id} className="px-4 py-3 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                          {col.sortable ? (
                            <button
                              onClick={() => handleSort(col.id as SortColumn)}
                              className="flex items-center gap-1 hover:text-white transition"
                            >
                              {col.label}
                              {sortColumn === col.id && (
                                <span className="text-primary-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                              )}
                            </button>
                          ) : (
                            col.label
                          )}
                        </th>
                      )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedClients.map((client, idx) => (
                  <tr
                    key={client.id}
                    className={`group border-t border-white/5 hover:bg-white/5 transition cursor-pointer ${
                      idx % 2 === 0 ? 'bg-white/[0.02]' : ''
                    }`}
                    onClick={() => setQuickViewClient(client)}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(client.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectRow(client.id, e.target.checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-white/15 bg-white/10 text-primary-600"
                      />
                    </td>
                    {visibleColumns.has('name') && (
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{client.name}</div>
                      </td>
                    )}
                    {visibleColumns.has('email') && (
                      <td className="px-4 py-3 text-sm text-slate-300">{client.email}</td>
                    )}
                    {visibleColumns.has('phone') && (
                      <td className="px-4 py-3 text-sm text-slate-300">{client.phone}</td>
                    )}
                    {visibleColumns.has('journeyStage') && (
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-200 text-xs rounded-full">
                          {stageLabels[client.journeyStage]}
                        </span>
                      </td>
                    )}
                    {visibleColumns.has('riskProfile') && (
                      <td className="px-4 py-3 text-sm text-slate-300">{client.riskProfile || '-'}</td>
                    )}
                    {visibleColumns.has('engagementScore') && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getEngagementColor(client.engagementScore ?? 0)}`}>
                            {client.engagementScore ?? 0}
                          </div>
                          <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                (client.engagementScore ?? 0) < 30
                                  ? 'bg-red-500'
                                  : (client.engagementScore ?? 0) < 70
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${client.engagementScore ?? 0}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    )}
                    {visibleColumns.has('potentialAUM') && (
                      <td className="px-4 py-3 text-sm text-slate-300">{formatAUM(client.potentialAUM ?? 0)}</td>
                    )}
                    {visibleColumns.has('tags') && (
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {client.tags?.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-white/10 text-slate-300 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                          {(client.tags?.length ?? 0) > 2 && (
                            <span className="px-2 py-0.5 bg-white/10 text-slate-300 text-xs rounded">
                              +{(client.tags?.length ?? 0) - 2}
                            </span>
                          )}
                        </div>
                      </td>
                    )}
                    {visibleColumns.has('createdAt') && (
                      <td className="px-4 py-3 text-sm text-slate-300">
                        {getDaysInStage(client)}d ago
                      </td>
                    )}
                    {visibleColumns.has('lastActivityAt') && (
                      <td className="px-4 py-3 text-sm text-slate-300">
                        {Math.floor((Date.now() - new Date(client.lastActivityAt).getTime()) / (1000 * 60 * 60))}h ago
                      </td>
                    )}
                    {visibleColumns.has('actions') && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/advisor/curate-advanced/${client.id}`);
                            }}
                            className="px-2 py-1 bg-primary-500/20 text-primary-200 text-xs rounded hover:bg-primary-500/30 transition"
                          >
                            Curate
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Send reminder to', client.id);
                            }}
                            className="px-2 py-1 bg-white/10 text-slate-200 text-xs rounded hover:bg-white/15 transition"
                          >
                            Remind
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Quick View Panel */}
      {quickViewClient && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-end"
          onClick={() => setQuickViewClient(null)}
        >
          <div
            className="w-full max-w-2xl h-full bg-slate-900 shadow-2xl overflow-y-auto animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white">{quickViewClient.name}</h2>
              <button
                onClick={() => setQuickViewClient(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition text-slate-300 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{quickViewClient.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="text-white">{quickViewClient.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk Profile:</span>
                    <span className="text-white">{quickViewClient.riskProfile || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Engagement Metrics */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Engagement Metrics</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-xs text-slate-400">Engagement Score</div>
                    <div className={`text-2xl font-bold mt-1 ${getEngagementColor(quickViewClient.engagementScore ?? 0)}`}>
                      {quickViewClient.engagementScore ?? 0}
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-xs text-slate-400">Profile Completion</div>
                    <div className="text-2xl font-bold text-white mt-1">{quickViewClient.profileCompletion ?? 0}%</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-xs text-slate-400">Return Visits</div>
                    <div className="text-2xl font-bold text-white mt-1">{quickViewClient.returnVisits ?? 0}</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-xs text-slate-400">Questions Asked</div>
                    <div className="text-2xl font-bold text-white mt-1">{quickViewClient.questionsAsked ?? 0}</div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {quickViewClient.tags && quickViewClient.tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Tags</h3>
                  <div className="flex gap-2 flex-wrap">
                    {quickViewClient.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-primary-500/20 text-primary-200 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Advisor Notes */}
              {quickViewClient.advisorNotes && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Advisor Notes</h3>
                  <p className="text-sm text-slate-300 bg-white/5 p-3 rounded-lg">{quickViewClient.advisorNotes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => navigate(`/advisor/curate-advanced/${quickViewClient.id}`)}
                  className="flex-1 btn-primary"
                >
                  Create Proposal
                </button>
                <button className="flex-1 btn-secondary">Send Reminder</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
