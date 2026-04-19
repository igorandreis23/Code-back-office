import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm'

export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'export' | 'stage_change' | 'payment'

@Entity('audit_entries')
export class AuditEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column()
  tenantId: string

  @Column({ nullable: true })
  userId: string

  @Column()
  action: AuditAction

  @Column()
  module: string

  @Column({ nullable: true })
  entityId: string

  @Column({ type: 'text' })
  description: string

  @Column('jsonb', { nullable: true })
  metadata: Record<string, string>

  @Column({ nullable: true })
  ipAddress: string

  @Column({ nullable: true })
  userAgent: string

  @Column({ default: 'success' })
  result: 'success' | 'failed'

  @CreateDateColumn()
  createdAt: Date
  // NO UpdateDateColumn — audit entries are immutable
}
