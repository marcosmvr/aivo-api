import { CreateBenchmarkSchema } from 'src/benchmarks/schemas/create-benchmarks.schema';
import { CalculatedMetricsSchema } from 'src/metrics/schemas/calculated-metrics.schema';
import { CreateOfferSchema } from 'src/offer/schema/create-offer.schema';
import { z } from 'zod';

export const OfferAIContextSchema = CreateOfferSchema.pick({
  name: true,
  niche: true,
  country: true,
  trafficSource: true,
  funnelType: true,
  budget: true,
  startDate: true,
  endDate: true,
});

export const MetricsAIContextSchema = CalculatedMetricsSchema.pick({
  impressions: true,
  clicks: true,
  ctr: true,
  cpc: true,
  cpm: true,
  leads: true,
  sales: true,
  conversionRate: true,
  revenue: true,
  cost: true,
  roas: true,
  aov: true,
});

export const BenchmarkAIContextSchema = CreateBenchmarkSchema.pick({
  metricName: true,
  minValue: true,
  maxValue: true,
  idealValue: true,
});


export const AIAnalysisInputSchema = z.object({
  offer: OfferAIContextSchema,
  metrics: MetricsAIContextSchema,
  benchmarks: z.array(BenchmarkAIContextSchema),
});

export type AIAnalysisInputSchema = z.infer<typeof AIAnalysisInputSchema>;


export const AIAnalysisOutputSchema = z.object({
  summary: z.string().min(10),

  validation_status: z.enum([
    'validated',
    'not_validated',
    'close_to_validation',
  ]),

  validation_explanation: z.string().min(10),

  bottlenecks: z.array(
    z.object({
      stage: z.enum(['traffic', 'funnel', 'checkout', 'offer']),
      metric: z.string(),
      current_value: z.number(),
      benchmark_value: z.number(),
      severity: z.enum(['high', 'medium', 'low']),
      explanation: z.string().min(10),
    }),
  ),

  action_plan: z.array(
    z.object({
      priority: z.number().int().positive(),
      action: z.string().min(10),
      expected_impact: z.string().min(3),
      difficulty: z.enum(['easy', 'medium', 'hard']),
    }),
  ),

  missing_data: z.array(z.string()),

  next_test_recommendations: z.string().min(10),
});

export type AIAnalysisOutputSchema = z.infer<typeof AIAnalysisOutputSchema>;


export type OfferAIContext = z.infer<typeof OfferAIContextSchema>;


export type MetricsAIContext = z.infer<typeof MetricsAIContextSchema>;


export type BenchmarkAIContext = z.infer<typeof BenchmarkAIContextSchema>;

export function validateAIInput(data: unknown): AIAnalysisInputSchema {
  return AIAnalysisInputSchema.parse(data);
}


export function validateAIOutput(data: unknown): AIAnalysisOutputSchema {
  return AIAnalysisOutputSchema.parse(data);
}


export function safeValidateAIInput(data: unknown) {
  return AIAnalysisInputSchema.safeParse(data);
}

export function safeValidateAIOutput(data: unknown) {
  return AIAnalysisOutputSchema.safeParse(data);
}