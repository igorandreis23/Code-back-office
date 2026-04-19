import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ClientsService } from './clients.service'
import { Client } from './entities/client.entity'

@Controller('clients')
@UseGuards(AuthGuard('jwt'))
export class ClientsController {
  constructor(private readonly service: ClientsService) {}

  @Get()
  findAll(@Request() req, @Query('search') search?: string) {
    return this.service.findAll(req.user.tenantId, search)
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.service.getStats(req.user.tenantId)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.service.findOne(id, req.user.tenantId)
  }

  @Get(':id/timeline')
  getTimeline(@Param('id') id: string, @Request() req) {
    return this.service.getTimeline(id, req.user.tenantId)
  }

  @Post()
  create(@Body() dto: Partial<Client>, @Request() req) {
    return this.service.create(dto, req.user.tenantId, req.user.id)
  }
}
