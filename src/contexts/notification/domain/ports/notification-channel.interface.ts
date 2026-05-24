export enum NotificationChannelType {
  EMAIL = 'EMAIL',
  SLACK = 'SLACK',
}

export interface INotificationChannel {
  type: NotificationChannelType;
  send(to: string, subject: string, message: string): Promise<void>;
}
