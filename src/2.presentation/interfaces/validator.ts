export default interface Validator {
  validate: (input: any) => Error
}
