import { type TemplateCompiler } from '@/common/1.application/compilation/template-compiler'
import { HandlebarsAdapter } from '@/common/3.infra/compilation/handlebars/handlebars-adapter'

export const makeHandlebars: TemplateCompiler = HandlebarsAdapter.create()
