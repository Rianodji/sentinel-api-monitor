import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
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
    const persistenceEntity = CheckResultMapper.toOrm(checkResult);
    await this.repository.save(persistenceEntity);
  }

  async findByEndpointId(endpointId: string, limit: number = 10): Promise<CheckResult[]> {
    const entities = await this.repository.find({
      where: { endpointId },
      order: { checkedAt: 'DESC' },
      take: limit,
    });
    return entities.map(CheckResultMapper.toDomain);
  }

  async getSlaStats(endpointId: string, startDate: Date, endDate: Date): Promise<{ sla: number }> {
    const result = await this.repository
      .createQueryBuilder('check_result')
      .select("AVG(CASE WHEN status = 'UP' THEN 100.0 ELSE 0.0 END)", 'sla')
      .where('check_result.endpointId = :endpointId', { endpointId })
      .andWhere('check_result.checkedAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    return { sla: parseFloat(result.sla) || 0 };
  }
}

