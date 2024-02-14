import { PaginationParams } from '@/core/repositories/pagination-params'
import { User } from '@/domain/hygea/enterprise/entities/user'
import { UserInputDTO, UserDTO } from '../dtos/user-dto'

export interface UsersRepository {
  create(user: User): Promise<UserDTO>
  save(user: User): Promise<void>
  findMany(params: PaginationParams): Promise<UserDTO[]>
  findById(userId: string): Promise<UserDTO | null>
  findByEmail(userEmail: string): Promise<UserDTO | null>
  delete(user: User): Promise<void>
}
