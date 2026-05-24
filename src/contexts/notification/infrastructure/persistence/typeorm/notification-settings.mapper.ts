import { NotificationSettings } from '../../../domain/entities/notification-settings.entity';
import { NotificationSettingsOrmEntity } from './notification-settings.orm-entity';

export class NotificationSettingsMapper {
  public static toDomain(ormEntity: NotificationSettingsOrmEntity): NotificationSettings {
    return NotificationSettings.create(
      {
        userId: ormEntity.userId,
        slackWebhookUrl: ormEntity.slackWebhookUrl ?? undefined,
        slackEnabled: ormEntity.slackEnabled,
        emailEnabled: ormEntity.emailEnabled,
      },
      ormEntity.userId,
    );
  }

  public static toOrm(domainEntity: NotificationSettings): NotificationSettingsOrmEntity {
    const ormEntity = new NotificationSettingsOrmEntity();
    ormEntity.userId = domainEntity.userId;
    ormEntity.slackWebhookUrl = domainEntity.slackWebhookUrl ?? (null as any);
    ormEntity.slackEnabled = domainEntity.slackEnabled;
    ormEntity.emailEnabled = domainEntity.emailEnabled;
    return ormEntity;
  }
}
