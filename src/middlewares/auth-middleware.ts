import { env } from '@/env'
import { FastifyReply, FastifyRequest } from 'fastify'
import jwt, { JwtPayload } from 'jsonwebtoken'

async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' })
  }

  const token = authorization.split(' ')[1]

  if (!token) {
    return reply.code(401).send({ message: 'Unauthorized' })
  }

  try {
    jwt.verify(token, env.JWT_SECRET) as JwtPayload
  } catch (error) {
    return reply.code(401).send({ message: 'Invalid token' })
  }
}

export { authMiddleware }
