import { Module } from '@nestjs/common'
import { BenchmarksController } from './benchmark.controller'
import { BenchmarkService } from './benchmark.service'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [BenchmarksController],
  providers: [BenchmarkService],
  exports: [BenchmarkService],
})
export class BenchmarksModule {}
