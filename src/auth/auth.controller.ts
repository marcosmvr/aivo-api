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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import type { FastifyRequest } from 'fastify'
import { AuthService } from './auth.service'
import { ZodValidationPipe } from 'src/utils/ZodValidationPipe'
import { CreateUserSchema } from './schemas/create-user.schema'
import { SignInUserSchema } from './schemas/login-user.schema'
import { JwtAuthGuard } from 'src/auth/guards/auth.guard'
import {
  LOGIN_INPUT_EXAMPLE,
  LOGIN_RESPONSE_EXAMPLE,
  REGISTER_INPUT_EXAMPLE,
  USER_RESPONSE_EXAMPLE,
} from './auth.swagger'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiBody({ schema: { example: REGISTER_INPUT_EXAMPLE } })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    schema: { example: USER_RESPONSE_EXAMPLE },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou e-mail já cadastrado',
  })
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  async create(@Body() createUser: CreateUserSchema) {
    return this.authService.create(createUser)
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Autenticar usuário (Login)' })
  @ApiBody({ schema: { example: LOGIN_INPUT_EXAMPLE } })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: { example: LOGIN_RESPONSE_EXAMPLE },
  })
  @ApiResponse({ status: 401, description: 'E-mail ou senha incorretos' })
  @UsePipes(new ZodValidationPipe(SignInUserSchema))
  async signIn(@Body() signIn: SignInUserSchema) {
    return this.authService.signIn(signIn)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Obter dados do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Dados do perfil retornado',
    schema: { example: USER_RESPONSE_EXAMPLE },
  })
  @ApiResponse({ status: 401, description: 'Token ausente ou inválido' })
  async listUser(@Req() req: FastifyRequest) {
    return req.user
  }
}
