export default interface UpdateUserAccessTokenRepository {
  update: (id: string, accessToken: string) => Promise<void>
}
