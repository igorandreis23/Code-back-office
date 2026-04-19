import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { WorkflowInstance, InstanceStatus } from './entities/workflow-instance.entity'
import { WorkflowTemplate } from './entities/workflow-template.entity'
import { StageTransition } from './entities/stage-transition.entity'
import { AuditService } from '../audit/audit.service'

export interface CreateInstanceDto {
  templateId: string
  clientId: string
  title: string
  description?: string
  assignedUserId: string
  deadline?: Date
  value?: number
}

export interface AdvanceStageDto {
  toStage: string
  notes?: string
}

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectRepository(WorkflowInstance)
    private readonly instanceRepo: Repository<WorkflowInstance>,
    @InjectRepository(WorkflowTemplate)
    private readonly templateRepo: Repository<WorkflowTemplate>,
    @InjectRepository(StageTransition)
    private readonly transitionRepo: Repository<StageTransition>,
    @InjectQueue('workflow-sla')
    private readonly slaQueue: Queue,
    private readonly auditService: AuditService,
  ) {}

  async findAll(tenantId: string): Promise<WorkflowInstance[]> {
    return this.instanceRepo.find({
      where: { tenantId, status: InstanceStatus.ACTIVE },
      relations: ['template'],
      order: { updatedAt: 'DESC' },
    })
  }

  async findOne(id: string, tenantId: string): Promise<WorkflowInstance> {
    const instance = await this.instanceRepo.findOne({
      where: { id, tenantId },
      relations: ['template', 'transitions'],
    })
    if (!instance) throw new NotFoundException(`Processo ${id} não encontrado`)
    return instance
  }

  async create(dto: CreateInstanceDto, tenantId: string, userId: string): Promise<WorkflowInstance> {
    const template = await this.templateRepo.findOne({ where: { id: dto.templateId, tenantId } })
    if (!template) throw new NotFoundException('Template de workflow não encontrado')

    const firstStage = template.stages.sort((a, b) => a.order - b.order)[0]
    if (!firstStage) throw new BadRequestException('Template não possui etapas configuradas')

    const instance = this.instanceRepo.create({
      ...dto,
      tenantId,
      currentStage: firstStage.name,
      status: InstanceStatus.ACTIVE,
    })

    const saved = await this.instanceRepo.save(instance)

    await this.transitionRepo.save({
      instanceId: saved.id,
      toStage: firstStage.name,
      performedByUserId: userId,
      notes: 'Processo criado',
    })

    await this.slaQueue.add('check-sla', { instanceId: saved.id }, { delay: firstStage.slaDays * 86400000 })

    await this.auditService.log({
      tenantId,
      userId,
      action: 'create',
      module: 'workflows',
      entityId: saved.id,
      description: `Processo "${dto.title}" criado`,
    })

    return saved
  }

  async advanceStage(id: string, dto: AdvanceStageDto, tenantId: string, userId: string): Promise<WorkflowInstance> {
    const instance = await this.findOne(id, tenantId)
    const prevStage = instance.currentStage

    instance.currentStage = dto.toStage
    await this.instanceRepo.save(instance)

    await this.transitionRepo.save({
      instanceId: instance.id,
      fromStage: prevStage,
      toStage: dto.toStage,
      performedByUserId: userId,
      notes: dto.notes,
    })

    await this.auditService.log({
      tenantId,
      userId,
      action: 'update',
      module: 'workflows',
      entityId: id,
      description: `Etapa alterada: "${prevStage}" → "${dto.toStage}"`,
      metadata: { fromStage: prevStage, toStage: dto.toStage, notes: dto.notes ?? '' },
    })

    return instance
  }

  async getStats(tenantId: string) {
    const instances = await this.instanceRepo.find({ where: { tenantId, status: InstanceStatus.ACTIVE } })
    const now = new Date()

    const overdue = instances.filter((i) => i.deadline && i.deadline < now)
    const atRisk = instances.filter((i) => {
      if (!i.deadline) return false
      const daysLeft = (i.deadline.getTime() - now.getTime()) / 86400000
      return daysLeft <= 3 && daysLeft > 0
    })

    return {
      total: instances.length,
      overdue: overdue.length,
      atRisk: atRisk.length,
      onTime: instances.length - overdue.length - atRisk.length,
    }
  }
}
