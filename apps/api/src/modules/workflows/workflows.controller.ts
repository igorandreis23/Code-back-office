import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { WorkflowsService, CreateInstanceDto, AdvanceStageDto } from './workflows.service'

@Controller('workflows')
@UseGuards(AuthGuard('jwt'))
export class WorkflowsController {
  constructor(private readonly service: WorkflowsService) {}

  @Get()
  findAll(@Request() req) {
    return this.service.findAll(req.user.tenantId)
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.service.getStats(req.user.tenantId)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.service.findOne(id, req.user.tenantId)
  }

  @Post()
  create(@Body() dto: CreateInstanceDto, @Request() req) {
    return this.service.create(dto, req.user.tenantId, req.user.id)
  }

  @Patch(':id/advance')
  advanceStage(@Param('id') id: string, @Body() dto: AdvanceStageDto, @Request() req) {
    return this.service.advanceStage(id, dto, req.user.tenantId, req.user.id)
  }
}
