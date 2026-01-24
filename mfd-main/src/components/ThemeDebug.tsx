import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Theme Debug Component
 * Shows current theme state - for development only
 */
export const ThemeDebug: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-lg z-50 text-xs">
      <div className="font-bold text-gray-900 dark:text-gray-100">Theme Debug</div>
      <div className="text-gray-600 dark:text-gray-400">
        Current: <span className="font-mono font-bold">{theme}</span>
      </div>
      <div className="text-gray-600 dark:text-gray-400">
        HTML class: <span className="font-mono">{document.documentElement.className}</span>
      </div>
    </div>
  );
};
