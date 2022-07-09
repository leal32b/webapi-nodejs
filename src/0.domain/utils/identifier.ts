import Random from '@/0.domain/utils/random'

export default class Identifier {
  private readonly alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  private readonly length = 24
  readonly value: string

  constructor (id?: string) {
    this.value = id || this.create()
  }

  private create (): string {
    const random = new Random()
    let idToReturn = ''

    for (let i = 0; i < this.length; i++) {
      idToReturn += this.alphabet[random.nextInt() % this.alphabet.length]
    }

    return idToReturn
  }
}
