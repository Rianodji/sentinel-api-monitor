import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Logger } from '@nestjs/common';
import axios from 'axios';
import { EventBus } from '@nestjs/cqrs';
import { IEndpointRepository } from '../../domain/repositories/endpoint.repository.interface';
import { EndpointStatus } from '../../domain/entities/endpoint.entity';
import { ICheckResultRepository } from '../../domain/repositories/check-result.repository.interface';
import { CheckResult } from '../../domain/entities/check-result.entity';
import { EndpointStatusChangedEvent } from '../../domain/events/endpoint-status-changed.event';
import { SslCertificateExpiringEvent } from '../../domain/events/ssl-certificate-expiring.event';
import { SslScanner } from './ssl/ssl-scanner';

@Processor('monitoring')
export class MonitoringProcessor extends WorkerHost {
  private readonly logger = new Logger(MonitoringProcessor.name);

  constructor(
    @Inject(IEndpointRepository)
    private readonly endpointRepository: IEndpointRepository,
    @Inject(ICheckResultRepository)
    private readonly checkResultRepository: ICheckResultRepository,
    private readonly eventBus: EventBus,
  ) {
    super();
  }

  async process(job: Job<{ id: string; url: string }>): Promise<any> {
    const { id, url } = job.data;
    this.logger.debug(`Checking endpoint ${url}...`);

    // Vérification SSL si HTTPS
    if (url.startsWith('https')) {
      try {
        const hostname = new URL(url).hostname;
        const ssl = await SslScanner.getSslInfo(hostname);
        this.logger.debug(`SSL scan for ${hostname}: ${ssl.daysRemaining} days remaining`);

        if (ssl.daysRemaining < 30) {
          const endpoint = await this.endpointRepository.findById(id);
          if (endpoint) {
             this.logger.warn(`SSL certificate for ${hostname} expires in ${ssl.daysRemaining} days! Publishing event...`);
             this.eventBus.publish(
               new SslCertificateExpiringEvent(id, endpoint.userId, url, ssl.daysRemaining)
             );
          }
        }
      } catch (e) {
        this.logger.error(`SSL check failed for ${url}: ${e.message}`);
      }
    }

    const start = Date.now();
    try {
      const response = await axios.get(url, { timeout: 10000, validateStatus: () => true });
      const duration = Date.now() - start;
      const status =
        response.status >= 200 && response.status < 300 ? EndpointStatus.UP : EndpointStatus.DOWN;

      await this.recordResult(id, status, duration, response.status);
      await this.handleStatusChange(id, status, url);
      this.logger.debug(`Endpoint ${url} is ${status} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - start;
      this.logger.error(`Endpoint ${url} check failed: ${error.message}`);
      await this.recordResult(id, EndpointStatus.DOWN, duration, undefined, error.message);
      await this.handleStatusChange(id, EndpointStatus.DOWN, url);
    }
  }

  private async recordResult(
    endpointId: string,
    status: EndpointStatus,
    responseTime: number,
    statusCode?: number,
    errorMessage?: string,
  ) {
    const checkResult = CheckResult.create({
      endpointId,
      status: status === EndpointStatus.UP ? 'UP' : 'DOWN',
      responseTime,
      statusCode,
      errorMessage,
    });
    await this.checkResultRepository.save(checkResult);
  }

  private async handleStatusChange(id: string, newStatus: EndpointStatus, url: string) {
    const endpoint = await this.endpointRepository.findById(id);
    if (!endpoint) return;

    const oldStatus = endpoint.status;
    endpoint.updateStatus(newStatus);
    await this.endpointRepository.save(endpoint);

    // Si le statut a changé, on publie un événement
    if (oldStatus !== newStatus && oldStatus !== EndpointStatus.PENDING) {
      this.logger.log(`Status changed for ${url}: ${oldStatus} -> ${newStatus}. Publishing event...`);

      this.eventBus.publish(
        new EndpointStatusChangedEvent(
          endpoint.id,
          endpoint.userId,
          url,
          oldStatus,
          newStatus
        )
      );
    }
  }
}
