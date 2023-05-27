export abstract class Handler<PropsType> {
  protected constructor (protected readonly props: PropsType) {}
}
