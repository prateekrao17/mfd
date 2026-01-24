import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockClients } from '../data/mockData';

/**
 * MINIMAL CLIENT DETAIL VIEW
 * 
 * Features:
 * - Client name + photo (if available)
 * - Risk Profile (one line)
 * - Current Stage (visual progress: 5 dots, current highlighted)
 * - Assigned Funds (simple list, 3-5 items)
 * - Two buttons only: "Send Reminder" | "Edit Proposal"
 * - Activity Timeline (last 5 activities, chronological)
 */
export const MinimalClientDetail: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  const client = useMemo(() => {
    return mockClients.find(c => c.id === clientId);
  }, [clientId]);

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Client not found
          </h1>
          <button
            onClick={() => navigate('/advisor/dashboard')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const stages = [
    'KYC_PENDING',
    'PROFILE_COMPLETED',
    'PROPOSAL_VIEWED',
    'PAYMENT_STARTED',
    'INVESTED',
  ] as const;

  const currentStageIndex = stages.indexOf(client.journeyStage);
  const progressPercentage = ((currentStageIndex + 1) / stages.length) * 100;

  const mockActivities = [
    {
      id: '1',
      action: 'Proposal sent',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      action: 'Profile completed',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      action: 'Client onboarded',
      timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      action: 'Initial meeting scheduled',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      action: 'Client registered',
      timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const mockFunds = [
    { name: 'HDFC Top 100 Fund', amount: '2,50,000' },
    { name: 'SBI Bluechip Fund', amount: '1,50,000' },
    { name: 'ICICI Balanced Advantage', amount: '1,00,000' },
  ];

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/advisor/dashboard')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Client Details
          </h1>
          <div className="w-12" /> {/* Spacer for symmetry */}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Client Header */}
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex gap-6">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {client.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {client.email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Risk Profile: <span className="font-medium text-gray-700 dark:text-gray-300">{client.riskProfile || 'Not Set'}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                Send Reminder
              </button>
              <button
                onClick={() => navigate(`/advisor/curate-minimal/${client.id}`)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Create Proposal
              </button>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Current Stage
            </h3>
            <div className="flex items-center justify-between">
              {stages.map((stage, index) => (
                <div key={stage} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      index <= currentStageIndex
                        ? 'bg-blue-600 dark:bg-blue-400'
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                    {stage.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-2 gap-8">
          {/* Assigned Funds */}
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Assigned Funds
            </h3>
            <div className="space-y-4">
              {mockFunds.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  No funds assigned yet
                </p>
              ) : (
                mockFunds.map((fund, idx) => (
                  <div
                    key={idx}
                    className="border-l-4 border-blue-600 dark:border-blue-400 pl-4 py-2"
                  >
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {fund.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      ₹{fund.amount}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {mockActivities.map((activity, idx) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
