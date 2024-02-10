import { UseCaseError } from "@/core/error/use-case-error";

export class ResourceNotFoundError extends UseCaseError {
  constructor(message: string) {
    super(message || 'Resource not found')
  }
}
