import { z } from 'zod'

import { authMiddleware } from '@/middlewares/auth-middleware'
import { makeAuthService } from '@/services/factories/make-auth-service'
import { makeUserService } from '@/services/factories/make-user-service'
import type { FastifyTypedInstance } from '@/types/fastify'
import { UserAlreadyExistsError } from '@/services/error/user-already-exists-error'
import { UserNotFoundError } from '@/services/error/user-not-found'
import { InvalidPasswordError } from '@/services/error/invalid-password-error'
import { InvalidTokenError } from '@/services/error/invalid-token-error'

export const user = async (app: FastifyTypedInstance) => {
  // Create user
  app.post(
    '/auth/register',
    {
      schema: {
        tags: ['Auth'],
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string(),
        }),
      },
    },
    async (req, reply) => {
      const parsed = z
        .object({
          name: z.string(),
          email: z.string().email(),
          password: z.string(),
        })
        .safeParse(req.body)
      if (!parsed.success)
        return reply.status(400).send({ error: parsed.error.issues[0].message })

      try {
        const userService = makeUserService()
        const user = await userService.createUser(parsed.data)
        reply.status(201).send(user)
      } catch (error) {
        if (error instanceof UserAlreadyExistsError)
          return reply.status(400).send({ error: (error as Error).message })
        console.error(error)
        reply.status(500).send({ error: 'Internal server error' })
      }
    },
  )

  // Sign in
  app.post('/auth/login', async (req, reply) => {
    const parsed = z
      .object({ email: z.string().email(), password: z.string() })
      .safeParse(req.body)
    if (!parsed.success)
      return reply.status(400).send({ error: parsed.error.issues[0].message })

    try {
      const authService = makeAuthService()
      const user = await authService.signIn(
        parsed.data.email,
        parsed.data.password,
      )
      reply.send(user)
    } catch (error) {
      if (error instanceof UserNotFoundError)
        return reply.status(404).send({ error: (error as Error).message })
      if (error instanceof InvalidPasswordError)
        return reply.status(400).send({ error: (error as Error).message })
      console.error(error)
      reply.status(500).send({ error: 'Internal server error' })
    }
  })

  // Forgot password
  app.post('/auth/forgot-password', async (req, reply) => {
    const parsed = z.object({ email: z.string().email() }).safeParse(req.body)
    if (!parsed.success)
      return reply.status(400).send({ error: parsed.error.issues[0].message })

    try {
      const authService = makeAuthService()
      await authService.recoverPassword(parsed.data.email)
      reply.status(204).send({ message: `Email sent for ${parsed.data.email}` })
    } catch (error) {
      if (error instanceof UserNotFoundError)
        return reply.status(404).send({ error: (error as Error).message })
      console.error(error)
      reply.status(500).send({ error: 'Internal server error' })
    }
  })

  // Reset password
  app.post('/auth/reset-password', async (req, reply) => {
    const parsed = z
      .object({ token: z.string(), password: z.string() })
      .safeParse(req.body)
    if (!parsed.success)
      return reply.status(400).send({ error: parsed.error.issues[0].message })

    try {
      const authService = makeAuthService()
      await authService.resetPassword(parsed.data.token, parsed.data.password)
      reply.status(204).send({ message: 'Password updated' })
    } catch (error) {
      if (error instanceof InvalidTokenError)
        return reply.status(400).send({ error: (error as Error).message })
      console.error(error)
      reply.status(500).send({ error: 'Internal server error' })
    }
  })

  // Test route
  app.get('/test', { preHandler: authMiddleware }, async (req, reply) => {
    reply.send({ message: 'Hello world' })
  })
}
