import bcrypt from 'bcrypt'

import Hasher from '@/1.application/interfaces/hasher'

export default class BcryptAdapter implements Hasher {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)

    return hash
  }
}
