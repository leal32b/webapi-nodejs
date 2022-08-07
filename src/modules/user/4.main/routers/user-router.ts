import { WebApp } from '@/core/3.infra/api/app/web-app'
import { authMiddlewareFactory } from '@/core/4.main/factories/auth-middle-factory'
import { changePasswordRoute } from '@/modules/user/3.infra/api/routes/change-password-route'
import { signInRoute } from '@/modules/user/3.infra/api/routes/sign-in-route'
import { signUpRoute } from '@/modules/user/3.infra/api/routes/sign-up-route'
import { changePasswordControllerFactory } from '@/modules/user/4.main/factories/change-password-controller-factory'
import { signInControllerFactory } from '@/modules/user/4.main/factories/sign-in-controller-factory'
import { signUpControllerFactory } from '@/modules/user/4.main/factories/sign-up-controller-factory'

export default (webApp: WebApp): void => {
  webApp.setRouter({
    path: '/user',
    routes: [
      signUpRoute(signUpControllerFactory()),
      signInRoute(signInControllerFactory()),
      changePasswordRoute(changePasswordControllerFactory(), authMiddlewareFactory())
    ]
  })
}
