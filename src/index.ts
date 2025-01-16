import fastify, { FastifyInstance } from 'fastify'
import { ENV } from './env'
import { user } from './routes/user.routes'

export class App {
  private app: FastifyInstance
  private port: number

  constructor() {
    this.app = fastify()
    this.port = Number(ENV.PORT) || 3000
    this.config()
    this.routes()
    this.listen()
  }

  config(): void {}

  routes(): void {
    this.app.register(user)
  }

  listen(): void {
    this.app.listen({ port: this.port }, () => {
      console.log(`🍃 Server running on port ${this.port}`)
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const app = new App()
