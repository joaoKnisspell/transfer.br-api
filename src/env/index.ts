import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENVIRONMENT === 'test') {
  config({
    path: '.env.test',
  })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENVIRONMENT: z
    .enum(['development', 'production', 'test'])
    .default('production'),
  DATABASE_URL: z.string(),
  SERVER_ROUTE: z.number().default(3333),
})

export const env = envSchema.parse(process.env)
