import { UserAggregate } from '@/identity/0.domain/aggregates/user-aggregate'

import { makeUserEntityFake } from '~/identity/_doubles/user-entity-fake'

export const makeUserAggregateFake = (): UserAggregate => UserAggregate.create(
  makeUserEntityFake()
)
