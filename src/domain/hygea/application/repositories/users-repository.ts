import { PaginationParams } from '@/core/repositories/pagination-params'
import { User } from '@/domain/hygea/enterprise/entities/user'
import { UserOutputDTO } from '../dtos/user-dto'

export interface UsersRepository {
  create(user: User): Promise<void>
  save(user: User): Promise<void>
  findMany(params: PaginationParams): Promise<UserOutputDTO[]>
  findById(userId: string): Promise<UserOutputDTO | null>
  findByEmail(userEmail: string): Promise<UserOutputDTO | null>
  delete(user: User): Promise<void>
}
