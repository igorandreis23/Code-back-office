import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm'
import { Client } from './client.entity'

export type ClientEventType = 'stage_change' | 'payment' | 'message' | 'document' | 'note' | 'alert'

@Entity('client_events')
export class ClientEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  clientId: string

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client: Client

  @Column()
  type: ClientEventType

  @Column('text')
  description: string

  @Column({ nullable: true })
  performedByUserId: string

  @Column('jsonb', { nullable: true })
  metadata: Record<string, unknown>

  @CreateDateColumn()
  createdAt: Date
}
