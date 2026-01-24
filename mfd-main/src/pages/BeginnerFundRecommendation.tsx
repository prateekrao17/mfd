import React, { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { mockFunds, mockAdvisor } from '../data/mockData';
import { RiskProfile } from '../types';

/**
 * BEGINNER FUND RECOMMENDATION
 * 
 * Shows 3-5 advisor-curated funds matching client's risk profile.
 * 
 * Design Principles:
 * - Minimal info by default (risk level, 3Y returns, advisor note)
 * - Advanced metrics hidden behind toggle
 * - Simple tooltips explain financial terms
 * - Large CTA: "Invest Now" leads to payment flow
 */
export const BeginnerFundRecommendation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const riskProfile = (searchParams.get('risk') as RiskProfile) || 'Balanced';

  // Filter funds by risk profile (3-5 recommended)
  const recommendedFunds = useMemo(() => {
    return mockFunds
      .filter(f => f.riskLevel === riskProfile)
      .slice(0, 5);
  }, [riskProfile]);

  const riskColors: Record<RiskProfile, { bg: string; text: string; badge: string }> = {
    Conservative: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      badge: 'bg-green-100 text-green-700',
    },
    Balanced: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      badge: 'bg-yellow-100 text-yellow-700',
    },
    Growth: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      badge: 'bg-red-100 text-red-700',
    },
  };

  const colors = riskColors[riskProfile];

  const Tooltip: React.FC<{ term: string; explanation: string; children: React.ReactNode }> = ({
    term,
    explanation,
    children,
  }) => {
    const [show, setShow] = useState(false);

    return (
      <div className="relative inline-block">
        <button
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          className="text-blue-600 dark:text-blue-400 underline cursor-help"
        >
          {children}
        </button>
        {show && (
          <div className="absolute bottom-full left-0 mb-2 p-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg whitespace-nowrap z-50">
            {explanation}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            Your Personalized Fund Selection
          </h1>
          <p className="text-gray-600 mt-1">
            Curated by {mockAdvisor.name} based on your profile
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Risk Profile Summary */}
        <div className={`${colors.bg} border border-gray-200 rounded-lg p-6 mb-12`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-lg font-semibold ${colors.text}`}>
                Your Profile: {riskProfile} Investor
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                These funds match your investment style and time horizon
              </p>
            </div>
            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${colors.badge}`}>
              {riskProfile}
            </span>
          </div>
        </div>

        {/* Funds */}
        <div className="space-y-6 mb-12">
          {recommendedFunds.map((fund, idx) => (
            <div
              key={fund.id}
              className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow"
            >
              {/* Fund Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {idx + 1}. {fund.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {fund.fundHouse} • Managed by {fund.fundManager}
                  </p>
                </div>
              </div>

              {/* Key Metrics (Beginner View) */}
              <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                    3-Year Returns
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {fund.returns3Y}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                    Risk Level
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors.badge}`}>
                    {fund.riskLevel}
                  </span>
                </div>
              </div>

              {/* Advisor Note */}
              {fund.fundManager && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Why this fund?
                  </p>
                  <p className="text-sm text-gray-700 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    💡 Managed by {fund.fundManager}, a seasoned fund manager with proven track record in {fund.category.toLowerCase()}
                  </p>
                </div>
              )}

              {/* Key Details Cards - Simplified */}
              {showAdvanced && (
                <div className="mb-6 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-2 uppercase tracking-wide font-semibold">Expense Ratio</p>
                      <p className="text-lg font-bold text-gray-900">{fund.expenseRatio}%</p>
                      <p className="text-xs text-gray-600 mt-1">Annual fee</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-2 uppercase tracking-wide font-semibold">Fund Size</p>
                      <p className="text-lg font-bold text-gray-900">₹{(fund.aum! / 1000000000).toFixed(1)}B</p>
                      <p className="text-xs text-gray-600 mt-1">Assets managed</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-2 uppercase tracking-wide font-semibold">Sharpe Ratio</p>
                      <p className="text-lg font-bold text-gray-900">{fund.sharpeRatio?.toFixed(2) || 'N/A'}</p>
                      <p className="text-xs text-gray-600 mt-1">Risk-adjusted return</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-2 uppercase tracking-wide font-semibold">Beta</p>
                      <p className="text-lg font-bold text-gray-900">{fund.beta?.toFixed(2) || 'N/A'}</p>
                      <p className="text-xs text-gray-600 mt-1">Market volatility</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/client/proposal')}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Select This Fund
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Toggle */}
        <div className="text-center pb-12">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            {showAdvanced ? 'Hide' : 'View'} Advanced Metrics
          </button>
        </div>

        {/* Educational Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-700">
            💬 Have questions? {mockAdvisor.name} is here to help. Contact them directly or reply to get personalized advice.
          </p>
        </div>
      </main>
    </div>
  );
};
