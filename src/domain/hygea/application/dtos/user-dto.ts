import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export type UserOutputDTO = {
  id: string
  name: string
  email: string
  address: string
  birthDate: Date
  createdAt: Date
}

export type UserInputDTO = {
  id?: UniqueEntityId
  name: string
  email: string
  address: string
  birthDate: Date
  createdAt?: Date
}
