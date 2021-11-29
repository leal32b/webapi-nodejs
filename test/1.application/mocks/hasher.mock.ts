import faker from 'faker'

import { Hasher } from '@/1.application/interfaces/hasher'

export class HasherStub implements Hasher {
  async hash (value: string): Promise<string> {
    return await Promise.resolve(faker.random.alphaNumeric(32))
  }
}
