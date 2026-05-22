import { Notification } from '../entities/notification.entity';

export interface INotificationRepository {
  save(notification: Notification): Promise<void>;
  findByUserId(userId: string): Promise<Notification[]>;
  markAllAsRead(userId: string): Promise<void>;
}

export const INotificationRepository = Symbol('INotificationRepository');
