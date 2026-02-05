import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import {
  AIAnalysisInputSchema,
  AIAnalysisOutputSchema,
} from './schemas/ai-analysis.schema'

@Injectable()
export class AiAnalysisService {
  private readonly logger = new Logger(AiAnalysisService.name)
  private genAI: GoogleGenerativeAI
  private model: GenerativeModel

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY')

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY não configurada no .env')
    }

    this.genAI = new GoogleGenerativeAI(apiKey)

    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction:
        'Você é um analista especializado em marketing digital e funis de vendas. Responda APENAS com JSON válido, sem texto adicional.',
    })

    this.logger.log('Gemini 2.5 Flash inicializado')
  }

  async analyzeOffer(context: AIAnalysisInputSchema): Promise<{
    analysis: AIAnalysisOutputSchema
    usage: {
      promptTokens: number
      completionTokens: number
      totalTokens: number
      estimatedCost: number
    }
  }> {
    try {
      const validatedInput = AIAnalysisInputSchema.parse(context)
      const prompt = this.buildPrompt(validatedInput)

      this.logger.debug(
        `📤 Enviando análise para Gemini... (~${prompt.length} caracteres)`,
      )

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        },
      })

      const response = result.response
      const responseText = response.text()

      if (!responseText) {
        throw new Error('Gemini retornou resposta vazia')
      }

      const parsedResponse = JSON.parse(responseText)
      const validatedAnalysis = AIAnalysisOutputSchema.parse(parsedResponse)

      const promptTokens = await this.model.countTokens(prompt)
      const candidateTokens = await this.model.countTokens(responseText)

      const usage = {
        promptTokens: promptTokens.totalTokens,
        completionTokens: candidateTokens.totalTokens,
        totalTokens: promptTokens.totalTokens + candidateTokens.totalTokens,
        estimatedCost: this.calculateCost(
          promptTokens.totalTokens,
          candidateTokens.totalTokens,
        ),
      }

      this.logger.log('Análise concluída com sucesso')
      this.logger.debug(`Tokens: ${usage.totalTokens}`)

      return {
        analysis: validatedAnalysis,
        usage,
      }
    } catch (error) {
      if (error.name === 'ZodError') {
        this.logger.error(
          'Erro de validação Zod no output da IA:',
          error.errors,
        )
        throw new Error('IA retornou formato inválido')
      }

      this.logger.error('Erro inesperado no Gemini Service:', error)
      throw error
    }
  }

  private buildPrompt(context: AIAnalysisInputSchema): string {
    const { offer, metrics, benchmarks } = context

    const startDate = offer.startDate
      ? new Date(offer.startDate).toLocaleDateString('pt-BR')
      : 'Não informada'
    const endDate = offer.endDate
      ? new Date(offer.endDate).toLocaleDateString('pt-BR')
      : 'Não informada'

    const benchmarksText =
      benchmarks.length > 0
        ? benchmarks
            .map(
              b =>
                `- ${b.metricName}: Min ${b.minValue} | Ideal ${b.idealValue} | Max ${b.maxValue}`,
            )
            .join('\n')
        : 'Nenhum benchmark disponível'

    return `Analise esta campanha de marketing:

DADOS DA CAMPANHA:
- Nome: ${offer.name}
- Nicho: ${offer.niche}
- País: ${offer.country}
- Tráfego: ${offer.trafficSource}
- Funil: ${offer.funnelType}
- Budget: $${offer.budget || 0}
- Período: ${startDate} até ${endDate}

MÉTRICAS:
- Impressões: ${metrics.impressions || 0}
- Cliques: ${metrics.clicks}
- CTR: ${metrics.ctr?.toFixed(2) || 0}%
- CPC: $${metrics.cpc?.toFixed(2) || 0}
- CPM: $${metrics.cpm?.toFixed(2) || 0}
- Leads: ${metrics.leads}
- Vendas: ${metrics.sales}
- CR: ${metrics.conversionRate?.toFixed(2) || 0}%
- Receita: $${metrics.revenue.toFixed(2)}
- Custo: $${metrics.cost.toFixed(2)}
- ROAS: ${metrics.roas?.toFixed(2) || 0}
- AOV: $${metrics.aov?.toFixed(2) || 0}

BENCHMARKS DE MERCADO:
${benchmarksText}

TAREFAS:
1. Resuma a performance em 2-3 frases (campo "summary")
2. Defina status de validação (campo "validation_status"):
   - "validated": ROAS > 3.0 E vendas > 10
   - "close_to_validation": ROAS 1.5-3.0 OU vendas 5-10
   - "not_validated": ROAS < 1.5 E vendas < 5
3. Explique o status (campo "validation_explanation")
4. Identifique até 5 gargalos comparando com benchmarks (campo "bottlenecks"):
   - Informe stage, metric, current_value, benchmark_value, severity, explanation
   - Stages possíveis: traffic, funnel, checkout, offer
   - Severity: high (>30% abaixo ideal), medium (10-30% abaixo), low (<10% abaixo)
5. Crie 5 ações priorizadas (campo "action_plan"):
   - priority: 1 (mais importante) até 5
   - action: descrição clara da ação
   - expected_impact: ex: "+15% CR", "+$500 receita"
   - difficulty: easy, medium, hard
6. Liste dados ausentes que melhorariam análise (campo "missing_data")
7. Recomende 3 próximos testes em texto único (campo "next_test_recommendations")

REGRAS:
- Compare SEMPRE com benchmarks quando disponíveis
- Seja específico nos valores (não use "baixo", use "15% abaixo do ideal")
- Priorize ações de maior impacto e menor dificuldade
- Se algum benchmark não existe, não force comparação

Retorne JSON EXATAMENTE neste formato:
{
  "summary": "string com 2-3 frases",
  "validation_status": "validated|not_validated|close_to_validation",
  "validation_explanation": "string explicando o status",
  "bottlenecks": [
    {
      "stage": "traffic|funnel|checkout|offer",
      "metric": "nome da métrica",
      "current_value": número,
      "benchmark_value": número,
      "severity": "high|medium|low",
      "explanation": "explicação detalhada"
    }
  ],
  "action_plan": [
    {
      "priority": número de 1 a 5,
      "action": "descrição da ação",
      "expected_impact": "impacto esperado",
      "difficulty": "easy|medium|hard"
    }
  ],
  "missing_data": ["dado1", "dado2"],
  "next_test_recommendations": "texto com 3 recomendações de testes"
}`
  }

  private calculateCost(
    promptTokens: number,
    completionTokens: number,
  ): number {
    const inputCost = (promptTokens / 1_000_000) * 0.075
    const outputCost = (completionTokens / 1_000_000) * 0.3

    return inputCost + outputCost
  }
}
