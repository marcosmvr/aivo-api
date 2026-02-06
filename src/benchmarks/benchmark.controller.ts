import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { ZodValidationPipe } from 'src/utils/ZodValidationPipe'
import { BenchmarkService } from './benchmark.service'
import { CreateBenchmarkSchema } from './schemas/create-benchmarks.schema'
import { UpdateBenchmarkSchema } from './schemas/update-benchmarks.schemas'
import { BenchmarkFiltersSchema } from './schemas/benchmarks-filter.schema'
import {
  CREATE_BENCHMARK_EXAMPLE,
  FULL_BENCHMARK_EXAMPLE,
  UPDATE_BENCHMARK_EXAMPLE,
} from './benchmark.swagger'

@ApiTags('Benchmarks')
@ApiBearerAuth()
@Controller('benchmarks')
@UseGuards(JwtAuthGuard)
export class BenchmarksController {
  constructor(private readonly benchmarksService: BenchmarkService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar novo benchmark (Apenas ADMIN)' })
  @ApiBody({ schema: { example: CREATE_BENCHMARK_EXAMPLE } })
  @ApiResponse({
    status: 201,
    description: 'Benchmark criado com sucesso',
    schema: { example: FULL_BENCHMARK_EXAMPLE },
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado: Requer privilégios de ADMIN',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(CreateBenchmarkSchema))
    data: CreateBenchmarkSchema,
  ) {
    return await this.benchmarksService.create(data)
  }

  @Get()
  @ApiOperation({ summary: 'Listar benchmarks com filtros' })
  @ApiQuery({ name: 'niche', required: false, example: 'ecommerce' })
  @ApiQuery({ name: 'country', required: false, example: 'BR' })
  @ApiResponse({
    status: 200,
    description: 'Lista de benchmarks',
    schema: { example: [FULL_BENCHMARK_EXAMPLE] },
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filters: BenchmarkFiltersSchema) {
    return await this.benchmarksService.findAll(filters)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar benchmark por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do benchmark',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, schema: { example: FULL_BENCHMARK_EXAMPLE } })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.benchmarksService.findById(id)
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar benchmark (Apenas ADMIN)' })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiBody({ schema: { example: UPDATE_BENCHMARK_EXAMPLE } })
  @ApiResponse({
    status: 200,
    description: 'Benchmark atualizado',
    schema: { example: FULL_BENCHMARK_EXAMPLE },
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateBenchmarkSchema))
    data: UpdateBenchmarkSchema,
  ) {
    return await this.benchmarksService.updateById(id, data)
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover benchmark (Apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Benchmark removido com sucesso' })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.benchmarksService.deleteById(id)
  }
}
