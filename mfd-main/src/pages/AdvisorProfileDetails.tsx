import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAdvisor } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';

/**
 * ADVISOR PROFILE DETAILS SCREEN
 * 
 * Displays comprehensive advisor information:
 * - ARN Number
 * - Total AUM
 * - KYC Status
 * - Personal Details
 * 
 * Supports dark/light theme
 */
export const AdvisorProfileDetails: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const kycStatus = 'Verified'; // Mock status
  const verificationDate = '2024-12-15';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`border-b ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate(-1)}
            className={`mb-4 flex items-center gap-2 font-medium ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            ← Back
          </button>
          <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Advisor Profile
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Complete information and credentials
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Header Card */}
        <div className={`border rounded-lg p-8 mb-8 shadow-sm ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-6 mb-8">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-md flex-shrink-0">
              {mockAdvisor.name.split(' ').map(n => n[0]).join('')}
            </div>

            {/* Basic Info */}
            <div>
              <h2 className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {mockAdvisor.name}
              </h2>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Financial Advisor • AMFI Registered
              </p>
              <div className="flex gap-4 mt-3">
                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                  ✓ {kycStatus}
                </span>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Verified on {new Date(verificationDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* ARN Number Card */}
          <div className={`border rounded-lg p-6 shadow-sm ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className={`mb-4 pb-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
              <p className={`text-xs uppercase tracking-wide font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                AMFI Registration Number (ARN)
              </p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {mockAdvisor.arn}
              </p>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Your unique identifier with AMFI (Association of Mutual Funds in India) for regulatory compliance and client verification.
            </p>
          </div>

          {/* Total AUM Card */}
          <div className={`border rounded-lg p-6 shadow-sm ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className={`mb-4 pb-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
              <p className={`text-xs uppercase tracking-wide font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Assets Under Management
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₹{(mockAdvisor.aum / 10000000).toFixed(1)} Cr
              </p>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Total value of client portfolios you manage across all investments and funds.
            </p>
          </div>

          {/* KYC Status Card */}
          <div className={`border rounded-lg p-6 shadow-sm ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className={`mb-4 pb-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
              <p className={`text-xs uppercase tracking-wide font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Know Your Customer (KYC) Status
              </p>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {kycStatus}
                </p>
              </div>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Your KYC documentation has been verified and approved. You are cleared to advise clients and manage investments.
            </p>
          </div>

          {/* Experience Card */}
          <div className={`border rounded-lg p-6 shadow-sm ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className={`mb-4 pb-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
              <p className={`text-xs uppercase tracking-wide font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Years of Experience
              </p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {mockAdvisor.experience}+ Years
              </p>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Professional experience in financial advisory and portfolio management.
            </p>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className={`border rounded-lg p-8 shadow-sm ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-xl font-semibold mb-6 pb-4 border-b ${theme === 'dark' ? 'text-white border-gray-800' : 'text-gray-900 border-gray-200'}`}>
            Personal Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <p className={`text-xs uppercase tracking-wide font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Email Address
              </p>
              <p className={`font-medium mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                rajesh.kumar@advisorplatform.com
              </p>

              <p className={`text-xs uppercase tracking-wide font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Phone Number
              </p>
              <p className={`font-medium mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                +91 9876 543 210
              </p>

              <p className={`text-xs uppercase tracking-wide font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Office Location
              </p>
              <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                Mumbai, Maharashtra, India
              </p>
            </div>

            {/* Professional Information */}
            <div>
              <p className={`text-xs uppercase tracking-wide font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Specialization
              </p>
              <p className={`font-medium mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                Mutual Funds & Retirement Planning
              </p>

              <p className={`text-xs uppercase tracking-wide font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Certifications
              </p>
              <p className={`font-medium mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                SEBI Registered Investment Advisor
              </p>

              <p className={`text-xs uppercase tracking-wide font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Member Since
              </p>
              <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                January 2020
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-12">
          <button
            onClick={() => navigate('/advisor/dashboard')}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
};
