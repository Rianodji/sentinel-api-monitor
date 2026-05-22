import { Endpoint } from '../entities/endpoint.entity';

export interface IEndpointRepository {
  save(endpoint: Endpoint): Promise<void>;
  findById(id: string): Promise<Endpoint | null>;
  findByUserId(userId: string): Promise<Endpoint[]>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Endpoint[]>;
}

export const IEndpointRepository = Symbol('IEndpointRepository');
