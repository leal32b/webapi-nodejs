import { Route, RouteType } from '@/core/3.infra/api/app/web-app'
import { SignUpController } from '@/user/2.presentation/controllers/sign-up-controller'

export const signUpRoute = (controller: SignUpController): Route => ({
  type: RouteType.POST,
  path: '/sign-up',
  controller
})
