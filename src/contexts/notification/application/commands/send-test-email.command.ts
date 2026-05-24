export class SendTestEmailCommand {
  constructor(
    public readonly email: string,
    public readonly userId: string,
  ) {}
}
