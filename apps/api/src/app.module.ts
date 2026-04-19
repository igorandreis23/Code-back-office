import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BullModule } from '@nestjs/bull'
import { AuthModule } from './modules/auth/auth.module'
import { WorkflowsModule } from './modules/workflows/workflows.module'
import { ClientsModule } from './modules/clients/clients.module'
import { AutomationsModule } from './modules/automations/automations.module'
import { KnowledgeModule } from './modules/knowledge/knowledge.module'
import { AuditModule } from './modules/audit/audit.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: config.get('REDIS_URL'),
      }),
    }),

    AuthModule,
    WorkflowsModule,
    ClientsModule,
    AutomationsModule,
    KnowledgeModule,
    AuditModule,
  ],
})
export class AppModule {}
