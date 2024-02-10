import { User } from '@/domain/hygea/enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { Either, left, right } from '@/core/either'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'

export type CreateUserInput = {
  name: string
  email: string
  address: string
  birthDate: Date
}

export type CreateUserUseCaseResponse = Either<
  EmailAlreadyExistsError,
  {
    user: User
  }
>

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(userData: CreateUserInput): Promise<CreateUserUseCaseResponse> {
    const user = User.create({
      name: userData.name,
      email: userData.email,
      address: userData.address,
      birthDate: userData.birthDate,
    })

    const userExistsOnDatabase = await this.usersRepository.findByEmail(
      userData.email,
    )

    if (userExistsOnDatabase) {
      return left(new EmailAlreadyExistsError())
    }

    await this.usersRepository.create(user)

    return right({ user })
  }
}
