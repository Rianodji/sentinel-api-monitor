import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationOrmEntity } from './persistence/typeorm/notification.orm-entity';
import { NotificationSettingsOrmEntity } from './persistence/typeorm/notification-settings.orm-entity';
import { INotificationRepository } from '../domain/repositories/notification.repository.interface';
import { TypeOrmNotificationRepository } from './persistence/typeorm/notification.repository';
import { INotificationSettingsRepository } from '../domain/repositories/notification-settings.repository.interface';
import { TypeOrmNotificationSettingsRepository } from './persistence/typeorm/notification-settings.repository';
import { SendNotificationUseCase } from '../application/use-cases/send-notification.use-case';
import { UpdateNotificationSettingsUseCase } from '../application/use-cases/update-notification-settings.use-case';
import { EmailNotifierService } from './services/email-notifier.service';
import { IamModule } from '../../iam/infrastructure/iam.module';
import { EndpointStatusChangedHandler } from '../application/events/handlers/endpoint-status-changed.handler';
import { SendTestEmailHandler } from '../application/commands/handlers/send-test-email.handler';
import { SslCertificateExpiringHandler } from '../application/events/handlers/ssl-certificate-expiring.handler';

import { NotificationController } from './controllers/notification.controller';
import { SlackNotifierService } from './services/slack-notifier.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationOrmEntity, NotificationSettingsOrmEntity]),
    CqrsModule,
    IamModule,
  ],
  controllers: [NotificationController],
  providers: [
    {
      provide: INotificationRepository,
      useClass: TypeOrmNotificationRepository,
    },
    {
      provide: INotificationSettingsRepository,
      useClass: TypeOrmNotificationSettingsRepository,
    },
    {
      provide: 'NOTIFICATION_CHANNELS',
      useFactory: (emailService: EmailNotifierService, slackService: SlackNotifierService) => [
        emailService,
        slackService,
      ],
      inject: [EmailNotifierService, SlackNotifierService],
    },
    SendNotificationUseCase,
    UpdateNotificationSettingsUseCase,
    EmailNotifierService,
    SlackNotifierService,
    EndpointStatusChangedHandler,
    SendTestEmailHandler,
    SslCertificateExpiringHandler,
  ],
  exports: [SendNotificationUseCase, UpdateNotificationSettingsUseCase],
})
export class NotificationModule {}
