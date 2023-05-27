import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either } from '@/common/0.domain/utils/either'

export interface TemplateCompiler {
  compile: (templateName: string, context?: Record<string, unknown>) => Either<DomainError, string>
  registerHelper: (name: string, fn: (...args: any) => string) => Either<DomainError, void>
}
