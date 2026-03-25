import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module.js';
import { ClientsModule } from './clients/clients.module.js';
import { PropertiesModule } from './properties/properties.module.js';
import { ContractsModule } from './contracts/contracts.module.js';
import { InvoicesModule } from './invoices/invoices.module.js';
import { LeadsModule } from './leads/leads.module.js';
import { PdfModule } from './pdf/pdf.module.js';
import { ActivitiesModule } from './activities/activities.module.js';
import { UploadsModule } from './uploads/uploads.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env['THROTTLE_TTL'] ?? '60000', 10),
        limit: parseInt(process.env['THROTTLE_LIMIT'] ?? '100', 10),
      },
    ]),
    PrismaModule,
    ClientsModule,
    PropertiesModule,
    ContractsModule,
    InvoicesModule,
    LeadsModule,
    PdfModule,
    ActivitiesModule,
    UploadsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
