import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum TriggerType {
  EVENT = 'event',
  SCHEDULE = 'schedule',
  CONDITION = 'condition',
}

export enum ActionType {
  SEND_EMAIL = 'send_email',
  SEND_WHATSAPP = 'send_whatsapp',
  CREATE_TASK = 'create_task',
  ADVANCE_STAGE = 'advance_stage',
  NOTIFY_USER = 'notify_user',
  WEBHOOK = 'webhook',
}

export enum RuleStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  DRAFT = 'draft',
}

@Entity('automation_rules')
export class AutomationRule {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  tenantId: string

  @Column()
  name: string

  @Column({ type: 'enum', enum: TriggerType })
  triggerType: TriggerType

  @Column('jsonb')
  triggerConfig: {
    event?: string
    condition?: string
    schedule?: string
    delayHours?: number
  }

  @Column({ type: 'enum', enum: ActionType })
  actionType: ActionType

  @Column('jsonb')
  actionConfig: {
    templateId?: string
    message?: string
    to?: string
    assignee?: string
  }

  @Column({ type: 'enum', enum: RuleStatus, default: RuleStatus.DRAFT })
  status: RuleStatus

  @Column({ default: 0 })
  executionCount: number

  @Column({ nullable: true })
  lastRunAt: Date

  @Column({ default: 0 })
  successCount: number

  @Column({ default: 0 })
  failureCount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
