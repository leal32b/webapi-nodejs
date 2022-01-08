export default interface Usecase<Input, Output> {
  execute: (input: Input) => Promise<Output>
}
