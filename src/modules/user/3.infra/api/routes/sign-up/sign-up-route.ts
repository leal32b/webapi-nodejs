import { Route, RouteType } from '@/core/3.infra/api/app/web-app'
import { SignUpController } from '@/user/2.presentation/controllers/sign-up-controller'
import { signUpRequestSchema } from '@/user/3.infra/api/routes/sign-up/sign-up-schemas'

export const signUpRoute = (controller: SignUpController): Route => ({
  controller,
  path: '/sign-up',
  schema: signUpRequestSchema,
  type: RouteType.POST
})
