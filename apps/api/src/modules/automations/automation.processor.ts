import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AutomationRule } from './entities/automation-rule.entity'
import { AutomationLog } from './entities/automation-log.entity'

@Processor('automations')
export class AutomationProcessor {
  private readonly logger = new Logger(AutomationProcessor.name)

  constructor(
    @InjectRepository(AutomationRule)
    private readonly ruleRepo: Repository<AutomationRule>,
    @InjectRepository(AutomationLog)
    private readonly logRepo: Repository<AutomationLog>,
  ) {}

  @Process('execute')
  async executeRule(job: Job<{ ruleId: string; entityId: string }>) {
    const { ruleId, entityId } = job.data
    const rule = await this.ruleRepo.findOne({ where: { id: ruleId } })

    if (!rule) {
      this.logger.warn(`Rule ${ruleId} not found`)
      return
    }

    let result: 'success' | 'failed' = 'success'
    let errorMessage: string | undefined

    try {
      this.logger.log(`Executing rule "${rule.name}" for entity ${entityId}`)
      // Action execution logic goes here based on rule.actionType
      // e.g.: send email, send WhatsApp, create task, etc.
    } catch (err) {
      result = 'failed'
      errorMessage = err instanceof Error ? err.message : String(err)
      this.logger.error(`Rule ${ruleId} failed: ${errorMessage}`)
    }

    await this.logRepo.save({
      ruleId,
      tenantId: rule.tenantId,
      entityId,
      result,
      errorMessage,
    })

    await this.ruleRepo.update(ruleId, {
      executionCount: () => 'execution_count + 1',
      lastRunAt: new Date(),
      ...(result === 'success'
        ? { successCount: () => 'success_count + 1' }
        : { failureCount: () => 'failure_count + 1' }),
    })
  }
}
