import { Encrypter } from '@/1.application/cryptography/encrypter'
import { Hasher } from '@/1.application/cryptography/hasher'
import { UserRepository } from '@/1.application/repositories/user-repository'
import { WebApp } from '@/3.infra/api/app/web-app'
import { ArgonAdapter } from '@/3.infra/cryptography/argon/argon-adapter'
import { JsonwebtokenAdapter } from '@/3.infra/cryptography/jsonwebtoken/jsonwebtoken-adapter'
import { PgUserRepository } from '@/3.infra/persistence/postgres/repositories/pg-user-repository'
import { ExpressAdapter } from '@/3.infra/webapp/express/express-adapter'

type Cryptography = {
  encrypter: Encrypter
  hasher: Hasher
}

type Persistence = {
  userRepository: UserRepository
}

type App = {
  webApp: WebApp
}

type Config = {
  cryptography: Cryptography
  persistence: Persistence
  app: App
}

export const config: Config = {
  cryptography: {
    encrypter: new JsonwebtokenAdapter(),
    hasher: new ArgonAdapter({ salt: 12 })
  },
  persistence: {
    userRepository: new PgUserRepository()
  },
  app: {
    webApp: new ExpressAdapter()
  }
}
