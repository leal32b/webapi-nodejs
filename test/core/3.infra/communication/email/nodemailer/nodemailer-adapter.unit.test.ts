import nodemailer from 'nodemailer'

import { EmailEntity } from '@/communication/0.domain/entities/email-entity'
import { DomainError } from '@/core/0.domain/base/domain-error'
import { getVar } from '@/core/0.domain/utils/var'
import { NodemailerAdapter } from '@/core/3.infra/communication/email/nodemailer/nodemailer-adapter'

vi.mock('nodemailer', () => ({
  default: {
    createTransport: () => ({
      sendMail: () => ({
        messageId: '<01ab23cd-45ef-01ab-23cd-45ef01ab23cd@mail.com>'
      })
    })
  }
}))

const makeEmailFake = (): EmailEntity => EmailEntity.create({
  from: 'sender@mail.com',
  html: '<p>any_text</p>',
  subject: 'any_subject',
  to: 'recipient@mail.com'
}).value as EmailEntity

type SutTypes = {
  sut: NodemailerAdapter
  emailFake: EmailEntity
}

const makeSut = (): SutTypes => {
  const emailFake = makeEmailFake()
  const sut = new NodemailerAdapter()

  return { emailFake, sut }
}

describe('NodemailerAdapter', () => {
  describe('success', () => {
    it('calls nodemailer.createTransport with correct params', async () => {
      const { sut, emailFake } = makeSut()
      const createTransportSpy = vi.spyOn(nodemailer, 'createTransport')

      await sut.send(emailFake)

      expect(createTransportSpy).toHaveBeenCalledWith({
        auth: {
          pass: getVar('EMAIL_PASSWORD'),
          user: getVar('EMAIL_USERNAME')
        },
        host: getVar('EMAIL_HOST'),
        port: parseInt(getVar('EMAIL_PORT'))
      })
    })

    it('calls nodemailer.sendMail with correct params', async () => {
      const { sut, emailFake } = makeSut()
      const sendMailMock = vi.fn()
      vi.spyOn(nodemailer, 'createTransport').mockImplementationOnce(() => ({
        sendMail: sendMailMock
      }) as any)

      await sut.send(emailFake)

      expect(sendMailMock).toHaveBeenCalledWith({
        from: 'sender@mail.com',
        html: '<p>any_text</p>',
        subject: 'any_subject',
        to: 'recipient@mail.com'
      })
    })

    it('returns Right on send when it succeeds', async () => {
      const { sut, emailFake } = makeSut()

      const result = await sut.send(emailFake)

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left when send throws', async () => {
      const { sut, emailFake } = makeSut()
      vi.spyOn(nodemailer, 'createTransport').mockImplementationOnce(vi.fn() as any)

      const result = await sut.send(emailFake)

      expect(result.isLeft()).toBe(true)
    })

    it('returns an error when send throws', async () => {
      const { sut, emailFake } = makeSut()
      vi.spyOn(nodemailer, 'createTransport').mockImplementationOnce(vi.fn() as any)

      const result = await sut.send(emailFake)

      expect(result.value).toBeInstanceOf(DomainError)
    })
  })
})
