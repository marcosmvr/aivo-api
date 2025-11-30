import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateBenchmarkSchema } from './schemas/create-benchmarks.schema'
import { BenchmarkFiltersSchema } from './schemas/benchmarks-filter.schema'
import { UpdateBenchmarkSchema } from './schemas/update-benchmarks.schemas'

@Injectable()
export class BenchmarkService {
  private readonly logger = new Logger(BenchmarkService.name)

  constructor(private prisma: PrismaService) {}

  async create(data: CreateBenchmarkSchema) {
    try {
      const benchmark = await this.prisma.benchmark.create({
        data,
      })

      this.logger.log(`Benchmark criado: ${benchmark.id}`)
      return benchmark
    } catch (error) {
      return this.handleDatabaseError(error, 'criar benchmark')
    }
  }

  async findAll(filters: BenchmarkFiltersSchema) {
    try {
      const where = {
        ...(filters.niche && { niche: filters.niche }),
        ...(filters.country && { country: filters.country }),
        ...(filters.trafficSource && { trafficSource: filters.trafficSource }),
        ...(filters.funnelType && { funnelType: filters.funnelType }),
      }

      const benchmarks = await this.prisma.benchmark.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      })

      return { benchmarks }
    } catch (error) {
      this.logger.error(`Erro ao listar benchmarks: ${error.message}`)
      throw new InternalServerErrorException('Falha ao listar benchmarks.')
    }
  }

  async findById(id: string) {
    try {
      const benchmark = await this.prisma.benchmark.findUnique({
        where: { id },
      })

      if (!benchmark) {
        throw new NotFoundException('Benchmark não encontrado.')
      }

      return benchmark
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      return this.handleDatabaseError(error, 'buscar benchmark')
    }
  }

  async updateById(id: string, data: UpdateBenchmarkSchema) {
    try {
      const benchmark = await this.prisma.benchmark.update({
        where: { id },
        data,
      })

      this.logger.log(`Benchmark ${id} atualizado`)
      return benchmark
    } catch (error) {
      if (error?.['code'] === 'P2025') {
        throw new NotFoundException('Benchmark não encontrado.')
      }
      return this.handleDatabaseError(error, 'atualizar benchmark')
    }
  }

  async deleteById(id: string) {
    try {
      await this.prisma.benchmark.delete({
        where: { id },
      })

      this.logger.log(`Benchmark ${id} deletado`)
      return { message: 'Benchmark deletado com sucesso' }
    } catch (error) {
      if (error?.['code'] === 'P2025') {
        throw new NotFoundException('Benchmark não encontrado.')
      }
      return this.handleDatabaseError(error, 'deletar benchmark')
    }
  }

  private handleDatabaseError(error: unknown, operation: string): never {
    const errorCode = error?.['code']

    // P2002: Unique constraint violation
    if (errorCode === 'P2002') {
      throw new ConflictException(
        'Já existe um benchmark com esta combinação de parâmetros.',
      )
    }

    if (errorCode === 'P2025') {
      throw new NotFoundException('Registro não encontrado.')
    }

    this.logger.error(
      `Erro ao ${operation}: ${error instanceof Error ? error.message : 'Unknown'}`,
    )
    throw new InternalServerErrorException(`Falha ao ${operation}.`)
  }
}
