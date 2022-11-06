import { Random } from '@/core/0.domain/utils/random'

type Options = {
  alphabet: string
  length: number
}

type PropsType = {
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

  private constructor (props?: PropsType) {
    this.props = Object.assign(defaultOptions, props?.options)
    this._random = Random.create()
    this._value = props?.id || this.createId()
  }

  public static create (props?: PropsType): Identifier {
    return new Identifier(props)
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
