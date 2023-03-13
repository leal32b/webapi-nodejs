import { EmailEntity } from '@/communication/0.domain/entities/email-entity'
import { type EmailSender } from '@/communication/1.application/email/email-sender'
import { type SendEmailValidationEmailData, SendEmailValidationEmailUseCase } from '@/communication/1.application/use-cases/send-email-validation-email-use-case'
import { DomainError } from '@/core/0.domain/base/domain-error'
import { type Either, left, right } from '@/core/0.domain/utils/either'
import { type TemplateCompiler } from '@/core/1.application/compilers/template-compiler'

import { makeErrorFake } from '~/core/fakes/error-fake'

const makeSendEmailValidationEmailDataFake = (): SendEmailValidationEmailData => ({
  recipientEmail: 'recipient@mail.com',
  token: 'any_token'
})

const makeEmailSenderStub = (): EmailSender => ({
  send: vi.fn(async (): Promise<Either<DomainError, void>> => right())
})

const makeTemplateCompilerStub = (): TemplateCompiler => ({
  compile: vi.fn((): Either<DomainError, string> => right('<html>compiled_template</html>'))
})

type SutTypes = {
  sut: SendEmailValidationEmailUseCase
  emailSender: EmailSender
  templateCompiler: TemplateCompiler
  errorFake: DomainError
  sendEmailValidationEmailDataFake: SendEmailValidationEmailData
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    sendEmailValidationEmailDataFake: makeSendEmailValidationEmailDataFake()
  }
  const params = {
    emailSender: makeEmailSenderStub(),
    templateCompiler: makeTemplateCompilerStub()
  }

  const sut = SendEmailValidationEmailUseCase.create(params)

  return { sut, ...params, ...doubles }
}

describe('SendEmailValidationEmailUseCase', () => {
  describe('success', () => {
    it('calls TemplateCompiler.compile with correct param', async () => {
      const { sut, templateCompiler, sendEmailValidationEmailDataFake } = makeSut()

      await sut.execute(sendEmailValidationEmailDataFake)

      expect(templateCompiler.compile).toHaveBeenCalledWith(
        expect.stringContaining('templates/email-confirmation'),
        { token: expect.any(String) }
      )
    })

    it('calls EmailSender.send with correct param', async () => {
      const { sut, emailSender, sendEmailValidationEmailDataFake } = makeSut()

      await sut.execute(sendEmailValidationEmailDataFake)

      expect(emailSender.send).toHaveBeenCalledWith(expect.any(EmailEntity))
    })

    it('returns a message', async () => {
      const { sut, sendEmailValidationEmailDataFake } = makeSut()

      const result = await sut.execute(sendEmailValidationEmailDataFake)

      expect(result.value).toEqual({
        message: 'e-mail confirmation e-mail sent successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns an Error when TemplateCompiler.compile fails', async () => {
      const { sut, templateCompiler, errorFake, sendEmailValidationEmailDataFake } = makeSut()
      vi.spyOn(templateCompiler, 'compile').mockReturnValueOnce(left(errorFake))

      const result = await sut.execute(sendEmailValidationEmailDataFake)

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

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
