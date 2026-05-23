import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SslCertificateExpiringEvent } from '../../../../monitoring/domain/events/ssl-certificate-expiring.event';
import { SendNotificationUseCase } from '../../use-cases/send-notification.use-case';
import { NotificationType } from '../../../domain/entities/notification.entity';
import { Logger } from '@nestjs/common';

@EventsHandler(SslCertificateExpiringEvent)
export class SslCertificateExpiringHandler implements IEventHandler<SslCertificateExpiringEvent> {
  private readonly logger = new Logger(SslCertificateExpiringHandler.name);

  constructor(private readonly sendNotificationUseCase: SendNotificationUseCase) {}

  async handle(event: SslCertificateExpiringEvent) {
    this.logger.log(`Handling SSL expiration event for ${event.url}`);

    const message = `Your SSL certificate for ${event.url} will expire in ${event.daysRemaining} days! Please renew it soon.`;

    await this.sendNotificationUseCase.execute(
      event.userId,
      NotificationType.SSL_EXPIRING,
      message,
    );
  }
}
