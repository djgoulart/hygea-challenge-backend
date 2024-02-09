import { User } from '@/domain/hygea/enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

export type DeleteUserInput = {
  id: string
}

export type DeleteUserUseCaseResponse = Either<
  ResourceNotFoundError,
  Record<string, never>
>

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(userData: DeleteUserInput): Promise<DeleteUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userData.id)

    if (!user) {
      return left(new ResourceNotFoundError('User not found'))
    }

    await this.usersRepository.delete(user)
    return right({})
  }
}
