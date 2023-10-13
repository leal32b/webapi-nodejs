import { DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { type TemplateCompiler } from '@/common/1.application/compilation/template-compiler'

import { EmailEntity } from '@/communication/0.domain/entities/email.entity'
import { type EmailSender } from '@/communication/1.application/email/email-sender'
import { type SendEmailConfirmationData, SendEmailConfirmationUseCase } from '@/communication/1.application/use-cases/send-email-confirmation.use-case'

import { makeErrorFake } from '~/common/_doubles/fakes/error.fake'

const makeSendEmailConfirmationDataFake = (): SendEmailConfirmationData => ({
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
  errorFake: DomainError
  sendEmailConfirmationDataFake: SendEmailConfirmationData
  emailSender: EmailSender
  templateCompiler: TemplateCompiler
  sut: SendEmailConfirmationUseCase
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    sendEmailConfirmationDataFake: makeSendEmailConfirmationDataFake()
  }
  const props = {
    emailSender: makeEmailSenderStub(),
    templateCompiler: makeTemplateCompilerStub()
  }

  const sut = SendEmailConfirmationUseCase.create(props)

  return {
    ...doubles,
    ...props,
    sut
  }
}

describe('SendEmailConfirmationUseCase', () => {
  describe('success', () => {
    it('calls TemplateCompiler.compile with correct params', async () => {
      const { sut, templateCompiler, sendEmailConfirmationDataFake } = makeSut()

      await sut.execute(sendEmailConfirmationDataFake)

      expect(templateCompiler.compile).toHaveBeenCalledWith(expect.stringContaining('templates/email-confirmation'), {
        link: expect.stringContaining('any_token'),
        lng: 'en'
      })
    })

    it('calls EmailSender.send with correct params', async () => {
      const { sut, emailSender, sendEmailConfirmationDataFake } = makeSut()

      await sut.execute(sendEmailConfirmationDataFake)

      expect(emailSender.send).toHaveBeenCalledWith(expect.any(EmailEntity))
    })

    it('returns Right with message when execute succeeds', async () => {
      const { sut, sendEmailConfirmationDataFake } = makeSut()

      const result = await sut.execute(sendEmailConfirmationDataFake)

      expect(result.isRight()).toBe(true)
      expect(result.value).toEqual({
        message: 'e-mail confirmation e-mail sent successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns Left with Error when TemplateCompiler.compile fails', async () => {
      const { sut, templateCompiler, errorFake, sendEmailConfirmationDataFake } = makeSut()
      vi.spyOn(templateCompiler, 'compile').mockReturnValueOnce(left(errorFake))

      const result = await sut.execute(sendEmailConfirmationDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with Error when EmailEntity.create fails', async () => {
      const { sut, sendEmailConfirmationDataFake } = makeSut()

      const result = await sut.execute({
        ...sendEmailConfirmationDataFake,
        recipientEmail: 'invalid_email'
      })

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with Error when EmailSender.send fails', async () => {
      const { sut, emailSender, errorFake, sendEmailConfirmationDataFake } = makeSut()
      vi.spyOn(emailSender, 'send').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(sendEmailConfirmationDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })
  })
})
