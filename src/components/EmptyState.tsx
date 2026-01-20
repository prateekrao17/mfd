import React from 'react';
import { motion } from 'framer-motion';
import { scaleIn } from '../utils/animations';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  illustration?: 'clients' | 'funds' | 'search' | 'error';
}

/**
 * Empty State Component
 * Beautiful illustrations for various empty/error states
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, illustration }) => {
  const renderIllustration = () => {
    switch (illustration) {
      case 'clients':
        return (
          <svg className="w-48 h-48 text-gray-300 dark:text-gray-600" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="70" r="30" fill="currentColor" opacity="0.2" />
            <path
              d="M60 150c0-22.091 17.909-40 40-40s40 17.909 40 40"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.2"
            />
            <circle cx="150" cy="60" r="20" fill="currentColor" opacity="0.1" />
            <circle cx="50" cy="60" r="20" fill="currentColor" opacity="0.1" />
          </svg>
        );
      case 'funds':
        return (
          <svg className="w-48 h-48 text-gray-300 dark:text-gray-600" viewBox="0 0 200 200" fill="none">
            <rect x="40" y="80" width="30" height="80" rx="4" fill="currentColor" opacity="0.2" />
            <rect x="85" y="50" width="30" height="110" rx="4" fill="currentColor" opacity="0.15" />
            <rect x="130" y="70" width="30" height="90" rx="4" fill="currentColor" opacity="0.1" />
            <line x1="30" y1="170" x2="170" y2="170" stroke="currentColor" strokeWidth="2" opacity="0.2" />
          </svg>
        );
      case 'search':
        return (
          <svg className="w-48 h-48 text-gray-300 dark:text-gray-600" viewBox="0 0 200 200" fill="none">
            <circle cx="85" cy="85" r="40" stroke="currentColor" strokeWidth="8" opacity="0.2" />
            <line x1="115" y1="115" x2="145" y2="145" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.2" />
            <path d="M80 85h10M85 80v10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.15" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-48 h-48 text-red-300 dark:text-red-600" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="8" opacity="0.2" />
            <path d="M80 80l40 40M120 80l-40 40" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
          </svg>
        );
      default:
        return icon;
    }
  };

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="mb-6">{renderIllustration()}</div>

      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>

      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">{description}</p>

      {action && (
        <motion.button
          onClick={action.onClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

/**
 * Error State Component
 */
export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({ title = 'Something went wrong', message = 'Please try again later', onRetry }) => {
  return (
    <EmptyState
      illustration="error"
      title={title}
      description={message}
      action={onRetry ? { label: 'Try Again', onClick: onRetry } : undefined}
    />
  );
};

/**
 * No Search Results Component
 */
export const NoSearchResults: React.FC<{ query: string; onClear: () => void }> = ({ query, onClear }) => {
  return (
    <EmptyState
      illustration="search"
      title="No results found"
      description={`We couldn't find any results for "${query}". Try adjusting your search.`}
      action={{ label: 'Clear Search', onClick: onClear }}
    />
  );
};
