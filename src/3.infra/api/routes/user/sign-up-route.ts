import SignUpController from '@/2.presentation/controllers/sign-up-controller'
import { Route, RouteType } from '@/3.infra/api/app/web-app'

export default (controller: SignUpController): Route => ({
  type: RouteType.POST,
  path: '/sign-up',
  controller
})
