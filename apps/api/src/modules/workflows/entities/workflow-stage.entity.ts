import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { WorkflowTemplate } from './workflow-template.entity'

@Entity('workflow_stages')
export class WorkflowStage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  templateId: string

  @ManyToOne(() => WorkflowTemplate)
  @JoinColumn({ name: 'templateId' })
  template: WorkflowTemplate

  @Column()
  name: string

  @Column()
  order: number

  @Column({ default: 3 })
  slaDays: number

  @Column({ default: false })
  requiresApproval: boolean

  @Column({ nullable: true })
  approvalCondition: string

  @Column({ nullable: true })
  knowledgeDocId: string
}
