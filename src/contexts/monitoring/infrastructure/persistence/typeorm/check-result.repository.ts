import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICheckResultRepository } from '../../../domain/repositories/check-result.repository.interface';
import { CheckResult } from '../../../domain/entities/check-result.entity';
import { CheckResultOrmEntity } from './check-result.orm-entity';
import { CheckResultMapper } from './check-result.mapper';

@Injectable()
export class TypeOrmCheckResultRepository implements ICheckResultRepository {
  constructor(
    @InjectRepository(CheckResultOrmEntity)
    private readonly repository: Repository<CheckResultOrmEntity>,
  ) {}

  async save(checkResult: CheckResult): Promise<void> {
    const ormEntity = CheckResultMapper.toOrm(checkResult);
    await this.repository.save(ormEntity);
  }

  async findByEndpointId(endpointId: string, limit: number = 50): Promise<CheckResult[]> {
    const ormEntities = await this.repository.find({
      where: { endpointId },
      order: { checkedAt: 'DESC' },
      take: limit,
    });
    return ormEntities.map(CheckResultMapper.toDomain);
  }
}
