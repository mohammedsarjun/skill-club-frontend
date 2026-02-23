export interface INotification {
  _id: string;
  userId: string;
  role: 'client' | 'freelancer';
  title: string;
  message: string;
  type: 'job' | 'payment' | 'report' | 'system' | 'admin' | 'meeting';
  isRead: boolean;
  relatedId?: string | null;
  actionUrl?: string | null;
  createdAt: string;
}
