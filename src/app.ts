import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from './env'
import { usersRoutes } from './routes/users'
import { UseCaseError } from './core/error/use-case-error'

export const app = fastify()

app.register(usersRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    console.error('Validation error', error.format())
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (error instanceof UseCaseError) {
    console.error(error.message)
    return reply.status(400).send({ message: error.message })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should send the error to an external tool like Datadog
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
