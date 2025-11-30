import z from 'zod'

export const CreateBenchmarkSchema = z
  .object({
    niche: z.string().min(2, 'Nicho é obrigatório'),
    country: z.string().length(3, 'País deve ter 3 letras (ex: BRA, USA)'),
    trafficSource: z.string().min(2, 'Fonte de tráfego é obrigatória'),
    funnelType: z.string().min(2, 'Tipo de funil é obrigatório'),
    metricName: z.enum([
      'ctr',
      'cpc',
      'cpm',
      'roas',
      'aov',
      'conversion_rate',
      'lead_conversion',
    ]),
    minValue: z.number().min(0, 'Valor mínimo deve ser positivo'),
    maxValue: z.number().min(0, 'Valor máximo deve ser positivo'),
    idealValue: z.number().min(0, 'Valor ideal deve ser positivo'),
    description: z.string().optional(),
  })
  .refine(data => data.maxValue >= data.minValue, {
    message: 'Valor máximo deve ser maior ou igual ao mínimo',
    path: ['maxValue'],
  })
  .refine(
    data =>
      data.idealValue >= data.minValue && data.idealValue <= data.maxValue,
    {
      message: 'Valor ideal deve estar entre o mínimo e máximo',
      path: ['idealValue'],
    },
  )

export type CreateBenchmarkSchema = z.infer<typeof CreateBenchmarkSchema>
