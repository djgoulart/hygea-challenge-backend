import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { UsersRepository } from '@/domain/hygea/application/repositories/users-repository'
import { User } from '@/domain/hygea/enterprise/entities/user'
import { prisma } from '@/lib/prisma'
import { UserDTO } from '../dtos/user-dto'

export class PrismaUsersRepository implements UsersRepository {
  async findMany({ page }: PaginationParams) {
    const usersOnDatabase = await prisma.user.findMany({
      skip: (page - 1) * 20,
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const users = usersOnDatabase.map((user) => {
      return User.create(user, new UniqueEntityId(user.id))
    })

    return users
  }

  async create(user: User): Promise<UserDTO> {
    const result = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        address: user.address,
        birthDate: user.birthDate,
      },
    })

    return result
  }

  async save(user: User): Promise<void> {
    await prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data: {
        name: user.name,
        email: user.email,
        address: user.address,
        birthDate: user.birthDate,
      },
    })
  }

  async findById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (user) {
      return User.create(user, new UniqueEntityId(user.id))
    }

    return null
  }

  async findByEmail(userEmail: string) {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    })

    if (user) {
      return User.create(user, new UniqueEntityId(user.id))
    }

    return null
  }

  async delete(user: User) {
    await prisma.user.delete({
      where: {
        id: user.id.toString(),
      },
    })
  }
}
