import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendTestEmailCommand } from '../send-test-email.command';
import { SendNotificationUseCase } from '../../use-cases/send-notification.use-case';
import { NotificationType } from '../../../domain/entities/notification.entity';

@CommandHandler(SendTestEmailCommand)
export class SendTestEmailHandler implements ICommandHandler<SendTestEmailCommand> {
  constructor(private readonly sendNotificationUseCase: SendNotificationUseCase) {}

  async execute(command: SendTestEmailCommand): Promise<void> {
    await this.sendNotificationUseCase.execute(
      command.userId, 
      NotificationType.ENDPOINT_UP,
      'Ceci est un message de test envoyé via le nouveau moteur multi-tenant de Sentinel (Email + Slack) !',
    );
  }
}
