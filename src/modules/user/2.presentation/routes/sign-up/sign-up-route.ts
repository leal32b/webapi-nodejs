import { type Route, RouteType } from '@/core/3.infra/webapp/web-app'
import { type SignUpController } from '@/user/2.presentation/controllers/sign-up-controller'
import { signUpRequestSchema } from '@/user/2.presentation/routes/sign-up/sign-up-schemas'

export const signUpRoute = (controller: SignUpController): Route => ({
  controller,
  path: '/sign-up',
  schema: signUpRequestSchema,
  type: RouteType.POST
})
