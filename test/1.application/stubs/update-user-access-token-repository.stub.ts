import UpdateUserAccessTokenRepository from '@/1.application/interfaces/update-user-access-token-repository'

export const makeUpdateUserAccessTokenRepositoryStub = (): UpdateUserAccessTokenRepository => {
  class UpdateUserAccessTokenRepositoryStub implements UpdateUserAccessTokenRepository {
    async update (id: string, accessToken: string): Promise<void> {}
  }

  return new UpdateUserAccessTokenRepositoryStub()
}
