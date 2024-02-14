import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { PrismaUsersRepository } from '@/domain/hygea/application/repositories/prisma-users-repository'
import { FetchUsersUseCase } from '@/domain/hygea/application/use-cases/fetch-users'

export async function fetchUsers(request: FastifyRequest, reply: FastifyReply) {
  const fetchUsersQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    query: z.string().optional(),
  })

  const { page, query } = fetchUsersQuerySchema.parse(request.query)

  const repository = new PrismaUsersRepository()
  const useCase = new FetchUsersUseCase(repository)
  const response = await useCase.execute({ page, query })

  return reply.status(200).send(response.value)
}
