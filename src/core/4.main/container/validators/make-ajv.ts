import { SchemaValidator } from '@/core/3.infra/api/validators/schema-validator'
import { AjvAdapter } from '@/core/3.infra/validators/ajv/ajv-adapter'

export const makeAjv: SchemaValidator = new AjvAdapter()
