export default class User {
  constructor (readonly props: {
    id: string
    name: string
    email: string
    password: string
  }) {}
}
