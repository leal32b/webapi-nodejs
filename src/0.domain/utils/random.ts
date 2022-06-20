export default class Random {
  private readonly A_multiplier: number = 1103515245;
  private readonly C_incrementer: number = 12345;
  private readonly M_modules: number = 2147483647;

  constructor (private seed: number = Date.now()) {}

  nextInt = (): number => {
    this.seed = (this.seed * this.A_multiplier + this.C_incrementer) % this.M_modules

    return this.seed
  };

  nextDouble = (): number => {
    const value = this.nextInt()

    return value / this.M_modules
  };
}
