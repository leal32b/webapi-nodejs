import { Route, RouteType } from '@/core/3.infra/api/app/web-app'
import { ChangePasswordController } from '@/user/2.presentation/controllers/change-password-controller'

const schema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    password: { type: 'string' },
    passwordRetype: { type: 'string' }
  },
  required: ['id', 'password', 'passwordRetype'],
  additionalProperties: false
}

export const changePasswordRoute = (controller: ChangePasswordController): Route => ({
  type: RouteType.POST,
  path: '/change-password',
  schema,
  controller,
  auth: ['user']
})
