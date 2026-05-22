import { EndpointStatus } from '../entities/endpoint.entity';

export class EndpointStatusChangedEvent {
  constructor(
    public readonly endpointId: string,
    public readonly userId: string,
    public readonly url: string,
    public readonly oldStatus: EndpointStatus,
    public readonly newStatus: EndpointStatus,
  ) {}
}
