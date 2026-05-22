import { CheckResult } from '../../../domain/entities/check-result.entity';
import { CheckResultOrmEntity } from './check-result.orm-entity';

export class CheckResultMapper {
  public static toDomain(ormEntity: CheckResultOrmEntity): CheckResult {
    return CheckResult.create(
      {
        endpointId: ormEntity.endpointId,
        status: ormEntity.status,
        responseTime: ormEntity.responseTime,
        statusCode: ormEntity.statusCode ?? undefined,
        errorMessage: ormEntity.errorMessage ?? undefined,
      },
      ormEntity.id,
    );
  }

  public static toOrm(domainEntity: CheckResult): CheckResultOrmEntity {
    const ormEntity = new CheckResultOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.endpointId = domainEntity.endpointId;
    ormEntity.status = domainEntity.status;
    ormEntity.responseTime = domainEntity.responseTime;
    ormEntity.statusCode = domainEntity.statusCode ?? null;
    ormEntity.errorMessage = domainEntity.errorMessage ?? null;
    ormEntity.checkedAt = domainEntity.checkedAt;
    return ormEntity;
  }
}
