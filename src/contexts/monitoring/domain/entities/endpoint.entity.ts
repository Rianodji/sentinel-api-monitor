import { Entity } from '../../../../shared-kernel/domain/entity.base';

export enum EndpointStatus {
  UP = 'UP',
  DOWN = 'DOWN',
  PENDING = 'PENDING',
}

interface EndpointProps {
  url: string;
  name: string;
  interval: number; // en secondes
  userId: string;
  status: EndpointStatus;
  lastCheck?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Endpoint extends Entity<EndpointProps> {
  private constructor(props: EndpointProps, id?: string) {
    super(props, id);
  }

  public static create(
    props: Omit<EndpointProps, 'status' | 'createdAt' | 'updatedAt' | 'lastCheck'>,
    id?: string,
  ): Endpoint {
    return new Endpoint(
      {
        ...props,
        status: EndpointStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    );
  }

  get url(): string { return this.props.url; }
  get name(): string { return this.props.name; }
  get interval(): number { return this.props.interval; }
  get userId(): string { return this.props.userId; }
  get status(): EndpointStatus { return this.props.status; }
  get lastCheck(): Date | undefined { return this.props.lastCheck; }

  public updateStatus(status: EndpointStatus): void {
    this.props.status = status;
    this.props.lastCheck = new Date();
    this.props.updatedAt = new Date();
  }
}
