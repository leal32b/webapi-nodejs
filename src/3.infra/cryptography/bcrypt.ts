import { Encrypter } from '@/1.application/interfaces/encryter'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {
  constructor (private readonly salt: number) {}

  async encrypt (value: string): Promise<string> {
    await bcrypt.hash(value, this.salt)

    return null
  }
}
