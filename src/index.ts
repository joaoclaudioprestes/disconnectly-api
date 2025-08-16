import fastify, { FastifyInstance } from 'fastify'
import fastifyCors from '@fastify/cors'
import { user } from './routes/user.routes'
import { env } from './env'
import { disconnectRoutes } from './routes/disconnect.routes'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

export class App {
  private app: FastifyInstance
  private port: number
  private host: string

  constructor() {
    this.app = fastify().withTypeProvider<ZodTypeProvider>()
    this.port = Number(env.PORT)
    this.host = env.HOST
    this.config()
    this.routes()
    this.listen()
  }

  private config(): void {
    // Zod validation & serialization
    this.app.setValidatorCompiler(validatorCompiler)
    this.app.setSerializerCompiler(serializerCompiler)
  }

  private routes(): void {
    // Enable CORS
    this.app.register(fastifyCors, { origin: '*' })

    // Swagger (OpenAPI 3.0)
    this.app.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'Disconnectly API',
          description: 'API documentation for the Disconnectly app',
          version: '1.0.0',
        },
        servers: [
          {
            url: `http://${this.host}:${this.port}`,
          },
        ],
      },
      transform: jsonSchemaTransform,
    })

    // Swagger UI
    this.app.register(fastifySwaggerUi, {
      routePrefix: '/docs',
    })

    // Register application routes
    this.app.register(user)
    this.app.register(disconnectRoutes)
  }

  private listen(): void {
    this.app.listen({ port: this.port, host: this.host }, (err, address) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      console.log(`🍃 Server running at ${address}`)
      console.log(`📖 Docs available at http://${this.host}:${this.port}/docs`)
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const app = new App()
