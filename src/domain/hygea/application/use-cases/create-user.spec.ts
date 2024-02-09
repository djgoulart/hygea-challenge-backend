import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'
import { User } from '@/domain/hygea/enterprise/entities/user'
import { makeUser } from 'test/factories/make-user'
import { InvalidDataError } from './errors/invalid-data-error'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: CreateUserUseCase

describe('Create user', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateUserUseCase(usersRepository)
  })

  it('should be able to create a user', async () => {
    const data = {
      name: 'John Doe',
      email: 'user@test.com',
      address: 'Test Avenue, 234, Tampa, FL, US',
      birthDate: new Date(),
    }

    const result = await sut.execute(data)

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.user).toBeTruthy()
      expect(result.value.user).toBeInstanceOf(User)
    }

    expect(result.isLeft()).toBe(false)
    expect(usersRepository.users).toHaveLength(1)
    expect(usersRepository.users[0]).toMatchObject({
      name: 'John Doe',
      email: 'user@test.com',
      address: 'Test Avenue, 234, Tampa, FL, US',
    })
  })

  it('should not be able to create a user with a duplicated email', async () => {
    await usersRepository.create(makeUser({ email: 'unique@email.com' }))

    const data = {
      name: 'John Doe',
      email: 'unique@email.com',
      address: 'Test Avenue, 234, Tampa, FL, US',
      birthDate: new Date(),
    }

    const result = await sut.execute(data)

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(EmailAlreadyExistsError)
    }

    expect(result.isRight()).toBe(false)
    expect(usersRepository.users).toHaveLength(1)
  })
})
