export default interface EmailValidator {
  isValid: (email: string) => boolean
}
