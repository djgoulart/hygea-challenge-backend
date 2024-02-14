import { UsersRepository } from '../repositories/users-repository'
import { Either, right } from '@/core/either'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { UserDTO } from '../dtos/user-dto'

export type ListUsersUseCaseResponse = Either<
  null,
  {
    users: UserDTO[]
  }
>

export class FetchUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
    query,
  }: PaginationParams): Promise<ListUsersUseCaseResponse> {
    const users = await this.usersRepository.findMany({ page, query })

    return right({ users })
  }
}
