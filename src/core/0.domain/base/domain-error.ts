type ConstructParams = {
  message: string
  field?: string
  input?: any
  stack?: string
}

export abstract class DomainError {
  protected constructor (readonly props: ConstructParams) {}
}
