import { Route, RouteType } from '@/core/3.infra/api/app/web-app'
import { ChangePasswordController } from '@/user/2.presentation/controllers/change-password-controller'
import { changePasswordRequestSchema } from '@/user/3.infra/api/routes/change-password/change-password-schemas'

export const changePasswordRoute = (controller: ChangePasswordController): Route => ({
  auth: ['user'],
  controller,
  path: '/change-password',
  schema: changePasswordRequestSchema,
  type: RouteType.POST
})
