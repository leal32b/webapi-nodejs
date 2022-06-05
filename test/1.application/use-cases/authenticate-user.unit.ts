import HashComparer from '@/1.application/interfaces/hash-comparer'
import ReadUserByEmailRepository from '@/1.application/interfaces/read-user-by-email-repository'
import TokenGenerator from '@/1.application/interfaces/token-generator'
import UpdateUserAccessTokenRepository from '@/1.application/interfaces/update-user-access-token-repository'
import { AuthenticationData } from '@/1.application/types/authentication-data'
import AuthenticateUserUseCase from '@/1.application/use-cases/authenticate-user'
import { makeHashComparerStub } from '~/1.application/stubs/makeHashComparer.stub'
import { makeReadUserByEmailRepositoryStub } from '~/1.application/stubs/read-user-by-email-repository.stub'
import { makeTokenGeneratorStub } from '~/1.application/stubs/token-generator.stub'
import { makeUpdateUserAccessTokenRepositoryStub } from '~/1.application/stubs/update-user-access-token-repository.stub'

const makeFakeAuthenticationData = (): AuthenticationData => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

type SutTypes = {
  sut: AuthenticateUserUseCase
  readUserByEmailRepository: ReadUserByEmailRepository
  hashComparer: HashComparer
  tokenGenerator: TokenGenerator
  updateUserAccessTokenRepository: UpdateUserAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const injection = {
    readUserByEmailRepository: makeReadUserByEmailRepositoryStub(),
    hashComparer: makeHashComparerStub(),
    tokenGenerator: makeTokenGeneratorStub(),
    updateUserAccessTokenRepository: makeUpdateUserAccessTokenRepositoryStub()
  }
  const sut = new AuthenticateUserUseCase(injection)

  return { sut, ...injection }
}

describe('ComponentName', () => {
  describe('failure', () => {
    it('should throw if ReadUserByEmailRepository throws', async () => {
      const { sut, readUserByEmailRepository } = makeSut()
      jest.spyOn(readUserByEmailRepository, 'read').mockRejectedValueOnce(new Error())
      const error = sut.execute(makeFakeAuthenticationData())

      await expect(error).rejects.toThrow()
    })

    it('should return null if ReadUserByEmailRepository returns null', async () => {
      const { sut, readUserByEmailRepository } = makeSut()
      jest.spyOn(readUserByEmailRepository, 'read').mockReturnValueOnce(null)
      const accessToken = await sut.execute(makeFakeAuthenticationData())

      expect(accessToken).toBeNull()
    })

    it('should throw if HashComparer throws', async () => {
      const { sut, hashComparer } = makeSut()
      jest.spyOn(hashComparer, 'compare').mockRejectedValueOnce(new Error())
      const error = sut.execute(makeFakeAuthenticationData())

      await expect(error).rejects.toThrow()
    })

    it('should return null if HashComparer returns false', async () => {
      const { sut, hashComparer } = makeSut()
      jest.spyOn(hashComparer, 'compare').mockResolvedValueOnce(false)
      const accessToken = await sut.execute(makeFakeAuthenticationData())

      expect(accessToken).toBeNull()
    })

    it('should throw if TokenGenerator throws', async () => {
      const { sut, tokenGenerator } = makeSut()
      jest.spyOn(tokenGenerator, 'generate').mockRejectedValueOnce(new Error())
      const error = sut.execute(makeFakeAuthenticationData())

      await expect(error).rejects.toThrow()
    })

    it('should throw if UpdateUserAccessTokenRepository throws', async () => {
      const { sut, updateUserAccessTokenRepository } = makeSut()
      jest.spyOn(updateUserAccessTokenRepository, 'update').mockRejectedValueOnce(new Error())
      const error = sut.execute(makeFakeAuthenticationData())

      await expect(error).rejects.toThrow()
    })
  })

  describe('success', () => {
    it('should call ReadUserByEmailRepository with correct email', async () => {
      const { sut, readUserByEmailRepository } = makeSut()
      const readSpy = jest.spyOn(readUserByEmailRepository, 'read')
      const fakeAuthenticationData = makeFakeAuthenticationData()
      await sut.execute(fakeAuthenticationData)

      expect(readSpy).toHaveBeenCalledWith(fakeAuthenticationData.email)
    })

    it('should call HashComparer with correct values', async () => {
      const { sut, hashComparer } = makeSut()
      const compareSpy = jest.spyOn(hashComparer, 'compare')
      await sut.execute(makeFakeAuthenticationData())

      expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
    })

    it('should call TokenGenerator with correct id', async () => {
      const { sut, tokenGenerator } = makeSut()
      const generateSpy = jest.spyOn(tokenGenerator, 'generate')
      await sut.execute(makeFakeAuthenticationData())

      expect(generateSpy).toHaveBeenCalledWith('any_id')
    })

    it('should call UpdateUserAccessTokenRepository with correct values', async () => {
      const { sut, updateUserAccessTokenRepository } = makeSut()
      const updateSpy = jest.spyOn(updateUserAccessTokenRepository, 'update')
      await sut.execute(makeFakeAuthenticationData())

      expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
    })

    it('should return an accessToken on success', async () => {
      const { sut } = makeSut()
      const accessToken = await sut.execute(makeFakeAuthenticationData())

      expect(accessToken).toBe('any_token')
    })
  })
})
