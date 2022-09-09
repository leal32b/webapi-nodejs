import { Random } from '@/core/0.domain/utils/random'

type Options = {
  alphabet: string
  length: number
}

type ConstructParams = {
  id?: string
  options?: Options
}

const defaultOptions = {
  alphabet: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  length: 24
}

export class Identifier {
  private readonly props: Options
  private readonly random: Random
  private readonly _value: string

  constructor (params?: ConstructParams) {
    this.props = Object.assign(defaultOptions, params?.options)
    this.random = new Random()
    this._value = params?.id || this.create()
  }

  private create (): string {
    const { length } = this.props
    const id = Array
      .from({ length }, () => this.randomCharacter())
      .join('')

    return id
  }

  private randomCharacter (): string {
    const { alphabet } = this.props

    return alphabet[this.random.nextInt() % alphabet.length]
  }

  get value (): string {
    return this._value
  }
}
