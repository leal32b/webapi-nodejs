import { type Topic } from '@/core/1.application/types/topic'

export type Queue = {
  name: string
  key: string[]
  topics: Topic[]
}
