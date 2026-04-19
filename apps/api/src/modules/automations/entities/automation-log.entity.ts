import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm'
import { AutomationRule } from './automation-rule.entity'

@Entity('automation_logs')
export class AutomationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  ruleId: string

  @ManyToOne(() => AutomationRule)
  @JoinColumn({ name: 'ruleId' })
  rule: AutomationRule

  @Column()
  tenantId: string

  @Column({ nullable: true })
  entityId: string

  @Column({ default: 'success' })
  result: 'success' | 'failed'

  @Column({ nullable: true })
  errorMessage: string

  @Column('jsonb', { nullable: true })
  payload: Record<string, unknown>

  @CreateDateColumn()
  executedAt: Date
}
