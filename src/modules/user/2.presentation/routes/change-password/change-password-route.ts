import { type Route, RouteType } from '@/core/3.infra/webapp/web-app'
import { type ChangePasswordController } from '@/user/2.presentation/controllers/change-password-controller'
import { changePasswordRequestSchema } from '@/user/2.presentation/routes/change-password/change-password-schemas'

export const changePasswordRoute = (controller: ChangePasswordController): Route => ({
  auth: ['user'],
  controller,
  path: '/change-password',
  schema: changePasswordRequestSchema,
  type: RouteType.POST
})