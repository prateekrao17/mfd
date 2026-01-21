import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ADVISOR ONBOARDING
 * 
 * First-time setup for MFD/IFA advisor.
 * Collects basic profile info and generates a unique client onboarding link.
 * 
 * UX: Simple form, one screen, minimal friction.
 */
export const AdvisorOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Rajesh Kumar',
    arn: 'ARN-123456',
    experience: 8,
    aum: 45000000,
    photo: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=0ea5e9&color=fff',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' || name === 'aum' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // In real app: Save to backend, get unique link
      const uniqueLink = `https://mfd-platform.com/onboard/${formData.arn}`;
      localStorage.setItem('advisorProfile', JSON.stringify(formData));
      navigate('/advisor/dashboard');
    }, 800);
  };

  const aumInCrores = (formData.aum / 10000000).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Set Up Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            One-time setup to get started with client onboarding
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-8 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* ARN */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              AMFI Registration Number (ARN)
            </label>
            <input
              type="text"
              name="arn"
              value={formData.arn}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Your AMFI license number
            </p>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Years of Experience
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              min="0"
              max="70"
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* AUM */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Assets Under Management (₹)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="aum"
                value={formData.aum}
                onChange={handleChange}
                min="0"
                required
                className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ≈ ₹{aumInCrores} Cr
              </span>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              ✓ Your profile will be prominently displayed to clients to build trust
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isSubmitting ? 'Setting up...' : 'Continue'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-6">
          Already set up?{' '}
          <button
            onClick={() => navigate('/advisor/dashboard')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Go to dashboard
          </button>
        </p>
      </div>
    </div>
  );
};
