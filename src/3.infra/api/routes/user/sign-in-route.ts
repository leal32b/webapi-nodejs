import { SignInController } from '@/2.presentation/controllers/sign-in-controller'
import { Route, RouteType } from '@/3.infra/api/app/web-app'

export const signInRoute = (controller: SignInController): Route => ({
  type: RouteType.POST,
  path: '/sign-in',
  controller
})
