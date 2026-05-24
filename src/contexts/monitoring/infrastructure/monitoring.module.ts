import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { EndpointOrmEntity } from './persistence/typeorm/endpoint.orm-entity';
import { CheckResultOrmEntity } from './persistence/typeorm/check-result.orm-entity';
import { IEndpointRepository } from '../domain/repositories/endpoint.repository.interface';
import { TypeOrmEndpointRepository } from './persistence/typeorm/endpoint.repository';
import { ICheckResultRepository } from '../domain/repositories/check-result.repository.interface';
import { TypeOrmCheckResultRepository } from './persistence/typeorm/check-result.repository';
import { CreateEndpointUseCase } from '../application/use-cases/create-endpoint.use-case';
import { GetUserEndpointsUseCase } from '../application/use-cases/get-user-endpoints.use-case';
import { GetEndpointHistoryUseCase } from '../application/use-cases/get-endpoint-history.use-case';
import { GetSlaReportUseCase } from '../application/use-cases/get-sla-report.use-case';
import { EndpointController } from './controllers/endpoint.controller';
import { MonitoringSchedulerService } from './services/monitoring-scheduler.service';
import { MonitoringProcessor } from './services/monitoring.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([EndpointOrmEntity, CheckResultOrmEntity]),
    CqrsModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST') || 'localhost',
          port: configService.get<number>('REDIS_PORT') || 6379,
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'monitoring',
    }),
  ],
  controllers: [EndpointController],
  providers: [
    {
      provide: IEndpointRepository,
      useClass: TypeOrmEndpointRepository,
    },
    {
      provide: ICheckResultRepository,
      useClass: TypeOrmCheckResultRepository,
    },
    CreateEndpointUseCase,
    GetUserEndpointsUseCase,
    GetEndpointHistoryUseCase,
    GetSlaReportUseCase,
    MonitoringSchedulerService,
    MonitoringProcessor,
  ],
  exports: [IEndpointRepository, ICheckResultRepository],
})
export class MonitoringModule {}
