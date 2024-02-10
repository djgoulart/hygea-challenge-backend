import request from 'supertest'
import { app } from '@/app'

describe('[e2e] Create User Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('(POST) /users', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'user@test.com',
      address: 'Test Avenue, 234, Tampa, FL, US',
      birthDate: '1988-01-20',
    })

    expect(response.statusCode).toBe(201)
  })
})
