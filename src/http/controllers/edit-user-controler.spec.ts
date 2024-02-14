import request from 'supertest'
import { app } from '@/app'
import { PrismaUsersRepository } from '@/domain/hygea/application/repositories/prisma-users-repository'
import { makeUser } from 'test/factories/make-user'

describe('(e2e) Edit User', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('(PUT) /user/:userId/edit', async () => {
    const repository = new PrismaUsersRepository()
    await repository.create(makeUser({ email: 'user@edit.com' }))
    await repository.create(makeUser({ email: 'user2@edit.com' }))
    const user = await repository.findByEmail('user@edit.com')

    const response = await request(app.server)
      .put(`/user/${user?.id.toString()}/edit`)
      .send({
        data: {
          name: 'Name edited',
          email: 'email@edited.com',
          address: 'An awesome place, 100, NY, USA',
          birthDate: user?.birthDate,
        },
      })

    const userEdited = await repository.findById(user!.id.toString())

    expect(response.statusCode).toBe(201)
    expect(userEdited!.name).toBe('Name edited')
    expect(userEdited!.email).toBe('email@edited.com')
    expect(userEdited!.address).toBe('An awesome place, 100, NY, USA')
  })
})
