import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAdvisor } from '../data/mockData';

/**
 * Advisor Onboarding Link Page
 * 
 * Product Logic:
 * - Shows advisor their unique client onboarding link
 * - Allows easy copying to share with clients
 * - In real app, this link would be generated server-side and tied to advisor's auth
 */
export const AdvisorOnboardingLink: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mockAdvisor.clientOnboardingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="card">
          <button
            onClick={() => navigate('/advisor/dashboard')}
            className="text-primary-600 hover:text-primary-700 mb-6 inline-flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Client Onboarding Link
          </h1>
          <p className="text-gray-600 mb-6">
            Share this link with your clients to start their onboarding process.
            They'll complete a quick risk assessment and see your curated fund recommendations.
          </p>

          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm text-gray-800 break-all">
                {mockAdvisor.clientOnboardingLink}
              </code>
              <button
                onClick={handleCopy}
                className="btn-primary whitespace-nowrap"
              >
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Client clicks your link and sees your credentials</li>
              <li>They complete a 3-minute risk & goal questionnaire</li>
              <li>You curate 3-5 funds based on their profile</li>
              <li>Client views your personalized proposal</li>
              <li>You track their progress in your dashboard</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
