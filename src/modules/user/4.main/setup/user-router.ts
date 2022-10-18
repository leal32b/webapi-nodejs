import { WebApp } from '@/core/3.infra/api/app/web-app'
import { authMiddlewareFactory } from '@/core/4.main/setup/middlewares/auth-middle-factory'
import { schemaValidatorMiddlewareFactory } from '@/core/4.main/setup/middlewares/schema-validator-middleware-factory'
import { changePasswordRoute } from '@/user/3.infra/api/routes/change-password/change-password-route'
import { signInRoute } from '@/user/3.infra/api/routes/sign-in/sign-in-route'
import { signUpRoute } from '@/user/3.infra/api/routes/sign-up/sign-up-route'
import { changePasswordControllerFactory } from '@/user/4.main/factories/change-password-controller-factory'
import { signInControllerFactory } from '@/user/4.main/factories/sign-in-controller-factory'
import { signUpControllerFactory } from '@/user/4.main/factories/sign-up-controller-factory'

export const userRouter = (webApp: WebApp): void => {
  webApp.setRouter({
    path: '/user',
    routes: [
      signUpRoute(signUpControllerFactory()),
      signInRoute(signInControllerFactory()),
      changePasswordRoute(changePasswordControllerFactory())
    ],
    middlewares: [schemaValidatorMiddlewareFactory(), authMiddlewareFactory()]
  })
}
