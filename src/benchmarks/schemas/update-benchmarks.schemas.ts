import { z } from 'zod/mini'
import { CreateBenchmarkSchema } from './create-benchmarks.schema'

export const UpdateBenchmarkSchema = CreateBenchmarkSchema.partial()

export type UpdateBenchmarkSchema = z.infer<typeof UpdateBenchmarkSchema>
