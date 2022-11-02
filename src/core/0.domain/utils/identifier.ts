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
  alphabet: '0123456789abcdef',
  length: 24
}

export class Identifier {
  private readonly _random: Random
  private readonly _value: string
  private readonly props: Options

  private constructor (params?: ConstructParams) {
    this.props = Object.assign(defaultOptions, params?.options)
    this._random = Random.create()
    this._value = params?.id || this.createId()
  }

  public static create (params?: ConstructParams): Identifier {
    return new Identifier(params)
  }

  public get value (): string {
    return this._value
  }

  private createId (): string {
    const { length } = this.props
    const id = Array
      .from({ length }, () => this.randomCharacter())
      .join('')

    return id
  }

  private randomCharacter (): string {
    const { alphabet } = this.props

    return alphabet[this._random.nextInt() % alphabet.length]
  }
}
