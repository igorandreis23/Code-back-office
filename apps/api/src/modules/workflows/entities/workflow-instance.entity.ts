import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm'
import { WorkflowTemplate } from './workflow-template.entity'
import { StageTransition } from './stage-transition.entity'

export enum InstanceStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
  PAUSED = 'paused',
}

export enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

@Entity('workflow_instances')
export class WorkflowInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  tenantId: string

  @Column()
  templateId: string

  @ManyToOne(() => WorkflowTemplate)
  @JoinColumn({ name: 'templateId' })
  template: WorkflowTemplate

  @Column()
  clientId: string

  @Column()
  title: string

  @Column({ nullable: true })
  description: string

  @Column({ type: 'enum', enum: InstanceStatus, default: InstanceStatus.ACTIVE })
  status: InstanceStatus

  @Column({ type: 'enum', enum: Priority, default: Priority.MEDIUM })
  priority: Priority

  @Column()
  currentStage: string

  @Column()
  assignedUserId: string

  @Column({ nullable: true })
  deadline: Date

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  value: number

  @OneToMany(() => StageTransition, (t) => t.instance, { cascade: true })
  transitions: StageTransition[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
