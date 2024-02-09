import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FetchUsersUseCase } from './fetch-users'
import { makeUser } from 'test/factories/make-user'

let usersRepository: InMemoryUsersRepository
let sut: FetchUsersUseCase

describe('Fetch users', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUsersUseCase(usersRepository)
  })

  it('should be able to fetch users', async () => {
    await usersRepository.create(makeUser({ createdAt: new Date(2024, 0, 10) }))
    await usersRepository.create(makeUser({ createdAt: new Date(2024, 0, 13) }))
    await usersRepository.create(makeUser({ createdAt: new Date(2024, 0, 21) }))

    const result = await sut.execute({ page: 1 })

    if (result.isRight()) {
      expect(result.value.users).toHaveLength(3)
      expect(result.value.users).toEqual([
        expect.objectContaining({ createdAt: new Date(2024, 0, 21) }),
        expect.objectContaining({ createdAt: new Date(2024, 0, 13) }),
        expect.objectContaining({ createdAt: new Date(2024, 0, 10) }),
      ])
    }

    expect(result.isLeft()).toBe(false)
    expect(usersRepository.users).toHaveLength(3)
  })

  it('should be able to fetch paginated users', async () => {
    for (let i = 1; i < 22; i++) {
      await usersRepository.create(makeUser())
    }

    const page1 = await sut.execute({ page: 1 })
    const page2 = await sut.execute({ page: 2 })

    if (page1.isRight()) {
      expect(page1.value.users).toHaveLength(20)
    }

    if (page2.isRight()) {
      expect(page2.value.users).toHaveLength(1)
    }

    expect(page1.isLeft()).toBe(false)
    expect(page2.isLeft()).toBe(false)

    expect(usersRepository.users).toHaveLength(21)
  })
})
