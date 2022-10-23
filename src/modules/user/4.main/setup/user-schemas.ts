import { signInRequestSchema, signInResponseSchema } from '@/user/3.infra/api/routes/sign-in/sign-in-schemas'
import { signUpRequestSchema, signUpResponseSchema } from '@/user/3.infra/api/routes/sign-up/sign-up-schemas'

export const userSchemas = {
  signUpRequestSchema,
  signUpResponseSchema,
  signInRequestSchema,
  signInResponseSchema
}
