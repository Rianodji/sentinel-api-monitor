import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INotificationSettingsRepository } from '../../../domain/repositories/notification-settings.repository.interface';
import { NotificationSettings } from '../../../domain/entities/notification-settings.entity';
import { NotificationSettingsOrmEntity } from './notification-settings.orm-entity';
import { NotificationSettingsMapper } from './notification-settings.mapper';

@Injectable()
export class TypeOrmNotificationSettingsRepository implements INotificationSettingsRepository {
  constructor(
    @InjectRepository(NotificationSettingsOrmEntity)
    private readonly repository: Repository<NotificationSettingsOrmEntity>,
  ) {}

  async findByUserId(userId: string): Promise<NotificationSettings | null> {
    const entity = await this.repository.findOneBy({ userId });
    return entity ? NotificationSettingsMapper.toDomain(entity) : null;
  }

  async save(settings: NotificationSettings): Promise<void> {
    const persistenceEntity = NotificationSettingsMapper.toOrm(settings);
    await this.repository.save(persistenceEntity);
  }
}
