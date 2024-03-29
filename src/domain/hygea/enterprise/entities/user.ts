import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { UserOutputDTO } from '../../application/dtos/user-dto'

export interface UserProps {
  name: string
  email: string
  address: string
  birthDate: Date
  createdAt: Date
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
  }

  get address() {
    return this.props.address
  }

  set address(address: string) {
    this.props.address = address
  }

  get birthDate() {
    return this.props.birthDate
  }

  set birthDate(birthDate: Date) {
    this.props.birthDate = birthDate
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<UserProps, 'createdAt'>,
    id?: UniqueEntityId,
  ): UserOutputDTO {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return {
      id: user.id.toString(),
      name: user.props.name,
      email: user.props.email,
      address: user.props.address,
      birthDate: user.props.birthDate,
      createdAt: user.props.createdAt,
    }
  }
}
