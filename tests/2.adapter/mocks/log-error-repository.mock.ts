import LogErrorRepository from '@/2.adapter/interfaces/log-error-repository'

export default class LogErrorRepositoryStub implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    return await Promise.resolve()
  }
}
