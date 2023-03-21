import { type Middleware } from '@/core/2.presentation/middleware/middleware'
import { AuthMiddleware } from '@/core/3.infra/api/middlewares/auth-middleware'
import { cryptography } from '@/core/4.main/container'

export const authMiddleware: Middleware = AuthMiddleware.create({
  encrypter: cryptography.encrypter
})
