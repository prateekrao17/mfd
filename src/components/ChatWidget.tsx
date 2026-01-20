import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'advisor' | 'client';
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatWidgetProps {
  clientId?: string;
  advisorId?: string;
  userType: 'advisor' | 'client';
  advisorName?: string;
  clientName?: string;
}

const messageTemplates = [
  'Great to see you viewed the proposal!',
  'Let me know if you have any questions',
  'Would you like to schedule a call to discuss your portfolio?',
  "I'm here to help with any concerns you may have",
  'Thank you for your interest in these funds!',
];

// Mock messages
const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'adv_001',
    senderName: 'Rajesh Kumar',
    senderType: 'advisor',
    content: "Hi! I've prepared a personalized investment plan for you. Feel free to ask any questions!",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: true,
  },
  {
    id: '2',
    senderId: 'client_001',
    senderName: 'Priya Sharma',
    senderType: 'client',
    content: 'Thank you! I have a question about the HDFC Top 100 Fund.',
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    isRead: true,
  },
  {
    id: '3',
    senderId: 'adv_001',
    senderName: 'Rajesh Kumar',
    senderType: 'advisor',
    content: "Of course! The HDFC Top 100 Fund invests in India's top large-cap companies. It's great for stable growth with lower risk.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    isRead: true,
  },
];

/**
 * Chat Widget Component
 * Intercom/Drift-style messaging interface
 */
export const ChatWidget: React.FC<ChatWidgetProps> = ({
  userType,
  advisorName = 'Your Advisor',
  clientName = 'Client',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const unreadCount = messages.filter((m) => !m.isRead && m.senderType !== userType).length;

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Mark messages as read when opened
      setMessages((prev) =>
        prev.map((m) => (m.senderType !== userType ? { ...m, isRead: true } : m))
      );
    }
  }, [isOpen, userType]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (content?: string) => {
    const messageText = content || inputValue.trim();
    if (!messageText) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: userType === 'advisor' ? 'adv_001' : 'client_001',
      senderName: userType === 'advisor' ? advisorName : clientName,
      senderType: userType,
      content: messageText,
      timestamp: new Date(),
      isRead: false,
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setShowTemplates(false);

    // Simulate typing indicator for response
    if (userType === 'client') {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const response: Message = {
            id: (Date.now() + 1).toString(),
            senderId: 'adv_001',
            senderName: advisorName,
            senderType: 'advisor',
            content: "Thanks for your message! I'll get back to you shortly.",
            timestamp: new Date(),
            isRead: false,
          };
          setMessages((prev) => [...prev, response]);
          setIsTyping(false);
        }, 2000);
      }, 500);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform z-50"
        >
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
              {unreadCount}
            </div>
          )}
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-slide-in-bottom">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                {userType === 'advisor' ? clientName.charAt(0) : advisorName.charAt(0)}
              </div>
              <div>
                <div className="font-semibold">{userType === 'advisor' ? clientName : advisorName}</div>
                <div className="text-xs text-blue-100">
                  {userType === 'advisor' ? 'Client' : 'Financial Advisor'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => {
              const isOwn = message.senderType === userType;
              return (
                <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${isOwn ? 'order-2' : 'order-1'}`}>
                    {!isOwn && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 ml-1">{message.senderName}</div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwn
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white rounded-br-none'
                          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isOwn ? 'text-right mr-1' : 'ml-1'}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Templates (Advisor Only) */}
          {userType === 'advisor' && showTemplates && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Quick Replies</div>
              <div className="space-y-1">
                {messageTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(template)}
                    className="w-full text-left text-sm px-3 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg transition"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            <div className="flex gap-2">
              {userType === 'advisor' && (
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-600 dark:text-gray-400"
                  title="Quick replies"
                  aria-label="Toggle quick replies"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              )}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim()}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in-bottom {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-in-bottom {
          animation: slide-in-bottom 0.3s ease-out;
        }
      `}</style>
    </>
  );
};
