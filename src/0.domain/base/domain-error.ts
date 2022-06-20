type ConstructParams = {
  message: string
  error?: any
  field?: string
  input?: any
}

export default abstract class DomainError {
  constructor (readonly props: ConstructParams) {}
}
