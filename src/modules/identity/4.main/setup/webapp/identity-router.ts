import { type WebApp } from '@/common/3.infra/webapp/web-app'
import { authMiddleware } from '@/common/4.main/setup/middlewares/auth-middleware'
import { schemaValidatorMiddleware } from '@/common/4.main/setup/middlewares/schema-validator-middleware'

import { changePasswordRoute } from '@/identity/2.presentation/routes/change-password/change-password-route'
import { confirmEmailRoute } from '@/identity/2.presentation/routes/confirm-email/confirm-email-route'
import { signInRoute } from '@/identity/2.presentation/routes/sign-in/sign-in-route'
import { signUpRoute } from '@/identity/2.presentation/routes/sign-up/sign-up-route'
import { changePasswordControllerFactory } from '@/identity/4.main/factories/change-password-controller-factory'
import { confirmEmailControllerFactory } from '@/identity/4.main/factories/confirm-email-controller-factory'
import { signInControllerFactory } from '@/identity/4.main/factories/sign-in-controller-factory'
import { signUpControllerFactory } from '@/identity/4.main/factories/sign-up-controller-factory'

export const identityRouter = (webApp: WebApp): void => {
  webApp.setRouter({
    middlewares: [schemaValidatorMiddleware, authMiddleware],
    path: '/identity',
    routes: [
      changePasswordRoute(changePasswordControllerFactory()),
      confirmEmailRoute(confirmEmailControllerFactory()),
      signInRoute(signInControllerFactory()),
      signUpRoute(signUpControllerFactory())
    ]
  })
}
