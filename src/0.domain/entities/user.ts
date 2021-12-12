export default class User {
  constructor (
    readonly props: {
      readonly id: string
      readonly name: string
      readonly email: string
      readonly password: string
    }
  ) {}
}
