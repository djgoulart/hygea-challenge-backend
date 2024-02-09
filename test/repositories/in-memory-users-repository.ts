import { PaginationParams } from '@/core/repositories/pagination-params'
import { UsersRepository } from '@/domain/hygea/application/repositories/users-repository'
import { User } from '@/domain/hygea/enterprise/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
  users: User[] = []

  async findMany({ page }: PaginationParams) {
    const users = this.users
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return users
  }

  async create(user: User): Promise<void> {
    this.users.push(user)
  }

  async findById(userId: string) {
    const user = this.users.find(({ id }) => id.toString() === userId)

    return user || null
  }

  async findByEmail(userEmail: string) {
    const user = this.users.find(({ email }) => email === userEmail)

    return user || null
  }

  async delete(user: User) {
    const itemIndex = this.users.findIndex(({ id }) => id === user.id)

    this.users.splice(itemIndex, 1)
  }
}
