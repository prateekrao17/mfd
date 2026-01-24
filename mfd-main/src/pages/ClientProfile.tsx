import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockClients } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';
import { ClientWithProfile } from '../data/mockData';

/**
 * CLIENT PROFILE PAGE
 * Shows KYC status, risk profile, and current portfolio holdings
 * Accessible from dashboard "View Profile" button
 * Allows quick navigation to "Create Proposal"
 */
export const ClientProfile: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const client = useMemo(() => {
    return mockClients.find(c => c.id === clientId) as ClientWithProfile | undefined;
  }, [clientId]);

  if (!client) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className={`text-2xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
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

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`border-b ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigate('/advisor/dashboard')}
              className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              ← Back
            </button>
            <button
              onClick={() => navigate(`/advisor/curate-minimal/${clientId}`)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Create Proposal
            </button>
          </div>
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {client.name}'s Profile
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Complete investment overview
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* KYC Status Card */}
        <div className={`border rounded-lg p-6 mb-6 ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
          <h2 className={`font-semibold mb-4 text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            KYC Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Status
              </label>
              <p className={`font-medium text-green-600 mt-1 ${theme === 'dark' ? 'dark:text-green-400' : ''}`}>
                ✓ {client.kycStatus}
              </p>
            </div>
            <div>
              <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                PAN Card
              </label>
              <p className={`font-medium mt-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                {client.panCard || 'N/A'}
              </p>
            </div>
            <div>
              <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Investor Type
              </label>
              <p className={`font-medium mt-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                {client.investorType || 'Individual'}
              </p>
            </div>
            <div>
              <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                KYC Completed
              </label>
              <p className={`font-medium mt-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                {client.kycCompletedDate ? new Date(client.kycCompletedDate).toLocaleDateString('en-IN') : 'Pending'}
              </p>
            </div>
          </div>
        </div>

        {/* Risk Profile Card */}
        <div className={`border rounded-lg p-6 mb-6 ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
          <h2 className={`font-semibold mb-4 text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Risk Profile
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Risk Tolerance
              </label>
              <p className={`font-medium mt-1 text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {client.riskProfile}
              </p>
            </div>
            <div>
              <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Investment Goal
              </label>
              <p className={`font-medium mt-1 text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {client.investmentGoal || 'N/A'}
              </p>
            </div>
            <div>
              <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Time Horizon
              </label>
              <p className={`font-medium mt-1 text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {client.timeHorizon || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Current Investments Card */}
        {client.currentInvestments && (
          <div className={`border rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
            <h2 className={`font-semibold mb-6 text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Current Investments
            </h2>

            {/* Total Invested Amount */}
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Invested Amount
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                ₹{client.currentInvestments.totalAmount.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Asset Allocation */}
            <div className="mb-8">
              <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Asset Allocation
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`text-center p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {client.currentInvestments.assetAllocation.equity}%
                  </div>
                  <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Equity
                  </div>
                </div>
                <div className={`text-center p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {client.currentInvestments.assetAllocation.debt}%
                  </div>
                  <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Debt
                  </div>
                </div>
                <div className={`text-center p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {client.currentInvestments.assetAllocation.hybrid}%
                  </div>
                  <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Hybrid
                  </div>
                </div>
                <div className={`text-center p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {client.currentInvestments.assetAllocation.other}%
                  </div>
                  <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Other
                  </div>
                </div>
              </div>
            </div>

            {/* Holdings Table */}
            <div>
              <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Fund Holdings
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                      <th className={`text-left py-3 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Fund Name
                      </th>
                      <th className={`text-right py-3 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Invested
                      </th>
                      <th className={`text-right py-3 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Current Value
                      </th>
                      <th className={`text-right py-3 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Returns
                      </th>
                      <th className={`text-left py-3 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Since
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {client.currentInvestments.holdings.map((holding, idx) => (
                      <tr
                        key={idx}
                        className={`border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}
                      >
                        <td className={`py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                          {holding.fundName}
                        </td>
                        <td className={`py-3 text-right ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          ₹{holding.amountInvested.toLocaleString('en-IN')}
                        </td>
                        <td className={`py-3 text-right font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                          ₹{holding.currentValue.toLocaleString('en-IN')}
                        </td>
                        <td className={`py-3 text-right font-medium ${
                          holding.returns >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {holding.returns >= 0 ? '+' : ''}{holding.returns}%
                        </td>
                        <td className={`py-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(holding.investedDate).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientProfile;
