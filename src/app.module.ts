import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { OfferModule } from './offer/offer.module'
import { MetricsModule } from './metrics/metrics.module'
import { BenchmarksModule } from './benchmarks/benchmark.module'
import { AIAnalysisModule } from './ai/ai-analysis.module'

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
    AIAnalysisModule,
  ],
})
export class AppModule {}
