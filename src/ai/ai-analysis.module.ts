import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AiAnalysisController } from './ai-analysis.controller'
import { AiAnalysisService } from './ai-analysis.service'

@Module({
  imports: [PrismaModule],
  controllers: [AiAnalysisController],
  providers: [AiAnalysisService],
  exports: [AiAnalysisService],
})
export class AIAnalysisModule {}
