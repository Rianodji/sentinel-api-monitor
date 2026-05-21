import { Entity } from '../../../../shared-kernel/domain/entity.base';
import { UserPassword } from '../value-objects/password.vo';

interface UserProps {
  email: string;
  password: UserPassword;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  public static create(
    props: Omit<UserProps, 'isActive' | 'createdAt' | 'updatedAt'>,
    id?: string,
  ): User {
    return new User(
      {
        ...props,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    );
  }

  get email(): string {
    return this.props.email;
  }

  get password(): UserPassword {
    return this.props.password;
  }

  get firstName(): string | undefined {
    return this.props.firstName;
  }

  get lastName(): string | undefined {
    return this.props.lastName;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  // RGPD: Méthode pour l'anonymisation (Droit à l'oubli)
  public anonymize(): void {
    this.props.email = `deleted_${this.id}@sentinel.local`;
    this.props.firstName = 'Deleted';
    this.props.lastName = 'User';
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }
}
