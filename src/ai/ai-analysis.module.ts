import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AiAnalysisController } from './ai-analysis.controller'
import { AiAnalysisService } from './ai-analysis.service'
import { AiRateLimitService } from './rate-limiting.service'

@Module({
  imports: [PrismaModule],
  controllers: [AiAnalysisController],
  providers: [AiAnalysisService, AiRateLimitService],
  exports: [AiAnalysisService],
})
export class AIAnalysisModule {}
