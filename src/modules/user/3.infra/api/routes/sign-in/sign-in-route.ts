import { Route, RouteType } from '@/core/3.infra/api/app/web-app'
import { SignInController } from '@/user/2.presentation/controllers/sign-in-controller'

const schema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['email', 'password'],
  additionalProperties: false
}

export const signInRoute = (controller: SignInController): Route => ({
  type: RouteType.POST,
  path: '/sign-in',
  schema,
  controller
})
