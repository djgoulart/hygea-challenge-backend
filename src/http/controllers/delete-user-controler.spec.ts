import request from 'supertest'
import { app } from '@/app'
import { PrismaUsersRepository } from '@/domain/hygea/application/repositories/prisma-users-repository'
import { makeUser } from 'test/factories/make-user'

describe('(e2e) Create User', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('(DELETE) /user/delete/:userId', async () => {
    const repository = new PrismaUsersRepository()

    await repository.create(makeUser({ email: 'user-about-to-be@deleted.com' }))
    const user = await repository.findByEmail('user-about-to-be@deleted.com')

    const response = await request(app.server)
      .delete(`/user/delete/${user?.id.toString()}`)
      .send()

    expect(response.statusCode).toBe(201)
  })

  it('(DELETE) /user/delete/:userId  should not be able to delete a non-existing user', async () => {
    const repository = new PrismaUsersRepository()
    await repository.create(makeUser())

    const response = await request(app.server)
      .delete(`/user/delete/non-existing-id`)
      .send()

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBeTruthy()
    expect(response.body.message).toBe('User not found')
  })
})
