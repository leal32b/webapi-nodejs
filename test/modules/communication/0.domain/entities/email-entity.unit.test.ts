import { DomainError } from '@/common/0.domain/base/domain-error'

import { EmailEntity, type EmailEntityProps } from '@/communication/0.domain/entities/email-entity'
import { From } from '@/communication/0.domain/value-objects/from'
import { Html } from '@/communication/0.domain/value-objects/html'
import { Subject } from '@/communication/0.domain/value-objects/subject'
import { Text } from '@/communication/0.domain/value-objects/text'
import { To } from '@/communication/0.domain/value-objects/to'

const makePropsFake = (): EmailEntityProps => ({
  from: 'sender@mail.com',
  subject: 'any_subject',
  text: 'any_text',
  to: 'recipient@email.com'
})

type SutTypes = {
  propsFake: EmailEntityProps
  sut: typeof EmailEntity
}

const makeSut = (): SutTypes => {
  const doubles = {
    propsFake: makePropsFake()
  }
  const sut = EmailEntity

  return {
    ...doubles,
    sut
  }
}

describe('EmailEntity', () => {
  describe('success', () => {
    it('returns an Email when props are valid', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect(result.value).toBeInstanceOf(EmailEntity)
    })

    it('returns an Email when props are valid and to is an array', () => {
      const { sut, propsFake } = makeSut()
      propsFake.to = ['recipient@email.com', 'another_recipient@email.com']

      const result = sut.create(propsFake)

      expect(result.value).toBeInstanceOf(EmailEntity)
    })

    it('gets from', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect((result.value as EmailEntity).from).toBeInstanceOf(From)
    })

    it('gets html', () => {
      const { sut, propsFake } = makeSut()
      propsFake.html = '<html>any_html</html>'

      const result = sut.create(propsFake)

      expect((result.value as EmailEntity).html).toBeInstanceOf(Html)
    })

    it('gets subject', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect((result.value as EmailEntity).subject).toBeInstanceOf(Subject)
    })

    it('gets text', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect((result.value as EmailEntity).text).toBeInstanceOf(Text)
    })

    it('gets to', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect((result.value as EmailEntity).to).toBeInstanceOf(To)
    })
  })

  describe('failure', () => {
    it('returns Left with an array of Errors when any prop is invalid', () => {
      const { sut, propsFake } = makeSut()
      const from = null

      const result = sut.create({ ...propsFake, from })

      expect(result.isLeft()).toBe(true)
      expect((result.value as DomainError[])
        .every(item => item instanceof DomainError)).toBe(true)
    })

    it('returns an Error for each prop validation that fails', () => {
      const { sut, propsFake } = makeSut()
      const from = null
      const subject = null

      const result = sut.create({ ...propsFake, from, subject })

      expect((result.value as DomainError[]).map(error => error.props.field)).toEqual(
        expect.arrayContaining(['From', 'Subject'])
      )
    })
  })
})
