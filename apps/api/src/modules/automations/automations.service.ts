import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { AutomationRule, RuleStatus } from './entities/automation-rule.entity'
import { AutomationLog } from './entities/automation-log.entity'

@Injectable()
export class AutomationsService {
  constructor(
    @InjectRepository(AutomationRule)
    private readonly ruleRepo: Repository<AutomationRule>,
    @InjectRepository(AutomationLog)
    private readonly logRepo: Repository<AutomationLog>,
    @InjectQueue('automations')
    private readonly queue: Queue,
  ) {}

  async findAll(tenantId: string): Promise<AutomationRule[]> {
    return this.ruleRepo.find({ where: { tenantId }, order: { createdAt: 'DESC' } })
  }

  async findOne(id: string, tenantId: string): Promise<AutomationRule> {
    const rule = await this.ruleRepo.findOne({ where: { id, tenantId } })
    if (!rule) throw new NotFoundException('Regra não encontrada')
    return rule
  }

  async create(dto: Partial<AutomationRule>, tenantId: string): Promise<AutomationRule> {
    const rule = this.ruleRepo.create({ ...dto, tenantId })
    return this.ruleRepo.save(rule)
  }

  async toggle(id: string, tenantId: string): Promise<AutomationRule> {
    const rule = await this.findOne(id, tenantId)
    rule.status = rule.status === RuleStatus.ACTIVE ? RuleStatus.PAUSED : RuleStatus.ACTIVE
    return this.ruleRepo.save(rule)
  }

  async getLogs(ruleId: string, tenantId: string): Promise<AutomationLog[]> {
    return this.logRepo.find({
      where: { ruleId, tenantId },
      order: { executedAt: 'DESC' },
      take: 100,
    })
  }

  async triggerEvent(tenantId: string, event: string, entityId: string): Promise<void> {
    const rules = await this.ruleRepo.find({
      where: { tenantId, status: RuleStatus.ACTIVE },
    })

    for (const rule of rules) {
      if (rule.triggerConfig.event === event) {
        const delay = (rule.triggerConfig.delayHours ?? 0) * 3600000
        await this.queue.add('execute', { ruleId: rule.id, entityId }, { delay })
      }
    }
  }

  async getStats(tenantId: string) {
    const rules = await this.ruleRepo.find({ where: { tenantId } })
    const activeCount = rules.filter((r) => r.status === RuleStatus.ACTIVE).length
    const totalExecutions = rules.reduce((s, r) => s + r.executionCount, 0)
    const successRate = totalExecutions > 0
      ? Math.round((rules.reduce((s, r) => s + r.successCount, 0) / totalExecutions) * 100)
      : 0

    return { active: activeCount, total: rules.length, totalExecutions, successRate }
  }
}
