import z from 'zod'

export const CreateMetricsSchema = z.object({
  impressions: z
    .number()
    .int()
    .min(0, 'Impressões devem ser positivas')
    .optional()
    .default(0),
  clicks: z
    .number()
    .int()
    .min(0, 'Clicks devem ser positivos')
    .optional()
    .default(0),
  leads: z
    .number()
    .int()
    .min(0, 'Leads devem ser positivos')
    .optional()
    .default(0),
  sales: z
    .number()
    .int()
    .min(0, 'Sales devem ser positivas')
    .optional()
    .default(0),
  revenue: z.number().min(0, 'Revenue deve ser positivo').optional().default(0),
  cost: z.number().min(0, 'Cost deve ser positivo').optional().default(0),
})

export type CreateMetricsSchema = z.infer<typeof CreateMetricsSchema>
