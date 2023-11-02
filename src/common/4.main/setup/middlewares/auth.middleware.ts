import { type Middleware } from '@/common/1.application/middleware/middleware'
import { AuthMiddleware } from '@/common/2.presentation/middlewares/auth.middleware'
import { cryptography } from '@/common/4.main/container'

export const authMiddleware: Middleware = AuthMiddleware.create({
  encrypter: cryptography.encrypter
})
