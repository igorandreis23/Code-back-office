import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike } from 'typeorm'
import { Client, ClientStatus } from './entities/client.entity'
import { ClientEvent } from './entities/client-event.entity'
import { AuditService } from '../audit/audit.service'

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    @InjectRepository(ClientEvent)
    private readonly eventRepo: Repository<ClientEvent>,
    private readonly auditService: AuditService,
  ) {}

  async findAll(tenantId: string, search?: string): Promise<Client[]> {
    const where: any = { tenantId }
    if (search) where.name = ILike(`%${search}%`)
    return this.clientRepo.find({ where, order: { updatedAt: 'DESC' } })
  }

  async findOne(id: string, tenantId: string): Promise<Client> {
    const client = await this.clientRepo.findOne({ where: { id, tenantId } })
    if (!client) throw new NotFoundException('Cliente não encontrado')
    return client
  }

  async getTimeline(clientId: string, tenantId: string): Promise<ClientEvent[]> {
    await this.findOne(clientId, tenantId)
    return this.eventRepo.find({
      where: { clientId },
      order: { createdAt: 'DESC' },
      take: 50,
    })
  }

  async create(dto: Partial<Client>, tenantId: string, userId: string): Promise<Client> {
    const client = this.clientRepo.create({ ...dto, tenantId })
    const saved = await this.clientRepo.save(client)

    await this.auditService.log({
      tenantId,
      userId,
      action: 'create',
      module: 'clients',
      entityId: saved.id,
      description: `Cliente "${dto.name}" criado`,
    })

    return saved
  }

  async addEvent(clientId: string, type: ClientEvent['type'], description: string, tenantId: string, userId: string): Promise<ClientEvent> {
    await this.findOne(clientId, tenantId)
    const event = this.eventRepo.create({ clientId, type, description, performedByUserId: userId })
    return this.eventRepo.save(event)
  }

  async getStats(tenantId: string) {
    const total = await this.clientRepo.count({ where: { tenantId } })
    const active = await this.clientRepo.count({ where: { tenantId, status: ClientStatus.ACTIVE } })
    const prospects = await this.clientRepo.count({ where: { tenantId, status: ClientStatus.PROSPECT } })

    return { total, active, prospects }
  }
}
