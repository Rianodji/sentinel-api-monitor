import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailNotifierService {
  private readonly logger = new Logger(EmailNotifierService.name);
  private transporter: nodemailer.Transporter;

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

    // Vérifier la connexion au démarrage (sans logger de détails sensibles)
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error(`SMTP Connection Error: ${error.message}`);
      } else {
        this.logger.log('SMTP Server connection verified successfully');
      }
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      this.logger.debug(`Attempting to send email to: ${to.replace(/(.{3}).*@/, '$1***@')}`); // Masquage partiel de l'email
      
      const info = await this.transporter.sendMail({
        from: `"Sentinel Monitor" <${this.configService.get<string>('SMTP_FROM', 'noreply@sentinel.api')}>`,
        to,
        subject,
        text: body,
        html: `<b>${body}</b>`,
      });

      this.logger.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to.replace(/(.{3}).*@/, '$1***@')}: ${error.message}`);
    }
  }
}
