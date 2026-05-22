import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class NotificationOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  type: string;

  @Column('text')
  message: string;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
