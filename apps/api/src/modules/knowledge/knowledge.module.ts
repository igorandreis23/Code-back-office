import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { KnowledgeController } from './knowledge.controller'
import { KnowledgeService } from './knowledge.service'
import { KnowledgeDoc } from './entities/knowledge-doc.entity'
import { AuditModule } from '../audit/audit.module'

@Module({
  imports: [TypeOrmModule.forFeature([KnowledgeDoc]), AuditModule],
  controllers: [KnowledgeController],
  providers: [KnowledgeService],
  exports: [KnowledgeService],
})
export class KnowledgeModule {}
