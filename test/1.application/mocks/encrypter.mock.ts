import { Encrypter } from '@/1.application/interfaces/encryter'
import faker from 'faker'

export class EncrypterStub implements Encrypter {
  async encrypt (value: string): Promise<string> {
    return await Promise.resolve(faker.random.alphaNumeric(32))
  }
}
