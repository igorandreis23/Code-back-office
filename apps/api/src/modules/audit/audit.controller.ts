import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuditService } from './audit.service'

@Controller('audit')
@UseGuards(AuthGuard('jwt'))
export class AuditController {
  constructor(private readonly service: AuditService) {}

  @Get()
  findAll(
    @Request() req,
    @Query('userId') userId?: string,
    @Query('module') module?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.service.findAll(req.user.tenantId, {
      userId,
      module,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    })
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.service.getStats(req.user.tenantId)
  }
}
