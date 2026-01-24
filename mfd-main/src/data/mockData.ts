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
  email: 'rajesh.kumar@advisorplatform.com',
  phone: '+91 9876 543 210',
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

// Extended Client interface with KYC and portfolio data
export interface ClientWithProfile extends Client {
  panCard?: string;
  kycStatus?: 'Verified' | 'Pending' | 'Incomplete';
  kycCompletedDate?: string;
  investorType?: 'Individual' | 'HUF' | 'Corporate';
  investmentGoal?: string;
  timeHorizon?: '1-3 years' | '3-5 years' | '5+ years';
  currentInvestments?: {
    totalAmount: number;
    assetAllocation: {
      equity: number;
      debt: number;
      hybrid: number;
      other: number;
    };
    holdings: Array<{
      fundName: string;
      amountInvested: number;
      currentValue: number;
      returns: number;
      investedDate: string;
    }>;
  };
}

// Mock clients (in real app, fetched from API)
export const mockClients: ClientWithProfile[] = [
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
    // KYC Data
    panCard: 'ABCDE1234F',
    kycStatus: 'Verified',
    kycCompletedDate: '2024-01-15',
    investorType: 'Individual',
    investmentGoal: 'Wealth Creation',
    timeHorizon: '5+ years',
    // Current Portfolio
    currentInvestments: {
      totalAmount: 500000,
      assetAllocation: {
        equity: 60,
        debt: 30,
        hybrid: 10,
        other: 0,
      },
      holdings: [
        {
          fundName: 'HDFC Top 100 Fund',
          amountInvested: 200000,
          currentValue: 245000,
          returns: 22.5,
          investedDate: '2022-03-10',
        },
        {
          fundName: 'SBI Bluechip Fund',
          amountInvested: 150000,
          currentValue: 172000,
          returns: 14.7,
          investedDate: '2022-06-15',
        },
        {
          fundName: 'ICICI Prudential Balanced Advantage',
          amountInvested: 150000,
          currentValue: 165500,
          returns: 10.3,
          investedDate: '2023-01-20',
        },
      ],
    },
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
    panCard: 'BCDEF2345G',
    kycStatus: 'Verified',
    kycCompletedDate: '2024-01-10',
    investorType: 'Individual',
    investmentGoal: 'Wealth Creation',
    timeHorizon: '5+ years',
    currentInvestments: {
      totalAmount: 1200000,
      assetAllocation: {
        equity: 70,
        debt: 20,
        hybrid: 10,
        other: 0,
      },
      holdings: [
        {
          fundName: 'HDFC Top 100 Fund',
          amountInvested: 600000,
          currentValue: 735000,
          returns: 22.5,
          investedDate: '2021-06-15',
        },
        {
          fundName: 'Axis Long Term Equity Fund',
          amountInvested: 400000,
          currentValue: 470000,
          returns: 17.5,
          investedDate: '2022-01-10',
        },
        {
          fundName: 'SBI Magnum Gilt Fund',
          amountInvested: 200000,
          currentValue: 217000,
          returns: 8.5,
          investedDate: '2023-06-01',
        },
      ],
    },
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
    panCard: 'CDEFG3456H',
    kycStatus: 'Pending',
    kycCompletedDate: '2024-02-01',
    investorType: 'Individual',
    investmentGoal: 'Retirement',
    timeHorizon: '3-5 years',
    currentInvestments: {
      totalAmount: 150000,
      assetAllocation: {
        equity: 20,
        debt: 70,
        hybrid: 10,
        other: 0,
      },
      holdings: [
        {
          fundName: 'SBI Magnum Gilt Fund',
          amountInvested: 100000,
          currentValue: 108500,
          returns: 8.5,
          investedDate: '2023-09-15',
        },
        {
          fundName: 'ICICI Prudential Balanced Advantage',
          amountInvested: 50000,
          currentValue: 55175,
          returns: 10.3,
          investedDate: '2023-11-01',
        },
      ],
    },
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
    panCard: 'DEFGH4567I',
    kycStatus: 'Verified',
    kycCompletedDate: '2024-01-08',
    investorType: 'Individual',
    investmentGoal: 'Wealth Creation',
    timeHorizon: '5+ years',
    currentInvestments: {
      totalAmount: 2000000,
      assetAllocation: {
        equity: 80,
        debt: 15,
        hybrid: 5,
        other: 0,
      },
      holdings: [
        {
          fundName: 'HDFC Top 100 Fund',
          amountInvested: 800000,
          currentValue: 980000,
          returns: 22.5,
          investedDate: '2021-01-15',
        },
        {
          fundName: 'UTI Banking & Financial Services',
          amountInvested: 600000,
          currentValue: 716000,
          returns: 19.3,
          investedDate: '2021-08-20',
        },
        {
          fundName: 'Axis Long Term Equity Fund',
          amountInvested: 400000,
          currentValue: 469000,
          returns: 17.3,
          investedDate: '2022-03-10',
        },
        {
          fundName: 'SBI Bluechip Fund',
          amountInvested: 200000,
          currentValue: 229600,
          returns: 14.8,
          investedDate: '2023-01-01',
        },
      ],
    },
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
    panCard: 'EFGHI5678J',
    kycStatus: 'Verified',
    kycCompletedDate: '2024-01-19',
    investorType: 'Individual',
    investmentGoal: 'Tax Saving',
    timeHorizon: '5+ years',
    currentInvestments: {
      totalAmount: 800000,
      assetAllocation: {
        equity: 50,
        debt: 40,
        hybrid: 10,
        other: 0,
      },
      holdings: [
        {
          fundName: 'Axis Long Term Equity Fund',
          amountInvested: 300000,
          currentValue: 351000,
          returns: 17.0,
          investedDate: '2022-04-15',
        },
        {
          fundName: 'HDFC Balanced Advantage Fund',
          amountInvested: 300000,
          currentValue: 330000,
          returns: 10.0,
          investedDate: '2023-01-20',
        },
        {
          fundName: 'SBI Magnum Gilt Fund',
          amountInvested: 200000,
          currentValue: 217000,
          returns: 8.5,
          investedDate: '2023-06-01',
        },
      ],
    },
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
    panCard: 'FGHIJ6789K',
    kycStatus: 'Verified',
    kycCompletedDate: '2024-01-14',
    investorType: 'Individual',
    investmentGoal: 'Wealth Creation',
    timeHorizon: '5+ years',
    currentInvestments: {
      totalAmount: 600000,
      assetAllocation: {
        equity: 75,
        debt: 20,
        hybrid: 5,
        other: 0,
      },
      holdings: [
        {
          fundName: 'HDFC Top 100 Fund',
          amountInvested: 300000,
          currentValue: 367500,
          returns: 22.5,
          investedDate: '2022-09-10',
        },
        {
          fundName: 'Axis Long Term Equity Fund',
          amountInvested: 200000,
          currentValue: 234000,
          returns: 17.0,
          investedDate: '2023-02-15',
        },
        {
          fundName: 'SBI Magnum Gilt Fund',
          amountInvested: 100000,
          currentValue: 108500,
          returns: 8.5,
          investedDate: '2023-08-20',
        },
      ],
    },
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
    panCard: 'GHIJK7890L',
    kycStatus: 'Incomplete',
    kycCompletedDate: undefined,
    investorType: 'Individual',
    investmentGoal: 'Retirement',
    timeHorizon: '3-5 years',
    currentInvestments: {
      totalAmount: 100000,
      assetAllocation: {
        equity: 15,
        debt: 80,
        hybrid: 5,
        other: 0,
      },
      holdings: [
        {
          fundName: 'SBI Magnum Gilt Fund',
          amountInvested: 80000,
          currentValue: 86800,
          returns: 8.5,
          investedDate: '2023-12-01',
        },
        {
          fundName: 'ICICI Prudential Balanced Advantage',
          amountInvested: 20000,
          currentValue: 22070,
          returns: 10.3,
          investedDate: '2024-01-10',
        },
      ],
    },
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
    panCard: 'HIJKL8901M',
    kycStatus: 'Verified',
    kycCompletedDate: '2024-01-05',
    investorType: 'Individual',
    investmentGoal: 'Wealth Creation',
    timeHorizon: '5+ years',
    currentInvestments: {
      totalAmount: 2500000,
      assetAllocation: {
        equity: 60,
        debt: 30,
        hybrid: 10,
        other: 0,
      },
      holdings: [
        {
          fundName: 'HDFC Top 100 Fund',
          amountInvested: 1000000,
          currentValue: 1225000,
          returns: 22.5,
          investedDate: '2020-12-15',
        },
        {
          fundName: 'ICICI Prudential Balanced Advantage',
          amountInvested: 800000,
          currentValue: 881200,
          returns: 10.3,
          investedDate: '2022-06-01',
        },
        {
          fundName: 'Axis Long Term Equity Fund',
          amountInvested: 450000,
          currentValue: 528000,
          returns: 17.3,
          investedDate: '2022-12-15',
        },
        {
          fundName: 'SBI Magnum Gilt Fund',
          amountInvested: 250000,
          currentValue: 271250,
          returns: 8.5,
          investedDate: '2023-03-20',
        },
      ],
    },
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
