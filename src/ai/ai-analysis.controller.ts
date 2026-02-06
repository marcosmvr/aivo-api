import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Request } from 'express'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/auth.guard'
import { PrismaService } from '../prisma/prisma.service'
import { AiAnalysisService } from './ai-analysis.service'
import { AiRateLimitService } from './rate-limiting.service'
import { AIAnalysisInputSchema } from './schemas/ai-analysis.schema'
import {
  AI_ANALYSIS_RESPONSE_EXAMPLE,
  LIST_REPORTS_EXAMPLE,
  SINGLE_REPORT_RESPONSE_EXAMPLE,
} from './ai.swagger'

interface AuthenticatedRequest extends Request {
  user: {
    id: string
    email: string
  }
}
@ApiTags('AI Analysis')
@ApiBearerAuth()
@Controller('offers')
@UseGuards(JwtAuthGuard)
export class AiAnalysisController {
  constructor(
    private readonly aiAnalysisService: AiAnalysisService,
    private readonly prisma: PrismaService,
    private readonly rateLimit: AiRateLimitService,
  ) {}

  @Post(':offerId/analyze')
  @ApiOperation({ summary: 'Gerar análise de IA para uma oferta' })
  @ApiParam({ name: 'offerId', description: 'ID da oferta com métricas' })
  @ApiResponse({
    status: 200,
    description: 'Análise gerada com sucesso',
    schema: { example: AI_ANALYSIS_RESPONSE_EXAMPLE },
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão ou Limite de análise atingido',
  })
  @ApiResponse({ status: 404, description: 'Oferta não encontrada' })
  @ApiResponse({
    status: 429,
    description: 'Limite de 5 análises por hora atingido',
  })
  @HttpCode(HttpStatus.OK)
  async analyzeOffer(
    @Param('offerId', ParseUUIDPipe) offerId: string,
    @Req() req: AuthenticatedRequest,
    @CurrentUser('id') userId: string,
  ) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        metrics: true,
      },
    })

    if (!offer) {
      throw new NotFoundException('Oferta não encontrada')
    }

    if (offer.userId !== userId) {
      throw new ForbiddenException('Sem permissão para analisar esta oferta')
    }

    const canAnalyze = this.rateLimit.canAnalyze(userId)

    if (!canAnalyze) {
      throw new HttpException(
        'Limite de 5 análises por hora atingido',
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }

    const latestMetrics = offer.metrics
    if (!latestMetrics) {
      throw new BadRequestException(
        'Oferta sem métricas. Adicione métricas antes de gerar análise.',
      )
    }

    const benchmarks = await this.prisma.benchmark.findMany({
      where: {
        OR: [
          {
            niche: offer.niche,
            country: offer.country,
            trafficSource: offer.trafficSource,
            funnelType: offer.funnelType,
          },
          {
            niche: offer.niche,
            country: null,
            trafficSource: null,
            funnelType: null,
          },
        ],
      },
    })

    const context: AIAnalysisInputSchema = {
      offer: {
        name: offer.name,
        niche: offer.niche,
        country: offer.country,
        trafficSource: offer.trafficSource,
        funnelType: offer.funnelType,
        budget: offer.budget ? Number(offer.budget) : undefined,
        startDate: offer.startDate.toISOString(),
        endDate: offer.endDate ? offer.endDate.toISOString() : undefined,
      },
      metrics: {
        impressions: latestMetrics.impressions || 0,
        clicks: latestMetrics.clicks || 0,
        ctr: latestMetrics.ctr ? Number(latestMetrics.ctr) : 0,
        cpc: latestMetrics.cpc ? Number(latestMetrics.cpc) : 0,
        cpm: latestMetrics.cpm ? Number(latestMetrics.cpm) : 0,
        leads: latestMetrics.leads || 0,
        sales: latestMetrics.sales || 0,
        conversionRate: latestMetrics.conversionRate
          ? Number(latestMetrics.conversionRate)
          : 0,
        revenue: latestMetrics.revenue ? Number(latestMetrics.revenue) : 0,
        cost: latestMetrics.cost ? Number(latestMetrics.cost) : 0,
        roas: latestMetrics.roas ? Number(latestMetrics.roas) : 0,
        aov: latestMetrics.aov ? Number(latestMetrics.aov) : 0,
      },
      benchmarks: benchmarks.map(b => ({
        metricName: b.metricName as any,
        minValue: Number(b.minValue),
        maxValue: Number(b.maxValue),
        idealValue: Number(b.idealValue),
      })),
    }

    const { analysis, usage } =
      await this.aiAnalysisService.analyzeOffer(context)

    const report = await this.prisma.aIReport.create({
      data: {
        offerId: offer.id,
        userId: userId,
        summary: analysis.summary,
        validationStatus: analysis.validation_status,
        validationExplanation: analysis.validation_explanation || '',
        bottlenecks: analysis.bottlenecks as any,
        actionPlan: analysis.action_plan as any,
        missingData: analysis.missing_data as any,
        nextTestRecommendations: analysis.next_test_recommendations,
        fullReport: analysis as any,
        aiModel: 'gpt-4o-mini',
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        totalTokens: usage.totalTokens,
        estimatedCost: usage.estimatedCost,
      },
    })

    return {
      success: true,
      reportId: report.id,
      analysis,
      usage: {
        tokensUsed: usage.totalTokens,
        estimatedCost: `$${usage.estimatedCost.toFixed(6)}`,
      },
      createdAt: report.createdAt,
    }
  }

  @Get(':offerId/reports')
  @ApiOperation({ summary: 'Listar histórico de relatórios de uma oferta' })
  @ApiResponse({ status: 200, schema: { example: LIST_REPORTS_EXAMPLE } })
  async listOfferReports(
    @Param('offerId', ParseUUIDPipe) offerId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id

    if (!userId) {
      throw new ForbiddenException('Usuário não autenticado')
    }

    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
    })

    if (!offer) {
      throw new NotFoundException('Oferta não encontrada')
    }

    if (offer.userId !== userId) {
      throw new ForbiddenException('Sem permissão para acessar esta oferta')
    }

    const reports = await this.prisma.aIReport.findMany({
      where: { offerId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        summary: true,
        validationStatus: true,
        aiModel: true,
        totalTokens: true,
        estimatedCost: true,
        createdAt: true,
      },
    })

    return {
      success: true,
      count: reports.length,
      reports,
    }
  }
}

@ApiTags('AI Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':reportId')
  @ApiOperation({ summary: 'Obter detalhes de um relatório específico' })
  @ApiResponse({
    status: 200,
    schema: { example: SINGLE_REPORT_RESPONSE_EXAMPLE },
  })
  @ApiResponse({ status: 404, description: 'Relatório não encontrado' })
  async getReport(
    @Param('reportId') reportId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id

    if (!userId) {
      throw new ForbiddenException('Usuário não autenticado')
    }

    const report = await this.prisma.aIReport.findUnique({
      where: { id: reportId },
      include: {
        offer: {
          select: {
            id: true,
            name: true,
            niche: true,
            country: true,
          },
        },
      },
    })

    if (!report) {
      throw new NotFoundException('Relatório não encontrado')
    }

    if (report.userId !== userId) {
      throw new ForbiddenException('Sem permissão para acessar este relatório')
    }

    return {
      success: true,
      report: {
        id: report.id,
        offer: report.offer,
        summary: report.summary,
        validationStatus: report.validationStatus,
        fullReport: report.fullReport,
        aiModel: report.aiModel,
        usage: {
          promptTokens: report.promptTokens,
          completionTokens: report.completionTokens,
          totalTokens: report.totalTokens,
          estimatedCost: report.estimatedCost,
        },
        createdAt: report.createdAt,
      },
    }
  }
}
