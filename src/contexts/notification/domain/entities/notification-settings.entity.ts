import { Entity } from '../../../../shared-kernel/domain/entity.base';

interface NotificationSettingsProps {
  userId: string;
  slackWebhookUrl?: string;
  slackEnabled: boolean;
  emailEnabled: boolean;
}

export class NotificationSettings extends Entity<NotificationSettingsProps> {
  private constructor(props: NotificationSettingsProps, id?: string) {
    super(props, id);
  }

  public static create(props: NotificationSettingsProps, id?: string): NotificationSettings {
    return new NotificationSettings(props, id);
  }

  get userId(): string { return this.props.userId; }
  get slackWebhookUrl(): string | undefined { return this.props.slackWebhookUrl; }
  get slackEnabled(): boolean { return this.props.slackEnabled; }
  get emailEnabled(): boolean { return this.props.emailEnabled; }

  public updateSlackSettings(url: string, enabled: boolean): void {
    this.props.slackWebhookUrl = url;
    this.props.slackEnabled = enabled;
  }
}
