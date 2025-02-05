import { makeUserService } from '@/services/factories/make-user-service'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const user = async (app: FastifyInstance) => {
  // Create user
  app.post(
    '/auth/register',
    async (req: FastifyRequest, reply: FastifyReply) => {
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
          reply.status(400).send({ message: error.errors[0].message })
        }

        console.log(error)
        reply.status(500).send({ message: 'Internal server error' })
      }
    },
  )

  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    reply.send({ message: 'Hello, World!' })
  })
}
