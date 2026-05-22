import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { User } from '../../domain/entities/user.entity';
import { UserPassword } from '../../domain/value-objects/password.vo';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: RegisterUserDto): Promise<void> {
    const userExists = await this.userRepository.exists(dto.email);
    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    const password = UserPassword.create(dto.password);
    const user = User.create({
      email: dto.email,
      password: password,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    await this.userRepository.save(user);
  }
}
