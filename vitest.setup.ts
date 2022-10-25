import mongodbSetup from '@shelf/jest-mongodb/lib/setup'
import mongodbTeardown from '@shelf/jest-mongodb/lib/teardown'

export const setup = async (): Promise<void>=>  {
  await (mongodbSetup as Function)()
}

export const teardown = async (): Promise<void>=>  {
  await (mongodbTeardown as Function)()
}
