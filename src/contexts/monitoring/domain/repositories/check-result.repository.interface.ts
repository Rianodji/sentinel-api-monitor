import { CheckResult } from '../entities/check-result.entity';

export interface ICheckResultRepository {
  save(checkResult: CheckResult): Promise<void>;
  findByEndpointId(endpointId: string, limit?: number): Promise<CheckResult[]>;
}

export const ICheckResultRepository = Symbol('ICheckResultRepository');
