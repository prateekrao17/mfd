import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockFunds, mockClients, mockAdvisor } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';
import { getRecommendedFunds } from '../utils/fundRecommendation';
import { generateProposalPDF } from '../utils/pdfGenerator';

/**
 * FUND CURATION PAGE
 * 
 * Features:
 * - Auto-recommended funds based on client's risk profile
 * - Search funds (simple text input)
 * - Filter: Category dropdown
 * - Results: Card grid
 * - Selected funds panel on right (sticky)
 * - Save & Continue, Download PDF, Share buttons
 */
export const MinimalFundCuration: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const client = useMemo(() => {
    return mockClients.find(c => c.id === clientId);
  }, [clientId]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedFundIds, setSelectedFundIds] = useState<Set<string>>(new Set());
  const [advisorNote, setAdvisorNote] = useState('');
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(mockFunds.map(f => f.category));
    return Array.from(cats).sort();
  }, []);

  // Auto-recommend funds on mount
  useEffect(() => {
    if (client?.riskProfile) {
      const recommended = getRecommendedFunds(client.riskProfile, mockFunds);
      const recommendedIds = new Set(recommended.map(f => f.id));
      setSelectedFundIds(recommendedIds);
    }
  }, [client?.riskProfile]);

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

  const handleSaveAndContinue = () => {
    if (selectedFunds.length < 3) {
      alert('Please select at least 3 funds for the proposal');
      return;
    }
    setShowDownloadOptions(true);
  };

  const handleDownloadPDF = () => {
    if (!client) return;

    const proposalData = {
      advisor: {
        name: mockAdvisor.name,
        arn: mockAdvisor.arn,
        aum: mockAdvisor.aum,
        experience: mockAdvisor.experience,
        phone: mockAdvisor.phone || '+91 9876 543 210',
        email: mockAdvisor.email || 'rajesh.kumar@advisorplatform.com',
      },
      client: {
        name: client.name,
        email: client.email,
        phone: client.phone,
        riskProfile: client.riskProfile || 'Balanced',
        investmentGoal: (client as any).investmentGoal || 'Wealth Creation',
      },
      selectedFunds: selectedFunds.map(fund => ({
        name: fund.name,
        category: fund.category,
        returns3Y: fund.returns3Y,
        riskLevel: fund.riskLevel,
        expenseRatio: fund.expenseRatio || 1.2,
        minInvestment: 5000,
      })),
      advisorNote,
      proposalDate: new Date().toLocaleDateString('en-IN'),
    };

    generateProposalPDF(proposalData);
  };

  const handleShareViaWhatsApp = () => {
    if (!client) return;

    const message = `Hi ${client.name}, I've prepared an investment proposal for you. Please review and let me know your thoughts.`;
    const phone = client.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareViaEmail = () => {
    if (!client) return;

    const subject = `Investment Proposal - ${client.name}`;
    const body = `Dear ${client.name},\n\nI've prepared a customized investment proposal based on your ${client.riskProfile} risk profile.\n\nThe proposal includes ${selectedFunds.length} carefully selected funds that align with your investment goals.\n\nPlease find the details attached.\n\nBest regards,\n${mockAdvisor.name}\nARN: ${mockAdvisor.arn}`;
    const mailtoUrl = `mailto:${client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

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
    <div className={theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} style={{ minHeight: '100vh' }}>
      {/* Header with Client Context */}
      <header className={`border-b ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-4 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            ← Back
          </button>
          
          <div className="mb-6">
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Create Investment Proposal
            </h1>
            {client && (
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                For: <span className="font-semibold">{client.name}</span> • 
                Risk Profile: <span className="font-semibold">{client.riskProfile || 'Not Set'}</span>
              </p>
            )}
          </div>

          {/* Help Text */}
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-green-200' : 'text-green-900'}`}>
              ✓ Showing {selectedFunds.length} recommended funds for {client?.riskProfile || 'their'} risk profile. Auto-selected based on {client?.name || 'the client'}'s investment profile. You can add more funds using search.
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fund Curation Panel */}
        <div className="lg:col-span-2">
          {/* Controls */}
          <div className={`border rounded-lg p-6 mb-8 ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search funds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-900 border border-gray-800 text-white' : 'bg-gray-50 border border-gray-200 text-gray-900'}`}
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`px-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-900 border border-gray-800 text-white' : 'bg-gray-50 border border-gray-200 text-gray-900'}`}
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
                className={`border-2 rounded-lg p-6 transition-colors cursor-pointer ${
                  selectedFundIds.has(fund.id)
                    ? `border-blue-600 ${theme === 'dark' ? 'bg-gray-900' : 'bg-blue-50'}`
                    : `${theme === 'dark' ? 'bg-gray-950 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300'}`
                }`}
                onClick={() => handleToggleFund(fund.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {fund.name}
                    </h3>
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {fund.category}
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                      selectedFundIds.has(fund.id)
                        ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500'
                        : `${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`
                    }`}
                  >
                    {selectedFundIds.has(fund.id) && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                </div>

                <div className={`space-y-3 pt-4 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      3Y Return
                    </span>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {fund.returns3Y}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
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
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                No funds found matching your criteria
              </p>
            </div>
          )}
        </div>

        {/* Selected Funds Panel */}
        <div className="lg:col-span-1">
          <div className={`border rounded-lg p-6 sticky top-8 ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Selected Funds ({selectedFunds.length})
            </h2>

            {selectedFunds.length === 0 ? (
              <p className={`text-sm py-12 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Select funds from the list
              </p>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                  {selectedFunds.map(fund => (
                    <div
                      key={fund.id}
                      className={`flex justify-between items-start gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {fund.name}
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {fund.returns3Y}% return
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleFund(fund.id)}
                        className={`${theme === 'dark' ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-600'}`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Advisor Note */}
                <div className="mb-6">
                  <label className={`text-sm font-medium block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Advisor's Note
                  </label>
                  <textarea
                    value={advisorNote}
                    onChange={(e) => setAdvisorNote(e.target.value)}
                    placeholder="Add your personalized recommendation..."
                    className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20 ${
                      theme === 'dark'
                        ? 'bg-gray-900 border border-gray-800 text-white placeholder-gray-500'
                        : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>

                {!showDownloadOptions ? (
                  <button
                    onClick={handleSaveAndContinue}
                    disabled={selectedFunds.length < 3}
                    className={`w-full px-4 py-3 font-medium rounded-lg transition-colors ${
                      selectedFunds.length < 3
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                    }`}
                  >
                    Save & Continue
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleDownloadPDF}
                      className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600 text-sm"
                    >
                      📄 Download PDF
                    </button>
                    <button
                      onClick={handleShareViaWhatsApp}
                      className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      📱 Share via WhatsApp
                    </button>
                    <button
                      onClick={handleShareViaEmail}
                      className="w-full px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors text-sm"
                    >
                      ✉️ Send via Email
                    </button>
                    <button
                      onClick={() => {
                        setShowDownloadOptions(false);
                        setSelectedFundIds(new Set());
                      }}
                      className={`w-full px-4 py-2 font-medium rounded-lg transition-colors text-sm ${
                        theme === 'dark'
                          ? 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                          : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                      }`}
                    >
                      Start Over
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
