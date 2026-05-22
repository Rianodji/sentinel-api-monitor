import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ICheckResultRepository } from '../../domain/repositories/check-result.repository.interface';
import { IEndpointRepository } from '../../domain/repositories/endpoint.repository.interface';
import { CheckResult } from '../../domain/entities/check-result.entity';

@Injectable()
export class GetEndpointHistoryUseCase {
  constructor(
    @Inject(ICheckResultRepository)
    private readonly checkResultRepository: ICheckResultRepository,
    @Inject(IEndpointRepository)
    private readonly endpointRepository: IEndpointRepository,
  ) {}

  async execute(endpointId: string, userId: string): Promise<CheckResult[]> {
    const endpoint = await this.endpointRepository.findById(endpointId);
    
    if (!endpoint) {
      throw new NotFoundException('Endpoint not found');
    }

    if (endpoint.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view this history');
    }

    return this.checkResultRepository.findByEndpointId(endpointId);
  }
}
