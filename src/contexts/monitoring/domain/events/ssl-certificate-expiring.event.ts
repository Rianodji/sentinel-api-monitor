export class SslCertificateExpiringEvent {
  constructor(
    public readonly endpointId: string,
    public readonly userId: string,
    public readonly url: string,
    public readonly daysRemaining: number,
  ) {}
}
