import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { PrismaUsersRepository } from '@/domain/hygea/application/repositories/prisma-users-repository'
import { CreateUserUseCase } from '@/domain/hygea/application/use-cases/create-user'
import { isDate } from 'date-fns'
import { EmailAlreadyExistsError } from '@/domain/hygea/application/use-cases/errors/email-already-exists-error'

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const createUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    address: z.string(),
    birthDate: z
      .string()
      .refine(
        (value) => {
          return isDate(new Date(value))
        },
        {
          message: 'invalid date',
        },
      )
      .transform((value) => new Date(value)),
  })

  const { name, email, address, birthDate } = createUserBodySchema.parse(
    request.body,
  )

  const repository = new PrismaUsersRepository()
  const useCase = new CreateUserUseCase(repository)
  const response = await useCase.execute({ name, email, address, birthDate })

  if (response.isLeft() && response.value instanceof EmailAlreadyExistsError) {
    return reply.status(409).send(response.value)
  }

  return reply.status(201).send()
}
