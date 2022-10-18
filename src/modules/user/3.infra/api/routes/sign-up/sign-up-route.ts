import { Route, RouteType } from '@/core/3.infra/api/app/web-app'
import { SignUpController } from '@/user/2.presentation/controllers/sign-up-controller'
import { signUpRequestSchema } from '@/user/3.infra/api/routes/sign-up/sign-up-schemas'

export const signUpRoute = (controller: SignUpController): Route => ({
  type: RouteType.POST,
  path: '/sign-up',
  schema: signUpRequestSchema,
  controller
})
