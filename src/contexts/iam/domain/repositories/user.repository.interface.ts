import { User } from '../entities/user.entity';

export interface IUserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  exists(email: string): Promise<boolean>;
}

export const IUserRepository = Symbol('IUserRepository');
