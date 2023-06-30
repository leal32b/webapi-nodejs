import { type DomainError } from '@/common/0.domain/base/domain-error'
import { Entity } from '@/common/0.domain/base/entity'
import { type Either } from '@/common/0.domain/utils/either'

import { EmailFrom } from '@/communication/0.domain/value-objects/email.from'
import { EmailHtml } from '@/communication/0.domain/value-objects/email.html'
import { EmailSubject } from '@/communication/0.domain/value-objects/email.subject'
import { EmailText } from '@/communication/0.domain/value-objects/email.text'
import { EmailTo } from '@/communication/0.domain/value-objects/email.to'

type Props = {
  from: EmailFrom
  subject: EmailSubject
  to: EmailTo
  html?: EmailHtml
  text?: EmailText
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
      ? { html: EmailHtml.create(html) }
      : { text: EmailText.create(text) }

    const validPropsOrError = this.validateProps<Props>({
      from: EmailFrom.create(from),
      subject: EmailSubject.create(subject),
      to: EmailTo.create(to),
      ...htmlOrText
    })

    return validPropsOrError.applyOnRight(props => {
      return new EmailEntity(props)
    })
  }

  public get from (): EmailFrom {
    return this.props.from
  }

  public get html (): EmailHtml {
    return this.props.html
  }

  public get subject (): EmailSubject {
    return this.props.subject
  }

  public get text (): EmailText {
    return this.props.text
  }

  public get to (): EmailTo {
    return this.props.to
  }
}
