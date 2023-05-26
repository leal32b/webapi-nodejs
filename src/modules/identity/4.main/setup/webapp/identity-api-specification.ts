import { changePasswordPath } from '@/identity/2.presentation/routes/change-password/change-password-path'
import { changePasswordRequestSchema, changePasswordResponseSchema } from '@/identity/2.presentation/routes/change-password/change-password-schemas'
import { signInPath } from '@/identity/2.presentation/routes/sign-in/sign-in-path'
import { signInRequestSchema, signInResponseSchema } from '@/identity/2.presentation/routes/sign-in/sign-in-schemas'
import { signUpPath } from '@/identity/2.presentation/routes/sign-up/sign-up-path'
import { signUpRequestSchema, signUpResponseSchema } from '@/identity/2.presentation/routes/sign-up/sign-up-schemas'

export const identityPaths = {
  '/identity/sign-up': signUpPath,
  '/identity/sign-in': signInPath,
  '/identity/change-password': changePasswordPath
}

export const identitySchemas = {
  changePasswordRequestSchema,
  changePasswordResponseSchema,
  signInRequestSchema,
  signInResponseSchema,
  signUpRequestSchema,
  signUpResponseSchema
}
