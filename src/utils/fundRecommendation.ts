import { Fund, RiskProfile } from '../types';

interface RecommendationRules {
  equity: { min: number; max: number };
  debt: { min: number; max: number };
  preferredCategories: string[];
}

const recommendationRules: Record<RiskProfile, RecommendationRules> = {
  Conservative: {
    equity: { min: 0, max: 30 },
    debt: { min: 60, max: 100 },
    preferredCategories: ['Debt', 'Liquid Fund', 'Short Duration Bond', 'Balanced Hybrid'],
  },
  Balanced: {
    equity: { min: 30, max: 70 },
    debt: { min: 30, max: 70 },
    preferredCategories: ['Hybrid', 'Balanced Advantage', 'Dynamic Hybrid', 'Equity'],
  },
  Growth: {
    equity: { min: 70, max: 100 },
    debt: { min: 0, max: 30 },
    preferredCategories: ['Equity', 'Large Cap Equity', 'Multi Cap Equity', 'Mid Cap Equity'],
  },
};

/**
 * Get recommended funds based on client's risk profile
 * Returns top 8 funds suitable for the risk profile, sorted by 3-year returns
 */
export function getRecommendedFunds(
  riskProfile: RiskProfile | undefined,
  allFunds: Fund[]
): Fund[] {
  if (!riskProfile) {
    // If no risk profile, return top 8 performing funds overall
    return allFunds
      .sort((a, b) => b.returns3Y - a.returns3Y)
      .slice(0, 8);
  }

  const rules = recommendationRules[riskProfile];
  
  // Filter funds by:
  // 1. Risk level matching the profile
  // 2. Category preference
  // Then sort by returns and take top 8
  const recommendedFunds = allFunds
    .filter(fund => {
      // Match risk level to profile
      const fundRiskLevel = fund.riskLevel?.toLowerCase() || '';
      const profileRisk = riskProfile.toLowerCase();
      
      // More flexible matching: if risk level contains profile or profile contains risk level
      return fundRiskLevel.includes(profileRisk) || profileRisk.includes(fundRiskLevel);
    })
    .sort((a, b) => b.returns3Y - a.returns3Y)
    .slice(0, 8);

  // If we got 8 or more, return them
  if (recommendedFunds.length >= 8) {
    return recommendedFunds;
  }

  // Otherwise, add more funds based on category preference
  const categoryMatches = allFunds
    .filter(fund => 
      !recommendedFunds.find(rf => rf.id === fund.id) &&
      rules.preferredCategories.some(cat => 
        fund.category?.toLowerCase().includes(cat.toLowerCase())
      )
    )
    .sort((a, b) => b.returns3Y - a.returns3Y)
    .slice(0, 8 - recommendedFunds.length);

  return [...recommendedFunds, ...categoryMatches].slice(0, 8);
}

/**
 * Get recommended asset allocation based on risk profile
 */
export function getRecommendedAssetAllocation(
  riskProfile: RiskProfile | undefined
): { equity: number; debt: number; hybrid: number } {
  if (!riskProfile) {
    return { equity: 60, debt: 30, hybrid: 10 };
  }

  const rules = recommendationRules[riskProfile];
  const equityTarget = (rules.equity.min + rules.equity.max) / 2;
  const debtTarget = (rules.debt.min + rules.debt.max) / 2;
  const hybridTarget = 100 - equityTarget - debtTarget;

  return {
    equity: Math.round(equityTarget),
    debt: Math.round(debtTarget),
    hybrid: Math.round(Math.max(0, hybridTarget)),
  };
}
