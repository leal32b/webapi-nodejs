import { type WebApp } from '@/common/3.infra/webapp/web-app'
import { authMiddleware } from '@/common/4.main/setup/middlewares/auth-middleware'
import { schemaValidatorMiddleware } from '@/common/4.main/setup/middlewares/schema-validator-middleware'

import { changePasswordRoute } from '@/user/2.presentation/routes/change-password/change-password-route'
import { signInRoute } from '@/user/2.presentation/routes/sign-in/sign-in-route'
import { signUpRoute } from '@/user/2.presentation/routes/sign-up/sign-up-route'
import { changePasswordControllerFactory } from '@/user/4.main/factories/change-password-controller-factory'
import { signInControllerFactory } from '@/user/4.main/factories/sign-in-controller-factory'
import { signUpControllerFactory } from '@/user/4.main/factories/sign-up-controller-factory'

export const userRouter = (webApp: WebApp): void => {
  webApp.setRouter({
    middlewares: [schemaValidatorMiddleware, authMiddleware],
    path: '/user',
    routes: [
      signUpRoute(signUpControllerFactory()),
      signInRoute(signInControllerFactory()),
      changePasswordRoute(changePasswordControllerFactory())
    ]
  })
}
