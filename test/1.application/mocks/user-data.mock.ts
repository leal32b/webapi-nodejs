import faker from 'faker'

import { UserData } from '@/0.domain/types/user'

export const mockUserData = (): UserData => ({
  name: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})
