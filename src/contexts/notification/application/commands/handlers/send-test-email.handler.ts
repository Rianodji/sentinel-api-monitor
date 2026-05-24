import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendTestEmailCommand } from '../send-test-email.command';
import { EmailNotifierService } from '../../../infrastructure/services/email-notifier.service';

@CommandHandler(SendTestEmailCommand)
export class SendTestEmailHandler implements ICommandHandler<SendTestEmailCommand> {
  constructor(private readonly emailService: EmailNotifierService) {}

  async execute(command: SendTestEmailCommand): Promise<void> {
    await this.emailService.send(
      command.email || 'test@example.com',
      'Test Email Sentinel',
      'Ceci est un email de test de votre infrastructure Sentinel via CommandBus.',
    );
  }
}
