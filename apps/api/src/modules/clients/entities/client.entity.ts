import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm'

export enum ClientType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
}

export enum ClientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PROSPECT = 'prospect',
}

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column()
  tenantId: string

  @Column()
  name: string

  @Column({ type: 'enum', enum: ClientType, default: ClientType.INDIVIDUAL })
  type: ClientType

  @Column({ type: 'enum', enum: ClientStatus, default: ClientStatus.ACTIVE })
  status: ClientStatus

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  document: string

  @Column('text', { array: true, default: [] })
  tags: string[]

  @Column('jsonb', { nullable: true })
  address: { street: string; city: string; state: string; zip: string }

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalBilled: number

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  outstanding: number

  @Column({ nullable: true })
  assignedUserId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
