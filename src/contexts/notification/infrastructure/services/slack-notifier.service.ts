import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { INotificationChannel, NotificationChannelType } from '../../domain/ports/notification-channel.interface';

@Injectable()
export class SlackNotifierService implements INotificationChannel {
  private readonly logger = new Logger(SlackNotifierService.name);
  public readonly type = NotificationChannelType.SLACK;

  async send(webhookUrl: string, subject: string, message: string): Promise<void> {
    if (!webhookUrl) {
      this.logger.warn('Slack Webhook URL is missing, skipping notification');
      return;
    }

    try {
      await axios.post(webhookUrl, {
        text: `*${subject}*\n${message}`,
      });
      this.logger.log('Slack notification sent successfully');
    } catch (error) {
      this.logger.error(`Failed to send Slack notification: ${error.message}`);
    }
  }
}
