import { type SchemaValidator } from '@/core/2.presentation/validators/schema-validator'
import { AjvAdapter } from '@/core/3.infra/validators/ajv/ajv-adapter'

export const makeAjv: SchemaValidator = AjvAdapter.create()
