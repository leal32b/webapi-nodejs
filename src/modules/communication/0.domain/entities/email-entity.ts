import { type DomainError } from '@/common/0.domain/base/domain-error'
import { Entity } from '@/common/0.domain/base/entity'
import { type Either } from '@/common/0.domain/utils/either'

import { From } from '@/communication/0.domain/value-objects/from'
import { Html } from '@/communication/0.domain/value-objects/html'
import { Subject } from '@/communication/0.domain/value-objects/subject'
import { Text } from '@/communication/0.domain/value-objects/text'
import { To } from '@/communication/0.domain/value-objects/to'

type Props = {
  from: From
  subject: Subject
  to: To
  html?: Html
  text?: Text
}

type EmailEntityBaseProps = {
  from: string
  subject: string
  to: string | string[]
}

export type EmailEntityProps =
  EmailEntityBaseProps & { html: string, text?: never } |
  EmailEntityBaseProps & { html?: never, text: string }

export class EmailEntity extends Entity<Props> {
  public static create (props: EmailEntityProps): Either<DomainError[], EmailEntity> {
    const { from, subject, to, html, text } = props

    const htmlOrText = html
      ? { html: Html.create(html) }
      : { text: Text.create(text) }

    const validPropsOrError = this.validateProps<Props>({
      from: From.create(from),
      subject: Subject.create(subject),
      to: To.create(to),
      ...htmlOrText
    })

    return validPropsOrError.applyOnRight(props => {
      return new EmailEntity(props)
    })
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
