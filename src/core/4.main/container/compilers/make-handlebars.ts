import { type TemplateCompiler } from '@/core/1.application/compilers/template-compiler'
import { HandlebarsAdapter } from '@/core/3.infra/compilers/handlebars/handlebars-adapter'

export const makeHandlebars: TemplateCompiler = HandlebarsAdapter.create()
