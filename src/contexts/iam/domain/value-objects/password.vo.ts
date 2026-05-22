import * as bcrypt from 'bcrypt';

export class UserPassword {
  private constructor(private readonly value: string, private readonly hashed: boolean = false) {}

  public static create(password: string): UserPassword {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    return new UserPassword(password);
  }

  public static fromHash(hash: string): UserPassword {
    return new UserPassword(hash, true);
  }

  public async getHashedValue(): Promise<string> {
    if (this.hashed) {
      return this.value;
    }
    return bcrypt.hash(this.value, 12);
  }

  public async compare(plainPassword: string): Promise<boolean> {
    if (!this.hashed) {
      throw new Error('Cannot compare non-hashed password');
    }
    return bcrypt.compare(plainPassword, this.value);
  }

  public getRawValue(): string {
    return this.value;
  }
}
