import { InvalidEmailError } from '@/core/0.domain/errors/invalid-email-error'
import { Either, left, right } from '@/core/0.domain/utils/either'

type emailAddressType = {
  email: string
}

type EmailBuildResponse = Either<InvalidEmailError, EmailValidation>

export class EmailValidation {
  public email: string

  private constructor (props: emailAddressType) {
    this.email = props.email
  }

  public static isValidEmail (email: string): Either<InvalidEmailError, string> {
    const tester =
      /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

    if (!tester.test(email)) {
      return left(new InvalidEmailError('email', email))
    }

    const [account, address] = email.split('@')
    if (account.length < 3) {
      return left(new InvalidEmailError('email', email))
    }

    const domainParts = address.split('.')

    if (domainParts.some((part) => part.length > 63)) {
      return left(new InvalidEmailError('email', email))
    }

    return right(email)
  }

  public static build (props: emailAddressType): EmailBuildResponse {
    const emailOrError = this.isValidEmail(props.email)

    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }

    const Address = new EmailValidation({
      email: emailOrError.value
    })

    return right(Address)
  }
}
