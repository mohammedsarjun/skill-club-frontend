'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { freelancerActionApi } from '@/api/action/FreelancerActionApi';
import { INotification } from '@/types/interfaces/notification.interface';

const MAX_PREVIEW = 4;

const formatTime = (date: string): string => {
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

const getTypeBadgeColor = (type: INotification['type']): string => {
  const colors: Record<INotification['type'], string> = {
    job: 'bg-blue-100 text-blue-700',
    payment: 'bg-green-100 text-green-700',
    report: 'bg-yellow-100 text-yellow-700',
    system: 'bg-gray-100 text-gray-700',
    admin: 'bg-purple-100 text-purple-700',
    meeting: 'bg-pink-100 text-pink-700',
  };
  return colors[type] ?? colors.system;
};

export const NotificationsSection: React.FC = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const loadNotifications = useCallback(async () => {
    const response = await freelancerActionApi.getNotifications();
    if (response.success) {
      setNotifications(response.data.notifications);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
    );
    await freelancerActionApi.markNotificationAsRead(notificationId);
  };

  const handleSeeAll = () => {
    window.dispatchEvent(new CustomEvent('openNotificationPanel'));
  };

  const preview = notifications.slice(0, MAX_PREVIEW);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {preview.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <Bell className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {preview.map((notif) => (
              <div
                key={notif._id}
                onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                className={`flex gap-3 p-3 rounded-lg transition cursor-pointer ${
                  notif.isRead ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <p className="text-sm font-medium text-gray-900 truncate">{notif.title}</p>
                    <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                      {formatTime(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{notif.message}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${getTypeBadgeColor(notif.type)}`}
                    >
                      {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}
                    </span>
                    {!notif.isRead && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleSeeAll}
          className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition"
        >
          See All Notifications
        </button>
      </div>
    </div>
  );
};
