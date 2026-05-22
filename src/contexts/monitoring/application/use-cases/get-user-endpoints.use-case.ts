import { Inject, Injectable } from '@nestjs/common';
import { IEndpointRepository } from '../../domain/repositories/endpoint.repository.interface';
import { Endpoint } from '../../domain/entities/endpoint.entity';

@Injectable()
export class GetUserEndpointsUseCase {
  constructor(
    @Inject(IEndpointRepository)
    private readonly endpointRepository: IEndpointRepository,
  ) {}

  async execute(userId: string): Promise<Endpoint[]> {
    return this.endpointRepository.findByUserId(userId);
  }
}
