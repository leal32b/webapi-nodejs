import { type Route, RouteType } from '@/common/3.infra/webapp/web-app'

import { type SignInController } from '@/identity/2.presentation/controllers/sign-in-controller'
import { signInRequestSchema } from '@/identity/2.presentation/routes/sign-in/sign-in-schemas'

export const signInRoute = (controller: SignInController): Route => ({
  controller,
  path: '/sign-in',
  schema: signInRequestSchema,
  type: RouteType.POST
})
