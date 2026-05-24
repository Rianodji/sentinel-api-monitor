import { Injectable, Inject } from '@nestjs/common';
import { INotificationSettingsRepository } from '../../domain/repositories/notification-settings.repository.interface';
import { NotificationSettings } from '../../domain/entities/notification-settings.entity';
import { UpdateNotificationSettingsDto } from '../dtos/update-notification-settings.dto';

@Injectable()
export class UpdateNotificationSettingsUseCase {
  constructor(
    @Inject(INotificationSettingsRepository)
    private readonly repository: INotificationSettingsRepository,
  ) {}

  async execute(userId: string, dto: UpdateNotificationSettingsDto): Promise<void> {
    let settings = await this.repository.findByUserId(userId);

    if (!settings) {
      settings = NotificationSettings.create({
        userId,
        slackWebhookUrl: dto.slackWebhookUrl,
        slackEnabled: dto.slackEnabled ?? false,
        emailEnabled: dto.emailEnabled ?? true,
      });
    } else {
      if (dto.slackWebhookUrl !== undefined) {
        settings.updateSlackSettings(dto.slackWebhookUrl, dto.slackEnabled ?? settings.slackEnabled);
      }
      // Note: On pourrait ajouter updateEmailSettings ici si besoin
    }

    await this.repository.save(settings);
  }
}
