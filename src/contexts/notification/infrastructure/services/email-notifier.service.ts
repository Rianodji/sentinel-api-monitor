import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { INotificationChannel, NotificationChannelType } from '../../domain/ports/notification-channel.interface';

@Injectable()
export class EmailNotifierService implements INotificationChannel {
  private readonly logger = new Logger(EmailNotifierService.name);
  private transporter: nodemailer.Transporter;
  public readonly type = NotificationChannelType.EMAIL;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    this.transporter = nodemailer.createTransport({
      host,
      port,
      auth: {
        user,
        pass,
      },
    });

    this.transporter.verify((error) => {
      if (error) {
        this.logger.error(`SMTP Connection Error: ${error.message}`);
      } else {
        this.logger.log('SMTP Server connection verified successfully');
      }
    });
  }

  async send(to: string, subject: string, message: string): Promise<void> {
    try {
      this.logger.debug(`Attempting to send email to: ${to.replace(/(.{3}).*@/, '$1***@')}`);
      
      const info = await this.transporter.sendMail({
        from: `"Sentinel Monitor" <${this.configService.get<string>('SMTP_FROM', 'noreply@sentinel.api')}>`,
        to,
        subject,
        text: message,
        html: `<b>${message}</b>`,
      });

      this.logger.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to.replace(/(.{3}).*@/, '$1***@')}: ${error.message}`);
    }
  }
}
