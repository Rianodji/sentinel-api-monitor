import { CheckResult } from '../entities/check-result.entity';

export interface ICheckResultRepository {
  save(checkResult: CheckResult): Promise<void>;
  findByEndpointId(endpointId: string, limit?: number): Promise<CheckResult[]>;
  getSlaStats(endpointId: string, startDate: Date, endDate: Date): Promise<{ sla: number }>;
}

export const ICheckResultRepository = Symbol('ICheckResultRepository');
