import mongodbSetup from '@shelf/jest-mongodb/lib/setup'
import mongodbTeardown from '@shelf/jest-mongodb/lib/teardown'

const globalConfigPath = './globalConfig.json'
const mongodbConfig = { rootDir: '.' }

export const setup = async (): Promise<void>=>  {
  await (mongodbSetup as Function)(mongodbConfig)
  const globalConfig = await import(globalConfigPath);
  process.env['MONGO_URI'] = globalConfig.mongoUri
}

export const teardown = async (): Promise<void>=>  {
  await (mongodbTeardown as Function)(mongodbConfig)
}
