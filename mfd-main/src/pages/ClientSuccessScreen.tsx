import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockFunds, mockAdvisor } from '../data/mockData';

/**
 * CLIENT SUCCESS SCREEN
 * 
 * Confirmation after investment is complete.
 * Shows next steps and agreement to terms.
 */
export const ClientSuccessScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          🎉 You're All Set!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Your investment request has been submitted successfully. {mockAdvisor.name} will process it and send you a confirmation within 24 hours.
        </p>

        {/* Next Steps */}
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Next Steps</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Expect a call from {mockAdvisor.name} for final confirmation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Complete KYC verification (takes ~5 minutes)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Transfer funds via bank or e-payment</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">4</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Track your investment in the app</span>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/advisor/dashboard')}
            className="flex-1 px-6 py-3 h-10 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            Back Home
          </button>
          <button
            onClick={() => alert('Opening portfolio tracker...')}
            className="flex-1 px-6 py-3 h-10 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors dark:bg-green-500 dark:hover:bg-green-600"
          >
            View Portfolio
          </button>
        </div>
      </div>
    </div>
  );
};
