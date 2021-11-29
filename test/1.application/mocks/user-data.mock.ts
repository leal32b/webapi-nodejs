import faker from 'faker'

import { CreateUserModel } from '@/0.domain/interfaces/create-user'

export const mockUserData = (): CreateUserModel => ({
  name: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})
