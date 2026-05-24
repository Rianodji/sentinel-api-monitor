import { Injectable, Inject } from '@nestjs/common';
import { ICheckResultRepository } from '../../domain/repositories/check-result.repository.interface';

@Injectable()
export class GetSlaReportUseCase {
  constructor(
    @Inject(ICheckResultRepository)
    private readonly checkResultRepository: ICheckResultRepository,
  ) {}

  async execute(endpointId: string): Promise<{ sla: number }> {
    // Calcul pour les 30 derniers jours
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    return await this.checkResultRepository.getSlaStats(endpointId, startDate, endDate);
  }
}
