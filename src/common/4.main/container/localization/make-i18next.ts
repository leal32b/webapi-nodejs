import { type Translator } from '@/common/1.application/localization/translator'
import { I18nextAdapter } from '@/common/3.infra/localization/i18next/i18next.adapter'
import { resources } from '@/common/4.main/container/localization/resources'

export const makeI18next: Translator = I18nextAdapter.create(resources)
