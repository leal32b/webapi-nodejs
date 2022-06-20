export default class Random {
  private readonly A_MULTIPLIER: number = 1103515245;
  private readonly C_INCREMENTER: number = 12345;
  private readonly M_MODULES: number = 2147483647;

  constructor (private seed: number = Date.now()) {}

  nextInt = (): number => {
    this.seed = (this.seed * this.A_MULTIPLIER + this.C_INCREMENTER) % this.M_MODULES

    return this.seed
  };

  nextDouble = (): number => {
    const value = this.nextInt()

    return value / this.M_MODULES
  };
}
