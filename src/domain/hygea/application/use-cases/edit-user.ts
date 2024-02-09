import { UsersRepository } from '../repositories/users-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InvalidDataError } from './errors/invalid-data-error'

export type EditUserInput = {
  name: string
  email: string
  address: string
  birthDate: Date
}

export type EditUserUseCaseResponse = Either<
  ResourceNotFoundError,
  Record<string, never>
>

export class EditUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    userId: string,
    userData: EditUserInput,
  ): Promise<EditUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found'))
    }

    const ensureNewEmailIsUnique = await this.usersRepository.findByEmail(
      userData.email,
    )

    if (ensureNewEmailIsUnique && user.email !== userData.email) {
      return left(new InvalidDataError('The e-mail provided is already in use'))
    }

    user.name = userData.name
    user.email = userData.email
    user.address = userData.address
    user.birthDate = userData.birthDate

    await this.usersRepository.save(user)
    return right({})
  }
}
