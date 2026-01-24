import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockAdvisor, mockProposals, getFundsByRiskProfile, formatPercentage } from '../data/mockData';
import { RiskProfile, CuratedFund } from '../types';
import { AdvisorCard } from '../components/AdvisorCard';
import { Tooltip } from '../components/Tooltip';

/**
 * Beginner-Lens Fund Recommendation Screen
 * 
 * Product Logic:
 * - Shows only 3-5 advisor-curated funds (reduces choice overload)
 * - Visible by default: Risk level, 3Y returns, advisor note
 * - Hidden by default: Sharpe, Beta, Alpha (progressive disclosure)
 * - Simple tooltips for financial terms
 * - Trust-first: Shows advisor credentials
 * 
 * UX Principle: Beginner-friendly, no jargon, progressive disclosure
 */
export const FundRecommendation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const advisorId = searchParams.get('advisor') || mockAdvisor.id;
  const riskProfile = (searchParams.get('risk') as RiskProfile) || 'Balanced';
  const clientId = searchParams.get('clientId');

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Get curated funds for client, or fallback to risk-based suggestions
  const curatedFunds = useMemo(() => {
    if (clientId && mockProposals[clientId]) {
      return mockProposals[clientId].curatedFunds.filter(f => f.isSelected);
    }
    // Fallback: Show top funds by risk profile (in real app, advisor would curate these)
    return getFundsByRiskProfile(riskProfile)
      .slice(0, 4)
      .map(fund => ({ ...fund, advisorNote: undefined, isSelected: true }));
  }, [clientId, riskProfile]);

  const getRiskColor = (risk: RiskProfile) => {
    switch (risk) {
      case 'Conservative':
        return 'bg-green-100 text-green-800';
      case 'Balanced':
        return 'bg-yellow-100 text-yellow-800';
      case 'Growth':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trust-first: Show advisor credentials */}
        <div className="mb-8">
          <AdvisorCard advisor={mockAdvisor} />
        </div>

        {/* Header */}
        <div className="card mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Personalized Fund Recommendations
          </h1>
          <p className="text-gray-600">
            Based on your risk profile: <span className="font-medium">{riskProfile}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Your advisor has carefully selected these funds for you. Each fund is chosen
            to match your investment goals and risk comfort level.
          </p>
        </div>

        {/* Fund Cards */}
        <div className="space-y-4 mb-6">
          {curatedFunds.map((fund: CuratedFund) => (
            <div key={fund.id} className="card hover:shadow-md transition-shadow">
              {/* Fund Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {fund.name}
                  </h3>
                  <p className="text-sm text-gray-600">{fund.category}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${getRiskColor(fund.riskLevel)}`}
                >
                  {fund.riskLevel} Risk
                </span>
              </div>

              {/* Key Metrics (Always Visible) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600 mb-1">3-Year Returns</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatPercentage(fund.returns3Y)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Risk Level</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {fund.riskLevel}
                  </div>
                </div>
                {fund.expenseRatio && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      <Tooltip text="The annual fee charged by the fund. Lower is better.">
                        Expense Ratio
                      </Tooltip>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatPercentage(fund.expenseRatio)}
                    </div>
                  </div>
                )}
              </div>

              {/* Advisor Note (Trust-building) */}
              {fund.advisorNote && (
                <div className="mb-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-primary-600 font-semibold">💡</span>
                    <div>
                      <div className="text-sm font-medium text-primary-900 mb-1">
                        Note from your advisor:
                      </div>
                      <p className="text-sm text-primary-800">{fund.advisorNote}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Metrics (Hidden by Default) */}
              {showAdvanced && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Advanced Metrics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {fund.sharpeRatio !== undefined && (
                      <div>
                        <div className="text-gray-600 mb-1">
                          <Tooltip text="Measures risk-adjusted returns. Higher is better (typically 1+ is good).">
                            Sharpe Ratio
                          </Tooltip>
                        </div>
                        <div className="font-semibold text-gray-900">
                          {fund.sharpeRatio.toFixed(2)}
                        </div>
                      </div>
                    )}
                    {fund.beta !== undefined && (
                      <div>
                        <div className="text-gray-600 mb-1">
                          <Tooltip text="Measures volatility compared to market. 1.0 = market average. Lower = less volatile.">
                            Beta
                          </Tooltip>
                        </div>
                        <div className="font-semibold text-gray-900">
                          {fund.beta.toFixed(2)}
                        </div>
                      </div>
                    )}
                    {fund.alpha !== undefined && (
                      <div>
                        <div className="text-gray-600 mb-1">
                          <Tooltip text="Measures performance above/below market. Positive = outperformed market.">
                            Alpha
                          </Tooltip>
                        </div>
                        <div className="font-semibold text-gray-900">
                          {formatPercentage(fund.alpha)}
                        </div>
                      </div>
                    )}
                    {fund.fundManager && (
                      <div>
                        <div className="text-gray-600 mb-1">Fund Manager</div>
                        <div className="font-semibold text-gray-900">
                          {fund.fundManager}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Toggle Advanced Metrics */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            {showAdvanced ? 'Hide' : 'View'} Advanced Metrics
          </button>
        </div>

        {/* Call to Action */}
        <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ready to invest?
          </h3>
          <p className="text-gray-700 mb-4">
            Your advisor will guide you through the next steps. You can reach out to them
            directly, or proceed with the KYC process to start investing.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary">
              Start KYC Process
            </button>
            <button className="btn-secondary">
              Contact Advisor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
