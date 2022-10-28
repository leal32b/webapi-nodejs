import { EmailEntity } from '@/communication/0.domain/entities/email-entity'
import { EmailSender } from '@/communication/1.application/email/email-sender'
import { SendEmailValidationEmailData, SendEmailValidationEmailUseCase } from '@/communication/1.application/use-cases/send-email-validation-email-use-case'
import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, left, right } from '@/core/0.domain/utils/either'

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

const makeSendEmailValidationEmailDataFake = (): SendEmailValidationEmailData => ({
  recipientEmail: 'recipient@mail.com',
  token: 'any_token'
})

const makeEmailSenderStub = (): EmailSender => ({
  send: vi.fn(async (): Promise<Either<DomainError, void>> => right())
})

type SutTypes = {
  sut: SendEmailValidationEmailUseCase
  emailSender: EmailSender
  errorFake: DomainError
  sendEmailValidationEmailDataFake: SendEmailValidationEmailData
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    sendEmailValidationEmailDataFake: makeSendEmailValidationEmailDataFake()
  }
  const params = {
    emailSender: makeEmailSenderStub()
  }

  const sut = new SendEmailValidationEmailUseCase(params)

  return { sut, ...params, ...doubles }
}

describe('SendEmailValidationEmailUseCase', () => {
  describe('success', () => {
    it('calls EmailSender.send with correct param', async () => {
      const { sut, emailSender, sendEmailValidationEmailDataFake } = makeSut()

      await sut.execute(sendEmailValidationEmailDataFake)

      expect(emailSender.send).toHaveBeenCalledWith(expect.any(EmailEntity))
    })

    it('returns a message', async () => {
      const { sut, sendEmailValidationEmailDataFake } = makeSut()

      const result = await sut.execute(sendEmailValidationEmailDataFake)

      expect(result.value).toEqual({
        message: 'e-mail validation e-mail sent successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns an Error when EmailEntity.create fails', async () => {
      const { sut, sendEmailValidationEmailDataFake } = makeSut()

      const result = await sut.execute({
        ...sendEmailValidationEmailDataFake,
        recipientEmail: 'invalid_email'
      })

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns an Error when EmailSender.send fails', async () => {
      const { sut, emailSender, errorFake, sendEmailValidationEmailDataFake } = makeSut()
      vi.spyOn(emailSender, 'send').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(sendEmailValidationEmailDataFake)

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })
  })
})
