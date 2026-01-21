import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockFunds } from '../data/mockData';

/**
 * MINIMAL FUND CURATION PAGE
 * 
 * Features:
 * - Search funds (simple text input)
 * - Filter: Category dropdown (Equity/Debt/Hybrid)
 * - Results: Card grid (3 columns)
 * - Each card shows: Name, 3Y Return, Risk Level, "Add" button
 * - Selected funds panel on right (sticky)
 * - Save button at bottom
 */
export const MinimalFundCuration: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedFundIds, setSelectedFundIds] = useState<Set<string>>(new Set());

  const categories = useMemo(() => {
    const cats = new Set(mockFunds.map(f => f.category));
    return Array.from(cats).sort();
  }, []);

  // Filter and search
  const filteredFunds = useMemo(() => {
    return mockFunds.filter(fund => {
      const matchesSearch = fund.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === 'ALL' || fund.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const selectedFunds = useMemo(() => {
    return Array.from(selectedFundIds)
      .map(id => mockFunds.find(f => f.id === id))
      .filter((fund): fund is typeof mockFunds[0] => fund !== undefined);
  }, [selectedFundIds]);

  const handleToggleFund = (fundId: string) => {
    const newSelected = new Set(selectedFundIds);
    if (newSelected.has(fundId)) {
      newSelected.delete(fundId);
    } else {
      newSelected.add(fundId);
    }
    setSelectedFundIds(newSelected);
  };

  const handleSave = () => {
    // TODO: Save selected funds to client proposal
    console.log('Saving selected funds:', selectedFundIds);
    navigate('/advisor/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/advisor/dashboard')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Curate Funds
          </h1>
          <div className="w-12" /> {/* Spacer for symmetry */}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fund Curation Panel */}
        <div className="lg:col-span-2">
          {/* Controls */}
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search funds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
              >
                <option value="ALL">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fund Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFunds.map(fund => (
              <div
                key={fund.id}
                className={`bg-white dark:bg-gray-950 border-2 rounded-lg p-6 transition-colors cursor-pointer ${
                  selectedFundIds.has(fund.id)
                    ? 'border-blue-600 dark:border-blue-400'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
                onClick={() => handleToggleFund(fund.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {fund.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {fund.category}
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                      selectedFundIds.has(fund.id)
                        ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500'
                        : 'border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {selectedFundIds.has(fund.id) && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      3Y Return
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {fund.returns3Y}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Risk Level
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      fund.riskLevel === 'Conservative'
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : fund.riskLevel === 'Balanced'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                        : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                    }`}>
                      {fund.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFunds.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No funds found matching your criteria
              </p>
            </div>
          )}
        </div>

        {/* Selected Funds Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Selected Funds ({selectedFunds.length})
            </h2>

            {selectedFunds.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 py-12 text-center">
                Select funds from the list
              </p>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                  {selectedFunds.map(fund => (
                    <div
                      key={fund.id}
                      className="flex justify-between items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {fund.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {fund.returns3Y}% return
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleFund(fund.id)}
                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSave}
                  className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Save & Continue
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
