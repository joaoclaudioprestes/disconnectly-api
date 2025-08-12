import fastify, { FastifyInstance } from 'fastify'
import { user } from './routes/user.routes'
import { env } from './env'
import { registerMcpHttpRoutes } from './mcp/transports/http-transport'

export class App {
  private app: FastifyInstance
  private port: number
  private host: string

  constructor() {
    this.app = fastify()
    this.port = Number(env.PORT)
    this.host = env.HOST
    this.config()
    this.routes()
    this.listen()
  }

  config(): void {}

  routes(): void {
    this.app.register(user)
    this.app.register(registerMcpHttpRoutes)
  }

  listen(): void {
    this.app.listen({ port: this.port, host: this.host }, () => {
      console.log(`🍃 Server running on port ${this.port}`)
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const app = new App()
