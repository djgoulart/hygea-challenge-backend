import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DB_NAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_USER: z.string(),
  NODE_ENV: z.string(),
})

export const env = envSchema.parse(process.env)
