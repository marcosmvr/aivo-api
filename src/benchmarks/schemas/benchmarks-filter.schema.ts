import z from 'zod'

export const BenchmarkFiltersSchema = z.object({
  niche: z.string().optional(),
  country: z.string().optional(),
  trafficSource: z.string().optional(),
  funnelType: z.string().optional(),
})

export type BenchmarkFiltersSchema = z.infer<typeof BenchmarkFiltersSchema>
