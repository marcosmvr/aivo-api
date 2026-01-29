import { Offer, Prisma } from '@prisma/client'
import { CreateOfferSchema } from '../schema/create-offer.schema'
import { UpdateOfferSchema } from '../schema/update-offer.schema'

export interface IOfferRepository {
  create(data: CreateOfferSchema, userId: string): Promise<Offer>
  findByUserId(userId: string): Promise<Offer[]>
  findByOfferId(id: string, userId: string): Promise<Offer | null>
  updateById(
    id: string,
    userId: string,
    data: UpdateOfferSchema,
  ): Promise<Offer>
  deleteById(id: string, userId: string): Promise<Offer>
}

export const OFFERS_REPOSITORY = Symbol('OFFERS_REPOSITORY')