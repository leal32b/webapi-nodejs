import { changePasswordPath } from '@/user/2.presentation/routes/change-password/change-password-path'
import { changePasswordRequestSchema, changePasswordResponseSchema } from '@/user/2.presentation/routes/change-password/change-password-schemas'
import { signInPath } from '@/user/2.presentation/routes/sign-in/sign-in-path'
import { signInRequestSchema, signInResponseSchema } from '@/user/2.presentation/routes/sign-in/sign-in-schemas'
import { signUpPath } from '@/user/2.presentation/routes/sign-up/sign-up-path'
import { signUpRequestSchema, signUpResponseSchema } from '@/user/2.presentation/routes/sign-up/sign-up-schemas'

export const userPaths = {
  '/user/sign-up': signUpPath,
  '/user/sign-in': signInPath,
  '/user/change-password': changePasswordPath
}

export const userSchemas = {
  changePasswordRequestSchema,
  changePasswordResponseSchema,
  signInRequestSchema,
  signInResponseSchema,
  signUpRequestSchema,
  signUpResponseSchema
}
