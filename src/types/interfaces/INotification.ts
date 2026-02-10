export interface INotification {
  _id: string;
  userId: string;
  role: 'client' | 'freelancer';
  title: string;
  message: string;
  type: 'job' | 'payment' | 'report' | 'system' | 'admin' | 'meeting';
  isRead: boolean;
  relatedId?: string;
  actionUrl?: string;
  createdAt: Date;
}

export interface INotificationListResponse {
  success: boolean;
  data: {
    notifications: INotification[];
    unreadCount: number;
    totalCount: number;
  };
}