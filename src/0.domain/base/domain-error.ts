type ConstructParams = {
  message: string
  field?: string
  input?: any
  stack?: string
}

export default abstract class DomainError {
  constructor (readonly props: ConstructParams) {}
}
