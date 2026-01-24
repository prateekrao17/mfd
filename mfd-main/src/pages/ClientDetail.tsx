import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockClients, mockAdvisor } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';
import { Client } from '../types';

/**
 * CLIENT DETAIL PAGE
 * 
 * Displays comprehensive client information with action buttons:
 * - Client profile summary
 * - KYC and investment information
 * - Action buttons: Create Proposal, Send Reminder
 */
export const ClientDetail: React.FC = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [showReminderModal, setShowReminderModal] = useState(false);

  const client = mockClients.find(c => c.id === clientId);

  if (!client) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className={`text-2xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Client not found
          </h1>
          <button
            onClick={() => navigate('/advisor/dashboard')}
            className="text-blue-600 dark:text-blue-400 hover:underline mt-4"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (stage: string) => {
    const colors: Record<string, string> = {
      KYC_PENDING: 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300',
      PROFILE_COMPLETED: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300',
      PROPOSAL_VIEWED: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300',
      PAYMENT_STARTED: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300',
      INVESTED: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
    };
    return colors[stage] || colors.KYC_PENDING;
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`border-b ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate('/advisor/dashboard')}
            className={`mb-4 flex items-center gap-2 font-medium ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            ← Back to Dashboard
          </button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {client.name}
              </h1>
              <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {client.email} • {client.phone}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowReminderModal(true)}
                className={`px-6 py-3 font-medium rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-900 text-gray-200 border border-gray-800 hover:bg-gray-800'
                    : 'bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                🔔 Send Reminder
              </button>
              <button
                onClick={() => navigate(`/advisor/curate-minimal/${client.id}`)}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Create Proposal
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Status and Journey Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`border rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
            <p className={`text-xs uppercase tracking-wide font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Current Stage
            </p>
            <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {client.journeyStage.replace('_', ' ')}
            </p>
            <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className={`inline-block px-2 py-1 rounded ${getStatusColor(client.journeyStage)} text-xs font-medium`}>
                {client.journeyStage === 'INVESTED' ? '✓ Completed' : 'In Progress'}
              </span>
            </p>
          </div>

          <div className={`border rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
            <p className={`text-xs uppercase tracking-wide font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Risk Profile
            </p>
            <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {client.riskProfile || 'Not Set'}
            </p>
          </div>

          <div className={`border rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
            <p className={`text-xs uppercase tracking-wide font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Last Activity
            </p>
            <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {getRelativeTime(client.lastActivityAt)}
            </p>
          </div>

          <div className={`border rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
            <p className={`text-xs uppercase tracking-wide font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Profile Completion
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500"
                  style={{ width: `${client.profileCompletion || 75}%` }}
                />
              </div>
              <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {client.profileCompletion || 75}%
              </p>
            </div>
          </div>
        </div>

        {/* Client Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className={`border rounded-lg p-8 ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-xl font-semibold mb-6 pb-4 border-b ${theme === 'dark' ? 'text-white border-gray-800' : 'text-gray-900 border-gray-200'}`}>
              Client Information
            </h2>

            <div className="space-y-4">
              <div>
                <p className={`text-xs uppercase tracking-wide font-semibold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Email
                </p>
                <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                  {client.email}
                </p>
              </div>

              <div>
                <p className={`text-xs uppercase tracking-wide font-semibold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Phone
                </p>
                <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                  {client.phone}
                </p>
              </div>

              <div>
                <p className={`text-xs uppercase tracking-wide font-semibold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Engagement Score
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 dark:bg-green-500"
                      style={{ width: `${client.engagementScore || 65}%` }}
                    />
                  </div>
                  <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {client.engagementScore || 65}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className={`border rounded-lg p-8 ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-xl font-semibold mb-6 pb-4 border-b ${theme === 'dark' ? 'text-white border-gray-800' : 'text-gray-900 border-gray-200'}`}>
              Engagement Metrics
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Return Visits
                </p>
                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {client.returnVisits || 3}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Questions Asked
                </p>
                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {client.questionsAsked || 5}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Proposal View Time
                </p>
                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {client.proposalViewTime ? `${(client.proposalViewTime / 60).toFixed(1)}m` : 'N/A'}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Potential AUM
                </p>
                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {client.potentialAUM ? `₹${(client.potentialAUM / 100000).toFixed(1)}L` : 'TBD'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Advisor Notes */}
        {client.advisorNotes && (
          <div className={`border rounded-lg p-8 mt-8 ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-xl font-semibold mb-4 pb-4 border-b ${theme === 'dark' ? 'text-white border-gray-800' : 'text-gray-900 border-gray-200'}`}>
              Advisor Notes
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {client.advisorNotes}
            </p>
          </div>
        )}
      </main>

      {/* Reminder Modal */}
      {showReminderModal && (
        <ReminderModal client={client} onClose={() => setShowReminderModal(false)} theme={theme} />
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════
// REMINDER MODAL COMPONENT
// ══════════════════════════════════════════════════

interface ReminderModalProps {
  client: Client;
  onClose: () => void;
  theme: string;
}

function ReminderModal({ client, onClose, theme }: ReminderModalProps) {
  const handleWhatsApp = () => {
    const message = `Hi ${client.name}, this is a reminder about your investment proposal. Please review and let me know if you have any questions.`;
    const phone = client.phone.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleCall = () => {
    const phone = client.phone.replace(/[^0-9+]/g, '');
    window.location.href = `tel:${phone}`;
    onClose();
  };

  const handleEmail = () => {
    const subject = `Follow-up: Investment Proposal`;
    const body = `Dear ${client.name},\n\nI wanted to follow up on the investment proposal I shared with you.\n\nPlease let me know if you have any questions or would like to discuss further.\n\nBest regards,\n${mockAdvisor.name}\nARN: ${mockAdvisor.arn}`;
    const mailtoUrl = `mailto:${client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    onClose();
  };

  const handleSMS = () => {
    const message = `Hi ${client.name}, gentle reminder about your investment proposal. Please review when convenient.`;
    const phone = client.phone.replace(/[^0-9]/g, '');
    const smsUrl = `sms:${phone}?body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-lg p-8 max-w-md w-full shadow-xl ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
        <h2 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Send Reminder to {client.name}
        </h2>

        <div className="space-y-3">
          <button
            onClick={handleWhatsApp}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
              theme === 'dark'
                ? 'bg-green-900 text-green-300 hover:bg-green-800'
                : 'bg-green-100 text-green-900 hover:bg-green-200'
            }`}
          >
            📱 WhatsApp
          </button>

          <button
            onClick={handleCall}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
              theme === 'dark'
                ? 'bg-blue-900 text-blue-300 hover:bg-blue-800'
                : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
            }`}
          >
            📞 Call
          </button>

          <button
            onClick={handleSMS}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
              theme === 'dark'
                ? 'bg-purple-900 text-purple-300 hover:bg-purple-800'
                : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
            }`}
          >
            💬 SMS / Text
          </button>

          <button
            onClick={handleEmail}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
              theme === 'dark'
                ? 'bg-amber-900 text-amber-300 hover:bg-amber-800'
                : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
            }`}
          >
            ✉️ Email
          </button>
        </div>

        <button
          onClick={onClose}
          className={`mt-6 w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════

function getRelativeTime(timestamp: string): string {
  const now = Date.now();
  const date = new Date(timestamp).getTime();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return 'over a week';
}
