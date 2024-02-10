import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(usersRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should send the error to an external tool like Datadog
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
