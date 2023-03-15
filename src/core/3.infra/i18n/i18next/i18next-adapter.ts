import i18next, { type Resource } from 'i18next'

import { type I18n } from '@/core/1.application/i18n/i18n'

export class I18nextAdapter implements I18n {
  private constructor (resources: Resource) {
    i18next.init({
      debug: false,
      lng: 'en',
      resources
    })
  }

  public static create (resources: Resource): I18nextAdapter {
    return new I18nextAdapter(resources)
  }

  public t (key: string, opt?: { lng: string }): string {
    return i18next.t(key, opt)
  }
}
