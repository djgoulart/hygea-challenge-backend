import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { PrismaUsersRepository } from '@/domain/hygea/application/repositories/prisma-users-repository'
import { DeleteUserUseCase } from '@/domain/hygea/application/use-cases/delete-user'
import { ResourceNotFoundError } from '@/domain/hygea/application/use-cases/errors/resource-not-found-error'

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const deleteUserParamSchema = z.object({
    userId: z.string(),
  })

  const { userId } = deleteUserParamSchema.parse(request.params)

  const repository = new PrismaUsersRepository()
  const useCase = new DeleteUserUseCase(repository)
  const response = await useCase.execute({ id: userId })

  if (response.isLeft() && response.value instanceof ResourceNotFoundError) {
    return reply.status(400).send(response.value)
  }

  return reply.status(201).send()
}
