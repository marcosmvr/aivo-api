import { Prisma, User } from '@prisma/client'

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>
  findById(userId: string): Promise<User | null>
  emailExists(email: string): Promise<boolean>
  create(data: Prisma.UserCreateInput): Promise<User>
}

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY')
