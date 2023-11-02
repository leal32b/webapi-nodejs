import { type Route, RouteType } from '@/common/3.infra/webapp/web-app'

import { type CreateGroupController } from '@/identity/2.presentation/controllers/create-group.controller'
import { createGroupRequestSchema } from '@/identity/2.presentation/routes/group/create-group/create-group.schemas'

export const createGroupRoute = (controller: CreateGroupController): Route => ({
  controller,
  path: '/group',
  schema: createGroupRequestSchema,
  type: RouteType.POST
})
