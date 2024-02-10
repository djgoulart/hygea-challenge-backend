import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { EditUserUseCase } from './edit-user'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: EditUserUseCase

describe('Edit user', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new EditUserUseCase(usersRepository)
  })

  it('should be able to edit a user', async () => {
    await usersRepository.create(
      makeUser({ email: 'user-1@email.com' }, new UniqueEntityId('user-1')),
    )

    const result = await sut.execute('user-1', {
      name: 'User 1 Edited',
      email: 'user-1-edited@email.com',
      address: '5th avenue, 456, NY',
      birthDate: new Date(1988, 12, 14),
    })

    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)
    expect(usersRepository.users[0]).toMatchObject({
      name: 'User 1 Edited',
      email: 'user-1-edited@email.com',
      address: '5th avenue, 456, NY',
      birthDate: new Date(1988, 12, 14),
    })
  })

  it('should not be able to edit a non-existent user', async () => {
    await usersRepository.create(makeUser())
    await usersRepository.create(makeUser())

    const result = await sut.execute('non-existent-id', {
      name: 'User 1 Edited',
      email: 'user-1-edited@email.com',
      address: '5th avenue, 456, NY',
      birthDate: new Date(1988, 12, 14),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit  using a duplicated email', async () => {
    const userToBeEdited = makeUser(
      { email: 'user-1@email.com' },
      new UniqueEntityId('user-1'),
    )
    await usersRepository.create(userToBeEdited)

    const userWithUniqueEmail = makeUser({ email: 'unique@email.com' })
    await usersRepository.create(userWithUniqueEmail)

    const result = await sut.execute('user-1', {
      name: 'User 1 Edited',
      email: 'unique@email.com',
      address: '5th avenue, 456, NY',
      birthDate: new Date(1988, 12, 14),
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(EmailAlreadyExistsError)
    }

    expect(result.isRight()).toBe(false)
    expect(usersRepository.users[0]).toMatchObject({
      email: 'user-1@email.com',
    })
  })
})
