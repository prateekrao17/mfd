import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdvisorDashboard } from './pages/AdvisorDashboard';
import { AdvisorOnboardingLink } from './pages/AdvisorOnboardingLink';
import { AdvisorCurationPanel } from './pages/AdvisorCurationPanel';
import { ClientOnboarding } from './pages/ClientOnboarding';
import { FundRecommendation } from './pages/FundRecommendation';
import { ClientManagementTable } from './pages/ClientManagementTable';
import { AdvancedFundCuration } from './pages/AdvancedFundCuration';
import { ClientProposalView } from './pages/ClientProposalView';
import { MinimalAdvisorDashboard } from './pages/MinimalAdvisorDashboard';
import { MinimalClientDetail } from './pages/MinimalClientDetail';
import { MinimalFundCuration } from './pages/MinimalFundCuration';
import { AdvisorOnboarding } from './pages/AdvisorOnboardingFlow';
import { ClientOnboardingFlow } from './pages/ClientOnboardingFlow';
import { BeginnerFundRecommendation } from './pages/BeginnerFundRecommendation';
import { ClientSuccessScreen } from './pages/ClientSuccessScreen';
import { AdvisorProfileDetails } from './pages/AdvisorProfileDetails';
import { ClientProfile } from './pages/ClientProfile';
import { ClientDetail } from './pages/ClientDetail';

/**
 * MFD/IFA Platform - MVP Routing
 *
 * ADVISOR FLOW:
 * - /advisor/onboarding - Initial setup (profile, credentials)
 * - /advisor/dashboard - Main control center with client list
 * - /advisor/client-detail/:clientId - Individual client view
 * - /advisor/curate-minimal/:clientId - Select & curate funds for client
 *
 * CLIENT FLOW (via unique advisor link):
 * - /client/onboarding - Risk & goal questionnaire (3 minutes)
 * - /client/funds - Beginner-friendly fund recommendation
 * - /client/proposal - Review & confirm investment
 * - /client/success - Completion & next steps
 *
 * Legacy routes kept for backward compatibility
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========== ADVISOR FLOWS ========== */}

        {/* Advisor Onboarding */}
        <Route path="/advisor/onboarding" element={<AdvisorOnboarding />} />

        {/* Minimal Advisor Dashboard (Main Hub) */}
        <Route path="/advisor/dashboard" element={<MinimalAdvisorDashboard />} />

        {/* Advisor Client Views */}
        <Route path="/advisor/client-detail/:clientId" element={<MinimalClientDetail />} />
        <Route path="/advisor/client/:clientId" element={<ClientDetail />} />
        <Route path="/advisor/client/:clientId/profile" element={<ClientProfile />} />
        <Route path="/advisor/curate-minimal/:clientId" element={<MinimalFundCuration />} />

        {/* ========== CLIENT FLOWS (Conversion Funnels) ========== */}

        {/* Client Onboarding (Risk Profiling) */}
        <Route path="/client/onboarding" element={<ClientOnboardingFlow />} />

        {/* Beginner Fund Recommendation */}
        <Route path="/client/funds" element={<BeginnerFundRecommendation />} />

        {/* Investment Proposal Review */}
        <Route path="/client/proposal" element={<ClientProposalView />} />

        {/* Success Confirmation */}
        <Route path="/client/success" element={<ClientSuccessScreen />} />

        {/* Advisor Profile Details */}
        <Route path="/advisor/profile" element={<AdvisorProfileDetails />} />

        {/* ========== LEGACY ROUTES (Deprecated) ========== */}
        <Route path="/advisor/dashboard-legacy" element={<AdvisorDashboard />} />
        <Route path="/advisor/clients" element={<ClientManagementTable />} />
        <Route path="/advisor/onboarding-link" element={<AdvisorOnboardingLink />} />
        <Route path="/advisor/curate/:clientId" element={<AdvisorCurationPanel />} />
        <Route path="/advisor/curate-advanced/:clientId" element={<AdvancedFundCuration />} />
        <Route path="/client/onboard" element={<ClientOnboarding />} />
        <Route path="/client/funds-legacy" element={<FundRecommendation />} />

        {/* ========== ROOT & FALLBACKS ========== */}
        <Route path="/" element={<Navigate to="/advisor/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/advisor/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
