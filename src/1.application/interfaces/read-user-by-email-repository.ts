import User from '@/0.domain/entities/user'

export default interface ReadUserByEmailRepository {
  read: (email: string) => Promise<User>
}
