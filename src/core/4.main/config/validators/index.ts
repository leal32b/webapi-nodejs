import { SchemaValidator } from '@/core/3.infra/api/validators/schema-validator'
import { makeAjv } from '@/core/4.main/config/validators/make-ajv'

type Validators = {
  schemaValidator: SchemaValidator
}

export const validators: Validators = {
  schemaValidator: makeAjv
}
