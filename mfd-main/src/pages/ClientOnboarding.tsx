import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockAdvisor } from '../data/mockData';
import { RiskProfile } from '../types';
import { AdvisorCard } from '../components/AdvisorCard';

/**
 * Client Onboarding Flow
 * 
 * Product Logic:
 * - Trust-first: Shows advisor credentials prominently before asking questions
 * - 3-minute risk & goal questionnaire (reduces cognitive load)
 * - Progressive disclosure: Simple questions, no jargon
 * - Tags client as Conservative/Balanced/Growth
 * - Updates client journey stage to PROFILE_COMPLETED
 * 
 * UX Principle: Beginner-friendly, calm, trust-building
 */
export const ClientOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const advisorId = searchParams.get('advisor') || mockAdvisor.id;

  const [step, setStep] = useState<'welcome' | 'questions' | 'complete'>('welcome');
  const [answers, setAnswers] = useState({
    investmentGoal: '',
    timeHorizon: '',
    riskTolerance: '',
    experience: '',
    investmentAmount: '',
  });

  // Risk profiling logic: Map answers to risk profile
  const calculateRiskProfile = (): RiskProfile => {
    let score = 0;

    // Investment goal scoring
    if (answers.investmentGoal === 'wealth-creation') score += 3;
    else if (answers.investmentGoal === 'retirement') score += 2;
    else if (answers.investmentGoal === 'savings') score += 1;

    // Time horizon scoring
    if (answers.timeHorizon === '5plus') score += 3;
    else if (answers.timeHorizon === '3-5') score += 2;
    else if (answers.timeHorizon === '1-3') score += 1;

    // Risk tolerance scoring
    if (answers.riskTolerance === 'high') score += 3;
    else if (answers.riskTolerance === 'medium') score += 2;
    else if (answers.riskTolerance === 'low') score += 1;

    // Experience scoring
    if (answers.experience === 'experienced') score += 2;
    else if (answers.experience === 'some') score += 1;

    // Determine risk profile
    if (score >= 8) return 'Growth';
    if (score >= 5) return 'Balanced';
    return 'Conservative';
  };

  const handleStart = () => {
    setStep('questions');
  };

  const handleAnswerChange = (question: keyof typeof answers, value: string) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleSubmit = () => {
    const riskProfile = calculateRiskProfile();
    // In real app, this would save to backend
    // For now, we'll navigate to fund recommendation with risk profile
    navigate(`/client/funds?advisor=${advisorId}&risk=${riskProfile}`);
  };

  const isFormComplete = Object.values(answers).every(v => v !== '');

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Trust-first: Show advisor credentials prominently */}
          <div className="mb-8">
            <AdvisorCard advisor={mockAdvisor} />
          </div>

          <div className="card text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome! Let's find the right investments for you
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              We'll ask you a few simple questions (takes about 3 minutes) to understand
              your goals and risk comfort level. Your advisor will then share personalized
              fund recommendations.
            </p>
            <button onClick={handleStart} className="btn-primary text-lg px-8 py-3">
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'questions') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Question 1 of 5</span>
              <span className="text-sm text-gray-500">~3 minutes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: '20%' }}></div>
            </div>
          </div>

          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              What is your main investment goal?
            </h2>
            <div className="space-y-3">
              {[
                { value: 'wealth-creation', label: 'Long-term wealth creation', desc: 'Build significant wealth over time' },
                { value: 'retirement', label: 'Retirement planning', desc: 'Save for retirement' },
                { value: 'savings', label: 'Regular savings', desc: 'Save money safely' },
                { value: 'tax-saving', label: 'Tax saving', desc: 'Reduce tax liability' },
              ].map(option => (
                <label
                  key={option.value}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers.investmentGoal === option.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="investmentGoal"
                    value={option.value}
                    checked={answers.investmentGoal === option.value}
                    onChange={(e) => handleAnswerChange('investmentGoal', e.target.value)}
                    className="mt-1"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              How long do you plan to invest?
            </h2>
            <div className="space-y-3">
              {[
                { value: '5plus', label: 'More than 5 years', desc: 'Long-term investment' },
                { value: '3-5', label: '3 to 5 years', desc: 'Medium-term' },
                { value: '1-3', label: '1 to 3 years', desc: 'Short to medium-term' },
                { value: 'less-1', label: 'Less than 1 year', desc: 'Short-term' },
              ].map(option => (
                <label
                  key={option.value}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers.timeHorizon === option.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="timeHorizon"
                    value={option.value}
                    checked={answers.timeHorizon === option.value}
                    onChange={(e) => handleAnswerChange('timeHorizon', e.target.value)}
                    className="mt-1"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              How comfortable are you with market ups and downs?
            </h2>
            <div className="space-y-3">
              {[
                { value: 'high', label: 'Very comfortable', desc: 'I can handle significant fluctuations' },
                { value: 'medium', label: 'Somewhat comfortable', desc: 'I can handle moderate fluctuations' },
                { value: 'low', label: 'Not very comfortable', desc: 'I prefer stable, predictable returns' },
              ].map(option => (
                <label
                  key={option.value}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers.riskTolerance === option.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="riskTolerance"
                    value={option.value}
                    checked={answers.riskTolerance === option.value}
                    onChange={(e) => handleAnswerChange('riskTolerance', e.target.value)}
                    className="mt-1"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              What's your experience with mutual funds?
            </h2>
            <div className="space-y-3">
              {[
                { value: 'experienced', label: 'Experienced', desc: 'I have invested in mutual funds before' },
                { value: 'some', label: 'Some experience', desc: 'I know a bit about mutual funds' },
                { value: 'none', label: 'No experience', desc: 'This is my first time' },
              ].map(option => (
                <label
                  key={option.value}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers.experience === option.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="experience"
                    value={option.value}
                    checked={answers.experience === option.value}
                    onChange={(e) => handleAnswerChange('experience', e.target.value)}
                    className="mt-1"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              How much are you planning to invest initially?
            </h2>
            <div className="space-y-3">
              {[
                { value: 'high', label: '₹5 Lakhs or more', desc: 'Large investment' },
                { value: 'medium', label: '₹1-5 Lakhs', desc: 'Medium investment' },
                { value: 'low', label: 'Less than ₹1 Lakh', desc: 'Small investment' },
              ].map(option => (
                <label
                  key={option.value}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers.investmentAmount === option.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="investmentAmount"
                    value={option.value}
                    checked={answers.investmentAmount === option.value}
                    onChange={(e) => handleAnswerChange('investmentAmount', e.target.value)}
                    className="mt-1"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!isFormComplete}
              className="btn-primary"
            >
              See My Recommendations →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
