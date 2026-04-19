import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm'
import { WorkflowInstance } from './workflow-instance.entity'

@Entity('stage_transitions')
export class StageTransition {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  instanceId: string

  @ManyToOne(() => WorkflowInstance, (i) => i.transitions)
  @JoinColumn({ name: 'instanceId' })
  instance: WorkflowInstance

  @Column({ nullable: true })
  fromStage: string

  @Column()
  toStage: string

  @Column()
  performedByUserId: string

  @Column({ nullable: true })
  notes: string

  @CreateDateColumn()
  createdAt: Date
}
