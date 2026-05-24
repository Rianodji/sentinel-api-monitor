import { NotificationSettings } from '../entities/notification-settings.entity';

export interface INotificationSettingsRepository {
  findByUserId(userId: string): Promise<NotificationSettings | null>;
  save(settings: NotificationSettings): Promise<void>;
}

export const INotificationSettingsRepository = Symbol('INotificationSettingsRepository');
