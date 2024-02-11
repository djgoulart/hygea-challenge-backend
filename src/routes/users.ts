import { createUser } from '@/http/controllers/create-user-controller'
import { deleteUser } from '@/http/controllers/delete-user-controller'
import { editUser } from '@/http/controllers/edit-user-controller'
import { fetchUsers } from '@/http/controllers/fetch-users-controller'
import { FastifyInstance } from 'fastify'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/users', fetchUsers)
  app.post('/users', createUser)
  app.delete('/user/:userId', deleteUser)
  app.put('/user/:userId', editUser)
}
