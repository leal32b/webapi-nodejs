import { type SchemaValidator } from '@/common/2.presentation/validation/schema-validator'
import { AjvAdapter } from '@/common/3.infra/validation/ajv/ajv-adapter'

export const makeAjv: SchemaValidator = AjvAdapter.create()
