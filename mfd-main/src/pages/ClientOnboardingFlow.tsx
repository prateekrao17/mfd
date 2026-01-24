import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockAdvisor } from '../data/mockData';
import { RiskProfile } from '../types';

/**
 * CLIENT ONBOARDING FLOW
 * 
 * 3-minute risk & goal questionnaire for beginner investors.
 * Shows advisor credentials prominently to build trust.
 * 
 * UX Principles:
 * - Progressive disclosure (one question at a time)
 * - Clear, jargon-free language
 * - Trust-building: Show advisor photo and credentials
 * - Reassuring: Show progress
 */
export const ClientOnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleting, setIsCompleting] = useState(false);

  // Questions for risk profiling
  const questions = [
    {
      id: 'goal',
      question: "What's your main investment goal?",
      options: [
        { value: 'wealth_creation', label: '💰 Grow my wealth over time' },
        { value: 'retirement', label: '🏖️ Save for retirement' },
        { value: 'education', label: '🎓 Education fund' },
        { value: 'other', label: '📋 Something else' },
      ],
    },
    {
      id: 'horizon',
      question: "How long can you invest for?",
      options: [
        { value: 'short', label: '⏰ Less than 1 year' },
        { value: 'medium', label: '⏳ 1-3 years' },
        { value: 'long', label: '🎯 3-5 years' },
        { value: 'very_long', label: '🚀 More than 5 years' },
      ],
    },
    {
      id: 'risk_comfort',
      question: "How do you feel about market ups and downs?",
      options: [
        { value: 'very_conservative', label: '😟 I prefer steady, safe returns' },
        { value: 'conservative', label: '🛡️ I want some stability' },
        { value: 'balanced', label: '⚖️ A mix of safety and growth' },
        { value: 'growth', label: '📈 I can handle volatility for higher returns' },
        { value: 'aggressive', label: '🎢 I want maximum growth' },
      ],
    },
    {
      id: 'experience',
      question: "Have you invested in mutual funds before?",
      options: [
        { value: 'no', label: "❌ No, this is my first time" },
        { value: 'some', label: '✓ Yes, I have some experience' },
        { value: 'frequent', label: '✓✓ Yes, I invest regularly' },
      ],
    },
    {
      id: 'amount',
      question: "How much are you planning to invest initially?",
      options: [
        { value: 'small', label: '₹5,000 - ₹25,000' },
        { value: 'medium', label: '₹25,000 - ₹1,00,000' },
        { value: 'large', label: '₹1,00,000 - ₹5,00,000' },
        { value: 'very_large', label: '₹5,00,000+' },
      ],
    },
  ];

  // Calculate risk profile from answers
  const calculatedRiskProfile = useMemo(() => {
    if (!answers.risk_comfort) return null;

    const riskMap: Record<string, RiskProfile> = {
      very_conservative: 'Conservative',
      conservative: 'Conservative',
      balanced: 'Balanced',
      growth: 'Growth',
      aggressive: 'Growth',
    };

    return riskMap[answers.risk_comfort];
  }, [answers]);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsCompleting(true);
    setTimeout(() => {
      // Navigate to fund recommendation with risk profile
      navigate(
        `/client/funds?risk=${calculatedRiskProfile}&advisor=${mockAdvisor.id}`
      );
    }, 800);
  };

  const isComplete = Object.keys(answers).length === questions.length;
  const question = questions[currentStep];
  const progressPercent = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header with Advisor Info */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-6 py-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex-shrink-0" />
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {mockAdvisor.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {mockAdvisor.experience}+ years experience • ARN: {mockAdvisor.arn}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Question {currentStep + 1} of {questions.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ~{Math.ceil((questions.length - currentStep) / 2)} min
            </p>
          </div>
          <div className="h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-8">
          {/* Question */}
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            {question.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {question.options.map(option => (
              <button
                key={option.value}
                onClick={() => handleAnswer(question.id, option.value)}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                  answers[question.id] === option.value
                    ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {option.label}
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex-1 px-4 py-2 h-10 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            {currentStep < questions.length - 1 ? (
              <button
                onClick={() => {
                  if (currentStep < questions.length - 1) {
                    setCurrentStep(prev => prev + 1);
                  }
                }}
                disabled={!answers[question.id]}
                className="flex-1 px-4 py-2 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={isCompleting || !isComplete}
                className="flex-1 px-4 py-2 h-10 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-green-500 dark:hover:bg-green-600"
              >
                {isCompleting ? 'Setting up...' : 'See Funds'}
              </button>
            )}
          </div>
        </div>

        {/* Trust Message */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          ℹ️ Your answers help {mockAdvisor.name} recommend the best funds for you
        </div>
      </main>
    </div>
  );
};
