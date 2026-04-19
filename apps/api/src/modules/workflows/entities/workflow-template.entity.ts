import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

export interface StageConfig {
  name: string
  order: number
  defaultAssigneeRole?: string
  slaDays: number
  requiresApproval: boolean
  approvalCondition?: string
}

@Entity('workflow_templates')
export class WorkflowTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  tenantId: string

  @Column()
  name: string

  @Column({ nullable: true })
  description: string

  @Column()
  niche: string

  @Column('jsonb')
  stages: StageConfig[]

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
