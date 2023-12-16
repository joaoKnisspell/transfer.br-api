import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENVIRONMENT: z
    .enum(['development', 'production', 'test'])
    .default('production'),
  DATABASE_URL: z.string(),
  SERVER_ROUTE: z.number().default(3333),
})

export const env = envSchema.parse(process.env)
