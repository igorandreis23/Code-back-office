import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientsController } from './clients.controller'
import { ClientsService } from './clients.service'
import { Client } from './entities/client.entity'
import { ClientEvent } from './entities/client-event.entity'
import { AuditModule } from '../audit/audit.module'

@Module({
  imports: [TypeOrmModule.forFeature([Client, ClientEvent]), AuditModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
