export default interface UseCase<Input, Output> {
  execute: (input: Input) => Promise<Output>
}
