import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity({ name: 'user' })
export class PostgresUserEntity {
  @PrimaryColumn({ type: 'text' })
    id: string

  @Column({ type: 'text', unique: true })
    email: string

  @Column({ type: 'boolean' })
    emailConfirmed: boolean

  @Column({ type: 'text' })
    locale: string

  @Column({ type: 'text' })
    name: string

  @Column({ type: 'text' })
    password: string

  @Column({ type: 'text' })
    token: string

  @Column({ type: 'timestamp' })
    createdAt: Date

  @Column({ type: 'timestamp' })
    updatedAt: Date
}
