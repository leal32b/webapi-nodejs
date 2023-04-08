import { type WebApp } from '@/core/3.infra/webapp/web-app'
import { userRouter } from '@/user/4.main/setup/webapp/user-router'

export const setRouters = (webApp: WebApp): void => {
  userRouter(webApp)
}
