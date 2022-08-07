import { Middleware } from '@/core/2.presentation/middleware/middleware'
import { Route, RouteType } from '@/core/3.infra/api/app/web-app'
import { ChangePasswordController } from '@/modules/user/2.presentation/controllers/change-password-controller'

export const changePasswordRoute = (controller: ChangePasswordController, auth: Middleware): Route => ({
  type: RouteType.POST,
  path: '/change-password',
  auth,
  controller
})
