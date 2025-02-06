import { authMiddleware } from '@/middlewares/auth-middleware'
import { InvalidPasswordError } from '@/services/error/invalid-password-error'
import { UserAlreadyExistsError } from '@/services/error/user-already-exists-error'
import { UserNotFoundError } from '@/services/error/user-not-found'
import { makeAuthService } from '@/services/factories/make-auth-service'
import { makeUserService } from '@/services/factories/make-user-service'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const user = async (app: FastifyInstance) => {
  // Create user
  app.post(
    '/auth/register',
    async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const body = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      })

      try {
        const data = body.parse(req.body)

        // Create user
        const userService = makeUserService()

        const user = await userService.createUser(data)

        reply.status(201).send(user)
      } catch (error) {
        if (error instanceof z.ZodError) {
          reply.status(400).send({ error: error.errors[0].message })
          return
        }

        if (error instanceof UserAlreadyExistsError) {
          reply.status(400).send({ error: error.message })
          return
        }

        console.log(error)
        reply.status(500).send({ error: 'Internal server error' })
      }
    },
  )

  // Sing in
  app.post('/auth/login', async (req: FastifyRequest, reply: FastifyReply) => {
    const body = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    try {
      const data = body.parse(req.body)

      const authService = makeAuthService()

      const user = await authService.signIn(data.email, data.password)

      return user
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({ error: error.errors[0].message })
        return
      }

      if (error instanceof UserNotFoundError) {
        reply.status(404).send({ error: error.message })
        return
      }

      if (error instanceof InvalidPasswordError) {
        reply.status(400).send({ error: error.message })
        return
      }

      console.log(error)
      reply.status(500).send({ error: 'Internal server error' })
    }
  })

  app.get(
    '/test',
    { preHandler: authMiddleware },
    async (req: FastifyRequest, reply: FastifyReply) => {
      reply.send({ message: 'Hello world' })
    },
  )
}
