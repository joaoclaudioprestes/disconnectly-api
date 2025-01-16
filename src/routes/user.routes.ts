import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export const user = async (app: FastifyInstance) => {
  app.get('/users', async (req: FastifyRequest, reply: FastifyReply) => {
    reply.send({ hello: 'user' })
  })

  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    reply.send({ message: 'Hello, World!' })
  })
}
