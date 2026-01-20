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

/**
 * Main App Component with Routing
 *
 * Routes:
 * - /advisor/dashboard - Advisor control center
 * - /advisor/clients - Advanced client management table
 * - /advisor/onboarding-link - Share client onboarding link
 * - /advisor/curate/:clientId - Curate funds for a client (legacy)
 * - /advisor/curate-advanced/:clientId - Advanced fund curation interface
 * - /client/onboard - Client onboarding flow (via advisor link)
 * - /client/funds - Fund recommendation screen (legacy)
 * - /client/proposal - Client-facing proposal view (new)
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Advisor Routes */}
        <Route path="/advisor/dashboard" element={<AdvisorDashboard />} />
        <Route path="/advisor/clients" element={<ClientManagementTable />} />
        <Route path="/advisor/onboarding-link" element={<AdvisorOnboardingLink />} />
        <Route path="/advisor/curate/:clientId" element={<AdvisorCurationPanel />} />
        <Route path="/advisor/curate-advanced/:clientId" element={<AdvancedFundCuration />} />

        {/* Client Routes */}
        <Route path="/client/onboard" element={<ClientOnboarding />} />
        <Route path="/client/funds" element={<FundRecommendation />} />
        <Route path="/client/proposal" element={<ClientProposalView />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/advisor/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/advisor/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
