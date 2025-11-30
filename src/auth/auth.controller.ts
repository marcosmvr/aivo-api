import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserSchema } from './schema/create-user.schema'
import { ZodValidationPipe } from 'src/utils/ZodValidationPipe'
import { SignInUserSchema } from './schema/login-user.schema'
import { JwtAuthGuard } from './guards/auth.guard'
import type { FastifyRequest } from 'fastify'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  async create(@Body() createUser: CreateUserSchema) {
    const user = this.authService.create(createUser)
    return user
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(SignInUserSchema))
  async signIn(@Body() signIn: SignInUserSchema) {
    const user = this.authService.signIn(signIn)
    return user
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async listUser(@Req() req: FastifyRequest) {
    return req.user
  }
}
