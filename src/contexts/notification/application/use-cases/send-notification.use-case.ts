import { Injectable, Inject } from '@nestjs/common';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { Notification, NotificationType } from '../../domain/entities/notification.entity';
import { EmailNotifierService } from '../../infrastructure/services/email-notifier.service';
import { IUserRepository } from '../../../iam/domain/repositories/user.repository.interface';

@Injectable()
export class SendNotificationUseCase {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly emailService: EmailNotifierService,
  ) {}

  async execute(userId: string, type: NotificationType, message: string): Promise<void> {
    // 1. Sauvegarder en base pour le centre de notifications
    const notification = Notification.create({
      userId,
      type,
      message,
    });
    await this.notificationRepository.save(notification);

    // 2. Envoyer un email (si l'utilisateur existe et a un email)
    const user = await this.userRepository.findById(userId);
    if (user && user.email) {
      await this.emailService.sendEmail(
        user.email,
        `Sentinel Alert: ${type}`,
        message
      );
    }
  }
}
