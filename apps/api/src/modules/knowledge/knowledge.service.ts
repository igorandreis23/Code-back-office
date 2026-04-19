import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike } from 'typeorm'
import { KnowledgeDoc } from './entities/knowledge-doc.entity'

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectRepository(KnowledgeDoc)
    private readonly repo: Repository<KnowledgeDoc>,
  ) {}

  async findAll(tenantId: string, search?: string): Promise<KnowledgeDoc[]> {
    const where: any = { tenantId, isPublished: true }
    if (search) where.title = ILike(`%${search}%`)
    return this.repo.find({ where, order: { viewCount: 'DESC' } })
  }

  async findOne(id: string, tenantId: string): Promise<KnowledgeDoc> {
    const doc = await this.repo.findOne({ where: { id, tenantId } })
    if (!doc) throw new NotFoundException('Documento não encontrado')
    await this.repo.increment({ id }, 'viewCount', 1)
    return doc
  }

  async findByStage(stage: string, tenantId: string): Promise<KnowledgeDoc[]> {
    return this.repo.find({ where: { linkedWorkflowStage: stage, tenantId, isPublished: true } })
  }

  async create(dto: Partial<KnowledgeDoc>, tenantId: string, authorId: string): Promise<KnowledgeDoc> {
    const doc = this.repo.create({ ...dto, tenantId, authorId })
    return this.repo.save(doc)
  }

  async update(id: string, dto: Partial<KnowledgeDoc>, tenantId: string): Promise<KnowledgeDoc> {
    const doc = await this.findOne(id, tenantId)
    const versionParts = doc.version.split('.').map(Number)
    versionParts[1] = (versionParts[1] ?? 0) + 1
    Object.assign(doc, { ...dto, version: versionParts.join('.') })
    return this.repo.save(doc)
  }

  async rate(id: string, rating: number, tenantId: string): Promise<KnowledgeDoc> {
    const doc = await this.findOne(id, tenantId)
    const newTotal = doc.rating * doc.ratingCount + rating
    doc.ratingCount += 1
    doc.rating = newTotal / doc.ratingCount
    return this.repo.save(doc)
  }
}
