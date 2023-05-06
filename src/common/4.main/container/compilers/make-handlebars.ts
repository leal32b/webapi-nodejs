import { type TemplateCompiler } from '@/common/1.application/compilers/template-compiler'
import { HandlebarsAdapter } from '@/common/3.infra/compilers/handlebars/handlebars-adapter'

export const makeHandlebars: TemplateCompiler = HandlebarsAdapter.create()
