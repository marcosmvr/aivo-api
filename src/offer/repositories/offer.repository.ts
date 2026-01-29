import { Injectable } from '@nestjs/common'
import { IOfferRepository } from './offer.repository.interface'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateOfferSchema } from '../schema/create-offer.schema'
import { Offer } from '@prisma/client'
import { UpdateOfferSchema } from '../schema/update-offer.schema'

@Injectable()
export class OffersRepository implements IOfferRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateOfferSchema & { userId: string }): Promise<Offer> {
    return this.prisma.offer.create({
      data,
      include: { metrics: true },
    })
  }

  async findByUserId(userId: string): Promise<Offer[]> {
    return this.prisma.offer.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findByOfferId(id: string, userId: string): Promise<Offer | null> {
    return this.prisma.offer.findFirst({
      where: { id, userId },
      include: { metrics: true, reports: true },
    })
  }

  async updateById(
    id: string,
    userId: string,
    data: UpdateOfferSchema,
  ): Promise<Offer> {
    return this.prisma.offer.update({
      where: { id, userId },
      data,
    })
  }

  async deleteById(id: string, userId: string): Promise<Offer> {
    return this.prisma.offer.delete({
      where: { id, userId },
    })
  }
}
