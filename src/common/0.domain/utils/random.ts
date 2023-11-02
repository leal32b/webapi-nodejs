type Options = {
  incrementor: number
  modulus: number
  multiplier: number
}

type PropsType = {
  options?: Options
  seed?: number
}

const defaultOptions = {
  incrementor: 2971215073,
  modulus: 2282047327510,
  multiplier: 456409465503
}

export class Random {
  private _seed: number
  private readonly props: Options

  private constructor (props?: PropsType) {
    this.props = Object.assign(defaultOptions, props?.options)
    this._seed = props?.seed || Date.now() + performance.now()
  }

  public static create (props?: PropsType): Random {
    return new Random(props)
  }

  public nextInt (): number {
    const { incrementor, modulus, multiplier } = this.props

    this._seed = (this._seed * multiplier + incrementor) % modulus

    return this._seed
  }
}
