import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { OfferModule } from './offer/offer.module'
import { MetricsModule } from './metrics/metrics.module'
import { BenchmarksModule } from './benchmarks/benchmark.module'

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    OfferModule,
    MetricsModule,
    BenchmarksModule,
  ],
})
export class AppModule {}
