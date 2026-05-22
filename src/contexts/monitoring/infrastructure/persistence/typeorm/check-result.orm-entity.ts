import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EndpointOrmEntity } from './endpoint.orm-entity';

@Entity('check_results')
export class CheckResultOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  endpointId: string;

  @Column({ type: 'enum', enum: ['UP', 'DOWN'] })
  status: 'UP' | 'DOWN';

  @Column('int')
  responseTime: number;

  @Column({ type: 'int', nullable: true })
  statusCode: number | null;

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;

  @CreateDateColumn()
  checkedAt: Date;

  @ManyToOne(() => EndpointOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'endpointId' })
  endpoint: EndpointOrmEntity;
}
