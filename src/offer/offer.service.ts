import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateOfferSchema } from './schema/create-offer.schema'
import { UpdateOfferSchema } from './schema/update-offer.schema'
import {
  type IOfferRepository,
  OFFERS_REPOSITORY,
} from './repositories/offer.repository.interface'

@Injectable()
export class OfferService {
  private readonly logger = new Logger(OfferService.name)

  constructor(
    @Inject(OFFERS_REPOSITORY)
    private readonly offersRepository: IOfferRepository,
  ) {}

  async create(data: CreateOfferSchema, userId: string) {
    try {
      const offer = await this.offersRepository.create(data, userId)
      this.logger.log(`Oferta ${offer.id} criada`)
      return offer
    } catch (error) {
      return this.handleDatabaseError(error, 'criar oferta')
    }
  }

  async findByUserId(userId: string) {
    try {
      return await this.offersRepository.findByUserId(userId)
    } catch (error) {
      this.logger.error(
        `Erro ao listar ofertas: ${error instanceof Error ? error.message : 'Unknown'}`,
      )
      throw new InternalServerErrorException('Falha ao listar ofertas.')
    }
  }

  async findById(id: string, userId: string) {
    try {
      const offer = await this.offersRepository.findByOfferId(id, userId)

      if (!offer) {
        throw new NotFoundException('Oferta não encontrada ou acesso negado.')
      }

      return offer
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      return this.handleDatabaseError(error, 'buscar oferta')
    }
  }

  async updateById(id: string, userId: string, data: UpdateOfferSchema) {
    try {
      const offer = await this.offersRepository.updateById(id, userId, data)
      this.logger.log(`Oferta ${offer.id} atualizada`)
      return offer
    } catch (error) {
      if (error?.['code'] === 'P2025') {
        throw new NotFoundException('Oferta não encontrada ou acesso negado.')
      }
      return this.handleDatabaseError(error, 'atualizar oferta')
    }
  }

  async deleteById(id: string, userId: string) {
    try {
      const offer = await this.offersRepository.deleteById(id, userId)
      this.logger.log(`Oferta ${offer.id} apagada`)
      return offer
    } catch (error) {
      if (error?.['code'] === 'P2025') {
        throw new NotFoundException('Oferta não encontrada ou acesso negado.')
      }
      return this.handleDatabaseError(error, 'excluir oferta')
    }
  }

  private handleDatabaseError(error: unknown, operation: string): never {
    const errorCode = error?.['code']

    if (errorCode === 'P2002') {
      throw new ConflictException('Registro duplicado.')
    }

    if (errorCode === 'P2003') {
      throw new BadRequestException('Referência inválida.')
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
