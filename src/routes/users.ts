import { createUser } from '@/http/controllers/create-user-controller'

export async function usersRoutes(app) {
  app.post('/users', createUser)
}
