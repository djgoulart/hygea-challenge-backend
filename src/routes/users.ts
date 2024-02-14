import { createUser } from '@/http/controllers/create-user-controller'
import { deleteUser } from '@/http/controllers/delete-user-controller'
import { editUser } from '@/http/controllers/edit-user-controller'
import { fetchUsers } from '@/http/controllers/fetch-users-controller'
import { getUser } from '@/http/controllers/get-user-controller'
import { FastifyInstance } from 'fastify'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/user/:userId', getUser)
  app.get('/user/list', fetchUsers)
  app.post('/user/create', createUser)
  app.delete('/user/delete/:userId', deleteUser)
  app.put('/user/:userId/edit', editUser)
}
