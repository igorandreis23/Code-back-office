import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { User } from './user.entity'

export enum TenantNiche {
  LAW = 'law',
  CLINIC = 'clinic',
  ACCOUNTING = 'accounting',
  REAL_ESTATE = 'real_estate',
  OTHER = 'other',
}

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ nullable: true })
  logoUrl: string

  @Column({ type: 'enum', enum: TenantNiche, default: TenantNiche.OTHER })
  niche: TenantNiche

  @Column({ default: true })
  isActive: boolean

  @OneToMany(() => User, (user) => user.tenant)
  users: User[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
