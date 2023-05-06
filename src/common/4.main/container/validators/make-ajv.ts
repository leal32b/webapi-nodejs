import { type SchemaValidator } from '@/common/2.presentation/validators/schema-validator'
import { AjvAdapter } from '@/common/3.infra/validators/ajv/ajv-adapter'

export const makeAjv: SchemaValidator = AjvAdapter.create()
