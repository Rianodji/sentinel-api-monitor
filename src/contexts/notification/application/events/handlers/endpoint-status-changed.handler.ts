import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EndpointStatusChangedEvent } from '../../../../monitoring/domain/events/endpoint-status-changed.event';
import { SendNotificationUseCase } from '../../use-cases/send-notification.use-case';
import { NotificationType } from '../../../domain/entities/notification.entity';
import { EndpointStatus } from '../../../../monitoring/domain/entities/endpoint.entity';
import { Logger } from '@nestjs/common';

@EventsHandler(EndpointStatusChangedEvent)
export class EndpointStatusChangedHandler implements IEventHandler<EndpointStatusChangedEvent> {
  private readonly logger = new Logger(EndpointStatusChangedHandler.name);

  constructor(private readonly sendNotificationUseCase: SendNotificationUseCase) {}

  async handle(event: EndpointStatusChangedEvent) {
    this.logger.log(`Handling status change event for ${event.url}`);

    const type =
      event.newStatus === EndpointStatus.UP
        ? NotificationType.ENDPOINT_UP
        : NotificationType.ENDPOINT_DOWN;

    const message =
      event.newStatus === EndpointStatus.UP
        ? `Your endpoint ${event.url} is back UP!`
        : `Your endpoint ${event.url} is DOWN!`;

    await this.sendNotificationUseCase.execute(event.userId, type, message);
  }
}
