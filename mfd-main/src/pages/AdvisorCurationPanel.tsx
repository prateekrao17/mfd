import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockClients, mockFunds, getFundsByRiskProfile } from '../data/mockData';
import { RiskProfile, CuratedFund } from '../types';
import { formatPercentage } from '../data/mockData';

/**
 * Advisor Curation Panel
 * 
 * Product Logic:
 * - Advisor selects 3-5 funds from system suggestions (based on client risk profile)
 * - Adds personal note per fund (trust-building, personalized touch)
 * - Creates proposal to share with client
 * - Updates client journey stage
 * 
 * UX Principle: Efficient workflow, clear fund comparison, easy note-taking
 */
export const AdvisorCurationPanel: React.FC = () => {
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();
  const client = mockClients.find(c => c.id === clientId);

  const [selectedFunds, setSelectedFunds] = useState<Set<string>>(new Set());
  const [fundNotes, setFundNotes] = useState<Record<string, string>>({});

  // Get suggested funds based on client's risk profile
  const suggestedFunds = useMemo(() => {
    if (!client?.riskProfile) return mockFunds.slice(0, 8);
    return getFundsByRiskProfile(client.riskProfile);
  }, [client]);

  const handleToggleFund = (fundId: string) => {
    const newSelected = new Set(selectedFunds);
    if (newSelected.has(fundId)) {
      newSelected.delete(fundId);
    } else {
      // Limit to 5 funds max (reduces choice overload for client)
      if (newSelected.size < 5) {
        newSelected.add(fundId);
      }
    }
    setSelectedFunds(newSelected);
  };

  const handleNoteChange = (fundId: string, note: string) => {
    setFundNotes(prev => ({ ...prev, [fundId]: note }));
  };

  const handleCreateProposal = () => {
    // In real app, this would save to backend
    // For now, we'll just navigate to client view
    console.log('Creating proposal with funds:', Array.from(selectedFunds));
    console.log('Notes:', fundNotes);
    
    // Update client journey stage (in real app, via API)
    // Navigate to client's fund recommendation view
    navigate(`/client/funds?advisor=${client?.advisorId}&risk=${client?.riskProfile}&clientId=${clientId}`);
  };

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card">
          <p className="text-gray-600">Client not found</p>
          <button onClick={() => navigate('/advisor/dashboard')} className="btn-primary mt-4">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/advisor/dashboard')}
            className="text-primary-600 hover:text-primary-700 mb-4 inline-flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Curate Funds for {client.name}
          </h1>
          <p className="text-gray-600">
            Select 3-5 funds and add personal notes. Your client will see these recommendations.
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Risk Profile: <span className="font-medium">{client.riskProfile || 'Not set'}</span>
          </div>
        </div>

        {/* Selection Summary */}
        {selectedFunds.size > 0 && (
          <div className="card bg-primary-50 border-primary-200 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-primary-900">
                  {selectedFunds.size} fund{selectedFunds.size !== 1 ? 's' : ''} selected
                </span>
                <span className="text-sm text-primary-700 ml-2">
                  ({5 - selectedFunds.size} more available)
                </span>
              </div>
              <button
                onClick={handleCreateProposal}
                className="btn-primary"
              >
                Create Proposal →
              </button>
            </div>
          </div>
        )}

        {/* Suggested Funds */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Suggested Funds (based on {client.riskProfile || 'client'} risk profile)
          </h2>
          <div className="space-y-4">
            {suggestedFunds.map(fund => {
              const isSelected = selectedFunds.has(fund.id);
              const note = fundNotes[fund.id] || '';

              return (
                <div
                  key={fund.id}
                  className={`card transition-all ${
                    isSelected
                      ? 'border-2 border-primary-600 bg-primary-50'
                      : 'border border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleFund(fund.id)}
                      disabled={!isSelected && selectedFunds.size >= 5}
                      className="mt-2 w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    />

                    {/* Fund Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {fund.name}
                          </h3>
                          <p className="text-sm text-gray-600">{fund.category}</p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            fund.riskLevel === 'Conservative'
                              ? 'bg-green-100 text-green-800'
                              : fund.riskLevel === 'Balanced'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {fund.riskLevel}
                        </span>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-600">3Y Returns:</span>{' '}
                          <span className="font-semibold text-green-600">
                            {formatPercentage(fund.returns3Y)}
                          </span>
                        </div>
                        {fund.sharpeRatio !== undefined && (
                          <div>
                            <span className="text-gray-600">Sharpe:</span>{' '}
                            <span className="font-semibold">{fund.sharpeRatio.toFixed(2)}</span>
                          </div>
                        )}
                        {fund.expenseRatio !== undefined && (
                          <div>
                            <span className="text-gray-600">Expense:</span>{' '}
                            <span className="font-semibold">
                              {formatPercentage(fund.expenseRatio)}
                            </span>
                          </div>
                        )}
                        {fund.fundManager && (
                          <div>
                            <span className="text-gray-600">Manager:</span>{' '}
                            <span className="font-semibold">{fund.fundManager}</span>
                          </div>
                        )}
                      </div>

                      {/* Personal Note Input */}
                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Add a personal note for {client.name}:
                          </label>
                          <textarea
                            value={note}
                            onChange={(e) => handleNoteChange(fund.id, e.target.value)}
                            placeholder="E.g., 'Great for long-term wealth creation. Strong management team.'"
                            className="input-field min-h-[80px] resize-none"
                            maxLength={300}
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            {note.length}/300 characters
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate('/advisor/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateProposal}
            disabled={selectedFunds.size < 3}
            className="btn-primary"
          >
            Create Proposal ({selectedFunds.size} funds)
          </button>
        </div>
      </div>
    </div>
  );
};
