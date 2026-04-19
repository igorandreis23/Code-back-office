import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { KnowledgeService } from './knowledge.service'
import { KnowledgeDoc } from './entities/knowledge-doc.entity'

@Controller('knowledge')
@UseGuards(AuthGuard('jwt'))
export class KnowledgeController {
  constructor(private readonly service: KnowledgeService) {}

  @Get()
  findAll(@Request() req, @Query('search') search?: string) {
    return this.service.findAll(req.user.tenantId, search)
  }

  @Get('by-stage/:stage')
  findByStage(@Param('stage') stage: string, @Request() req) {
    return this.service.findByStage(stage, req.user.tenantId)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.service.findOne(id, req.user.tenantId)
  }

  @Post()
  create(@Body() dto: Partial<KnowledgeDoc>, @Request() req) {
    return this.service.create(dto, req.user.tenantId, req.user.id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<KnowledgeDoc>, @Request() req) {
    return this.service.update(id, dto, req.user.tenantId)
  }

  @Post(':id/rate')
  rate(@Param('id') id: string, @Body('rating') rating: number, @Request() req) {
    return this.service.rate(id, rating, req.user.tenantId)
  }
}
