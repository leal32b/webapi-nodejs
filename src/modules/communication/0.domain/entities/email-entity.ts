import { From } from '@/communication/0.domain/value-objects/from'
import { Html } from '@/communication/0.domain/value-objects/html'
import { Subject } from '@/communication/0.domain/value-objects/subject'
import { Text } from '@/communication/0.domain/value-objects/text'
import { To } from '@/communication/0.domain/value-objects/to'
import { DomainError } from '@/core/0.domain/base/domain-error'
import { Entity } from '@/core/0.domain/base/entity'
import { Either, left, right } from '@/core/0.domain/utils/either'

type ConstructParams = {
  from: From
  subject: Subject
  to: To
  html?: Html
  text?: Text
}

type EmailEntityBaseParams = {
  from: string
  subject: string
  to: string | string[]
}

export type EmailEntityCreateParams =
  EmailEntityBaseParams & { html: string, text?: never } |
  EmailEntityBaseParams & { html?: never, text: string }

export class EmailEntity extends Entity<ConstructParams> {
  public static create (params: EmailEntityCreateParams): Either<DomainError[], EmailEntity> {
    const { from, subject, to, html, text } = params

    const htmlOrText = html
      ? { html: Html.create(html) }
      : { text: Text.create(text) }

    const constructParamsOrError = this.validateParams<ConstructParams>({
      from: From.create(from),
      subject: Subject.create(subject),
      to: To.create(to),
      ...htmlOrText
    })

    if (constructParamsOrError.isLeft()) {
      return left(constructParamsOrError.value)
    }

    const constructParams = constructParamsOrError.value
    const emailEntity = new EmailEntity(constructParams)

    return right(emailEntity)
  }

  public get from (): From {
    return this.props.from
  }

  public get html (): Html {
    return this.props.html
  }

  public get subject (): Subject {
    return this.props.subject
  }

  public get text (): Text {
    return this.props.text
  }

  public get to (): To {
    return this.props.to
  }
}
