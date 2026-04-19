import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindOptionsWhere, Between } from 'typeorm'
import { AuditEntry, AuditAction } from './entities/audit-entry.entity'

interface LogDto {
  tenantId: string
  userId?: string
  action: AuditAction
  module: string
  entityId?: string
  description: string
  metadata?: Record<string, string>
  ipAddress?: string
  userAgent?: string
  result?: 'success' | 'failed'
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditEntry)
    private readonly repo: Repository<AuditEntry>,
  ) {}

  async log(dto: LogDto): Promise<AuditEntry> {
    const entry = this.repo.create({ ...dto, result: dto.result ?? 'success' })
    return this.repo.save(entry)
  }

  async findAll(
    tenantId: string,
    filters?: { userId?: string; module?: string; action?: AuditAction; from?: Date; to?: Date },
  ): Promise<AuditEntry[]> {
    const where: FindOptionsWhere<AuditEntry> = { tenantId }

    if (filters?.userId) where.userId = filters.userId
    if (filters?.module) where.module = filters.module
    if (filters?.action) where.action = filters.action
    if (filters?.from && filters?.to) {
      where.createdAt = Between(filters.from, filters.to)
    }

    return this.repo.find({
      where,
      order: { createdAt: 'DESC' },
      take: 500,
    })
  }

  async getStats(tenantId: string) {
    const total = await this.repo.count({ where: { tenantId } })
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayCount = await this.repo.count({
      where: { tenantId, createdAt: Between(today, new Date()) },
    })
    const failures = await this.repo.count({ where: { tenantId, result: 'failed' } })

    return { total, today: todayCount, failures }
  }
}
