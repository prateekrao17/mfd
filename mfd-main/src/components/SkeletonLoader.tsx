import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

/**
 * Skeleton Loader Component
 * Provides shimmer effect while content is loading
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'rectangular',
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear',
        }}
      />
    </div>
  );
};

/**
 * Table Skeleton Loader
 */
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} height="3rem" className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Card Skeleton Loader
 */
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
      <Skeleton height="2rem" width="60%" />
      <Skeleton height="1rem" width="80%" />
      <Skeleton height="1rem" width="70%" />
      <div className="flex gap-3 mt-4">
        <Skeleton height="2.5rem" width="5rem" />
        <Skeleton height="2.5rem" width="5rem" />
      </div>
    </div>
  );
};

/**
 * Dashboard Stats Skeleton
 */
export const DashboardStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <Skeleton height="1rem" width="50%" className="mb-3" />
          <Skeleton height="2.5rem" width="70%" className="mb-2" />
          <Skeleton height="0.75rem" width="40%" />
        </div>
      ))}
    </div>
  );
};
