import { changePasswordPath } from '@/identity/2.presentation/routes/change-password/change-password.path'
import { changePasswordRequestSchema, changePasswordResponseSchema } from '@/identity/2.presentation/routes/change-password/change-password.schemas'
import { confirmEmailPath } from '@/identity/2.presentation/routes/confirm-email/confirm-email.path'
import { confirmEmailRequestSchema, confirmEmailResponseSchema } from '@/identity/2.presentation/routes/confirm-email/confirm-email.schemas'
import { createGroupPath } from '@/identity/2.presentation/routes/group/create-group/create-group.path'
import { createGroupRequestSchema, createGroupResponseSchema } from '@/identity/2.presentation/routes/group/create-group/create-group.schemas'
import { signInPath } from '@/identity/2.presentation/routes/sign-in/sign-in.path'
import { signInRequestSchema, signInResponseSchema } from '@/identity/2.presentation/routes/sign-in/sign-in.schemas'
import { signUpPath } from '@/identity/2.presentation/routes/sign-up/sign-up.path'
import { signUpRequestSchema, signUpResponseSchema } from '@/identity/2.presentation/routes/sign-up/sign-up.schemas'

export const identityPaths = {
  '/identity/group': createGroupPath,
  '/identity/user/change-password': changePasswordPath,
  '/identity/user/confirm-email/{token}': confirmEmailPath,
  '/identity/user/sign-in': signInPath,
  '/identity/user/sign-up': signUpPath
}

export const identitySchemas = {
  changePasswordRequestSchema,
  changePasswordResponseSchema,
  confirmEmailRequestSchema,
  confirmEmailResponseSchema,
  createGroupRequestSchema,
  createGroupResponseSchema,
  signInRequestSchema,
  signInResponseSchema,
  signUpRequestSchema,
  signUpResponseSchema
}
