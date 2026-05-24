import { Injectable, Inject } from '@nestjs/common';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { Notification, NotificationType } from '../../domain/entities/notification.entity';
import { IUserRepository } from '../../../iam/domain/repositories/user.repository.interface';
import { INotificationChannel } from '../../domain/ports/notification-channel.interface';

@Injectable()
export class SendNotificationUseCase {
  constructor(
    @Inject('NOTIFICATION_CHANNELS')
    private readonly channels: INotificationChannel[],
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, type: NotificationType, message: string): Promise<void> {
    // 1. Sauvegarder en base pour le centre de notifications
    const notification = Notification.create({
      userId,
      type,
      message,
    });
    await this.notificationRepository.save(notification);

    // 2. Envoyer via tous les canaux configurés
    const user = await this.userRepository.findById(userId);
    if (user && user.email) {
      await Promise.all(
        this.channels.map((channel) =>
          channel.send(user.email, `Sentinel Alert: ${type}`, message),
        ),
      );
    }
  }
}
