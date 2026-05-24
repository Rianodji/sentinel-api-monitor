import { Entity } from '../../../../shared-kernel/domain/entity.base';

export enum NotificationType {
  ENDPOINT_DOWN = 'ENDPOINT_DOWN',
  ENDPOINT_UP = 'ENDPOINT_UP',
  SSL_EXPIRING = 'SSL_EXPIRING',
}

interface NotificationProps {
  userId: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: Date;
}

export class Notification extends Entity<NotificationProps> {
  private constructor(props: NotificationProps, id?: string) {
    super(props, id);
  }

  public static create(props: Omit<NotificationProps, 'read' | 'createdAt'>, id?: string): Notification {
    return new Notification(
      {
        ...props,
        read: false,
        createdAt: new Date(),
      },
      id,
    );
  }

  get userId(): string { return this.props.userId; }
  get type(): NotificationType { return this.props.type; }
  get message(): string { return this.props.message; }
  get read(): boolean { return this.props.read; }
  get createdAt(): Date { return this.props.createdAt; }

  public markAsRead(): void {
    this.props.read = true;
  }
}
