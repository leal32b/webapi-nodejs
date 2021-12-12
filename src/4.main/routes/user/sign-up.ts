import { Application, Router } from 'express'

import adaptExpressRoute from '@/4.main/adapters/express-route'
import makeSignUpController from '@/4.main/factories/sign-up'

const signUp = (router: Router): void => {
  router.post(
    '/signup',
    adaptExpressRoute(makeSignUpController()) as Application
  )
}

export default signUp
