import { type Middleware } from '@/core/1.application/middleware/middleware'
import { AuthMiddleware } from '@/core/2.presentation/middlewares/auth-middleware'
import { cryptography } from '@/core/4.main/container'

export const authMiddleware: Middleware = AuthMiddleware.create({
  encrypter: cryptography.encrypter
})
