import { DomainError } from '@/common/0.domain/base/domain-error'

import { EmailEntity, type EmailEntityProps } from '@/communication/0.domain/entities/email-entity'
import { From } from '@/communication/0.domain/value-objects/from'
import { Html } from '@/communication/0.domain/value-objects/html'
import { Subject } from '@/communication/0.domain/value-objects/subject'
import { Text } from '@/communication/0.domain/value-objects/text'
import { To } from '@/communication/0.domain/value-objects/to'

const makeParamsFake = (): EmailEntityProps => ({
  from: 'sender@mail.com',
  subject: 'any_subject',
  text: 'any_text',
  to: 'recipient@email.com'
})

type SutTypes = {
  sut: typeof EmailEntity
  paramsFake: EmailEntityProps
}

const makeSut = (): SutTypes => {
  const doubles = {
    paramsFake: makeParamsFake()
  }
  const sut = EmailEntity

  return { sut, ...doubles }
}

describe('EmailEntity', () => {
  describe('success', () => {
    it('returns an Email when params are valid', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect(result.value).toBeInstanceOf(EmailEntity)
    })

    it('returns an Email when params are valid and to is an array', () => {
      const { sut, paramsFake } = makeSut()
      paramsFake.to = ['recipient@email.com', 'another_recipient@email.com']

      const result = sut.create(paramsFake)

      expect(result.value).toBeInstanceOf(EmailEntity)
    })

    it('gets from', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect((result.value as EmailEntity).from).toBeInstanceOf(From)
    })

    it('gets html', () => {
      const { sut, paramsFake } = makeSut()
      paramsFake.html = '<html>any_html</html>'

      const result = sut.create(paramsFake)

      expect((result.value as EmailEntity).html).toBeInstanceOf(Html)
    })

    it('gets subject', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect((result.value as EmailEntity).subject).toBeInstanceOf(Subject)
    })

    it('gets text', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect((result.value as EmailEntity).text).toBeInstanceOf(Text)
    })

    it('gets to', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect((result.value as EmailEntity).to).toBeInstanceOf(To)
    })
  })

  describe('failure', () => {
    it('returns Left with an array of Errors when any param is invalid', () => {
      const { sut, paramsFake } = makeSut()
      const from = null

      const result = sut.create({ ...paramsFake, from })

      expect(result.isLeft()).toBe(true)
      expect((result.value as DomainError[])
        .every(item => item instanceof DomainError)).toBe(true)
    })

    it('returns an Error for each param validation that fails', () => {
      const { sut, paramsFake } = makeSut()
      const from = null
      const subject = null

      const result = sut.create({ ...paramsFake, from, subject })

      expect((result.value as DomainError[]).map(error => error.props.field)).toEqual(
        expect.arrayContaining(['From', 'Subject'])
      )
    })
  })
})
