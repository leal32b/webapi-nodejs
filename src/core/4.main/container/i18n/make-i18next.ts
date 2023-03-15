import { type I18n } from '@/core/1.application/i18n/i18n'
import { I18nextAdapter } from '@/core/3.infra/i18n/i18next/i18next-adapter'
import { resources } from '@/core/4.main/container/i18n/resources'

export const makeI18next: I18n = I18nextAdapter.create(resources)
