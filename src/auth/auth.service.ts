import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import { hash, compare } from 'bcrypt'
import { User } from '@prisma/client'
import { ZodError } from 'zod'
import { CreateUserSchema } from './schema/create-user.schema'
import { SignInUserSchema } from './schema/login-user.schema'
import type { IAuthRepository } from './repositories/auth.repository.interface'

export interface AuthResponse {
  access_token: string
  refresh_token: string
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  private readonly saltRounds: number

  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    const saltRounds = this.config.get<number>('BCRYPT_SALT_ROUNDS', 10)
  }

  async create(data: unknown): Promise<User> {
    try {
      const validatedData = CreateUserSchema.parse(data)
      const { email, password, name, role } = validatedData

      await this.checkEmailExists(email)

      const hashedPassword = await this.hashPassword(password)

      const user = await this.authRepository.create({
        email,
        passwordHash: hashedPassword,
        name,
        role,
      })

      this.logger.log(`Novo usuário criado: ${user.id}`)
      return user
    } catch (error) {
      return this.handleCreateUserError(error)
    }
  }

  async signIn(data: unknown): Promise<AuthResponse> {
    try {
      const validatedData = SignInUserSchema.parse(data)
      const { email, password } = validatedData

      const user = await this.findUserByEmail(email)
      await this.validatePassword(password, user.passwordHash, email)

      const tokens = this.generateTokens(user.id)
      this.logger.log(`Usuário autenticado: ${user.id}`)

      return tokens
    } catch (error) {
      return this.handleSignInError(error)
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret:
          this.config.get<string>('JWT_REFRESH_SECRET') ||
          this.config.get<string>('JWT_SECRET'),
      })

      const userId = payload.sub

      if (!userId) {
        throw new UnauthorizedException('Invalid refresh token.')
      }

      const user = await this.authRepository.findById(userId)

      if (!user) {
        throw new UnauthorizedException('User not found.')
      }

      const tokens = this.generateTokens(userId)
      this.logger.log(`Token renovado para usuário: ${userId}`)

      return tokens
    } catch (error) {
      return this.handleRefreshTokenError(error)
    }
  }

  private async checkEmailExists(email: string): Promise<void> {
    const exists = await this.authRepository.emailExists(email)

    if (exists) {
      this.logger.warn(
        `Tentativa de criar usuário com email duplicado: ${email}`,
      )
      throw new ConflictException(
        'User with same e-mail address already exists.',
      )
    }
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.authRepository.findByEmail(email)

    if (!user) {
      this.logger.warn(`Tentativa de login com email não registrado: ${email}`)
      throw new UnauthorizedException('User credentials do not match.')
    }

    return user
  }

  private async hashPassword(password: string): Promise<string> {
    return hash(password, this.saltRounds)
  }

  private async validatePassword(
    password: string,
    hashedPassword: string,
    email: string,
  ): Promise<void> {
    const isPasswordValid = await compare(password, hashedPassword)

    if (!isPasswordValid) {
      this.logger.warn(`Tentativa de login com senha incorreta: ${email}`)
      throw new UnauthorizedException('User credentials do not match.')
    }
  }

  private generateTokens(userId: string): AuthResponse {
    const accessToken = this.jwt.sign(
      { sub: userId },
      { expiresIn: this.config.get('JWT_EXPIRATION', '15m') },
    )

    const refreshToken = this.jwt.sign(
      { sub: userId },
      { expiresIn: this.config.get('JWT_REFRESH_EXPIRATION', '7d') },
    )

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }

  private handleCreateUserError(error: unknown): never {
    if (error instanceof ZodError) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: error.issues,
      })
    }

    if (error instanceof ConflictException) {
      throw error
    }

    if (error?.['code'] === 'P2002') {
      throw new ConflictException(
        'User with same e-mail address already exists.',
      )
    }

    this.logger.error(
      `Erro ao criar usuário: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
    throw new InternalServerErrorException('Failed to create user.')
  }

  private handleSignInError(error: unknown): never {
    if (error instanceof ZodError) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: error.issues,
      })
    }

    if (error instanceof UnauthorizedException) {
      throw error
    }

    this.logger.error(
      `Erro ao fazer login: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
    throw new InternalServerErrorException('Failed to sign in.')
  }

  private handleRefreshTokenError(error: unknown): never {
    if (error instanceof UnauthorizedException) {
      throw error
    }

    this.logger.error(
      `Erro ao renovar token: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
    throw new UnauthorizedException('Invalid or expired refresh token.')
  }
}
