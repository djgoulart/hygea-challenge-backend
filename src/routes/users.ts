import { createUser } from '@/http/controllers/create-user-controller'
import { deleteUser } from '@/http/controllers/delete-user-controller'
import { fetchUsers } from '@/http/controllers/fetch-users-controller'

export async function usersRoutes(app) {
  app.get('/users', fetchUsers)
  app.post('/users', createUser)
  app.delete('/user/:userId', deleteUser)
}
