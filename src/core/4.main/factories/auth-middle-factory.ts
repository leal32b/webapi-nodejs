import { Middleware } from '@/core/2.presentation/middleware/middleware'
import { AuthMiddleware } from '@/core/3.infra/api/middlewares/auth-middleware'
import { config } from '@/core/4.main/config/config'

export const authMiddlewareFactory = (): Middleware => {
  return new AuthMiddleware({
    encrypter: config.cryptography.encrypter
  })
}