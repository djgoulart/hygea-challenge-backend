import request from 'supertest'
import { app } from '@/app'
import { PrismaUsersRepository } from '@/domain/hygea/application/repositories/prisma-users-repository'
import { makeUser } from 'test/factories/make-user'

describe('(e2e) Fetch Users', () => {
  beforeAll(async () => {
    await app.ready()

    const repository = new PrismaUsersRepository()

    for (let i = 1; i < 22; i++) {
      await repository.create(makeUser())
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it('(GET) /users should be able to list without pagination params', async () => {
    const response = await request(app.server).get('/users').send()

    expect(response.statusCode).toBe(200)
    expect(response.body.users).toBeTruthy()
    expect(response.body.users).toHaveLength(20)
  })

  it('(GET) /users should be able to list with pagination params', async () => {
    const response = await request(app.server).get('/users?page=1').send()

    expect(response.statusCode).toBe(200)
    expect(response.body.users).toBeTruthy()
    expect(response.body.users).toHaveLength(20)
  })

  it('(GET) /users should be able to paginate', async () => {
    const response = await request(app.server).get('/users?page=2').send()

    expect(response.statusCode).toBe(200)
    expect(response.body.users).toBeTruthy()
    expect(response.body.users).toHaveLength(1)
  })

  it('(GET) /users should be able to list when no register is found', async () => {
    const response = await request(app.server).get('/users?page=3').send()

    expect(response.statusCode).toBe(200)
    expect(response.body.users).toBeTruthy()
    expect(response.body.users).toHaveLength(0)
  })
})
