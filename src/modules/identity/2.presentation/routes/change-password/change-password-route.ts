import { type Route, RouteType } from '@/common/3.infra/webapp/web-app'

import { type ChangePasswordController } from '@/identity/2.presentation/controllers/change-password-controller'
import { changePasswordRequestSchema } from '@/identity/2.presentation/routes/change-password/change-password-schemas'

export const changePasswordRoute = (controller: ChangePasswordController): Route => ({
  auth: ['user'],
  controller,
  path: '/change-password',
  schema: changePasswordRequestSchema,
  type: RouteType.POST
})
