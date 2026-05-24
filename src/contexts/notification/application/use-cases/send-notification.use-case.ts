import { Injectable, Inject } from '@nestjs/common';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { Notification, NotificationType } from '../../domain/entities/notification.entity';
import { IUserRepository } from '../../../iam/domain/repositories/user.repository.interface';
import { INotificationChannel, NotificationChannelType } from '../../domain/ports/notification-channel.interface';
import { INotificationSettingsRepository } from '../../domain/repositories/notification-settings.repository.interface';

@Injectable()
export class SendNotificationUseCase {
  constructor(
    @Inject('NOTIFICATION_CHANNELS')
    private readonly channels: INotificationChannel[],
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(INotificationSettingsRepository)
    private readonly settingsRepository: INotificationSettingsRepository,
  ) {}

  async execute(userId: string, type: NotificationType, message: string): Promise<void> {
    // 1. Sauvegarder en base pour le centre de notifications
    const notification = Notification.create({
      userId,
      type,
      message,
    });
    await this.notificationRepository.save(notification);

    // 2. Récupérer les réglages de l'utilisateur
    const settings = await this.settingsRepository.findByUserId(userId);
    const user = await this.userRepository.findById(userId);

    if (!user) return;

    // 3. Orchestration de l'envoi sur les différents canaux
    const promises: Promise<void>[] = [];

    for (const channel of this.channels) {
      if (channel.type === NotificationChannelType.EMAIL) {
        // Email activé par défaut ou via réglages
        if (!settings || settings.emailEnabled) {
          promises.push(channel.send(user.email, `Sentinel Alert: ${type}`, message));
        }
      }

      if (channel.type === NotificationChannelType.SLACK) {
        // Slack uniquement si configuré et activé
        if (settings && settings.slackEnabled && settings.slackWebhookUrl) {
          promises.push(channel.send(settings.slackWebhookUrl, `Sentinel Alert: ${type}`, message));
        }
      }
    }

    await Promise.all(promises);
  }
}
