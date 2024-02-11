import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { PrismaUsersRepository } from '@/domain/hygea/application/repositories/prisma-users-repository'
import { DeleteUserUseCase } from '@/domain/hygea/application/use-cases/delete-user'
import { ResourceNotFoundError } from '@/domain/hygea/application/use-cases/errors/resource-not-found-error'
import { isDate } from 'date-fns'
import { EditUserUseCase } from '@/domain/hygea/application/use-cases/edit-user'
import { EmailAlreadyExistsError } from '@/domain/hygea/application/use-cases/errors/email-already-exists-error'

export async function editUser(request: FastifyRequest, reply: FastifyReply) {
  const editUserParamSchema = z.object({
    userId: z.string(),
  })

  const editUserBodySchema = z.object({
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

  const { userId } = editUserParamSchema.parse(request.params)
  const { name, email, address, birthDate } = editUserBodySchema.parse(
    request.body,
  )

  const repository = new PrismaUsersRepository()
  const useCase = new EditUserUseCase(repository)
  const response = await useCase.execute(userId, {
    name,
    email,
    address,
    birthDate,
  })

  if (response.isLeft() && response.value instanceof ResourceNotFoundError) {
    return reply.status(400).send(response.value)
  }

  if (response.isLeft() && response.value instanceof EmailAlreadyExistsError) {
    return reply.status(400).send(response.value)
  }

  return reply.status(201).send()
}
