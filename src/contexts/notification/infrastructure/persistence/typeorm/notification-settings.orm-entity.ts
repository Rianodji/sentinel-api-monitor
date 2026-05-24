import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('notification_settings')
export class NotificationSettingsOrmEntity {
  @PrimaryColumn('uuid')
  userId: string;

  @Column({ nullable: true })
  slackWebhookUrl: string;

  @Column({ default: false })
  slackEnabled: boolean;

  @Column({ default: true })
  emailEnabled: boolean;
}
