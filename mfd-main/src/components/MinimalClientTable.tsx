import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '../types';

interface MinimalClientTableProps {
  clients: Client[];
  onViewClient: (clientId: string) => void;
}

/**
 * Minimal client table with essential columns only:
 * - Client Name
 * - Status (colored dot + text)
 * - Current Stage
 * - Days in Stage
 * - Last Activity
 * - Actions (View Profile, Create Proposal buttons)
 * 
 * Features:
 * - Search by name/email
 * - Filter by status
 * - Sort by clicking headers
 * - 10 rows per page
 */
export const MinimalClientTable: React.FC<MinimalClientTableProps> = ({
  clients,
  onViewClient,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortKey, setSortKey] = useState<'name' | 'stage' | 'activity'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const statusColors: Record<string, { dot: string; text: string }> = {
    KYC_PENDING: { dot: 'bg-gray-400', text: 'New' },
    PROFILE_COMPLETED: { dot: 'bg-blue-400', text: 'Reviewing' },
    PROPOSAL_VIEWED: { dot: 'bg-purple-400', text: 'Ready' },
    PAYMENT_STARTED: { dot: 'bg-yellow-500', text: 'Investing' },
    INVESTED: { dot: 'bg-green-500', text: 'Invested' },
  };

  const getStatusInfo = (stage: Client['journeyStage']) => {
    return statusColors[stage] || statusColors.KYC_PENDING;
  };

  const getDaysInStage = (createdAt: string): number => {
    const now = Date.now();
    const created = new Date(createdAt).getTime();
    return Math.floor((now - created) / (1000 * 60 * 60 * 24));
  };

  const getRelativeTime = (timestamp: string): string => {
    const now = Date.now();
    const date = new Date(timestamp).getTime();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return 'over a week';
  };

  // Filter and search
  const filtered = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' || client.journeyStage === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clients, searchQuery, statusFilter]);

  // Sort
  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      if (sortKey === 'name') {
        aVal = a.name;
        bVal = b.name;
      } else if (sortKey === 'stage') {
        aVal = a.journeyStage;
        bVal = b.journeyStage;
      } else if (sortKey === 'activity') {
        aVal = new Date(a.lastActivityAt).getTime();
        bVal = new Date(b.lastActivityAt).getTime();
      }

      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });

    return copy;
  }, [filtered, sortKey, sortAsc]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedItems = sorted.slice(startIdx, startIdx + itemsPerPage);

  const handleSort = (key: 'name' | 'stage' | 'activity') => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const stages = ['ALL', ...Object.keys(statusColors)] as const;

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
      {/* Controls */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
          >
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage === 'ALL' ? 'All Status' : getStatusInfo(stage as any).text}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4 text-left cursor-pointer hover:text-gray-900 dark:hover:text-gray-100" onClick={() => handleSort('name')}>
                Name {sortKey === 'name' && (sortAsc ? '↑' : '↓')}
              </th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left cursor-pointer hover:text-gray-900 dark:hover:text-gray-100" onClick={() => handleSort('stage')}>
                Stage {sortKey === 'stage' && (sortAsc ? '↑' : '↓')}
              </th>
              <th className="px-6 py-4 text-left">Days</th>
              <th className="px-6 py-4 text-left cursor-pointer hover:text-gray-900 dark:hover:text-gray-100" onClick={() => handleSort('activity')}>
                Last Activity {sortKey === 'activity' && (sortAsc ? '↑' : '↓')}
              </th>
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((client) => {
              const statusInfo = getStatusInfo(client.journeyStage);
              const daysInStage = getDaysInStage(client.createdAt);
              const isAlert = daysInStage > 3;
              return (
                <tr
                  key={client.id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {client.name}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
                      <span className="text-gray-700 dark:text-gray-300">
                        {statusInfo.text}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {client.journeyStage.replace('_', ' ')}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-medium ${
                      isAlert
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {daysInStage}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {getRelativeTime(client.lastActivityAt)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/advisor/client/${client.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startIdx + 1}-{Math.min(startIdx + itemsPerPage, sorted.length)} of {sorted.length}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-200 dark:border-gray-800 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="text-sm text-gray-600 dark:text-gray-400 px-3 py-1">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-200 dark:border-gray-800 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Empty state */}
      {paginatedItems.length === 0 && (
        <div className="p-12 text-center text-gray-500 dark:text-gray-400">
          No clients found
        </div>
      )}
    </div>
  );
};
