import { Advisor, Client, Fund, ClientProposal, RiskProfile } from '../types';

// Mock advisor data (in real app, this would come from auth/session)
export const mockAdvisor: Advisor = {
  id: 'adv_001',
  name: 'Rajesh Kumar',
  arn: 'ARN-123456',
  experience: 8,
  aum: 45000000, // 4.5 Cr
  photo: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=0ea5e9&color=fff',
  clientOnboardingLink: 'https://advisor.mfdplatform.com/onboard/adv_001',
  createdAt: '2024-01-15T10:00:00Z',
};

// Mock funds database (in real app, this would be from AMFI API or similar)
export const mockFunds: Fund[] = [
  {
    id: 'fund_001',
    name: 'HDFC Top 100 Fund',
    category: 'Large Cap Equity',
    riskLevel: 'Growth',
    returns3Y: 18.5,
    sharpeRatio: 1.42,
    beta: 0.95,
    alpha: 2.3,
    expenseRatio: 1.2,
    fundManager: 'Chirag Setalvad',
    aum: 12500000000,
  },
  {
    id: 'fund_002',
    name: 'SBI Bluechip Fund',
    category: 'Large Cap Equity',
    riskLevel: 'Growth',
    returns3Y: 16.8,
    sharpeRatio: 1.38,
    beta: 0.92,
    alpha: 1.8,
    expenseRatio: 1.15,
    fundManager: 'R. Srinivasan',
    aum: 28000000000,
  },
  {
    id: 'fund_003',
    name: 'ICICI Prudential Balanced Advantage',
    category: 'Balanced Hybrid',
    riskLevel: 'Balanced',
    returns3Y: 14.2,
    sharpeRatio: 1.25,
    beta: 0.75,
    alpha: 1.5,
    expenseRatio: 1.05,
    fundManager: 'Manish Banthia',
    aum: 45000000000,
  },
  {
    id: 'fund_004',
    name: 'Axis Long Term Equity Fund',
    category: 'ELSS',
    riskLevel: 'Growth',
    returns3Y: 17.3,
    sharpeRatio: 1.45,
    beta: 0.98,
    alpha: 2.5,
    expenseRatio: 1.3,
    fundManager: 'Jinesh Gopani',
    aum: 32000000000,
  },
  {
    id: 'fund_005',
    name: 'HDFC Balanced Advantage Fund',
    category: 'Balanced Hybrid',
    riskLevel: 'Balanced',
    returns3Y: 13.8,
    sharpeRatio: 1.22,
    beta: 0.72,
    alpha: 1.2,
    expenseRatio: 1.0,
    fundManager: 'Gopal Agrawal',
    aum: 18000000000,
  },
  {
    id: 'fund_006',
    name: 'SBI Magnum Gilt Fund',
    category: 'Gilt',
    riskLevel: 'Conservative',
    returns3Y: 8.5,
    sharpeRatio: 0.95,
    beta: 0.15,
    alpha: 0.3,
    expenseRatio: 0.8,
    fundManager: 'Rajeev Radhakrishnan',
    aum: 8500000000,
  },
  {
    id: 'fund_007',
    name: 'UTI Banking & Financial Services',
    category: 'Sectoral',
    riskLevel: 'Growth',
    returns3Y: 19.2,
    sharpeRatio: 1.48,
    beta: 1.15,
    alpha: 3.2,
    expenseRatio: 1.4,
    fundManager: 'Ankit Agarwal',
    aum: 12000000000,
  },
];

// Mock clients (in real app, fetched from API)
export const mockClients: Client[] = [
  {
    id: 'client_001',
    advisorId: 'adv_001',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    riskProfile: 'Balanced',
    journeyStage: 'PROPOSAL_VIEWED',
    lastActivityAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-01-20T09:00:00Z',
    isStalled: false,
    engagementScore: 78,
    profileCompletion: 95,
    proposalViewTime: 420,
    returnVisits: 3,
    questionsAsked: 2,
    potentialAUM: 1200000,
    tags: ['High Intent', 'Returning'],
    advisorNotes: 'Very interested in balanced funds. Follow up on tax planning.',
  },
  {
    id: 'client_002',
    advisorId: 'adv_001',
    name: 'Amit Patel',
    email: 'amit.patel@email.com',
    phone: '+91 98765 43211',
    riskProfile: 'Growth',
    journeyStage: 'PROFILE_COMPLETED',
    lastActivityAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-01-18T14:30:00Z',
    isStalled: true,
    engagementScore: 25,
    profileCompletion: 80,
    proposalViewTime: 0,
    returnVisits: 0,
    questionsAsked: 0,
    potentialAUM: 2500000,
    tags: ['High Net Worth', 'Stalled'],
    advisorNotes: 'Need to send reminder about proposal.',
  },
  {
    id: 'client_003',
    advisorId: 'adv_001',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@email.com',
    phone: '+91 98765 43212',
    riskProfile: 'Conservative',
    journeyStage: 'KYC_PENDING',
    lastActivityAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-01-19T11:15:00Z',
    isStalled: false,
    engagementScore: 45,
    profileCompletion: 60,
    proposalViewTime: 0,
    returnVisits: 1,
    questionsAsked: 1,
    potentialAUM: 500000,
    tags: ['First Time Investor'],
    advisorNotes: 'Needs hand-holding. Prefers conservative options.',
  },
  {
    id: 'client_004',
    advisorId: 'adv_001',
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+91 98765 43213',
    riskProfile: 'Growth',
    journeyStage: 'INVESTED',
    lastActivityAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-01-10T10:00:00Z',
    isStalled: false,
    engagementScore: 92,
    profileCompletion: 100,
    proposalViewTime: 680,
    returnVisits: 5,
    questionsAsked: 8,
    potentialAUM: 3500000,
    tags: ['Converted', 'High Engagement'],
    advisorNotes: 'Excellent client. Interested in portfolio review quarterly.',
  },
  {
    id: 'client_005',
    advisorId: 'adv_001',
    name: 'Anita Desai',
    email: 'anita.desai@email.com',
    phone: '+91 98765 43214',
    riskProfile: 'Balanced',
    journeyStage: 'PAYMENT_STARTED',
    lastActivityAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-01-21T08:00:00Z',
    isStalled: false,
    engagementScore: 85,
    profileCompletion: 100,
    proposalViewTime: 540,
    returnVisits: 4,
    questionsAsked: 5,
    potentialAUM: 1800000,
    tags: ['Hot Lead', 'Payment Pending'],
    advisorNotes: 'Payment in progress. Very responsive.',
  },
  {
    id: 'client_006',
    advisorId: 'adv_001',
    name: 'Rahul Verma',
    email: 'rahul.verma@email.com',
    phone: '+91 98765 43215',
    riskProfile: 'Growth',
    journeyStage: 'PROPOSAL_VIEWED',
    lastActivityAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-01-19T15:30:00Z',
    isStalled: false,
    engagementScore: 62,
    profileCompletion: 90,
    proposalViewTime: 280,
    returnVisits: 2,
    questionsAsked: 3,
    potentialAUM: 900000,
    tags: ['Medium Intent'],
    advisorNotes: 'Comparing with other advisors.',
  },
  {
    id: 'client_007',
    advisorId: 'adv_001',
    name: 'Kavita Joshi',
    email: 'kavita.joshi@email.com',
    phone: '+91 98765 43216',
    riskProfile: 'Conservative',
    journeyStage: 'KYC_PENDING',
    lastActivityAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-01-17T10:00:00Z',
    isStalled: true,
    engagementScore: 15,
    profileCompletion: 40,
    proposalViewTime: 0,
    returnVisits: 0,
    questionsAsked: 0,
    potentialAUM: 300000,
    tags: ['Low Engagement', 'Stalled'],
    advisorNotes: 'Not responding to emails.',
  },
  {
    id: 'client_008',
    advisorId: 'adv_001',
    name: 'Suresh Kumar',
    email: 'suresh.kumar@email.com',
    phone: '+91 98765 43217',
    riskProfile: 'Balanced',
    journeyStage: 'INVESTED',
    lastActivityAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-01-08T09:00:00Z',
    isStalled: false,
    engagementScore: 88,
    profileCompletion: 100,
    proposalViewTime: 720,
    returnVisits: 6,
    questionsAsked: 7,
    potentialAUM: 4200000,
    tags: ['Converted', 'High Net Worth'],
    advisorNotes: 'Referral source for other clients.',
  },
];

// Mock proposals (advisor-curated fund lists per client)
export const mockProposals: Record<string, ClientProposal> = {
  client_001: {
    clientId: 'client_001',
    advisorId: 'adv_001',
    curatedFunds: [
      {
        ...mockFunds[2], // ICICI Balanced
        advisorNote: 'Perfect for your balanced risk profile. This fund has shown consistent returns with lower volatility.',
        isSelected: true,
      },
      {
        ...mockFunds[4], // HDFC Balanced
        advisorNote: 'Another solid balanced option with good track record.',
        isSelected: true,
      },
    ],
    createdAt: '2024-01-20T10:00:00Z',
    viewedAt: '2024-01-20T11:30:00Z',
  },
  client_002: {
    clientId: 'client_002',
    advisorId: 'adv_001',
    curatedFunds: [
      {
        ...mockFunds[0], // HDFC Top 100
        advisorNote: 'Great for long-term wealth creation. Strong management team.',
        isSelected: true,
      },
      {
        ...mockFunds[1], // SBI Bluechip
        advisorNote: 'One of the largest and most trusted large-cap funds.',
        isSelected: true,
      },
      {
        ...mockFunds[3], // Axis ELSS
        advisorNote: 'Tax-saving option with excellent returns. Lock-in period of 3 years.',
        isSelected: true,
      },
    ],
    createdAt: '2024-01-18T15:00:00Z',
  },
};

// Helper: Get funds filtered by risk profile
export function getFundsByRiskProfile(riskProfile: RiskProfile): Fund[] {
  return mockFunds.filter(fund => fund.riskLevel === riskProfile);
}

// Helper: Format currency
export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

// Helper: Format percentage
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
