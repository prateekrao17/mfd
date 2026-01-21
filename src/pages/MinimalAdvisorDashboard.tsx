import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockClients } from '../data/mockData';
import { Client } from '../types';
import { MinimalHeader } from '../components/MinimalHeader';
import { MinimalMetricCard } from '../components/MinimalMetricCard';
import { MinimalClientTable } from '../components/MinimalClientTable';

/**
 * MINIMAL ADVISOR DASHBOARD
 * 
 * Design Philosophy:
 * - "Less is more" - remove everything non-essential
 * - White space is a feature, not wasted space
 * - One primary action per screen
 * - Information hierarchy: most important → least important
 * - No unnecessary animations or decorations
 * - Typography and spacing do the heavy lifting
 * 
 * Structure:
 * 1. Header: Logo | Search | Profile (minimal)
 * 2. Key Metrics (3 cards max, large numbers)
 * 3. Client List (clean table, essential cols only)
 */
export const MinimalAdvisorDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Calculate metrics
  const metrics = useMemo(() => {
    const activeClients = mockClients.filter(
      c => c.journeyStage !== 'INVESTED'
    ).length;

    const needingAttention = mockClients.filter(
      c => c.journeyStage !== 'INVESTED' && c.isStalled
    ).length;

    // Count conversions this month
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const conversionsThisMonth = mockClients.filter(
      c =>
        c.journeyStage === 'INVESTED' &&
        new Date(c.lastActivityAt).getTime() > thirtyDaysAgo
    ).length;

    // Calculate total AUM from all clients' investments
    const totalAUM = mockClients.reduce(
      (sum, client) => sum + (client.potentialAUM || 0),
      0
    );

    return {
      activeClients,
      needingAttention,
      conversionsThisMonth,
      totalAUM,
    };
  }, []);

  const handleViewClient = (clientId: string) => {
    navigate(`/advisor/client-detail/${clientId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <MinimalHeader title="MFD Advisor" showSearch={false} />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Metrics Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MinimalMetricCard
              value={metrics.activeClients}
              label="Active Clients"
              accent="default"
            />
            <MinimalMetricCard
              value={metrics.needingAttention}
              label="Clients Needing Attention"
              accent={metrics.needingAttention > 0 ? 'warning' : 'default'}
            />
            <MinimalMetricCard
              value={metrics.conversionsThisMonth}
              label="Conversions This Month"
              accent="success"
            />
            <MinimalMetricCard
              value={`₹${(metrics.totalAUM / 10000000).toFixed(1)}Cr`}
              label="Total AUM"
              accent="default"
            />
          </div>
        </div>

        {/* Client List Table */}
        <MinimalClientTable
          clients={mockClients}
          onViewClient={handleViewClient}
        />
      </main>
    </div>
  );
};
