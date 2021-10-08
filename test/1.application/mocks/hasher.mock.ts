import { Hasher } from '@/1.application/interfaces/hasher'
import faker from 'faker'

export class HasherStub implements Hasher {
  async hash (value: string): Promise<string> {
    return await Promise.resolve(faker.random.alphaNumeric(32))
  }
}
