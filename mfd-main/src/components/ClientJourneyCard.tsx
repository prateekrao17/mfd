import React from 'react';
import { Client, JourneyStage } from '../types';

interface ClientJourneyCardProps {
  client: Client;
  onViewDetails: (clientId: string) => void;
}

const stageLabels: Record<JourneyStage, string> = {
  KYC_PENDING: 'KYC Pending',
  PROFILE_COMPLETED: 'Profile Completed',
  PROPOSAL_VIEWED: 'Proposal Viewed',
  PAYMENT_STARTED: 'Payment Started',
  INVESTED: 'Invested',
};

const stageColors: Record<JourneyStage, string> = {
  KYC_PENDING: 'bg-yellow-100 text-yellow-800',
  PROFILE_COMPLETED: 'bg-blue-100 text-blue-800',
  PROPOSAL_VIEWED: 'bg-purple-100 text-purple-800',
  PAYMENT_STARTED: 'bg-orange-100 text-orange-800',
  INVESTED: 'bg-green-100 text-green-800',
};

/**
 * Client journey card for advisor dashboard
 * Shows current stage and flags stalled clients
 */
export const ClientJourneyCard: React.FC<ClientJourneyCardProps> = ({
  client,
  onViewDetails,
}) => {
  const hoursSinceActivity = Math.floor(
    (Date.now() - new Date(client.lastActivityAt).getTime()) / (1000 * 60 * 60)
  );

  return (
    <div className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">{client.name}</h3>
            {client.isStalled && (
              <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">
                Stalled
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3">{client.email}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${stageColors[client.journeyStage]}`}
            >
              {stageLabels[client.journeyStage]}
            </span>
            {client.riskProfile && (
              <span className="text-sm text-gray-600">
                Risk: <span className="font-medium">{client.riskProfile}</span>
              </span>
            )}
            <span className="text-sm text-gray-500">
              Last activity: {hoursSinceActivity}h ago
            </span>
          </div>
        </div>
        <button
          onClick={() => onViewDetails(client.id)}
          className="btn-secondary text-sm py-2 px-4"
        >
          View
        </button>
      </div>
    </div>
  );
};
