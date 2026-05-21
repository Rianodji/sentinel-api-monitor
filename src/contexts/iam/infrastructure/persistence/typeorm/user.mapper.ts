import { User } from '../../../domain/entities/user.entity';
import { UserPassword } from '../../../domain/value-objects/password.vo';
import { UserOrmEntity } from './user.orm-entity';

export class UserMapper {
  public static async toOrm(user: User): Promise<UserOrmEntity> {
    const orm = new UserOrmEntity();
    orm.id = user.id;
    orm.email = user.email;
    orm.passwordHash = await user.password.getHashedValue();
    orm.firstName = user.firstName || '';
    orm.lastName = user.lastName || '';
    orm.isActive = user.isActive;
    return orm;
  }

  public static toDomain(orm: UserOrmEntity): User {
    return User.create(
      {
        email: orm.email,
        password: UserPassword.fromHash(orm.passwordHash),
        firstName: orm.firstName,
        lastName: orm.lastName,
      },
      orm.id,
    );
  }
}
