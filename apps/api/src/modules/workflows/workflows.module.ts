import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BullModule } from '@nestjs/bull'
import { WorkflowsController } from './workflows.controller'
import { WorkflowsService } from './workflows.service'
import { WorkflowTemplate } from './entities/workflow-template.entity'
import { WorkflowInstance } from './entities/workflow-instance.entity'
import { WorkflowStage } from './entities/workflow-stage.entity'
import { StageTransition } from './entities/stage-transition.entity'
import { AuditModule } from '../audit/audit.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkflowTemplate, WorkflowInstance, WorkflowStage, StageTransition]),
    BullModule.registerQueue({ name: 'workflow-sla' }),
    AuditModule,
  ],
  controllers: [WorkflowsController],
  providers: [WorkflowsService],
  exports: [WorkflowsService],
})
export class WorkflowsModule {}
