// Core data models for the MFD Advisor Platform

export type RiskProfile = 'Conservative' | 'Balanced' | 'Growth';

export type JourneyStage = 
  | 'KYC_PENDING'
  | 'PROFILE_COMPLETED'
  | 'PROPOSAL_VIEWED'
  | 'PAYMENT_STARTED'
  | 'INVESTED';

export interface Advisor {
  id: string;
  name: string;
  arn: string; // ARN = AMFI Registration Number
  experience: number; // years
  aum: number; // Assets Under Management in INR
  photo?: string;
  email?: string;
  phone?: string;
  clientOnboardingLink: string; // Unique link for clients
  createdAt: string;
}

export interface Client {
  id: string;
  advisorId: string;
  name: string;
  email: string;
  phone: string;
  riskProfile?: RiskProfile;
  journeyStage: JourneyStage;
  lastActivityAt: string; // ISO timestamp
  createdAt: string;
  // Flags for advisor dashboard
  isStalled?: boolean; // No action in X hours
  // Engagement metrics
  engagementScore?: number; // 0-100
  profileCompletion?: number; // 0-100 percentage
  proposalViewTime?: number; // seconds
  returnVisits?: number;
  questionsAsked?: number;
  // Additional fields
  potentialAUM?: number; // Estimated investment amount
  tags?: string[];
  advisorNotes?: string;
}

export interface Fund {
  id: string;
  name: string;
  category: string; // e.g., "Large Cap Equity", "Balanced Hybrid"
  riskLevel: RiskProfile;
  returns1Y?: number; // 1-year returns percentage
  returns3Y: number; // 3-year returns percentage
  returns5Y?: number; // 5-year returns percentage
  // Advanced metrics (hidden by default)
  sharpeRatio?: number;
  beta?: number;
  alpha?: number;
  expenseRatio?: number;
  fundManager?: string;
  fundHouse?: string; // AMC name
  aum?: number; // Fund AUM in INR
  rating?: number; // 1-5 stars
  minInvestment?: number;
  exitLoad?: string;
  assetAllocation?: {
    equity?: number; // percentage
    debt?: number;
    cash?: number;
  };
}

export interface CuratedFund extends Fund {
  advisorNote?: string; // Personal note from advisor
  isSelected: boolean; // Whether advisor selected this for client
}

export interface ClientProposal {
  clientId: string;
  advisorId: string;
  curatedFunds: CuratedFund[];
  createdAt: string;
  viewedAt?: string;
}
