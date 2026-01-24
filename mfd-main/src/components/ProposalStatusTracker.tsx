import React from 'react';

interface ProposalActivity {
  type: 'viewed' | 'fund_viewed' | 'selection_changed' | 'message_sent';
  fundName?: string;
  timestamp: Date;
  duration?: number; // seconds spent on fund
}

interface ProposalStatusTrackerProps {
  userType: 'advisor' | 'client';
  proposalCompletion: number; // 0-100
  lastActivity?: Date;
  currentFundViewing?: string;
  recentActivity?: ProposalActivity[];
  isClientOnline?: boolean;
}

/**
 * Proposal Status Tracker
 * Shows real-time status and activity for proposals
 */
export const ProposalStatusTracker: React.FC<ProposalStatusTrackerProps> = ({
  userType,
  proposalCompletion,
  lastActivity,
  currentFundViewing,
  recentActivity = [],
  isClientOnline = false,
}) => {
  const getTimeSince = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const getActivityIcon = (type: ProposalActivity['type']) => {
    switch (type) {
      case 'viewed':
        return '👀';
      case 'fund_viewed':
        return '📊';
      case 'selection_changed':
        return '✏️';
      case 'message_sent':
        return '💬';
      default:
        return '•';
    }
  };

  const getActivityDescription = (activity: ProposalActivity) => {
    switch (activity.type) {
      case 'viewed':
        return 'Viewed proposal';
      case 'fund_viewed':
        return `Viewed ${activity.fundName}${activity.duration ? ` (${activity.duration}s)` : ''}`;
      case 'selection_changed':
        return `Selected ${activity.fundName}`;
      case 'message_sent':
        return 'Sent a message';
      default:
        return 'Activity';
    }
  };

  if (userType === 'client') {
    // Client view - show advisor progress
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {proposalCompletion}%
            </div>
            {proposalCompletion < 100 && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {proposalCompletion < 100 ? 'Your advisor is building your proposal' : 'Your proposal is ready!'}
            </h3>
            <p className="text-sm text-gray-600">
              {proposalCompletion < 100 ? `${proposalCompletion}% complete` : 'Review your personalized plan'}
            </p>
          </div>
        </div>

        {proposalCompletion < 100 && (
          <div className="w-full h-2 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${proposalCompletion}%` }}
            />
          </div>
        )}

        {proposalCompletion === 100 && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 rounded-lg p-3 mt-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Ready for review! Your advisor has personalized {recentActivity.length} recommendations for you.</span>
          </div>
        )}
      </div>
    );
  }

  // Advisor view - show client activity
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Client Activity</h3>
        {isClientOnline && (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>Online now</span>
          </div>
        )}
      </div>

      {lastActivity && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600">Last active</div>
          <div className="text-lg font-semibold text-gray-900">{getTimeSince(lastActivity)}</div>
        </div>
      )}

      {currentFundViewing && (
        <div className="mb-4 p-3 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <div>
              <div className="text-sm text-gray-600">Currently viewing</div>
              <div className="font-semibold text-gray-900">{currentFundViewing}</div>
            </div>
          </div>
        </div>
      )}

      {recentActivity.length > 0 && (
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</div>
          <div className="space-y-2">
            {recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <span className="text-lg flex-shrink-0">{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <div className="text-gray-900">{getActivityDescription(activity)}</div>
                  <div className="text-gray-500 text-xs">{getTimeSince(activity.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentActivity.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          No activity yet. Client hasn't viewed the proposal.
        </div>
      )}
    </div>
  );
};
