import React from 'react';

interface MinimalMetricCardProps {
  value: number | string;
  label: string;
  accent?: 'default' | 'success' | 'warning';
}

/**
 * Minimal metric card following design spec:
 * - Large number (36px, 700 weight)
 * - Small label below (14px)
 * - Subtle border, no icons
 * - Success = green, Warning = amber
 */
export const MinimalMetricCard: React.FC<MinimalMetricCardProps> = ({
  value,
  label,
  accent = 'default',
}) => {
  const accentColors = {
    default: 'text-gray-900 dark:text-white',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-amber-600 dark:text-amber-400',
  };

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
      <div className={`text-4xl font-bold ${accentColors[accent]}`}>
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        {label}
      </div>
    </div>
  );
};
