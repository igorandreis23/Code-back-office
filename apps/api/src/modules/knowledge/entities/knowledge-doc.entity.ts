import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum DocType {
  PLAYBOOK = 'playbook',
  SOP = 'sop',
  TEMPLATE = 'template',
  CHECKLIST = 'checklist',
}

@Entity('knowledge_docs')
export class KnowledgeDoc {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  tenantId: string

  @Column()
  title: string

  @Column({ type: 'enum', enum: DocType })
  type: DocType

  @Column('text')
  content: string

  @Column({ nullable: true })
  linkedWorkflowStage: string

  @Column({ nullable: true })
  linkedWorkflowTemplateId: string

  @Column('text', { array: true, default: [] })
  tags: string[]

  @Column()
  authorId: string

  @Column({ default: '1.0' })
  version: string

  @Column({ default: 0 })
  viewCount: number

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number

  @Column({ default: 0 })
  ratingCount: number

  @Column({ default: true })
  isPublished: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
