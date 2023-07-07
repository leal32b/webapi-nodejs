import { type Route, RouteType } from '@/common/3.infra/webapp/web-app'

import { type SignUpController } from '@/identity/2.presentation/controllers/sign-up.controller'
import { signUpRequestSchema } from '@/identity/2.presentation/routes/sign-up/sign-up.schemas'

export const signUpRoute = (controller: SignUpController): Route => ({
  controller,
  path: '/user/sign-up',
  schema: signUpRequestSchema,
  type: RouteType.POST
})
