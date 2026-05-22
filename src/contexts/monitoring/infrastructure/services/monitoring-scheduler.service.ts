import { Injectable, OnApplicationBootstrap, Inject, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { IEndpointRepository } from '../../domain/repositories/endpoint.repository.interface';

@Injectable()
export class MonitoringSchedulerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MonitoringSchedulerService.name);

  constructor(
    @InjectQueue('monitoring') private readonly monitoringQueue: Queue,
    @Inject(IEndpointRepository)
    private readonly endpointRepository: IEndpointRepository,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Scheduling all active endpoints for monitoring...');
    const endpoints = await this.endpointRepository.findAll();
    
    // Nettoyer les anciens jobs pour repartir propre (optionnel mais recommandé ici)
    const jobs = await this.monitoringQueue.getRepeatableJobs();
    for (const job of jobs) {
      await this.monitoringQueue.removeRepeatableByKey(job.key);
    }

    for (const endpoint of endpoints) {
      await this.scheduleEndpoint(endpoint.id, endpoint.url, endpoint.interval);
    }
  }

  async scheduleEndpoint(id: string, url: string, interval: number) {
    this.logger.log(`Scheduling endpoint ${id} (${url}) every ${interval}s`);
    await this.monitoringQueue.add(
      'check-endpoint',
      { id, url },
      {
        repeat: {
          every: interval * 1000,
        },
        jobId: id, // Garantit l'unicité du job par endpoint
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }

  async unscheduleEndpoint(id: string) {
    const jobs = await this.monitoringQueue.getRepeatableJobs();
    const job = jobs.find((j) => j.id === id);
    if (job) {
      await this.monitoringQueue.removeRepeatableByKey(job.key);
    }
  }
}
