import { type Route, RouteType } from '@/common/3.infra/webapp/web-app'

import { type ConfirmEmailController } from '@/identity/2.presentation/controllers/confirm-email-controller'
import { confirmEmailRequestSchema } from '@/identity/2.presentation/routes/confirm-email/confirm-email-schemas'

export const confirmEmailRoute = (controller: ConfirmEmailController): Route => ({
  controller,
  path: '/user/confirm-email/:token',
  schema: confirmEmailRequestSchema,
  type: RouteType.PATCH
})
