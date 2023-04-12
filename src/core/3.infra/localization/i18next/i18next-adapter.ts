import i18next, { type Resource } from 'i18next'

import { type Translator } from '@/core/1.application/localization/translator'

export class I18nextAdapter implements Translator {
  private constructor (resources: Resource) {
    i18next.init({
      debug: false,
      fallbackLng: 'en',
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
