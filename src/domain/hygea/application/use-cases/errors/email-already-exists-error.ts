import { UseCaseError } from "@/core/error/use-case-error";


export class EmailAlreadyExistsError extends UseCaseError {
  constructor() {
    super('E-mail already exists')
  }
}
