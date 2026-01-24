import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockFunds, mockAdvisor } from '../data/mockData';

/**
 * CLIENT PROPOSAL VIEW
 * Minimal, beginner-friendly proposal review screen.
 * Shows selected funds, allocation, and confirmation.
 */
export const ClientProposalView: React.FC = () => {
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Mock selected funds for this proposal
  const selectedFunds = mockFunds.slice(0, 3);
  const totalAmount = 100000;
  const allocations = [
    { fundIndex: 0, percent: 40 },
    { fundIndex: 1, percent: 35 },
    { fundIndex: 2, percent: 25 },
  ];

  const handleConfirm = () => {
    if (!termsAccepted) return;
    setIsConfirming(true);
    setTimeout(() => {
      navigate('/client/success');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Your Investment Proposal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review and confirm your fund allocation
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Advisor Profile Card */}
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Circular Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                {mockAdvisor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-semibold mb-1">Your Advisor</p>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {mockAdvisor.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {mockAdvisor.experience}+ years experience • ARN: {mockAdvisor.arn}
                </p>
              </div>
            </div>
            <button onClick={() => navigate('/advisor/profile')} className="px-6 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex-shrink-0">
              View Profile
            </button>
          </div>
        </div>

        {/* Allocation Summary */}
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Your Fund Allocation
          </h2>

          <div className="space-y-3 mb-8">
            {allocations.map((alloc, idx) => {
              const fund = selectedFunds[alloc.fundIndex];
              const amount = (totalAmount * alloc.percent) / 100;
              return (
                <div key={fund.id}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {fund.name}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {alloc.percent}% (₹{amount.toLocaleString()})
                    </p>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        idx === 0
                          ? 'bg-blue-500'
                          : idx === 1
                          ? 'bg-purple-500'
                          : 'bg-pink-500'
                      }`}
                      style={{ width: `${alloc.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Investment */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Total Investment
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Fund Details */}
        <div className="space-y-4 mb-8">
          {allocations.map((alloc) => {
            const fund = selectedFunds[alloc.fundIndex];
            return (
              <div
                key={fund.id}
                className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {fund.name}
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">3Y Return</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {fund.returns3Y}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Risk Level</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {fund.riskLevel}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Expense Ratio</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {fund.expenseRatio}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Terms & Conditions */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border border-gray-300 dark:border-gray-700"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I understand the risks involved and confirm I'm investing based on my risk profile and financial goals.
            </span>
          </label>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 h-10 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={!termsAccepted || isConfirming}
            className="flex-1 px-6 py-3 h-10 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-green-500 dark:hover:bg-green-600"
          >
            {isConfirming ? 'Processing...' : "Let's Invest →"}
          </button>
        </div>

        {/* Trust Message */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          <p>🔒 Your data is secure. You can modify this allocation anytime.</p>
        </div>
      </main>
    </div>
  );
};
