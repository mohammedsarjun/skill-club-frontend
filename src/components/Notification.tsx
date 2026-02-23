import React, { useState } from 'react';
import { Check, Bell, X } from 'lucide-react';

import { INotification } from '@/types/interfaces/notification.interface';

interface NotificationCenterProps {
  notifications: INotification[];
  onMarkAsRead: (notificationId: string) => void;
  onNotificationClick?: (notification: INotification) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onNotificationClick,
}) => {
  const [activeTab, setActiveTab] = useState<'unread' | 'all'>('unread');

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const displayedNotifications = activeTab === 'unread' ? unreadNotifications : notifications;

  const getTypeColor = (type: INotification['type']) => {
    const colors = {
      job: 'bg-blue-100 text-blue-800',
      payment: 'bg-green-100 text-green-800',
      report: 'bg-yellow-100 text-yellow-800',
      system: 'bg-gray-100 text-gray-800',
      admin: 'bg-purple-100 text-purple-800',
      meeting: 'bg-pink-100 text-pink-800',
    };
    return colors[type] || colors.system;
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMs = now.getTime() - notificationDate.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return notificationDate.toLocaleDateString();
  };

  const handleMarkAsRead = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    onMarkAsRead(notificationId);
  };

  const handleNotificationClick = (notification: INotification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            {unreadNotifications.length > 0 && (
              <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
                {unreadNotifications.length}
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('unread')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'unread'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Unread {unreadNotifications.length > 0 && `(${unreadNotifications.length})`}
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({notifications.length})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[500px] overflow-y-auto">
        {displayedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Bell className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">
              {activeTab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {displayedNotifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 transition-colors cursor-pointer hover:bg-gray-50 ${
                  !notification.isRead ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex gap-3">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(notification.type)}`}>
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </span>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                  </div>

                  {/* Mark as Read Button - Only show in unread tab for unread notifications */}
                  {activeTab === 'unread' && !notification.isRead && (
                    <button
                      onClick={(e) => handleMarkAsRead(e, notification._id)}
                      className="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-green-600 flex-shrink-0"
                      title="Mark as read"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;