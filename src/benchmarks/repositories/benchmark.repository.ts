import { Injectable } from '@nestjs/common'
import { IBenchmarkRepository } from './benchmark.repository.interface'
import { Prisma, Benchmark } from '@prisma/client'
import { BenchmarkFiltersSchema } from '../schemas/benchmarks-filter.schema'
import { UpdateBenchmarkSchema } from '../schemas/update-benchmarks.schemas'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class BenchmarkRepository implements IBenchmarkRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.BenchmarkCreateInput): Promise<Benchmark> {
    return this.prisma.benchmark.create({ data })
  }

  async findAll(filters: BenchmarkFiltersSchema): Promise<Benchmark[]> {
    const where: Prisma.BenchmarkWhereInput = {
      ...(filters.niche && { niche: filters.niche }),
      ...(filters.country && { country: filters.country }),
      ...(filters.trafficSource && { trafficSource: filters.trafficSource }),
      ...(filters.funnelType && { funnelType: filters.funnelType }),
    }

    const benchmarks = await this.prisma.benchmark.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return benchmarks
  }

  async findById(id: string): Promise<Benchmark | null> {
    return this.prisma.benchmark.findUnique({
      where: {
        id,
      },
    })
  }

  async updateById(
    id: string,
    data: UpdateBenchmarkSchema,
  ): Promise<Benchmark> {
    return this.prisma.benchmark.update({
      where: { id },
      data,
    })
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.benchmark.delete({ where: { id } })
  }
}
