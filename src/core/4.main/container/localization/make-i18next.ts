import { type Translator } from '@/core/1.application/localization/translator'
import { I18nextAdapter } from '@/core/3.infra/localization/i18next/i18next-adapter'
import { resources } from '@/core/4.main/container/localization/resources'

export const makeI18next: Translator = I18nextAdapter.create(resources)
