import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { PrismaUsersRepository } from '@/domain/hygea/application/repositories/prisma-users-repository'
import { GetUserUseCase } from '@/domain/hygea/application/use-cases/get-user'
import { ResourceNotFoundError } from '@/domain/hygea/application/use-cases/errors/resource-not-found-error'

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
  const getUserParamSchema = z.object({
    userId: z.string(),
  })

  const { userId } = getUserParamSchema.parse(request.params)

  const repository = new PrismaUsersRepository()
  const useCase = new GetUserUseCase(repository)
  const response = await useCase.execute({ id: userId })

  if (response.isLeft() && response.value instanceof ResourceNotFoundError) {
    return reply.status(400).send(response.value)
  }

  return reply.status(200).send(response.value)
}
