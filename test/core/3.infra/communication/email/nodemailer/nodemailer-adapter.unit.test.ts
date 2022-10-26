import nodemailer from 'nodemailer'

import { EmailEntity } from '@/communication/0.domain/entities/email-entity'
import { DomainError } from '@/core/0.domain/base/domain-error'
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
  to: 'recipient@mail.com',
  subject: 'any_subject',
  html: '<p>any_text</p>'
}).value as EmailEntity

type SutTypes = {
  sut: NodemailerAdapter
  emailFake: EmailEntity
}

const makeSut = (): SutTypes => {
  const emailFake = makeEmailFake()
  const sut = new NodemailerAdapter()

  return { sut, emailFake }
}

describe('NodemailerAdapter', () => {
  describe('success', () => {
    it('calls nodemailer.createTransport with correct params', async () => {
      const { sut, emailFake } = makeSut()
      const createTransportSpy = vi.spyOn(nodemailer, 'createTransport')

      await sut.send(emailFake)

      expect(createTransportSpy).toHaveBeenCalledWith({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
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
        to: 'recipient@mail.com',
        subject: 'any_subject',
        html: '<p>any_text</p>'
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
