type Options = {
  incrementer: number
  modulus: number
  multiplier: number
}

type ConstructParams = {
  seed?: number
  options?: Options
}

const defaultOptions = {
  incrementer: 2971215073,
  modulus: 2282047327510,
  multiplier: 456409465503
}

export class Random {
  private readonly props: Options
  private _seed: number

  private constructor (params?: ConstructParams) {
    this.props = Object.assign(defaultOptions, params?.options)
    this._seed = params?.seed || Date.now()
  }

  public static create (params?: ConstructParams): Random {
    return new Random(params)
  }

  nextInt (): number {
    const { incrementer, modulus, multiplier } = this.props

    this._seed = (this._seed * multiplier + incrementer) % modulus

    return this._seed
  }

  nextDouble (): number {
    const { modulus } = this.props

    return this.nextInt() / modulus
  }
}
