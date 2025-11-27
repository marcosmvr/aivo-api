import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { OfferController } from './offer/offer.controller'
import { OfferService } from './offer/offer.service'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [OfferController],
  providers: [OfferService],
})
export class AppModule {}
