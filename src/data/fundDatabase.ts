import { Fund } from '../types';

/**
 * Comprehensive fund database for the curation interface
 * In a real app, this would be fetched from AMFI API or similar
 */
export const fundDatabase: Fund[] = [
  // Large Cap Equity Funds
  {
    id: 'fund_001',
    name: 'HDFC Top 100 Fund',
    category: 'Large Cap Equity',
    riskLevel: 'Growth',
    fundHouse: 'HDFC',
    returns1Y: 22.5,
    returns3Y: 18.5,
    returns5Y: 16.2,
    sharpeRatio: 1.42,
    beta: 0.95,
    alpha: 2.3,
    expenseRatio: 1.2,
    fundManager: 'Chirag Setalvad',
    aum: 12500000000,
    rating: 5,
    minInvestment: 5000,
    exitLoad: '1% if redeemed within 1 year',
    assetAllocation: { equity: 95, debt: 3, cash: 2 },
  },
  {
    id: 'fund_002',
    name: 'SBI Bluechip Fund',
    category: 'Large Cap Equity',
    riskLevel: 'Growth',
    fundHouse: 'SBI',
    returns1Y: 20.8,
    returns3Y: 16.8,
    returns5Y: 15.5,
    sharpeRatio: 1.38,
    beta: 0.92,
    alpha: 1.8,
    expenseRatio: 1.15,
    fundManager: 'R. Srinivasan',
    aum: 28000000000,
    rating: 4,
    minInvestment: 5000,
    exitLoad: '1% if redeemed within 1 year',
    assetAllocation: { equity: 96, debt: 2, cash: 2 },
  },
  {
    id: 'fund_003',
    name: 'ICICI Prudential Bluechip Fund',
    category: 'Large Cap Equity',
    riskLevel: 'Growth',
    fundHouse: 'ICICI Prudential',
    returns1Y: 21.2,
    returns3Y: 17.5,
    returns5Y: 16.0,
    sharpeRatio: 1.40,
    beta: 0.94,
    alpha: 2.0,
    expenseRatio: 1.18,
    fundManager: 'Sankaran Naren',
    aum: 35000000000,
    rating: 5,
    minInvestment: 5000,
    exitLoad: '1% if redeemed within 1 year',
    assetAllocation: { equity: 97, debt: 2, cash: 1 },
  },

  // Mid Cap Equity Funds
  {
    id: 'fund_004',
    name: 'Axis Midcap Fund',
    category: 'Mid Cap Equity',
    riskLevel: 'Growth',
    fundHouse: 'Axis',
    returns1Y: 28.5,
    returns3Y: 22.3,
    returns5Y: 19.8,
    sharpeRatio: 1.55,
    beta: 1.12,
    alpha: 3.5,
    expenseRatio: 1.35,
    fundManager: 'Shreyash Devalkar',
    aum: 15000000000,
    rating: 5,
    minInvestment: 5000,
    exitLoad: '1% if redeemed within 1 year',
    assetAllocation: { equity: 98, debt: 1, cash: 1 },
  },
  {
    id: 'fund_005',
    name: 'Kotak Emerging Equity Fund',
    category: 'Mid Cap Equity',
    riskLevel: 'Growth',
    fundHouse: 'Kotak',
    returns1Y: 26.8,
    returns3Y: 20.5,
    returns5Y: 18.2,
    sharpeRatio: 1.48,
    beta: 1.08,
    alpha: 3.0,
    expenseRatio: 1.28,
    fundManager: 'Pankaj Tibrewal',
    aum: 22000000000,
    rating: 4,
    minInvestment: 5000,
    exitLoad: '1% if redeemed within 1 year',
    assetAllocation: { equity: 97, debt: 2, cash: 1 },
  },

  // ELSS (Tax Saving)
  {
    id: 'fund_006',
    name: 'Axis Long Term Equity Fund',
    category: 'ELSS',
    riskLevel: 'Growth',
    fundHouse: 'Axis',
    returns1Y: 24.3,
    returns3Y: 19.3,
    returns5Y: 17.8,
    sharpeRatio: 1.52,
    beta: 0.98,
    alpha: 2.8,
    expenseRatio: 1.25,
    fundManager: 'Jinesh Gopani',
    aum: 32000000000,
    rating: 5,
    minInvestment: 500,
    exitLoad: 'Lock-in period: 3 years',
    assetAllocation: { equity: 95, debt: 3, cash: 2 },
  },
  {
    id: 'fund_007',
    name: 'Mirae Asset Tax Saver Fund',
    category: 'ELSS',
    riskLevel: 'Growth',
    fundHouse: 'Mirae Asset',
    returns1Y: 23.5,
    returns3Y: 18.8,
    returns5Y: 17.2,
    sharpeRatio: 1.48,
    beta: 1.02,
    alpha: 2.5,
    expenseRatio: 1.22,
    fundManager: 'Neelesh Surana',
    aum: 18000000000,
    rating: 4,
    minInvestment: 500,
    exitLoad: 'Lock-in period: 3 years',
    assetAllocation: { equity: 96, debt: 2, cash: 2 },
  },

  // Balanced/Hybrid Funds
  {
    id: 'fund_008',
    name: 'ICICI Prudential Balanced Advantage',
    category: 'Balanced Hybrid',
    riskLevel: 'Balanced',
    fundHouse: 'ICICI Prudential',
    returns1Y: 16.2,
    returns3Y: 14.2,
    returns5Y: 12.8,
    sharpeRatio: 1.35,
    beta: 0.75,
    alpha: 1.8,
    expenseRatio: 1.05,
    fundManager: 'Manish Banthia',
    aum: 45000000000,
    rating: 5,
    minInvestment: 5000,
    exitLoad: '1% if redeemed within 1 year',
    assetAllocation: { equity: 65, debt: 32, cash: 3 },
  },
  {
    id: 'fund_009',
    name: 'HDFC Balanced Advantage Fund',
    category: 'Balanced Hybrid',
    riskLevel: 'Balanced',
    fundHouse: 'HDFC',
    returns1Y: 15.8,
    returns3Y: 13.8,
    returns5Y: 12.5,
    sharpeRatio: 1.32,
    beta: 0.72,
    alpha: 1.5,
    expenseRatio: 1.0,
    fundManager: 'Gopal Agrawal',
    aum: 18000000000,
    rating: 4,
    minInvestment: 5000,
    exitLoad: '1% if redeemed within 1 year',
    assetAllocation: { equity: 60, debt: 37, cash: 3 },
  },
  {
    id: 'fund_010',
    name: 'SBI Equity Hybrid Fund',
    category: 'Aggressive Hybrid',
    riskLevel: 'Balanced',
    fundHouse: 'SBI',
    returns1Y: 18.5,
    returns3Y: 15.2,
    returns5Y: 13.8,
    sharpeRatio: 1.38,
    beta: 0.82,
    alpha: 2.0,
    expenseRatio: 1.12,
    fundManager: 'Sohini Andani',
    aum: 25000000000,
    rating: 4,
    minInvestment: 5000,
    exitLoad: '1% if redeemed within 1 year',
    assetAllocation: { equity: 75, debt: 22, cash: 3 },
  },

  // Debt Funds
  {
    id: 'fund_011',
    name: 'ICICI Prudential Corporate Bond Fund',
    category: 'Corporate Bond',
    riskLevel: 'Conservative',
    fundHouse: 'ICICI Prudential',
    returns1Y: 7.8,
    returns3Y: 7.2,
    returns5Y: 7.5,
    sharpeRatio: 1.12,
    beta: 0.25,
    alpha: 0.8,
    expenseRatio: 0.65,
    fundManager: 'Manish Banthia',
    aum: 32000000000,
    rating: 4,
    minInvestment: 5000,
    exitLoad: 'Nil',
    assetAllocation: { equity: 0, debt: 97, cash: 3 },
  },
  {
    id: 'fund_012',
    name: 'SBI Magnum Gilt Fund',
    category: 'Gilt',
    riskLevel: 'Conservative',
    fundHouse: 'SBI',
    returns1Y: 9.5,
    returns3Y: 8.5,
    returns5Y: 8.2,
    sharpeRatio: 1.05,
    beta: 0.15,
    alpha: 0.5,
    expenseRatio: 0.75,
    fundManager: 'Rajeev Radhakrishnan',
    aum: 8500000000,
    rating: 3,
    minInvestment: 5000,
    exitLoad: 'Nil',
    assetAllocation: { equity: 0, debt: 98, cash: 2 },
  },
  {
    id: 'fund_013',
    name: 'HDFC Short Term Debt Fund',
    category: 'Short Duration',
    riskLevel: 'Conservative',
    fundHouse: 'HDFC',
    returns1Y: 7.2,
    returns3Y: 6.8,
    returns5Y: 7.0,
    sharpeRatio: 1.18,
    beta: 0.18,
    alpha: 0.6,
    expenseRatio: 0.55,
    fundManager: 'Anil Bamboli',
    aum: 15000000000,
    rating: 4,
    minInvestment: 5000,
    exitLoad: 'Nil',
    assetAllocation: { equity: 0, debt: 96, cash: 4 },
  },

  // Sectoral Funds
  {
    id: 'fund_014',
    name: 'UTI Banking & Financial Services',
    category: 'Sectoral - Banking',
    riskLevel: 'Growth',
    fundHouse: 'UTI',
    returns1Y: 25.2,
    returns3Y: 19.2,
    returns5Y: 16.5,
    sharpeRatio: 1.48,
    beta: 1.15,
    alpha: 3.2,
    expenseRatio: 1.4,
    fundManager: 'Ankit Agarwal',
    aum: 12000000000,
    rating: 4,
    minInvestment: 5000,
    exitLoad: '1% if redeemed within 1 year',
    assetAllocation: { equity: 97, debt: 2, cash: 1 },
  },
  {
    id: 'fund_015',
    name: 'ICICI Prudential Technology Fund',
    category: 'Sectoral - Technology',
    riskLevel: 'Growth',
    fundHouse: 'ICICI Prudential',
    returns1Y: 32.5,
    returns3Y: 24.8,
    returns5Y: 21.2,
    sharpeRatio: 1.62,
    beta: 1.22,
    alpha: 4.0,
    expenseRatio: 1.45,
    fundManager: 'Rajat Chandak',
    aum: 9500000000,
    rating: 5,
    minInvestment: 5000,
    exitLoad: '1% if redeemed within 1 year',
    assetAllocation: { equity: 98, debt: 1, cash: 1 },
  },
  {
    id: 'fund_016',
    name: 'SBI Healthcare Opportunities Fund',
    category: 'Sectoral - Healthcare',
    riskLevel: 'Growth',
    fundHouse: 'SBI',
    returns1Y: 28.8,
    returns3Y: 22.5,
    returns5Y: 19.8,
    sharpeRatio: 1.58,
    beta: 1.18,
    alpha: 3.8,
    expenseRatio: 1.42,
    fundManager: 'R. Srinivasan',
    aum: 7500000000,
    rating: 4,
    minInvestment: 5000,
    exitLoad: '1% if redeemed within 1 year',
    assetAllocation: { equity: 97, debt: 2, cash: 1 },
  },

  // Index Funds
  {
    id: 'fund_017',
    name: 'HDFC Index Fund - Nifty 50',
    category: 'Index - Nifty 50',
    riskLevel: 'Growth',
    fundHouse: 'HDFC',
    returns1Y: 20.2,
    returns3Y: 16.5,
    returns5Y: 14.8,
    sharpeRatio: 1.35,
    beta: 1.0,
    alpha: 0.0,
    expenseRatio: 0.25,
    fundManager: 'Anil Bamboli',
    aum: 42000000000,
    rating: 4,
    minInvestment: 5000,
    exitLoad: 'Nil',
    assetAllocation: { equity: 99, debt: 0, cash: 1 },
  },
  {
    id: 'fund_018',
    name: 'UTI Nifty Index Fund',
    category: 'Index - Nifty 50',
    riskLevel: 'Growth',
    fundHouse: 'UTI',
    returns1Y: 20.0,
    returns3Y: 16.3,
    returns5Y: 14.5,
    sharpeRatio: 1.33,
    beta: 1.0,
    alpha: 0.0,
    expenseRatio: 0.22,
    fundManager: 'Sharwan Kumar Goyal',
    aum: 35000000000,
    rating: 4,
    minInvestment: 5000,
    exitLoad: 'Nil',
    assetAllocation: { equity: 99, debt: 0, cash: 1 },
  },

  // Small Cap Funds
  {
    id: 'fund_019',
    name: 'Axis Small Cap Fund',
    category: 'Small Cap Equity',
    riskLevel: 'Growth',
    fundHouse: 'Axis',
    returns1Y: 35.2,
    returns3Y: 26.8,
    returns5Y: 23.5,
    sharpeRatio: 1.65,
    beta: 1.28,
    alpha: 4.5,
    expenseRatio: 1.48,
    fundManager: 'Anupam Tiwari',
    aum: 8500000000,
    rating: 5,
    minInvestment: 5000,
    exitLoad: '1% if redeemed within 1 year',
    assetAllocation: { equity: 98, debt: 1, cash: 1 },
  },
  {
    id: 'fund_020',
    name: 'SBI Small Cap Fund',
    category: 'Small Cap Equity',
    riskLevel: 'Growth',
    fundHouse: 'SBI',
    returns1Y: 32.8,
    returns3Y: 24.5,
    returns5Y: 21.2,
    sharpeRatio: 1.58,
    beta: 1.25,
    alpha: 4.2,
    expenseRatio: 1.45,
    fundManager: 'R. Srinivasan',
    aum: 12000000000,
    rating: 4,
    minInvestment: 5000,
    exitLoad: '1% if redeemed within 1 year',
    assetAllocation: { equity: 97, debt: 2, cash: 1 },
  },
];

/**
 * AI-powered fund recommendations based on client profile
 */
export const getAIRecommendations = (
  riskProfile: 'Conservative' | 'Balanced' | 'Growth',
  goal?: string,
  timeHorizon?: string
): Array<{ fund: Fund; reason: string; score: number }> => {
  const recommendations: Array<{ fund: Fund; reason: string; score: number }> = [];

  if (riskProfile === 'Conservative') {
    recommendations.push({
      fund: fundDatabase.find((f) => f.id === 'fund_011')!,
      reason: 'Low volatility corporate bond fund ideal for capital preservation with steady returns.',
      score: 95,
    });
    recommendations.push({
      fund: fundDatabase.find((f) => f.id === 'fund_013')!,
      reason: 'Short duration fund offering liquidity with minimal interest rate risk.',
      score: 92,
    });
    recommendations.push({
      fund: fundDatabase.find((f) => f.id === 'fund_008')!,
      reason: 'Balanced advantage fund with dynamic asset allocation to manage downside risk.',
      score: 88,
    });
  } else if (riskProfile === 'Balanced') {
    recommendations.push({
      fund: fundDatabase.find((f) => f.id === 'fund_008')!,
      reason: 'Top-rated balanced advantage fund with consistent performance and lower volatility.',
      score: 96,
    });
    recommendations.push({
      fund: fundDatabase.find((f) => f.id === 'fund_010')!,
      reason: 'Aggressive hybrid offering equity exposure with debt cushion for stability.',
      score: 93,
    });
    recommendations.push({
      fund: fundDatabase.find((f) => f.id === 'fund_001')!,
      reason: 'Large cap fund for core equity exposure with established blue-chip companies.',
      score: 90,
    });
  } else {
    // Growth
    recommendations.push({
      fund: fundDatabase.find((f) => f.id === 'fund_001')!,
      reason: 'Premium large cap fund with excellent risk-adjusted returns and strong fund manager.',
      score: 97,
    });
    recommendations.push({
      fund: fundDatabase.find((f) => f.id === 'fund_004')!,
      reason: 'High-performing mid cap fund to capture growth potential of emerging companies.',
      score: 94,
    });
    recommendations.push({
      fund: fundDatabase.find((f) => f.id === 'fund_006')!,
      reason: 'Tax-saving ELSS fund combining wealth creation with tax benefits under 80C.',
      score: 91,
    });
  }

  return recommendations;
};

/**
 * Calculate portfolio allocation from selected funds
 */
export const calculatePortfolioAllocation = (
  funds: Array<{ fund: Fund; allocation: number }>
): { equity: number; debt: number; cash: number } => {
  let totalEquity = 0;
  let totalDebt = 0;
  let totalCash = 0;
  let totalAllocation = 0;

  funds.forEach(({ fund, allocation }) => {
    const weight = allocation / 100;
    totalEquity += (fund.assetAllocation?.equity ?? 0) * weight;
    totalDebt += (fund.assetAllocation?.debt ?? 0) * weight;
    totalCash += (fund.assetAllocation?.cash ?? 0) * weight;
    totalAllocation += allocation;
  });

  if (totalAllocation === 0) {
    return { equity: 0, debt: 0, cash: 0 };
  }

  return {
    equity: Math.round(totalEquity),
    debt: Math.round(totalDebt),
    cash: Math.round(totalCash),
  };
};
