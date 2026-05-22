import { Inject, Injectable } from '@nestjs/common';
import { IEndpointRepository } from '../../domain/repositories/endpoint.repository.interface';
import { Endpoint } from '../../domain/entities/endpoint.entity';
import { CreateEndpointDto } from '../dtos/create-endpoint.dto';
import { MonitoringSchedulerService } from '../../infrastructure/services/monitoring-scheduler.service';

@Injectable()
export class CreateEndpointUseCase {
  constructor(
    @Inject(IEndpointRepository)
    private readonly endpointRepository: IEndpointRepository,
    private readonly schedulerService: MonitoringSchedulerService,
  ) {}

  async execute(dto: CreateEndpointDto, userId: string): Promise<string> {
    const endpoint = Endpoint.create({
      name: dto.name,
      url: dto.url,
      interval: dto.interval,
      userId: userId,
    });

    await this.endpointRepository.save(endpoint);
    
    // Planification immédiate du monitoring
    await this.schedulerService.scheduleEndpoint(
      endpoint.id,
      endpoint.url,
      endpoint.interval,
    );

    return endpoint.id;
  }
}
