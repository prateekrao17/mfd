import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface MinimalHeaderProps {
  title?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

/**
 * Minimal header with logo, search (optional), and profile
 * Design spec: Logo | Search | Profile (minimal)
 */
export const MinimalHeader: React.FC<MinimalHeaderProps> = ({
  title = 'MFD Advisor',
  showSearch = true,
  onSearch,
}) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
            />
          </div>
        )}

        {/* Profile Section */}
        <div className="flex-shrink-0 flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md" title="Profile">
            RP
          </div>
          
          {/* View Profile CTA */}
          <button 
            onClick={() => navigate('/advisor/profile')}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            View Profile
          </button>
        </div>

        {/* Original Profile Section - Hidden */}
        <div className="flex-shrink-0 hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
};
