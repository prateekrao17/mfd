import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAdvisor } from '../data/mockData';

/**
 * ADVISOR PROFILE DETAILS SCREEN
 * 
 * Displays comprehensive advisor information:
 * - ARN Number
 * - Total AUM
 * - KYC Status
 * - Personal Details
 * 
 * Light theme only, high contrast for clarity
 */
export const AdvisorProfileDetails: React.FC = () => {
  const navigate = useNavigate();

  const kycStatus = 'Verified'; // Mock status
  const verificationDate = '2024-12-15';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 font-medium"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            Advisor Profile
          </h1>
          <p className="text-gray-600 mt-1">
            Complete information and credentials
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Header Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-6 mb-8">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-md flex-shrink-0">
              {mockAdvisor.name.split(' ').map(n => n[0]).join('')}
            </div>

            {/* Basic Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {mockAdvisor.name}
              </h2>
              <p className="text-gray-600 mb-3">
                Financial Advisor • AMFI Registered
              </p>
              <div className="flex gap-4">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  ✓ {kycStatus}
                </span>
                <span className="text-sm text-gray-600">
                  Verified on {new Date(verificationDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* ARN Number Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">
                AMFI Registration Number (ARN)
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {mockAdvisor.arn}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Your unique identifier with AMFI (Association of Mutual Funds in India) for regulatory compliance and client verification.
            </p>
          </div>

          {/* Total AUM Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">
                Total Assets Under Management
              </p>
              <p className="text-2xl font-bold text-green-600">
                ₹{(mockAdvisor.aum / 10000000).toFixed(1)} Cr
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Total value of client portfolios you manage across all investments and funds.
            </p>
          </div>

          {/* KYC Status Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">
                Know Your Customer (KYC) Status
              </p>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <p className="text-2xl font-bold text-gray-900">
                  {kycStatus}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Your KYC documentation has been verified and approved. You are cleared to advise clients and manage investments.
            </p>
          </div>

          {/* Experience Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">
                Years of Experience
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {mockAdvisor.experience}+ Years
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Professional experience in financial advisory and portfolio management.
            </p>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
            Personal Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">
                Email Address
              </p>
              <p className="text-gray-900 font-medium mb-6">
                rajesh.kumar@advisorplatform.com
              </p>

              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">
                Phone Number
              </p>
              <p className="text-gray-900 font-medium mb-6">
                +91 9876 543 210
              </p>

              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">
                Office Location
              </p>
              <p className="text-gray-900 font-medium">
                Mumbai, Maharashtra, India
              </p>
            </div>

            {/* Professional Information */}
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">
                Specialization
              </p>
              <p className="text-gray-900 font-medium mb-6">
                Mutual Funds & Retirement Planning
              </p>

              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">
                Certifications
              </p>
              <p className="text-gray-900 font-medium mb-6">
                SEBI Registered Investment Advisor
              </p>

              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">
                Member Since
              </p>
              <p className="text-gray-900 font-medium">
                January 2020
              </p>
            </div>
          </div>
        </div>

        {/* Compliance & Disclosures */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            📋 Compliance Information
          </h4>
          <p className="text-sm text-blue-800">
            This advisor is registered with SEBI and complies with all regulatory requirements. All investment recommendations are made in accordance with client's risk profile, financial goals, and investment horizon. Past performance is not indicative of future results.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-12">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 h-10 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
          >
            Back
          </button>
          <button
            onClick={() => navigate('/client/funds')}
            className="flex-1 px-6 py-3 h-10 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Fund Selection
          </button>
        </div>
      </main>
    </div>
  );
};
