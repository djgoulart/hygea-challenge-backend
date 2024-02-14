import { UsersRepository } from '../repositories/users-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UserDTO } from '../dtos/user-dto'

export type GetUserInput = {
  id: string
}

export type GetUserUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: UserDTO
  }
>

export class GetUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(userData: GetUserInput): Promise<GetUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userData.id)

    if (!user) {
      return left(new ResourceNotFoundError('User not found'))
    }

    return right({ user })
  }
}
