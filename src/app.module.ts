import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { OfferModule } from './offer/offer.module'
import { MetricsModule } from './metrics/metrics.module'

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    OfferModule,
    MetricsModule,
  ],
})
export class AppModule {}
