import { Route, RouteType } from '@/core/3.infra/api/app/web-app'
import { SignInController } from '@/user/2.presentation/controllers/sign-in-controller'
import { signInRequestSchema } from '@/user/3.infra/api/routes/sign-in/sign-in-schemas'

export const signInRoute = (controller: SignInController): Route => ({
  type: RouteType.POST,
  path: '/sign-in',
  schema: signInRequestSchema,
  controller
})
