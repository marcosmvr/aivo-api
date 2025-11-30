import { z } from 'zod/mini'
import { CreateMetricsSchema } from './create-metric.schema'

export const UpdateMetricsSchema = CreateMetricsSchema.partial()

export type UpdateMetricsSchema = z.infer<typeof UpdateMetricsSchema>
