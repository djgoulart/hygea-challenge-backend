import { User } from '@/domain/hygea/enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { Either, right } from '@/core/either'
import { PaginationParams } from '@/core/repositories/pagination-params'

export type CreateUserUseCaseResponse = Either<
  null,
  {
    users: User[]
  }
>

export class FetchUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
  }: PaginationParams): Promise<CreateUserUseCaseResponse> {
    const users = await this.usersRepository.findMany({ page })

    return right({ users })
  }
}
