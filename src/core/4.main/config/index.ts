import 'dotenv/config'

import { apiSpecification } from '@/core/4.main/config/api-specification'
import { app } from '@/core/4.main/config/app'
import { cryptography } from '@/core/4.main/config/cryptography'
import { persistence } from '@/core/4.main/config/persistence'
import { validators } from '@/core/4.main/config/validators'

export const config = {
  apiSpecification,
  app,
  cryptography,
  persistence,
  validators
}
