import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { User } from '@/domain/hygea/enterprise/entities/user'

export interface UsersRepository {
  create(user: User): Promise<void>
  findMany(params: PaginationParams): Promise<User[]>
  findById(userId: string): Promise<User | null>
  findByEmail(userEmail: string): Promise<User | null>
  delete(user: User): Promise<void>
}
