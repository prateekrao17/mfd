import React from 'react';
import { Advisor } from '../types';
import { formatCurrency } from '../data/mockData';

interface AdvisorCardProps {
  advisor: Advisor;
}

/**
 * Trust-building component: Shows advisor credentials prominently
 * Used in client-facing screens to establish credibility
 */
export const AdvisorCard: React.FC<AdvisorCardProps> = ({ advisor }) => {
  return (
    <div className="card bg-gradient-to-br from-primary-50 to-white border-primary-200">
      <div className="flex items-start gap-4">
        {advisor.photo && (
          <img
            src={advisor.photo}
            alt={advisor.name}
            className="w-16 h-16 rounded-full border-2 border-primary-300"
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{advisor.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            ARN: <span className="font-mono">{advisor.arn}</span>
          </p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm">
            <div>
              <span className="text-gray-500">Experience:</span>{' '}
              <span className="font-medium">{advisor.experience} years</span>
            </div>
            <div>
              <span className="text-gray-500">AUM:</span>{' '}
              <span className="font-medium">{formatCurrency(advisor.aum)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
