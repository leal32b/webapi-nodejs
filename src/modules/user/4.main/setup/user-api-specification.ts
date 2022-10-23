import { signInPath } from '@/user/3.infra/api/routes/sign-in/sign-in-path'
import { signInRequestSchema, signInResponseSchema } from '@/user/3.infra/api/routes/sign-in/sign-in-schemas'
import { signUpPath } from '@/user/3.infra/api/routes/sign-up/sign-up-path'
import { signUpRequestSchema, signUpResponseSchema } from '@/user/3.infra/api/routes/sign-up/sign-up-schemas'

export const userPaths = {
  '/user/sign-up': signUpPath,
  '/user/sign-in': signInPath
}

export const userSchemas = {
  signInRequestSchema,
  signInResponseSchema,
  signUpRequestSchema,
  signUpResponseSchema
}
