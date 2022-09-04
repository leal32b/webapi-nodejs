import { Route, RouteType } from '@/core/3.infra/api/app/web-app'
import { SignUpController } from '@/user/2.presentation/controllers/sign-up-controller'

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    passwordRetype: { type: 'string' }
  },
  required: ['name', 'email', 'password', 'passwordRetype'],
  additionalProperties: false
}

export const signUpRoute = (controller: SignUpController): Route => ({
  type: RouteType.POST,
  path: '/sign-up',
  schema,
  controller
})
