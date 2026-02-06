import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { Prisma, User } from '@prisma/client'
import {
  CreateUserPersistenceData,
  IAuthRepository,
} from './auth.repository.interface'
import { CreateUserSchema } from '../schemas/create-user.schema'

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  async findById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    })
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })
    return !!user
  }

  async create(data: CreateUserPersistenceData): Promise<User> {
    return this.prisma.user.create({
      data,
    })
  }
}
