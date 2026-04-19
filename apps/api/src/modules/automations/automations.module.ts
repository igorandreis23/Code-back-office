import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BullModule } from '@nestjs/bull'
import { AutomationsController } from './automations.controller'
import { AutomationsService } from './automations.service'
import { AutomationRule } from './entities/automation-rule.entity'
import { AutomationLog } from './entities/automation-log.entity'
import { AutomationProcessor } from './automation.processor'
import { AuditModule } from '../audit/audit.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([AutomationRule, AutomationLog]),
    BullModule.registerQueue({ name: 'automations' }),
    AuditModule,
  ],
  controllers: [AutomationsController],
  providers: [AutomationsService, AutomationProcessor],
  exports: [AutomationsService],
})
export class AutomationsModule {}
