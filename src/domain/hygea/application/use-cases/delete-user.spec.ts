import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { User } from '@/domain/hygea/enterprise/entities/user'
import { DeleteUserUseCase } from './delete-user'
import { makeUser } from 'test/factories/make-user'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: DeleteUserUseCase

describe('Delete user', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteUserUseCase(usersRepository)
  })

  it('should be able to delete a user', async () => {
    await usersRepository.create(makeUser({}, new UniqueEntityId('user-1')))
    await usersRepository.create(makeUser())

    const result = await sut.execute({ id: 'user-1' })

    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)
    expect(usersRepository.users).toHaveLength(1)
  })

  it('should not be able to delete a non-existent user', async () => {
    await usersRepository.create(makeUser())
    await usersRepository.create(makeUser())

    const result = await sut.execute({ id: 'non-existent-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)

    expect(usersRepository.users).toHaveLength(2)
  })
})
