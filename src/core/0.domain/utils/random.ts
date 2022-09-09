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
  private seed: number

  constructor (params?: ConstructParams) {
    this.props = Object.assign(defaultOptions, params?.options)
    this.seed = params?.seed || Date.now()
  }

  nextInt (): number {
    const { incrementer, modulus, multiplier } = this.props

    this.seed = (this.seed * multiplier + incrementer) % modulus

    return this.seed
  }

  nextDouble (): number {
    const { modulus } = this.props

    return this.nextInt() / modulus
  }
}
