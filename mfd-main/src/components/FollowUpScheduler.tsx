import React, { useState } from 'react';
import { Client } from '../types';

interface FollowUp {
  id: string;
  clientId: string;
  clientName: string;
  type: 'call' | 'email' | 'reminder';
  scheduledFor: Date;
  notes: string;
  completed: boolean;
}

interface FollowUpSchedulerProps {
  client?: Client;
  onSchedule?: (followUp: FollowUp) => void;
}

// Mock follow-ups
const mockFollowUps: FollowUp[] = [
  {
    id: '1',
    clientId: 'client_002',
    clientName: 'Amit Patel',
    type: 'call',
    scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000),
    notes: 'Follow up on stalled proposal',
    completed: false,
  },
  {
    id: '2',
    clientId: 'client_001',
    clientName: 'Priya Sharma',
    type: 'email',
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
    notes: 'Send additional fund information',
    completed: false,
  },
  {
    id: '3',
    clientId: 'client_003',
    clientName: 'Sneha Reddy',
    type: 'reminder',
    scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    notes: 'Check if KYC is completed',
    completed: false,
  },
];

/**
 * Follow-Up Scheduler Component
 * Allows advisors to schedule and track client follow-ups
 */
export const FollowUpScheduler: React.FC<FollowUpSchedulerProps> = ({ client, onSchedule }) => {
  const [showScheduler, setShowScheduler] = useState(false);
  const [followUps, setFollowUps] = useState<FollowUp[]>(mockFollowUps);
  const [formData, setFormData] = useState({
    type: 'call' as FollowUp['type'],
    date: '',
    time: '',
    notes: '',
  });

  const upcomingFollowUps = followUps
    .filter((f) => !f.completed && new Date(f.scheduledFor) > new Date())
    .sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());

  const handleSchedule = () => {
    if (!formData.date || !formData.time || !client) return;

    const scheduledFor = new Date(`${formData.date}T${formData.time}`);
    const newFollowUp: FollowUp = {
      id: Date.now().toString(),
      clientId: client.id,
      clientName: client.name,
      type: formData.type,
      scheduledFor,
      notes: formData.notes,
      completed: false,
    };

    setFollowUps([...followUps, newFollowUp]);
    onSchedule?.(newFollowUp);

    // Reset form
    setFormData({
      type: 'call',
      date: '',
      time: '',
      notes: '',
    });
    setShowScheduler(false);
  };

  const markComplete = (id: string) => {
    setFollowUps(followUps.map((f) => (f.id === id ? { ...f, completed: true } : f)));
  };

  const formatDateTime = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    let timeStr = '';
    if (diffMins < 60) {
      timeStr = `in ${diffMins} minutes`;
    } else if (diffHours < 24) {
      timeStr = `in ${diffHours} hours`;
    } else if (diffDays === 1) {
      timeStr = 'tomorrow';
    } else if (diffDays < 7) {
      timeStr = `in ${diffDays} days`;
    } else {
      timeStr = date.toLocaleDateString();
    }

    return `${timeStr} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getTypeIcon = (type: FollowUp['type']) => {
    switch (type) {
      case 'call':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        );
      case 'email':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case 'reminder':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        );
    }
  };

  const getTypeColor = (type: FollowUp['type']) => {
    switch (type) {
      case 'call':
        return 'bg-blue-100 text-blue-700';
      case 'email':
        return 'bg-purple-100 text-purple-700';
      case 'reminder':
        return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Follow-Ups & Reminders</h3>
        {client && (
          <button
            onClick={() => setShowScheduler(!showScheduler)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            + Schedule
          </button>
        )}
      </div>

      {/* Schedule Form */}
      {showScheduler && client && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Schedule Follow-Up for {client.name}</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as FollowUp['type'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="call">Phone Call</option>
                <option value="email">Email</option>
                <option value="reminder">Reminder</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add notes about this follow-up..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSchedule}
                disabled={!formData.date || !formData.time}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule
              </button>
              <button
                onClick={() => setShowScheduler(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Follow-Ups */}
      {upcomingFollowUps.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          No upcoming follow-ups scheduled
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingFollowUps.map((followUp) => (
            <div
              key={followUp.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getTypeColor(followUp.type)}`}>
                  {getTypeIcon(followUp.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{followUp.clientName}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{formatDateTime(followUp.scheduledFor)}</div>
                    </div>
                    <button
                      onClick={() => markComplete(followUp.id)}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Mark Done
                    </button>
                  </div>
                  {followUp.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{followUp.notes}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Calendar Integration (Mock) */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">Sync with Calendar</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Export follow-ups to Google Calendar or Outlook</div>
          </div>
          <button className="px-3 py-1.5 bg-white text-blue-600 rounded-lg hover:shadow transition text-sm font-medium">
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};
