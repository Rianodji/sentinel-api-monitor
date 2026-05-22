import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INotificationRepository } from '../../../domain/repositories/notification.repository.interface';
import { Notification, NotificationType } from '../../../domain/entities/notification.entity';
import { NotificationOrmEntity } from './notification.orm-entity';

@Injectable()
export class TypeOrmNotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationOrmEntity)
    private readonly repository: Repository<NotificationOrmEntity>,
  ) {}

  async save(notification: Notification): Promise<void> {
    const ormEntity = new NotificationOrmEntity();
    ormEntity.id = notification.id;
    ormEntity.userId = notification.userId;
    ormEntity.type = notification.type;
    ormEntity.message = notification.message;
    ormEntity.read = notification.read;
    ormEntity.createdAt = notification.createdAt;
    await this.repository.save(ormEntity);
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const ormEntities = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    
    return ormEntities.map(orm => Notification.create(
      {
        userId: orm.userId,
        type: orm.type as NotificationType,
        message: orm.message,
      },
      orm.id
    ));
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.repository.update({ userId }, { read: true });
  }
}
