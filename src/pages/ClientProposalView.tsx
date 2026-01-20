import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { mockAdvisor, mockProposals, formatCurrency } from '../data/mockData';
import { CuratedFund, RiskProfile } from '../types';
import { ChatWidget } from '../components/ChatWidget';
import { ProposalStatusTracker } from '../components/ProposalStatusTracker';

interface TestimonialData {
  name: string;
  quote: string;
  rating: number;
}

const mockTestimonials: TestimonialData[] = [
  {
    name: 'Priya Malhotra',
    quote: 'Rajesh helped me understand my investment goals clearly. His recommendations perfectly matched my risk profile.',
    rating: 5,
  },
  {
    name: 'Amit Sharma',
    quote: 'Professional, transparent, and always available for queries. Highly recommend!',
    rating: 5,
  },
  {
    name: 'Sneha Rao',
    quote: 'I was completely new to mutual funds. Rajesh made the entire process simple and stress-free.',
    rating: 5,
  },
];

const riskQuizResults = {
  Conservative: {
    summary: "Based on your goals and preferences, we've identified you as a **Conservative Investor**.",
    description: 'You prefer stability and capital preservation over high returns. Your portfolio focuses on low-risk instruments with steady growth.',
    characteristics: [
      { label: 'Risk Tolerance', value: 30, color: 'bg-blue-500' },
      { label: 'Return Expectations', value: 40, color: 'bg-emerald-500' },
      { label: 'Time Horizon', value: 50, color: 'bg-amber-500' },
    ],
  },
  Balanced: {
    summary: "Based on your goals and preferences, we've identified you as a **Balanced Investor**.",
    description: 'You seek a mix of growth and stability. Your portfolio balances between equity and debt for optimal risk-reward.',
    characteristics: [
      { label: 'Risk Tolerance', value: 60, color: 'bg-blue-500' },
      { label: 'Return Expectations', value: 65, color: 'bg-emerald-500' },
      { label: 'Time Horizon', value: 70, color: 'bg-amber-500' },
    ],
  },
  Growth: {
    summary: "Based on your goals and preferences, we've identified you as a **Growth Investor**.",
    description: 'You have high risk tolerance and long investment horizon. Your portfolio focuses on wealth creation through equity exposure.',
    characteristics: [
      { label: 'Risk Tolerance', value: 85, color: 'bg-blue-500' },
      { label: 'Return Expectations', value: 90, color: 'bg-emerald-500' },
      { label: 'Time Horizon', value: 95, color: 'bg-amber-500' },
    ],
  },
};

const faqs = [
  {
    question: 'What is a mutual fund?',
    answer: 'A mutual fund pools money from multiple investors to invest in stocks, bonds, or other securities. Professional fund managers handle the investments, making it easy for beginners to invest without expert knowledge.',
  },
  {
    question: 'How much should I invest initially?',
    answer: 'You can start with as little as ₹500 per month through SIP (Systematic Investment Plan) or make a lump sum investment of ₹5,000+. Start with an amount you\'re comfortable with and increase gradually.',
  },
  {
    question: 'What are the tax implications?',
    answer: 'Equity funds held for more than 1 year qualify for long-term capital gains with tax benefits. ELSS funds offer tax deduction up to ₹1.5L under Section 80C. Your advisor will help optimize your tax strategy.',
  },
  {
    question: 'Can I withdraw my money anytime?',
    answer: 'Most mutual funds are liquid and allow withdrawal within 1-3 business days. However, ELSS funds have a 3-year lock-in period. Some funds may have exit loads if redeemed before a specific period.',
  },
  {
    question: 'How are returns calculated?',
    answer: 'Returns are shown as annualized percentages. For example, 12% annual return on ₹1L investment means approximately ₹12,000 gain per year. Actual returns may vary based on market conditions.',
  },
];

/**
 * Client-Facing Proposal View
 * Conversion-optimized, beginner-friendly fund recommendation experience
 */
export const ClientProposalView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clientId = searchParams.get('clientId') || 'client_001';
  const riskProfile: RiskProfile = (searchParams.get('riskProfile') as RiskProfile) || 'Balanced';

  const proposal = mockProposals[clientId];
  const curatedFunds = proposal?.curatedFunds || [];

  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [selectedFunds, setSelectedFunds] = useState<Set<string>>(
    new Set(curatedFunds.filter((f) => f.isSelected).map((f) => f.id))
  );
  const [expandedFund, setExpandedFund] = useState<string | null>(null);
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showEducation, setShowEducation] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const riskData = riskQuizResults[riskProfile];

  // Calculate projected returns (mock)
  const projectedReturns = useMemo(() => {
    if (selectedFunds.size === 0) return null;

    const avgReturn = curatedFunds
      .filter((f) => selectedFunds.has(f.id))
      .reduce((sum, f) => sum + f.returns3Y, 0) / selectedFunds.size;

    return {
      oneYear: Math.round(investmentAmount * (1 + avgReturn / 100)),
      threeYear: Math.round(investmentAmount * Math.pow(1 + avgReturn / 100, 3)),
      fiveYear: Math.round(investmentAmount * Math.pow(1 + avgReturn / 100, 5)),
    };
  }, [selectedFunds, investmentAmount, curatedFunds]);

  const toggleFundSelection = (fundId: string) => {
    const newSelection = new Set(selectedFunds);
    if (newSelection.has(fundId)) {
      newSelection.delete(fundId);
    } else {
      newSelection.add(fundId);
    }
    setSelectedFunds(newSelection);
  };

  const getRiskIndicator = (riskLevel: RiskProfile) => {
    const indicators = {
      Conservative: { label: 'Low Risk', color: 'text-blue-600 bg-blue-50', icon: '🛡️' },
      Balanced: { label: 'Medium Risk', color: 'text-amber-600 bg-amber-50', icon: '⚖️' },
      Growth: { label: 'High Risk', color: 'text-red-600 bg-red-50', icon: '🚀' },
    };
    return indicators[riskLevel];
  };

  const progressPercentage = 70; // Mock progress

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Advisor Photo */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={mockAdvisor.photo}
                  alt={mockAdvisor.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  Verified
                </div>
              </div>
            </div>

            {/* Advisor Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-3">
                Curated by {mockAdvisor.name} • ARN: {mockAdvisor.arn}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Personalized Investment Plan</h1>
              <p className="text-lg text-blue-100 mb-4">
                {mockAdvisor.experience} years of experience • Managing {formatCurrency(mockAdvisor.aum)} AUM
              </p>

              {/* Testimonials Carousel */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mt-6">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm">from 150+ happy clients</span>
                </div>
                <p className="text-sm italic">"{mockTestimonials[activeTestimonial].quote}"</p>
                <p className="text-xs text-blue-100 mt-2">- {mockTestimonials[activeTestimonial].name}</p>

                {/* Carousel Dots */}
                <div className="flex gap-2 justify-center mt-3">
                  {mockTestimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTestimonial(i)}
                      className={`w-2 h-2 rounded-full transition ${
                        i === activeTestimonial ? 'bg-white w-6' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">You're {progressPercentage}% Done!</h3>
              <p className="text-sm text-gray-600">Just a few steps to start your investment journey</p>
            </div>
            <div className="text-sm text-gray-600">Est. time: 5 minutes</div>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
              <span className="text-gray-700">Profile Assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">2</div>
              <span className="font-semibold text-gray-900">Review Funds</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs">3</div>
              <span className="text-gray-500">Complete KYC</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs">4</div>
              <span className="text-gray-500">Start Investing</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Risk Profile Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Investment Profile</h2>
                  <p className="text-gray-600">{riskData.summary.replace('**', '').replace('**', '')}</p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Edit Profile</button>
              </div>

              <p className="text-gray-700 mb-6">{riskData.description}</p>

              {/* Animated Progress Bars */}
              <div className="space-y-4">
                {riskData.characteristics.map((char) => (
                  <div key={char.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">{char.label}</span>
                      <span className="text-gray-600">{char.value}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${char.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${char.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Toggle */}
            <button
              onClick={() => setShowEducation(!showEducation)}
              className="w-full bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-4 text-left hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">📚</div>
                  <div>
                    <div className="font-semibold text-gray-900">New to Mutual Funds?</div>
                    <div className="text-sm text-gray-600">Learn the basics in 2 minutes</div>
                  </div>
                </div>
                <svg
                  className={`w-6 h-6 text-gray-400 transition-transform ${showEducation ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Education Module */}
            {showEducation && (
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                {/* Video Placeholder */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Introduction Video</h3>
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                      <p className="text-gray-600">2 min • Introduction to Mutual Funds</p>
                    </div>
                  </div>
                </div>

                {/* FAQ Accordion */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Frequently Asked Questions</h3>
                  <div className="space-y-2">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                          className="w-full px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50 transition flex items-center justify-between"
                        >
                          <span>{faq.question}</span>
                          <svg
                            className={`w-5 h-5 text-gray-400 transition-transform ${
                              expandedFAQ === index ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {expandedFAQ === index && (
                          <div className="px-4 py-3 bg-gray-50 text-gray-700 text-sm">{faq.answer}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Glossary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Terms Explained</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { term: 'NAV', definition: 'Net Asset Value - price per unit of the fund' },
                      { term: 'SIP', definition: 'Systematic Investment Plan - invest regularly' },
                      { term: 'AUM', definition: 'Assets Under Management - total fund size' },
                      { term: 'Expense Ratio', definition: 'Annual fee charged by the fund' },
                    ].map((item) => (
                      <div key={item.term} className="p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-blue-900">{item.term}</div>
                        <div className="text-sm text-blue-700">{item.definition}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recommended Funds */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recommended Funds for You</h2>
                <button
                  onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showAdvancedMetrics ? 'Hide' : 'Show'} Advanced Metrics
                </button>
              </div>

              <div className="space-y-4">
                {curatedFunds.map((fund) => {
                  const indicator = getRiskIndicator(fund.riskLevel);
                  const isExpanded = expandedFund === fund.id;
                  const isSelected = selectedFunds.has(fund.id);

                  return (
                    <div
                      key={fund.id}
                      className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all ${
                        isSelected ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <div className="p-6">
                        {/* Fund Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                            {fund.name.substring(0, 2)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{fund.name}</h3>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className={`px-3 py-1 ${indicator.color} rounded-full text-sm font-medium`}>
                                {indicator.icon} {indicator.label}
                              </span>
                              <span className="text-sm text-gray-600">{fund.category}</span>
                              {fund.rating && (
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: fund.rating }).map((_, i) => (
                                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600 mb-1">3 Year Returns</div>
                            <div className="text-2xl font-bold text-emerald-600 flex items-center gap-1">
                              {fund.returns3Y.toFixed(1)}%
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Advisor Note */}
                        {fund.advisorNote && (
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl mb-4">
                            <div className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <div>
                                <div className="text-xs font-semibold text-blue-900 mb-1">Your Advisor's Note</div>
                                <div className="text-sm text-blue-800">{fund.advisorNote}</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Learn More Section */}
                        <button
                          onClick={() => setExpandedFund(isExpanded ? null : fund.id)}
                          className="w-full text-left text-blue-600 hover:text-blue-700 font-medium text-sm mb-4"
                        >
                          {isExpanded ? '▼ Show Less' : '▶ Learn More about this fund'}
                        </button>

                        {isExpanded && (
                          <div className="mb-4 p-4 bg-gray-50 rounded-xl space-y-3">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">What does this fund invest in?</h4>
                              <p className="text-sm text-gray-700">
                                This {fund.category} fund primarily invests in {fund.riskLevel === 'Conservative' ? 'government securities and high-quality corporate bonds' : fund.riskLevel === 'Balanced' ? 'a mix of stocks and bonds for balanced growth' : 'equity stocks of established companies for long-term growth'}.
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Who is this fund for?</h4>
                              <p className="text-sm text-gray-700">
                                Ideal for {fund.riskLevel === 'Conservative' ? 'risk-averse investors seeking steady returns' : fund.riskLevel === 'Balanced' ? 'investors looking for balanced risk and returns' : 'long-term investors with high risk tolerance'}.
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Example Scenario</h4>
                              <p className="text-sm text-gray-700">
                                If you invest ₹10,000/month for 5 years at {fund.returns3Y.toFixed(1)}% annual returns, you could accumulate approximately ₹{Math.round(10000 * 60 * (1 + fund.returns3Y / 1200)).toLocaleString('en-IN')}.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Advanced Metrics */}
                        {showAdvancedMetrics && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="text-xs text-gray-600 mb-1">
                                Sharpe Ratio
                                <span className="ml-1 text-blue-600 cursor-help" title="Risk-adjusted returns">ⓘ</span>
                              </div>
                              <div className="font-semibold text-gray-900">{fund.sharpeRatio?.toFixed(2) ?? '-'}</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="text-xs text-gray-600 mb-1">
                                Beta
                                <span className="ml-1 text-blue-600 cursor-help" title="Volatility vs market">ⓘ</span>
                              </div>
                              <div className="font-semibold text-gray-900">{fund.beta?.toFixed(2) ?? '-'}</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="text-xs text-gray-600 mb-1">
                                Alpha
                                <span className="ml-1 text-blue-600 cursor-help" title="Excess returns">ⓘ</span>
                              </div>
                              <div className="font-semibold text-emerald-600">{fund.alpha?.toFixed(1) ?? '-'}%</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="text-xs text-gray-600 mb-1">
                                Expense Ratio
                                <span className="ml-1 text-blue-600 cursor-help" title="Annual fee">ⓘ</span>
                              </div>
                              <div className="font-semibold text-gray-900">{fund.expenseRatio?.toFixed(2) ?? '-'}%</div>
                            </div>
                          </div>
                        )}

                        {/* Select/Deselect Button */}
                        <button
                          onClick={() => toggleFundSelection(fund.id)}
                          className={`w-full py-3 rounded-xl font-semibold transition ${
                            isSelected
                              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isSelected ? '✓ Selected for Your Portfolio' : 'Add to Portfolio'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar - Investment Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Investment Summary</h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Selected Funds</span>
                      <span className="font-semibold text-gray-900">{selectedFunds.size}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-2">Initial Investment Amount</label>
                    <input
                      type="range"
                      min="10000"
                      max="1000000"
                      step="10000"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="w-full mb-2"
                    />
                    <div className="text-center text-2xl font-bold text-blue-600">₹{investmentAmount.toLocaleString('en-IN')}</div>
                  </div>

                  {projectedReturns && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-sm font-semibold text-gray-900 mb-3">Projected Returns*</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">1 Year</span>
                          <span className="font-semibold text-emerald-600">
                            ₹{projectedReturns.oneYear.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">3 Years</span>
                          <span className="font-semibold text-emerald-600">
                            ₹{projectedReturns.threeYear.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">5 Years</span>
                          <span className="font-semibold text-emerald-600">
                            ₹{projectedReturns.fiveYear.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        *Projections based on historical returns. Actual returns may vary.
                      </p>
                    </div>
                  )}

                  <button
                    disabled={selectedFunds.size === 0}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    Start Investing →
                  </button>

                  <p className="text-xs text-center text-gray-500">
                    Secure • Paperless • 100% Digital
                  </p>
                </div>
              </div>

              {/* Proposal Status - Removed Support Contact as Chat Widget replaces it */}
              <ProposalStatusTracker
                userType="client"
                proposalCompletion={100}
                lastActivity={new Date(Date.now() - 2 * 60 * 60 * 1000)}
                recentActivity={[
                  { type: 'viewed', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget
        userType="client"
        advisorName={mockAdvisor.name}
        clientName="Priya Sharma"
      />
    </div>
  );
};
