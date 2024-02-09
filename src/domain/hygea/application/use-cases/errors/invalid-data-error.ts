import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidDataError extends Error implements UseCaseError {
  constructor(message: string) {
    super(message || 'Invalid data')
  }
}
