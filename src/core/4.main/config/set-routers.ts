import { WebApp } from '@/core/3.infra/api/app/web-app'
import { userRouter } from '@/user/4.main/routers/user-router'

export const setRouters = (webApp: WebApp): void => {
  userRouter(webApp)
}
