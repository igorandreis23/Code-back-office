import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AutomationsService } from './automations.service'
import { AutomationRule } from './entities/automation-rule.entity'

@Controller('automations')
@UseGuards(AuthGuard('jwt'))
export class AutomationsController {
  constructor(private readonly service: AutomationsService) {}

  @Get()
  findAll(@Request() req) {
    return this.service.findAll(req.user.tenantId)
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.service.getStats(req.user.tenantId)
  }

  @Get(':id/logs')
  getLogs(@Param('id') id: string, @Request() req) {
    return this.service.getLogs(id, req.user.tenantId)
  }

  @Post()
  create(@Body() dto: Partial<AutomationRule>, @Request() req) {
    return this.service.create(dto, req.user.tenantId)
  }

  @Patch(':id/toggle')
  toggle(@Param('id') id: string, @Request() req) {
    return this.service.toggle(id, req.user.tenantId)
  }
}
