import { EmailEntity } from '@/communication/0.domain/entities/email-entity'
import { type EmailSender } from '@/communication/1.application/email/email-sender'
import { type SendEmailConfirmationEmailData, SendEmailConfirmationEmailUseCase } from '@/communication/1.application/use-cases/send-email-confirmation-email-use-case'
import { DomainError } from '@/core/0.domain/base/domain-error'
import { type Either, left, right } from '@/core/0.domain/utils/either'
import { type TemplateCompiler } from '@/core/1.application/compilers/template-compiler'

import { makeErrorFake } from '~/core/_doubles/fakes/error-fake'

const makeSendEmailConfirmationEmailDataFake = (): SendEmailConfirmationEmailData => ({
  locale: 'en',
  recipientEmail: 'recipient@mail.com',
  token: 'any_token'
})

const makeEmailSenderStub = (): EmailSender => ({
  send: vi.fn(async (): Promise<Either<DomainError, void>> => right())
})

const makeTemplateCompilerStub = (): TemplateCompiler => ({
  compile: vi.fn((): Either<DomainError, string> => right('<html>compiled_template</html>')),
  registerHelper: vi.fn((): Either<DomainError, void> => right())
})

type SutTypes = {
  sut: SendEmailConfirmationEmailUseCase
  emailSender: EmailSender
  templateCompiler: TemplateCompiler
  errorFake: DomainError
  sendEmailConfirmationEmailDataFake: SendEmailConfirmationEmailData
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    sendEmailConfirmationEmailDataFake: makeSendEmailConfirmationEmailDataFake()
  }
  const props = {
    emailSender: makeEmailSenderStub(),
    templateCompiler: makeTemplateCompilerStub()
  }

  const sut = SendEmailConfirmationEmailUseCase.create(props)

  return { sut, ...props, ...doubles }
}

describe('SendEmailConfirmationEmailUseCase', () => {
  describe('success', () => {
    it('calls TemplateCompiler.compile with correct param', async () => {
      const { sut, templateCompiler, sendEmailConfirmationEmailDataFake } = makeSut()

      await sut.execute(sendEmailConfirmationEmailDataFake)

      expect(templateCompiler.compile).toHaveBeenCalledWith(expect.stringContaining('templates/email-confirmation'), {
        link: expect.stringContaining('any_token'),
        lng: 'en'
      })
    })

    it('calls EmailSender.send with correct param', async () => {
      const { sut, emailSender, sendEmailConfirmationEmailDataFake } = makeSut()

      await sut.execute(sendEmailConfirmationEmailDataFake)

      expect(emailSender.send).toHaveBeenCalledWith(expect.any(EmailEntity))
    })

    it('returns a message', async () => {
      const { sut, sendEmailConfirmationEmailDataFake } = makeSut()

      const result = await sut.execute(sendEmailConfirmationEmailDataFake)

      expect(result.value).toEqual({
        message: 'e-mail confirmation e-mail sent successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns an Error when TemplateCompiler.compile fails', async () => {
      const { sut, templateCompiler, errorFake, sendEmailConfirmationEmailDataFake } = makeSut()
      vi.spyOn(templateCompiler, 'compile').mockReturnValueOnce(left(errorFake))

      const result = await sut.execute(sendEmailConfirmationEmailDataFake)

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns an Error when EmailEntity.create fails', async () => {
      const { sut, sendEmailConfirmationEmailDataFake } = makeSut()

      const result = await sut.execute({
        ...sendEmailConfirmationEmailDataFake,
        recipientEmail: 'invalid_email'
      })

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns an Error when EmailSender.send fails', async () => {
      const { sut, emailSender, errorFake, sendEmailConfirmationEmailDataFake } = makeSut()
      vi.spyOn(emailSender, 'send').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(sendEmailConfirmationEmailDataFake)

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })
  })
})
