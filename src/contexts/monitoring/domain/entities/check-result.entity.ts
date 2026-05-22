import { Entity } from '../../../../shared-kernel/domain/entity.base';

interface CheckResultProps {
  endpointId: string;
  status: 'UP' | 'DOWN';
  responseTime: number; // en ms
  statusCode?: number;
  errorMessage?: string;
  checkedAt: Date;
}

export class CheckResult extends Entity<CheckResultProps> {
  private constructor(props: CheckResultProps, id?: string) {
    super(props, id);
  }

  public static create(props: Omit<CheckResultProps, 'checkedAt'>, id?: string): CheckResult {
    return new CheckResult(
      {
        ...props,
        checkedAt: new Date(),
      },
      id,
    );
  }

  get endpointId(): string { return this.props.endpointId; }
  get status(): 'UP' | 'DOWN' { return this.props.status; }
  get responseTime(): number { return this.props.responseTime; }
  get statusCode(): number | undefined { return this.props.statusCode; }
  get errorMessage(): string | undefined { return this.props.errorMessage; }
  get checkedAt(): Date { return this.props.checkedAt; }
}
