import fs from 'fs'

import Handlebars from 'handlebars'

import { type DomainError } from '@/core/0.domain/base/domain-error'
import { left, right, type Either } from '@/core/0.domain/utils/either'
import { type TemplateCompiler } from '@/core/1.application/compilers/template-compiler'
import { ServerError } from '@/core/2.presentation/errors/server-error'

export class HandlebarsAdapter implements TemplateCompiler {
  private constructor () {}

  public static create (): HandlebarsAdapter {
    return new HandlebarsAdapter()
  }

  public compile (templatePath: string, context?: Record<string, unknown>): Either<DomainError, string> {
    try {
      const source = fs.readFileSync(`${templatePath}.hbs`, 'utf8')

      if (!source) {
        return left(ServerError.create('file not found'))
      }

      const template = Handlebars.compile(source)

      return right(template(context))
    } catch (error) {
      return left(ServerError.create(error.message, error.stack))
    }
  }

  public registerHelper (name: string, fn: (...args: any) => string): Either<DomainError, void> {
    try {
      Handlebars.registerHelper(name, fn)

      return right()
    } catch (error) {
      return left(ServerError.create(error.message, error.stack))
    }
  }
}
