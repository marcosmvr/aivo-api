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
import { JwtAuthGuard } from 'src/auth/guards/auth.guard'
import { BenchmarkService } from './benchmark.service'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { ZodValidationPipe } from 'src/utils/ZodValidationPipe'
import { CreateBenchmarkSchema } from './schemas/create-benchmarks.schema'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { BenchmarkFiltersSchema } from './schemas/benchmarks-filter.schema'
import { UpdateBenchmarkSchema } from './schemas/update-benchmarks.schemas'

@Controller('benchmarks')
@UseGuards(JwtAuthGuard)
export class BenchmarksController {
  constructor(private readonly benchmarksService: BenchmarkService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async create(
    @Body(new ZodValidationPipe(CreateBenchmarkSchema))
    data: CreateBenchmarkSchema,
  ) {
    return await this.benchmarksService.create(data)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filters: BenchmarkFiltersSchema) {
    return await this.benchmarksService.findAll(filters)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.benchmarksService.findById(id)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateBenchmarkSchema))
    data: UpdateBenchmarkSchema,
  ) {
    return await this.benchmarksService.updateById(id, data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.benchmarksService.deleteById(id)
  }
}
