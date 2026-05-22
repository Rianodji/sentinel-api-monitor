import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IEndpointRepository } from '../../../domain/repositories/endpoint.repository.interface';
import { Endpoint } from '../../../domain/entities/endpoint.entity';
import { EndpointOrmEntity } from './endpoint.orm-entity';
import { EndpointMapper } from './endpoint.mapper';

@Injectable()
export class TypeOrmEndpointRepository implements IEndpointRepository {
  constructor(
    @InjectRepository(EndpointOrmEntity)
    private readonly repository: Repository<EndpointOrmEntity>,
  ) {}

  async save(endpoint: Endpoint): Promise<void> {
    const orm = EndpointMapper.toOrm(endpoint);
    await this.repository.save(orm);
  }

  async findById(id: string): Promise<Endpoint | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? EndpointMapper.toDomain(orm) : null;
  }

  async findByUserId(userId: string): Promise<Endpoint[]> {
    const orms = await this.repository.find({ where: { userId } });
    return orms.map(EndpointMapper.toDomain);
  }

  async findAll(): Promise<Endpoint[]> {
    const orms = await this.repository.find();
    return orms.map(EndpointMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
