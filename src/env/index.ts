import dotenv from 'dotenv'
import { z } from 'zod'
dotenv.config()

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().default('3000'),
  HOST: z.string().default('localhost'),
  JWT_SECRET: z.string().default('secret'),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.number(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  SMTP_EMAIL: z.string(),
  SMTP_GMAIL_APP_PASSWORD: z.string(),
  SMTP_SERVICE: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.log('❌ Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables')
}

export const env = _env.data
