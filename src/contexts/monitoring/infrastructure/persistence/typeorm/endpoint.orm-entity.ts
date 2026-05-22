import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserOrmEntity } from '../../../../iam/infrastructure/persistence/typeorm/user.orm-entity';
import { EndpointStatus } from '../../../domain/entities/endpoint.entity';

@Entity('endpoints')
export class EndpointOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  interval: number;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: EndpointStatus,
    default: EndpointStatus.PENDING,
  })
  status: EndpointStatus;

  @Column({ nullable: true })
  lastCheck: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'userId' })
  user: UserOrmEntity;
}
