import WebApp from '@/3.infra/api/app/web-app'
import signInRoute from '@/3.infra/api/routes/user/sign-in-route'
import signUpRoute from '@/3.infra/api/routes/user/sign-up-route'
import signInControllerFactory from '@/4.main/factories/user/sign-in-controller-factory'
import signUpControllerFactory from '@/4.main/factories/user/sign-up-controller-factory'

export default (webApp: WebApp): void => {
  webApp.setRouter({
    path: '/user',
    routes: [
      signUpRoute(signUpControllerFactory()),
      signInRoute(signInControllerFactory())
    ]
  })
}
