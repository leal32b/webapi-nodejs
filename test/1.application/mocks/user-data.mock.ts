import { CreateUserModel } from '@/0.domain/interfaces/create-user'
import faker from 'faker'

export const mockUserData = (): CreateUserModel => ({
  name: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})
