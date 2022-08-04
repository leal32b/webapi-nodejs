import { Route, RouteType } from '@/core/3.infra/api/app/web-app'
import { SignInController } from '@/modules/user/2.presentation/controllers/sign-in-controller'

export const signInRoute = (controller: SignInController): Route => ({
  type: RouteType.POST,
  path: '/sign-in',
  controller
})
