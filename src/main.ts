import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 10485760,
    }),
  )

  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Aivo API')
    .setDescription(
      'API REST para análise inteligente de campanhas de marketing com Google Gemini',
    )
    .setVersion('1.0.0')
    .addTag('Auth', 'Autenticação e gerenciamento de usuários')
    .addTag('Offers', 'Gestão de ofertas e campanhas')
    .addTag('Analysis', 'Análises geradas por IA')
    .addTag('Benchmarks', 'Benchmarks de mercado (Admin)')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Aivo API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  })

  const port = process.env.PORT || 3000
  await app.listen(port, '0.0.0.0')

  console.log(`🚀 Aivo API running on http://localhost:${port}`)
  console.log(`📚 Swagger docs: http://localhost:${port}/docs`)
}
bootstrap()
