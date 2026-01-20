import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockClients } from '../data/mockData';
import { fundDatabase, getAIRecommendations, calculatePortfolioAllocation } from '../data/fundDatabase';
import { Fund, Client, CuratedFund } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface SelectedFund extends CuratedFund {
  allocation: number; // percentage of portfolio
}

/**
 * Advanced Fund Curation Interface
 * Features: Dual-panel explorer, comparison matrix, AI recommendations, portfolio allocation
 */
export const AdvancedFundCuration: React.FC = () => {
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();
  const client = mockClients.find((c) => c.id === clientId);

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [fundHouseFilter, setFundHouseFilter] = useState<string>('All');
  const [minReturns3Y, setMinReturns3Y] = useState<number>(0);
  const [maxExpenseRatio, setMaxExpenseRatio] = useState<number>(3);
  const [selectedFunds, setSelectedFunds] = useState<SelectedFund[]>([]);
  const [comparisonFunds, setComparisonFunds] = useState<Fund[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [advisorNote, setAdvisorNote] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  if (!client) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Client not found</div>
      </div>
    );
  }

  // Get AI recommendations
  const aiRecommendations = useMemo(() => {
    return getAIRecommendations(client.riskProfile ?? 'Balanced');
  }, [client.riskProfile]);

  // Get unique values for filters
  const categories = useMemo(() => {
    const cats = new Set(fundDatabase.map((f) => f.category));
    return ['All', ...Array.from(cats).sort()];
  }, []);

  const fundHouses = useMemo(() => {
    const houses = new Set(fundDatabase.map((f) => f.fundHouse).filter(Boolean));
    return ['All', ...Array.from(houses).sort()];
  }, []);

  // Filter funds
  const filteredFunds = useMemo(() => {
    return fundDatabase.filter((fund) => {
      if (searchTerm && !fund.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (selectedCategory !== 'All' && fund.category !== selectedCategory) {
        return false;
      }
      if (selectedRisk !== 'All' && fund.riskLevel !== selectedRisk) {
        return false;
      }
      if (fundHouseFilter !== 'All' && fund.fundHouse !== fundHouseFilter) {
        return false;
      }
      if (fund.returns3Y < minReturns3Y) {
        return false;
      }
      if ((fund.expenseRatio ?? 0) > maxExpenseRatio) {
        return false;
      }
      return true;
    });
  }, [searchTerm, selectedCategory, selectedRisk, fundHouseFilter, minReturns3Y, maxExpenseRatio]);

  // Calculate portfolio allocation
  const portfolioAllocation = useMemo(() => {
    const fundsWithAllocation = selectedFunds.map((sf) => ({
      fund: sf,
      allocation: sf.allocation,
    }));
    return calculatePortfolioAllocation(fundsWithAllocation);
  }, [selectedFunds]);

  // Check if allocation matches risk profile
  const allocationWarning = useMemo(() => {
    const { equity } = portfolioAllocation;
    const riskProfile = client.riskProfile;

    if (riskProfile === 'Conservative' && equity > 40) {
      return 'High equity allocation for conservative profile. Consider reducing equity exposure.';
    }
    if (riskProfile === 'Growth' && equity < 70) {
      return 'Low equity allocation for growth profile. Consider increasing equity exposure.';
    }
    return null;
  }, [portfolioAllocation, client.riskProfile]);

  // Handlers
  const handleAddFund = (fund: Fund) => {
    if (selectedFunds.find((f) => f.id === fund.id)) {
      return; // Already added
    }

    const allocation = selectedFunds.length === 0 ? 100 : 0;
    const curatedFund: SelectedFund = {
      ...fund,
      isSelected: true,
      advisorNote: '',
      allocation,
    };

    setSelectedFunds([...selectedFunds, curatedFund]);
  };

  const handleRemoveFund = (fundId: string) => {
    setSelectedFunds(selectedFunds.filter((f) => f.id !== fundId));
  };

  const handleUpdateAllocation = (fundId: string, allocation: number) => {
    setSelectedFunds(
      selectedFunds.map((f) => (f.id === fundId ? { ...f, allocation: Math.min(100, Math.max(0, allocation)) } : f))
    );
  };

  const handleUpdateNote = (fundId: string, note: string) => {
    setSelectedFunds(selectedFunds.map((f) => (f.id === fundId ? { ...f, advisorNote: note } : f)));
  };

  const handleAddToComparison = (fund: Fund) => {
    if (comparisonFunds.length >= 5) {
      alert('Maximum 5 funds can be compared');
      return;
    }
    if (comparisonFunds.find((f) => f.id === fund.id)) {
      return;
    }
    setComparisonFunds([...comparisonFunds, fund]);
    setShowComparison(true);
  };

  const handleRemoveFromComparison = (fundId: string) => {
    setComparisonFunds(comparisonFunds.filter((f) => f.id !== fundId));
  };

  const handleApplyTemplate = (template: string) => {
    const templates: Record<string, string> = {
      conservative:
        '**Recommended for Conservative Investors:**\n\nThis portfolio is designed to preserve capital while generating steady returns. The allocation focuses on high-quality debt instruments and balanced funds with proven track records.\n\n**Key Features:**\n• Low volatility\n• Capital preservation\n• Steady income generation\n• Suitable for risk-averse investors',
      tax_saving:
        '**Tax-Saving Investment Strategy:**\n\nThis portfolio includes ELSS funds that qualify for tax deduction under Section 80C while offering long-term wealth creation potential.\n\n**Tax Benefits:**\n• Up to ₹1.5L deduction under 80C\n• 3-year lock-in period\n• Long-term capital gains benefits\n• Equity exposure for growth',
      growth:
        '**Growth-Oriented Portfolio:**\n\nThis aggressive portfolio aims for maximum capital appreciation through carefully selected equity funds across market caps and sectors.\n\n**Growth Strategy:**\n• High equity allocation\n• Diversified across caps\n• Active fund management\n• Long-term wealth creation focus',
    };

    setAdvisorNote(templates[template] || '');
    setSelectedTemplate(template);
  };

  const totalAllocation = selectedFunds.reduce((sum, f) => sum + f.allocation, 0);

  const pieData = [
    { name: 'Equity', value: portfolioAllocation.equity, color: '#10b981' },
    { name: 'Debt', value: portfolioAllocation.debt, color: '#3b82f6' },
    { name: 'Cash', value: portfolioAllocation.cash, color: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Fund Curation</h1>
              <p className="text-sm text-slate-300/80 mt-1">
                Client: {client.name} • Risk Profile: {client.riskProfile}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`btn-secondary ${comparisonFunds.length > 0 ? 'relative' : ''}`}
              >
                Compare Funds
                {comparisonFunds.length > 0 && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">
                    {comparisonFunds.length}
                  </span>
                )}
              </button>
              <button onClick={() => navigate('/advisor/dashboard')} className="btn-primary">
                Save & Close
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Recommendations Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white mb-2">AI-Powered Recommendations for {client.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {aiRecommendations.map((rec) => (
                  <div key={rec.fund.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{rec.fund.name}</div>
                        <div className="text-xs text-slate-300/70 mt-1">{rec.fund.category}</div>
                      </div>
                      <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-200 text-xs rounded-full">
                        {rec.score}%
                      </div>
                    </div>
                    <p className="text-xs text-slate-300/80 mb-2">{rec.reason}</p>
                    <button
                      onClick={() => handleAddFund(rec.fund)}
                      className="w-full px-3 py-1.5 bg-purple-500/20 text-purple-200 text-xs rounded hover:bg-purple-500/30 transition"
                    >
                      Add to Portfolio
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Dual-Panel Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Fund Universe */}
          <div className="col-span-7">
            <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white mb-4">Fund Universe</h2>

                {/* Filters */}
                <div className="space-y-3">
                  {/* Search */}
                  <input
                    type="text"
                    placeholder="Search funds..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />

                  {/* Filter Row 1 */}
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedRisk}
                      onChange={(e) => setSelectedRisk(e.target.value)}
                      className="px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="All">All Risk Levels</option>
                      <option value="Conservative">Conservative</option>
                      <option value="Balanced">Balanced</option>
                      <option value="Growth">Growth</option>
                    </select>

                    <select
                      value={fundHouseFilter}
                      onChange={(e) => setFundHouseFilter(e.target.value)}
                      className="px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {fundHouses.map((house) => (
                        <option key={house} value={house}>
                          {house}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter Row 2 */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-300/80 mb-1 block">Min 3Y Returns: {minReturns3Y}%</label>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        step="1"
                        value={minReturns3Y}
                        onChange={(e) => setMinReturns3Y(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300/80 mb-1 block">Max Expense: {maxExpenseRatio}%</label>
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.1"
                        value={maxExpenseRatio}
                        onChange={(e) => setMaxExpenseRatio(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fund List */}
              <div className="max-h-[600px] overflow-y-auto">
                {filteredFunds.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">No funds match your filters</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-white/5 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-200">Fund</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-200">3Y Return</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-200">Rating</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-200">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFunds.map((fund, idx) => (
                        <tr
                          key={fund.id}
                          className={`border-t border-white/5 hover:bg-white/5 transition ${
                            idx % 2 === 0 ? 'bg-white/[0.02]' : ''
                          }`}
                        >
                          <td className="px-3 py-3">
                            <div className="font-medium text-white">{fund.name}</div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {fund.category} • {fund.fundHouse}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="text-emerald-400 font-semibold">{fund.returns3Y.toFixed(1)}%</div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: fund.rating ?? 0 }).map((_, i) => (
                                <svg key={i} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleAddFund(fund)}
                                disabled={selectedFunds.some((f) => f.id === fund.id)}
                                className="px-2 py-1 bg-primary-500/20 text-primary-200 text-xs rounded hover:bg-primary-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => handleAddToComparison(fund)}
                                className="px-2 py-1 bg-white/10 text-slate-200 text-xs rounded hover:bg-white/15 transition"
                              >
                                Compare
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Curated Selection */}
          <div className="col-span-5 space-y-6">
            {/* Portfolio Allocation Chart */}
            <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Portfolio Allocation</h3>
              {selectedFunds.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">Add funds to see allocation</div>
              ) : (
                <>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData.filter((d) => d.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {pieData.map((item) => (
                      <div key={item.name} className="text-center">
                        <div className="text-xs text-slate-400">{item.name}</div>
                        <div className="text-sm font-semibold text-white">{item.value}%</div>
                      </div>
                    ))}
                  </div>
                  {allocationWarning && (
                    <div className="mt-3 p-2 bg-amber-500/20 border border-amber-400/30 rounded text-xs text-amber-200">
                      ⚠️ {allocationWarning}
                    </div>
                  )}
                  {totalAllocation !== 100 && (
                    <div className="mt-2 p-2 bg-red-500/20 border border-red-400/30 rounded text-xs text-red-200">
                      ⚠️ Total allocation: {totalAllocation.toFixed(0)}% (should be 100%)
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Selected Funds */}
            <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm font-semibold text-white">
                  Curated Portfolio ({selectedFunds.length} funds)
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {selectedFunds.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    Drag funds here or click "Add" to build portfolio
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {selectedFunds.map((fund) => (
                      <div key={fund.id} className="p-3 hover:bg-white/5 transition">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white">{fund.name}</div>
                            <div className="text-xs text-slate-400">{fund.category}</div>
                          </div>
                          <button
                            onClick={() => handleRemoveFund(fund.id)}
                            className="p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="mb-2">
                          <label className="text-xs text-slate-400 block mb-1">Allocation: {fund.allocation}%</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={fund.allocation}
                            onChange={(e) => handleUpdateAllocation(fund.id, Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <textarea
                          placeholder="Add personal note for client..."
                          value={fund.advisorNote}
                          onChange={(e) => handleUpdateNote(fund.id, e.target.value)}
                          className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Personalization Tools */}
            <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Personalization</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-2">Template Library:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleApplyTemplate('conservative')}
                      className={`px-2 py-1.5 text-xs rounded transition ${
                        selectedTemplate === 'conservative'
                          ? 'bg-primary-500/30 text-primary-200 border border-primary-400/50'
                          : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      Conservative
                    </button>
                    <button
                      onClick={() => handleApplyTemplate('tax_saving')}
                      className={`px-2 py-1.5 text-xs rounded transition ${
                        selectedTemplate === 'tax_saving'
                          ? 'bg-primary-500/30 text-primary-200 border border-primary-400/50'
                          : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      Tax Saving
                    </button>
                    <button
                      onClick={() => handleApplyTemplate('growth')}
                      className={`px-2 py-1.5 text-xs rounded transition ${
                        selectedTemplate === 'growth'
                          ? 'bg-primary-500/30 text-primary-200 border border-primary-400/50'
                          : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      Growth
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-2">Overall Portfolio Note:</label>
                  <textarea
                    value={advisorNote}
                    onChange={(e) => setAdvisorNote(e.target.value)}
                    placeholder="Add a personalized message for your client explaining the portfolio strategy..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={6}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {showComparison && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center p-4"
          onClick={() => setShowComparison(false)}
        >
          <div
            className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white">Fund Comparison ({comparisonFunds.length}/5)</h2>
              <button
                onClick={() => setShowComparison(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition text-slate-300 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {comparisonFunds.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                No funds selected for comparison. Click "Compare" next to any fund to add it.
              </div>
            ) : (
              <div className="p-6">
                {/* Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-3 py-3 text-left text-xs font-semibold text-slate-200">Metric</th>
                        {comparisonFunds.map((fund) => (
                          <th key={fund.id} className="px-3 py-3 text-left">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-xs font-semibold text-white">{fund.name}</div>
                                <div className="text-xs text-slate-400 mt-0.5">{fund.category}</div>
                              </div>
                              <button
                                onClick={() => handleRemoveFromComparison(fund.id)}
                                className="p-1 hover:bg-red-500/20 rounded text-red-400"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr className="hover:bg-white/5">
                        <td className="px-3 py-3 text-slate-300">1Y Returns</td>
                        {comparisonFunds.map((fund) => (
                          <td key={fund.id} className="px-3 py-3 text-emerald-400 font-semibold">
                            {fund.returns1Y?.toFixed(1) ?? '-'}%
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="px-3 py-3 text-slate-300">3Y Returns</td>
                        {comparisonFunds.map((fund) => (
                          <td key={fund.id} className="px-3 py-3 text-emerald-400 font-semibold">
                            {fund.returns3Y.toFixed(1)}%
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="px-3 py-3 text-slate-300">5Y Returns</td>
                        {comparisonFunds.map((fund) => (
                          <td key={fund.id} className="px-3 py-3 text-emerald-400 font-semibold">
                            {fund.returns5Y?.toFixed(1) ?? '-'}%
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="px-3 py-3 text-slate-300">Expense Ratio</td>
                        {comparisonFunds.map((fund) => (
                          <td key={fund.id} className="px-3 py-3 text-white">
                            {fund.expenseRatio?.toFixed(2) ?? '-'}%
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="px-3 py-3 text-slate-300">Sharpe Ratio</td>
                        {comparisonFunds.map((fund) => (
                          <td key={fund.id} className="px-3 py-3 text-white">
                            {fund.sharpeRatio?.toFixed(2) ?? '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="px-3 py-3 text-slate-300">Beta</td>
                        {comparisonFunds.map((fund) => (
                          <td key={fund.id} className="px-3 py-3 text-white">
                            {fund.beta?.toFixed(2) ?? '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="px-3 py-3 text-slate-300">Rating</td>
                        {comparisonFunds.map((fund) => (
                          <td key={fund.id} className="px-3 py-3">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: fund.rating ?? 0 }).map((_, i) => (
                                <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="px-3 py-3 text-slate-300">Fund Manager</td>
                        {comparisonFunds.map((fund) => (
                          <td key={fund.id} className="px-3 py-3 text-white text-xs">
                            {fund.fundManager ?? '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="px-3 py-3 text-slate-300">Actions</td>
                        {comparisonFunds.map((fund) => (
                          <td key={fund.id} className="px-3 py-3">
                            <button
                              onClick={() => {
                                handleAddFund(fund);
                                setShowComparison(false);
                              }}
                              disabled={selectedFunds.some((f) => f.id === fund.id)}
                              className="px-3 py-1.5 bg-primary-500/20 text-primary-200 text-xs rounded hover:bg-primary-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Add to Portfolio
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
