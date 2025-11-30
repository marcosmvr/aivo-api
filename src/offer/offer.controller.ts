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
  UseGuards,
} from '@nestjs/common'
import { ZodValidationPipe } from 'src/utils/ZodValidationPipe'
import { CreateOfferSchema } from './schema/create-offer.schema'
import { OfferService } from './offer.service'
import { UpdateOfferSchema } from './schema/update-offer.schema'
import { JwtAuthGuard } from 'src/auth/guards/auth.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'

@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(CreateOfferSchema)) data: CreateOfferSchema,
    @CurrentUser('id') userId: string,
  ) {
    return await this.offerService.create({ ...data, userId })
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findOffersByUser(@CurrentUser('id') userId: string) {
    return await this.offerService.findByUserId(userId)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.offerService.findById(id, userId)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateOfferSchema))
    data: UpdateOfferSchema,
    @CurrentUser('id') userId: string,
  ) {
    return this.offerService.updateById(id, userId, data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    await this.offerService.deleteById(id, userId)
  }
}
