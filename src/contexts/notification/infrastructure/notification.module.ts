import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationOrmEntity } from './persistence/typeorm/notification.orm-entity';
import { INotificationRepository } from '../domain/repositories/notification.repository.interface';
import { TypeOrmNotificationRepository } from './persistence/typeorm/notification.repository';
import { SendNotificationUseCase } from '../application/use-cases/send-notification.use-case';
import { EmailNotifierService } from './services/email-notifier.service';
import { IamModule } from '../../iam/infrastructure/iam.module';
import { EndpointStatusChangedHandler } from '../application/events/handlers/endpoint-status-changed.handler';
import { SendTestEmailHandler } from '../application/commands/handlers/send-test-email.handler';
import { SslCertificateExpiringHandler } from '../application/events/handlers/ssl-certificate-expiring.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationOrmEntity]),
    CqrsModule,
    IamModule, // Nécessaire pour accéder à IUserRepository
  ],
  providers: [
    {
      provide: INotificationRepository,
      useClass: TypeOrmNotificationRepository,
    },
    SendNotificationUseCase,
    EmailNotifierService,
    EndpointStatusChangedHandler,
    SendTestEmailHandler,
    SslCertificateExpiringHandler,
  ],
  exports: [SendNotificationUseCase],
})
export class NotificationModule {}
